// import * as THREE from 'three';
import * as THREE from '@utils/rubik/test.js';
import createGL  from 'gl';
import { PNG } from 'pngjs';
import CubeStateToView from '@utils/rubik/cube-state-to-view.js';
import { createCanvas } from 'canvas';

class CubeView {
  constructor( state) {
    this.state = state;
    this.mapper = new CubeStateToView(state);
    this.initScene();
    this.createCubes();
    this.addLighting();
    this.addGridlines3D();
  }

  initScene() {
    // Create a headless WebGL context using the 'gl' package
    const width = 1000;
    const height = Math.round(1000 / 1.91); // Example dimensions, adjust as needed
    
    // const webGLContext  = createGL(width, height); // Adjusted width and height for the desired aspect ratio

    // // this dummy is required to prevent WebGLRenderer throw errors, since nodejs doesn't fully support canvas
    // const dummyCanvas = {
    //   width: width,
    //   height: height,
    //   addEventListener: () => {}, // No-op function for addEventListener
    //   removeEventListener: () => {}, // No-op function for removeEventListener
    //   getContext: () => { return webGLContext; }, // Return the WebGL context from 'gl'
    //   style: {}, // Add an empty 'style' object
    // };

    // this.renderer = new THREE.WebGLRenderer({
    //   context: webGLContext,
    //   canvas: dummyCanvas
    // });
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(width, height);
    document.body.appendChild( renderer.domElement );

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
    // order: back to front, down to up, left to right
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          if (x === 2 || y === 2 || z === 2) { // Only right, up, and front faces
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const faceMaterials = [
              new THREE.MeshBasicMaterial(this.mapper.get3d('right', x, y, z)), // Right face
              new THREE.MeshBasicMaterial(this.mapper.meshMaterialEmptyStyle), // Left face (hidden)
              new THREE.MeshBasicMaterial(y == 2 ? this.mapper.get3d('up', x, y, z) : this.mapper.meshMaterialEmptyStyle), // Top face
              new THREE.MeshBasicMaterial(this.mapper.meshMaterialEmptyStyle), // Bottom face (hidden)
              new THREE.MeshBasicMaterial(this.mapper.get3d('front', x, y, z)), // Front face
              new THREE.MeshBasicMaterial(this.mapper.meshMaterialEmptyStyle), // Back face (hidden)
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
    this.createGrid('down',0, -cubeSize * 3 - spacing * 36, 0);
    this.createGrid('back',0, 0, -cubeSize * 7 - spacing * 2);
  }

  createGrid(face, xOffset, yOffset, zOffset) {
    const cubeSize = 1;
    const spacing = 0.1;
    const gridGroup = new THREE.Group();

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize * 0.1); // Thin cubes for the grid
        const cubeMaterial = new THREE.MeshBasicMaterial(this.mapper.get2d(face,i,j));
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
          case "down":
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

  createTextSprite(message, color) {
    const canvas = createCanvas(128, 64); // Create a canvas with node-canvas
    const context = canvas.getContext('2d');

    context.fillStyle = color;
    context.font = 'Bold 32px Arial';
    context.textAlign = 'center';
    context.fillText(message, canvas.width / 2, canvas.height / 2);

    // Convert canvas to an Image object
    const image = new THREE.CanvasTexture(canvas);

    const spriteMaterial = new THREE.SpriteMaterial({ map: image });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1, 0.5, 1);

    return sprite;
  }

  addGridlines3D(){
    const axesHelper = new THREE.AxesHelper(4.8); // The parameter defines the size of the lines representing the axes.
   
    const xAxisLabel = this.createTextSprite('X', 'red');
    xAxisLabel.position.set(5, 0, 0);
  
    const yAxisLabel = this.createTextSprite('Y', 'green');
    yAxisLabel.position.set(0, 5, 0);
  
    const zAxisLabel = this.createTextSprite('Z', 'blue');
    zAxisLabel.position.set(0, 0, 5);
    
    this.scene.add(axesHelper,xAxisLabel,yAxisLabel,zAxisLabel);
  }

  render() {
      return this.renderer.render(this.scene, this.camera);
  }

   // Render the scene and return the data URI of the rendered image
  renderToPNG() {
        // Render the scene
      this.render();

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

      // Reverse the pixel rows because WebGL's readPixels reads from the down left
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

  renderToBase64(){
    return `data:image/png;base64,${this.renderToPNG().toString('base64')}`;
  }
}

export default CubeView;