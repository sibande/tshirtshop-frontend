import {configure, renderString, render} from 'nunjucks';
var M = require('materialize-css/dist/js/materialize.js');
var forms = require('./../shared/forms');
import {getParameterByName} from './../shared/urls';

import { handleFormCatch, showSubmitting, hideSubmitting } from './base';
import BaseController from './base';
import CustomerService from './../services/customer';
var facebook = require('./../shared/facebook');
var routes = require('./../routes');

var messages = require('./../shared/messages');

var customerService = new CustomerService();


export function handleStatusChange(res) {

};


function startLoginSession(data, isFacebookLogin) {
  localStorage.setItem('authorizationKey', data.accessToken);
  localStorage.setItem('customer', JSON.stringify(data.customer));
  localStorage.setItem('isFacebookLogin', isFacebookLogin);

  var next = getParameterByName('next') || '/';

  window.location.href = next;
}


export function handleAuthResponseChange(res) {
  var form = document.querySelector('form button.login, form button.register');
  form = form.closest('form');

  if (res.status == 'connected') {
    var accessToken = res.authResponse.accessToken;



    showSubmitting(form);
    customerService.facebookLogin(accessToken).then(function(data) {
      //
      startLoginSession(data, 1);

    }).catch(function(error) {
      hideSubmitting(form);
      messages.error(error.message || 'Internal error');
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

  showSubmitting(form);
  customerService.loginCustomer(email, password).then(function(data) {
    //
    startLoginSession(data, 0);

  }).catch(function(error) {
    //
    handleFormCatch(form, error);
    hideSubmitting(form);
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

  showSubmitting(form);
  customerService.registerCustomer(name, email, password).then(function(data) {
    //
    startLoginSession(data, 0);
  }).catch(function(error) {
    //
    handleFormCatch(form, error);
    hideSubmitting(form);
  });

  return true;
}


export default class AuthController extends BaseController {

  constructor() {
    //
    super();
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

    render('login.html', {customer: that.customer}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.handleLoginEvent();
      facebook.initFacebook();
      //
      that.globalInit();
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

    render('register.html', {customer: that.customer}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.handleRegisterEvent();
      facebook.initFacebook();
      //
      that.globalInit();
    });
  }
  
  render() {

  }
  
}
