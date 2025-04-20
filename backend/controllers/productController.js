// backend/controllers/productController.js
import pool from '../config/db.js';

// --- Get All Products ---
export const getAllProducts = async (req, res, next) => {
    try {
        const [products] = await pool.query('SELECT id, name, price, image_url FROM products ORDER BY created_at DESC'); // Select specific fields
        res.status(200).json(products);
    } catch (error) {
        console.error("Get Products Error:", error);
        next(new Error('Failed to fetch products.'));
    }
};

// --- Get Single Product by ID ---
export const getProductById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(products[0]);
    } catch (error) {
        console.error("Get Product Error:", error);
        next(new Error('Failed to fetch product details.'));
    }
};

// --- Create Product (Admin Only) ---
export const createProduct = async (req, res, next) => {
    const { name, description, price, stock, image_url } = req.body;

    // Basic validation
    if (!name || !price || price <= 0) {
        return res.status(400).json({ message: 'Name and valid price are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description || null, price, stock || 0, image_url || null]
        );
        const insertId = result.insertId;
        const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [insertId]);

        res.status(201).json({ message: 'Product created successfully', product: newProduct[0] });
    } catch (error) {
        console.error("Create Product Error:", error);
        next(new Error('Failed to create product.'));
    }
};

// --- Update Product (Admin Only) ---
export const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, stock, image_url } = req.body; // Get fields to update

     // Basic validation
    if (!name && !description && price === undefined && stock === undefined && !image_url) {
         return res.status(400).json({ message: 'No update fields provided' });
    }
     if (price !== undefined && price <= 0) {
        return res.status(400).json({ message: 'Price must be a positive value' });
    }


    try {
        // Fetch existing product first to see if it exists
        const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
         if (existing.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Build the update query dynamically (only update provided fields)
        const fieldsToUpdate = {};
        if (name !== undefined) fieldsToUpdate.name = name;
        if (description !== undefined) fieldsToUpdate.description = description;
        if (price !== undefined) fieldsToUpdate.price = price;
        if (stock !== undefined) fieldsToUpdate.stock = stock;
        if (image_url !== undefined) fieldsToUpdate.image_url = image_url;

        if (Object.keys(fieldsToUpdate).length === 0) {
             return res.status(400).json({ message: 'No valid fields provided for update.' });
        }

        const [result] = await pool.query('UPDATE products SET ? WHERE id = ?', [fieldsToUpdate, id]);

        if (result.affectedRows === 0) {
             // Should not happen if existence check passed, but good to handle
            return res.status(404).json({ message: 'Product not found or no changes made.' });
        }

        const [updatedProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct[0] });
    } catch (error) {
        console.error("Update Product Error:", error);
        next(new Error('Failed to update product.'));
    }
};

// --- Delete Product (Admin Only) ---
export const deleteProduct = async (req, res, next) => {
     const { id } = req.params;
     try {
         const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
         if (result.affectedRows === 0) {
             return res.status(404).json({ message: 'Product not found' });
         }
         res.status(200).json({ message: 'Product deleted successfully' });
     } catch (error) {
         console.error("Delete Product Error:", error);
         // Handle potential foreign key constraints if orders reference this product
         if (error.code === 'ER_ROW_IS_REFERENCED_2') {
              return next(new Error('Cannot delete product as it is referenced in existing orders.'));
         }
         next(new Error('Failed to delete product.'));
     }
 };