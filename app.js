import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

export const loadModule = async (filename) => {
    const module = await import(path.join(path.dirname(new URL(import.meta.url).href), process.env.MODULE_DIRNAME, ...filename));
    return module.default;
};


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

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