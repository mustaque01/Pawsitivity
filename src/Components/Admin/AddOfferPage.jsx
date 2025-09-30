import React, { useState, useEffect } from "react";
import { getAllProductsByAdmin, addProductOffer } from "../../Apis/product_api";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddOfferPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [promotion, setPromotion] = useState("");
  const [bogo, setBogo] = useState({ buy: 1, getFree: 1, autoAddFree: false, freeProductId: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if user is admin
    if (!authLoading && (!isLoggedIn || user?.userType !== "admin")) {
      navigate("/admin/login");
      return;
    }
    
    const fetchProducts = async () => {
      setLoading(true);
      const result = await getAllProductsByAdmin();
      if (result.success) {
        setProducts(result.products || []);
      }
      setLoading(false);
    };
    
    if (isLoggedIn && user?.userType === "admin") {
      fetchProducts();
    }
  }, [authLoading, isLoggedIn, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      setMessage("Please select a product.");
      return;
    }
    if (!promotion) {
      setMessage("Please select a promotion type.");
      return;
    }
    setLoading(true);
    let offerData = { promotion };
    if (promotion === "BOGO") {
      offerData.bogo = {
        buy: Number(bogo.buy) || 1,
        getFree: Number(bogo.getFree) || 1,
        autoAddFree: Boolean(bogo.autoAddFree),
        freeProductId: bogo.freeProductId || undefined
      };
    }
    const result = await addProductOffer(selectedProductId, offerData);
    if (result.success) {
      setMessage("Offer added successfully!");
    } else {
      setMessage(result.message || "Failed to add offer.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Add Offer to Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Select Product</label>
          <select
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">-- Select Product --</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>
                {product.product} (₹{product.price})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium">Promotion Type</label>
          <select
            value={promotion}
            onChange={e => setPromotion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">-- Select Promotion --</option>
            <option value="NONE">None</option>
            <option value="BOGO">Buy One Get One (BOGO)</option>
            <option value="FLASH_SALE">Flash Sale</option>
            <option value="SEASONAL">Seasonal</option>
            <option value="CLEARANCE">Clearance</option>
          </select>
        </div>
        {promotion === "BOGO" && (
          <div className="space-y-2 border rounded-md p-3 bg-yellow-50">
            <label className="block mb-2 font-medium">BOGO Details</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={bogo.buy}
                onChange={e => setBogo({ ...bogo, buy: e.target.value })}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Buy X"
                required
              />
              <input
                type="number"
                min="1"
                value={bogo.getFree}
                onChange={e => setBogo({ ...bogo, getFree: e.target.value })}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Get Y Free"
                required
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={bogo.autoAddFree}
                onChange={e => setBogo({ ...bogo, autoAddFree: e.target.checked })}
                id="autoAddFree"
              />
              <label htmlFor="autoAddFree" className="text-sm">Auto add free items to cart</label>
            </div>
            <div className="mt-2">
              <label className="block mb-1 text-sm">Free Product (optional)</label>
              <select
                value={bogo.freeProductId}
                onChange={e => setBogo({ ...bogo, freeProductId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Same Product</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.product}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition"
            disabled={loading}
          >
            {loading ? "Adding Offer..." : "Add Offer"}
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="w-full py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
        </div>
        
        {message && (
          <div className="mt-4 p-3 text-center rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            {message}
            {message.includes("successfully") && (
              <div className="mt-2">
                <button 
                  onClick={() => navigate("/admin/dashboard")}
                  className="text-sm underline"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
