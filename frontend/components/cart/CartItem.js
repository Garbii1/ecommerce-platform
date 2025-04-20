// frontend/components/cart/CartItem.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { TrashIcon } from '@heroicons/react/24/outline';

const CartItem = ({ item }) => {
    const { updateQuantity, removeItem } = useCartStore(state => ({
        updateQuantity: state.updateQuantity,
        removeItem: state.removeItem,
    }));

    if (!item || !item.product) return null; // Basic check

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (!isNaN(newQuantity)) {
            updateQuantity(item.product.id, Math.max(1, newQuantity)); // Ensure at least 1
        }
    };

    const handleRemove = () => {
        removeItem(item.product.id);
    };

    const imageUrl = item.product.image_url || '/placeholder-image.png';

    return (
        <li className="flex py-6 px-4 sm:px-6">
            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden relative">
                <Image
                    src={imageUrl}
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
                        <p className="ml-4">${parseFloat(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                       Unit Price: ${parseFloat(item.product.price).toFixed(2)}
                    </p>
                </div>
                <div className="flex-1 flex items-end justify-between text-sm mt-4">
                    <div className="flex items-center border border-gray-300 rounded">
                        <label htmlFor={`quantity-${item.product.id}`} className="sr-only">Quantity</label>
                        <input
                            id={`quantity-${item.product.id}`}
                            type="number"
                            value={item.quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            // Consider adding max={item.product.stock} if stock is available
                            className="w-16 border-0 text-center focus:ring-primary focus:border-primary py-1"
                            aria-label="Quantity"
                        />
                    </div>

                    <div className="flex">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="font-medium text-red-600 hover:text-red-700 flex items-center space-x-1 p-1"
                        >
                            <TrashIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Remove</span>
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CartItem;