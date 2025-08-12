import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { shopApi } from '@/lib/api';

export default function PaymentPage() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePay = async () => {
    try {
      await shopApi.paymentSuccess(orderId);
      setStatus('paid');
  window.dispatchEvent(new Event('cart:updated'));
    } catch (e) {
      setError(e.message);
      setStatus('failed');
    }
  };

  const handleFail = async () => {
    try {
      await shopApi.paymentFail(orderId);
      setStatus('failed');
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (!orderId) navigate('/shop');
  }, [orderId, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-2">Mock SSLCommerz</h1>
        <p className="text-gray-500 mb-6">Order: {orderId}</p>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        {status === 'pending' && (
          <div className="space-x-3">
            <button onClick={handlePay} className="bg-green-600 text-white px-4 py-2 rounded-full">Pay Now</button>
            <button onClick={handleFail} className="bg-red-600 text-white px-4 py-2 rounded-full">Fail</button>
          </div>
        )}
        {status === 'paid' && (
          <div>
            <div className="text-green-600 font-semibold mb-4">Payment successful!</div>
            <Link to="/shop" className="text-purple-600">Back to shop</Link>
          </div>
        )}
        {status === 'failed' && (
          <div>
            <div className="text-red-600 font-semibold mb-4">Payment failed.</div>
            <Link to="/shop" className="text-purple-600">Back to shop</Link>
          </div>
        )}
      </div>
    </div>
  );
}
