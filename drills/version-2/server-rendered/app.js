require('dotenv').load()

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const path = require('path')
const keyPublishable = process.env.PUBLISHABLE_KEY
const keySecret = process.env.SECRET_KEY

const stripe = require('stripe')(keySecret)


app.use(bodyParser.urlencoded({extended: false}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(require('serve-static')(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
    response.redirect('/bill')
})

app.get('/bill', (request, response) => {
    response.render('bill', {keyPublishable})
})

app.post('/charge', (request, response) => {
    // let amount = 500

    stripe.customers.create({
        email: request.body.stripeEmail,
        source: request.body.stripeToken
    })
    .then(customer => 
        stripe.charges.create({
            amount, 
            description: 'Sample Charge',
            currency: 'usd',
            customer: customer.id
        }))
        .then(charge => response.render('success', {amount: charge.amount}))
})



app.listen(process.env.PORT || 3000)

