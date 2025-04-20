// frontend/components/products/ProductCard.js
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore'; // Import cart store
import { ShoppingCartIcon } from '@heroicons/react/24/outline'; // Ensure icons are installed

const ProductCard = ({ product }) => {
    const addItemToCart = useCartStore((state) => state.addItem);

    const handleAddToCart = (e) => {
         e.preventDefault(); // Prevent link navigation if clicking button inside link
         e.stopPropagation(); // Stop event bubbling up to the Link
         addItemToCart(product, 1); // Add 1 item
         // Optional: Add user feedback (e.g., toast notification)
         console.log(`${product.name} added to cart`);
     };

    // Basic check for product data
    if (!product) {
        return null; // Or a placeholder skeleton loader
    }

    // Fallback image if image_url is missing or invalid
    // Use a PNG/JPG placeholder if needed, or ensure via.placeholder.com URLs are used
    const imageUrl = product.image_url || '/placeholder-image.png'; // Add a placeholder in /public

    return (
         // Use the newer Next.js Link syntax (removes legacyBehavior and inner <a>)
         // Apply styling directly to the Link component
         <Link
            href={`/products/${product.id}`}
            className="group block border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
         >
             {/* Use a relatively positioned container for the fill Image */}
            <div className="relative w-full aspect-square overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={product.name || 'Product image'}
                    fill // Use fill prop for modern layout behavior
                    // Use Tailwind classes for object-fit instead of the prop
                    className="object-cover group-hover:opacity-90 transition-opacity duration-300"
                    // Provide sizes prop for optimization when using fill=true
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw" // Example: Adjust based on your grid layout
                    onError={(e) => { e.target.src = '/placeholder-image.png'; }} // Fallback on error
                    priority={false} // Set true only for above-the-fold images if needed
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate mb-1 group-hover:text-primary">
                    {product.name || 'Unnamed Product'}
                </h3>
                {/* Optional: Description <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description || 'No description available.'}</p> */}
                <div className="flex justify-between items-center mt-3">
                     <p className="text-xl font-bold text-primary">
                         ${product.price ? parseFloat(product.price).toFixed(2) : 'N/A'}
                     </p>
                    <button
                        onClick={handleAddToCart}
                        className="p-2 rounded-full text-gray-500 bg-gray-100 hover:bg-primary-light hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <ShoppingCartIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;