import path from 'path';
import fs from 'fs/promises';
import { constants } from 'fs';
import Rubik from '@utils/rubik/rubik.js'; 
const TMP_PATH = path.join(process.cwd(),"tmp");

async function checkDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath, constants.F_OK);
      return true;
    } catch {
      return false;
    }
}

async function createDirIfNotExists(dirPath) {
    if(!(await checkDirectoryExists(dirPath))){
        await fs.mkdir(dirPath);
    }
}

async function saveAsPng(filename,data){
    await fs.writeFile(path.join(TMP_PATH,filename+".png"),data);
}

async function testAllMoves(){
// Create an instance of the CubeView class with your state
    const rubik = new Rubik(null,0);
    const moves = rubik.getMoveCodes();
    await saveAsPng("rubik",rubik.renderToPNG());
    for(let i=0;i<moves.length;i++){
        let bef = rubik.toString();
        // const rubik = new Rubik(null,0);
        rubik.move(moves[i]);
        let aft = rubik.toString();
        console.log(moves[i],bef,aft)
        // Optionally, save the data URI to a file
        await saveAsPng(`${(i+1)}-rubik-${moves[i]}`,rubik.renderToPNG());
    }

    async function randomCube(){
        const rubik = new Rubik(null,100);
        // Optionally, save the data URI to a file
        await saveAsPng("rubik-random",rubik.renderToPNG());
    }

    await randomCube()

    console.log('done');
}

async function testCounterclockwise(){
    const rubik = new Rubik(null,0);
    const moves = rubik.getMoveCodes();
    for(let i=9;i<moves.length;i++){
        let bef = rubik.toString();
        // const rubik = new Rubik(null,0);
        rubik.move(moves[i]);
        let aft = rubik.toString();
        console.log(moves[i],bef,aft)
        // Optionally, save the data URI to a file
        await saveAsPng(`${(i+1)}-rubik-${moves[i]}`,rubik.renderToPNG());
    }
}

async function testClockwise(){
    const rubik = new Rubik(null,0);
    const moves = rubik.getMoveCodes();
    for(let i=0;i<9;i++){
        let bef = rubik.toString();
        // const rubik = new Rubik(null,0);
        rubik.move(moves[i]);
        let aft = rubik.toString();
        console.log(moves[i],bef,aft)
        // Optionally, save the data URI to a file
        await saveAsPng(`${(i+1)}-rubik-${moves[i]}`,rubik.renderToPNG());
    }
}

async function testMove(move){
    const rubik = new Rubik(null,0);
    rubik.move(move);
    await saveAsPng(`rubik-${move}`,rubik.renderToPNG());
}

async function main(){
    await createDirIfNotExists(TMP_PATH);
    await testAllMoves();
    // await testClockwise();
    // await testCounterclockwise();
    // await testMove("x");
    // await testMove("y");
    // await testMove("z");
}

await main();