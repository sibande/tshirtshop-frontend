import {configure, renderString, render} from 'nunjucks';
var M = require('materialize-css/dist/js/materialize.js');
var forms = require('./../shared/forms');

import BaseController from './base';
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
	routes.router.navigate("/shoppingcart/completed", true);
	localStorage.removeItem('draftOrder');
      }
    });
}


function updateShipping(e) {
  var customParams = e.target.customParams;
  var form = customParams.form;

  var name = form.querySelector('input[name=name]').value,
      address1 = form.querySelector('input[name=address_1]').value,
      address2 = form.querySelector('input[name=address_2]').value,
      region = form.querySelector('input[name=region]').value,
      city = form.querySelector('input[name=city]').value,
      postalCode = form.querySelector('input[name=postal_code]').value,
      country = form.querySelector('input[name=country]').value,
      shippingRegionId = document.querySelector('select[name="shipping_region_id"]').value,
      shippingType = document.querySelector('select[name="shipping_type"]').value;

  var data = {
    name: name,
    address_1: address1,
    address_2: address2,
    region: region,
    city: city,
    postal_code: postalCode,
    country: country,
    shipping_region_id: shippingRegionId,
    shipping_type: shippingType
  };

  var constraints = {
    name: {
      presence: {allowEmpty: false}
    },
    address_1: {
      presence: {allowEmpty: false}
    },
    region: {
      presence: {allowEmpty: false}
    },
    city: {
      presence: {allowEmpty: false}
    },
    city: {
      presence: {allowEmpty: false}
    },
    country: {
      presence: {allowEmpty: false}
    },
    postal_code: {
      presence: {allowEmpty: false}
    },
    shipping_region_id: {
      presence: {allowEmpty: false}
    },
    shipping_type: {
      presence: {allowEmpty: false}
    }
  };

  if (!forms.validateForm(form, data, constraints)) {
    return false;
  }

  localStorage.setItem('draftOrder', JSON.stringify(data));

  routes.router.navigate('/shoppingcart/confirm', true);
}

function customerUpdate(e) {
  var elem = e.target;

  var customParams = e.target.customParams;
  var form = customParams.form;

  const formData = new FormData(form);

  var data = {};
  formData.forEach(function(value, key){
    data[key] = value;
  });

  var constraints = {
    name: {
      presence: {allowEmpty: false}
    },
    email: {
      presence: {allowEmpty: false},
      email: true
    },
    day_phone: {
      presence: true,
      format: {
	pattern: /(\+?\d{6,22})?/,
	message: "format invalid, only numeric values allowed"
      }
    },
    eve_phone: {
      presence: true,
      format: {
	pattern: /(\+?\d{6,22})?/,
	message: "format invalid, only numeric values allowed"
      }
    },
    mob_phone: {
      presence: true,
      format: {
	pattern: /(\+?\d{6,22})?/,
	message: "format invalid, only numeric values allowed"
      }
    },
    password: {
      presence: false
    },
    confirm_password: {
      presence: false,
      equality: "password"
    }
  };

  if (!forms.validateForm(form, data, constraints)) {
    return false;
  }

  if (!data['password']) {
    delete data['password'];
  }
  delete data['confirm_password'];

  //
  customerService.updateCustomer(data).then(function(data) {
      if ('error' in data) {
	messages.error(data.error.message || 'Internal error');
      } else {
	localStorage.setItem('customer', JSON.stringify(data));
	messages.success('User updated');
      }
  });
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
      draftOrder.address_1, draftOrder.address_2, draftOrder.city, draftOrder.region,
      draftOrder.postal_code, draftOrder.country, draftOrder.shipping_region_id
    ).then(function(data) {
      localStorage.setItem('customer', JSON.stringify(data));

      var shoppingCart = shoppingcartService.getShoppingcart();

      orderService.createOrder(shoppingCart.cartId, draftOrder.shipping_type, 2).then(function(data) {
	if (!('error' in data)) {
	  localStorage.removeItem('shoppingCart');
	  routes.router.navigate("/shoppingcart/payment/" + data.orderId, true);
	}
      });
    });
  }
}


export default class CustomerController extends BaseController {

  constructor() {
    //
    super();
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

  handleCustomerUpdateEvent() {
    var element = document.querySelector('form button.customer-update');

    element.removeEventListener('click', customerUpdate);
    element.addEventListener('click', customerUpdate);
    element.customParams = {
      form: element.closest('form'),
      controller: this
    };
  }

  handleConfirmOrderEvent() {
    var element = document.querySelector('form button.confirm');

    element.removeEventListener('click', confirmOrder);
    element.addEventListener('click', confirmOrder);
    element.customParams = {
      form: element.closest('form'),
      controller: this
    };
  }

  handleRegisterEvent() {
    var element = document.querySelector('form button.register');

    element.removeEventListener('click', handleRegister);
    element.addEventListener('click', handleRegister);
    element.customParams = {
      form: element.closest('form')
    };
  }

  renderConfirm() {
    var that = this;

    //
    if (!localStorage.getItem('authorizationKey')) {
      return routes.router.navigate('/login', true);
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

	orderService.getShippingTypesByRegion(draftOrder.shipping_region_id).then(function(data) {
	  var shippingType;
	  data.forEach(function(shipping) {
	    if (shipping.shipping_id == draftOrder.shipping_type) {
	      shippingType = shipping;
	    }
	  });

	  var context = {
	    customer: that.customer,
	    cartItems: cartItems,
	    totalAmount: totalAmount,
	    draftOrder: draftOrder,
	    shippingType: shippingType,
	    shippingTypes: data
	  };


	  render('confirm.html', context, function(err, res) {
	    var mainDiv = document.getElementById('main');
	    mainDiv.innerHTML= res;
	    //
	    that.handleConfirmOrderEvent();
	    //
	    that.globalInit();
	  });
	});
      });
    }
  }

  renderCustomer(params, query) {
    if (!localStorage.getItem('authorizationKey')) {
      return routes.router.navigate('/login', true);
    }
    var that = this;

    var context = {
      customer: that.customer,
      isFacebookLogin: that.isFacebookLogin
    };

    render('customer.html', context, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.handleCustomerUpdateEvent();
      //
      that.globalInit();
    });
  }

  renderCompleted(params, query) {
    if (!localStorage.getItem('authorizationKey')) {
      return routes.router.navigate('/login', true);
    }
    var that = this;

    render('completed.html', {customer: that.customer}, function(err, res) {
	var mainDiv = document.getElementById('main');
	mainDiv.innerHTML= res;
	//
	that.globalInit();
    });
  }

  renderPayment(params, query) {
    //
    if (!localStorage.getItem('authorizationKey')) {
      return routes.router.navigate('/login', true);
    }
    var that = this;

    orderService.getOrder(params.orderId).then(function(data) {
      var grandTotal = data.total_amount + data.shipping_cost;
      render('payment.html', {customer: that.customer, order: data, grandTotal: grandTotal}, function(err, res) {
	var mainDiv = document.getElementById('main');
	mainDiv.innerHTML= res;

	stripe.initStripe(data);
	//
	that.globalInit();
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
	//
	that.globalInit();
      });

    });

  }
  
  render() {

  }
  
}
