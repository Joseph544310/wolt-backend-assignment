import express from 'express'

const app: express.Application = express()

app.get('/', (req:express.Request, res:express.Response) => {
    res.send("It's working!!")
})

app.listen(5000, () => console.log('Listenning...'))