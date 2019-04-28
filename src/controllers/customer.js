import {configure, renderString, render} from 'nunjucks';

import ProductService from './../services/product';
import CustomerService from './../services/customer';
import ShoppingcartService from './../services/shoppingcart';
var facebook =require('./../shared/facebook');


var productService = new ProductService();
var customerService = new CustomerService();
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

    render('shipping_details.html', {}, function(err, res) {
      var mainDiv = document.getElementById('main');

      mainDiv.innerHTML= res;
    });
  }
  
  render() {

  }
  
}
