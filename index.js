const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const data = [
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Doe", age: 25 },
];

// Endpoint GET
app.get('/api/users', (req, res) => {
    res.json(data);
});

// Endpoint POST
app.post('/api/users', (req, res) => {
    const newUser = req.body;
    data.push(newUser);
    res.status(201).json(newUser);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
