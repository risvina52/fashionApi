const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Sample data for fashion items
let fashionItems = [
    { id: 1, name: "T-shirt", quantity: 20, image: "https://contents.mediadecathlon.com/p2606947/k$1c9e0ffdefc3e67bdeabc82be7893e93/dry-men-s-running-breathable-t-shirt-red-decathlon-8771124.jpg", price: 15.99, branch: "Nike" },
    { id: 2, name: "Jeans", quantity: 10, image: "https://product.hstatic.net/200000588671/product/quan-jean-nam-bycotton-basic-dark-blue_1a8794c4841741abbf62414185c77669_master.jpg", price: 49.99, branch: "Levi's" },
];

// GET all fashion items
app.get('/api/fashion', (req, res) => {
    res.json(fashionItems);
});

// GET a single fashion item by ID
app.get('/api/fashion/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = fashionItems.find(item => item.id === id);
    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
});

// POST a new fashion item
app.post('/api/fashion', (req, res) => {
    const newItem = req.body;
    if (!newItem.name || !newItem.quantity || !newItem.image || !newItem.price || !newItem.branch) {
        return res.status(400).json({ message: "All fields are required" });
    }
    newItem.id = fashionItems.length > 0 ? fashionItems[fashionItems.length - 1].id + 1 : 1;
    fashionItems.push(newItem);
    res.status(201).json(newItem);
});

// PUT to update an existing fashion item
app.put('/api/fashion/:id', (req, res) => {
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
app.delete('/api/fashion/:id', (req, res) => {
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
