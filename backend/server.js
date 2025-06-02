
import express from 'express';

import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI);


const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.listen(PORT, () => {
    connectDB();
 
  console.log(`Server is running on port ${PORT}`);
});

