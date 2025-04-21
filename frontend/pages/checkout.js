// frontend/pages/checkout.js
import withAuth from '@/components/auth/withAuth'; // Import HOC for protection
import Head from 'next/head'; // Import Head
import Button from '@/components/common/Button'; // Import Button

// NOTE: This is a placeholder page. Full implementation requires:
// 1. Fetching cart items (maybe pass from cart page or use cartStore)
// 2. Forms for shipping/billing address (using react-hook-form)
// 3. Payment integration (e.g., Stripe Elements)
// 4. API call to backend createOrder endpoint on successful payment

const CheckoutPage = () => {
  // Placeholder logic - Replace with actual data fetching and form handling
  const handlePlaceOrder = (e) => {
      e.preventDefault();
      alert('Placing order not implemented yet. Payment integration required.');
      // In real implementation:
      // 1. Validate forms
      // 2. Process payment via Stripe/other
      // 3. On success, call api.post('/orders', { ...orderData });
      // 4. Redirect to order confirmation page / clear cart
  }

  return (
    <>
        <Head>
            <title>Checkout - Your E-commerce App</title>
            <meta name="description" content="Complete your purchase by providing shipping and payment details." />
            {/* Consider adding Stripe.js script here if using Stripe */}
        </Head>

        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Checkout</h1>
            <form onSubmit={handlePlaceOrder}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {/* Shipping & Billing Forms (Left/Center) */}
                   <div className="lg:col-span-2 space-y-8">
                       {/* Shipping Information Section */}
                       <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                           <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-100 dark:border-gray-700">Shipping Information</h2>
                           {/* TODO: Add Shipping Address Form using react-hook-form and Input components */}
                           <p className="text-gray-500 dark:text-gray-400">Shipping address form goes here...</p>
                           <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-blue-700 dark:text-blue-300 text-sm">
                               Form fields for name, address, city, state, zip, country, phone needed.
                           </div>
                       </section>

                       {/* Payment Details Section */}
                       <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-100 dark:border-gray-700">Payment Details</h2>
                            {/* TODO: Integrate Payment Gateway (e.g., Stripe Elements) */}
                            <div className="bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4" role="alert">
                                 <p className="font-bold">Payment Integration Needed</p>
                                 <p>Stripe Elements or another payment provider component should be mounted here.</p>
                            </div>
                       </section>
                   </div>

                   {/* Order Summary (Right) */}
                   <div className="lg:col-span-1">
                        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow sticky top-24"> {/* Sticky summary */}
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-100 dark:border-gray-700">Order Summary</h2>
                            {/* TODO: Display Order Summary based on cartStore */}
                            <p className="text-gray-500 dark:text-gray-400">Order summary details (subtotal, shipping, tax, total) based on cart go here...</p>
                             <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-blue-700 dark:text-blue-300 text-sm">
                                Fetch items/total from cartStore and display calculated costs.
                            </div>
                            <Button type="submit" className="w-full mt-6" disabled={true} variant="primary">
                              Place Order (Requires Payment Setup)
                           </Button>
                       </section>
                   </div>
                </div>
            </form>
          </div>
    </>
  );
};

// Protect this page - only logged-in users can access checkout
export default withAuth(CheckoutPage);