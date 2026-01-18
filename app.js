// 1. Import the Express library
const express = require('express');
const app = express();
const PORT = 3000;

// 2. Define what happens when someone visits the home page
app.get('/', (req, res) => {
  res.send('hi this is poteto and its working');
});

// 3. Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});