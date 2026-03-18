import { initBuffers } from "./init-buffers.js"
import { drawScene } from "./draw-scene.js"
import { vsSource } from "./vertexShader.js"
import { fsSource } from "./fragmentShader.js"

export let topRGB, bottomRGB, frontRGB, backRGB, leftRGB, rightRGB
let hexFrontRGB = "#ffffff"
let hexBackRGB = "#ff0000"
let hexTopRGB = "#00ff00"
let hexBottomRGB = "#0000ff"
let hexRightRGB = "#ffff00"
let hexLeftRGB = "#ff00ff"

frontRGB = [Number((1 / 255 * hexToRgb(hexFrontRGB).r).toFixed(2)), Number((1 / 255 * hexToRgb(hexFrontRGB).g).toFixed(2)), Number((1 / 255 * hexToRgb(hexFrontRGB).b).toFixed(2)), 1]
backRGB = [Number((1 / 255 * hexToRgb(hexBackRGB).r).toFixed(2)), Number((1 / 255 * hexToRgb(hexBackRGB).g).toFixed(2)), Number((1 / 255 * hexToRgb(hexBackRGB).b).toFixed(2)), 1]
topRGB = [Number((1 / 255 * hexToRgb(hexTopRGB).r).toFixed(2)), Number((1 / 255 * hexToRgb(hexTopRGB).g).toFixed(2)), Number((1 / 255 * hexToRgb(hexTopRGB).b).toFixed(2)), 1]
bottomRGB = [Number((1 / 255 * hexToRgb(hexBottomRGB).r).toFixed(2)), Number((1 / 255 * hexToRgb(hexBottomRGB).g).toFixed(2)), Number((1 / 255 * hexToRgb(hexBottomRGB).b).toFixed(2)), 1]
rightRGB = [Number((1 / 255 * hexToRgb(hexRightRGB).r).toFixed(2)), Number((1 / 255 * hexToRgb(hexRightRGB).g).toFixed(2)), Number((1 / 255 * hexToRgb(hexRightRGB).b).toFixed(2)), 1]
leftRGB = [Number((1 / 255 * hexToRgb(hexLeftRGB).r).toFixed(2)), Number((1 / 255 * hexToRgb(hexLeftRGB).g).toFixed(2)), Number((1 / 255 * hexToRgb(hexLeftRGB).b).toFixed(2)), 1]

let reset = false
let cubeRoation = 0.0
let deltaTime = 0
let usecolor = 0
let then = 0
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

    

    function render(now) {
        if (reset) {
            reset = false
            return
        }
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
const resetbtn = document.getElementById("reset")
let hexColour = "#ffffff"
const colourBox = document.getElementById("colorBox")

let currentFaceSel

resetbtn.onclick = function () {
    window.location.reload(true);
    return false
}

colored.addEventListener("change", ev => {
    if (colored.checked) {
        usecolor = 1
        document.getElementById("colourArea").style.display = 'block'
    }
    else {
        usecolor = 0
        document.getElementById("colourArea").style.display='none'
    }
})

faceRGB.addEventListener("change", function (ev) {
    let colour = ev.target.value
    switch (currentFaceSel) {
        case "f":
            frontRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            hexFrontRGB = colour
            break
        case "ba":
            backRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            hexBackRGB = colour
            break
        case "t":
            topRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            hexTopRGB = colour
            break
        case "bo":
            bottomRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            hexBottomRGB = colour
            break
        case "l":
            leftRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            hexLeftRGB = colour
            break
        case "r":
            rightRGB = [(1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2), 1]
            hexRightRGB = colour
            break
        default:
            break
    }
    reset = true
    main()
})

faceSel.oninput = function () {
    const data = new FormData(faceSel)
    let output
    
    for (const entry of data) {
        output = entry[1]
    }
    
    switch (output) {
        case "front":
            //faceRGB.value = hexFrontRGB
            colourBox.style.backgroundColor=hexFrontRGB
            currentFaceSel = "f"
            break
        case "back":
            colourBox.style.backgroundColor=hexBackRGB
            currentFaceSel = "ba"
            break
        case "top":
            colourBox.style.backgroundColor=hexTopRGB
            currentFaceSel = "t"
            break;
        case "bottom":
            colourBox.style.backgroundColor=hexBottomRGB
            currentFaceSel = "bo"
            break
        case "left":
            colourBox.style.backgroundColor=hexLeftRGB
            currentFaceSel = "l"
            break
        case "right":
            colourBox.style.backgroundColor=hexRightRGB
            currentFaceSel = "r"
            break
        default:
            break;
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
    } : null;
}
