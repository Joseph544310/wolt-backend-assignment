export const distance = (location1:number[], location2:number[]): number => {
    /* Found this online:
    This uses the ‘haversine’ formula to calculate the great-circle distance between
    two points – that is, the shortest distance over the earth’s surface 
    – giving an ‘as-the-crow-flies’ distance between the points 
    (ignoring any hills they fly over, of course!).*/

    const [lon1, lat1] = location1
    const [lon2, lat2] = location2

    const R = 6371; // Kilometres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in Kilometres
    return d;
}

export const lessThanFourMonthsAgo = (date: number): boolean => {

    const Month = 1000 * 60 * 60 * 24 * 30;
    const fourMonthsAgo = Date.now() - 4*Month;

    return date > fourMonthsAgo;
}