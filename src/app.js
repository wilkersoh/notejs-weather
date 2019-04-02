const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');




const app = express();
// Define paths for template
const partialsPath = path.join(__dirname,'../templates/partials');

app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '../public')));
hbs.registerPartials(partialsPath);

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Yz'
    })
}) 

app.get('/about', (req, res) => {
    res.render('about', {
        ejs: "Choose ejs or hbs",
        title: 'About'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        help: "Choose routher or app",
        title: 'Help'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404',{
        title: '404',
        name: 'yz',
        errorMsg: 'Help article not Found in here',
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({ error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({ error})
            }
            res.send({
                forecase: forecastData,
                location,
                address: req.query.address
            })
        })

    })
})

app.get('/product', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    res.send({
        products: [],
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'yz',
        errorMsg: 'Page not Found in here',
    })
})

app.listen(3000, () => {
    console.log('Listening port 3000');
});

