import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
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
  });

  let datafetchGloable;

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

    datafetchGloable = fetchData;
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
    console.log(selectedMaterial);
    try {
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
          stock: selectedMaterial.stock,
        }
      );
      const data = res.data;

      if (data.data) {
        // Update UI state immediately with the updated data
        const updatedItems = items.map((item) =>
          item._id === selectedMaterial._id ? data.data : item
        );
        setItems(updatedItems);
        setShowForm(false);
        return;
      }

      setError(data.message);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating item:", error);
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
        return "rgb(223, 173, 74)";
      case "low stock":
        return "rgb(211, 88, 88)";
      case "service":
        return "rgb(229, 212, 101)";
      case "rented":
        return "rgb(233, 140, 19)";
      default:
        return "transparent"; // Default color if stock value doesn't match any condition
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
                <th>Action</th>
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
        <div className="formContainer">
          <form className="form" onSubmit={handleSubmit}>
            <button type="button" className="closebtn" onClick={closeForm}>
              x
            </button>
            {error && <p className="error">{error}</p>}
            {selectedMaterial && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Item Name:</label>
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
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity:</label>
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
                  />
                </div>
                {/* Include other fields similarly */}
                <div className="form-group">
                  <label htmlFor="budget">Budget:</label>
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
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="unitofmeasure">Unit of Measure:</label>
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
                  <label htmlFor="stock">Stock :</label>
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
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="low stock">LowStock</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="payee">Payee:</label>
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
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date:</label>
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
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description:</label>
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
                  />
                </div>

                <button className="button" type="submit">
                  Update Item
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default InventoryTable;
