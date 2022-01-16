import express from 'express';
import routes from './routes';
import cors from 'cors';
import 'dotenv/config'
import './resources/db/connection'

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333, () => {
  console.log("aplicação rodando em => http://localhost:3333")
})