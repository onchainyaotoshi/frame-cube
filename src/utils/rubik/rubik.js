import CubeView from '@utils/rubik/cube-view.js'; // Adjust the path accordingly
import CubeState from '@utils/rubik/cube-state.js';

export default class Rubik{
    constructor(state,totalScrambleMove) {
        if(typeof state === "string"){
            this.state = CubeState.fromString(state);
        }else{
            this.state = new CubeState();
            this.state.scramble(totalScrambleMove);
        }
        
        this.view = new CubeView(this.state.state);
    }
}