// frontend/components/layout/Navbar.js
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore'; // Import Zustand store
import Logo from '@/components/common/Logo'; // Import Updated Logo component
import { useRouter } from 'next/router';
import { ShoppingCartIcon, UserCircleIcon, ArrowLeftOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'; // Ensure icons are installed

const Navbar = () => {
    // Select state pieces individually to potentially optimize re-renders
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);
    // Get cart count for badge (optional - requires implementation in cartStore)
    // const itemCount = useCartStore((state) => state.getCartItemCount ? state.getCartItemCount() : 0); // Example

    const router = useRouter();

    const handleLogout = () => {
        logout(); // Clear auth state from Zustand
        router.push('/auth/login'); // Redirect to login
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        {/* Render the Logo component - it handles its own linking */}
                        <Logo /> {/* Adjust size via className if needed */}
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {/* Use modern Link syntax */}
                        <Link href="/" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                        <Link href="/#products" scroll={true} className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Products</Link>
                        {/* Add other links here */}
                        {/* Example: <Link href="/about" className="...">About</Link> */}
                    </div>

                    {/* Right side Icons/Actions */}
                    <div className="flex items-center space-x-4">
                         {/* Cart Icon */}
                         <Link href="/cart" className="text-gray-500 hover:text-primary p-1 rounded-full relative" aria-label="View shopping cart">
                            <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                            {/* Optional Cart Count Badge - Add logic later */}
                            {/* {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                    {itemCount}
                                </span>
                            )} */}
                        </Link>

                        {/* Conditional rendering based on authentication state */}
                        {token && user ? (
                            // User is logged in
                            <>
                                {/* Admin Dashboard Link (only for admin users) */}
                                {user.role === 'admin' && (
                                     <Link href="/admin/dashboard" className="text-gray-500 hover:text-primary p-1 rounded-full" title="Admin Dashboard">
                                        <Cog6ToothIcon className="h-6 w-6" />
                                    </Link>
                                )}
                                {/* Profile Link */}
                                <Link href="/profile" className="text-gray-500 hover:text-primary p-1 rounded-full flex items-center space-x-1" title="Your Profile">
                                     <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
                                     {/* Show username on larger screens */}
                                     <span className="hidden sm:inline text-sm">{user.username}</span>
                                </Link>
                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-red-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    title="Logout"
                                >
                                    <span className="sr-only">Logout</span>
                                    <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                                </button>
                            </>
                        ) : (
                            // User is not logged in
                            <Link href="/auth/login" className="btn btn-secondary text-sm">Login</Link>
                        )}

                         {/* TODO: Implement Mobile Menu Button & Panel */}
                         {/* <div className="md:hidden"> ... Mobile Menu Button ... </div> */}
                    </div>
                </div>
            </div>

             {/* TODO: Implement Mobile Menu Panel (conditionally rendered) */}
             {/* <div className="md:hidden"> ... Mobile Menu Panel ... </div> */}
        </nav>
    );
};

export default Navbar;