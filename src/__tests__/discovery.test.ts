import app from '../app'
import request from 'supertest'
import {distance, lessThanFourMonthsAgo} from '../helperFunctions'
import {Restaurant, Section} from '../types'

describe('discovery route', () => {
    
    test('All returned sections have non-empty restaurants list', async (done) => {

        const result = await request(app).get('/discovery?lat=60.1709&lon=24.941')
        
        const sections: Section [] = result.body.sections
        sections.forEach((section: Section) => {
            expect(section.restaurants.length).not.toEqual(0)
        })

        done()
    })

    test('All returned restaurants are within 1.5km range', async (done) => {

        const result = await request(app).get('/discovery?lat=60.1709&lon=24.941')
    
        const sections: Section [] = result.body.sections
        sections.forEach((section: Section) => {
            section.restaurants.forEach(restaurant => {
                expect(distance([24.941, 60.1709], restaurant.location)).toBeLessThanOrEqual(1.5)
            })
        })
    
        done()  
    })

    test('Popular restaurants are sorted by popularity in descending order', async (done) => {

        const result = await request(app).get('/discovery?lat=60.1709&lon=24.941')
    
        const sections: Section [] = result.body.sections
        sections.forEach((section: Section) => {
            const restaurants: Restaurant[] = section.restaurants
            if (section.title === 'Popular Restaurants') {

                for (let i=0; i<restaurants.length - 1; i+=1) {

                    if (restaurants[i].online) {
                        expect(restaurants[i].popularity >= restaurants[i+1].popularity ||
                            restaurants[i+1].online === false).toBeTruthy()
                    }

                    else {
                        expect(restaurants[i+1].online).toBeFalsy()
                        expect(restaurants[i].popularity).toBeGreaterThanOrEqual(restaurants[i+1].popularity)
                    }
                        
                }
            }
        })
    
        done()  
    })

    test('New restaurants are sorted by launch date in descending order and are less than 4-month old', async (done) => {

        const result = await request(app).get('/discovery?lat=60.1709&lon=24.941')
    
        const sections: Section [] = result.body.sections
        sections.forEach((section: Section) => {
            const restaurants: Restaurant[] = section.restaurants
            if (section.title === 'New Restaurants') {
                
                for (let i=0; i<restaurants.length - 1; i+=1) {

                    const date1: Date = new Date(restaurants[i].launch_date)
                    const date2: Date = new Date(restaurants[i+1].launch_date)

                    // Not older than 4 months
                    expect(lessThanFourMonthsAgo(date1.getTime())).toBeTruthy()

                    if (restaurants[i].online) {
                        expect(date1 >= date2 || restaurants[i+1].online === false).toBeTruthy()
                    }

                    else {
                        expect(restaurants[i+1].online).toBeFalsy()
                        expect(date1 >= date2).toBeTruthy()
                    }
                        
                }
            }
        })
    
        done()  
    })

    test('Nearby restaurants are sorted by distance in ascending order', async (done) => {

        const result = await request(app).get('/discovery?lat=60.1709&lon=24.941')
    
        const sections: Section [] = result.body.sections
        sections.forEach((section: Section) => {
            const restaurants: Restaurant[] = section.restaurants
            if (section.title === 'Nearby Restaurants') {
                
                for (let i=0; i<restaurants.length - 1; i+=1) {

                    const distance1: number = distance([24.941, 60.1709], restaurants[i].location)
                    const distance2: number = distance([24.941, 60.1709], restaurants[i+1].location)

                    if (restaurants[i].online) {
                        expect(distance1 <= distance2 || restaurants[i+1].online === false).toBeTruthy()
                    }

                    else {
                        expect(restaurants[i+1].online).toBeFalsy()
                        expect(distance1 <= distance2).toBeTruthy()
                    }
                        
                }
            }
        })
    
        done()  
    })
})