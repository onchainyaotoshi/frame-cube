import express from 'express';

import HomeRoute from "@routes/home-route.js";
import FrameRoute from "@routes/frame-route.js";

import { fcNamespace } from '@middlewares/fc-namespace.js';
import { errorHandler } from '@middlewares/error-handler.js';
import { neynar } from '@middlewares/neynar.js';

import cors from 'cors';

import { createPathContext } from '@utils/path-resolver.js';
const { resolvePath } = createPathContext(import.meta.url);

const app = express();
// Enable CORS for all routes
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', resolvePath('views'));

app.use(express.static(resolvePath('public')));
app.use(express.json());

app.use(fcNamespace, neynar);

app.use("/", HomeRoute);
app.use("/frame", FrameRoute);

// Place this middleware last to handle errors.
app.use(errorHandler);

export default app;