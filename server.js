const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/{*page}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', `${req.params.page}.html`));
});

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});