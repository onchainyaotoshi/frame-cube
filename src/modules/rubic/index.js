import CubeView from './CubeView.js'; // Adjust the path accordingly
import CubeState from './CubeState.js';

import express from 'express';

let cubeState;
let cubeView;

const router = express.Router({ mergeParams: true });
router.post("/:id", (req, res) => {
    const { id } = req.params;
    const {untrustedData} = req.body;
    const {buttonIndex, inputText} = untrustedData;

    if(id == 0){
      cubeState = new CubeState()
      cubeView = new CubeView(cubeState.state);
    }else{
      const faceCode = inputText.trim().split(" ").map(v=>v.trim());
      if(faceCode.includes("reset")){

      }else{
        faceCode.map(code=>{
          switch (code) {
            case 'u':
            case 'U':
              cubeState.rotateFaceByCode('U', code === 'u')
              break;
            case 'f':
            case 'F':
              cubeState.rotateFaceByCode('F', code === 'f')
              break;
            case 'b':
            case 'B':
              cubeState.rotateFaceByCode('B', code === 'b')
              break;
            case 'l':
            case 'L':
              cubeState.rotateFaceByCode('L', code === 'l')
              break;
            case 'r':
            case 'R':
              cubeState.rotateFaceByCode('R', code === 'r')
              break;
            case 'd':
            case 'D':
              cubeState.rotateFaceByCode('D', code === 'd')
              break;
            case 'm':
            case 'M':
              cubeState.rotateFaceByCode('M', code === 'm')
              break;
            case 'e':
            case 'E':
              cubeState.rotateFaceByCode('E', code === 'e')
              break;
            case 's':
            case 'S':
              cubeState.rotateFaceByCode('S', code === 's')
              break;
            case 's':
            case 'S':
              cubeState.rotateFaceByCode('S', code === 's')
              break;
            case 'x':
            case 'X':
              cubeState.rotateFaceByCode('L', code === 'x')
              cubeState.rotateFaceByCode('M', code === 'x')
              cubeState.rotateFaceByCode('R', code === 'x')
              break;
            case 'y':
            case 'Y':
              cubeState.rotateFaceByCode('U', code === 'y')
              cubeState.rotateFaceByCode('E', code === 'y')
              cubeState.rotateFaceByCode('D', code === 'y')
              break;
            case 'z':
            case 'Z':
              cubeState.rotateFaceByCode('F', code === 'z')
              cubeState.rotateFaceByCode('S', code === 'z')
              cubeState.rotateFaceByCode('B', code === 'z')
              break;
            default:
              break;
          }
        });
      }
      
      cubeView = new CubeView(cubeState.state);
    }

    res.render('index', {
      title: "Rubic's pages",
      image: `data:image/png;base64,${cubeView.renderToPNG().toString('base64')}`,
      postUrl: `${process.env.FC_DOMAIN}/rubic/1`,
      buttons: [
        { text: "run"}
      ],
      input: {placeholder: "Commands"}
    });
});

export default router;