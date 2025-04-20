// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import DB connection (to ensure it initializes)
import pool from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    // Add production frontend URL from .env if defined
    ...(process.env.FRONTEND_URL_PROD ? [process.env.FRONTEND_URL_PROD] : [])
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or if origin is in the allowed list
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // If you need to send cookies or authorization headers
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// --- Routes ---
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the E-commerce API!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/admin', adminRoutes);


// --- Global Error Handling (Basic Example) ---
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        // Optionally include stack trace in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Log database host to verify correct env var loading (optional)
    // console.log(`Attempting to connect to DB Host: ${process.env.DB_HOST}`);
});

// Handle graceful shutdown (optional but good practice)
process.on('SIGINT', () => {
    console.log('Shutting down server gracefully...');
    pool.end(err => { // Close the database connection pool
        if (err) {
            console.error('Error closing database pool:', err);
        } else {
            console.log('Database pool closed.');
        }
        process.exit(err ? 1 : 0);
    });
});