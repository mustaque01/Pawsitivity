import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaArrowLeft, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminProduct from "../Admin/AdminProduct";
import { getAllUsersByAdmin } from "../../Apis/auth";
import axios from "axios";

// Initial categories
const initialCategories = ["Dogs", "Cats", "Cattle", "Birds"];

export default function AdminDashboard() {
  const { user, logout, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState(initialCategories);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [currentTab, setCurrentTab] = useState("products");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.userType !== "admin")) {
      navigate("/admin/login");
    }
  }, [loading, isLoggedIn, user, navigate]);

  // Fetch users when customers tab is selected
  useEffect(() => {
    if (currentTab === "customers") {
      setUsersLoading(true);
      getAllUsersByAdmin().then((result) => {
        if (result.success) {
          setUsers(result.data.users);
          setUsersError(null);
        } else {
          setUsersError(result.message);
        }
        setUsersLoading(false);
      });
    }
  }, [currentTab, user?.userType]);

  // Fetch user details by ID
  const handleGetDetails = async (userId) => {
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/v1/users/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedUser(response.data.user);
      setDetailsModalOpen(true);
    } catch (error) {
      setDetailsError(error.response?.data?.message || 'Failed to fetch user details');
    }
    setDetailsLoading(false);
  };

  // Delete user by ID
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8000/api/v1/users/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-yellow-600 rounded-full border-t-transparent animate-spin"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || user?.userType !== "admin") {
    return null;
  }

  // Category management functions
  const handleAddCategory = () => {
    const normalized = newCategory.trim();
    if (
      normalized &&
      !categories.map((c) => c.toLowerCase()).includes(normalized.toLowerCase())
    ) {
      setCategories([...categories, normalized]);
      setNewCategory("");
      setIsCategoryModalOpen(false);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${categoryToDelete}" category?`
      )
    ) {
      setCategories(categories.filter((cat) => cat !== categoryToDelete));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-yellow-500 shadow-lg">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 text-yellow-900 transition-colors rounded-lg hover:bg-yellow-400 hover:text-yellow-800"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-yellow-900 sm:text-3xl">
                  Admin Dashboard
                </h1>
                <p className="text-yellow-800">Welcome back, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate("/shop")}
                className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base text-yellow-700 transition-all bg-yellow-200 rounded-lg shadow-md hover:bg-yellow-300 hover:shadow-lg"
              >
                View Shop
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base text-yellow-700 transition-all bg-yellow-200 rounded-lg shadow-md hover:bg-yellow-300 hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-2 py-4 mx-auto sm:px-4 sm:py-8">
        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                "products",
                "categories",
                "orders",
                "customers",
                "analytics",
              ].map((tab) => (
                <button
                  key={tab}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 sm:px-6 sm:py-4 sm:text-base ${
                    currentTab === tab
                      ? "text-yellow-700 border-yellow-500 bg-yellow-50"
                      : "text-gray-500 hover:text-yellow-700 border-transparent hover:bg-gray-50"
                  }`}
                  onClick={() => setCurrentTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Tab */}
        {currentTab === "products" && <AdminProduct />}

        {/* Categories Tab */}
        {currentTab === "categories" && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col items-start justify-between mb-6 space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                  Category Management
                </h2>
                <p className="text-sm text-gray-600 sm:text-base">
                  Organize your product categories
                </p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm text-white transition-all bg-yellow-600 rounded-lg sm:w-auto sm:px-6 sm:py-3 sm:text-base hover:bg-yellow-700 shadow-md hover:shadow-lg"
              >
                <FaPlus />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category}
                  className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                      {category}
                    </h3>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        Active Category
                      </span>
                    </p>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold leading-4 text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentTab === "customers" && (
          <div className="p-8 bg-white rounded-lg shadow-lg border border-gray-200 sm:p-12 sm:py-20">
            {usersLoading ? (
              <div className="text-center text-gray-500">Loading users...</div>
            ) : usersError ? (
              <div className="text-center text-red-500">{usersError}</div>
            ) : users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100 text-gray-700 text-left">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Created At</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="p-3">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3 capitalize">{user.role}</td>
                        <td
                          className={`p-3 font-medium ${
                            user.status === "active"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {user.status}
                        </td>
                        <td className="p-3">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 space-x-2">
                          <button
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            onClick={() => handleGetDetails(user._id)}
                          >
                            Get Details
                          </button>
                          <button
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="mb-4 text-xl font-bold text-gray-700">
                  No Customers Found
                </h3>
                <p className="text-gray-500 text-base">
                  Please add customers to manage them effectively.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Other tabs */}
        {["orders", "analytics"].map(
          (tab) =>
            currentTab === tab && (
              <div
                key={tab}
                className="p-8 text-center bg-white rounded-lg shadow-lg border border-gray-200 sm:p-12 sm:py-20"
              >
                <div className="text-gray-300 mb-6">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center sm:w-20 sm:h-20">
                    <span className="text-2xl sm:text-3xl">🚧</span>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-700 sm:text-2xl">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Dashboard Coming
                  Soon
                </h3>
                <p className="text-gray-500 text-base sm:text-lg">
                  This feature is currently under development.
                </p>
              </div>
            )
        )}
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Add New Category
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-700 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-3 text-sm font-bold text-gray-700">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    placeholder="Enter category name"
                    onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="flex-1 px-4 py-3 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-all font-medium"
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* User Details Modal */}
      {detailsModalOpen && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-white rounded-xl shadow-xl"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Details</h3>
              {detailsLoading ? (
                <div>Loading...</div>
              ) : detailsError ? (
                <div className="text-red-500">{detailsError}</div>
              ) : (
                <div className="space-y-2">
                  <div><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</div>
                  <div><strong>Email:</strong> {selectedUser.email}</div>
                  <div><strong>Role:</strong> {selectedUser.role}</div>
                  <div><strong>Status:</strong> {selectedUser.status}</div>
                  <div><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</div>
                  {/* Add more fields as needed */}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => setDetailsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
