import express from 'express'
import data from './restaurants.json'

const router: express.Router = express.Router()

const distance = (location1:number[], location2:number[]): number => {
    return Math.sqrt(Math.pow(location1[0] - location2[0], 2) + Math.pow(location1[1] - location2[1], 2))
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
    let popular: Restaurant[] = restaurants.sort( (a, b) => {
        if (a.online && !b.online) return -1;
        else if (!a.online && b.online) return 1;
        else return b.popularity - a.popularity;
    })
    // Only first 10
    popular = popular.slice(0, Math.min(popular.length, 10))

    res.json({
        popular
    })
})

export default router;