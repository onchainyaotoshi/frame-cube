import CubeView from '@utils/rubik/cube-view.js'; // Adjust the path accordingly
import CubeState from '@utils/rubik/cube-state.js';

export default class Rubik{
    constructor(state,totalScrambleMove) {
        if(typeof state === "string"){
            this.state = CubeState.fromString(state);
        }else if(Array.isArray(state)){
            this.state = CubeState(state);
        }else{
            this.state = new CubeState();
            this.state.scramble(totalScrambleMove);
        }
    }

    renderToBase64(){
        return (new CubeView(this.state.state)).renderToBase64();
    }

    renderToPNG(){
        return (new CubeView(this.state.state)).renderToPNG();
    }
}