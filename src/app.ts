import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/Routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { routeNotFoundHandler } from './app/middlewares/routeNotFound';

const app: Application = express();

// parser
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }),
);

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('😍 FINIDING BASA FOR YOU...!');
});


app.use(globalErrorHandler);
app.use('*', routeNotFoundHandler);
export default app;
