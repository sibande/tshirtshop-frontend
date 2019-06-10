import {configure, renderString, render} from 'nunjucks';
import Navigo from 'navigo';


var root = '/';
export var router = new Navigo(root);


import HomeController from './controllers/home';
import ProductController from './controllers/product';
import ShoppingcartController from './controllers/shoppingcart';
import CustomerController from './controllers/customer';
import OrderController from './controllers/order';
import AuthController from './controllers/auth';


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


var loadingPage = '<div id="page-loading"><img src="/static/img/ajax_medium.gif" alt="Page loading..."></div>';


function authMiddleware(callback) {
  if (!localStorage.getItem('authorizationKey')) {
    var next = window.location.pathname + window.location.search;
    window.location.href = '/login?next=' + encodeURIComponent(next);
    return false;
  }

  //
  callback();

  return true;
}


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
      authMiddleware(function() {
	controller.renderShipping();
      });
    },
    'shoppingcart/confirm': function (params, query) {
      var controller = new CustomerController;
      authMiddleware(function() {
	controller.renderConfirm();
      });
    },
    'shoppingcart/completed': function (params, query) {
      var controller = new CustomerController;
      authMiddleware(function() {
	controller.renderCompleted();
      });
    },
    'shoppingcart/payment/:orderId': function (params, query) {
      var controller = new CustomerController;
      authMiddleware(function() {
	controller.renderPayment(params, query);
      });
    },
    'orders': function (params, query) {
      var controller = new OrderController;
      authMiddleware(function() {
	controller.render();
      });
    },
    'customer': function (params, query) {
      var controller = new CustomerController;

      authMiddleware(function() {
	controller.renderCustomer();
      });
    },
    'login': function (params, query) {
      var controller = new AuthController;
      controller.renderLogin();
    },
    'logout': function (params, query) {
      var controller = new AuthController;
      controller.renderLogout();
    },
    'register': function (params, query) {
      var controller = new AuthController;
      controller.renderRegister();
    },
    '*': function () {
      var controller = new HomeController;
      controller.render();
      
    }
  })
  .resolve();

router.hooks({
  before: function(done, params) {
    var contentElem = document.querySelector('.container > div.content');
    contentElem.innerHTML = loadingPage;

    done();
  }
});
