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
      faceCode.map(code=>{
        switch (code) {
          case 'u':
            cubeState.rotateFaceByCode('U')
            break;
          case 'f':
            cubeState.rotateFaceByCode('F')
            break;
          case 'b':
            cubeState.rotateFaceByCode('B')
            break;
          case 'l':
            cubeState.rotateFaceByCode('L')
            break;
          case 'r':
            cubeState.rotateFaceByCode('R')
            break;
          case 'd':
            cubeState.rotateFaceByCode('D')
            break;
          case 'm':
            cubeState.rotateFaceByCode('M')
            break;
          case 'e':
            cubeState.rotateFaceByCode('E')
            break;
          case 's':
            cubeState.rotateFaceByCode('S')
            break;
          default:
              break;
        }
      });
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