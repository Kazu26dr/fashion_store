import { Box, CircularProgress, TextField, Typography, styled, Divider, FormControlLabel, Checkbox } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { getProductsInCart } from "../redux/users/selectors";
import { CheckoutForm } from "../components/Products";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderProduct } from "../redux/products/operations";
import { stripePromise } from "../config/stripe";
import { Elements } from '@stripe/react-stripe-js';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { FirebaseError } from 'firebase/app';

const PaymentContainer = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
  display: 'flex',
  gap: '32px',
  '@media (max-width: 960px)': {
    flexDirection: 'column-reverse',
  },
});

const OrderSummary = styled('div')({
  flex: '0 0 300px',
  padding: '20px',
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  height: 'fit-content',
});

const PaymentForm = styled('div')({
  flex: '1',
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const Payment = () => {
  const selector = useSelector((state: RootState) => state);
  const productsInCart = getProductsInCart(selector);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const functions = getFunctions();

  const [shippingInfo, setShippingInfo] = useState({
    email: '',
    name: '',
    phone: '',
    postalCode: '',
    prefecture: '',
    address: '',
    sameAsShipping: true
  });

  const subTotal = productsInCart.reduce((sum, product) => (sum += product.price), 0);
  const shippingFee = subTotal >= 10000 ? 0 : 210;
  const tax = Math.floor((subTotal + shippingFee) * 0.1);
  const total = subTotal + shippingFee + tax;

  useEffect(() => {
    const createPayment = async () => {
      try {
        const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
        const amount = Math.floor(total);
        const result = await createPaymentIntent({ amount });
        const data = result.data as { clientSecret: string };
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        let errorMessage = '支払い処理の開始に失敗しました。';
        if (error instanceof FirebaseError) {
          errorMessage = error.message;
        }
        alert(errorMessage);
        navigate("/order/confirm");
      } finally {
        setIsLoading(false);
      }
    };

    createPayment();
  }, [total, functions, navigate]);

  const handleSuccess = useCallback(() => {
    dispatch(orderProduct(productsInCart, total));
    navigate("/order/complete");
  }, [dispatch, productsInCart, total, navigate]);

  const handleShippingInfoChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PaymentContainer>
      <PaymentForm>
        <Typography variant="h5" sx={{ mb: 3 }}>配送先情報</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          <TextField
            label="メールアドレス"
            fullWidth
            value={shippingInfo.email}
            onChange={handleShippingInfoChange('email')}
          />
          <TextField
            label="氏名"
            fullWidth
            value={shippingInfo.name}
            onChange={handleShippingInfoChange('name')}
          />
          <TextField
            label="電話番号"
            fullWidth
            value={shippingInfo.phone}
            onChange={handleShippingInfoChange('phone')}
            placeholder="例：090-1234-5678"
          />
          <TextField
            label="郵便番号"
            fullWidth
            value={shippingInfo.postalCode}
            onChange={handleShippingInfoChange('postalCode')}
          />
          <TextField
            label="都道府県"
            fullWidth
            value={shippingInfo.prefecture}
            onChange={handleShippingInfoChange('prefecture')}
          />
          <TextField
            label="住所"
            fullWidth
            value={shippingInfo.address}
            onChange={handleShippingInfoChange('address')}
          />
        </Box>

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" sx={{ mb: 3 }}>お支払い方法</Typography>
        {clientSecret && (
          <>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                onSuccess={handleSuccess}
                billingDetails={shippingInfo.sameAsShipping ? {
                  name: shippingInfo.name,
                  email: shippingInfo.email,
                  phone: shippingInfo.phone,
                  address: {
                    postal_code: shippingInfo.postalCode,
                    state: shippingInfo.prefecture,
                    line1: shippingInfo.address,
                    country: 'JP',
                  }
                } : undefined}
              />
            </Elements>
            <FormControlLabel
              control={
                <Checkbox
                  checked={shippingInfo.sameAsShipping}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, sameAsShipping: e.target.checked }))}
                />
              }
              label="請求先情報は配送先情報と同じ"
            />
          </>
        )}
      </PaymentForm>

      <OrderSummary>
        <Typography variant="h6" sx={{ mb: 2 }}>注文内容</Typography>
        <Box sx={{ mb: 2 }}>
          {productsInCart.map((product) => (
            <Box key={product.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>{product.name}</Typography>
              <Typography>¥{product.price.toLocaleString()}</Typography>
            </Box>
          ))}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>小計</Typography>
          <Typography>¥{subTotal.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>送料</Typography>
          <Typography>¥{shippingFee.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>消費税</Typography>
          <Typography>¥{tax.toLocaleString()}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">合計</Typography>
          <Typography variant="h6">¥{total.toLocaleString()}</Typography>
        </Box>
      </OrderSummary>
    </PaymentContainer>
  );
};

export default Payment; 