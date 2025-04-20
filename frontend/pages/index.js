// frontend/pages/index.js
import Layout from '@/components/layout/Layout';
import ProductList from '@/components/products/ProductList';
import api from '@/lib/api'; // Your API helper
import { useEffect, useState } from 'react';

export default function HomePage({ initialProducts }) { // Receive initial products from getServerSideProps
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(!initialProducts); // Only loading if no initial data
    const [error, setError] = useState(null);

     // Fetch products on client-side if initial fetch fails or for updates
     useEffect(() => {
        if (!initialProducts) { // Only fetch if getServerSideProps failed or wasn't used
            const fetchProducts = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await api.get('/products');
                    setProducts(response.data);
                } catch (err) {
                    console.error("Failed to fetch products:", err);
                    setError(err.message || 'Could not load products.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [initialProducts]); // Depend on initialProducts

    return (
        <Layout title="Welcome to Our Store">
            {/* Hero Section Example */}
            <section className="bg-gradient-to-r from-primary-light to-secondary-light text-center py-16 md:py-24 mb-12 rounded-lg shadow">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-dark mb-4">
                    Discover Amazing Products
                </h1>
                <p className="text-lg md:text-xl text-neutral-dark mb-8 max-w-2xl mx-auto">
                    Shop the latest trends and find your next favorite item.
                </p>
                <a href="#products" className="btn btn-primary btn-lg">
                    Shop Now
                </a>
            </section>

            {/* Product Listing Section */}
            <section id="products">
                <h2 className="text-3xl font-semibold mb-6 text-center md:text-left">Featured Products</h2>
                {loading && <p className="text-center text-gray-500">Loading products...</p>}
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                {products && products.length > 0 && <ProductList products={products} />}
                 {!loading && !error && products && products.length === 0 && (
                     <p className="text-center text-gray-500">No products found.</p>
                )}
            </section>

            {/* Add other sections: Categories, About Us, etc. */}

        </Layout>
    );
}

     // --- Server-Side Rendering (SSR) ---
     // Fetch products on the server before the page is rendered
     export async function getServerSideProps(context) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    console.log(`[getServerSideProps Index] Attempting to fetch from: ${apiUrl}/products`); // Log URL

    try {
        const res = await fetch(`${apiUrl}/products`);
        console.log(`[getServerSideProps Index] Fetch response status: ${res.status}`); // Log status

        if (!res.ok) {
            const errorText = await res.text(); // Get error text
            console.error(`[getServerSideProps Index] Fetch failed: ${res.status} ${res.statusText}`);
            console.error(`[getServerSideProps Index] Error response body: ${errorText}`);
            throw new Error(`Failed to fetch products (Status: ${res.status})`);
        }

        const products = await res.json();
        console.log(`[getServerSideProps Index] Successfully fetched ${products?.length ?? 0} products.`); // Log success

        return {
            props: { initialProducts: products },
        };
    } catch (error) {
         // Log the full error object
        console.error('[getServerSideProps Index] CAUGHT ERROR:', error);
        return {
            props: {
                initialProducts: null,
                error: `SSR Error: ${error.message}. Check backend connection at ${apiUrl}.`,
            },
        };
    }
}