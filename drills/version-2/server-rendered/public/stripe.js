const stripePublicKey = 'pk_test_2PoAoRSfJheNh9z21yQRzab7'
const stripe = Stripe(stripePublicKey)
const card = buildCard()
document.querySelector('#payment-form').addEventListener('submit', paymentFormHandler)

function buildCard(){
    const card = stripe.elements().create('card', {
        style: {
            base: {
                color: '#32325d',
                fontFamily: "'Helvetica Neue', Helvetica sans-serif",
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }
    })
    card.mount('#card-element')
    card.addEventListener('change', creditCardChangeHandler)

    return card
}

function paymentFormHandler(event){
    event.preventDefault()

    stripe.createToken(card).then(result => {
        result.error
            ? document.querySelector('#card-errors').textContent = result.error.message
            : stripeTokenHandler(result.token, event.target)
    })
}

function stripeTokenHandler(token, form) {
    const hiddenInput = document.createElement('input')

    hiddenInput.setAttribute('type', 'hidden')
    hiddenInput.setAttribute('name', 'stripeToken')
    hiddenInput.setAttribute('value', token.id)

    form.appendChild(hiddenInput)
    form.submit()
}

function creditCardChangeHandler(event){
    const $errors = document.querySelector('#card-errors')
    event.error
        ? $errors.textContent = event.error.message
        : $errors.textContent = ''
}