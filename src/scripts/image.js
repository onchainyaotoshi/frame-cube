import path from 'path';
import fs from 'fs';
import CubeView from '../modules/rubic/CubeView.js'; // Adjust the path accordingly
import CubeState from '../modules/rubic/CubeState.js';

// Create an instance of the CubeView class with your state
const cubeView = new CubeView(new CubeState().state);

// Optionally, save the data URI to a file
fs.writeFileSync(path.join(process.cwd(),"tmp",'renderedCube.png'), cubeView.renderToPNG());

console.log('Rendered cube saved as renderedCube.jpg');