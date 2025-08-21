import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddressPage() {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (
      !address.name ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      setError("Please fill all fields.");
      return;
    }
    localStorage.setItem("pawsitivity_address", JSON.stringify(address));
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 sm:p-10 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Shipping Address</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            value={address.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            name="phone"
            value={address.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
            required
            type="tel"
          />
        </div>
        <textarea
          name="address"
          value={address.address}
          onChange={handleChange}
          placeholder="Address"
          className="border rounded-lg px-4 py-3 mt-4 w-full focus:ring-2 focus:ring-orange-500"
          required
          rows={2}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <input
            name="city"
            value={address.city}
            onChange={handleChange}
            placeholder="City"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            name="state"
            value={address.state}
            onChange={handleChange}
            placeholder="State"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            name="pincode"
            value={address.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
            required
            type="number"
          />
        </div>
        {error && (
          <div className="text-red-600 mt-3 text-sm">{error}</div>
        )}
        <button
          type="submit"
          className="w-full mt-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Continue to Checkout
        </button>
      </form>
    </div>
  );
}
