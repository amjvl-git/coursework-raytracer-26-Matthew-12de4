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
let samples = 50

export let camPosition = new Vec3(0, 0, 0)
let horizontal = new Vec3(viewportWidth, 0, 0)
let vertical = new Vec3(0, viewportHeight, 0)
let lowerLeftCorner = camPosition.minus(horizontal.scale(0.5)).minus(vertical.scale(0.5)).minus(new Vec3(0, 0, focalLength))

export let lightDirection = new Vec3(-1.1, -1.3, -1.5).normalised()
export let negLightDirection = new Vec3(-lightDirection.x, -lightDirection.y, -lightDirection.z)

export let specIntensity = 4
export let shadowIntensity = 0.4

export const spheres = new Array(
    new Sphere(new Vec3(0,0,-1), 0.3, new Vec3(1,0,0)),       // Red sphere
    new Sphere(new Vec3(0,0.2,-0.8), 0.15, new Vec3(0,0,1)),  // Blue sphere
    new Sphere(new Vec3(0, -100.5, -1), 100, new Vec3(0, 1, 0)),  // Big green sphere
    new Sphere(new Vec3(-0.4,0,-1.3), 0.35, new Vec3(1,0,1)) //vec3(xyz) scale Vec3(RGB)
);

let pseudo = Math.random()

for (let i = 0; i < imageWidth; i++)
{
    for (let j = 0; j <= imageHeight; j++)
    {
        let colour = new Vec3(0, 0, 0)
        for (let k = 0; k < samples; k++){
            let u = i / (imageWidth - 1)
            let v = j / (imageHeight - 1)
            
            let dir = lowerLeftCorner.add(horizontal.scale(u)).add(vertical.scale(v)).minus(camPosition)
            dir = dir.add(new Vec3(pseudo/imageWidth, pseudo/imageHeight, 0))
            let ray = new Ray(camPosition, dir)
    
            colour = colour.add(rayColour(ray))
        }

        colour = colour.scale(1/samples)
        let gammaCor = new Vec3(Math.pow(colour.x, 1 / (2.2)), Math.pow(colour.y, 1 / (2.2)), Math.pow(colour.z, 1 / (2.2)))
        
        colour = gammaCor.scale(255)

        setPixel(i,j,colour)
    }
}