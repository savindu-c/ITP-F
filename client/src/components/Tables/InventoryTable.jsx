import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { FiRefreshCcw, FiFilter } from "react-icons/fi";
import axios from "axios";

function InventoryTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState({
    name: "",
    budget: "",
    unitofmeasure: "",
    quantity: "",
    date: "",
    payee: "",
    description: "",
    stock: "",
    minStock: "",
  });

  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    name: "",
    stock: "",
  });
  const [itemNameList, setItemNameList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/inventory/itemtable", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filter),
        });

        const itemData = await res.json();
        setItems(itemData);
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filter]);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const res = await fetch("/api/inventory/itemnames");
        const data = await res.json();
        setItemNameList(data);
      } catch (error) {
        setError("An error occurred while fetching names");
        console.error("Error fetching names:", error);
      }
    };

    fetchNames();
  }, []);

  const handleChange = (e) => {
    setFilter({
      ...filter,
      [e.target.id]: e.target.value,
    });
  };

  const resetFilter = () => {
    setFilter({
      name: "",
      stock: "",
    });
  };

  const handleEdit = (item) => {
    setSelectedMaterial(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/inventory/deleteitem/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let stockChange;

      if (selectedMaterial.quantity >= selectedMaterial.minStock) {
        stockChange = "available";
      } else if (
        selectedMaterial.quantity < selectedMaterial.minStock &&
        selectedMaterial.quantity > 0
      ) {
        stockChange = "low stock";
      } else {
        stockChange = "unavailable";
      }

      console.log(
        "minStock > quantity",
        selectedMaterial.minStock > selectedMaterial.quantity
      );

      const res = await axios.patch(
        `/api/inventory/updateitem/${selectedMaterial._id}`,
        {
          name: selectedMaterial.name,
          budget: selectedMaterial.budget,
          unitofmeasure: selectedMaterial.unitofmeasure,
          quantity: selectedMaterial.quantity,
          payee: selectedMaterial.payee,
          date: selectedMaterial.date,
          description: selectedMaterial.description,
          stock: stockChange,
          minStock: selectedMaterial.minStock,
        }
      );

      const data = res.data;
      if (data.success) {
        // Update items state with the updated item
        const updatedItems = items.map((item) =>
          item._id === selectedMaterial._id ? data.data : item
        );
        setItems(updatedItems);

        // Check if quantity is below minStock and send email
        if (selectedMaterial.quantity < selectedMaterial.minStock) {
          console.log("Sending email...");
          try {
            const emailRes = await axios.post("/api/sendemail", {
              recipientEmail: "tehannim@gmail.com", // recipient email
              itemName: selectedMaterial.name,
              currentQuantity: selectedMaterial.quantity,
              minStockLevel: selectedMaterial.minStock,
            });
            console.log("Email sent successfully:", emailRes.data);
          } catch (error) {
            console.error("Error sending email:", error);
            // Handle email sending error if necessary
          }
        } else {
          console.log(
            "Quantity is not below minStock:",
            selectedMaterial.quantity,
            selectedMaterial.minStock
          );
        }

        setShowForm(false); // Close the form modal after successful update
      } else {
        setError("Failed to update item. Please try again.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      setError("Error updating item. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const getStockColor = (stock) => {
    switch (stock) {
      case "available":
        return "rgb(74, 223, 74)";
      case "unavailable":
        return "rgb(211, 88, 88)";
      case "low stock":
        return "rgb(223, 173, 74)";
      case "service":
        return "rgb(229, 212, 101)";
      case "rented":
        return "rgb(233, 140, 19)";
      default:
        return "transparent";
    }
  };

  return (
    <div>
      <div className="filter">
        <span>
          <FiFilter />
        </span>
        <span>Filter By</span>
        <select id="name" value={filter.name} onChange={handleChange}>
          <option value="">Select Item Name</option>
          {itemNameList.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select id="stock" value={filter.stock} onChange={handleChange}>
          <option value="">Stock</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="low stock">Low Stock</option>
          <option value="service">Service</option>{" "}
        </select>
        <button type="button" onClick={resetFilter}>
          <FiRefreshCcw />
          Reset Filter
        </button>
      </div>
      {items.length > 0 ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Stock</th>
                <th className="action">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{"000" + item.itemid}</td>
                  <td>{item.name}</td>
                  <td>{`${item.quantity} ${item.unitofmeasure}`}</td>
                  <td>
                    <p
                      style={{ backgroundColor: getStockColor(item.stock) }}
                      className="stockitem"
                    >
                      {item.stock}
                    </p>
                  </td>
                  <td>
                    <button type="button" onClick={() => handleEdit(item)}>
                      <MdEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>{error || "No items found"}</p>
      )}
      {showForm && (
        <div className="formContainer fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="max-w-3xl w-full bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Update Item Details
              </h3>

              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 ms-auto inline-flex justify-center items-center closebtn"
                onClick={closeForm}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              {/* {error && (
                <p className="error col-span-2 text-sm mt-1 mb-2 text-red-600">
                  {error}
                </p>
              )} */}
              {selectedMaterial && (
                <>
                  <div className="form-group ">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Item Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={selectedMaterial.name || ""}
                      onChange={(e) =>
                        setSelectedMaterial({
                          ...selectedMaterial,
                          name: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 w-full"
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Quantity:
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      required
                      value={selectedMaterial.quantity || ""}
                      onChange={(e) =>
                        setSelectedMaterial({
                          ...selectedMaterial,
                          quantity: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 w-full"
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="minStock"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Min Stock:
                    </label>
                    <input
                      type="number"
                      id="minStock"
                      name="minStock"
                      value={selectedMaterial.minStock || ""}
                      onChange={(e) =>
                        setSelectedMaterial({
                          ...selectedMaterial,
                          minStock: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 w-full"
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="budget"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Budget:
                    </label>
                    <input
                      type="text"
                      id="budget"
                      name="budget"
                      value={selectedMaterial.budget || ""}
                      onChange={(e) =>
                        setSelectedMaterial({
                          ...selectedMaterial,
                          budget: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 w-full"
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="unitofmeasure"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Unit of Measure:
                    </label>
                    <select
                      id="unitofmeasure"
                      name="unitofmeasure"
                      value={selectedMaterial.unitofmeasure || ""}
                      onChange={(e) =>
                        setSelectedMaterial({
                          ...selectedMaterial,
                          unitofmeasure: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 w-full rounded-md"
                      style={{ maxWidth: "65%" }}
                    >
                      <option value="">Select unit...</option>
                      <option value="kg">Kilogram</option>
                      <option value="m3">Meter Cube</option>
                      <option value="l">Liters</option>
                      <option value="packs">Packets</option>
                      <option value="blocks">Blocks</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Stock :
                    </label>
                    <select
                      id="stock"
                      name="stock"
                      required
                      value={selectedMaterial.stock || ""}
                      onChange={(e) =>
                        setSelectedMaterial({
                          ...selectedMaterial,
                          stock: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 w-full rounded-md"
                      style={{ maxWidth: "65%" }}
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                      <option value="low stock">LowStock</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="payee"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Payee:
                    </label>
                    <input
                      type="text"
                      id="payee"
                      name="payee"
                      value={selectedMaterial.payee || ""}
                      onChange={(e) =>
                        setSelectedMaterial({
                          ...selectedMaterial,
                          payee: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 w-full"
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date:
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={selectedMaterial.date || ""}
                      onChange={(e) =>
                        setSelectedMaterial({
                          ...selectedMaterial,
                          date: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 w-full rounded-md"
                      style={{ maxWidth: "65%" }}
                    />
                  </div>
                  <div className="form-group col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description:
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={selectedMaterial.description || ""}
                      onChange={(e) =>
                        setSelectedMaterial({
                          ...selectedMaterial,
                          description: e.target.value,
                        })
                      }
                      className="border border-gray-300 ml-2 p-2 w-full h-24 resize-none"
                    />
                  </div>

                  <div className="form-group col-span-2">
                    <button
                      disabled={loading}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                      type="submit"
                    >
                      {loading ? "Wait..." : "Update Item"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryTable;
