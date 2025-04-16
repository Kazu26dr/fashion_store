import { useEffect, useState } from "react";
import { PrimaryButton } from "../components/UIkit";
import { useNavigate } from "react-router-dom";

const OrderComplete = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      navigate("/");
    }
    setOrderId(orderId);
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
        <p>ご注文ありがとうございました。</p>
        <p>またのご利用をお待ちしております。</p>
        <div className="module-spacer--small" />
        <PrimaryButton label="トップページへ戻る" onClick={handleClick} />
      </div>
    </div>
  );
};

export default OrderComplete;
