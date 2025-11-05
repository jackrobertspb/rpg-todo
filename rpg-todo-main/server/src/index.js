import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import labelRoutes from './routes/labels.js';
import achievementRoutes from './routes/achievements.js';
import profileRoutes from './routes/profile.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/profile', profileRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'RPG Todo API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

