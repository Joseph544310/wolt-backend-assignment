export const distance = (location1:number[], location2:number[]): number => {
    return Math.sqrt(Math.pow(location1[0] - location2[0], 2) + Math.pow(location1[1] - location2[1], 2))
}

export const lessThanFourMonthsAgo = (date: number): boolean => {

    const Month = 1000 * 60 * 60 * 24 * 30;
    const fourMonthsAgo = Date.now() - 4*Month;

    return date > fourMonthsAgo;
}