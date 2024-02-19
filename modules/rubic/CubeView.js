import * as THREE from 'three';
import createGL  from 'gl';
import { PNG } from 'pngjs';

class CubeView {
  constructor( state) {
    this.state = state;
    this.colorMap = {
      'R': 0xff0000, // Red
      'G': 0x00ff00, // Green
      'B': 0x0000ff, // Blue
      'O': 0xffa500, // Orange
      'Y': 0xffff00, // Yellow
      'W': 0xffffff  // White
    };
    this.initScene();
    this.createCubes();
    this.addLighting();
    this.render();
  }

  initScene() {
    // Create a headless WebGL context using the 'gl' package
    const width = 800;
    const height = Math.round(800 / 1.91); // Example dimensions, adjust as needed
    const webGLContext  = createGL(width, height); // Adjusted width and height for the desired aspect ratio

    // Define a dummy canvas with minimal stub functions
    const dummyCanvas = {
      width: width,
      height: height,
      addEventListener: () => {}, // No-op function for addEventListener
      removeEventListener: () => {}, // No-op function for removeEventListener
      getContext: () => { return webGLContext; }, // Return the WebGL context from 'gl'
      style: {}, // Add an empty 'style' object
    };

    this.renderer = new THREE.WebGLRenderer({
      context: webGLContext,
      canvas: dummyCanvas
    });
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.position.set(7, 7, 7);
    this.camera.lookAt(this.scene.position);
  }

  createCubes() {
    const cubeSize = 1;
    const spacing = 0.1;
    this.group3D = new THREE.Group();

    // Create 3D cubes for visible sides
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          if (x === 2 || y === 2 || z === 2) { // Only right, top, and front faces
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const faceMaterials = [
              new THREE.MeshBasicMaterial({ color: this.getColor('right', x, y, z) }), // Right face
              new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }), // Left face (hidden)
              new THREE.MeshBasicMaterial({ color: this.getColor('top', x, y, z) }), // Top face
              new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }), // Bottom face (hidden)
              new THREE.MeshBasicMaterial({ color: this.getColor('front', x, y, z) }), // Front face
              new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }), // Back face (hidden)
            ];
            const cube = new THREE.Mesh(cubeGeometry, faceMaterials);
            cube.position.set(
              x * (cubeSize + spacing) - 1 * (cubeSize + spacing),
              y * (cubeSize + spacing) - 1 * (cubeSize + spacing),
              z * (cubeSize + spacing) - 1 * (cubeSize + spacing)
            );
            this.group3D.add(cube);
          }
        }
      }
    }

    this.scene.add(this.group3D);

    // Create grids for hidden faces
    this.createGrid('left', -cubeSize * 3 - spacing * 36, 0, 0);
    this.createGrid('bottom',0, -cubeSize * 3 - spacing * 36, 0);
    this.createGrid('back',0, 0, -cubeSize * 7 - spacing * 2);
  }

  getColor(face, x, y, z) {
    // Determine color based on position and state
    if (face === 'right' && x === 2) return this.colorMap[this.state[face][y][z]];
    if (face === 'top' && y === 2) return this.colorMap[this.state[face][x][z]];
    if (face === 'front' && z === 2) return this.colorMap[this.state[face][y][x]];
    return 0x000000; // Default color if not specified
  }

  createGrid(face, xOffset, yOffset, zOffset) {
    const cubeSize = 1;
    const spacing = 0.1;
    const gridGroup = new THREE.Group();

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize * 0.1); // Thin cubes for the grid
        const color = this.colorMap[this.state[face][i][j]];
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: color });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(
            (i - 1) * (cubeSize + spacing),
            (j - 1) * (cubeSize + spacing),
            0
        );

        gridGroup.add(cube);
        gridGroup.position.set(xOffset, yOffset, zOffset);

        switch(face){
          case "left":
            gridGroup.rotation.y = Math.PI / 2;
            break;
          case "bottom":
            gridGroup.rotation.x = -Math.PI / 2;
            break;
          case "back":
            break;
          default:
            break;
        }
      }
    }

    this.scene.add(gridGroup);
  }

  addLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
  }

  render() {
      this.renderer.render(this.scene, this.camera);
  }

   // Render the scene and return the data URI of the rendered image
  renderToPNG() {
        // Render the scene
      this.renderer.render(this.scene, this.camera);

      // Get the WebGL context
      const gl = this.renderer.getContext();

      // Read pixel data from WebGL context
      const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
      gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      // Create a PNG image
      const png = new PNG({
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight
      });

      // Copy the pixel data into the PNG object
      png.data = Buffer.from(pixels);

      // Reverse the pixel rows because WebGL's readPixels reads from the bottom left
      for (let y = 0; y < png.height / 2; y++) {
        for (let x = 0; x < png.width; x++) {
          for (let i = 0; i < 4; i++) {
            const idx1 = (png.width * y + x) * 4 + i;
            const idx2 = (png.width * (png.height - y - 1) + x) * 4 + i;
            const tmp = png.data[idx1];
            png.data[idx1] = png.data[idx2];
            png.data[idx2] = tmp;
          }
        }
      }

      // Convert the PNG object to a buffer
      const buffer = PNG.sync.write(png);

      // Here you can save the buffer to a file, return it, or handle it as needed
      return buffer;
  }
}

export default CubeView;