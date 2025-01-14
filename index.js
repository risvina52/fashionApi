const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const secretKey = "your_secret_key"; // Replace with a secure key
// Sample data for fashion items
let fashionItems = [
    { id: 1, name: "T-shirt", quantity: 20, image: "https://contents.mediadecathlon.com/p2606947/k$1c9e0ffdefc3e67bdeabc82be7893e93/dry-men-s-running-breathable-t-shirt-red-decathlon-8771124.jpg", price: 15.99, branch: "Nike" },
    { id: 2, name: "Jeans", quantity: 10, image: "https://product.hstatic.net/200000588671/product/quan-jean-nam-bycotton-basic-dark-blue_1a8794c4841741abbf62414185c77669_master.jpg", price: 49.99, branch: "Levi's" },
];

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] || req.query.token;

    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
}

// Route to generate JWT token
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // In a real application, validate username and password against a database
    if (username === "admin" && password === "password") {
        const user = { username };
        const accessToken = jwt.sign(user, secretKey, { expiresIn: '1h' });
        return res.json({ accessToken });
    }

    res.status(401).json({ message: "Invalid credentials" });
});

// GET all fashion items
app.get('/api/fashion', authenticateToken, (req, res) => {
    res.json(fashionItems);
});

// GET a single fashion item by ID
app.get('/api/fashion/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const item = fashionItems.find(item => item.id === id);
    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
});

// POST a new fashion item
app.post('/api/fashion', authenticateToken, (req, res) => {
    const newItem = req.body;
    if (!newItem.name || !newItem.quantity || !newItem.image || !newItem.price || !newItem.branch) {
        return res.status(400).json({ message: "All fields are required" });
    }
    newItem.id = fashionItems.length > 0 ? fashionItems[fashionItems.length - 1].id + 1 : 1;
    fashionItems.push(newItem);
    res.status(201).json(newItem);
});

// PUT to update an existing fashion item
app.put('/api/fashion/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const index = fashionItems.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Item not found" });
    }

    const updatedItem = req.body;
    if (!updatedItem.name || !updatedItem.quantity || !updatedItem.image || !updatedItem.price || !updatedItem.branch) {
        return res.status(400).json({ message: "All fields are required" });
    }

    fashionItems[index] = { id, ...updatedItem };
    res.json(fashionItems[index]);
});

// DELETE a fashion item
app.delete('/api/fashion/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const index = fashionItems.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Item not found" });
    }

    const deletedItem = fashionItems.splice(index, 1);
    res.json(deletedItem);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
