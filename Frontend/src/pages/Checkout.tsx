import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Truck, CreditCard, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { addressSchema, type AddressForm } from '../utils/validators';
import { useCartStore } from '../store/cartStore';
import { useCreateOrder } from '../hooks/useOrders';
import { createRazorpayOrder, verifyPayment } from '../api/payment';
import { formatPrice } from '../utils/formatters';

const steps = [
  { label: 'Shipping', icon: Truck },
  { label: 'Payment', icon: CreditCard },
  { label: 'Review', icon: Package },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Checkout = () => {
  const [step, setStep] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { items, totalPrice, clearCart } = useCartStore();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  if (items.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  const onShippingSubmit = (data: AddressForm) => {
    localStorage.setItem('checkout-address', JSON.stringify(data));
    setStep(1);
  };

  const loadRazorpayScript = (): Promise<boolean> => new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePayment = async () => {
    try {
      const address = JSON.parse(localStorage.getItem('checkout-address') || '{}');
      const amount = Math.round(totalPrice());
      const razorpayOrder = await createRazorpayOrder(amount);

      const isRazorpayReady = await loadRazorpayScript();
      if (!isRazorpayReady) {
        toast.error('Unable to load Razorpay checkout. Please try again later.');
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'ShopNest',
        description: 'ShopNest Order Payment',
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          await createOrder.mutateAsync({
            items: items.map((i) => ({
              productId: i.product._id,
              qty: i.qty,
              price: i.product.price,
            })),
            totalAmount: totalPrice(),
            address,
            paymentId: response.razorpay_payment_id,
          });

          clearCart();
          localStorage.removeItem('checkout-address');
          setOrderSuccess(true);
          setStep(2);
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
          },
        },
        prefill: {
          name: address.fullName || '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#4F8CFF',
          backdrop_color: '#050505',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  if (orderSuccess) {
    return (
      <div className="section-padding pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 max-w-md mx-auto"
        >
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
          <p className="text-text-secondary mb-8">Your order has been placed successfully. You'll receive a confirmation email shortly.</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all"
          >
            View Orders
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="section-padding pt-28 pb-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-12 max-w-2xl">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isComplete = i < step;
          return (
            <div key={s.label} className="flex items-center gap-4 flex-1">
              <div className={`flex items-center gap-3 ${isComplete ? 'text-success' : isActive ? 'text-accent' : 'text-text-secondary'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isComplete ? 'bg-success/20' : isActive ? 'bg-accent/20' : 'glass'
                }`}>
                  <Icon size={18} />
                </div>
                <span className="text-sm font-medium hidden md:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px ${i < step ? 'bg-success' : 'bg-white/10'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.form
                key="shipping"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit(onShippingSubmit)}
                className="glass rounded-2xl p-8 border border-white/5 space-y-5"
              >
                <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input {...register('fullName')} placeholder="John Doe" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10" />
                    {errors.fullName && <p className="text-error text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Street Address</label>
                    <input {...register('street')} placeholder="123 Main Street" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10" />
                    {errors.street && <p className="text-error text-xs mt-1">{errors.street.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input {...register('city')} placeholder="Mumbai" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10" />
                    {errors.city && <p className="text-error text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input {...register('state')} placeholder="Maharashtra" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10" />
                    {errors.state && <p className="text-error text-xs mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input {...register('zipCode')} placeholder="400001" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10" />
                    {errors.zipCode && <p className="text-error text-xs mt-1">{errors.zipCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <input {...register('country')} placeholder="India" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10" />
                    {errors.country && <p className="text-error text-xs mt-1">{errors.country.message}</p>}
                  </div>
                </div>
                <button type="submit" className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all mt-4">
                  Continue to Payment
                </button>
              </motion.form>
            )}

            {step === 1 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-2xl p-8 border border-white/5"
              >
                <h2 className="text-xl font-semibold mb-4">Payment</h2>
                <p className="text-text-secondary mb-6">You'll be redirected to Razorpay to complete your payment securely.</p>
                <div className="glass rounded-xl p-4 mb-6 border border-white/5 flex items-center gap-4">
                  <CreditCard size={24} className="text-accent" />
                  <div>
                    <p className="font-medium">Razorpay</p>
                    <p className="text-sm text-text-secondary">Credit/Debit Card • UPI • Net Banking • Wallet</p>
                  </div>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={createOrder.isPending}
                  className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
                >
                  {createOrder.isPending ? 'Processing...' : `Pay ${formatPrice(totalPrice())}`}
                </button>
                <button
                  onClick={() => setStep(0)}
                  className="w-full py-3 text-sm text-text-secondary hover:text-white transition-colors mt-3"
                >
                  Back to Shipping
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 border border-white/5 sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3">
                  <img src={item.product.imagesUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.product.name}</p>
                    <p className="text-xs text-text-secondary">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.product.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <hr className="border-white/5 my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <hr className="border-white/5" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


