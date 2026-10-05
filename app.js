import express from 'express';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tags', tagRoutes);

app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));