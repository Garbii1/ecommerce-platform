// frontend/components/cart/CartSummary.js
import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/common/Button';

const CartSummary = () => {
    const { getCartTotal } = useCartStore(state => ({
         getCartTotal: state.getCartTotal
    }));

    const subtotal = getCartTotal();
    // Replace with actual calculations for shipping/tax later
    const shippingEstimate = subtotal > 0 ? 5.00 : 0;
    const taxEstimate = subtotal * 0.08; // Example 8% tax
    const orderTotal = subtotal + shippingEstimate + taxEstimate;

    return (
        <div className="bg-white shadow rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-4">Order Summary</h2>
            <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <p>Shipping estimate</p>
                    <p>${shippingEstimate.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <p>Tax estimate</p>
                    <p>${taxEstimate.toFixed(2)}</p>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between text-base font-bold text-gray-900">
                    <p>Order total</p>
                    <p>${orderTotal.toFixed(2)}</p>
                </div>
            </div>

            <div className="mt-6">
                <Link href="/checkout" passHref legacyBehavior>
                    <Button as="a" className="w-full text-center" disabled={subtotal <= 0}>
                        Proceed to Checkout
                    </Button>
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
    );
};

export default CartSummary;