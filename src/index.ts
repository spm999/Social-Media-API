import express from 'express';
import dotenv from 'dotenv';
import prisma from './prisma';  // Import the prisma client
import bodyParser from 'body-parser';
import userRoutes from './routes/user';
import postRoutes from './routes/post'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: true,}));

// Connect to Prisma (or MongoDB in your case)
prisma.$connect()
  .then(() => console.log('Connected to MongoDB via Prisma'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);  // Use user routes
app.use('/api/users', postRoutes);  // Use user routes
app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
