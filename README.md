# Full-Stack E-Commerce Platform


A complete e-commerce web application built using the MERN-like stack (MySQL instead of MongoDB) with separate frontend and backend services, designed for free-tier deployment. Features include product browsing, searching, shopping cart, user authentication, role-based access, basic admin dashboard functionalities, and Stripe payment integration (Test Mode).

## Live Demo

🚀 **[View Live Demo](https://ecommerce-platform-indol-sigma.vercel.app/)** 🚀

*(Note: Backend might take ~30s to wake up on the first visit due to Railway's free tier sleeping policy.)*

## Screenshots


| Page                     | Screenshot                                                                                               |
| :----------------------- | :------------------------------------------------------------------------------------------------------- |
| **Homepage**             | *[Insert Homepage Screenshot Here]* <br/> ![Homepage](</screenshots/home.jpeg>)          |
| **Product Listing**      | *[Insert Product Listing Screenshot Here]* <br/> ![Product Listing](</screenshots/products.jpeg>) |
| **Product Detail**       | *[Insert Product Detail Screenshot Here]* <br/> ![Product Detail](</screenshots/cart2.jpeg>) |
| **Search Results**       | *[Insert Search Results Screenshot Here]* <br/> ![Search Results](</screenshots/search.jpeg>)     |
| **Shopping Cart**        | *[Insert Cart Screenshot Here]* <br/> ![Shopping Cart](</screenshots/cart.jpeg>)               |
| **Login Page**           | *[Insert Login Screenshot Here]* <br/> ![Login Page](</screenshots/login.jpeg>)                 |
| **Register Page**        | *[Insert Register Screenshot Here]* <br/> ![Register Page](</screenshots/register.jpeg>)         |
| **User Profile**         | *[Insert Profile Screenshot Here]* <br/> ![User Profile](</screenshots/profile.jpeg>)           |
| **Checkout Page**        | *[Insert Checkout Screenshot Here]* <br/> ![Checkout Page](</screenshots/checkout.jpeg>)         |
| **Admin Dashboard (Example)** | *[Insert Admin Screenshot Here - Optional]* <br/> ![Admin Dashboard](<insert_path_to_admin_screenshot.png>) |

## Features Implemented

*   **Frontend (Next.js):**
    *   Server-Side Rendering (SSR) for product listing and details.
    *   Responsive design for Desktop, Tablet, and Mobile.
    *   Modern UI built with Tailwind CSS.
    *   Client-side state management with Zustand.
    *   Form handling with React Hook Form.
*   **Backend (Node.js/Express):**
    *   RESTful API endpoints for managing resources.
    *   MySQL database interaction using `mysql2`.
*   **Core E-commerce:**
    *   Product listing and detailed view pages.
    *   Product search functionality (by name/description).
    *   Shopping cart functionality (add, update quantity, remove, clear).
    *   Basic checkout flow structure.
*   **Authentication & Authorization:**
    *   User registration and login.
    *   JWT (JSON Web Token) based authentication.
    *   Password hashing using `bcrypt`.
    *   Role-based access control (user vs. admin).
    *   Protected routes for authenticated users and admins (`withAuth`, `withAdminAuth` HOCs).
*   **Admin Panel (Basic):**
    *   Dashboard overview (placeholder stats).
    *   View all users, orders (basic list).
    *   Manage products (Add, Edit, Delete - requires UI implementation).
    *   Admin-only API endpoints protected.
*   **Payments:**
    *   Stripe Payment Intents integration (Test Mode).
    *   Secure payment form using Stripe Elements (`PaymentElement`).
    *   Backend endpoint to create Payment Intents.
    *   Order confirmation page displaying payment status.
    *   Basic Stripe Webhook endpoint structure for verifying payments.

## Tech Stack

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (v15+) - React Framework (Pages Router)
    *   [React](https://reactjs.org/) (v19+) - UI Library
    *   [Tailwind CSS](https://tailwindcss.com/) (v4+) - Utility-First CSS Framework
    *   [Zustand](https://github.com/pmndrs/zustand) - State Management
    *   [Axios](https://axios-http.com/) - HTTP Client
    *   [React Hook Form](https://react-hook-form.com/) - Form Validation
    *   [@stripe/react-stripe-js](https://github.com/stripe/react-stripe-js) & [@stripe/stripe-js](https://github.com/stripe/stripe-js) - Stripe Frontend Libraries
    *   [@heroicons/react](https://heroicons.com/) - Icons
*   **Backend:**
    *   [Node.js](https://nodejs.org/) - JavaScript Runtime
    *   [Express.js](https://expressjs.com/) - Web Framework
    *   [mysql2](https://github.com/sidorares/node-mysql2) - MySQL Client
    *   [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT Implementation
    *   [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password Hashing
    *   [cors](https://github.com/expressjs/cors) - Cross-Origin Resource Sharing Middleware
    *   [dotenv](https://github.com/motdotla/dotenv) - Environment Variable Loading
    *   [stripe](https://github.com/stripe/stripe-node) - Stripe Node.js Library
*   **Database:**
    *   [MySQL](https://www.mysql.com/) (Hosted on [Railway](https://railway.app/))
*   **Deployment:**
    *   **Frontend:** [Vercel](https://vercel.com/)
    *   **Backend & Database:** [Railway](https://railway.app/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18+)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)
*   [Git](https://git-scm.com/)
*   A [Railway](https://railway.app/) account (for hosting the database during local development - free tier available)
*   A [Stripe](https://stripe.com/) account (for payment testing - free test mode available)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Garbii1/ecommerce-platform.git
    cd ecommerce-platform
    ```

2.  **Backend Setup:**
    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a Railway MySQL database service in your Railway project dashboard.
    *   Create a `.env` file in the `backend` directory and add the following environment variables (get values from Railway, Stripe, and generate your own JWT secret):
        ```dotenv
        # Get from Railway MySQL service -> Variables tab (use the PUBLIC host/port for local dev)
        DATABASE_URL=mysql://USER:PASSWORD@PUBLIC_HOST:PORT/DATABASE_NAME

        # Generate a strong random string (e.g., using Node crypto or openssl rand -hex 32)
        JWT_SECRET=YOUR_REALLY_STRONG_JWT_SECRET_KEY

        # Optional: JWT Expiration (defaults can be set in code)
        JWT_EXPIRES_IN=1d

        # Your LOCAL frontend URL for CORS
        FRONTEND_URL=http://localhost:3000

        # Get from Stripe Dashboard (Test Mode -> Developers -> API Keys)
        STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY

        # Get from running `stripe listen --forward-to ...` locally (see Stripe Setup)
        STRIPE_WEBHOOK_SECRET=whsec_YOUR_LOCAL_STRIPE_CLI_WEBHOOK_SECRET
        ```
    *   Set up the database tables: Connect to your Railway database using an SQL client (like TablePlus, DBeaver) and run the SQL `CREATE TABLE` statements found earlier in the project setup guide (or in a dedicated `schema.sql` file if you create one).
    *   Start the backend development server:
        ```bash
        npm run dev
        ```
        The backend should be running on `http://localhost:5001` (or the port specified in `.env`).

3.  **Frontend Setup:**
    *   Open a **new terminal** and navigate to the frontend directory:
        ```bash
        cd frontend
        ```
        *(If you are inside the `backend` directory, use `cd ../frontend`)*
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env.local` file in the `frontend` directory and add the following environment variables:
        ```dotenv
        # Your LOCAL backend API endpoint
        NEXT_PUBLIC_API_URL=http://localhost:5001/api

        # Get from Stripe Dashboard (Test Mode -> Developers -> API Keys)
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY
        ```
    *   Start the frontend development server:
        ```bash
        npm run dev
        ```
        The frontend should be running on `http://localhost:3000`.

4.  **Access the Application:** Open your browser and go to `http://localhost:3000`.

## API Endpoints Overview

*(Note: Base URL is assumed to be `/api`)*

*   **Auth:**
    *   `POST /auth/register`: Register a new user.
    *   `POST /auth/login`: Log in a user, returns JWT.
    *   `GET /auth/profile`: Get logged-in user's profile (Requires Auth).
*   **Products:**
    *   `GET /products`: Get all products.
    *   `GET /products/search?q={term}`: Search products by name/description.
    *   `GET /products/{id}`: Get a single product by ID.
    *   `POST /products`: Create a new product (Admin only).
    *   `PUT /products/{id}`: Update a product (Admin only).
    *   `DELETE /products/{id}`: Delete a product (Admin only).
*   **Orders:**
    *   `POST /orders`: Create a new order (Requires Auth).
    *   `GET /orders/mine`: Get orders for the logged-in user (Requires Auth).
    *   `GET /orders/{id}`: Get a specific order by ID (Owner or Admin).
    *   `GET /orders`: Get all orders (Admin only).
    *   `PUT /orders/{id}/status`: Update order status (Admin only).
*   **Payments:**
    *   `POST /payments/create-payment-intent`: Create a Stripe Payment Intent (Requires Auth).
*   **Admin:**
    *   `GET /admin/users`: Get all users (Admin only).
    *   `GET /admin/users/{id}`: Get a specific user (Admin only).
    *   `DELETE /admin/users/{id}`: Delete a user (Admin only).
    *   `PUT /admin/users/{id}/role`: Update a user's role (Admin only).
*   **Webhooks:**
    *   `POST /webhooks/stripe`: Listens for events from Stripe (e.g., payment success/failure).

## Deployment Notes

*   **Backend:** Deployed on Railway. Requires environment variables (`DATABASE_URL` [usually injected], `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL_PROD`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) set in the Railway service settings. Root directory set to `/backend`.
*   **Frontend:** Deployed on Vercel. Requires environment variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) set in the Vercel project settings. Root directory set to `/frontend`.
*   **CORS:** Ensure the `FRONTEND_URL_PROD` on Railway matches the Vercel deployment URL.
*   **Database:** MySQL hosted on Railway (Free tier limitations apply).
*   **Stripe Webhook:** A production webhook endpoint needs to be configured in Stripe pointing to the deployed backend URL, and the corresponding production `whsec_...` key used in the Railway environment variables.

## Challenges Faced & Solutions

*   **CORS Errors:** Encountered CORS blocking between the deployed Vercel frontend and Railway backend. Solved by ensuring the correct Vercel URL was added to the `FRONTEND_URL_PROD` environment variable on Railway and restarting the backend service.
*   **Build Failures (ESLint):** Vercel builds initially failed due to strict ESLint rules (`react/no-unescaped-entities`). Solved by escaping special characters (like `"` and `'`) in JSX text content using HTML entities (`"`, `'`).
*   **Build Failures (Module Parsing):** Faced "Unexpected token" errors during the build, often pointing to JSX. Typically resolved by ensuring correct file extensions (`.js`/`.jsx`) and fixing any subtle syntax errors preceding the problematic JSX.
*   **Tailwind CSS Class Issues:** Encountered errors where custom or even default Tailwind classes ("Cannot apply unknown utility class") were not recognized. Resolved by ensuring correct Tailwind/PostCSS configuration (`tailwind.config.js`, `postcss.config.mjs`), verifying compatible package versions (especially with Tailwind v4), and clearing the Next.js cache (`.next` folder) before restarting the development server.
*   **Database Connection Errors (`ENOTFOUND`, `ECONNRESET`):**
    *   `ENOTFOUND`: Occurred when trying to connect from local machine/Node.js to the database using the *internal* Railway hostname. Solved by finding and using the *public* database connection URL/host/port provided by Railway in the local `.env` file.
    *   `ECONNRESET`: Connection reset by the database server, often due to idle timeouts on free tiers. Mitigated by implementing a basic retry mechanism (`queryWithRetry`) in the backend controllers for read operations.
*   **React Hydration Errors:** Faced "Hydration failed" and "Maximum update depth exceeded" errors.
    *   Caused by discrepancies between server-rendered HTML and initial client render, often due to nested invalid HTML (like `<a>` inside `<a>`, `<form>` inside `<form>`) or accessing `localStorage`/Zustand state too early on the client.
    *   Solved by fixing invalid HTML nesting (updating Next.js `<Link>` usage, removing nested forms) and implementing an `isMounted` state check in `_app.js` to delay rendering until the client is ready, allowing state hydration to stabilize.
*   **Stripe Image/SVG Errors:** `next/image` failed with `ENOTFOUND` when trying to optimize images from `via.placeholder.com` (Node.js DNS issue) and `dangerouslyAllowSVG` errors with `placehold.co` (returned SVGs). Solved by switching placeholder service to `picsum.photos` (which Node.js could resolve and returns raster images) and updating `next.config.mjs` `remotePatterns` accordingly.

## Future Improvements

*   [ ] Implement robust pagination for product lists and order history.
*   [ ] Add advanced search filters (category, price range, sorting).
*   [ ] Implement user reviews and ratings for products.
*   [ ] Detailed order history page for users.
*   [ ] Replace placeholder images with actual image hosting/upload (e.g., Cloudinary, AWS S3).
*   [ ] Add comprehensive unit and integration tests (Jest, React Testing Library, Supertest).
*   [ ] Add end-to-end tests (Cypress, Playwright).
*   [ ] Implement password reset functionality.
*   [ ] Allow users to update their profile information.
*   [ ] Enhance admin dashboard with more features (analytics, user editing).
*   [ ] Add more payment methods via Stripe.
*   [ ] Improve accessibility (ARIA attributes, keyboard navigation).
*   [ ] Consider PWA (Progressive Web App) features.
*   [ ] Refactor state management if complexity increases.
*   [ ] Switch to live Stripe keys and webhook secret for production.

## Author & Contact

*   **Author:** Muhammed Babatunde Garuba
*   **GitHub:** [Garbii1](https://github.com/Garbii1)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details (or include license text directly).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```