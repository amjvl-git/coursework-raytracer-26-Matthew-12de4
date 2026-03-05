import { Vec3 } from './Vec3.js'
import { Sphere } from './Sphere.js'
import { Ray, RayCastResult, hit, miss, traceRay, backgroundColour, rayColour, setPixel } from './Ray.js'
const spheres = new Array(
    new Sphere(new Vec3(0,0,-1), 0.3, new Vec3(1,0,0)),       // Red sphere
    new Sphere(new Vec3(0,0.2,-0.8), 0.15, new Vec3(0,0,1)),  // Blue sphere
    new Sphere(new Vec3(0,-100.5,-1), 100, new Vec3(0,1,0))   // Big green sphere
);

// Main code
let imageWidth = document.getElementById("canvas").width
let imageHeight = document.getElementById("canvas").height
let aspectRatio = document.getElementById("canvas").height / document.getElementById("canvas").width

let colour = new Vec3(255,0,0) //RGB

let ray = new Ray(new Vec3(10, 10, 10),new Vec3(20, 20, 20))
console.log(ray.pointAt(0.5));


for (let i = 0; i < imageWidth; i++)
{
    for (let j = 0; j <= imageHeight; j++)
    {
        setPixel(i,j,colour)
    }
}

