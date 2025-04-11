import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { createUserRoutes } from './routes/user.routes';
import { createCourseRoutes } from './routes/course.routes';
import { createAssignmentRoutes } from './routes/assignment.routes';
import testDbRoute from './routes/testDbRoute'; // Import the test-db route

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize DB
initializeDatabase();

// Routes
app.use('/api/users', createUserRoutes());
app.use('/api/courses', createCourseRoutes());
app.use('/api/assignments', createAssignmentRoutes());
app.use('/api/test-db', testDbRoute); // Add the test-db route

//testinggggg
app.get('/', (req, res) => {
  res.send('Server is running!');
});


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', environment: process.env.NODE_ENV });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
