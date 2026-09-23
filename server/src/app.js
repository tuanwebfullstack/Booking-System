import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import  env  from './config/env.js';
import { errorHandler } from './middlewares/error.js';
import { resolveTenant } from './middlewares/tenant.js';
import authRoutes  from './modules/auth/auth.routes.js';
const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (env.nodeEnv === 'development') app.use(morgan('dev'));


app.use(resolveTenant);
app.use('/api/auth',authRoutes)
app.use(errorHandler);

export default app;