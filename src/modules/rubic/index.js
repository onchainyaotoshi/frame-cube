import CubeView from './CubeView.js'; // Adjust the path accordingly
import CubeState from './CubeState.js';
import { validateFramePost } from "../../middleware.js";
import express from 'express';
import * as table from '../../database.js';

const router = express.Router({ mergeParams: true });
router.post("/:id", validateFramePost, (req, res) => {
  Rubic(req, res);
});

export default router;

export const Rubic = async (req, res) => {
  try {

    const { id } = req.params;

    let cubeState;
    let cubeView;
    const current_state = await table.checkOngoingGameByFid(req.fid);
    if (id == 0 || id == 1) {
      if (id == 0) {
        if (current_state === null) {
          cubeState = new CubeState()
          cubeState.scramble(1)
          cubeView = new CubeView(cubeState.state);
          await table.insertGame({
            fid: req.fid,
            current_state: cubeState.toString(),
            start: req.action.timestamp
          });
        } else {
          //load ongoing game
          cubeState = CubeState.fromString(current_state);
          cubeView = new CubeView(cubeState.state);
        }
      } else {
        if (req.action.tapped_button.index === 1) {
          //load ongoing game
          cubeState = CubeState.fromString(current_state);
          cubeView = new CubeView(cubeState.state);
          const faceCode = req.action.input.text.trim().split(" ").map(v => v.trim());
          if (faceCode.includes("reset")) {
            cubeState = new CubeState();
            cubeState.scramble();
            cubeView = new CubeView(cubeState.state);
            await table.updateStartAndStateByFid(req.fid, req.action.timestamp, cubeState.toString());
          } else {
            faceCode.map(code => {
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
            await table.updateCurrentStateByFid(req.fid, cubeState.toString());
            cubeView = new CubeView(cubeState.state);
          }
        }
      }

      let buttons = [
        { text: "Run" },
        { text: "Leaderboard" },
        { text: "Guide", action:"link", target:"https://github.com/onchainyaotoshi/frame-cube?tab=readme-ov-file"}
      ];

      let postUrl = `${process.env.FC_DOMAIN}/rubic/1`;

      let input = { placeholder: "Commands" };

      if (cubeState.isSolved()) {
        postUrl = `${process.env.FC_DOMAIN}/rubic/2`;
        await table.finish(req.fid, req.action.timestamp);
        buttons = [
          {
            text: 'Claim Reward'
          }
        ];
        input = undefined;
      }

      let frame = {
        title: "Rubic's pages",
        image: `data:image/png;base64,${cubeView.renderToPNG().toString('base64')}`,
        postUrl: postUrl,
        buttons: buttons,
        input: input
      }

      return res.render('index', frame);
    } else if (id == 2) {
      const isClaimed = await table.isRewardClaimed(req.fid);
      // console.log("isClaimed", isClaimed);
      if (!isClaimed) {
        const { trustedData } = req.body;
        const result = await req.client.validateFrameAction(trustedData.messageBytes);
        if (result.valid) {
          const to = result.action.interactor.custody_address;

          //By given tx_hash = 0, to prevent multiple claim attacks.
          const recordId = await table.updateAddressAndTxHash(req.fid, to, "0");
          req.wallet.sendErc20(req.isLive() ? (Math.round(Math.random()) === 0 ? "frame" : "toshi") : "test", to, "1");

          // const txHash = await req.wallet.sendErc20("test", to, "1");
          // table.updateGame(recordId, { tx_hash: txHash });

          return res.render('index', {
            title: "Rubic's Cube",
            image: await req.textToDataUri("Initiate a reward claim request."),
            postUrl: `${process.env.FC_DOMAIN}/rubic/0`,
            buttons: [
              { text: "Play Again" },
              { text: "Transactions", action: "link", target: `${process.env.NETWORK_EXPLORER}/address/${process.env.WALLET_ADDRESS}` }
            ]
          });
        } else {
          res.status(400).json({ error: 'Invalid data provided' }); // Data is invalid
        }
      } else {
        return res.render('index', {
          title: "Rubic's Cube",
          image: await req.textToDataUri("You've claimed your reward, one per wallet."),
          postUrl: `${process.env.FC_DOMAIN}/rubic/0`,
          buttons: [
            { text: "Play Again" },
          ]
        });
      }
    } else {
      return res.status(400).json({ error: 'id invalid' }); // Data is invalid
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error }); // Internal server error or custom error message
  }
}