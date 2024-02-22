import _ from 'lodash';

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
        const moveCount = MOVES.length;

        let scrambleMoves = '';

        // Perform the specified number of random moves
        for (let i = 0; i < numMoves; i++) {
            const randomMove = MOVES[Math.floor(Math.random() * moveCount)]; // Select a random move
            const randomDirection = Math.random() < 0.5 ? true : false; // Randomly choose clockwise or counterclockwise

            // Perform the move
            this.rotateFaceByCode(randomMove, randomDirection);

            // Add the move to the scramble sequence
            scrambleMoves += randomMove + (randomDirection ? ' ' : "'");
        }

        return scrambleMoves.trim(); // Return the scramble sequence
    }

    // Rotate a face by its code in either clockwise or counterclockwise direction
    rotateFaceByCode(faceCode, clockwise = true) {
        switch (faceCode) {
            case 'F':
                this.rotateF(clockwise);
                break;
            case 'L':
                this.rotateL(clockwise);
                break;
            case 'B':
                this.rotateB(clockwise);
                break;
            case 'R':
                this.rotateR(clockwise);
                break;
            case 'U':
                this.rotateU(clockwise);
                break;
            case 'D':
                this.rotateD(clockwise);
                break;
            case 'M':
                this.rotateM(clockwise);
                break;
            case 'E':
                this.rotateE(clockwise);
                break;
            case 'S':
                this.rotateS(clockwise);
                break;
            default:
                break;
        }
    }

    // Rotate a single face of the cube 90 degrees in either direction
    rotateFace(face, clockwise) {
        // If rotating clockwise, transpose the matrix and reverse each row
        if (clockwise) {
            //0 0 -> 2 0
            //0 1 -> 1 0
            //0 2 -> 0 0

            //1 0 -> 2 1
            //1 1 -> 1 1
            //1 2 -> 0 1
            
            //2 0 -> 2 2
            //2 1 -> 1 2
            //2 2 -> 0 2

            return face.map((row, rowIndex) => row.map((val, colIndex) => face[2 - colIndex][rowIndex]));
        } else {
            // If rotating counterclockwise, transpose the matrix and reverse each column

            //0 0 -> 0 2
            //0 1 -> 1 2
            //0 2 -> 2 2

            //1 0 -> 0 1
            //1 1 -> 1 1
            //1 2 -> 2 1
            
            //2 0 -> 0 0
            //2 1 -> 1 0
            //2 2 -> 2 0

            return face.map((row, rowIndex) => row.map((val, colIndex) => face[colIndex][2 - rowIndex]));
        }
    }

    // Rotate the front face itself
    rotateF(clockwise = true) {
        this.state.front = this.rotateFace(this.state.front, clockwise);

        const { left, right, up, down } = _.cloneDeep(this.state);

        if (clockwise) {
            this.state.left[0][2] = up[2][2];
            this.state.left[1][2] = up[2][1];
            this.state.left[2][2] = up[2][0];

            this.state.right[0][0] = down[0][2];
            this.state.right[1][0] = down[0][1];
            this.state.right[2][0] = down[0][0];

            this.state.up[2][0] = right[0][0];
            this.state.up[2][1] = right[1][0];
            this.state.up[2][2] = right[2][0];
            
            this.state.down[0][0] = left[0][2];
            this.state.down[0][1] = left[1][2];
            this.state.down[0][2] = left[2][2];
        }else{
            this.state.left[0][2] = down[0][0];
            this.state.left[1][2] = down[0][1];
            this.state.left[2][2] = down[0][2];

            this.state.right[0][0] = up[2][0];
            this.state.right[1][0] = up[2][1];
            this.state.right[2][0] = up[2][2];

            this.state.up[2][0] = left[2][2];
            this.state.up[2][1] = left[1][2];
            this.state.up[2][2] = left[0][2];
            
            this.state.down[0][0] = right[2][0];
            this.state.down[0][1] = right[1][0];
            this.state.down[0][2] = right[0][0];
        }
    }
    
    // Rotate the left face itself
    rotateL(clockwise = true) {
        this.state.left = this.rotateFace(this.state.left, clockwise);

        const { back, front, up, down } = _.cloneDeep(this.state);

        if (clockwise) {
            this.state.back[0][0] = up[0][0];
            this.state.back[1][0] = up[1][0];
            this.state.back[2][0] = up[2][0];

            this.state.front[0][0] = down[0][0];
            this.state.front[1][0] = down[1][0];
            this.state.front[2][0] = down[2][0];

            this.state.up[0][0] = front[0][0];
            this.state.up[1][0] = front[1][0];
            this.state.up[2][0] = front[2][0];
            
            this.state.down[0][0] = back[0][0];
            this.state.down[1][0] = back[1][0];
            this.state.down[2][0] = back[2][0];
        }else{
            this.state.back[0][0] = down[0][0];
            this.state.back[1][0] = down[1][0];
            this.state.back[2][0] = down[2][0];

            this.state.front[0][0] = up[0][0];
            this.state.front[1][0] = up[1][0];
            this.state.front[2][0] = up[2][0];

            this.state.up[0][0] = back[0][0];
            this.state.up[1][0] = back[1][0];
            this.state.up[2][0] = back[2][0];
            
            this.state.down[0][0] = front[0][0];
            this.state.down[1][0] = front[1][0];
            this.state.down[2][0] = front[2][0];
        }
    }

    // Rotate the back face itself
    rotateB(clockwise = true) {
        this.state.back = this.rotateFace(this.state.back, clockwise);

        const { right, left, up, down } = _.cloneDeep(this.state);

        if (clockwise) {
            this.state.right[0][2] = down[2][2];
            this.state.right[1][2] = down[2][1];
            this.state.right[2][2] = down[2][0];

            this.state.left[0][0] = up[0][2];
            this.state.left[1][0] = up[0][1];
            this.state.left[2][0] = up[0][0];

            this.state.up[0][0] = right[0][2];
            this.state.up[0][1] = right[1][2];
            this.state.up[0][2] = right[2][2];
            
            this.state.down[2][0] = left[0][0];
            this.state.down[2][1] = left[1][0];
            this.state.down[2][2] = left[2][0];
        }else{
            this.state.right[0][2] = up[0][0];
            this.state.right[1][2] = up[0][1];
            this.state.right[2][2] = up[0][2];

            this.state.left[0][0] = down[2][0];
            this.state.left[1][0] = down[2][1];
            this.state.left[2][0] = down[2][2];

            this.state.up[0][0] = left[2][0];
            this.state.up[0][1] = left[1][0];
            this.state.up[0][2] = left[0][0];
            
            this.state.down[2][0] = right[2][2];
            this.state.down[2][1] = right[1][2];
            this.state.down[2][2] = right[0][2];
        }
    }
    
    // Rotate the right face itself
    rotateR(clockwise = true) {
        
        this.state.right = this.rotateFace(this.state.right, clockwise);

        const { front, back, up, down } = _.cloneDeep(this.state);

        if (clockwise) {
            this.state.front[0][2] = down[0][2];
            this.state.front[1][2] = down[1][2];
            this.state.front[2][2] = down[2][2];

            this.state.back[0][2] = up[0][2];
            this.state.back[1][2] = up[1][2];
            this.state.back[2][2] = up[2][2];

            this.state.up[0][2] = front[0][2];
            this.state.up[1][2] = front[1][2];
            this.state.up[2][2] = front[2][2];
            
            this.state.down[0][2] = back[0][2];
            this.state.down[1][2] = back[1][2];
            this.state.down[2][2] = back[2][2];
        }else{
            
            this.state.front[0][2] = up[0][2];
            this.state.front[1][2] = up[1][2];
            this.state.front[2][2] = up[2][2];

            this.state.back[0][2] = down[0][2];
            this.state.back[1][2] = down[1][2];
            this.state.back[2][2] = down[2][2];

            this.state.up[0][2] = back[0][2];
            this.state.up[1][2] = back[1][2];
            this.state.up[2][2] = back[2][2];
            
            this.state.down[0][2] = front[0][2];
            this.state.down[1][2] = front[1][2];
            this.state.down[2][2] = front[2][2];
        }
    }

    // Rotate the up face itself
    rotateU(clockwise = true) {
        
        this.state.up = this.rotateFace(this.state.up, clockwise);

        const { left, back, right, front } = _.cloneDeep(this.state);

        if (clockwise) {
            this.state.left[0][0] = front[0][0];
            this.state.left[0][1] = front[0][1];
            this.state.left[0][2] = front[0][2];

            this.state.back[2][0] = left[0][2];
            this.state.back[2][1] = left[0][1];
            this.state.back[2][2] = left[0][0];

            this.state.right[0][0] = back[2][2];
            this.state.right[0][1] = back[2][1];
            this.state.right[0][2] = back[2][0];
            
            this.state.front[0][0] = right[0][0];
            this.state.front[0][1] = right[0][1];
            this.state.front[0][2] = right[0][2];
        }else{
            this.state.left[0][0] = back[2][2];
            this.state.left[0][1] = back[2][1];
            this.state.left[0][2] = back[2][0];

            this.state.back[2][0] = right[0][2];
            this.state.back[2][1] = right[0][1];
            this.state.back[2][2] = right[0][0];

            this.state.right[0][0] = front[0][0];
            this.state.right[0][1] = front[0][1];
            this.state.right[0][2] = front[0][2];
            
            this.state.front[0][0] = left[0][0];
            this.state.front[0][1] = left[0][1];
            this.state.front[0][2] = left[0][2];
        }
    }
    
    // Rotate the down face itself
    rotateD(clockwise = true) {
        
        this.state.down = this.rotateFace(this.state.down, clockwise);

        const { left, back, right, front } = _.cloneDeep(this.state);

        if (clockwise) {
            this.state.left[2][0] = front[2][0];
            this.state.left[2][1] = front[2][1];
            this.state.left[2][2] = front[2][2];

            this.state.back[0][0] = left[2][2];
            this.state.back[0][1] = left[2][1];
            this.state.back[0][2] = left[2][0];

            this.state.right[2][0] = back[0][2];
            this.state.right[2][1] = back[0][1];
            this.state.right[2][2] = back[0][0];
            
            this.state.front[2][0] = right[2][0];
            this.state.front[2][1] = right[2][1];
            this.state.front[2][2] = right[2][2];

        }else{
            
            this.state.left[2][0] = back[0][2];
            this.state.left[2][1] = back[0][1];
            this.state.left[2][2] = back[0][0];

            this.state.back[0][0] = right[2][2];
            this.state.back[0][1] = right[2][1];
            this.state.back[0][2] = right[2][0];

            this.state.right[2][0] = front[2][0];
            this.state.right[2][1] = front[2][1];
            this.state.right[2][2] = front[2][2];
            
            this.state.front[2][0] = left[2][0];
            this.state.front[2][1] = left[2][1];
            this.state.front[2][2] = left[2][2];
        }
    }

    // middle layer between L and R
    rotateM(clockwise = true) {
        const { front, back, up, down } = _.cloneDeep(this.state);

        if(clockwise){
            this.state.front[0][1] = down[0][1];
            this.state.front[1][1] = down[1][1];
            this.state.front[2][1] = down[2][1];

            this.state.back[0][1] = up[0][1];
            this.state.back[1][1] = up[1][1];
            this.state.back[2][1] = up[2][1];

            this.state.up[0][1] = front[0][1];
            this.state.up[1][1] = front[1][1];
            this.state.up[2][1] = front[2][1];

            this.state.down[0][1] = back[0][1];
            this.state.down[1][1] = back[1][1];
            this.state.down[2][1] = back[2][1];
        }else{
            this.state.front[0][1] = up[0][1];
            this.state.front[1][1] = up[1][1];
            this.state.front[2][1] = up[2][1];

            this.state.back[0][1] = down[0][1];
            this.state.back[1][1] = down[1][1];
            this.state.back[2][1] = down[2][1];

            this.state.up[0][1] = back[0][1];
            this.state.up[1][1] = back[1][1];
            this.state.up[2][1] = back[2][1];

            this.state.down[0][1] = front[0][1];
            this.state.down[1][1] = front[1][1];
            this.state.down[2][1] = front[2][1];

        }
    }
    
    // middle layer between U and D
    rotateE(clockwise = true) {
        const { front, left, back, right } = _.cloneDeep(this.state);

        if(clockwise){
            this.state.front[1][0] = right[1][0];
            this.state.front[1][1] = right[1][1];
            this.state.front[1][2] = right[1][2];

            this.state.left[1][0] = front[1][0];
            this.state.left[1][1] = front[1][1];
            this.state.left[1][2] = front[1][2];
            
            this.state.back[1][0] = left[1][2];
            this.state.back[1][1] = left[1][1];
            this.state.back[1][2] = left[1][0];

            this.state.right[1][0] = back[1][2];
            this.state.right[1][1] = back[1][1];
            this.state.right[1][2] = back[1][0];

        }else{
            this.state.front[1][0] = left[1][0];
            this.state.front[1][1] = left[1][1];
            this.state.front[1][2] = left[1][2];

            this.state.left[1][0] = back[1][0];
            this.state.left[1][1] = back[1][1];
            this.state.left[1][2] = back[1][2];
            
            this.state.back[1][0] = right[1][2];
            this.state.back[1][1] = right[1][1];
            this.state.back[1][2] = right[1][0];

            this.state.right[1][0] = front[1][2];
            this.state.right[1][1] = front[1][1];
            this.state.right[1][2] = front[1][0];
        }
    }
    
    //middle layer between F and B
    rotateS(clockwise = true) {
        const { left, right, up, down } = _.cloneDeep(this.state);

        if(clockwise){
            this.state.left[0][1] = up[1][2];
            this.state.left[1][1] = up[1][1];
            this.state.left[2][1] = up[1][0];

            this.state.right[0][1] = down[1][2];
            this.state.right[1][1] = down[1][1];
            this.state.right[2][1] = down[1][0];
            
            this.state.up[1][0] = right[0][1];
            this.state.up[1][1] = right[1][1];
            this.state.up[1][2] = right[2][1];

            this.state.down[1][0] = left[0][1];
            this.state.down[1][1] = left[1][1];
            this.state.down[1][2] = left[2][1];
        }else{
            
            this.state.left[0][1] = down[1][0];
            this.state.left[1][1] = down[1][1];
            this.state.left[2][1] = down[1][2];

            this.state.right[0][1] = up[1][0];
            this.state.right[1][1] = up[1][1];
            this.state.right[2][1] = up[1][2];
            
            this.state.up[1][0] = left[2][1];
            this.state.up[1][1] = left[1][1];
            this.state.up[1][2] = left[0][1];

            this.state.down[1][0] = right[2][1];
            this.state.down[1][1] = right[1][1];
            this.state.down[1][2] = right[0][1];
        }
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
