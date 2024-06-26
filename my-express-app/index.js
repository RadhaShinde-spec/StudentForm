const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const dbConfig = require('./db-config');

const app = express();
app.use(bodyParser.json());

// Serve static files from the StudentForm directory
app.use(express.static(path.join(__dirname, '..')));

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.post('/submit', (req, res) => {
    const { name, age, email, course } = req.body;

    const query = 'INSERT INTO students (name, age, email, course) VALUES (?, ?, ?, ?)';
    connection.query(query, [name, age, email, course], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ message: 'Database error' });
            return;
        }
        res.json({ message: 'Student information saved successfully!' });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
