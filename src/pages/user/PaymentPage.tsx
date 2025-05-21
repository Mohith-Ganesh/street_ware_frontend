import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updatePaymentStatus } from '../../services/paymentService';

const PaymentPage = () => {
  const { token } = useAuth();
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const { amount, paymentMethod } = location.state || {};


  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (paymentMethod === 'COD') {
        navigate(`/orders/${orderId}`);
      } else {
        setTimeout(async () => {
          await updatePaymentStatus(token ?? '', Number(orderId), 'Paid');
          navigate(`/orders/${orderId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  useEffect(() => {
    if (!paymentMethod) navigate('/products');
  }, [paymentMethod]);

  return (
    <PayPalScriptProvider options={{ clientId: "AZZ2XM71uq-vawxyL5EwfoUdL6yggBgr-K2EUjym_JVGD-eHMQ2ciMWDSJHmf47Jt3vrPkE5_DWKgVa3&currency=USD" }}>
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold mb-8">Payment for Order #{orderId}</h1>
        <p className="text-lg mb-4">Amount to pay: ${amount}</p>
        <p className="text-lg mb-8">Payment Method: {paymentMethod}</p>

        {paymentMethod === 'COD' ? (
          <button
            onClick={handlePayment}
            className="px-6 py-3 rounded bg-black text-white hover:bg-gray-800"
          >
            Confirm Cash on Delivery
          </button>
        ) : (
          <PayPalButtons
            style={{ layout: 'vertical' }}
            createOrder={(data, actions) => {
                if (!actions.order) {
                  console.error("PayPal actions.order is undefined.");
                  return Promise.reject();
                }
                return actions.order.create({
                  intent: "CAPTURE", // 👈 required field!
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: amount ? amount.toString() : "0",
                      },
                    },
                  ],
                });
              }}
              
            onApprove={(data, actions) => {
              if (!actions.order) {
                console.error("PayPal actions.order is undefined.");
                return Promise.reject();
              }
              return actions.order.capture().then(() => {
                navigate(`/orders/${orderId}`);
              });
            }}
          />
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default PaymentPage;
