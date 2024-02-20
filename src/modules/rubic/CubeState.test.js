// Import the CubeState class
import CubeState, {MOVES} from './CubeState.js'; // Adjust the path as necessary

// describe('CubeState Class Tests', () => {
//     test('Solved Cube Initialization', () => {
//         const cube = new CubeState();
//         expect(cube.isSolved()).toBe(true);
//     });

//     test('Scramble and IsSolved Method', () => {
//         const cube = new CubeState();
//         cube.scramble(20);
//         expect(cube.isSolved()).toBe(false);
//     });

//     test('toString and fromString Static Method', () => {
//         const cube = new CubeState();
//         cube.scramble(20);
//         const cubeString = cube.toString();

//         const newCube = CubeState.fromString(cubeString);
//         expect(newCube.toString()).toBe(cubeString);
//     });

//     test('Rotation Methods Preserve Cube Integrity', () => {
//         const cube = new CubeState();
        
//         // Apply each move in both directions and check if the cube remains unsolved
//         MOVES.forEach(move => {
//             const newCube = new CubeState(cube.state); // Create a new cube for each test to avoid cumulative effects
//             newCube.rotateFaceByCode(move, true); // Clockwise
//             expect(newCube.isSolved()).toBe(false);

//             newCube.rotateFaceByCode(move, false); // Counter-Clockwise (should revert to solved state)
//             expect(newCube.isSolved()).toBe(true);
//         });
//     });
// });

describe('CubeState Move Effects', () => {
    let cube;
  
    beforeAll(() => {
      // Initialize the cube to a solved state before each test
      cube = new CubeState();
      console.log("initial",cube.toString(),"where Front = Red, Left = Green, Back = Orange, Right = Blue, Up = White, Down = Yellow");
    });
  
    describe('F Move', () => {

        test('clockwise', ()=>{

            cube.rotateFaceByCode('F');
  
            //left
            expect(cube.getColor('left', 0, 0)).toBe('G');
            expect(cube.getColor('left', 0, 1)).toBe('G');
            expect(cube.getColor('left', 0, 2)).toBe('W');
            
            expect(cube.getColor('left', 1, 0)).toBe('G');
            expect(cube.getColor('left', 1, 1)).toBe('G');
            expect(cube.getColor('left', 1, 2)).toBe('W');
            
            expect(cube.getColor('left', 2, 0)).toBe('G');
            expect(cube.getColor('left', 2, 1)).toBe('G');
            expect(cube.getColor('left', 2, 2)).toBe('W');
      
            //right
            expect(cube.getColor('right', 0, 0)).toBe('Y');
            expect(cube.getColor('right', 0, 1)).toBe('B');
            expect(cube.getColor('right', 0, 2)).toBe('B');
            
            expect(cube.getColor('right', 1, 0)).toBe('Y');
            expect(cube.getColor('right', 1, 1)).toBe('B');
            expect(cube.getColor('right', 1, 2)).toBe('B');
            
            expect(cube.getColor('right', 2, 0)).toBe('Y');
            expect(cube.getColor('right', 2, 1)).toBe('B');
            expect(cube.getColor('right', 2, 2)).toBe('B');
      
            //up
            expect(cube.getColor('up', 0, 0)).toBe('W');
            expect(cube.getColor('up', 0, 1)).toBe('W');
            expect(cube.getColor('up', 0, 2)).toBe('W');
            
            expect(cube.getColor('up', 1, 0)).toBe('W');
            expect(cube.getColor('up', 1, 1)).toBe('W');
            expect(cube.getColor('up', 1, 2)).toBe('W');
            
            expect(cube.getColor('up', 2, 0)).toBe('B');
            expect(cube.getColor('up', 2, 1)).toBe('B');
            expect(cube.getColor('up', 2, 2)).toBe('B');
      
            //down
            expect(cube.getColor('down', 0, 0)).toBe('G');
            expect(cube.getColor('down', 0, 1)).toBe('G');
            expect(cube.getColor('down', 0, 2)).toBe('G');
            
            expect(cube.getColor('down', 1, 0)).toBe('Y');
            expect(cube.getColor('down', 1, 1)).toBe('Y');
            expect(cube.getColor('down', 1, 2)).toBe('Y');
            
            expect(cube.getColor('down', 2, 0)).toBe('Y');
            expect(cube.getColor('down', 2, 1)).toBe('Y');
            expect(cube.getColor('down', 2, 2)).toBe('Y');
            
        });

        test('counter clockwise', ()=>{
            cube.rotateFaceByCode('F',false);
            expect(cube.isSolved()).toBe(true);
        });
    });

    describe('L Move', () => {

        test('clockwise', ()=>{

            cube.rotateFaceByCode('L');
  
            //back
            expect(cube.getColor('back', 0, 0)).toBe('W');
            expect(cube.getColor('back', 0, 1)).toBe('O');
            expect(cube.getColor('back', 0, 2)).toBe('O');
            
            expect(cube.getColor('back', 1, 0)).toBe('W');
            expect(cube.getColor('back', 1, 1)).toBe('O');
            expect(cube.getColor('back', 1, 2)).toBe('O');
            
            expect(cube.getColor('back', 2, 0)).toBe('W');
            expect(cube.getColor('back', 2, 1)).toBe('O');
            expect(cube.getColor('back', 2, 2)).toBe('O');
      
            //front
            expect(cube.getColor('front', 0, 0)).toBe('Y');
            expect(cube.getColor('front', 0, 1)).toBe('R');
            expect(cube.getColor('front', 0, 2)).toBe('R');
            
            expect(cube.getColor('front', 1, 0)).toBe('Y');
            expect(cube.getColor('front', 1, 1)).toBe('R');
            expect(cube.getColor('front', 1, 2)).toBe('R');
            
            expect(cube.getColor('front', 2, 0)).toBe('Y');
            expect(cube.getColor('front', 2, 1)).toBe('R');
            expect(cube.getColor('front', 2, 2)).toBe('R');
      
            //up
            expect(cube.getColor('up', 0, 0)).toBe('R');
            expect(cube.getColor('up', 0, 1)).toBe('W');
            expect(cube.getColor('up', 0, 2)).toBe('W');
            
            expect(cube.getColor('up', 1, 0)).toBe('R');
            expect(cube.getColor('up', 1, 1)).toBe('W');
            expect(cube.getColor('up', 1, 2)).toBe('W');
            
            expect(cube.getColor('up', 2, 0)).toBe('R');
            expect(cube.getColor('up', 2, 1)).toBe('W');
            expect(cube.getColor('up', 2, 2)).toBe('W');
      
            //down
            expect(cube.getColor('down', 0, 0)).toBe('O');
            expect(cube.getColor('down', 0, 1)).toBe('Y');
            expect(cube.getColor('down', 0, 2)).toBe('Y');
            
            expect(cube.getColor('down', 1, 0)).toBe('O');
            expect(cube.getColor('down', 1, 1)).toBe('Y');
            expect(cube.getColor('down', 1, 2)).toBe('Y');
            
            expect(cube.getColor('down', 2, 0)).toBe('O');
            expect(cube.getColor('down', 2, 1)).toBe('Y');
            expect(cube.getColor('down', 2, 2)).toBe('Y');
            
        });

        test('counter clockwise', ()=>{
            cube.rotateFaceByCode('L',false);
            expect(cube.isSolved()).toBe(true);
        });
    });

    describe('B Move', () => {

        test('clockwise', ()=>{

            cube.rotateFaceByCode('B');
  
            //right
            expect(cube.getColor('right', 0, 0)).toBe('B');
            expect(cube.getColor('right', 0, 1)).toBe('B');
            expect(cube.getColor('right', 0, 2)).toBe('Y');
            
            expect(cube.getColor('right', 1, 0)).toBe('B');
            expect(cube.getColor('right', 1, 1)).toBe('B');
            expect(cube.getColor('right', 1, 2)).toBe('Y');
            
            expect(cube.getColor('right', 2, 0)).toBe('B');
            expect(cube.getColor('right', 2, 1)).toBe('B');
            expect(cube.getColor('right', 2, 2)).toBe('Y');
      
            //left
            expect(cube.getColor('left', 0, 0)).toBe('W');
            expect(cube.getColor('left', 0, 1)).toBe('G');
            expect(cube.getColor('left', 0, 2)).toBe('G');
            
            expect(cube.getColor('left', 1, 0)).toBe('W');
            expect(cube.getColor('left', 1, 1)).toBe('G');
            expect(cube.getColor('left', 1, 2)).toBe('G');
            
            expect(cube.getColor('left', 2, 0)).toBe('W');
            expect(cube.getColor('left', 2, 1)).toBe('G');
            expect(cube.getColor('left', 2, 2)).toBe('G');
      
            //up
            expect(cube.getColor('up', 0, 0)).toBe('B');
            expect(cube.getColor('up', 0, 1)).toBe('B');
            expect(cube.getColor('up', 0, 2)).toBe('B');
            
            expect(cube.getColor('up', 1, 0)).toBe('W');
            expect(cube.getColor('up', 1, 1)).toBe('W');
            expect(cube.getColor('up', 1, 2)).toBe('W');
            
            expect(cube.getColor('up', 2, 0)).toBe('W');
            expect(cube.getColor('up', 2, 1)).toBe('W');
            expect(cube.getColor('up', 2, 2)).toBe('W');
      
            //down
            expect(cube.getColor('down', 0, 0)).toBe('Y');
            expect(cube.getColor('down', 0, 1)).toBe('Y');
            expect(cube.getColor('down', 0, 2)).toBe('Y');
            
            expect(cube.getColor('down', 1, 0)).toBe('Y');
            expect(cube.getColor('down', 1, 1)).toBe('Y');
            expect(cube.getColor('down', 1, 2)).toBe('Y');
            
            expect(cube.getColor('down', 2, 0)).toBe('G');
            expect(cube.getColor('down', 2, 1)).toBe('G');
            expect(cube.getColor('down', 2, 2)).toBe('G');
            
        });

        test('counter clockwise', ()=>{
            cube.rotateFaceByCode('B',false);
            expect(cube.isSolved()).toBe(true);
        });
    });

    describe('R Move', () => {

        test('clockwise', ()=>{

            cube.rotateFaceByCode('R');
  
            //front
            expect(cube.getColor('front', 0, 0)).toBe('R');
            expect(cube.getColor('front', 0, 1)).toBe('R');
            expect(cube.getColor('front', 0, 2)).toBe('Y');
            
            expect(cube.getColor('front', 1, 0)).toBe('R');
            expect(cube.getColor('front', 1, 1)).toBe('R');
            expect(cube.getColor('front', 1, 2)).toBe('Y');
            
            expect(cube.getColor('front', 2, 0)).toBe('R');
            expect(cube.getColor('front', 2, 1)).toBe('R');
            expect(cube.getColor('front', 2, 2)).toBe('Y');
      
            //back
            expect(cube.getColor('back', 0, 0)).toBe('O');
            expect(cube.getColor('back', 0, 1)).toBe('O');
            expect(cube.getColor('back', 0, 2)).toBe('W');
            
            expect(cube.getColor('back', 1, 0)).toBe('O');
            expect(cube.getColor('back', 1, 1)).toBe('O');
            expect(cube.getColor('back', 1, 2)).toBe('W');
            
            expect(cube.getColor('back', 2, 0)).toBe('O');
            expect(cube.getColor('back', 2, 1)).toBe('O');
            expect(cube.getColor('back', 2, 2)).toBe('W');
      
            //up
            expect(cube.getColor('up', 0, 0)).toBe('W');
            expect(cube.getColor('up', 0, 1)).toBe('W');
            expect(cube.getColor('up', 0, 2)).toBe('R');
            
            expect(cube.getColor('up', 1, 0)).toBe('W');
            expect(cube.getColor('up', 1, 1)).toBe('W');
            expect(cube.getColor('up', 1, 2)).toBe('R');
            
            expect(cube.getColor('up', 2, 0)).toBe('W');
            expect(cube.getColor('up', 2, 1)).toBe('W');
            expect(cube.getColor('up', 2, 2)).toBe('R');
      
            //down
            expect(cube.getColor('down', 0, 0)).toBe('Y');
            expect(cube.getColor('down', 0, 1)).toBe('Y');
            expect(cube.getColor('down', 0, 2)).toBe('O');
            
            expect(cube.getColor('down', 1, 0)).toBe('Y');
            expect(cube.getColor('down', 1, 1)).toBe('Y');
            expect(cube.getColor('down', 1, 2)).toBe('O');
            
            expect(cube.getColor('down', 2, 0)).toBe('Y');
            expect(cube.getColor('down', 2, 1)).toBe('Y');
            expect(cube.getColor('down', 2, 2)).toBe('O');
            
        });

        test('counter clockwise', ()=>{
            cube.rotateFaceByCode('R',false);
            expect(cube.isSolved()).toBe(true);
        });
    });

    describe('U Move', () => {

        test('clockwise', ()=>{

            cube.rotateFaceByCode('U');
  
            //left
            expect(cube.getColor('left', 0, 0)).toBe('R');
            expect(cube.getColor('left', 0, 1)).toBe('R');
            expect(cube.getColor('left', 0, 2)).toBe('R');
            
            expect(cube.getColor('left', 1, 0)).toBe('G');
            expect(cube.getColor('left', 1, 1)).toBe('G');
            expect(cube.getColor('left', 1, 2)).toBe('G');
            
            expect(cube.getColor('left', 2, 0)).toBe('G');
            expect(cube.getColor('left', 2, 1)).toBe('G');
            expect(cube.getColor('left', 2, 2)).toBe('G');
      
            //back
            expect(cube.getColor('back', 0, 0)).toBe('O');
            expect(cube.getColor('back', 0, 1)).toBe('O');
            expect(cube.getColor('back', 0, 2)).toBe('O');
            
            expect(cube.getColor('back', 1, 0)).toBe('O');
            expect(cube.getColor('back', 1, 1)).toBe('O');
            expect(cube.getColor('back', 1, 2)).toBe('O');
            
            expect(cube.getColor('back', 2, 0)).toBe('G');
            expect(cube.getColor('back', 2, 1)).toBe('G');
            expect(cube.getColor('back', 2, 2)).toBe('G');
      
            //right
            expect(cube.getColor('right', 0, 0)).toBe('O');
            expect(cube.getColor('right', 0, 1)).toBe('O');
            expect(cube.getColor('right', 0, 2)).toBe('O');
            
            expect(cube.getColor('right', 1, 0)).toBe('B');
            expect(cube.getColor('right', 1, 1)).toBe('B');
            expect(cube.getColor('right', 1, 2)).toBe('B');
            
            expect(cube.getColor('right', 2, 0)).toBe('B');
            expect(cube.getColor('right', 2, 1)).toBe('B');
            expect(cube.getColor('right', 2, 2)).toBe('B');
      
            //front
            expect(cube.getColor('front', 0, 0)).toBe('B');
            expect(cube.getColor('front', 0, 1)).toBe('B');
            expect(cube.getColor('front', 0, 2)).toBe('B');
            
            expect(cube.getColor('front', 1, 0)).toBe('R');
            expect(cube.getColor('front', 1, 1)).toBe('R');
            expect(cube.getColor('front', 1, 2)).toBe('R');
            
            expect(cube.getColor('front', 2, 0)).toBe('R');
            expect(cube.getColor('front', 2, 1)).toBe('R');
            expect(cube.getColor('front', 2, 2)).toBe('R');
            
        });

        test('counter clockwise', ()=>{
            cube.rotateFaceByCode('U',false);
            expect(cube.isSolved()).toBe(true);
        });
    });

    describe('D Move', () => {

        test('clockwise', ()=>{

            cube.rotateFaceByCode('D');
  
            //left
            expect(cube.getColor('left', 0, 0)).toBe('G');
            expect(cube.getColor('left', 0, 1)).toBe('G');
            expect(cube.getColor('left', 0, 2)).toBe('G');
            
            expect(cube.getColor('left', 1, 0)).toBe('G');
            expect(cube.getColor('left', 1, 1)).toBe('G');
            expect(cube.getColor('left', 1, 2)).toBe('G');
            
            expect(cube.getColor('left', 2, 0)).toBe('R');
            expect(cube.getColor('left', 2, 1)).toBe('R');
            expect(cube.getColor('left', 2, 2)).toBe('R');
      
            //back
            expect(cube.getColor('back', 0, 0)).toBe('G');
            expect(cube.getColor('back', 0, 1)).toBe('G');
            expect(cube.getColor('back', 0, 2)).toBe('G');
            
            expect(cube.getColor('back', 1, 0)).toBe('O');
            expect(cube.getColor('back', 1, 1)).toBe('O');
            expect(cube.getColor('back', 1, 2)).toBe('O');
            
            expect(cube.getColor('back', 2, 0)).toBe('O');
            expect(cube.getColor('back', 2, 1)).toBe('O');
            expect(cube.getColor('back', 2, 2)).toBe('O');
      
            //right
            expect(cube.getColor('right', 0, 0)).toBe('B');
            expect(cube.getColor('right', 0, 1)).toBe('B');
            expect(cube.getColor('right', 0, 2)).toBe('B');
            
            expect(cube.getColor('right', 1, 0)).toBe('B');
            expect(cube.getColor('right', 1, 1)).toBe('B');
            expect(cube.getColor('right', 1, 2)).toBe('B');
            
            expect(cube.getColor('right', 2, 0)).toBe('O');
            expect(cube.getColor('right', 2, 1)).toBe('O');
            expect(cube.getColor('right', 2, 2)).toBe('O');
      
            //front
            expect(cube.getColor('front', 0, 0)).toBe('R');
            expect(cube.getColor('front', 0, 1)).toBe('R');
            expect(cube.getColor('front', 0, 2)).toBe('R');
            
            expect(cube.getColor('front', 1, 0)).toBe('R');
            expect(cube.getColor('front', 1, 1)).toBe('R');
            expect(cube.getColor('front', 1, 2)).toBe('R');
            
            expect(cube.getColor('front', 2, 0)).toBe('B');
            expect(cube.getColor('front', 2, 1)).toBe('B');
            expect(cube.getColor('front', 2, 2)).toBe('B');
            
        });

        test('counter clockwise', ()=>{
            cube.rotateFaceByCode('D',false);
            expect(cube.isSolved()).toBe(true);
        });
    });

    describe('M Move', () => {

        test('clockwise', ()=>{

            cube.rotateFaceByCode('M');
  
            //front
            expect(cube.getColor('front', 0, 0)).toBe('R');
            expect(cube.getColor('front', 0, 1)).toBe('Y');
            expect(cube.getColor('front', 0, 2)).toBe('R');
            
            expect(cube.getColor('front', 1, 0)).toBe('R');
            expect(cube.getColor('front', 1, 1)).toBe('Y');
            expect(cube.getColor('front', 1, 2)).toBe('R');
            
            expect(cube.getColor('front', 2, 0)).toBe('R');
            expect(cube.getColor('front', 2, 1)).toBe('Y');
            expect(cube.getColor('front', 2, 2)).toBe('R');
      
            //back
            expect(cube.getColor('back', 0, 0)).toBe('O');
            expect(cube.getColor('back', 0, 1)).toBe('W');
            expect(cube.getColor('back', 0, 2)).toBe('O');
            
            expect(cube.getColor('back', 1, 0)).toBe('O');
            expect(cube.getColor('back', 1, 1)).toBe('W');
            expect(cube.getColor('back', 1, 2)).toBe('O');
            
            expect(cube.getColor('back', 2, 0)).toBe('O');
            expect(cube.getColor('back', 2, 1)).toBe('W');
            expect(cube.getColor('back', 2, 2)).toBe('O');
      
            //up
            expect(cube.getColor('up', 0, 0)).toBe('W');
            expect(cube.getColor('up', 0, 1)).toBe('R');
            expect(cube.getColor('up', 0, 2)).toBe('W');
            
            expect(cube.getColor('up', 1, 0)).toBe('W');
            expect(cube.getColor('up', 1, 1)).toBe('R');
            expect(cube.getColor('up', 1, 2)).toBe('W');
            
            expect(cube.getColor('up', 2, 0)).toBe('W');
            expect(cube.getColor('up', 2, 1)).toBe('R');
            expect(cube.getColor('up', 2, 2)).toBe('W');
      
            //down
            expect(cube.getColor('down', 0, 0)).toBe('Y');
            expect(cube.getColor('down', 0, 1)).toBe('O');
            expect(cube.getColor('down', 0, 2)).toBe('Y');
            
            expect(cube.getColor('down', 1, 0)).toBe('Y');
            expect(cube.getColor('down', 1, 1)).toBe('O');
            expect(cube.getColor('down', 1, 2)).toBe('Y');
            
            expect(cube.getColor('down', 2, 0)).toBe('Y');
            expect(cube.getColor('down', 2, 1)).toBe('O');
            expect(cube.getColor('down', 2, 2)).toBe('Y');
            
        });

        test('counter clockwise', ()=>{
            cube.rotateFaceByCode('M',false);
            expect(cube.isSolved()).toBe(true);
        });
    });

    describe('E Move', () => {

        test('clockwise', ()=>{

            cube.rotateFaceByCode('E');
  
            //front
            expect(cube.getColor('front', 0, 0)).toBe('R');
            expect(cube.getColor('front', 0, 1)).toBe('R');
            expect(cube.getColor('front', 0, 2)).toBe('R');
            
            expect(cube.getColor('front', 1, 0)).toBe('B');
            expect(cube.getColor('front', 1, 1)).toBe('B');
            expect(cube.getColor('front', 1, 2)).toBe('B');
            
            expect(cube.getColor('front', 2, 0)).toBe('R');
            expect(cube.getColor('front', 2, 1)).toBe('R');
            expect(cube.getColor('front', 2, 2)).toBe('R');

            //left
            expect(cube.getColor('left', 0, 0)).toBe('G');
            expect(cube.getColor('left', 0, 1)).toBe('G');
            expect(cube.getColor('left', 0, 2)).toBe('G');
            
            expect(cube.getColor('left', 1, 0)).toBe('R');
            expect(cube.getColor('left', 1, 1)).toBe('R');
            expect(cube.getColor('left', 1, 2)).toBe('R');
            
            expect(cube.getColor('left', 2, 0)).toBe('G');
            expect(cube.getColor('left', 2, 1)).toBe('G');
            expect(cube.getColor('left', 2, 2)).toBe('G');
      
            //back
            expect(cube.getColor('back', 0, 0)).toBe('O');
            expect(cube.getColor('back', 0, 1)).toBe('O');
            expect(cube.getColor('back', 0, 2)).toBe('O');
            
            expect(cube.getColor('back', 1, 0)).toBe('G');
            expect(cube.getColor('back', 1, 1)).toBe('G');
            expect(cube.getColor('back', 1, 2)).toBe('G');
            
            expect(cube.getColor('back', 2, 0)).toBe('O');
            expect(cube.getColor('back', 2, 1)).toBe('O');
            expect(cube.getColor('back', 2, 2)).toBe('O');
      
            //right
            expect(cube.getColor('right', 0, 0)).toBe('B');
            expect(cube.getColor('right', 0, 1)).toBe('B');
            expect(cube.getColor('right', 0, 2)).toBe('B');
            
            expect(cube.getColor('right', 1, 0)).toBe('O');
            expect(cube.getColor('right', 1, 1)).toBe('O');
            expect(cube.getColor('right', 1, 2)).toBe('O');
            
            expect(cube.getColor('right', 2, 0)).toBe('B');
            expect(cube.getColor('right', 2, 1)).toBe('B');
            expect(cube.getColor('right', 2, 2)).toBe('B');
            
        });

        test('counter clockwise', ()=>{
            cube.rotateFaceByCode('E',false);
            expect(cube.isSolved()).toBe(true);
        });
    });

    describe('S Move', () => {

        test('clockwise', ()=>{

            cube.rotateFaceByCode('S');

            //left
            expect(cube.getColor('left', 0, 0)).toBe('G');
            expect(cube.getColor('left', 0, 1)).toBe('W');
            expect(cube.getColor('left', 0, 2)).toBe('G');
            
            expect(cube.getColor('left', 1, 0)).toBe('G');
            expect(cube.getColor('left', 1, 1)).toBe('W');
            expect(cube.getColor('left', 1, 2)).toBe('G');
            
            expect(cube.getColor('left', 2, 0)).toBe('G');
            expect(cube.getColor('left', 2, 1)).toBe('W');
            expect(cube.getColor('left', 2, 2)).toBe('G');
      
            //right
            expect(cube.getColor('right', 0, 0)).toBe('B');
            expect(cube.getColor('right', 0, 1)).toBe('Y');
            expect(cube.getColor('right', 0, 2)).toBe('B');
            
            expect(cube.getColor('right', 1, 0)).toBe('B');
            expect(cube.getColor('right', 1, 1)).toBe('Y');
            expect(cube.getColor('right', 1, 2)).toBe('B');
            
            expect(cube.getColor('right', 2, 0)).toBe('B');
            expect(cube.getColor('right', 2, 1)).toBe('Y');
            expect(cube.getColor('right', 2, 2)).toBe('B');
  
            //up
            expect(cube.getColor('up', 0, 0)).toBe('W');
            expect(cube.getColor('up', 0, 1)).toBe('W');
            expect(cube.getColor('up', 0, 2)).toBe('W');
            
            expect(cube.getColor('up', 1, 0)).toBe('B');
            expect(cube.getColor('up', 1, 1)).toBe('B');
            expect(cube.getColor('up', 1, 2)).toBe('B');
            
            expect(cube.getColor('up', 2, 0)).toBe('W');
            expect(cube.getColor('up', 2, 1)).toBe('W');
            expect(cube.getColor('up', 2, 2)).toBe('W');
      
            //down
            expect(cube.getColor('down', 0, 0)).toBe('Y');
            expect(cube.getColor('down', 0, 1)).toBe('Y');
            expect(cube.getColor('down', 0, 2)).toBe('Y');
            
            expect(cube.getColor('down', 1, 0)).toBe('G');
            expect(cube.getColor('down', 1, 1)).toBe('G');
            expect(cube.getColor('down', 1, 2)).toBe('G');
            
            expect(cube.getColor('down', 2, 0)).toBe('Y');
            expect(cube.getColor('down', 2, 1)).toBe('Y');
            expect(cube.getColor('down', 2, 2)).toBe('Y');
            
        });

        test('counter clockwise', ()=>{
            cube.rotateFaceByCode('S',false);
            expect(cube.isSolved()).toBe(true);
        });
    });
  });