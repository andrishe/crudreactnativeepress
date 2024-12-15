import express, { Express } from 'express';
import connectToDatabase from './database/data';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

connectToDatabase();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
