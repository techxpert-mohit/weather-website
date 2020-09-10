const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()


// Define Paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//Set up handle bars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Mohit Vashishtha'
    })
})

app.get('/about',(req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Mohit Vashishtha'
    })
})

app.get('/help',(req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Mohit Vashishtha'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, {latitude,longitude,location} = {}) => {
        if(error) {
          return res.send({error}) 
        } 
    
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404',{
        title: '404',
        errorMessage: 'Help article not found',
        name: 'Mohit Vashishtha'
    })
})

app.get('*', (req,res) => {
    res.render('404',{
        title: '404',
        errorMessage: 'My 404 page',
        name: 'Mohit Vashishtha'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})