import express from 'express';
import dotenv from 'dotenv';
import prisma from './prisma';  // Import the prisma client
import bodyParser from 'body-parser';
import userRoutes from './routes/user';
import postRoutes from './routes/post'
import friendshipRoutes from './routes/friendship'
import commentRoutes from './routes/comment'
import likeRoutes from './routes/like';
import messageRoute from './routes/message'
import notificationRoute from './routes/notification'

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
app.use('/api/users', postRoutes);  // Use post routes
app.use('/api/users', friendshipRoutes);  // Use friendship routes
app.use('/api/users', commentRoutes);  // Use comment routes
app.use('/api/users', likeRoutes);     //use like route
app.use('/api/users', messageRoute);     //use message route
app.use('/api/users/', notificationRoute);   //use notification route



app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
