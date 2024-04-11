import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbFileName = 'books.db';
const dbPath = path.resolve(dbFileName);
const GOOGLE_API_URL = process.env.GOOGLE_API_URL || 'https://www.googleapis.com/books/v1/volumes';
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || 3001;

const app = express();

app.use(express.json());
app.use(cors());

async function connectDatabase() {
  try {
    const dbExists = fs.existsSync(dbPath);

    if (!dbExists) {
      fs.closeSync(fs.openSync(dbPath, 'w'));
      console.log('SQLite database created successfully');
    }

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Create the "books" table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT,
        title TEXT,
        thumbnail TEXT,
        subtitle TEXT,
        searchInfo TEXT
      )
    `);

    console.log('Connected to SQLite database');
    return db;
  } catch (error) {
    throw new Error(`Error connecting to SQLite database: ${error.message}`);
  }
}

// Fetch books from Google Books API
async function fetchBooksFromAPI(searchText) {
  try {
    const { data } = await axios.get(`${GOOGLE_API_URL}?q=${searchText}`);
    return data.items || [];
  } catch (error) {
    throw new Error('Failed to fetch books from Google Books API');
  }
}

// Middleware to validate search text
function validateSearchText(req, res, next) {
  const searchText = req.query.q;
  if (!searchText) {
    return res.status(400).json({ message: 'Search text is required' });
  }
  next();
}

// GET route to fetch books
app.get('/api/books', validateSearchText, async (req, res) => {
  const searchText = req.query.q;
  try {
    const books = await fetchBooksFromAPI(searchText);
    const modifiedBooks = books.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail,
      subtitle: item.volumeInfo.subtitle || undefined,
      searchInfo: item.searchInfo?.textSnippet || undefined
    }));
    res.json(modifiedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

// GET route to fetch favorite books
app.get('/api/favorites', async (req, res) => {
  const db = await connectDatabase();
  
  try {
    const books = await db.all('SELECT * FROM books');
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch favorite books' });
  } finally {
    await db.close();
  }
});

// POST route to add a new book to favorites
app.post('/api/favorites', async (req, res) => {
  const { id, title, thumbnail, subtitle, searchInfo } = req.body;
  const db = await connectDatabase();

  try {
    const result = await db.run(`
            INSERT INTO books (id, title, thumbnail, subtitle, searchInfo)
            VALUES (?, ?, ?, ?, ?)
        `, [id, title, thumbnail, subtitle, searchInfo]);

    res.status(201).json({ message: 'Book added successfully', bookId: result.lastID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add book to favorites' });
  } finally {
    await db.close();
  }
});

// DELETE route to delete a book from favorites
app.delete('/api/favorites/:id', async (req, res) => {
  const { id } = req.params;
  const db = await connectDatabase();

  try {
    await db.run(`DELETE FROM books WHERE id = ?`, id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete book from favorites' });
  } finally {
    await db.close();
  }
});

// Start the server
app.listen(SERVER_PORT, () => console.log(`Server running on port ${SERVER_PORT}`));
