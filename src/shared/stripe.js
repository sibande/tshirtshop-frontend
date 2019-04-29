import {stripeTokenHandler} from './../controllers/customer';



// Init Facebook
export  function initStripe(orderData) {
  if (typeof Stripe === 'undefined') {
    var tag = document.createElement("script");
    tag.src = "https://js.stripe.com/v3/";
    tag.async = "async";
    tag.defer = "defer";
    tag.onload = function() {
      

      var stripe = Stripe('pk_test_qusTUGCVV0b8ptzpEFF6Gan300Q13Il4BN');

      // Create an instance of Elements.
      var elements = stripe.elements();

      // Custom styling can be passed to options when creating an Element.
      // (Note that this demo uses a wider set of styles than the guide below.)
      var style = {
	base: {
	  color: '#32325d',
	  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
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
      };

      // Create an instance of the card Element.
      var card = elements.create('card', {style: style});

      // Add an instance of the card Element into the `card-element` <div>.
      card.mount('#card-element');

      // Handle real-time validation errors from the card Element.
      card.addEventListener('change', function(event) {
	var displayError = document.getElementById('card-errors');
	if (event.error) {
	  displayError.textContent = event.error.message;
	} else {
	  displayError.textContent = '';
	}
      });

      // Handle form submission.
      var form = document.getElementById('payment-form');
      form.addEventListener('submit', function(event) {
	event.preventDefault();

	stripe.createToken(card).then(function(result) {
	  if (result.error) {
	    // Inform the user if there was an error.
	    var errorElement = document.getElementById('card-errors');
	    errorElement.textContent = result.error.message;
	  } else {
	    // Send the token to your server.
	    stripeTokenHandler(result.token, orderData);
	  }
	});
      });

    };
    document.getElementsByTagName("head")[0].appendChild(tag);
  }

}
