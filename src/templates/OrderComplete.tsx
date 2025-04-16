import { useEffect, useState } from "react";
import { PrimaryButton } from "../components/UIkit";
import { useNavigate } from "react-router-dom";

const OrderComplete = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [stripePaymentId, setStripePaymentId] = useState<string | null>(null);

  useEffect(() => {
    const orderId = localStorage.getItem("orderId");
    const stripePaymentId = localStorage.getItem("stripePaymentId");
    if (!orderId) {
      navigate("/");
    }
    setOrderId(orderId);
    setStripePaymentId(stripePaymentId);
  }, [navigate]);

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="c-section-container">
      <h2 className="u-text__headline u-text-center">注文完了</h2>
      <div className="c-container u-text-center">
        <p>決済が完了しました。</p>
        <p>注文番号は{orderId}です。</p>
        {stripePaymentId && (
          <p>支払いID: {stripePaymentId}</p>
        )}
        <p>ご注文ありがとうございました。</p>
        <p>またのご利用をお待ちしております。</p>
        <div className="module-spacer--small" />
        <PrimaryButton label="トップページへ戻る" onClick={handleClick} />
      </div>
    </div>
  );
};

export default OrderComplete;
