// frontend/pages/admin/orders.js
import Layout from '@/components/layout/Layout';
import withAdminAuth from '@/components/auth/withAdminAuth';
import OrderList from '@/components/admin/OrderList'; // We will create this component

const AdminOrdersPage = () => {
  return (
    <Layout title="Manage Orders">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Orders</h1>
            {/* Add any actions like filtering if needed */}
        </div>

        {/* Order List Component */}
        <OrderList />

      </div>
    </Layout>
  );
};

// Protect this page - requires admin role
export default withAdminAuth(AdminOrdersPage);