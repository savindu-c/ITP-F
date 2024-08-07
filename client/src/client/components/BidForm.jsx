import React, { useState, useEffect } from "react";
import axios from "axios";

function BidForm({ tenderId, title, onClose }) {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [weblink, setWeblink] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); 

  useEffect(() => {
    // Set current date when component mounts
    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  }, []);

  const [bidamount, setBid] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("/api/tender/addbid", {
        name,
        organizationname: organization,
        address,
        tel,
        email,
        weblink,
        description,
        date,
        bidamount,
        title,
        tenderId,
      });

      console.log("Bid submitted:", response.data);
      // Optionally handle success response (e.g., show a success message)

      // Close the form after submission
      onClose();
    } catch (error) {
      console.error("Error submitting bid:", error);
      // Optionally handle error response (e.g., show an error message)
    }
  };

  const validateForm = () => {
    const telRegex = /^[0-9]{10}$/;
    const amountRegex = /^\d+(\.\d{1,2})?$/;

    if (!telRegex.test(tel)) {
      alert("Please enter a valid 10-digit contact number.");
      return false;
    }

    if (!date) {
      alert("Please select a date.");
      return false;
    }

    if (!amountRegex.test(bidamount)) {
      alert("Please enter a valid bid amount.");
      return false;
    }

    return true;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Bid Form:</h2>
        <h2 className="text-2xl font-bold mb-4 text-red-600">{title}</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 p-2 w-full rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 -ml-2"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="organization"
              className="block text-sm font-medium text-gray-700"
            >
              Organization Name:
            </label>
            <input
              type="text"
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
              className="mt-1 p-2 w-full rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 -ml-2"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address:
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-1 p-2 w-full rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 -ml-2"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="tel"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number:
            </label>
            <input
              type="tel"
              id="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              pattern="[0-9]{10}"
              placeholder="Enter 10-digit number"
              required
              className="mt-1 p-2 w-full rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 -ml-2"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Jenny@gmail.com"
              required
              className="mt-1 p-2 w-full rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 -ml-2"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="weblink"
              className="block text-sm font-medium text-gray-700"
            >
              Website:
            </label>
            <input
              type="text"
              id="weblink"
              value={weblink}
              onChange={(e) => setWeblink(e.target.value)}
              placeholder="www.company.lk"
              className="mt-1 p-2 w-full rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 -ml-2"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="bidamount"
              className="block text-sm font-medium text-gray-700"
            >
              Bid Amount:
            </label>
            <input
              type="text"
              id="bidamount"
              value={bidamount}
              onChange={(e) => setBid(e.target.value)}
              placeholder="Enter the amount(Rs)"
              pattern="^\d+(\.\d{1,2})?$"
              required
              className="mt-1 p-2 w-full rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 -ml-2"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={new Date().toISOString().split('T')[0]}
              required
              className="mt-1 p-2 w-full rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 -ml-2"
            />
          </div>

          <div className="col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="mt-1 p-2 w-full rounded-md text-sm border border-gray-300"
            />
          </div>

          <div className="col-span-2 flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 text-sm"
            >
              Submit Bid
            </button>
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:bg-gray-400 text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BidForm;
