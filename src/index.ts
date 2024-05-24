import express from 'express';
import dotenv from 'dotenv';
import prisma from './prisma';  // Import the prisma client

import userRoutes from './routes/user';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB (via Prisma)
prisma.$connect()
  .then(() => console.log('Connected to MongoDB via Prisma'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);  // Use user routes
app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
