import { Button, styled } from "@mui/material";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useState } from "react";

const StyledForm = styled('form')({
  width: '100%',
  '.StripeElement': {
    width: '100%',
    padding: '15px',
    marginBottom: '20px',
  },
  '.Label': {
    fontWeight: '500',
    fontSize: '14px',
    color: '#424242',
    marginBottom: '8px',
  },
  '.Input': {
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '16px',
    '&:focus': {
      borderColor: '#4CAF50',
    },
  },
});

const PayButton = styled(Button)({
  width: '100%',
  padding: '15px',
  backgroundColor: '#000',
  color: '#fff',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: '600',
  '&:hover': {
    backgroundColor: '#333',
  },
  '&:disabled': {
    backgroundColor: '#ccc',
  },
});

type BillingDetails = {
  name: string;
  email: string;
  phone: string;
  address: {
    postal_code: string;
    state: string;
    line1: string;
    country: string;
  };
};

type Props = {
  onSuccess: (paymentIntentId?: string) => void;
  billingDetails?: BillingDetails;
};

const CheckoutForm = ({ onSuccess, billingDetails }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/complete`,
          payment_method_data: billingDetails ? {
            billing_details: billingDetails
          } : undefined
        },
        redirect: "if_required",
      });

      if (error) {
        console.error('[error]', error);
        alert(error.message);
      } else {
        if (paymentIntent && paymentIntent.id) {
          // PaymentIntentIDをローカルストレージに保存
          localStorage.setItem("stripePaymentId", paymentIntent.id);
          onSuccess(paymentIntent.id);
        } else {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('[error]', error);
      alert('決済処理中にエラーが発生しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          layout: "tabs",
          fields: {
            billingDetails: billingDetails ? 'auto' : 'never',
          },
          wallets: {
            applePay: 'auto',
            googlePay: 'auto'
          }
        }}
      />
      <PayButton
        type="submit"
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? "処理中..." : "支払いを確定する"}
      </PayButton>
    </StyledForm>
  );
};

export default CheckoutForm;