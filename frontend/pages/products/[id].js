// frontend/pages/products/[id].js
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import api from '@/lib/api';
import Image from 'next/image';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { StarIcon } from '@heroicons/react/20/solid'; // Example for reviews

// Helper function for basic rating display (replace with actual rating logic)
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetailPage({ product, error }) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const addItemToCart = useCartStore((state) => state.addItem);

    // Handle case where product data couldn't be fetched server-side
    if (error) {
         return <Layout title="Error"><p className="text-center text-red-500">{error}</p></Layout>;
    }
    // Handle case where router is not ready yet or product is null (fallback)
    if (router.isFallback || !product) {
        return <Layout title="Loading..."><p className="text-center">Loading product details...</p></Layout>;
    }

     const handleAddToCart = () => {
         addItemToCart(product, quantity);
         console.log(`${quantity} of ${product.name} added to cart`);
         // Add feedback like a toast notification
     };

     // Fallback image
     const imageUrl = product.image_url || '/placeholder-image.png';

    return (
        <Layout title={product.name || "Product Details"}>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Image */}
                    <div className="aspect-square relative overflow-hidden rounded-lg shadow-md bg-gray-100">
                       <Image
                            src={imageUrl}
                            alt={product.name}
                            layout="fill"
                            objectFit="contain" // Use contain to show full image, or cover
                            onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                            priority // Prioritize loading LCP image
                        />
                    </div>

                    {/* Product Details */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">{product.name}</h1>
                        <p className="text-3xl text-primary font-semibold mb-4">
                            ${parseFloat(product.price).toFixed(2)}
                        </p>

                        {/* Example Reviews/Rating */}
                        <div className="mb-4">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                            key={rating}
                                            className={classNames(
                                                4 > rating ? 'text-yellow-400' : 'text-gray-300', // Example: Hardcoded 4-star rating
                                                'h-5 w-5 flex-shrink-0'
                                            )}
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">4 out of 5 stars</p>
                                <a href="#reviews" className="ml-3 text-sm font-medium text-primary hover:text-primary-dark">
                                    117 reviews {/* Example count */}
                                </a>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 mb-6">
                            <h2 className="text-xl font-medium text-gray-900">Description</h2>
                            <p className="text-base text-gray-600">
                                {product.description || "No description provided."}
                            </p>
                        </div>

                        {/* Stock Info (Optional) */}
                        {product.stock !== undefined && (
                            <p className={`text-sm mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </p>
                        )}

                        {/* Quantity Selector & Add to Cart */}
                         {product.stock === undefined || product.stock > 0 ? (
                            <div className="flex items-center space-x-4 mb-6">
                                 <label htmlFor="quantity" className="sr-only">Quantity</label>
                                <select
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="input-field w-20 text-center"
                                     // Disable if stock is 0 (although button below also handles this)
                                    disabled={product.stock !== undefined && product.stock <= 0}
                                >
                                     {/* Generate options based on stock, e.g., max 10 or stock */}
                                    {[...Array(Math.min(product.stock === undefined ? 10 : product.stock, 10)).keys()].map(i => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock !== undefined && product.stock <= 0}
                                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add to Cart
                                </button>
                            </div>
                         ) : (
                             <p className="text-red-600 font-medium mb-6">This product is currently out of stock.</p>
                         )}

                        {/* Add other details: SKU, Categories, etc. */}
                    </div>
                </div>

                 {/* Optional Sections: Reviews, Related Products */}
                 {/* <div id="reviews" className="mt-12"> ... Reviews Component ... </div> */}
            </div>
        </Layout>
    );
}

// --- Server-Side Rendering (SSR) for Product Detail ---
export async function getServerSideProps(context) {
    const { id } = context.params; // Get product ID from the URL parameter
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

    try {
        const res = await fetch(`${apiUrl}/products/${id}`);

        if (!res.ok) {
             if (res.status === 404) {
                 return { notFound: true }; // Return 404 page if product not found
             }
             console.error(`[getServerSideProps Product ${id}] Failed: ${res.status}`);
             const errorText = await res.text();
             console.error(`[getServerSideProps Product ${id}] Error response: ${errorText}`);
             throw new Error(`Failed to fetch product ${id} (Status: ${res.status})`);
        }

        const product = await res.json();

        return {
            props: {
                product,
            },
        };
    } catch (error) {
        console.error(`[getServerSideProps Product ${id}] Error:`, error.message);
        return {
            props: {
                product: null,
                error: `Could not load product details: ${error.message}`,
            },
        };
    }
}

// Optional: If you have many products and want static generation + incremental updates
// export async function getStaticPaths() {
//   // Fetch all product IDs (or a subset for build time)
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
//   const products = await res.json();
//   const paths = products.map((product) => ({ params: { id: String(product.id) } }));
//   return { paths, fallback: 'blocking' }; // 'blocking' or true for ISR
// }
// export async function getStaticProps({ params }) { /* Fetch single product based on params.id */ }