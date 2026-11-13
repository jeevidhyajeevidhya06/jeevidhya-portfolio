
require("dotenv").config();

const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend files
app.use(express.static(path.join(__dirname, "public")));

// Test route
app.get("/api", (req, res) => {
    res.send("Portfolio Backend is Working!");
});

// Get all projects
app.get("/api/projects", (req, res) => {
    const sql = "SELECT * FROM projects ORDER BY id DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Unable to fetch projects"
            });
        }

        res.json(results);
    });
});

// Add a new project
app.post("/api/projects", (req, res) => {
    const { title, description, technologies } = req.body;

    if (!title || !description || !technologies) {
        return res.status(400).json({
            message: "All project fields are required"
        });
    }

    const sql = `
        INSERT INTO projects (title, description, technologies)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [title, description, technologies], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Project could not be added"
            });
        }

        res.status(201).json({
            message: "Project added successfully!",
            id: result.insertId
        });
    });
});

// Contact form
app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            message: "Please fill all fields"
        });
    }

    const sql = `
        INSERT INTO contacts (name, email, message)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Message could not be saved"
            });
        }

        res.status(201).json({
            message: "Your message was submitted successfully!"
        });
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
