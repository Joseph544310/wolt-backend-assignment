export interface Restaurant {
    blurhash: string,
    launch_date: string,
    location: Array<number>,
    name: string,
    online: boolean,
    popularity: number
}

export interface Section {
    title: string,
    restaurants: Restaurant[]
}
