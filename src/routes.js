import {configure, renderString, render} from 'nunjucks';
import Navigo from 'navigo';

import HomeController from './controllers/home';
import ProductController from './controllers/product';
import ShoppingcartController from './controllers/shoppingcart';
import CustomerController from './controllers/customer';

var root = '/';
var router = new Navigo(root);

// Handle link navigation
document.addEventListener('click', function(e) {
  if (e.which !== 1) {
    return false;
  }
  let elem = e.target;

  if (elem.tagName != "A" && elem.closest('a')) {
    elem = elem.closest('a');
  }


  if (elem.tagName == "A" && elem.getAttribute('href') && !elem.classList.contains('nojs')) {
    let uri = elem.getAttribute('href');

    if (uri.charAt(0) === '/') {
      uri = uri.substr(1);
    }

    router.navigate(uri);
    // Prevent normal navigation
    e.preventDefault();
  }

});




router
  .on({
    'product/:productId': function (params, query) {
      var controller = new ProductController;
      controller.render(params, query);
    },
    'shoppingcart/details': function (params, query) {
      var controller = new ShoppingcartController;
      controller.render();
    },
    'shoppingcart/shipping': function (params, query) {
      var controller = new CustomerController;
      controller.renderShipping();
    },
    'shoppingcart/confirm': function (params, query) {
      var controller = new CustomerController;
      controller.renderConfirm();
    },
    'customer/login': function (params, query) {
      var controller = new CustomerController;
      controller.renderLogin();
    },
    'customer/register': function (params, query) {
      var controller = new CustomerController;
      controller.renderRegister();
    },
    '*': function () {
      var controller = new HomeController;
      controller.render();
      
    }
  })
  .resolve();
