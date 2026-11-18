const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const filePath = path.join(__dirname, "products.json");

// Read products from JSON file
function getProducts() {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Save products into JSON file
function saveProducts(products) {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}

// GET - Fetch all products
app.get("/api/products", (req, res) => {
    const products = getProducts();
    res.json(products);
});

// POST - Add a new product
app.post("/api/products", (req, res) => {
    const products = getProducts();

    const { id, name, price, category } = req.body;

    if (id === undefined || id === null || id === "" ||
        !name || price === undefined || !category) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (products.some(p => p.id == id)) {
        return res.status(409).json({
            message: "Product ID already exists"
        });
    }

    const newProduct = {
        id,
        name,
        price,
        category
    };

    products.push(newProduct);

    saveProducts(products);

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

// PUT - Update an existing product
app.put("/api/products/:id", (req, res) => {
    const products = getProducts();

    const id = req.params.id;

    const index = products.findIndex(p => p.id == id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const { name, price, category } = req.body;

    if (!name || price === undefined || !category) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    products[index] = {
        id: products[index].id,
        name,
        price,
        category
    };

    saveProducts(products);

    res.json({
        message: "Product updated successfully",
        product: products[index]
    });
});

// DELETE - Remove a product
app.delete("/api/products/:id", (req, res) => {
    let products = getProducts();

    const id = req.params.id;

    const filteredProducts = products.filter(p => p.id != id);

    if (products.length === filteredProducts.length) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    saveProducts(filteredProducts);

    res.json({
        message: "Product deleted successfully"
    });
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});