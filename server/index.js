const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const router = require('./router/route')
const connection = require('./database/connection')
const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors()) 
app.use('/api/v1', router)
app.use(morgan('tiny'));
app.disable('x-powered-by')


app.get('/', (req, res) => {
    res.send("welocome to homepage")
        .end()
})
connection().then(() => {
    try {
        app.listen(port, () => {
            console.log(`server listing on port http://localhost:${port}`);
        })
    } catch (err) {
        console.log(err);
    }
})

