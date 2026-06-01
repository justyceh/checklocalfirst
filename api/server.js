import express from 'express'
import businessRouter from './routes/businesses.js'
import userRouter from './routes/users.js'
import categoryRouter from './routes/categories.js'
import serviceRouter from './routes/services.js'
import searchRouter from './routes/search.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello World')
    console.log("Check Local First API");
})

app.use('/businesses', businessRouter)
app.use('/users', userRouter)
app.use('/services', serviceRouter)
app.use('/categories', categoryRouter)
app.use('/search', searchRouter)


app.listen(3000, () => {
    console.log("Server running on port 3000");
})