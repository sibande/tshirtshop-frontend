import {configure, renderString, render} from 'nunjucks';
var M = require('materialize-css/dist/js/materialize.js');
var forms = require('./../shared/forms');

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
	localStorage.setItem('customer', JSON.stringify(data.customer));
	localStorage.setItem('isFacebookLogin', 1);

	routes.router.navigate("/shoppingcart/shipping", true);
      }
    });
  }
};

function handleLogin(e) {
  var customParams = e.target.customParams;
  var form = customParams.form;


  var email = form.querySelector('input[name=email]').value,
      password = form.querySelector('input[name=password]').value;

  var constraints = {
    email: {
      presence: {allowEmpty: false},
      email: true
    },
    password: {
      presence: {allowEmpty: false}
    }
  };

  var data = {email: email, password: password};

  if (!forms.validateForm(form, data, constraints)) {
    return false;
  }

  customerService.loginCustomer(email, password).then(function(data) {
    if (!('error' in data)) {
      localStorage.setItem('authorizationKey', data.accessToken);
      localStorage.setItem('customer', JSON.stringify(data.customer));
      localStorage.setItem('isFacebookLogin', 0);

      routes.router.navigate("/shoppingcart/shipping", true);
    } else {
      forms.showFormError(form, (data.error.message || 'Internal error'));
    }
  });

  return false;
}


function handleRegister(e) {
  var customParams = e.target.customParams;
  var form = customParams.form;

  var name = form.querySelector('input[name=name]').value,
      email = form.querySelector('input[name=email]').value,
      password = form.querySelector('input[name=password]').value,
      confirm_password = form.querySelector('input[name=confirm_password]').value;

  var constraints = {
    name: {
      presence: {allowEmpty: false},
      length: {minimum: 1}
    },
    email: {
      presence: {allowEmpty: false},
      email: true
    },
    password: {
      presence: {allowEmpty: false}
    },
    confirm_password: {
      presence: {allowEmpty: false},
      equality: "password"
    }
  };

  var data = {
    name: name,
    email: email,
    password: password,
    confirm_password: confirm_password
  };

  if (!forms.validateForm(form, data, constraints)) {
    return false;
  }

  customerService.registerCustomer(name, email, password).then(function(data) {
    if (!('error' in data)) {
      localStorage.setItem('authorizationKey', data.accessToken);
      localStorage.setItem('customer', JSON.stringify(data.customer));
      localStorage.setItem('isFacebookLogin', 0);

      routes.router.navigate("/shoppingcart/shipping", true);
    } else {
      forms.showFormError(form, (data.error.message || 'Internal error'));
    }
  });
  return true;
}


export default class AuthController {

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

  renderLogout() {
    var that = this;
    //
    localStorage.removeItem('authorizationKey');
    localStorage.removeItem('customer');

    routes.router.navigate("/", true);
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
