import {configure, renderString, render} from 'nunjucks';
var M = require('materialize-css/dist/js/materialize.js');

import ProductService from './../services/product';
import CustomerService from './../services/customer';
import ShoppingcartService from './../services/shoppingcart';
import OrderService from './../services/order';
var facebook =require('./../shared/facebook');


var productService = new ProductService();
var customerService = new CustomerService();
var orderService = new OrderService();
var shoppingcartService = new ShoppingcartService();


export function handleStatusChange(res) {

};

export function handleAuthResponseChange(res) {
  if (res.status == 'connected') {
    var accessToken = res.authResponse.accessToken;

    customerService.facebookLogin(accessToken).then(function(data) {
      if (!('error' in data)) {
	localStorage.setItem('authorizationKey', data.accessToken);
	localStorage.setItem('customer', data.customer);

	window.location.href = "/shoppingcart/shipping";
      }
    });
  }
};

function handleLogin(e) {
  var customParams = e.target.customParams;
  var form = customParams.form;

  var email = form.querySelector('input[name=email]').value;
  var password = form.querySelector('input[name=password]').value;

  customerService.loginCustomer(email, password).then(function(data) {
    if (!('error' in data)) {
      localStorage.setItem('authorizationKey', data.accessToken);
      localStorage.setItem('customer', data.customer);

      window.location.href = "/shoppingcart/shipping";
    }
  });

}


function updateShipping(e) {
  var customParams = e.target.customParams;
  var form = customParams.form;

  var address_1 = form.querySelector('input[name=address_1]').value;
  var address_2 = form.querySelector('input[name=address_2]').value;
  var region = form.querySelector('input[name=region]').value;
  var city = form.querySelector('input[name=city]').value;
  var postal_code = form.querySelector('input[name=postal_code]').value;
  var country = form.querySelector('input[name=country]').value;
  var shippingRegionId = document.querySelector('select[name="shipping_region_id"]').value;
  var shippingType = document.querySelector('select[name="shipping_type"]').value;


  localStorage.setItem('draftOrder', JSON.stringify({
    address_1: address_1,
    address_2: address_2,
    region: region,
    city: city,
    postal_code: postal_code,
    country: country,
    shippingRegionId: shippingRegionId,
    shippingType: shippingType
  }));

  window.location.href = '/shoppingcart/confirm';

}

function handleRegister(e) {
  var customParams = e.target.customParams;
  var form = customParams.form;

  var name = form.querySelector('input[name=name]').value;
  var email = form.querySelector('input[name=email]').value;
  var password = form.querySelector('input[name=password]').value;

  customerService.registerCustomer(name, email, password).then(function(data) {
    if (!('error' in data)) {
      localStorage.setItem('authorizationKey', data.accessToken);
      localStorage.setItem('customer', data.customer);

      window.location.href = "/shoppingcart/shipping";
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

export default class CustomerController {

  constructor() {
  }

  handleLoginEvent() {
    var element = document.querySelector('form button.login');

    element.removeEventListener('click', handleLogin);
    element.addEventListener('click', handleLogin);
    element.customParams = {
      form: element.closest('form')
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

  renderLogin() {
    var that = this;

    render('login.html', {}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.handleLoginEvent();
      facebook.initFacebook();
    });
  }

  renderRegister() {
    var that = this;

    render('register.html', {}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.handleRegisterEvent();
      facebook.initFacebook();
    });
  }

  
  renderShipping() {
    //
    if (!localStorage.getItem('authorizationKey')) {
      window.location.href = '/customer/login';
    }
    
    var that = this;


    Promise.all([customerService.getCustomer(), orderService.getShippingRegions()]).then(function(data) {
      var customer = data[0];
      var shippingRegions = data[1];

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
