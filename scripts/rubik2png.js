import path from 'path';
import fs from 'fs';
import Rubik from '@utils/rubik/rubik.js'; 

// Create an instance of the CubeView class with your state
const rubik = new Rubik();

// Optionally, save the data URI to a file
fs.writeFileSync(path.join(process.cwd(),"tmp",'rubik.png'), rubik.view.renderToPNG());

console.log('saved as rubik.png');