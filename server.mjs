import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const GOOGLE_API_URL = process.env.GOOGLE_API_URL || 'https://www.googleapis.com/books/v1/volumes';
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || 3001;

app.use(express.json());
app.use(cors());

app.get('/api/books', async (req, res) => {
  try {
    const searchText = req.query.q;
    if (!searchText) {
      return res.status(400).json({ message: 'Search text is required' });
    }

    const { data } = await axios.get(`${GOOGLE_API_URL}?q=${searchText}`);

    if (!data || !data.items || !Array.isArray(data.items)) {
      return res.status(404).json({ message: 'No books found' });
    }

    const modifiedData = data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      thumbnail: item.volumeInfo.imageLinks.thumbnail,
      subtitle: item?.volumeInfo?.subtitle ?? undefined,
      searchInfo: item?.searchInfo?.textSnippet ?? undefined
    }));

    res.json(modifiedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(SERVER_PORT, () => console.log(`Server running on port ${SERVER_PORT}`));
