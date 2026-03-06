// A sphere in 3D space. Has centre, radius and colour all of which are Vec3s
import { Vec3 } from "./Vec3.js"
export class Sphere
{
    constructor (centre, radius, colour)
    {
        this.centre = centre
        this.radius = radius
        this.colour = colour
    }

    // Calculate the point on the sphere  where the ray intersects using 
    // a quadratic equation and return the t value of the ray for that point
    // If two solutions exist return the minus solution
    // If no solutions exist return -1
    rayIntersects(ray)
    {
        let a = ray.direction.dot(ray.direction)
        let oc = ray.origin.minus(this.centre)
        let b = (ray.direction.scale(2)).dot(oc)
        let c = oc.dot(oc) - this.radius**2
        
        let discrim = (b**2)-4*a*c
        
        if (discrim > 0) {
            return (-b-Math.sqrt(b**2 - 4*a*c))/2*a
        }
        else {
            return -1
        }
    }
}