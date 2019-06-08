import {configure, renderString, render} from 'nunjucks';
var M = require('materialize-css/dist/js/materialize.js');

import ProductService from './../services/product';
import CustomerService from './../services/customer';
import ShoppingcartService from './../services/shoppingcart';
import OrderService from './../services/order';
var facebook = require('./../shared/facebook');
var stripe = require('./../shared/stripe');
var routes = require('./../routes');

var messages = require('./../shared/messages');

var productService = new ProductService();
var customerService = new CustomerService();
var orderService = new OrderService();
var shoppingcartService = new ShoppingcartService();



// Submit the form with the token ID.
export function stripeTokenHandler(token, orderData) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  var grandTotal = (orderData.total_amount + orderData.shipping_cost) * 100;
  orderService.chargeOrder(
    token.id, orderData.order_id, 'Order # ' +orderData.order_id, grandTotal, 'usd').then(function(data) {
      if (!('error' in data)) {
	routes.router.navigate("/", true);
	localStorage.removeItem('draftOrder');
      }
    });
}


function updateShipping(e) {
  var customParams = e.target.customParams;
  var form = customParams.form;

  var address1 = form.querySelector('input[name=address_1]').value;
  var address2 = form.querySelector('input[name=address_2]').value;
  var region = form.querySelector('input[name=region]').value;
  var city = form.querySelector('input[name=city]').value;
  var postalCode = form.querySelector('input[name=postal_code]').value;
  var country = form.querySelector('input[name=country]').value;
  var shippingRegionId = document.querySelector('select[name="shipping_region_id"]').value;
  var shippingType = document.querySelector('select[name="shipping_type"]').value;


  localStorage.setItem('draftOrder', JSON.stringify({
    address1: address1,
    address2: address2,
    region: region,
    city: city,
    postalCode: postalCode,
    country: country,
    shippingRegionId: shippingRegionId,
    shippingType: shippingType
  }));

  routes.router.navigate('/shoppingcart/confirm', true);
}


function handleShippingRegionChange(e) {

  var elem = e.target;
  if (elem.value) {
    var shippingRegionId = elem.value;
    orderService.getShippingTypesByRegion(shippingRegionId).then(function(data) {
      render('_shipping_types.html', {shippingTypes: data}, function(err, res) {

	var formDiv = document.querySelector('form .shipping-types');
	formDiv.innerHTML = res;

	var elems = document.querySelectorAll('select');
	var instances = M.FormSelect.init(elems, {});
      });
    });
  }
}


function confirmOrder(e) {
  var draftOrder;
  try {
    draftOrder = JSON.parse(localStorage.getItem('draftOrder'));
  } catch (e) {
    draftOrder = null;
  }

  if (draftOrder) {
    customerService.updateCustomerAddress(
      draftOrder.address1, draftOrder.address2, draftOrder.city, draftOrder.region,
      draftOrder.postalCode, draftOrder.country, draftOrder.shippingRegionId
    ).then(function(data) {
      localStorage.setItem('customer', JSON.stringify(data));

      var shoppingCart = shoppingcartService.getShoppingcart();

      orderService.createOrder(shoppingCart.cartId, draftOrder.shippingType, 2).then(function(data) {
	if (!('error' in data)) {
	  routes.router.navigate("/shoppingcart/payment/" + data.orderId, true);
	}
      });
    });
  }
}


export default class CustomerController {

  constructor() {
  }

  handleShippingEvent() {
    var element = document.querySelector('form button.shipping');

    element.removeEventListener('click', updateShipping);
    element.addEventListener('click', updateShipping);
    element.customParams = {
      form: element.closest('form')
    };
  }


  handleShippingRegionChangeEvent() {
    var element = document.querySelector('form select[name="shipping_region_id"]');

    element.removeEventListener('change', handleShippingRegionChange);
    element.addEventListener('change', handleShippingRegionChange);
    element.customParams = {
      controller: this
    };
  }

  handleConfirmOrderEvent() {
    var element = document.querySelector('form button.confirm');

    element.removeEventListener('click', confirmOrder);
    element.addEventListener('click', confirmOrder);
    element.customParams = {
      form: element.closest('form')
    };
  }

  renderConfirm() {
    var that = this;

    //
    if (!localStorage.getItem('authorizationKey')) {
      return routes.router.navigate('/login' + data.orderId, true);
    }

    var shoppingCart = shoppingcartService.getShoppingcart();

    if (shoppingCart.cartId) {
      var cartId = shoppingCart.cartId;
      Promise.all([
	shoppingcartService.getCartProducts(cartId),
	shoppingcartService.getCartTotalAmount(cartId)
      ]).then(function(data) {
	var cartItems = data[0];
	var totalAmount = data[1]['total_amount'];

	if (cartItems.length == 0) {
	  routes.router.navigate('/', true);
	  return false;
	}

	cartItems.map(function(item) {
	  try {
	    item.attributes = JSON.parse(item.attributes);
	  } catch (e) {
	  }
	  return item;
	});

	var draftOrder;
	try {
	  draftOrder = JSON.parse(localStorage.getItem('draftOrder'));
	} catch (e) {
	  draftOrder = {};
	}

	orderService.getShippingTypesByRegion(draftOrder.shippingRegionId).then(function(data) {
	  var context = {
	    cartItems: cartItems,
	    totalAmount: totalAmount,
	    draftOrder: draftOrder,
	    shippingTypes: data
	  };



	  render('confirm.html', context, function(err, res) {
	    var mainDiv = document.getElementById('main');
	    mainDiv.innerHTML= res;
	    //
	    that.handleConfirmOrderEvent();
	  });
	});
      });
    }
  }

  renderPayment(params, query) {
    //
    if (!localStorage.getItem('authorizationKey')) {
      return routes.router.navigate('/login', true);
    }
    var that = this;

    orderService.getOrder(params.orderId).then(function(data) {
      var grandTotal = data.total_amount + data.shipping_cost;
      render('payment.html', {order: data, grandTotal: grandTotal}, function(err, res) {
	var mainDiv = document.getElementById('main');
	mainDiv.innerHTML= res;

	stripe.initStripe(data);
      });
    });

  }

  
  renderShipping() {
    //
    if (!localStorage.getItem('authorizationKey')) {
      return routes.router.navigate('/login', true);
    }
    
    var that = this;


    Promise.all([customerService.getCustomer(), orderService.getShippingRegions()]).then(function(data) {
      var customer = data[0];
      var shippingRegions = data[1];

      if ('error' in customer) {
	messages.error(customer.error.message || 'Internal error');
	return routes.router.navigate('/login', true);
      }

      render('shipping_details.html', {customer: customer, shippingRegions: shippingRegions}, function(err, res) {
	var mainDiv = document.getElementById('main');

	mainDiv.innerHTML= res;

	M.updateTextFields();

	var elems = document.querySelectorAll('select');
	var instances = M.FormSelect.init(elems, {});

	var intervalId = setTimeout(() => {
	  var shippingRegionElem = document.querySelector('select[name="shipping_region_id"]');
	  shippingRegionElem.dispatchEvent(new Event('change', { 'bubbles': true }));
	}, 100);

	that.handleShippingEvent();
	that.handleShippingRegionChangeEvent();
      });

    });

  }
  
  render() {

  }
  
}
