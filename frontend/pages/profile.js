// frontend/pages/profile.js
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import withAuth from '@/components/auth/withAuth'; // Import the HOC

const ProfilePage = () => {
    const { user, loading } = useAuthStore(state => ({
        user: state.user,
        loading: state.loading,
    }));


     if (loading && !user) {
         return <Layout title="Loading Profile..."><p>Loading profile...</p></Layout>;
     }

     if (!user) {
        // This should ideally be handled by withAuth, but as a fallback
         return <Layout title="Error"><p>Could not load user profile.</p></Layout>;
    }

    return (
        <Layout title="My Profile">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-3xl font-bold mb-6">My Profile</h1>
                <div className="bg-white shadow rounded-lg p-6 space-y-4">
                     <div>
                         <span className="font-medium text-gray-700">Username:</span>
                         <p className="text-gray-900">{user.username}</p>
                     </div>
                      <div>
                         <span className="font-medium text-gray-700">Email:</span>
                         <p className="text-gray-900">{user.email}</p>
                     </div>
                     <div>
                         <span className="font-medium text-gray-700">Role:</span>
                         <p className="text-gray-900 capitalize">{user.role}</p>
                     </div>
                     {/* Display Join Date if available */}
                     {/* {user.created_at && (
                        <div>
                            <span className="font-medium text-gray-700">Member Since:</span>
                            <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                     )} */}

                     {/* Add links to edit profile, view order history, etc. */}
                     {/* <div className="border-t pt-4 mt-4">
                         <Link href="/orders/history" legacyBehavior>
                             <a className="text-primary hover:text-primary-dark">View Order History</a>
                         </Link>
                     </div> */}
                 </div>
             </div>
        </Layout>
    );
};

// Protect this page - requires login
export default withAuth(ProfilePage);