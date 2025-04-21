// backend/controllers/productController.js
import pool from '../config/db.js';

// Helper function for retrying database queries on ECONNRESET
const queryWithRetry = async (sql, params, retries = 1) => {
    while (retries >= 0) {
        try {
            const [results] = await pool.query(sql, params);
            return results; // Return results on success
        } catch (error) {
             // Check if it's a connection reset error and if we can retry
            if ((error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'PROTOCOL_CONNECTION_LOST') && retries > 0) {
                console.warn(`Database connection error (${error.code}), retrying query... (${retries} retries left)`);
                retries--;
                // Basic exponential backoff could be added here, but start simple
                await new Promise(resolve => setTimeout(resolve, 500 + (1-retries)*200)); // Wait slightly longer on retry
            } else {
                // If it's not a retryable error or retries are exhausted, throw it
                 console.error("Database Query Error (Final):", error);
                 // Optionally wrap in a more specific error type
                throw error;
            }
        }
    }
     // Should not be reached if retries are exhausted, as error is thrown
     throw new Error('Database query failed after multiple retries.');
};


// --- Get All Products ---
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res, next) => {
    try {
        console.log("Fetching all products...");
        const sql = 'SELECT id, name, price, image_url, stock FROM products ORDER BY created_at DESC';
        const products = await queryWithRetry(sql); // Use retry helper
        console.log(`Successfully fetched ${products.length} products.`);
        res.status(200).json(products);

    } catch (error) {
        // Error is already logged in queryWithRetry if it fails after retries
        next(new Error('Failed to fetch products. Please try again later.')); // Pass generic error to global handler
    }
};

// --- Get Single Product by ID ---
// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
    const { id } = req.params;
    try {
        console.log(`Fetching product with ID: ${id}`);
        const sql = 'SELECT * FROM products WHERE id = ?';
        const products = await queryWithRetry(sql, [id]); // Use retry helper

        if (!products || products.length === 0) {
             console.log(`Product with ID: ${id} not found.`);
            res.status(404);
            // Use return next() to avoid executing further code in this handler
            return next(new Error('Product not found'));
        }

        console.log(`Successfully fetched product: ${products[0].name}`);
        res.status(200).json(products[0]);

    } catch (error) {
        next(new Error('Failed to fetch product details. Please try again later.'));
    }
};

// --- Create Product (Admin Only) ---
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
    const { name, description, price, stock, image_url } = req.body;

    // Basic validation
    if (!name || !price || price <= 0) {
        res.status(400);
        return next(new Error('Product name and a valid positive price are required'));
    }
    if (stock !== undefined && stock < 0) {
        res.status(400);
         return next(new Error('Stock cannot be negative'));
    }


    try {
         console.log("Creating new product:", { name, price });
         // Note: INSERT operations are less likely to benefit from simple retries on ECONNRESET
         // as the state might be inconsistent. It's often better to let them fail and inform the user.
         // However, for consistency, we can still use it, but be aware of potential issues.
        const insertSql = 'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)';
        const insertResult = await queryWithRetry(insertSql, [
             name,
             description || null,
             price,
             stock === undefined || stock === null ? 0 : parseInt(stock, 10), // Ensure default 0 if undefined/null
             image_url || null
         ]);

        const insertId = insertResult.insertId;

        // Fetch the newly created product to return it
        const selectSql = 'SELECT * FROM products WHERE id = ?';
        const newProduct = await queryWithRetry(selectSql, [insertId]);

        if (!newProduct || newProduct.length === 0) {
            throw new Error('Failed to retrieve newly created product'); // Should not happen
        }

        console.log(`Product created successfully with ID: ${insertId}`);
        res.status(201).json({ message: 'Product created successfully', product: newProduct[0] });

    } catch (error) {
        next(new Error('Failed to create product. Please check your input or try again later.'));
    }
};

// --- Update Product (Admin Only) ---
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body; // Get all fields from body

    // Basic validation
    if (Object.keys(updates).length === 0) {
         return res.status(400).json({ message: 'No update fields provided' });
    }
    if (updates.price !== undefined && (isNaN(parseFloat(updates.price)) || updates.price <= 0)) {
       return res.status(400).json({ message: 'Price must be a positive number' });
    }
    if (updates.stock !== undefined && (isNaN(parseInt(updates.stock, 10)) || updates.stock < 0)) {
         return res.status(400).json({ message: 'Stock must be a non-negative integer' });
    }

    // Build the fields to update dynamically
    const fieldsToUpdate = {};
    const allowedFields = ['name', 'description', 'price', 'stock', 'image_url'];
    for (const key in updates) {
        if (allowedFields.includes(key) && updates[key] !== undefined) {
             // Specific handling for stock to ensure it's an integer
            if (key === 'stock') {
                 fieldsToUpdate[key] = parseInt(updates[key], 10);
            } else if (key === 'price') {
                 fieldsToUpdate[key] = parseFloat(updates[key]);
            }
            else {
                 fieldsToUpdate[key] = updates[key];
            }
        }
    }

     if (Object.keys(fieldsToUpdate).length === 0) {
         return res.status(400).json({ message: 'No valid fields provided for update.' });
     }


    try {
         console.log(`Updating product ID: ${id} with data:`, fieldsToUpdate);
         // Check if product exists first
        const checkSql = 'SELECT id FROM products WHERE id = ?';
        const existingProduct = await queryWithRetry(checkSql, [id]);
         if (existingProduct.length === 0) {
            res.status(404);
            return next(new Error('Product not found'));
        }

         // Perform the update (Retries less critical here, but use for consistency)
         const updateSql = 'UPDATE products SET ? WHERE id = ?';
         const updateResult = await queryWithRetry(updateSql, [fieldsToUpdate, id]);

         if (updateResult.affectedRows === 0 && updateResult.changedRows === 0) {
              // This can happen if the data submitted is the same as existing data
              console.log(`Product ${id} update requested, but no changes were made.`);
              // Fetch current data to return
         } else if (updateResult.affectedRows === 0) {
             // This case should have been caught by the existence check, but handle defensively
             res.status(404);
             return next(new Error('Product not found during update attempt.'));
         }


        // Fetch the updated product data
        const selectSql = 'SELECT * FROM products WHERE id = ?';
        const updatedProduct = await queryWithRetry(selectSql, [id]);

        console.log(`Product ${id} updated successfully.`);
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct[0] });

    } catch (error) {
        next(new Error('Failed to update product. Please try again later.'));
    }
};

// --- Delete Product (Admin Only) ---
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
     const { id } = req.params;
     try {
         console.log(`Attempting to delete product ID: ${id}`);
         // Check existence first
         const checkSql = 'SELECT id FROM products WHERE id = ?';
         const existingProduct = await queryWithRetry(checkSql, [id]);
         if (existingProduct.length === 0) {
            res.status(404);
            return next(new Error('Product not found'));
        }

         // Perform delete (Retries generally not advised for DELETE)
         const deleteSql = 'DELETE FROM products WHERE id = ?';
         const result = await pool.query(deleteSql, [id]); // Use pool directly, no retry

         if (result[0].affectedRows === 0) {
              // Should have been caught by existence check
             res.status(404);
             return next(new Error('Product not found during delete attempt.'));
         }
         console.log(`Product ${id} deleted successfully.`);
         res.status(200).json({ message: 'Product deleted successfully' });

     } catch (error) {
         console.error(`Error deleting product ${id}:`, error);
         // Handle potential foreign key constraints if orders reference this product
         if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             // Provide a specific error message for FK constraint violation
              return next(new Error('Cannot delete product: It is referenced in existing orders. Consider archiving instead.'));
         }
         // Generic error for other issues
         next(new Error('Failed to delete product. Please try again later.'));
     }
 };