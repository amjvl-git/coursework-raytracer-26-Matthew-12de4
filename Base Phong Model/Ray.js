import { Vec3 } from './Vec3.js'
import { lightDirection, negLightDirection, camPosition, specIntensity, shadowIntensity, spheres } from './Main.js'
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
        return this.origin.add((this.direction).scale(t))
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
export function hit(ray, t, sphereIndex)
{
    let intersectPo = ray.pointAt(t)
    //let intersectNorm = intersectPo.minus(spheres[sphereIndex].centre).normalised()
    let intersectNorm = ((ray.origin.add(ray.direction.scale(t))).minus(spheres[sphereIndex].centre)).normalised()
    return new RayCastResult(intersectPo, intersectNorm, t, sphereIndex)
}

// Return a RayCastResult when a ray misses everything in the scene
export function miss()
{
    return new RayCastResult(new Vec3(0,0,0), new Vec3(0,0,0), -1, -1)
}

// Check whether a ray hits anything in the scene and return a RayCast Result
export function traceRay(ray)
{
    let t = 1000000
    let closestSphereI = -1

    for (let i = 0; i < spheres.length; i++)
    {
        let current_t = spheres[i].rayIntersects(ray)
        if (current_t > 0 && current_t < t)
        {
            t = current_t
            closestSphereI = i
        }
    }

    if (closestSphereI < 0) return miss()
    
    return hit(ray, t, closestSphereI)
}

// Calculate and return the background colour based on the ray
export function backgroundColour(ray)
{
    let white = new Vec3(1, 1, 1)
    let blue = new Vec3(0.3, 0.5, 0.9)
    let t = 0.5 * (ray.direction.y + 1.0)

    return white.scale(1-t).add(blue.scale(t))
}

// Returns the colour the ray should have as a Vec3 with RGB values in [0,1]
export function rayColour(ray) 
{
    let castResult = traceRay(ray)
    if (castResult.t < 0) return backgroundColour(ray)
    
    let reflectLight = lightDirection.minus(castResult.normal.scale(2 * castResult.normal.dot(lightDirection)))
    let viewDir = camPosition.minus(castResult.position)
    let specLight = Math.pow(Math.max(reflectLight.dot(viewDir), 0),specIntensity) * 0.8

    let shadow = traceRay(new Ray(castResult.position.add(castResult.normal.scale(0.05)), negLightDirection))

    let albedo = spheres[castResult.sphereIndex].colour
    let diffuse = Math.max(castResult.normal.dot(negLightDirection), 0)
    let colour = albedo.scale(0.05 + diffuse + specLight)

    if (shadow.t > 0) colour = colour.scale(shadowIntensity)
    return colour
}

// Sets a pixel at (x, y) in the canvas with an RGB Vec3
export function setPixel(x, y, colour)
{
    var c = document.getElementById("canvas")
    var ctx = c.getContext("2d")
    ctx.fillStyle = "rgba("+colour.x+","+colour.y+","+colour.z+","+1+")"
    ctx.fillRect(x, c.height - y, 1, 1)
}