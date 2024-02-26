

export default class CubeMoveActions {
    constructor(state) {
        // Define the mapping from face codes to method names within the class
        this.moveMap = {
            "F": "rotateF",
            "L": "rotateL",
            "B": "rotateB",
            "R": "rotateR",
            "U": "rotateU",
            "D": "rotateD",
            "M": "rotateM",
            "E": "rotateE",
            "S": "rotateS",
            "F'": "rotateF",
            "L'": "rotateL",
            "B'": "rotateB",
            "R'": "rotateR",
            "U'": "rotateU",
            "D'": "rotateD",
            "M'": "rotateM",
            "E'": "rotateE",
            "S'": "rotateS",
            "x": "rotatex",
            "y": "rotatey",
            "z": "rotatez",
        };

        this.state = state
    }

    // Method to execute the move based on the move code
    executeMove(moveCode, clockwise = true) {
        // Use the moveMap to get the corresponding method name
        const methodName = this.moveMap[moveCode];
        // Check if the method exists to avoid errors
        if (methodName && typeof this[methodName] === "function") {
            if(moveCode[1] == "'"){
                this[methodName](false);
            }else{
                this[methodName](true);
            }
            return true;
        }

        return false;
    }

    // Function to get moveMap keys as an array
    getMoveCodes() {
        return Object.keys(this.moveMap);
    }

    // Rotate a single face of the cube 90 degrees in either direction
    rotateFace(face, clockwise) {
        if (clockwise) {
            // Clockwise rotation: Transpose the matrix and reverse each row
            // For example, the transformation of indices for clockwise rotation is as follows:
            // 0,0 -> 0,2 | 0,1 -> 1,2 | 0,2 -> 2,2
            // 1,0 -> 0,1 | 1,1 -> 1,1 | 1,2 -> 2,1
            // 2,0 -> 0,0 | 2,1 -> 1,0 | 2,2 -> 2,0
            return [
                [face[2][0],face[1][0],face[0][0]],
                [face[2][1],face[1][1],face[0][1]],
                [face[2][2],face[1][2],face[0][2]]
            ];
        } else {
            // Counterclockwise rotation: Transpose the matrix and reverse each column
            // For example, the transformation of indices for counterclockwise rotation is as follows:
            // 0,0 -> 2,0 | 0,1 -> 1,0 | 0,2 -> 0,0
            // 1,0 -> 2,1 | 1,1 -> 1,1 | 1,2 -> 0,1
            // 2,0 -> 2,2 | 2,1 -> 1,2 | 2,2 -> 0,2
            return [
                [face[0][2],face[1][2],face[2][2]],
                [face[0][1],face[1][1],face[2][1]],
                [face[0][0],face[1][0],face[2][0]]
            ];
        }
    }
    
    rotateF(clockwise = true) {
        // Rotate the front face
        this.state.front = this.rotateFace(this.state.front, clockwise);
    
        if (clockwise) {
            // Clockwise rotation
            let temp = this.state.up[2].slice();
    
            // Up to Right
            // up[2][0] -> right[0][0] | up[2][1] -> right[1][0] | up[2][2] -> right[2][0]
            this.state.up[2] = [this.state.left[2][2], this.state.left[1][2], this.state.left[0][2]];
    
            // Left to Up
            // left[0][2] -> up[2][0] | left[1][2] -> up[2][1] | left[2][2] -> up[2][2]
            this.state.left[0][2] = this.state.down[0][0];
            this.state.left[1][2] = this.state.down[0][1];
            this.state.left[2][2] = this.state.down[0][2];
    
            // Down to Left
            // down[0][0] -> left[2][2] | down[0][1] -> left[1][2] | down[0][2] -> left[0][2]
            this.state.down[0] = [this.state.right[0][0], this.state.right[1][0], this.state.right[2][0]];
    
            // Right to Down
            // right[0][0] -> down[0][0] | right[1][0] -> down[0][1] | right[2][0] -> down[0][2]
            this.state.right[0][0] = temp[0];
            this.state.right[1][0] = temp[1];
            this.state.right[2][0] = temp[2];
        } else {
            // Counterclockwise rotation
            let temp = this.state.up[2].slice();
    
            // Right to Up
            // right[0][0] -> up[2][0] | right[1][0] -> up[2][1] | right[2][0] -> up[2][2]
            this.state.up[2] = [this.state.right[0][0], this.state.right[1][0], this.state.right[2][0]];
    
            // Down to Right
            // down[0][2] -> right[0][0] | down[0][1] -> right[1][0] | down[0][0] -> right[2][0]
            this.state.right[0][0] = this.state.down[0][2];
            this.state.right[1][0] = this.state.down[0][1];
            this.state.right[2][0] = this.state.down[0][0];
    
            // Left to Down (Note: Order is reversed compared to the clockwise case)
            // left[2][2] -> down[0][0] | left[1][2] -> down[0][1] | left[0][2] -> down[0][2]
            this.state.down[0] = [this.state.left[0][2], this.state.left[1][2], this.state.left[2][2]]
    
            // Up to Left
            // up[2][2] -> left[0][2] | up[2][1] -> left[1][2] | up[2][0] -> left[2][2]
            this.state.left[0][2] = temp[2];
            this.state.left[1][2] = temp[1];
            this.state.left[2][2] = temp[0];
        }
    }
    
    rotateL(clockwise = true) {
    
        // Rotate the left face clockwise
        this.state.left = this.rotateFace(this.state.left, clockwise);

        if (clockwise) {
            // Clockwise rotation
            let temp = [this.state.up[0][0], this.state.up[1][0], this.state.up[2][0]];
    
            // Back to Up (in reversed order because back face is opposite)
            // back[0][2] -> up[0][0] | back[1][2] -> up[1][0] | back[2][2] -> up[2][0]
            this.state.up[0][0] = this.state.back[2][2];
            this.state.up[1][0] = this.state.back[1][2];
            this.state.up[2][0] = this.state.back[0][2];
    
            // Down to Back
            // down[0][0] -> back[2][2] | down[1][0] -> back[1][2] | down[2][0] -> back[0][2]
            this.state.back[0][2] = this.state.down[2][0];
            this.state.back[1][2] = this.state.down[1][0];
            this.state.back[2][2] = this.state.down[0][0];
    
            // Front to Down
            // front[0][0] -> down[0][0] | front[1][0] -> down[1][0] | front[2][0] -> down[2][0]
            this.state.down[0][0] = this.state.front[0][0];
            this.state.down[1][0] = this.state.front[1][0];
            this.state.down[2][0] = this.state.front[2][0];
    
            // Temp to Front
            // temp[0] -> front[0][0] | temp[1] -> front[1][0] | temp[2] -> front[2][0]
            this.state.front[0][0] = temp[0];
            this.state.front[1][0] = temp[1];
            this.state.front[2][0] = temp[2];
        } else {
            // Counterclockwise rotation
            let temp = [this.state.up[0][0], this.state.up[1][0], this.state.up[2][0]];
    
            // Front to Up
            // front[0][0] -> up[0][0] | front[1][0] -> up[1][0] | front[2][0] -> up[2][0]
            this.state.up[0][0] = this.state.front[0][0];
            this.state.up[1][0] = this.state.front[1][0];
            this.state.up[2][0] = this.state.front[2][0];
    
            // Down to Front
            // down[0][0] -> front[0][0] | down[1][0] -> front[1][0] | down[2][0] -> front[2][0]
            this.state.front[0][0] = this.state.down[0][0];
            this.state.front[1][0] = this.state.down[1][0];
            this.state.front[2][0] = this.state.down[2][0];
    
            // Back to Down (in reversed order because back face is opposite)
            // back[2][2] -> down[0][0] | back[1][2] -> down[1][0] | back[0][2] -> down[2][0]
            this.state.down[0][0] = this.state.back[2][2];
            this.state.down[1][0] = this.state.back[1][2];
            this.state.down[2][0] = this.state.back[0][2];
    
            // Temp to Back
            // temp[0] -> back[2][2] | temp[1] -> back[1][2] | temp[2] -> back[0][2]
            this.state.back[0][2] = temp[2];
            this.state.back[1][2] = temp[1];
            this.state.back[2][2] = temp[0];
        }
    }
    
    rotateB(clockwise = true) {
        // Rotate the back face
        this.state.back = this.rotateFace(this.state.back, clockwise);
    
        if (clockwise) {
            // Clockwise rotation
            let temp = [this.state.up[0][2], this.state.up[0][1], this.state.up[0][0]];
    
            // Right to Up
            // right[0][2] -> up[0][2] | right[1][2] -> up[0][1] | right[2][2] -> up[0][0]
            this.state.up[0][2] = this.state.right[0][2];
            this.state.up[0][1] = this.state.right[1][2];
            this.state.up[0][0] = this.state.right[2][2];
    
            // Down to Right
            // down[2][2] -> right[0][2] | down[2][1] -> right[1][2] | down[2][0] -> right[2][2]
            this.state.right[0][2] = this.state.down[2][2];
            this.state.right[1][2] = this.state.down[2][1];
            this.state.right[2][2] = this.state.down[2][0];
    
            // Left to Down (in reversed order because left face is opposite)
            // left[0][0] -> down[2][2] | left[1][0] -> down[2][1] | left[2][0] -> down[2][0]
            this.state.down[2][2] = this.state.left[2][0];
            this.state.down[2][1] = this.state.left[1][0];
            this.state.down[2][0] = this.state.left[0][0];
    
            // Temp to Left
            // temp[0] -> left[2][0] | temp[1] -> left[1][0] | temp[2] -> left[0][0]
            this.state.left[2][0] = temp[2];
            this.state.left[1][0] = temp[1];
            this.state.left[0][0] = temp[0];
        } else {
            // Counterclockwise rotation
            let temp = [this.state.up[0][2], this.state.up[0][1], this.state.up[0][0]];
    
            // Left to Up (in reversed order because left face is opposite)
            // left[2][0] -> up[0][2] | left[1][0] -> up[0][1] | left[0][0] -> up[0][0]
            this.state.up[0][2] = this.state.left[0][0];
            this.state.up[0][1] = this.state.left[1][0];
            this.state.up[0][0] = this.state.left[2][0];
    
            // Down to Left
            // down[2][2] -> left[0][0] | down[2][1] -> left[1][0] | down[2][0] -> left[2][0]
            this.state.left[0][0] = this.state.down[2][0];
            this.state.left[1][0] = this.state.down[2][1];
            this.state.left[2][0] = this.state.down[2][2];
    
            // Right to Down
            // right[0][2] -> down[2][2] | right[1][2] -> down[2][1] | right[2][2] -> down[2][0]
            this.state.down[2][2] = this.state.right[0][2];
            this.state.down[2][1] = this.state.right[1][2];
            this.state.down[2][0] = this.state.right[2][2];
    
            // Temp to Right
            // temp[0] -> right[2][2] | temp[1] -> right[1][2] | temp[2] -> right[0][2]
            this.state.right[2][2] = temp[0];
            this.state.right[1][2] = temp[1];
            this.state.right[0][2] = temp[2];
        }
    }
    
    rotateR(clockwise = true) {
        // Rotate the right face
        this.state.right = this.rotateFace(this.state.right, clockwise);
    
        if (clockwise) {
            // Clockwise rotation
            let temp = [this.state.up[0][2], this.state.up[1][2], this.state.up[2][2]];
    
            // Front to Up
            // front[0][2] -> up[0][2] | front[1][2] -> up[1][2] | front[2][2] -> up[2][2]
            this.state.up[0][2] = this.state.front[0][2];
            this.state.up[1][2] = this.state.front[1][2];
            this.state.up[2][2] = this.state.front[2][2];
    
            // Down to Front
            // down[0][2] -> front[0][2] | down[1][2] -> front[1][2] | down[2][2] -> front[2][2]
            this.state.front[0][2] = this.state.down[0][2];
            this.state.front[1][2] = this.state.down[1][2];
            this.state.front[2][2] = this.state.down[2][2];
    
            // Back to Down (in reversed order because back face is opposite)
            // back[0][0] -> down[2][2] | back[1][0] -> down[1][2] | back[2][0] -> down[0][2]
            this.state.down[0][2] = this.state.back[2][0];
            this.state.down[1][2] = this.state.back[1][0];
            this.state.down[2][2] = this.state.back[0][0];
    
            // Temp to Back (reversed)
            // temp[0] -> back[2][0] | temp[1] -> back[1][0] | temp[2] -> back[0][0]
            this.state.back[0][0] = temp[2];
            this.state.back[1][0] = temp[1];
            this.state.back[2][0] = temp[0];
        } else {
            // Counterclockwise rotation
            let temp = [this.state.up[0][2], this.state.up[1][2], this.state.up[2][2]];
    
            // Back to Up (reversed)
            // back[2][0] -> up[0][2] | back[1][0] -> up[1][2] | back[0][0] -> up[2][2]
            this.state.up[0][2] = this.state.back[2][0];
            this.state.up[1][2] = this.state.back[1][0];
            this.state.up[2][2] = this.state.back[0][0];
    
            // Down to Back
            // down[2][2] -> back[0][0] | down[1][2] -> back[1][0] | down[0][2] -> back[2][0]
            this.state.back[0][0] = this.state.down[2][2];
            this.state.back[1][0] = this.state.down[1][2];
            this.state.back[2][0] = this.state.down[0][2];
    
            // Front to Down
            // front[0][2] -> down[0][2] | front[1][2] -> down[1][2] | front[2][2] -> down[2][2]
            this.state.down[0][2] = this.state.front[0][2];
            this.state.down[1][2] = this.state.front[1][2];
            this.state.down[2][2] = this.state.front[2][2];
    
            // Temp to Front
            // temp[0] -> front[0][2] | temp[1] -> front[1][2] | temp[2] -> front[2][2]
            this.state.front[0][2] = temp[0];
            this.state.front[1][2] = temp[1];
            this.state.front[2][2] = temp[2];
        }
    }

    rotateU(clockwise = true) {
        // Rotate the upper face
        this.state.up = this.rotateFace(this.state.up, clockwise);
    
        if (clockwise) {
            // Clockwise rotation
            let temp = [...this.state.front[0]];
    
            // Right to Front
            // right[0] -> front[0]
            this.state.front[0] = [...this.state.right[0]];
    
            // Back to Right
            // back[0] -> right[0]
            this.state.right[0] = [...this.state.back[0]];
    
            // Left to Back
            // left[0] -> back[0]
            this.state.back[0] = [...this.state.left[0]];
    
            // Temp (Front) to Left
            // temp -> left[0]
            this.state.left[0] = [...temp];
        } else {
            // Counterclockwise rotation
            let temp = [...this.state.front[0]];
    
            // Left to Front
            // left[0] -> front[0]
            this.state.front[0] = [...this.state.left[0]];
    
            // Back to Left
            // back[0] -> left[0]
            this.state.left[0] = [...this.state.back[0]];
    
            // Right to Back
            // right[0] -> back[0]
            this.state.back[0] = [...this.state.right[0]];
    
            // Temp (Front) to Right
            // temp -> right[0]
            this.state.right[0] = [...temp];
        }
    }
    
    rotateD(clockwise = true) {
        // Rotate the down face
        this.state.down = this.rotateFace(this.state.down, clockwise);
    
        if (clockwise) {
            // Clockwise rotation
            let temp = [...this.state.front[2]]; // Copy the last row of the front face
    
            // Left to Front
            // left[2] -> front[2]
            this.state.front[2] = [...this.state.left[2]];
    
            // Back to Left
            // back[2] -> left[2]
            this.state.left[2] = [...this.state.back[2]];
    
            // Right to Back
            // right[2] -> back[2]
            this.state.back[2] = [...this.state.right[2]];
    
            // Temp (Front) to Right
            // temp -> right[2]
            this.state.right[2] = [...temp];
        } else {
            // Counterclockwise rotation
            let temp = [...this.state.front[2]]; // Copy the last row of the front face
    
            // Right to Front
            // right[2] -> front[2]
            this.state.front[2] = [...this.state.right[2]];
    
            // Back to Right
            // back[2] -> right[2]
            this.state.right[2] = [...this.state.back[2]];
    
            // Left to Back
            // left[2] -> back[2]
            this.state.back[2] = [...this.state.left[2]];
    
            // Temp (Front) to Left
            // temp -> left[2]
            this.state.left[2] = [...temp];
        }
    }

    rotateM(clockwise = true) {
        if (clockwise) {
            // Clockwise rotation (equivalent to moving the middle layer in the same direction as an L move)
            let temp = [this.state.up[0][1], this.state.up[1][1], this.state.up[2][1]];
    
            // Back to Up (in reversed order because back face is opposite)
            // back[2][1] -> up[0][1] | back[1][1] -> up[1][1] | back[0][1] -> up[2][1]
            this.state.up[0][1] = this.state.back[2][1];
            this.state.up[1][1] = this.state.back[1][1];
            this.state.up[2][1] = this.state.back[0][1];
    
            // Down to Back
            // down[0][1] -> back[2][1] | down[1][1] -> back[1][1] | down[2][1] -> back[0][1]
            this.state.back[0][1] = this.state.down[2][1];
            this.state.back[1][1] = this.state.down[1][1];
            this.state.back[2][1] = this.state.down[0][1];
    
            // Front to Down
            // front[0][1] -> down[0][1] | front[1][1] -> down[1][1] | front[2][1] -> down[2][1]
            this.state.down[0][1] = this.state.front[0][1];
            this.state.down[1][1] = this.state.front[1][1];
            this.state.down[2][1] = this.state.front[2][1];
    
            // Temp (Up) to Front
            // temp[0] -> front[0][1] | temp[1] -> front[1][1] | temp[2] -> front[2][1]
            this.state.front[0][1] = temp[0];
            this.state.front[1][1] = temp[1];
            this.state.front[2][1] = temp[2];
    
        } else {
            // Counterclockwise rotation (equivalent to moving the middle layer in the opposite direction of an L move)
            let temp = [this.state.up[0][1], this.state.up[1][1], this.state.up[2][1]];
    
            // Front to Up
            // front[0][1] -> up[0][1] | front[1][1] -> up[1][1] | front[2][1] -> up[2][1]
            this.state.up[0][1] = this.state.front[0][1];
            this.state.up[1][1] = this.state.front[1][1];
            this.state.up[2][1] = this.state.front[2][1];
    
            // Down to Front
            // down[0][1] -> front[0][1] | down[1][1] -> front[1][1] | down[2][1] -> front[2][1]
            this.state.front[0][1] = this.state.down[0][1];
            this.state.front[1][1] = this.state.down[1][1];
            this.state.front[2][1] = this.state.down[2][1];
    
            // Back to Down (in reversed order because back face is opposite)
            // back[2][1] -> down[0][1] | back[1][1] -> down[1][1] | back[0][1] -> down[2][1]
            this.state.down[0][1] = this.state.back[2][1];
            this.state.down[1][1] = this.state.back[1][1];
            this.state.down[2][1] = this.state.back[0][1];
    
            // Temp (Up) to Back
            // temp[0] -> back[2][1] | temp[1] -> back[1][1] | temp[2] -> back[0][1]
            this.state.back[0][1] = temp[2];
            this.state.back[1][1] = temp[1];
            this.state.back[2][1] = temp[0];
        }
    }

    rotateE(clockwise = true) {
        if (clockwise) {
            // Clockwise rotation of the equatorial layer is similar to moving the middle layer in the same direction as a D move
            let temp = [this.state.front[1][0], this.state.front[1][1], this.state.front[1][2]];
    
            // Left to Front
            // left[1][0] -> front[1][0] | left[1][1] -> front[1][1] | left[1][2] -> front[1][2]
            this.state.front[1][0] = this.state.left[1][0];
            this.state.front[1][1] = this.state.left[1][1];
            this.state.front[1][2] = this.state.left[1][2];
    
            // Back to Left
            // back[1][0] -> left[1][0] | back[1][1] -> left[1][1] | back[1][2] -> left[1][2]
            this.state.left[1][0] = this.state.back[1][0];
            this.state.left[1][1] = this.state.back[1][1];
            this.state.left[1][2] = this.state.back[1][2];
    
            // Right to Back
            // right[1][0] -> back[1][0] | right[1][1] -> back[1][1] | right[1][2] -> back[1][2]
            this.state.back[1][0] = this.state.right[1][0];
            this.state.back[1][1] = this.state.right[1][1];
            this.state.back[1][2] = this.state.right[1][2];
    
            // Temp (Front) to Right
            // temp[0] -> right[1][0] | temp[1] -> right[1][1] | temp[2] -> right[1][2]
            this.state.right[1][0] = temp[0];
            this.state.right[1][1] = temp[1];
            this.state.right[1][2] = temp[2];
    
        } else {
            // Counterclockwise rotation of the equatorial layer is similar to moving the middle layer in the opposite direction of a D move
            let temp = [this.state.front[1][0], this.state.front[1][1], this.state.front[1][2]];
    
            // Right to Front
            // right[1][0] -> front[1][0] | right[1][1] -> front[1][1] | right[1][2] -> front[1][2]
            this.state.front[1][0] = this.state.right[1][0];
            this.state.front[1][1] = this.state.right[1][1];
            this.state.front[1][2] = this.state.right[1][2];
    
            // Back to Right
            // back[1][0] -> right[1][0] | back[1][1] -> right[1][1] | back[1][2] -> right[1][2]
            this.state.right[1][0] = this.state.back[1][0];
            this.state.right[1][1] = this.state.back[1][1];
            this.state.right[1][2] = this.state.back[1][2];
    
            // Left to Back
            // left[1][0] -> back[1][0] | left[1][1] -> back[1][1] | left[1][2] -> back[1][2]
            this.state.back[1][0] = this.state.left[1][0];
            this.state.back[1][1] = this.state.left[1][1];
            this.state.back[1][2] = this.state.left[1][2];
    
            // Temp (Front) to Left
            // temp[0] -> left[1][0] | temp[1] -> left[1][1] | temp[2] -> left[1][2]
            this.state.left[1][0] = temp[0];
            this.state.left[1][1] = temp[1];
            this.state.left[1][2] = temp[2];
        }
    }

    rotateS(clockwise = true) {
        if (clockwise) {
            // Clockwise rotation of the standing layer (equivalent to moving the layer from up to down when facing the front)
            let temp = [this.state.up[1][0], this.state.up[1][1], this.state.up[1][2]];
    
            // Left to Up (Note: Rotate left columns to match the up row orientation)
            this.state.up[1][0] = this.state.left[2][1];
            this.state.up[1][1] = this.state.left[1][1];
            this.state.up[1][2] = this.state.left[0][1];
    
            // Down to Left
            this.state.left[0][1] = this.state.down[1][0];
            this.state.left[1][1] = this.state.down[1][1];
            this.state.left[2][1] = this.state.down[1][2];
    
            // Right to Down (Note: Rotate right columns to match the down row orientation)
            this.state.down[1][0] = this.state.right[2][1];
            this.state.down[1][1] = this.state.right[1][1];
            this.state.down[1][2] = this.state.right[0][1];
    
            // Temp (Up) to Right
            this.state.right[0][1] = temp[0];
            this.state.right[1][1] = temp[1];
            this.state.right[2][1] = temp[2];
    
        } else {
            // Counterclockwise rotation of the standing layer (equivalent to moving the layer from down to up when facing the front)
            let temp = [this.state.up[1][0], this.state.up[1][1], this.state.up[1][2]];
    
            // Right to Up (Note: Rotate right columns to match the up row orientation)
            this.state.up[1][0] = this.state.right[0][1];
            this.state.up[1][1] = this.state.right[1][1];
            this.state.up[1][2] = this.state.right[2][1];
    
            // Down to Right
            this.state.right[0][1] = this.state.down[1][2];
            this.state.right[1][1] = this.state.down[1][1];
            this.state.right[2][1] = this.state.down[1][0];
    
            // Left to Down (Note: Rotate left columns to match the down row orientation)
            this.state.down[1][0] = this.state.left[0][1];
            this.state.down[1][1] = this.state.left[1][1];
            this.state.down[1][2] = this.state.left[2][1];
    
            // Temp (Up) to Left
            this.state.left[0][1] = temp[2];
            this.state.left[1][1] = temp[1];
            this.state.left[2][1] = temp[0];
        }
    }
    
    rotatex(){
        this.rotateL(false);
        this.rotateM(false);
        this.rotateR(true);
    }

    rotatey(){
        this.rotateU(true);
        this.rotateE(false);
        this.rotateD(false);
    }

    rotatez(){
        this.rotateF(true);
        this.rotateS(true);
        this.rotateB(false);
    }
}