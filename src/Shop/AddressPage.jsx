import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../Apis/auth";

export default function AddressPage() {
  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    company: "",
    deliveryInstructions: "",
    billingSameAsShipping: true,
    billingAddress: {},
  });
  const [errors, setErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editAddress, setEditAddress] = useState(null);
  const navigate = useNavigate();

  // Fetch addresses
  const fetchAddresses = () => {
    const userId = JSON.parse(localStorage.getItem("user"))?._id;
    if (userId) {
      setAddressLoading(true);
      getAddresses(userId).then((result) => {
        if (result.success) {
          setSavedAddresses(result.data.addresses || []);
          setAddressError(null);
        } else {
          setAddressError(result.message);
        }
        setAddressLoading(false);
      });
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

const validate = () => {
  const errs = {};
  if (!(address.fullName || "").trim())
    errs.fullName = "Full name is required.";
  if (!(address.email || "").trim() || !/\S+@\S+\.\S+/.test(address.email || ""))
    errs.email = "Valid email is required.";
  if (!/^[6-9]\d{9}$/.test(address.phoneNumber || ""))
    errs.phoneNumber = "Valid 10-digit phone is required.";
  if (!(address.street || "").trim())
    errs.street = "Street address is required.";
  if (!(address.city || "").trim())
    errs.city = "City is required.";
  if (!(address.state || "").trim())
    errs.state = "State is required.";
  if (!(address.pinCode || "").trim() || !/^\d{5,6}$/.test(address.pinCode || ""))
    errs.pinCode = "Valid pin code is required.";
  if (!(address.country || "").trim())
    errs.country = "Country is required.";

  if (!address.billingSameAsShipping) {
    const b = address.billingAddress || {};
    if (!(b.street || "").trim())
      errs.billingAddress = "Billing address required";
  }
  return errs;
};
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (!userInfo?._id) {
      alert("User not logged in");
      return;
    }
    setAddressLoading(true);
    const addressData = {
      user: userInfo._id,
      fullName: address.fullName,
      email: address.email,
      phoneNumber: address.phoneNumber,
      street: address.street,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
      country: address.country,
      company: address.company,
      deliveryInstructions: address.deliveryInstructions,
      billingSameAsShipping: address.billingSameAsShipping,
      billingAddress: address.billingAddress,
    };
    const result = await addAddress(addressData);
    if (result.success) {
      fetchAddresses();
      setAddress({
        fullName: "",
        email: "",
        phoneNumber: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pinCode: "",
        country: "",
        company: "",
        deliveryInstructions: "",
        billingSameAsShipping: true,
        billingAddress: {},
      });
      setErrors({});
      alert("✅ Address added successfully!");
    } else {
      setAddressError(result.message);
    }
    setAddressLoading(false);
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    setAddressLoading(true);
    const result = await deleteAddress(addressId);
    if (result.success) {
      fetchAddresses();
    } else {
      setAddressError(result.message);
    }
    setAddressLoading(false);
  };

  // Edit address
  const handleEditAddress = (addr) => {
    setEditId(addr._id);
    setEditAddress({ ...addr });
  };

  // Update address
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    const result = await updateAddress(editId, editAddress);
    if (result.success) {
      fetchAddresses();
      setEditId(null);
      setEditAddress(null);
    } else {
      setAddressError(result.message);
    }
    setAddressLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const finalAddress = { shipping: address };
    if (!address.billingSameAsShipping) {
      finalAddress.billing = address.billingAddress;
    }
    localStorage.setItem("checkout_address", JSON.stringify(finalAddress));
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-2 py-6">
      <form
        onSubmit={handleAddAddress}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-orange-200 p-0 flex flex-col"
        style={{
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          marginTop: "16px",
          marginBottom: "16px",
        }}
      >
        {/* Header */}
        <div className="bg-white rounded-t-2xl px-8 py-6 flex items-center justify-between border-b border-orange-200 sticky top-0 z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center w-full -ml-8 sm:-ml-12">
            Address
          </h1>
          <span className="w-8" />
        </div>
        {/* Form Body */}
        <div className="px-8 py-10 sm:px-12 flex-1">
          {/* Full Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
            <InputField
              name="fullName"
              label="Full Name"
              value={address.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <InputField
              name="email"
              label="Email"
              type="email"
              value={address.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>
          {/* Phone */}
          <InputField
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            value={address.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
          />
          {/* Address lines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
            <InputField
              name="street"
              label="Street Address"
              value={address.street}
              onChange={handleChange}
              error={errors.street}
            />
            <InputField
              name="landmark"
              label="Address Line 2 (Optional)"
              value={address.landmark}
              onChange={handleChange}
              optional
            />
          </div>
          {/* City, State, Postal, Country */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-5">
            <InputField
              name="city"
              label="City"
              value={address.city}
              onChange={handleChange}
              error={errors.city}
            />
            <InputField
              name="state"
              label="State"
              value={address.state}
              onChange={handleChange}
              error={errors.state}
            />
            <InputField
              name="pinCode"
              label="Postal / PinCode"
              value={address.pinCode}
              onChange={handleChange}
              error={errors.pinCode}
            />
            <InputField
              name="country"
              label="Country"
              value={address.country}
              onChange={handleChange}
              error={errors.country}
            />
          </div>
          {/* Optional extras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
            <InputField
              name="company"
              label="Company (Optional)"
              value={address.company}
              onChange={handleChange}
              optional
            />
            <TextareaField
              name="deliveryInstructions"
              label="Delivery Instructions"
              value={address.deliveryInstructions}
              onChange={handleChange}
            />
          </div>
          {/* Billing address option */}
          <div className="flex items-center mt-4 mb-2">
            <input
              type="checkbox"
              name="billingSameAsShipping"
              checked={address.billingSameAsShipping}
              onChange={handleChange}
              id="billingSame"
              className="mr-2 accent-orange-500"
            />
            <label htmlFor="billingSame" className="text-gray-700">
              Billing address same as shipping
            </label>
          </div>
          {/* Conditionally show billing address */}
          {!address.billingSameAsShipping && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-orange-50">
              <h3 className="text-lg font-semibold mb-2 text-orange-700">
                Billing Address
              </h3>
              <InputField
                name="billing_address1"
                label="Street Address"
                value={address.billingAddress.address1 || ""}
                onChange={(e) => {
                  setAddress({
                    ...address,
                    billingAddress: {
                      ...address.billingAddress,
                      street: e.target.value,
                    },
                  });
                }}
                error={errors.billingAddress}
              />
            </div>
          )}
          {/* Show saved addresses from backend */}
          {addressLoading ? (
            <div className="p-4 text-gray-500">Loading saved addresses...</div>
          ) : addressError ? (
            <div className="p-4 text-red-500">{addressError}</div>
          ) : savedAddresses.length > 0 ? (
            <div className="p-4 mb-4 bg-orange-50 rounded-lg border border-orange-200">
              <h2 className="font-bold text-orange-700 mb-2">
                Saved Addresses
              </h2>
              <ul className="space-y-2">
                {savedAddresses.map((addr) => (
                  <li
                    key={addr._id}
                    className="p-2 bg-white rounded border border-gray-200"
                  >
                    {editId === addr._id ? (
                      <form
                        onSubmit={handleUpdateAddress}
                        className="space-y-2"
                      >
                        <input
                          type="text"
                          value={editAddress.fullName}
                          onChange={(e) =>
                            setEditAddress({
                              ...editAddress,
                              fullName: e.target.value,
                            })
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                        <input
                          type="text"
                          value={editAddress.street}
                          onChange={(e) =>
                            setEditAddress({
                              ...editAddress,
                              street: e.target.value,
                            })
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                        <input
                          type="text"
                          value={editAddress.landmark}
                          onChange={(e) =>
                            setEditAddress({
                              ...editAddress,
                              landmark: e.target.value,
                            })
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                        <input
                          type="text"
                          value={editAddress.city}
                          onChange={(e) =>
                            setEditAddress({
                              ...editAddress,
                              city: e.target.value,
                            })
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                        <input
                          type="text"
                          value={editAddress.state}
                          onChange={(e) =>
                            setEditAddress({
                              ...editAddress,
                              state: e.target.value,
                            })
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                        <input
                          type="text"
                          value={editAddress.pinCode}
                          onChange={(e) =>
                            setEditAddress({
                              ...editAddress,
                              pinCode: e.target.value,
                            })
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                        <input
                          type="text"
                          value={editAddress.country}
                          onChange={(e) =>
                            setEditAddress({
                              ...editAddress,
                              country: e.target.value,
                            })
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                        <input
                          type="text"
                          value={editAddress.phoneNumber}
                          onChange={(e) =>
                            setEditAddress({
                              ...editAddress,
                              phoneNumber: e.target.value,
                            })
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            type="submit"
                            className="px-3 py-1 bg-orange-600 text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
                            onClick={() => {
                              setEditId(null);
                              setEditAddress(null);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div>
                          <strong>{addr.fullName}</strong> ({addr.email})
                        </div>
                        <div>
                          {addr.street}
                          {addr.landmark ? `, ${addr.landmark}` : ""},{" "}
                          {addr.city}, {addr.state}, {addr.pinCode},{" "}
                          {addr.country}
                        </div>
                        <div>Phone: {addr.phoneNumber}</div>
                        <div className="flex gap-2 mt-2">
                          <button
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
                            onClick={() => handleEditAddress(addr)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 bg-red-100 text-red-700 rounded"
                            onClick={() => handleDeleteAddress(addr._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {Object.values(errors).some(Boolean) && (
            <div className="text-red-600 mt-3 text-sm">
              {Object.values(errors).find(Boolean)}
            </div>
          )}
        </div>
        <div className="px-8 pb-8 sm:px-12 bg-white rounded-b-2xl border-t border-orange-100">
          <button
            type="submit"
            
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 shadow-md transition text-lg"
          >
            Continue to Checkout
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable components:
function InputField({
  name,
  label,
  type = "text",
  value,
  onChange,
  error,
  optional,
}) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">
        {label} {optional && <span className="text-gray-400">(Optional)</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:border-orange-500 focus:ring-orange-200 transition-all`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function TextareaField({ name, label, value, onChange }) {
  return (
    <div className="mt-4">
      <label className="block text-gray-700 font-medium mb-1">
        {label} <span className="text-gray-400">(Optional)</span>
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="3"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-200 transition-all"
      />
    </div>
  );
}
