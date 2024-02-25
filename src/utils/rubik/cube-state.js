import _ from 'lodash';
import CubeMoveActions from '@utils/rubik/cube-move-actions.js';

export const FACES = ['front', 'left', 'back', 'right', 'up', 'down'];
export const MOVES = [
    'F',//front
    'L',//left
    'B',//back
    'R',//right
    'U',//up
    'D',//down
    'M',//This refers to the rotation of the middle layer parallel to the L (Left) and R (Right) faces
    'E',//This refers to the rotation of the equatorial layer that is parallel to the U (Up) and D (Down) faces
    'S' //This refers to the rotation of the standing layer between the F (Front) and B (Back) faces
]; // Possible moves

/**
 * 2D state representation
    UUU
    UUU
    UUU
LLL FFF RRR BBB
LLL FFF RRR BBB
LLL FFF RRR BBB
    DDD
    DDD
    DDD
 */
class CubeState {
     // Initialize the CubeState with an optional initialState or generate a new solved state
     constructor(initialState = null) {
        // List of color codes used in the cube
        this.colors = ['R','G','O','B','W', 'Y'];
        // Cube state represented as a 2D array for each face

        if(initialState != null){
            this.state = initialState;
        }else{
            this.state = this.generateInitialState();
        }

        // Instantiate MoveActions
        this.moveActions = new CubeMoveActions(this.state);
    }

    // Generate a solved initial state with each face having a uniform color
    generateInitialState() {
        let state = {};
        this.colors.forEach((color, index) => {
            // Assign a color to each face based on its index
            let face = this.getFaceByIndex(index);
            // Create a 3x3 array filled with the face's color
            state[face] = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => color));
        });
        
        return state;
    }

    // Utility function to get the name of a face based on its index
    getFaceByIndex(index) {
        return FACES[index];
    }

    getColor(face,x,y){
        return this.state[face][x][y];
    }

    // Scramble the cube with a specified number of random moves
    scramble(numMoves = 20) {
        let scrambleMoves = '';
        let lastMoveFace = '';
        let availableMoves = this.moveActions.getMoveCodes();

        for (let i = 0; i < numMoves; i++) {
            let randomMove;
            do {
                randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            } while (randomMove[0] === lastMoveFace); // Avoid repeating moves for the same face

            // Perform the move
            this.moveActions.executeMove(randomMove);

            // Add the move to the scramble sequence
            scrambleMoves += randomMove + ' ';

            // Update lastMoveFace to the face of the last move to prevent consecutive moves on the same face
            lastMoveFace = randomMove[0];
        }

        return scrambleMoves.trim(); // Return the scramble sequence
    }

    // Check if the cube is solved (all faces have a uniform color)
    isSolved() {
        return Object.values(this.state).every(face => {
            const firstColor = face[0][0];
            return face.every(row => row.every(color => color === firstColor));
        });
    }

    // Convert the cube's state to a string representation for storage or comparison
    toString() {
        let stateString = '';
        FACES.forEach(face => {
            this.state[face].forEach(row => {
                row.forEach(color => {
                    stateString += color;
                });
            });
            stateString += '|'; // Use '|' as a separator between faces
        });
        return stateString.slice(0, -1); // Remove the last separator
    }

    // Reconstruct the cube's state from a string representation
    static fromString(stateString) {
        const colors = stateString.split('|'); // Split the string by the face separator
        let state = {};

        FACES.forEach((face, index) => {
            state[face] = [];
            for (let i = 0; i < 9; i += 3) { // Process each face's colors in rows of 3
                state[face].push(colors[index].slice(i, i + 3).split('')); // Convert string segments back into rows of colors
            }
        });

        return new CubeState(state);
    }
}

export default CubeState
