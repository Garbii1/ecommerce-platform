// frontend/pages/admin/dashboard.js
import Layout from '@/components/layout/Layout';
import withAdminAuth from '@/components/auth/withAdminAuth'; // Use the specific admin HOC
import Link from 'next/link';

const AdminDashboard = () => {
  // Fetch admin-specific data here (e.g., recent orders, user counts)

  return (
    <Layout title="Admin Dashboard">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Example Stats Card */}
           <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h2>
             <p className="text-3xl font-bold">125</p> {/* Replace with dynamic data */}
           </div>
           <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-lg font-semibold text-gray-700 mb-2">Pending Orders</h2>
             <p className="text-3xl font-bold">15</p> {/* Replace with dynamic data */}
           </div>
           <div className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h2>
             <p className="text-3xl font-bold">580</p> {/* Replace with dynamic data */}
           </div>
        </div>

        <div className="mt-10">
           <h2 className="text-2xl font-semibold mb-4">Management Links</h2>
           <ul className="space-y-3">
              <li>
                  <Link href="/admin/products" legacyBehavior>
                     <a className="text-primary hover:underline">Manage Products</a>
                  </Link>
              </li>
              <li>
                  <Link href="/admin/orders" legacyBehavior>
                     <a className="text-primary hover:underline">View Orders</a>
                  </Link>
              </li>
              <li>
                  <Link href="/admin/users" legacyBehavior>
                     <a className="text-primary hover:underline">Manage Users</a>
                  </Link>
              </li>
           </ul>
        </div>
      </div>
    </Layout>
  );
};

// Protect this page - requires admin role
export default withAdminAuth(AdminDashboard);