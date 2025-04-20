// frontend/pages/auth/login.js
// (Assuming Layout, LoginForm, Logo components exist as previously defined)
// (Assuming useAuthStore exists and works as previously defined)

import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';
import Logo from '@/components/common/Logo';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

export default function LoginPage() {
    // Use Zustand store to check authentication status
    const token = useAuthStore((state) => state.token);
    const router = useRouter();

    // If user is already logged in (token exists), redirect them away from login page
    useEffect(() => {
        if (token) {
            // Redirect to profile page or intended destination from query param
             const redirectUrl = router.query.redirect || '/profile';
             console.log(`User already logged in. Redirecting to ${redirectUrl}`);
            router.replace(redirectUrl); // Use replace to avoid adding login page to history
        }
    }, [token, router]);

    // Prevent rendering the login form if already logged in and redirecting
    if (token) {
         return (
             <Layout title="Redirecting...">
                  <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
                     <p>You are already logged in. Redirecting...</p>
                  </div>
             </Layout>
         );
    }

    // Render the login page if not logged in
    return (
         <>
             {/* Setting Head info here as Layout might be simpler */}
            <Head>
                <title>Login - Your E-commerce</title>
                 <meta name="description" content="Sign in to your account." />
            </Head>
             {/* Using a simpler container, assuming Layout provides Navbar/Footer */}
             <Layout>
                 <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
                     <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-xl shadow-xl">
                        <div className="text-center">
                            <div className="mx-auto flex justify-center mb-4">
                                <Logo className="h-10 w-auto"/>
                            </div>
                             <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                                Sign in to your account
                            </h2>
                        </div>
                        <LoginForm />
                     </div>
                 </div>
             </Layout>
         </>
    );
}

// Note: Server-side redirection can also be implemented using getServerSideProps
// to prevent the login page from even rendering briefly if the user has a valid token cookie.
// However, the client-side check with useEffect is often sufficient.
/*
import { getCookie } from 'cookies-next'; // Example library

export async function getServerSideProps(context) {
  const token = getCookie('your_auth_token_cookie_name', { req: context.req, res: context.res });

  if (token) {
    // Optionally verify token server-side here for extra security
    return {
      redirect: {
        destination: '/profile', // Or context.query.redirect
        permanent: false,
      },
    };
  }

  return { props: {} }; // User not logged in, render the page
}
*/