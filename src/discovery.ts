import express from 'express'
import data from './restaurants.json'

const router: express.Router = express.Router()

const distance = (location1:number[], location2:number[]): number => {
    return Math.sqrt(Math.pow(location1[0] - location2[0], 2) + Math.pow(location1[1] - location2[1], 2))
}

const lessThanFourMonthsAgo = (date: number): boolean => {

    const Month = 1000 * 60 * 60 * 24 * 30;
    const fourMonthsAgo = Date.now() - 4*Month;

    return date > fourMonthsAgo;
}

interface Restaurant {
    blurhash: string,
    launch_date: string,
    location: Array<number>,
    name: string,
    online: boolean,
    popularity: number
}

router.get('/', (req:express.Request, res: express.Response) => {
    const lat: number = Number(req.query.lat)
    const lon: number = Number(req.query.lon)
    const location: number[] = [lon, lat]
    
    // Filtering restaurants within 1.5km radius
    const restaurants: Restaurant[] = data.restaurants.filter(restaurant => distance(location, restaurant.location) < 1.5)

    // Sort in descending order of popularity with online restaurants taking precedence
    let popularRestaurants: Restaurant[] = restaurants.sort( (a, b) => {
        if (a.online && !b.online) return -1;
        else if (!a.online && b.online) return 1;
        else return b.popularity - a.popularity;
    })
    // Only first 10
    popularRestaurants = popularRestaurants.slice(0, Math.min(popularRestaurants.length, 10))

    // Sort in descending order of launch date with online restaurants taking precedence
    let newRestaurants: Restaurant[] = restaurants.sort( (a, b) => {
        if (a.online && !b.online) return -1;
        else if (!a.online && b.online) return 1;
        else {
            const a_date:Date = new Date(a.launch_date)
            const b_date:Date = new Date(b.launch_date)
            if (a_date < b_date) return 1;
            else if (a_date > b_date) return -1;
            else return 0;
        };
    })
    // Not older than 4 months
    newRestaurants = newRestaurants.filter(restaurant => lessThanFourMonthsAgo(new Date(restaurant.launch_date).getTime()))
    // Only first 10
    newRestaurants = newRestaurants.slice(0, Math.min(newRestaurants.length, 10))

    // Sort in descending order of distance with online restaurants taking precedence
    let nearbyRestaurants: Restaurant[] = restaurants.sort( (a, b) => {
        if (a.online && !b.online) return -1;
        else if (!a.online && b.online) return 1;
        else return distance(location, b.location) - distance(location, a.location);
    })
    // Only first 10
    nearbyRestaurants = nearbyRestaurants.slice(0, Math.min(nearbyRestaurants.length, 10))

    res.json({
        popularRestaurants,
        newRestaurants,
        nearbyRestaurants
    })
})

export default router;