import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    console.log("Payment Success Params:", Object.fromEntries(params));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>✅ Payment Successful</h1>
      <p>Your order has been paid successfully 🎉</p>
    </div>
  );
};

export default PaymentSuccess;