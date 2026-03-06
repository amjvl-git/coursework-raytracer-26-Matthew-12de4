import { Vec3 } from './Vec3.js'
import { Sphere } from './Sphere.js'
import { Ray, RayCastResult, hit, miss, traceRay, backgroundColour, rayColour, setPixel } from './Ray.js'

// Main code
let imageWidth = document.getElementById("canvas").width
let imageHeight = document.getElementById("canvas").height
let aspectRatio = document.getElementById("canvas").height / document.getElementById("canvas").width

let viewportWidth = 2
let viewportHeight = viewportWidth * aspectRatio
let focalLength = 1.0

let camPosition = new Vec3(0, 0, 0)
let horizontal = new Vec3(viewportWidth, 0, 0)
let vertical = new Vec3(0, viewportHeight, 0)
let lowerLeftCorner = camPosition.minus(horizontal.scale(0.5)).minus(vertical.scale(0.5)).minus(new Vec3(0, 0, focalLength))
//console.log(camPosition, horizontal, vertical, lowerLeftCorner);

export const spheres = new Array(
    new Sphere(new Vec3(0,0,-1), 0.3, new Vec3(1,0,0)),       // Red sphere
    new Sphere(new Vec3(0,0.2,-0.8), 0.15, new Vec3(0,0,1)),  // Blue sphere
    new Sphere(new Vec3(0,-100.5,-1), 100, new Vec3(0,1,0))   // Big green sphere
);

for (let i = 0; i < imageWidth; i++)
{
    for (let j = 0; j <= imageHeight; j++)
    {
        
        let u = i / (imageWidth - 1)
        let v = j / (imageHeight - 1)
        
        let dir = lowerLeftCorner.add(horizontal.scale(u)).add(vertical.scale(v)).minus(camPosition)
        let ray = new Ray(camPosition, dir)
        let colour = rayColour(ray).scale(255)
        
        setPixel(i,j,colour)
    }
}