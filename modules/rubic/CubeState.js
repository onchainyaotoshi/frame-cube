class CubeState {
     // Initialize the CubeState with an optional initialState or generate a new solved state
     constructor(initialState = null) {
        // Mapping of color codes to their respective hex values for easy reference
        this.colorMap = {
            'R': 0xff0000, // Red
            'G': 0x00ff00, // Green
            'B': 0x0000ff, // Blue
            'O': 0xffa500, // Orange
            'Y': 0xffff00, // Yellow
            'W': 0xffffff  // White
        };
        // List of color codes used in the cube
        this.colors = ['R', 'G', 'B', 'O', 'Y', 'W'];
        // Cube state represented as a 2D array for each face

        if(initialState != null){
            this.state = initialState;
        }else{
            this.state = this.generateInitialState();
            this.scramble(20);
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
        const faces = ['front', 'right', 'back', 'left', 'top', 'bottom'];
        return faces[index];
    }

    // Scramble the cube with a specified number of random moves
    scramble(numMoves) {
        const moves = ['U', 'F', 'B', 'L', 'R', 'D', 'M', 'E', 'S']; // Possible moves
        const moveCount = moves.length;

        let scrambleMoves = '';

        // Perform the specified number of random moves
        for (let i = 0; i < numMoves; i++) {
            const randomMove = moves[Math.floor(Math.random() * moveCount)]; // Select a random move
            const randomDirection = Math.random() < 0.5 ? true : false; // Randomly choose clockwise or counterclockwise

            // Perform the move
            this.rotateFaceByCode(randomMove, randomDirection);

            // Add the move to the scramble sequence
            scrambleMoves += randomMove + (randomDirection ? ' ' : "'");
        }

        return scrambleMoves.trim(); // Return the scramble sequence
    }

    // Rotate a face by its code (e.g., 'U', 'F', 'B', 'L', 'R', 'D') in either clockwise or counterclockwise direction
    rotateFaceByCode(faceCode, clockwise = true) {
        switch (faceCode) {
            case 'U':
                this.rotateU(clockwise);
                break;
            case 'F':
                this.rotateF(clockwise);
                break;
            case 'B':
                this.rotateB(clockwise);
                break;
            case 'L':
                this.rotateL(clockwise);
                break;
            case 'R':
                this.rotateR(clockwise);
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
            return face.map((row, rowIndex) => row.map((val, colIndex) => face[2 - colIndex][rowIndex]));
        } else {
            // If rotating counterclockwise, transpose the matrix and reverse each column
            return face.map((row, rowIndex) => row.map((val, colIndex) => face[colIndex][2 - rowIndex]));
        }
    }

    // Rotate the top (U) face of the cube
    rotateU(clockwise = true) {
        // Rotate the top face itself
        this.state.top = this.rotateFace(this.state.top, clockwise);

        // Adjust stickers on the adjacent faces to match the rotation
        const { front, right, back, left } = this.state;
        const temp = front[0].slice();  // Temporary storage for one face's edge

        if (clockwise) {
            // Shift the edges clockwise
            front[0] = left[0].slice();
            left[0] = back[0].slice();
            back[0] = right[0].slice();
            right[0] = temp;
        } else {
            // Shift the edges counterclockwise
            front[0] = right[0].slice();
            right[0] = back[0].slice();
            back[0] = left[0].slice();
            left[0] = temp;
        }
    }

    // Rotate the front (F) face of the cube
    rotateF(clockwise = true) {
        // Rotate the front face itself
        this.state.front = this.rotateFace(this.state.front, clockwise);

        // Adjust stickers on the top, left, bottom, and right faces to match the rotation
        const { top, left, bottom, right } = this.state;
        const temp = top[2].slice();  // Temporary storage for one face's edge

        if (clockwise) {
            // Shift the edges clockwise
            top[2] = left.map(row => row[2]).reverse();
            left.forEach((row, i) => row[2] = bottom[0][i]);
            bottom[0] = right.map(row => row[0]).reverse();
            right.forEach((row, i) => row[0] = temp[i]);
        } else {
            // Shift the edges counterclockwise
            top[2] = right.map(row => row[0]);
            right.forEach((row, i) => row[0] = bottom[0][2 - i]);
            bottom[0] = left.map(row => row[2]).reverse();
            left.forEach((row, i) => row[2] = temp[2 - i]);
        }
    }
    
    rotateB(clockwise = true) {
        // Rotate the back face
        this.state.back = this.rotateFace(this.state.back, clockwise);
    
        const { top, left, bottom, right } = this.state;
        const temp = top[0].slice();
    
        if (clockwise) {
            top[0] = right.map(row => row[2]);
            right.forEach((row, i) => row[2] = bottom[2][2 - i]);
            bottom[2] = left.map(row => row[0]).reverse();
            left.forEach((row, i) => row[0] = temp[i]);
        } else {
            top[0] = left.map(row => row[0]).reverse();
            left.forEach((row, i) => row[0] = bottom[2][i]);
            bottom[2] = right.map(row => row[2]);
            right.forEach((row, i) => row[2] = temp[2 - i]);
        }
    }
    
    rotateL(clockwise = true) {
        // Rotate the left face
        this.state.left = this.rotateFace(this.state.left, clockwise);
    
        const { top, front, bottom, back } = this.state;
        const temp = top.map(row => row[0]);
    
        if (clockwise) {
            top.forEach((row, i) => row[0] = back[2 - i][2]);
            back.forEach((row, i) => row[2] = bottom[i][0]);
            bottom.forEach((row, i) => row[0] = front[i][0]);
            front.forEach((row, i) => row[0] = temp[i]);
        } else {
            top.forEach((row, i) => row[0] = front[i][0]);
            front.forEach((row, i) => row[0] = bottom[i][0]);
            bottom.forEach((row, i) => row[0] = back[2 - i][2]);
            back.forEach((row, i) => row[2] = temp[i]);
        }
    }
    
    rotateR(clockwise = true) {
        // Rotate the right face
        this.state.right = this.rotateFace(this.state.right, clockwise);
    
        const { top, front, bottom, back } = this.state;
        const temp = top.map(row => row[2]);
    
        if (clockwise) {
            top.forEach((row, i) => row[2] = front[i][2]);
            front.forEach((row, i) => row[2] = bottom[i][2]);
            bottom.forEach((row, i) => row[2] = back[2 - i][0]);
            back.forEach((row, i) => row[0] = temp[i]);
        } else {
            top.forEach((row, i) => row[2] = back[2 - i][0]);
            back.forEach((row, i) => row[0] = bottom[i][2]);
            bottom.forEach((row, i) => row[2] = front[i][2]);
            front.forEach((row, i) => row[2] = temp[i]);
        }
    }
    
    rotateD(clockwise = true) {
        // Rotate the bottom face
        this.state.bottom = this.rotateFace(this.state.bottom, clockwise);
    
        const { front, left, back, right } = this.state;
        const temp = front[2].slice();
    
        if (clockwise) {
            front[2] = right[2].slice();
            right[2] = back[2].slice();
            back[2] = left[2].slice();
            left[2] = temp;
        } else {
            front[2] = left[2].slice();
            left[2] = back[2].slice();
            back[2] = right[2].slice();
            right[2] = temp;
        }
    }

    rotateM(clockwise = true) {
        // Rotate the M slice (middle layer between L and R)
        const { top, front, bottom, back } = this.state;
        const temp = top.map(row => row[1]);
    
        if (clockwise) {
            top.forEach((row, i) => row[1] = front[i][1]);
            front.forEach((row, i) => row[1] = bottom[i][1]);
            bottom.forEach((row, i) => row[1] = back[2 - i][1]);
            back.forEach((row, i) => row[1] = temp[2 - i]);
        } else {
            top.forEach((row, i) => row[1] = back[2 - i][1]);
            back.forEach((row, i) => row[1] = bottom[2 - i][1]);
            bottom.forEach((row, i) => row[1] = front[i][1]);
            front.forEach((row, i) => row[1] = temp[i]);
        }
    }
    
    rotateE(clockwise = true) {
        // Rotate the E slice (equatorial layer between U and D)
        const { front, left, back, right } = this.state;
        const temp = front[1].slice();
    
        if (clockwise) {
            front[1] = right[1].slice();
            right[1] = back[1].slice();
            back[1] = left[1].slice();
            left[1] = temp;
        } else {
            front[1] = left[1].slice();
            left[1] = back[1].slice();
            back[1] = right[1].slice();
            right[1] = temp;
        }
    }
    
    rotateS(clockwise = true) {
        // Rotate the S slice (standing layer between F and B)
        const { top, right, bottom, left } = this.state;
        const temp = top[1].slice();
    
        if (clockwise) {
            top[1] = left.map(row => row[1]).reverse();
            left.forEach((row, i) => row[1] = bottom[1][i]);
            bottom[1] = right.map(row => row[1]).reverse();
            right.forEach((row, i) => row[1] = temp[i]);
        } else {
            top[1] = right.map(row => row[1]);
            right.forEach((row, i) => row[1] = bottom[1][2 - i]);
            bottom[1] = left.map(row => row[1]);
            left.forEach((row, i) => row[1] = temp[2 - i]);
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
        this.faces.forEach(face => {
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
        const faces = ['front', 'right', 'back', 'left', 'top', 'bottom'];
        const colors = stateString.split('|'); // Split the string by the face separator
        let state = {};

        faces.forEach((face, index) => {
            state[face] = [];
            for (let i = 0; i < 9; i += 3) { // Process each face's colors in rows of 3
                state[face].push(colors[index].slice(i, i + 3).split('')); // Convert string segments back into rows of colors
            }
        });

        return new CubeState(state);
    }
}

export default CubeState;
