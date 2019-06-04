import {configure, renderString, render} from 'nunjucks';
var M = require('materialize-css/dist/js/materialize.js');

import CustomerService from './../services/customer';
var facebook = require('./../shared/facebook');
var routes = require('./../routes');

var messages = require('./../shared/messages');

var customerService = new CustomerService();


export function handleStatusChange(res) {

};

export function handleAuthResponseChange(res) {
  if (res.status == 'connected') {
    var accessToken = res.authResponse.accessToken;

    customerService.facebookLogin(accessToken).then(function(data) {
      if (!('error' in data)) {
	localStorage.setItem('authorizationKey', data.accessToken);
	localStorage.setItem('customer', data.customer);

	routes.router.navigate("/shoppingcart/shipping", true);
      }
    });
  }
};

function handleLogin(e) {
  var customParams = e.target.customParams;
  var form = customParams.form;

  var email = form.querySelector('input[name=email]').value;
  if (!email) {
    messages.error('Email required');
    return false;
  }
  var password = form.querySelector('input[name=password]').value;
  if (!password) {
    messages.error('Password required');
    return false;
  }

  customerService.loginCustomer(email, password).then(function(data) {
    if (!('error' in data)) {
      localStorage.setItem('authorizationKey', data.accessToken);
      localStorage.setItem('customer', data.customer);

      routes.router.navigate("/shoppingcart/shipping", true);
    } else {
      messages.error(data.error.message || 'Internal error');
    }
  });

  return false;
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

      routes.router.navigate("/shoppingcart/shipping", true);
    } else {
      messages.error(data.error.message || 'Internal error');
    }
  });
}


export default class AuthController {

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
  
  render() {

  }
  
}
