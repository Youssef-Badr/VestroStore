import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";

const PaymentResultPage = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // قراءة query params
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get("success");
    const orderParam = params.get("order");

    setSuccess(successParam === "true");
    setOrderId(orderParam);

    // Loader قصير + مسح الكارت
    setTimeout(() => {
      setLoading(false);
      if (successParam === "true") {
        clearCart();
        toast.success("🎉 Payment Successful! Your order has been placed.");
      } else {
        toast.error("❌ Payment Failed. Please try again.");
      }
    }, 1000); // 1 ثانية loader
  }, [clearCart]);

  const handleGoHome = () => navigate("/");
  const handleRetry = () => window.location.reload();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <svg
            className="animate-spin h-12 w-12 text-purple-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-gray-700 dark:text-gray-200 text-lg">Processing Payment...</p>
        </div>
      ) : (
        <div
          className={`p-6 rounded-md shadow-md max-w-md w-full text-center transition-all transform ${
            success ? "scale-105" : "scale-95"
          }`}
        >
          {success ? (
            <>
              <h1 className="text-3xl font-bold text-green-600 mb-4 animate-bounce">
                ✅ Payment Successful!
              </h1>
              {orderId && (
                <p className="text-gray-700 dark:text-gray-200 mb-4">
                  Your order ID: <span className="font-semibold">{orderId}</span>
                </p>
              )}
              <button
                onClick={handleGoHome}
                className="mt-4 px-6 py-3 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                Go to Home
              </button>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-red-600 mb-4 animate-pulse">
                ❌ Payment Failed
              </h1>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                There was an issue with your payment. Please try again.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="mt-4 px-6 py-3 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold"
                >
                  Retry Payment
                </button>
                <button
                  onClick={handleGoHome}
                  className="mt-4 px-6 py-3 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  Back to Home
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentResultPage;