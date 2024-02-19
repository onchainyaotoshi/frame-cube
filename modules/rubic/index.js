import { fileURLToPath } from 'url';
import path , { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
import CubeView from './CubeView.js'; // Adjust the path accordingly
import CubeState from './CubeState.js';

import express from 'express';
const router = express.Router({ mergeParams: true });
router.post("/", (req, res) => {
    //besok lanjut dari sini.
    //lu harus get fid
    //check apakah orang ini lagi ada state di internal?
    //jika ada, maka export
    const cubeView = new CubeView(new CubeState().state);

    res.render('index', {
      title: "Rubic's pages",
      image: `data:image/png;base64,${cubeView.renderToPNG().toString('base64')}`,
      postUrl: `https://${process.env.NGROK_DOMAIN}/rubic`,
      buttons: [
        { text: "test", action: 'post', target: ""},
      ],
      input: {placeholder: "commands"}
    });
});

export default router;