import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = express();

// parser
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  }),
);

app.get('/', (req: Request, res: Response) => {
  res.send('😍 FINIDING BASA FOR YOU...!');
});

export default app;
