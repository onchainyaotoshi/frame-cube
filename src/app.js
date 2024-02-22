import { getPathInfo } from './path-utils.js';
const {__dirname,getModulePath} = getPathInfo(import.meta.url);

import express from 'express';
import path from 'path';
import 'dotenv/config';
import neynar from "./neynar.js";
import {createRubikGameTable} from "./database.js";
createRubikGameTable();

export const loadModule = async (filename) => {
    const module = await import(path.join(path.dirname(new URL(import.meta.url).href), process.env.FC_MODULE_DIRNAME, ...filename));
    return module.default;
};


const app = express();
app.set('view engine', 'ejs');
app.set('views', getModulePath('templates'));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(express.json());
app.use(neynar);

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
};

// Register the error handling middleware
app.use(errorHandler);

(async () => {
    app.use("/", await loadModule(["index.js"]));
    app.use("/rubic", await loadModule(["rubic","index.js"]))
})();

export default app;