import app from '../app'
import request from 'supertest'
import {distance} from '../helperFunctions'
import {Section} from '../types'

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

})