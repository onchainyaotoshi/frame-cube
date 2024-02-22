import CubeView from './CubeView.js'; // Adjust the path accordingly
import CubeState from './CubeState.js';
import {validateFramePost} from "../../middleware.js";
import express from 'express';
import * as table from '../../database.js';


const router = express.Router({ mergeParams: true });
router.post("/:id", validateFramePost, async (req, res) => {
    try{

      const { id } = req.params;
    
      let cubeState;
      let cubeView;
      const current_state = await table.checkOngoingGameByFid(req.fid);
      if(id == 0){
        if(current_state === null){
          cubeState = new CubeState()
          cubeState.scramble()
          cubeView = new CubeView(cubeState.state);
          await table.insertGame({
            fid:req.fid,
            current_state:cubeState.toString(),
            start:req.action.timestamp
          });
        }else{
          //load ongoing game
          cubeState = CubeState.fromString(current_state);
          cubeView = new CubeView(cubeState.state);
        }
      }else{
        if(req.action.tapped_button.index === 1){
          //load ongoing game
          cubeState = CubeState.fromString(current_state);
          cubeView = new CubeView(cubeState.state);
          const faceCode = req.action.input.text.trim().split(" ").map(v=>v.trim());
          if(faceCode.includes("reset")){
            cubeState = new CubeState();
            cubeState.scramble();
            cubeView = new CubeView(cubeState.state);
            await table.updateStartAndStateByFid(req.fid,req.action.timestamp,cubeState.toString());
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
            await table.updateCurrentStateByFid(req.fid,cubeState.toString());
            cubeView = new CubeView(cubeState.state);
          }
        }
      }
  
      res.render('index', {
        title: "Rubic's pages",
        image: `data:image/png;base64,${cubeView.renderToPNG().toString('base64')}`,
        postUrl: `${process.env.FC_DOMAIN}/rubic/1`,
        buttons: [
          { text: "Run"},
          { text: "Leaderboard"},
          { text: "Guide"},
          { text: "Source", action: "link", target: "https://replit.com/@onchainyaotoshi/Nodejs"}
        ],
        input: {placeholder: "Commands"}
      });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: error.message }); // Internal server error or custom error message
    }
});



export default router;