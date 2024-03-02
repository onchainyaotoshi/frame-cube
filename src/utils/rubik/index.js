import CubeView from '@utils/rubik/cube-view.js'; // Adjust the path accordingly
import CubeState from '@utils/rubik/cube-state.js';

export default class Rubik{
    constructor(state,totalScrambleMove) {
        if(typeof state === "string"){
            this._state = CubeState.fromString(state);
        }else if(Array.isArray(state)){
            this._state = CubeState(state);
        }else{
            let scrambleLength;
            if(typeof totalScrambleMove === undefined){
                scrambleLength = Math.floor(Math.random() * (60 - 30 + 1)) + 30; // Random number between 50 and 100
            }else{
                scrambleLength = totalScrambleMove;
            }
            this._state = new CubeState();
            this._state.scramble(1);
        }
    }

    renderToBase64(){
        return (new CubeView(this._state.state)).renderToBase64();
    }

    renderToPNG(){
        return (new CubeView(this._state.state)).renderToPNG();
    }

    toString(){
        return this._state.toString();
    }

    move(code){
        return this._state.moveActions.executeMove(code);
    }

    isSolved(){
        return this._state.isSolved();
    }

    getMoveCodes(){
        return this._state.moveActions.getMoveCodes();
    }
}