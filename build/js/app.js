webpackJsonp([0],{

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export handleAddToCart */
/* harmony export (immutable) */ __webpack_exports__["b"] = handleAddToCartEvent;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_product__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_shoppingcart__ = __webpack_require__(5);





var messages = __webpack_require__(148);



var productService = new __WEBPACK_IMPORTED_MODULE_1__services_product__["a" /* default */]();
var shoppingcartService = new __WEBPACK_IMPORTED_MODULE_2__services_shoppingcart__["a" /* default */]();

function handleSaveItemClick(e) {
  e.preventDefault();
  e.stopPropagation();

  var elem = e.target;
  var row = elem.closest('.row');

  var controller = elem.customParams.controller;

  if (row.getAttribute('data-item-id')) {
    var itemId = row.getAttribute('data-item-id');

    shoppingcartService.saveForLater(itemId).then(function(data) {
      controller.renderItems();
    });
  }
}

function handleMoveItemClick(e) {
  e.preventDefault();
  e.stopPropagation();

  var elem = e.target;
  var row = elem.closest('.row');

  var controller = elem.customParams.controller;

  if (row.getAttribute('data-item-id')) {
    var itemId = row.getAttribute('data-item-id');

    shoppingcartService.moveToCart(itemId).then(function(data) {
      controller.renderItems();
    });
  }
}

function handleDeleteItemClick(e) {
  e.preventDefault();
  e.stopPropagation();

  var elem = e.target;
  var row = elem.closest('.row');

  var controller = elem.customParams.controller;

  if (row.getAttribute('data-item-id')) {
    var itemId = row.getAttribute('data-item-id');

    shoppingcartService.removeProduct(itemId).then(function(data) {
      controller.renderItems();
    });
  }
}

function handleAddToCart(e) {

  var customParams = e.target.customParams;

  var form = customParams.form;
  var quantity = form.querySelector('input[name=quantity]').value || 1;
  var colorId = form.querySelector('input[name="Color"]:checked');
  colorId = colorId ? colorId.value : colorId;
  if (!colorId) {
    messages.error('Select an item color');
    return false;
  }
  var colorName = customParams.productAttributes['Color'][colorId].attribute_value;

  var sizeId = form.querySelector('input[name="Size"]:checked');

  sizeId = sizeId ? sizeId.value : sizeId;
  if (!sizeId) {
    messages.error('Select an item size');
    return false;
  }
  var sizeName = customParams.productAttributes['Size'][sizeId].attribute_value;

  var attributes = {
    Size: {id: sizeId, name: sizeName},
    Color: {id: colorId, name: colorName}
  };

  shoppingcartService.addToCart(customParams.productId, quantity, attributes).then(function(data) {
     if (!('error' in data)) {
       messages.success('Product added to cart');
       if (customParams.afterCallback) {
	//
	 var intervalId = setTimeout(() => {
	   customParams.afterCallback();
	 }, 300);
       }
     } else {
       messages.error(data.error.message || 'Internal error');
     }
  });
  return false;
}

function handleAddToCartEvent(element, customParams) {
  element.removeEventListener('click', handleAddToCart);
  element.addEventListener('click', handleAddToCart);
  element.customParams = customParams;
}


class ShoppingcartController {

  constructor() {
    //
  }

  handleSaveItemClickEvent() {
    var that = this;

    var elements = document.querySelectorAll('div.cart-items .save');

    elements.forEach(function(element) {
      element.removeEventListener('click', handleSaveItemClick);
      element.addEventListener('click', handleSaveItemClick);

      element.customParams = {
	controller: that
      };
    });
  }

  handleMoveItemClickEvent() {
    var that = this;

    var elements = document.querySelectorAll('div.saved-items .move');

    elements.forEach(function(element) {
      element.removeEventListener('click', handleMoveItemClick);
      element.addEventListener('click', handleMoveItemClick);

      element.customParams = {
	controller: that
      };
    });
  }

  handleDeleteItemClickEvent(itemType) {
    var that = this;

    var elements = document.querySelectorAll('div.' + itemType + '-items .delete');

    elements.forEach(function(element) {
      element.removeEventListener('click', handleDeleteItemClick);
      element.addEventListener('click', handleDeleteItemClick);

      element.customParams = {
	controller: that
      };
    });
  }

  renderItems() {
    var that = this;
    var cartId = null;

    var shoppingCart = shoppingcartService.getShoppingcart();
    var getCartItems = Promise.all([Promise.resolve([]), Promise.resolve([]), Promise.resolve({})]);
    if (shoppingCart.cartId) {
      cartId = shoppingCart.cartId;
      getCartItems = Promise.all([
	shoppingcartService.getSavedProducts(cartId),
	shoppingcartService.getCartProducts(cartId),
	shoppingcartService.getCartTotalAmount(cartId)
      ]);
    }

    var savedElem = document.querySelector('div.saved-items > .item-list');
    var cartElem = document.querySelector('div.cart-items > .item-list');

    var loadingDiv = '<div>'
	+ '<img src="/static/img/ajax_small.gif" class="quick-view-loading" alt="Loading..."></div>';
    savedElem.innerHTML= loadingDiv;
    cartElem.innerHTML= loadingDiv;

    getCartItems.then(function(data) {
      var savedItems = data[0];
      var cartItems = data[1];
      var totalAmount = data[2]['total_amount'];

      // Cache cart data
      var shoppingCart = {};
      shoppingCart.cartId = cartId;
      shoppingCart.items = cartItems;
      shoppingCart.totalAmount = totalAmount;

      localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

      cartItems.map(function(item) {
	try {
	  item.attributes = JSON.parse(item.attributes);
	} catch (e) {
	}
	return item;
      });

      savedItems.map(function(item) {
	try {
	  item.attributes = JSON.parse(item.attributes);
	} catch (e) {
	}
	return item;
      });

      Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('_cart_items.html', {cartItems: cartItems, totalAmount: totalAmount}, function(err, res) {
	cartElem.innerHTML= res;

	that.handleSaveItemClickEvent();
	that.handleDeleteItemClickEvent('cart');
      });

      Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('_saved_items.html', {savedItems: savedItems}, function(err, res) {
	savedElem.innerHTML= res;

	that.handleMoveItemClickEvent();
	that.handleDeleteItemClickEvent('saved');
      });
    });
  }

  render() {
    var that = this;

    Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('cart_details.html', {}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.renderItems();
    });

  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ShoppingcartController;



/***/ }),

/***/ 14:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = handleStatusChange;
/* harmony export (immutable) */ __webpack_exports__["d"] = stripeTokenHandler;
/* harmony export (immutable) */ __webpack_exports__["b"] = handleAuthResponseChange;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_product__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_customer__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_shoppingcart__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_order__ = __webpack_require__(202);

var M = __webpack_require__(6);





var facebook = __webpack_require__(203);
var stripe = __webpack_require__(204);
var routes = __webpack_require__(145);

var messages = __webpack_require__(148);

var productService = new __WEBPACK_IMPORTED_MODULE_1__services_product__["a" /* default */]();
var customerService = new __WEBPACK_IMPORTED_MODULE_2__services_customer__["a" /* default */]();
var orderService = new __WEBPACK_IMPORTED_MODULE_4__services_order__["a" /* default */]();
var shoppingcartService = new __WEBPACK_IMPORTED_MODULE_3__services_shoppingcart__["a" /* default */]();


function handleStatusChange(res) {

};


// Submit the form with the token ID.
function stripeTokenHandler(token, orderData) {
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


function handleAuthResponseChange(res) {
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

function handleShippingRegionChange(e) {

  var elem = e.target;
  if (elem.value) {
    var shippingRegionId = elem.value;
    orderService.getShippingTypesByRegion(shippingRegionId).then(function(data) {
      Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('_shipping_types.html', {shippingTypes: data}, function(err, res) {

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
      localStorage.setItem('customer', data);

      var shoppingCart = shoppingcartService.getShoppingcart();

      orderService.createOrder(shoppingCart.cartId, draftOrder.shippingType, 2).then(function(data) {
	if (!('error' in data)) {
	  routes.router.navigate("/shoppingcart/payment/" + data.orderId, true);
	}
      });
    });
  }
}


class CustomerController {

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

    Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('login.html', {}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.handleLoginEvent();
      facebook.initFacebook();
    });
  }

  renderRegister() {
    var that = this;

    Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('register.html', {}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.handleRegisterEvent();
      facebook.initFacebook();
    });
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
      routes.router.navigate('/customer/login' + data.orderId, true);
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



	  Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('confirm.html', context, function(err, res) {
	    var mainDiv = document.getElementById('main');
	    mainDiv.innerHTML= res;
	    //
	    that.handleConfirmOrderEvent();
	  });
	});
      });;
    }

  }

  renderPayment(params, query) {
    //
    if (!localStorage.getItem('authorizationKey')) {
      routes.router.navigate('/customer/login', true);
    }
    var that = this;

    orderService.getOrder(params.orderId).then(function(data) {
      var grandTotal = data.total_amount + data.shipping_cost;
      Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('payment.html', {order: data, grandTotal: grandTotal}, function(err, res) {
	var mainDiv = document.getElementById('main');
	mainDiv.innerHTML= res;

	stripe.initStripe(data);
      });
    });

  }

  
  renderShipping() {
    //
    if (!localStorage.getItem('authorizationKey')) {
      routes.router.navigate('/customer/login', true);
    }
    
    var that = this;


    Promise.all([customerService.getCustomer(), orderService.getShippingRegions()]).then(function(data) {
      var customer = data[0];
      var shippingRegions = data[1];

      if ('error' in customer) {
	messages.error(customer.error.message || 'Internal error');
	routes.router.navigate('/customer/login', true);
	return false;
      }

      Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('shipping_details.html', {customer: customer, shippingRegions: shippingRegions}, function(err, res) {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = CustomerController;



/***/ }),

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "router", function() { return router; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_navigo__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_navigo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_navigo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controllers_home__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllers_product__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__controllers_shoppingcart__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__controllers_customer__ = __webpack_require__(14);




var root = '/';
var router = new __WEBPACK_IMPORTED_MODULE_1_navigo___default.a(root);








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


router
  .on({
    'product/:productId': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_3__controllers_product__["a" /* default */];
      controller.render(params, query);
    },
    'shoppingcart/details': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_4__controllers_shoppingcart__["a" /* default */];
      controller.render();
    },
    'shoppingcart/shipping': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_5__controllers_customer__["a" /* default */];
      controller.renderShipping();
    },
    'shoppingcart/confirm': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_5__controllers_customer__["a" /* default */];
      controller.renderConfirm();
    },
    'shoppingcart/payment/:orderId': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_5__controllers_customer__["a" /* default */];
      controller.renderPayment(params, query);
    },
    'customer/login': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_5__controllers_customer__["a" /* default */];
      controller.renderLogin();
    },
    'customer/register': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_5__controllers_customer__["a" /* default */];
      controller.renderRegister();
    },
    '*': function () {
      var controller = new __WEBPACK_IMPORTED_MODULE_2__controllers_home__["a" /* default */];
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


/***/ }),

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_service__ = __webpack_require__(3);



class PostService extends __WEBPACK_IMPORTED_MODULE_0__base_service__["a" /* default */] {

  constructor() {
    super();
  }


  getProductAttributes(productId) {
    let url = this.baseUrl + '/attributes/inProduct/' + productId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }


  mapProductAttributes(attributes) {
    // Store in localStorage
    var mappedAttributes = {};

    for (var index in attributes) {
      var attribute = attributes[index];
      if (!(attribute.attribute_name in mappedAttributes)) {
	mappedAttributes[attribute.attribute_name] = {};
      }
      mappedAttributes[attribute.attribute_name][attribute.attribute_value_id] = attribute;
    }

    return mappedAttributes;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PostService;



/***/ }),

/***/ 148:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["error"] = error;
/* harmony export (immutable) */ __webpack_exports__["success"] = success;
var M = __webpack_require__(6);


function error(message) {
  M.Toast.dismissAll();
  M.toast({html: message, classes: 'error-message red'});
}

function success(message) {
  M.Toast.dismissAll();
  M.toast({html: message, classes: 'success-message green'});
}


/***/ }),

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(154);
module.exports = __webpack_require__(205);


/***/ }),

/***/ 154:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_nunjucks__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routes__ = __webpack_require__(145);
//
RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Nunjucks

//



/***/ }),

/***/ 155:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_marked__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_marked___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_marked__);








//nunjucks
var env = Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["configure"])('/static/views', {
  autoescape: true,
  web: { async: true }
});

env.addFilter('date', __WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter__);

env.addFilter('price', function(num, length) {
  if (!parseFloat(num)) {
    num = 0;
  }
  return '$' + num.toFixed(length || 2);
});


// Add markdown
__WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown__["register"](env, __WEBPACK_IMPORTED_MODULE_3_marked__);


/***/ }),

/***/ 162:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_product__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_shoppingcart__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_attribute__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_urls__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_urls___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__shared_urls__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shoppingcart__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__constants__ = __webpack_require__(164);












var productService = new __WEBPACK_IMPORTED_MODULE_1__services_product__["a" /* default */]();
var attributeService = new __WEBPACK_IMPORTED_MODULE_3__services_attribute__["a" /* default */]();
var shoppingcartService = new __WEBPACK_IMPORTED_MODULE_2__services_shoppingcart__["a" /* default */]();


function renderShoppingcartSummary() {
  var shoppingCart = shoppingcartService.getShoppingcart();

  if (shoppingCart.totalAmount) {
    var summaryElem = document.querySelector('div.shoppingcart-summary .col');

    var loadingDiv = '<div>'
	+ '<img src="/static/img/ajax_small.gif" class="quick-view-loading" alt="Loading..."></div>';
    summaryElem.innerHTML= loadingDiv;

    Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('_cart_summary.html', {shoppingCart: shoppingCart}, function(err, res) {

      summaryElem.innerHTML= res;
    });
  }
}


function handleAddToCarMouseLeave(e) {
  var currentElem = e.target;

  currentElem.remove();
}


function handleAddToCartMouseOver(e) {
  var latestHoverProduct = null;

  var loadingQuickView = '<div class="quick-add-to-cart">'
      + '<img src="/static/img/ajax_small.gif" class="quick-view-loading" alt="Loading..."></div>';

  var elem = e.target;
  if (elem.classList.contains('product-item') || elem.closest('div.product-item')) {

    var currentElem;
    if (elem.classList.contains('product-item')) {
      currentElem = elem;
    } else {
      currentElem = elem.closest('div.product-item');
    }

    latestHoverProduct = currentElem;

    var newNode = document.createElement('div');
    newNode.innerHTML= loadingQuickView;

    currentElem.parentNode.insertBefore(newNode.firstChild, currentElem);

    var productId = currentElem.getAttribute('data-product-id');

    Promise.all(
      [attributeService.getProductAttributes(productId), productService.getProduct(productId)])
      .then(function(data) {
	var attributes = data[0];
	var product = data[1];
	var mappedAttributes = attributeService.mapProductAttributes(attributes);

	Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('_quick_product_view.html', {
	  attributes: mappedAttributes, product: product}, function(err, res) {
	    var quickAddElement = currentElem.parentNode.querySelector('div.quick-add-to-cart');

	    if (!quickAddElement || latestHoverProduct != currentElem) {
	      if (quickAddElement) {
		quickAddElement.remove();
	      }
	      return false;
	    }
	    quickAddElement.innerHTML = res;

	    var button = document.querySelector(
	      'div.quick-add-to-cart > div[data-product-id="' + product.product_id + '"] button.add-to-cart');

	    if (button) {
	      Object(__WEBPACK_IMPORTED_MODULE_5__shoppingcart__["b" /* handleAddToCartEvent */])(button, {
		productId: product.product_id,
		productAttributes: mappedAttributes,
		form: button.closest('form'),
		afterCallback: renderShoppingcartSummary
	      });
	    }

	    var elems = document.querySelectorAll('select');
	    var instances = M.FormSelect.init(elems, {});

	    let elementsArray = document.querySelectorAll("div.quick-add-to-cart");

	    elementsArray.forEach(function(elem) {
	      elem.removeEventListener('mouseleave', handleAddToCarMouseLeave);
	      elem.addEventListener('mouseleave', handleAddToCarMouseLeave);
	    });

	    return true;
	  });

      });
  } else {
    if (!elem.classList.contains('quick-add-to-cart') && !elem.closest('div.quick-add-to-cart')) {
      latestHoverProduct = null;  // Mouse outside product or quick add
      let elementsArray = document.querySelectorAll("div.quick-add-to-cart");

      elementsArray.forEach(function(elem) {
	elem.remove();
      });
    }
  }
}

function handleDepartmentChange(e) {
  var elem = e.target;

  if (elem.classList.contains('department') || elem.closest('li.department')) {
    var controller = elem.customParams.controller;

    history.pushState(null, '', '/');

    controller.searchString = null;
    controller.searchAll = null;
    document.querySelector('input[name=search]').value = '';
    controller.pageNum = 1;

    var currentElem;
    if (elem.classList.contains('department')) {
      currentElem = elem;
    } else {
      currentElem = elem.closest('li.department');
    }
    var departmentId = currentElem.querySelector('input').value;

    if (departmentId == controller.departmentId && departmentId !== null) {
      departmentId = "";
      currentElem.querySelector('input').checked = false;
      var elem = document.querySelector('div.categories > div');

      elem.innerHTML= '';
    } else {
      var intervalId = setTimeout(() => {
	controller.renderCategories();
      });
    }
    controller.categoryId = "";
    localStorage.setItem('categoryId', "");
    controller.departmentId = departmentId;
    localStorage.setItem('departmentId', departmentId);


    // Refresh products
    controller.renderProducts();
  }
}

function handleCategoryChange(e) {
  var elem = e.target;

  if (elem.classList.contains('category') || elem.closest('li.category')) {
    var controller = elem.customParams.controller;

    history.pushState(null, '', '/');
    controller.pageNum = 1;

    var currentElem;
    if (elem.classList.contains('category')) {
      currentElem = elem;
    } else {
      currentElem = elem.closest('li.category');
    }
    var categoryId = currentElem.querySelector('input').value;

    if (categoryId == controller.categoryId) {
      categoryId = "";
      currentElem.querySelector('input').checked = false;
    }
    controller.categoryId = categoryId;
    localStorage.setItem('categoryId', categoryId);
    // Refresh products
    controller.renderProducts();
  }
}

function handleSearchProducts() {
  var searchString = document.querySelector('input[name=search]').value;
  var searchAll = document.querySelector('input[name=search_all]').checked ? 'yes' : 'no';
  window.location.href = '/?search=' + searchString + '&searchAll=' + searchAll;
};

function handleSearchEvent() {
  var element = document.querySelector('button.search');

  if (element) {
    element.removeEventListener('click', handleSearchProducts);
    element.addEventListener('click', handleSearchProducts);
  }
}

class HomeController {

  constructor() {
    //
    this.departmentId = localStorage.getItem('departmentId') || null;
    this.categoryId = localStorage.getItem('categoryId') || null;
    this.searchString = Object(__WEBPACK_IMPORTED_MODULE_4__shared_urls__["getParameterByName"])('search') || null;
    this.searchAll = Object(__WEBPACK_IMPORTED_MODULE_4__shared_urls__["getParameterByName"])('searchAll') || null;
    if (this.searchString) {
      this.categoryId = "";
      localStorage.setItem('categoryId', "");
      this.departmentId = "";
      localStorage.setItem('departmentId', "");
    }
    this.pageNum = parseInt(Object(__WEBPACK_IMPORTED_MODULE_4__shared_urls__["getParameterByName"])('page')) || 1;
  }

  getPagingData(totalRows) {

    return {
      page: this.pageNum,
      total: Math.ceil(totalRows / __WEBPACK_IMPORTED_MODULE_6__constants__["a" /* ITEMS_PER_PAGE */])
    };
  }

  handleQuickAddToCartEvent() {

    document.removeEventListener('mouseover', handleAddToCartMouseOver);
    document.addEventListener('mouseover', handleAddToCartMouseOver);
  }

  handleDepartmentChangeEvent() {
    var that = this;

    var elements = document.querySelectorAll('div.departments input');

    elements.forEach(function(element) {
      element.removeEventListener('click', handleDepartmentChange);
      element.addEventListener('click', handleDepartmentChange);
      element.customParams = {controller: that};
    });
  }

  renderCategories() {
    var that = this;

    productService.getCategories(this.departmentId).then(function(categories) {
      Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('_categories.html', {categories: categories, categoryId: that.categoryId}, function(err, res) {
	var elem = document.querySelector('div.categories > div');

	elem.innerHTML= res;

	var elements = document.querySelectorAll('div.categories input');

	elements.forEach(function(element) {
	  element.removeEventListener('click', handleCategoryChange);
	  element.addEventListener('click', handleCategoryChange);
	  element.customParams = {controller: that};
	});

      });
    });
  }

  renderProducts() {
    var that = this;

    var productList;

    if (this.searchString) {
      productList = productService.search(this.searchString, this.searchAll, this.pageNum, __WEBPACK_IMPORTED_MODULE_6__constants__["a" /* ITEMS_PER_PAGE */]);
    } else if (this.categoryId) {
      productList = productService.getProductsByCategory(this.categoryId, this.pageNum, __WEBPACK_IMPORTED_MODULE_6__constants__["a" /* ITEMS_PER_PAGE */]);
    } else if (this.departmentId) {
      productList = productService.getProductsByDepartment(this.departmentId, this.pageNum, __WEBPACK_IMPORTED_MODULE_6__constants__["a" /* ITEMS_PER_PAGE */]);
    } else {
      productList = productService.list(this.pageNum, __WEBPACK_IMPORTED_MODULE_6__constants__["a" /* ITEMS_PER_PAGE */]);
    }

    productList.then(function(products) {

      var context = {
	products: products,
	searchString: that.searchString,
	searchAll: that.searchAll,
	paging: that.getPagingData(products.count)
      };

      Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('_products.html', context, function(err, res) {
	var productsElem = document.querySelector('div.products-list');

	productsElem.innerHTML= res;
      });
    });
  }

  render(productId) {
    var that = this;

    productService.getDepartments().then(function(departments) {
      var context = {
	departments: departments.rows,
 	departmentId: that.departmentId,
	categoryId: that.categoryId,
	searchString: that.searchString,
	searchAll: that.searchAll
      };

      Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('home.html', context, function(err, res) {
	var mainDiv = document.getElementById('main');
	mainDiv.innerHTML= res;

	that.renderProducts();

	renderShoppingcartSummary();

	M.updateTextFields();
	that.handleQuickAddToCartEvent();
	that.handleDepartmentChangeEvent();
	handleSearchEvent();
	if (that.departmentId) {
	  that.renderCategories();
	}
      });
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HomeController;



/***/ }),

/***/ 163:
/***/ (function(module, exports) {


// https://stackoverflow.com/a/901144
exports.getParameterByName = function(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};


/***/ }),

/***/ 164:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const ITEMS_PER_PAGE = 12;
/* harmony export (immutable) */ __webpack_exports__["a"] = ITEMS_PER_PAGE;
  // limit


/***/ }),

/***/ 165:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tiny_slider_src_tiny_slider__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_product__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_shoppingcart__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_attribute__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shoppingcart__ = __webpack_require__(11);


var M = __webpack_require__(6);







var productService = new __WEBPACK_IMPORTED_MODULE_2__services_product__["a" /* default */]();
var attributeService = new __WEBPACK_IMPORTED_MODULE_4__services_attribute__["a" /* default */]();
var shoppingcartService = new __WEBPACK_IMPORTED_MODULE_3__services_shoppingcart__["a" /* default */]();


class ProductController {

  constructor() {
  }

  render(params, query) {
    var that = this;

    this.params = params;

    productService.getProduct(params.productId).then(function(product) {
      if (!('error' in product)) {
	attributeService.getProductAttributes(params.productId).then(function(attributes) {

	  var mappedAttributes = attributeService.mapProductAttributes(attributes);
	  that.productAttributes = mappedAttributes;

	  Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('product.html', {product: product, attributes: mappedAttributes}, function(err, res) {
	    // Render the page
	    var mainDiv = document.getElementById('main');
	    mainDiv.innerHTML= res;
	    
	    var slider = Object(__WEBPACK_IMPORTED_MODULE_1_tiny_slider_src_tiny_slider__["a" /* tns */])({
	      "container": "#customize",
	      "items": 1,
	      "controlsContainer": "#customize-controls",
	      "navContainer": "#customize-thumbnails",
	      "navAsThumbnails": true,
	      "autoplay": false,
	      "swipeAngle": false
	    });

	    M.updateTextFields();


	    var element = document.querySelector('button.add-to-cart');
	    Object(__WEBPACK_IMPORTED_MODULE_5__shoppingcart__["b" /* handleAddToCartEvent */])(element, {
	      productId: that.params.productId,
	      productAttributes: that.productAttributes,
	      form: document.querySelector('button.add-to-cart').closest('form')
	    });
	  });
	});

      }
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProductController;



/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_service__ = __webpack_require__(3);



class CustomerService extends __WEBPACK_IMPORTED_MODULE_0__base_service__["a" /* default */] {

  constructor() {
    super();
  }


  facebookLogin(accessToken) {
    var formData = new FormData();

    formData.append('access_token', accessToken);

    return fetch(this.baseUrl + '/customers/facebook', Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'POST'
    }, this.getOptions())).then(function(res) {

      return res.json();
    });
  }

  getCustomer() {
    let url = this.baseUrl + '/customer';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  loginCustomer(email, password) {
    var formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    return fetch(this.baseUrl + '/customers/login', Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'POST'
    }, this.getOptions())).then(function(res) {

      return res.json();
    });
  }

  registerCustomer(name, email, password) {
    var formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    return fetch(this.baseUrl + '/customers', Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'POST'
    }, this.getOptions())).then(function(res) {

      return res.json();
    });
  }

  updateCustomerAddress(address1, address2, city, region, postalCode, country, shippingRegionId) {
    var url = this.baseUrl + '/customers/address';

    var formData = new FormData();
    formData.append('address_1', address1);
    formData.append('address_2', address2);
    formData.append('city', city);
    formData.append('region', region);
    formData.append('postal_code', postalCode);
    formData.append('country', country);
    formData.append('shipping_region_id', shippingRegionId);

    return fetch(url, Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'PUT'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CustomerService;



/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_service__ = __webpack_require__(3);



class OrderService extends __WEBPACK_IMPORTED_MODULE_0__base_service__["a" /* default */] {

  constructor() {
    super();
  }


  getShippingRegions() {
    var url = this.baseUrl + '/shipping/regions';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getShippingTypesByRegion(shippingRegionId) {
    var url = this.baseUrl + '/shipping/regions/' + shippingRegionId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getOrder(orderId) {
    var url = this.baseUrl + '/orders/' + orderId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  createOrder(cartId, shippingId, taxId) {
    var formData = new FormData();
    formData.append('cart_id', cartId);
    formData.append('shipping_id', shippingId);
    formData.append('tax_id', taxId);

    return fetch(this.baseUrl + '/orders', Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'POST'
    }, this.getOptions())).then(function(res) {

      return res.json();
    });
  }

  chargeOrder(stripeToken, orderId, description, amount, currency) {
    var formData = new FormData();
    formData.append('stripeToken', stripeToken);
    formData.append('order_id', orderId);
    formData.append('description', description);
    formData.append('amount', amount);
    formData.append('currency', currency);

    return fetch(this.baseUrl + '/stripe/charge', Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'POST'
    }, this.getOptions())).then(function(res) {

      return res.json();
    });
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = OrderService;



/***/ }),

/***/ 203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["initFacebook"] = initFacebook;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controllers_customer__ = __webpack_require__(14);


// Init Facebook
function initFacebook() {
  var tag = document.createElement("script");
  tag.src = "https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v3.2&appId=664434307312339&autoLogAppEvents=1";
  tag.crossorigin="anonymous";
  document.getElementsByTagName("head")[0].appendChild(tag);

  function initFB() {
    FB.init({
      appId            : '664434307312339',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v3.2'
    });

    FB.Event.subscribe('auth.authResponseChange', __WEBPACK_IMPORTED_MODULE_0__controllers_customer__["b" /* handleAuthResponseChange */]);
    FB.Event.subscribe('auth.statusChange', __WEBPACK_IMPORTED_MODULE_0__controllers_customer__["c" /* handleStatusChange */]);
  }

  if (window.FB) {
    initFB();
  } else {
    window.fbAsyncInit = function() {
      initFB();
    };
  }

}


/***/ }),

/***/ 204:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["initStripe"] = initStripe;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controllers_customer__ = __webpack_require__(14);




// Init Facebook
function initStripe(orderData) {
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
	    Object(__WEBPACK_IMPORTED_MODULE_0__controllers_customer__["d" /* stripeTokenHandler */])(result.token, orderData);
	  }
	});
      });

    };
    document.getElementsByTagName("head")[0].appendChild(tag);
  }

}


/***/ }),

/***/ 205:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Base Service for interacting with the API


const FETCH_DEFAULTS = {
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, same-origin, *omit
  headers: {
  },
  mode: 'cors', // no-cors, cors, *same-origin
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer' // *client, no-referrer
};
/* unused harmony export FETCH_DEFAULTS */


const BASE_URL = 'https://www.themba.xyz/v1';
/* unused harmony export BASE_URL */



class BaseService {

  constructor() {
    this.baseUrl = BASE_URL;
  }

  getOptions() {
    var authorizationKey = localStorage.getItem('authorizationKey');

    if (authorizationKey) {
      FETCH_DEFAULTS.headers['USER-KEY'] = authorizationKey;
    }
    return FETCH_DEFAULTS;
  }

  getQuery(params, skipEmpty) {
    var esc = encodeURIComponent;

    var queryStr = Object.keys(params)
      .map((k) => {
	if ((params[k] === '' || params[k] === null || params[k] === undefined) && skipEmpty === true) {
	  return null;
	} else {
	  return '&' + esc(k) + '=' + esc(params[k]);
	}
      }).join('');

    while(queryStr.charAt(0) == '&') {
      queryStr = queryStr.substr(1);
    }
    return queryStr;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseService;




/***/ }),

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_service__ = __webpack_require__(3);



class ProductService extends __WEBPACK_IMPORTED_MODULE_0__base_service__["a" /* default */] {

  constructor() {
    super();
  }

  list(page, limit, descriptionLength) {
    let queryParams = this.getQuery({
      page: page,
      limit: limit,
      description_length: descriptionLength
    }, true);

    let url = this.baseUrl + '/products?' + queryParams;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getDepartments() {
    let url = this.baseUrl + '/departments';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getCategories(departmentId) {
    var url = this.baseUrl + '/categories/inDepartment/' + departmentId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getProduct(productId) {
    let url = this.baseUrl + '/products/' + productId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getProductsByDepartment(departmentId, page, limit, descriptionLength) {
    let queryParams = this.getQuery({
      page: page,
      limit: limit,
      description_length: descriptionLength
    }, true);

    var url = this.baseUrl + '/products/inDepartment/' + departmentId + '?' + queryParams;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getProductsByCategory(categoryId, page, limit, descriptionLength) {
    let queryParams = this.getQuery({
      page: page,
      limit: limit,
      description_length: descriptionLength
    }, true);

    var url = this.baseUrl + '/products/inCategory/' + categoryId + '?' + queryParams;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  search(queryString, allWords, page, limit, descriptionLength) {
    let queryParams = this.getQuery({
      query_string: queryString,
      all_words: allWords,
      page: page,
      limit: limit,
      description_length: descriptionLength
    }, true);

    let url = this.baseUrl + '/products/search?' + queryParams;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProductService;



/***/ }),

/***/ 5:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_service__ = __webpack_require__(3);



class ShoppingcartService extends __WEBPACK_IMPORTED_MODULE_0__base_service__["a" /* default */] {

  constructor() {
    super();
  }

  getShoppingcart() {
    var shoppingCart = localStorage.getItem('shoppingCart');
    try {
      shoppingCart = JSON.parse(shoppingCart);
    } catch (e) {
      shoppingCart = null;
    }
    shoppingCart = shoppingCart ? shoppingCart : {items: []};

    shoppingCart.items = shoppingCart.items ? shoppingCart.items : [];

    shoppingCart.items.map(function(attribute) {
      try {
	attribute.attributes = JSON.parse(attribute.attributes);
      } catch (e) {
      }
      return attribute;
    });

    return shoppingCart;
  }
  

  addToCart(productId, quantity, attributes) {
    var that = this;

    var shoppingCart = this.getShoppingcart();

    var getCartId = null;

    if (!shoppingCart.cartId) {
      getCartId = this.getCartId().then(function(data) {
	shoppingCart.cartId = data.cart_id;

	localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

	return data.cart_id;
      });
    } else {
      getCartId = Promise.resolve(shoppingCart.cartId);
    }

    return getCartId.then(function(cartId) {
      var formData = new FormData();

      formData.append('cart_id', cartId);
      formData.append('product_id', productId);
      formData.append('attributes', JSON.stringify(attributes));

      return fetch(that.baseUrl + '/shoppingcart/add', Object.assign({
      	body: formData, // must match 'Content-Type' header
      	method: 'POST'
      }, that.getOptions())).then(function(res) {
      	return res.json();
      }).then(function(data) {
	var itemIndex = data.length - 1;
	var addedItem = data[itemIndex];

	if (addedItem && addedItem.product_id == productId) {
	  return that.updateItem(addedItem.item_id, quantity).then(function(items) {
	    return that.getCartTotalAmount(cartId).then(function(data) {
	      shoppingCart.items = items;
	      shoppingCart.totalAmount = data['total_amount'];

	      localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
	      return data;
	    });
	  });
	}
	return data;
      });
    });
  }

  updateItem(itemId, quantity) {
    var url = this.baseUrl + '/shoppingcart/update/' + itemId;

    var formData = new FormData();
    formData.append('quantity', quantity);

    return fetch(url, Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'PUT'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  saveForLater(itemId) {
    var url = this.baseUrl + '/shoppingcart/saveForLater/' + itemId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.text();
    });
  }

  moveToCart(itemId) {
    var url = this.baseUrl + '/shoppingcart/moveToCart/' + itemId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.text();
    });
  }

  removeProduct(itemId) {
    var url = this.baseUrl + '/shoppingcart/removeProduct/' + itemId;

    return fetch(url, Object.assign({
      method: 'DELETE'
    }, this.getOptions())).then(function(res) {
      return res.text();
    });
  }

  getCartTotalAmount(cartId) {
    var url = this.baseUrl + '/shoppingcart/totalAmount/' + cartId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getCartProducts(cartId) {
    var url = this.baseUrl + '/shoppingcart/' + cartId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getSavedProducts(cartId) {
    var url = this.baseUrl + '/shoppingcart/getSaved/' + cartId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getRefreshCart(cartId) {
    return this.getCartProducts(cartId).then(function(data) {
    });
  }
  
  getCartId() {
    var url = this.baseUrl + '/shoppingcart/generateUniqueId';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ShoppingcartService;



/***/ })

},[153]);