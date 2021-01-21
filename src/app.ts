import express from 'express'
import discoveryRoute from './discovery'

const app: express.Application = express()

app.use('/discovery', discoveryRoute)

app.get('/', (req:express.Request, res:express.Response) => {
    res.send("It's working!!")
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log('Listenning...'))

export default app;