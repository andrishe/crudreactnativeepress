import express, { Express } from 'express';
import connectToDatabase from './database/data';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app: Express = express();

connectToDatabase();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
