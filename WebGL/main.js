import { initBuffers } from "./init-buffers.js"
import { drawScene } from "./draw-scene.js"
import { vsSource } from "./vertexShader.js"
import { fsSource } from "./fragmentShader.js"

export let topRGB, bottomRGB, frontRGB, backRGB, leftRGB, rightRGB

frontRGB = [1.0, 1.0, 1.0, 1.0]
backRGB = [1.0, 0.0, 0.0, 1.0]
topRGB = [0.0, 1.0, 0.0, 1.0]
bottomRGB = [0.0, 0.0, 1.0, 1.0]
rightRGB = [1.0, 1.0, 0.0, 1.0]
leftRGB = [1.0, 0.0, 1.0, 1.0]

let cubeRoation = 0.0
let deltaTime = 0
let usecolor = 0
main()
function main() {
    const canvas = document.getElementById("canvas")
    const gl = canvas.getContext("webgl")

    if (gl == null) {
        alert("WebGL is not supported on this browser")
        return
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource)

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPositions: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
            textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
            uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
            useColour: gl.getUniformLocation(shaderProgram, "useColour"),
        }
    }

    
    const buffers = initBuffers(gl)

    const texture = loadTexture(gl, "cubetexture.png")
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    let then = 0

    function render(now) {
        now *= 0.001
        deltaTime = now - then
        then = now
        drawScene(gl, programInfo, buffers, texture, cubeRoation, usecolor)
        cubeRoation -= deltaTime

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initalize shader program ${gl.getProgramInfoLog(shaderProgram)}`)
        return null
    }
    return shaderProgram
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type)

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling shaders ${gl.getShaderInfoLog(shader)}`)
        gl.deleteShader(shader)
        return null
    }
    return shader
}

function loadTexture(gl, url) {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    const level = 0
    const internalFormat = gl.RGBA
    const width = 1
    const height = 1
    const border = 0
    const srcFormat = gl.RGBA
    const srcType = gl.UNSIGNED_BYTE
    const pixel = new Uint8Array([0, 0, 255, 255])
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
    )

    const image = new Image()
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            image
        )

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D)
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        }
    }
    image.src = url

    return texture
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0
}
const colored = document.getElementById("iscolour")
const faceRGB = document.getElementById("RGB")
const faceSel = document.getElementById("faceSel")

let currentFaceSel

colored.addEventListener("change", ev => {
    if (colored.checked) usecolor = 1
    else usecolor = 0
})

faceRGB.addEventListener("change", function (ev) {
    let colour = ev.target.value
    switch (currentFaceSel) {
        case "t":
            topRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            break
        case "bo":
            bottomRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            break
        case "f":
            frontRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            break
        case "ba":
            backRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            break
        case "l":
            leftRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            break
        case "r":
            rightRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            break
        default:
            break
    }
})

faceSel.oninput = function () {
    const data = new FormData(faceSel)
    let output
    
    for (const entry of data) {
        output = entry[1]
    }
    
    
    switch (output) {
        case "top":
            currentFaceSel = "t"
            break;
        case "bottom":
            currentFaceSel = "bo"
            break
        case "front":
            currentFaceSel = "f"
            break
        case "back":
            currentFaceSel = "ba"
            break
        case "left":
            currentFaceSel = "l"
            break
        case "right":
            currentFaceSel = "r"
            break
        default:
            break;
    }
    console.log(currentFaceSel);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
    } : null;
}
