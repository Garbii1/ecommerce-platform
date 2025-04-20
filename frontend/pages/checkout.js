// frontend/pages/checkout.js
import Layout from '@/components/layout/Layout';
import withAuth from '@/components/auth/withAuth'; // Import the HOC

const CheckoutPage = () => {
  // Get cart items, user info, etc.
  // Implement forms for shipping address, payment details
  // Integrate Stripe Elements or other payment gateway here

  return (
    <Layout title="Checkout">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
               <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
               {/* Shipping Address Form */}
               <p>Shipping address form goes here...</p>
           </div>
           <div>
               <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
               {/* Payment Integration (e.g., Stripe Elements) */}
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                     <p className="font-bold">Payment Integration Needed</p>
                     <p>Stripe or another payment gateway integration is required here.</p>
                </div>

               <h2 className="text-xl font-semibold mb-4 mt-8">Order Summary</h2>
               {/* Display order summary */}
               <p>Order summary details...</p>

               <button className="w-full btn btn-primary mt-6 disabled:opacity-50" disabled>
                  Place Order (Requires Payment Setup)
               </button>
           </div>
        </div>
      </div>
    </Layout>
  );
};

// Protect this page - only logged-in users can access checkout
export default withAuth(CheckoutPage);