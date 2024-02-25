
/**
 * cube-view that using three.js orders: back to front, down to up
 */
class CubeStateToView {
    constructor(state, meshMaterialEmptyColor = 0x000000) {
        this.state = state;
        this.colorMap = {
          'R': 0xff0000, // Red
          'G': 0x00ff00, // Green
          'B': 0x0000ff, // Blue
          'O': 0xffa500, // Orange
          'Y': 0xffff00, // Yellow
          'W': 0xffffff  // White
        };
        this.map3dFace = {
            "right": 0,
            "up": 1,
            "front": 2
        };

        this.map2dFace = {
            "left": 0,
            "down": 1,
            "back": 2
        }
        // this.meshMaterialEmptyStyle = { color: meshMaterialEmptyColor, transparent: true, opacity: 0 };
        this.meshMaterialEmptyStyle = { color: meshMaterialEmptyColor };

        this.map3d = {
            "000": [
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle
            ],
            "001": [
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle
            ],
            "002": [
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["front"][2][0]] }
            ],

            "010": [
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle
            ],
            "011": [
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle
            ],
            "012": [
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["front"][1][0]] }
            ],

            "020": [
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["up"][0][0]] },
                this.meshMaterialEmptyStyle,
            ],
            "021": [
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["up"][1][0]] },
                this.meshMaterialEmptyStyle,
            ],
            "022": [
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["up"][2][0]] },
                { color: this.colorMap[this.state["front"][0][0]] }
            ],

            "100": [

                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle
            ],
            "101": [

                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle
            ],
            "102": [
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["front"][2][1]] }
            ],

            "110": [

                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle
            ],
            "111": [

                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle
            ],
            "112": [
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["front"][1][1]] }
            ],

            "120": [
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["up"][0][1]] },
                this.meshMaterialEmptyStyle,
            ],
            "121": [
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["up"][1][1]] },
                this.meshMaterialEmptyStyle,
            ],
            "122": [
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["up"][2][1]] },
                { color: this.colorMap[this.state["front"][0][1]] }
            ],

            "200": [
                { color: this.colorMap[this.state["right"][2][2]] },
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
            ],
            "201": [
                { color: this.colorMap[this.state["right"][2][1]] },
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
            ],
            "202": [
                { color: this.colorMap[this.state["right"][2][0]] },
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["front"][2][2]] }
            ],

            "210": [
                { color: this.colorMap[this.state["right"][1][2]] },
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
            ],
            "211": [
                { color: this.colorMap[this.state["right"][1][1]] },
                this.meshMaterialEmptyStyle,
                this.meshMaterialEmptyStyle,
            ],
            "212": [
                { color: this.colorMap[this.state["right"][1][0]] },
                this.meshMaterialEmptyStyle,
                { color: this.colorMap[this.state["front"][1][2]] }
            ],

            "220": [
                { color: this.colorMap[this.state["right"][0][2]] },
                { color: this.colorMap[this.state["up"][0][2]] },
                this.meshMaterialEmptyStyle,
            ],
            "221": [
                { color: this.colorMap[this.state["right"][0][1]] },
                { color: this.colorMap[this.state["up"][1][2]] },
                this.meshMaterialEmptyStyle,
            ],
            "222": [
                { color: this.colorMap[this.state["right"][0][0]] },
                { color: this.colorMap[this.state["up"][2][2]] },
                { color: this.colorMap[this.state["front"][0][2]] }
            ],
        }

        this.map2d = {
            "00": [
                { color: this.colorMap[this.state["left"][2][2]] },
                { color: this.colorMap[this.state["down"][0][0]] },
                { color: this.colorMap[this.state["back"][2][2]] },
            ],
            "01": [
                { color: this.colorMap[this.state["left"][1][2]] },
                { color: this.colorMap[this.state["down"][1][0]] },
                { color: this.colorMap[this.state["back"][1][2]] },
            ],
            "02": [
                { color: this.colorMap[this.state["left"][0][2]] },
                { color: this.colorMap[this.state["down"][2][0]] },
                { color: this.colorMap[this.state["back"][0][2]] },
            ],

            "10": [
                { color: this.colorMap[this.state["left"][2][1]] },
                { color: this.colorMap[this.state["down"][0][1]] },
                { color: this.colorMap[this.state["back"][2][1]] },
            ],
            "11": [
                { color: this.colorMap[this.state["left"][1][1]] },
                { color: this.colorMap[this.state["down"][1][1]] },
                { color: this.colorMap[this.state["back"][1][1]] },
            ],
            "12": [
                { color: this.colorMap[this.state["left"][0][1]] },
                { color: this.colorMap[this.state["down"][2][1]] },
                { color: this.colorMap[this.state["back"][0][1]] },
            ],

            "20": [
                { color: this.colorMap[this.state["left"][2][0]] },
                { color: this.colorMap[this.state["down"][0][2]] },
                { color: this.colorMap[this.state["back"][2][0]] },
            ],
            "21": [
                { color: this.colorMap[this.state["left"][1][0]] },
                { color: this.colorMap[this.state["down"][1][2]] },
                { color: this.colorMap[this.state["back"][1][0]] },
            ],
            "22": [
                { color: this.colorMap[this.state["left"][0][0]] },
                { color: this.colorMap[this.state["down"][2][2]] },
                { color: this.colorMap[this.state["back"][0][0]] },
            ],
        }
    }

    get3d(face, x, y, z) {
        return this.map3d[x + "" + y + "" + z][this.map3dFace[face]]
    }

    get2d(face,x,y){
        return this.map2d[x+""+y][this.map2dFace[face]]
    }
}

export default CubeStateToView;