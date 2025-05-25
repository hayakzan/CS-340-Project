const express = require('express');
const path = require('path');
const app = express();

const PORT = 4015; 

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any route not handled above, serve index.html (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});
