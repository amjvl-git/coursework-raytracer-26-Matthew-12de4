import { Vec3 } from './Vec3.js'
import { Sphere } from './Sphere.js'
import { Ray, rayColour, setPixel } from './Ray.js'

// Main code
let imageWidth = document.getElementById("canvas").width
let imageHeight = document.getElementById("canvas").height
let aspectRatio = document.getElementById("canvas").height / document.getElementById("canvas").width

let viewportWidth = 2
let viewportHeight = viewportWidth * aspectRatio
let focalLength = 1.0
let samples = 1

export let camPosition = new Vec3(0, 0, 0)
let horizontal = new Vec3(viewportWidth, 0, 0)
let vertical = new Vec3(0, viewportHeight, 0)
let lowerLeftCorner = camPosition.minus(horizontal.scale(0.5)).minus(vertical.scale(0.5)).minus(new Vec3(0, 0, focalLength))

export let lightDirection = new Vec3(-1.1, -1.3, -1.5).normalised()
export let negLightDirection = new Vec3(-lightDirection.x, -lightDirection.y, -lightDirection.z)

export let specIntensity = 4
export let shadowIntensity = 0.4
let gammaCorenabled = true

export const spheres = new Array(
    new Sphere(new Vec3(0,0,-1), 0.3, new Vec3(1,0,0)),       // Red sphere
    new Sphere(new Vec3(0,0.2,-0.8), 0.15, new Vec3(0,0,1)),  // Blue sphere
    new Sphere(new Vec3(0, -100.5, -1), 100, new Vec3(0, 1, 0)),  // Big green sphere
    new Sphere(new Vec3(-0.4,0,-1.3), 0.35, new Vec3(1,0,1)) //vec3(xyz), scale, Vec3(RGB)
);

function render() {
    let pseudo = Math.random()
    
    for (let i = 0; i < imageWidth; i++) {

        for (let j = 0; j <= imageHeight; j++) {

            let colour = new Vec3(0, 0, 0)

            for (let k = 0; k < samples; k++){
                let u = i / (imageWidth - 1)
                let v = j / (imageHeight - 1)

                let dir = lowerLeftCorner.add(horizontal.scale(u)).add(vertical.scale(v)).minus(camPosition)
                dir = dir.add(new Vec3(pseudo/imageWidth, pseudo/imageHeight, 0))
                let ray = new Ray(camPosition, dir)

                colour = colour.add(rayColour(ray))
            }
            colour = colour.scale(1 / samples)
            
            if (gammaCorenabled) {
                let gammaCor = new Vec3(Math.pow(colour.x, 1 / (2.2)), Math.pow(colour.y, 1 / (2.2)), Math.pow(colour.z, 1 / (2.2)))
                colour = gammaCor.scale(255)
            }
            else {
                colour = colour.scale(255)
            }
            setPixel(i,j,colour)
        }
    }
}
render()

const sliderxyz = document.getElementById("Val")
const sliderscal = document.getElementById("scal")
const colourpic = document.getElementById("col")
const xyz = document.getElementById("xyz")

const lixyz = document.getElementById("lixyz")
const lightxyz = document.getElementById("LiTra")

const reset = document.getElementById("reset")

const gam = document.getElementById("gam")
const sam = document.getElementById("sam")
const ref = document.getElementById("refresh")

const canW = document.getElementById("CanW")
const canH = document.getElementById("CanH")
const set = document.getElementById("setcan")

const shad = document.getElementById("sha")
const spec = document.getElementById("spec")

let lix = -1.1
let liy = -1.3
let liz = -1.5


let x = 0
let y = 0
let z = -1
let scale = 0.3
let colour = new Vec3(1, 0, 0)

reset.onclick = function () {
    window.location.reload(true);
    return false
}

sliderxyz.oninput = function () {
    const data = new FormData(xyz)
    let output
    
    for (const entry of data) {
        output = entry[1]
    }
    switch (output) {
        case "x":
            x = this.value
            break;
        case "y":
            y = this.value
            break
        case "z":
            z = this.value
            break
        default:
            break;
    }

    spheres[0] = new Sphere(new Vec3(x, y, z), scale, colour)
    render()
}

xyz.oninput = function () {
    const data = new FormData(xyz)
    let output
    
    for (const entry of data) {
        output = entry[1]
    }
    switch (output) {
        case "x":
            sliderxyz.value = x
            break;
        case "y":
            sliderxyz.value = y
            break
        case "z":
            sliderxyz.value = z
            break
        default:
            break;
    }
}

lightxyz.oninput = function () {
    const data = new FormData(lixyz)
    let output
    
    for (const entry of data) {
        output = entry[1]
    }
    switch (output) {
        case "x":
            lix = this.value
            break;
        case "y":
            liy = this.value
            break
        case "z":
            liz = this.value
            break
        default:
            break;
    }

    lightDirection = new Vec3(lix, liy, liz).normalised()
    negLightDirection = new Vec3(-lightDirection.x, -lightDirection.y, -lightDirection.z)
    render()
}

lixyz.oninput = function () {
    const data = new FormData(lixyz)
    let output
    
    for (const entry of data) {
        output = entry[1]
    }
    switch (output) {
        case "x":
            lightxyz.value = lix
            break;
        case "y":
            lightxyz.value = liy
            break
        case "z":
            lightxyz.value = liz
            break
        default:
            break;
    }
}

sliderscal.oninput = function () {
    scale = this.value
    spheres[0] = new Sphere(new Vec3(x, y, z), scale, colour)
    render()
}

colourpic.addEventListener("change", function (ev) {
    colour = ev.target.value
    colour = new Vec3((1 / 255 * hexToRgb(colour).r).toFixed(2), (1 / 255 * hexToRgb(colour).g).toFixed(2), (1 / 255 * hexToRgb(colour).b).toFixed(2))
    spheres[0] = new Sphere(new Vec3(x, y, z), scale, colour)
    render()
    
})
gam.oninput = function () {
    gammaCorenabled = this.checked
    render()
}

sha.oninput = function () {
    shadowIntensity = this.value
    render()
}

spec.oninput = function () {
    specIntensity = this.value
    render()
}

ref.onclick = function () {
    samples = sam.value
    render()
}

set.onclick = function () {
    document.getElementById("canvas").width = canW.value
    document.getElementById("canvas").height = canH.value
    imageWidth = document.getElementById("canvas").width
    imageHeight = document.getElementById("canvas").height
    aspectRatio = document.getElementById("canvas").height / document.getElementById("canvas").width
    viewportHeight = viewportWidth * aspectRatio
    horizontal = new Vec3(viewportWidth, 0, 0)
    vertical = new Vec3(0, viewportHeight, 0)
    lowerLeftCorner = camPosition.minus(horizontal.scale(0.5)).minus(vertical.scale(0.5)).minus(new Vec3(0, 0, focalLength))
    render()
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
    } : null;
}
