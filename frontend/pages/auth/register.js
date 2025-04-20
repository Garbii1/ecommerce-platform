// frontend/pages/auth/register.js
import Layout from '@/components/layout/Layout';
import RegisterForm from '@/components/auth/RegisterForm';
import Logo from '@/components/common/Logo';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function RegisterPage() {
     const { token } = useAuthStore();
    const router = useRouter();

    // If user is already logged in, redirect them
    useEffect(() => {
        if (token) {
            router.push('/profile'); // Redirect to profile or dashboard
        }
    }, [token, router]);

     return (
        <Layout title="Create Account">
             <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                 <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-lg shadow-lg">
                    <div>
                         <div className="mx-auto flex justify-center">
                            <Logo className="h-12 w-auto"/>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                    </div>
                    <RegisterForm />
                 </div>
             </div>
        </Layout>
    );
}
 // Optional: Server-side redirect if already logged in
 // import { checkAuthAndRedirect } from '@/utils/authHelpers';
 // export async function getServerSideProps(context) {
 //    return checkAuthAndRedirect(context, '/profile');
 // }