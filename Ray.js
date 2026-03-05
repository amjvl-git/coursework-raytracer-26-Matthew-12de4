import { Vec3 } from './Vec3.js'
// Ray which has an origin and direction, both are Vec3s
export class Ray
{
    constructor (origin, direction)
    {
        this.origin = origin
        this.direction = direction
    }

    // Calculate and return the point in space (a Vec3) for this ray for the given value of t
    pointAt(t)
    {
        let px = (1 - t) * this.origin.x + (t * this.direction.x)
        let py = (1 - t) * this.origin.y + (t * this.direction.y)
        let pz = (1 - t) * this.origin.z + (t * this.direction.z)
        return new Vec3(px,py,pz)
        
    }
}

// The result of casting a ray into our scene
// Position is the point where the ray intersects a sphere in the scene
// Normal is the normal unit vector of the sphere at the intersection point
// t is the t value along the ray where the intersection point is.  This value should, be -1 when the ray hits nothing
// SphereIndex is the array index of the sphere hit by the ray
export class RayCastResult
{
    constructor(position, normal, t, sphereIndex)
    {
        this.position = position
        this.normal = normal
        this.t = t
        this.sphereIndex = sphereIndex
    }
}

// Calculate the intersection point and normal when a ray hits a sphere. Returns a RayCastResult.
export function hit(ray, t, sphereIndex) {}

// Return a RayCastResult when a ray misses everything in the scene
export function miss()
{
    return new RayCastResult(new Vec3(0,0,0), new Vec3(0,0,0), -1, -1)
}

// Check whether a ray hits anything in the scene and return a RayCast Result
export function traceRay(ray)
{
    return miss()
}

// Calculate and return the background colour based on the ray
export function backgroundColour(ray)
{
        return new Vec3(0.3,0.5,0.9) // Blue
}

// Returns the colour the ray should have as a Vec3 with RGB values in [0,1]
export function rayColour(ray) 
{
    let castResult = traceRay(ray)
    if(castResult.t < 0) return backgroundColour(ray)
    return new Vec3(1,0,0) // Red
}

// Sets a pixel at (x, y) in the canvas with an RGB Vec3
export function setPixel(x, y, colour)
{
    var c = document.getElementById("canvas")
    var ctx = c.getContext("2d")
    ctx.fillStyle = "rgba("+colour.x+","+colour.y+","+colour.z+","+1+")"
    ctx.fillRect(x, c.height - y, 1, 1)
}