// frontend/pages/cart.js
import Layout from '@/components/layout/Layout';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem); // Fixed indentation
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const getCartTotal = useCartStore((state) => state.getCartTotal); // Keep selector for calculation
    const clearCart = useCartStore((state) => state.clearCart);

    const total = getCartTotal(); // Calculate total using the selector

    const handleQuantityChange = (productId, newQuantity) => {
         updateQuantity(productId, Number(newQuantity));
    };

    return (
        <Layout title="Shopping Cart">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
                         <Link href="/#products" legacyBehavior>
                            <a className="btn btn-primary">Continue Shopping</a>
                         </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="flex-grow lg:w-2/3">
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <ul role="list" className="divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <li key={item.product.id} className="flex py-6 px-4 sm:px-6">
                                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden relative">
                                                <Image
                                                    src={item.product.image_url || '/placeholder-image.png'}
                                                    alt={item.product.name}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                                                />
                                            </div>

                                            <div className="ml-4 flex-1 flex flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>
                                                             <Link href={`/products/${item.product.id}`} legacyBehavior>
                                                                <a>{item.product.name}</a>
                                                            </Link>
                                                        </h3>
                                                        <p className="ml-4">${parseFloat(item.product.price).toFixed(2)}</p>
                                                    </div>
                                                    {/* Add other details like color/size if applicable */}
                                                </div>
                                                <div className="flex-1 flex items-end justify-between text-sm mt-4">
                                                    <div className="flex items-center border border-gray-300 rounded">
                                                          <label htmlFor={`quantity-${item.product.id}`} className="sr-only">Quantity</label>
                                                          <input
                                                             id={`quantity-${item.product.id}`}
                                                             type="number"
                                                             value={item.quantity}
                                                             onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                                                             min="1"
                                                             // max={item.product.stock} // Optional: Limit by stock
                                                             className="w-16 border-0 text-center focus:ring-primary focus:border-primary"
                                                             aria-label="Quantity"
                                                          />
                                                    </div>

                                                    <div className="flex">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.product.id)}
                                                            className="font-medium text-primary hover:text-primary-dark flex items-center space-x-1"
                                                        >
                                                             <TrashIcon className="h-4 w-4"/>
                                                            <span>Remove</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                 <div className="border-t border-gray-200 py-4 px-4 sm:px-6 text-right">
                                     <button onClick={clearCart} className="text-sm font-medium text-red-600 hover:text-red-800">
                                         Clear Cart
                                     </button>
                                 </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white shadow rounded-lg p-6 sticky top-24"> {/* Sticky summary */}
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                                <div className="border-t border-gray-200 pt-4 space-y-2">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <p>Subtotal</p>
                                        <p>${total.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <p>Shipping estimate</p>
                                        <p>$5.00</p> {/* Replace with actual calculation */}
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <p>Tax estimate</p>
                                        <p>${(total * 0.08).toFixed(2)}</p> {/* Replace with actual calculation */}
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between text-lg font-bold text-gray-900">
                                        <p>Order total</p>
                                        <p>${(total + 5.00 + (total * 0.08)).toFixed(2)}</p> {/* Replace with actual calculation */}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link href="/checkout" legacyBehavior>
                                       <a className="w-full btn btn-primary text-center">Checkout</a>
                                    </Link>
                                </div>
                                 <div className="mt-4 text-center text-sm text-gray-500">
                                    <p> or{' '}
                                        <Link href="/#products" legacyBehavior>
                                           <a className="font-medium text-primary hover:text-primary-dark">Continue Shopping<span aria-hidden="true"> →</span></a>
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}