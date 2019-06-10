webpackJsonp([0],{

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "router", function() { return router; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_navigo__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_navigo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_navigo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controllers_home__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllers_product__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__controllers_shoppingcart__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__controllers_customer__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__controllers_order__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__controllers_auth__ = __webpack_require__(156);




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
    'shoppingcart/completed': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_5__controllers_customer__["a" /* default */];
      controller.renderCompleted();
    },
    'shoppingcart/payment/:orderId': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_5__controllers_customer__["a" /* default */];
      controller.renderPayment(params, query);
    },
    'orders': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_6__controllers_order__["a" /* default */];
      controller.render();
    },
    'customer': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_5__controllers_customer__["a" /* default */];
      controller.renderCustomer();
    },
    'login': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_7__controllers_auth__["a" /* default */];
      controller.renderLogin();
    },
    'logout': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_7__controllers_auth__["a" /* default */];
      controller.renderLogout();
    },
    'register': function (params, query) {
      var controller = new __WEBPACK_IMPORTED_MODULE_7__controllers_auth__["a" /* default */];
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

/***/ 12:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export handleAddToCart */
/* harmony export (immutable) */ __webpack_exports__["b"] = handleAddToCartEvent;
/* harmony export (immutable) */ __webpack_exports__["c"] = handleAdjustQuantity;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_nunjucks__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_product__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_shoppingcart__ = __webpack_require__(6);









var messages = __webpack_require__(13);
var forms = __webpack_require__(208);


var productService = new __WEBPACK_IMPORTED_MODULE_3__services_product__["a" /* default */]();
var shoppingcartService = new __WEBPACK_IMPORTED_MODULE_4__services_shoppingcart__["a" /* default */]();

function handleSaveItemClick(e) {
  e.preventDefault();
  e.stopPropagation();

  var elem = e.target;
  if (elem.tagName != 'A') {
    elem = elem.closest('a');
  }
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
  if (elem.tagName != 'A') {
    elem = elem.closest('a');
  }

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
  if (elem.tagName != 'A') {
    elem = elem.closest('a');
  }
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
      Object(__WEBPACK_IMPORTED_MODULE_2__base__["b" /* updateCartHeader */])(data['total_amount']);

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

var timeoutId;

function handleAdjustQuantity(e) {
  var elem = e.target;
  if (e.type == 'click' && elem.tagName != 'A') {
    elem = elem.closest('a');
  }

  var controller = elem.customParams.controller,
      quantityElem = elem.customParams.quantityElem;

  var value = parseInt(quantityElem.value) || 0;

  if (e.type == 'click') {  // Quanity changed by buttons
    if (elem.classList.contains('increase')) {
      quantityElem.value = value + 1;
    } else {
      quantityElem.value = value - 1;
    }
  }

  clearTimeout(timeoutId);

  // Handle updates to quantity
  elem.customParams.updateItemQuantity(controller, quantityElem);
}


function updateItemQuantity(controller, quantityElem) {
  timeoutId = setTimeout(function() {
    // Quantity limited to a minimum of 1 and a maximum of 99
    if (quantityElem.value < 1) {
      quantityElem.value = 1;
    } else if (quantityElem.value > 99) {
      quantityElem.value = 99;
    }

    var updating = document.createElement('div');
    updating.innerHTML ='<div class="updating-content"><div>'
      + '<img src="/static/img/ajax_small.gif" class="quick-view-loading" alt="Loading...">'
      + '</div></div>';


    var div = quantityElem.closest('.quantity-select'),
	row = div.closest('.row'),
	itemId = row.getAttribute('data-item-id');

    div.appendChild(updating.firstChild);

    shoppingcartService.updateItem(itemId, quantityElem.value).then(function(items) {
      items.forEach(function(item) {
	// Should probably update everything
	if (item.item_id == itemId) {
	  shoppingcartService.getCartTotalAmount(controller.cartId).then(function(data) {
	    //
	    Object(__WEBPACK_IMPORTED_MODULE_2__base__["b" /* updateCartHeader */])(data.total_amount);

	    row.querySelector('.price').innerHTML = Object(__WEBPACK_IMPORTED_MODULE_1__shared_nunjucks__["a" /* formatPrice */])(item.subtotal);
	    //
	    row.querySelector('.updating-content').remove();

	  });
	}
      });
    });

  }, 1000);
}



class ShoppingcartController extends __WEBPACK_IMPORTED_MODULE_2__base__["a" /* default */] {

  constructor() {
    super();
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

  handleQuantityChangeEvent() {
    var that = this;

    var quantities = document.querySelectorAll(".cart-items .quantity-select input");


    quantities.forEach(function(quantityElem) {
      function attachQuantityEvent(elem, event) {
	elem.removeEventListener(event, handleAdjustQuantity);
	elem.addEventListener(event, handleAdjustQuantity);
	elem.customParams = {
	  controller: that,
	  quantityElem: quantityElem,
	  updateItemQuantity: updateItemQuantity
	};
      }

      // Restrict input to digits and '.' by using a regular expression filter.
      forms.setInputFilter(quantityElem, function(value) {
	return /^[0-9]{0,2}$/.test(value);
      });

      var decreaseElem = quantityElem.previousElementSibling,
	  increaseElem = quantityElem.nextElementSibling;

      attachQuantityEvent(decreaseElem, 'click');
      attachQuantityEvent(increaseElem, 'click');
      attachQuantityEvent(quantityElem, 'keyup');
    });
  }

  renderItems() {
    var that = this;
    var cartId = null;

    var shoppingCart = shoppingcartService.getShoppingcart();
    var getCartItems = Promise.all([Promise.resolve([]), Promise.resolve([]), Promise.resolve({})]);
    if (shoppingCart.cartId) {
      cartId = shoppingCart.cartId;
      that.cartId = shoppingCart.cartId;

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

      Object(__WEBPACK_IMPORTED_MODULE_2__base__["b" /* updateCartHeader */])(totalAmount);

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

	//
	that.handleQuantityChangeEvent();
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

    Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('cart_details.html', {customer: that.customer}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.renderItems();

      //
      that.globalInit();
    });

  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ShoppingcartController;



/***/ }),

/***/ 13:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["error"] = error;
/* harmony export (immutable) */ __webpack_exports__["success"] = success;
var M = __webpack_require__(4);


function error(message) {
  M.Toast.dismissAll();
  M.toast({html: message, classes: 'error-message red'});
}

function success(message) {
  M.Toast.dismissAll();
  M.toast({html: message, classes: 'success-message green'});
}


/***/ }),

/***/ 148:
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

/***/ 153:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = stripeTokenHandler;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_product__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_customer__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_shoppingcart__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_order__ = __webpack_require__(207);

var M = __webpack_require__(4);
var forms = __webpack_require__(208);






var facebook = __webpack_require__(155);
var stripe = __webpack_require__(209);
var routes = __webpack_require__(11);

var messages = __webpack_require__(13);

var productService = new __WEBPACK_IMPORTED_MODULE_2__services_product__["a" /* default */]();
var customerService = new __WEBPACK_IMPORTED_MODULE_3__services_customer__["a" /* default */]();
var orderService = new __WEBPACK_IMPORTED_MODULE_5__services_order__["a" /* default */]();
var shoppingcartService = new __WEBPACK_IMPORTED_MODULE_4__services_shoppingcart__["a" /* default */]();



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


class CustomerController extends __WEBPACK_IMPORTED_MODULE_1__base__["a" /* default */] {

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


	  Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('confirm.html', context, function(err, res) {
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

    Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('customer.html', context, function(err, res) {
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

    Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('completed.html', {customer: that.customer}, function(err, res) {
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
      Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('payment.html', {customer: that.customer, order: data, grandTotal: grandTotal}, function(err, res) {
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
	//
	that.globalInit();
      });

    });

  }
  
  render() {

  }
  
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CustomerController;



/***/ }),

/***/ 154:
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


  updateCustomer(data) {
    var url = this.baseUrl + '/customer';

    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }

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

/***/ 155:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["initFacebook"] = initFacebook;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controllers_auth__ = __webpack_require__(156);


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

    FB.Event.subscribe('auth.authResponseChange', __WEBPACK_IMPORTED_MODULE_0__controllers_auth__["b" /* handleAuthResponseChange */]);
    FB.Event.subscribe('auth.statusChange', __WEBPACK_IMPORTED_MODULE_0__controllers_auth__["c" /* handleStatusChange */]);
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

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = handleStatusChange;
/* harmony export (immutable) */ __webpack_exports__["b"] = handleAuthResponseChange;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_customer__ = __webpack_require__(154);

var M = __webpack_require__(4);
var forms = __webpack_require__(208);


var facebook = __webpack_require__(155);
var routes = __webpack_require__(11);

var messages = __webpack_require__(13);

var customerService = new __WEBPACK_IMPORTED_MODULE_1__services_customer__["a" /* default */]();


function handleStatusChange(res) {

};

function handleAuthResponseChange(res) {
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


class AuthController {

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

    Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('login.html', {}, function(err, res) {
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

    Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('register.html', {}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.handleRegisterEvent();
      facebook.initFacebook();
    });
  }
  
  render() {

  }
  
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AuthController;



/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(160);
module.exports = __webpack_require__(210);


/***/ }),

/***/ 160:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_nunjucks__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routes__ = __webpack_require__(11);
//
RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Nunjucks

//



/***/ }),

/***/ 161:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = formatPrice;
/* unused harmony export orderStatusName */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_marked__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_marked___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_marked__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__constants__ = __webpack_require__(170);










//nunjucks
var env = Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["configure"])('/static/views', {
  autoescape: true,
  web: { async: true }
});

env.addFilter('date', __WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter__);

function formatPrice(num, length) {
  if (!parseFloat(num)) {
    num = 0;
  }
  return __WEBPACK_IMPORTED_MODULE_4__constants__["a" /* CURRENCY */] + num.toFixed(length || 2);
}

env.addFilter('price', formatPrice);


// Status ID to description
function orderStatusName(statusId) {
  var name = 'Unknown';

  if (statusId == 1) {
    name = 'Completed';
  }
  return name;
}

env.addFilter('orderStatusName', orderStatusName);


// Add markdown
__WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown__["register"](env, __WEBPACK_IMPORTED_MODULE_3_marked__);


/***/ }),

/***/ 167:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_product__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_shoppingcart__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_attribute__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_urls__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_urls___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__shared_urls__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shoppingcart__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__constants__ = __webpack_require__(170);













var productService = new __WEBPACK_IMPORTED_MODULE_2__services_product__["a" /* default */]();
var attributeService = new __WEBPACK_IMPORTED_MODULE_4__services_attribute__["a" /* default */]();
var shoppingcartService = new __WEBPACK_IMPORTED_MODULE_3__services_shoppingcart__["a" /* default */]();


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

function handleAddToCartMouseOver(e) {
  var elem = e.target;

  if (elem.classList.contains('product-item-wrapper') || elem.closest('div.product-item-wrapper')) {
    var currentElem;
    if (elem.classList.contains('product-item-wrapper')) {
      currentElem = elem;
    } else {
      currentElem = elem.closest('div.product-item-wrapper');
    }
    var quickElem = currentElem.querySelector('.product-quick-view');
    var itemElem = currentElem.querySelector('.product-item');

    var productId = itemElem.getAttribute('data-product-id');
    
    if (!quickElem.classList.contains('loaded') && !quickElem.classList.contains('loading')) {
      
      quickElem.classList.add('loading');

      var promises = [attributeService.getProductAttributes(productId), productService.getProduct(productId)];
      
      Promise.all(promises).then(function(data) {
    	var attributes = data[0];
    	var product = data[1];
    	var mappedAttributes = attributeService.mapProductAttributes(attributes);

	var ctx = {attributes: mappedAttributes, product: product};

    	Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('_quick_product_view.html', ctx, function(err, res) {
	  quickElem.innerHTML = res;
	  quickElem.classList.remove('loading');
	  quickElem.classList.add('loaded');

    	  var button = document.querySelector(
    	    'div.product-quick-view > div[data-product-id="' + product.product_id + '"] button.add-to-cart');

    	  if (button) {
    	    Object(__WEBPACK_IMPORTED_MODULE_6__shoppingcart__["b" /* handleAddToCartEvent */])(button, {
    	      productId: product.product_id,
    	      productAttributes: mappedAttributes,
    	      form: button.closest('form'),
    	      afterCallback: renderShoppingcartSummary
    	    });
    	  }
	});
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

function handleItemsPerPageChange(e) {
  e.preventDefault();
  e.stopPropagation();

  var elem = e.target;
  var itemsPerPage = parseInt(elem.getAttribute('data-items'));

  var controller = elem.customParams.controller;

  if (__WEBPACK_IMPORTED_MODULE_7__constants__["b" /* ITEMS_PER_PAGE_LIST */].includes(itemsPerPage)) {
    localStorage.setItem('itemsPerPage', itemsPerPage);
    controller.itemsPerPage = itemsPerPage;

    controller.pageNum = 1;

    history.pushState(null, '', '/');

    var currentItemsElem = document.querySelector('div.items-per-page span.current');
    if (currentItemsElem) {
      currentItemsElem.classList.remove('current');
    }


    controller.renderProducts();
    //
    elem.parentNode.classList.add('current');
  }
}


class HomeController extends __WEBPACK_IMPORTED_MODULE_1__base__["a" /* default */] {

  constructor() {
    super();
    //
    this.departmentId = localStorage.getItem('departmentId') || null;
    this.categoryId = localStorage.getItem('categoryId') || null;
    this.searchString = Object(__WEBPACK_IMPORTED_MODULE_5__shared_urls__["getParameterByName"])('search') || null;
    this.searchAll = Object(__WEBPACK_IMPORTED_MODULE_5__shared_urls__["getParameterByName"])('searchAll') || null;
    this.itemsPerPage = parseInt(localStorage.getItem('itemsPerPage'));
    if (!__WEBPACK_IMPORTED_MODULE_7__constants__["b" /* ITEMS_PER_PAGE_LIST */].includes(this.itemsPerPage)) {
      this.itemsPerPage = __WEBPACK_IMPORTED_MODULE_7__constants__["b" /* ITEMS_PER_PAGE_LIST */][0];
    }

    if (this.searchString) {
      this.categoryId = "";
      localStorage.setItem('categoryId', "");
      this.departmentId = "";
      localStorage.setItem('departmentId', "");
    }
    this.pageNum = parseInt(Object(__WEBPACK_IMPORTED_MODULE_5__shared_urls__["getParameterByName"])('page')) || 1;
  }

  getPagingData(totalRows) {

    return {
      page: this.pageNum,
      total: Math.ceil(totalRows / this.itemsPerPage)
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

  handleItemsPerPageEvent() {
    var that = this;

    var elements = document.querySelectorAll('div.items-per-page span a');

    elements.forEach(function(element) {
      element.removeEventListener('click', handleItemsPerPageChange);
      element.addEventListener('click', handleItemsPerPageChange);
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
      productList = productService.search(this.searchString, this.searchAll, this.pageNum, this.itemsPerPage);
    } else if (this.categoryId) {
      productList = productService.getProductsByCategory(this.categoryId, this.pageNum, this.itemsPerPage);
    } else if (this.departmentId) {
      productList = productService.getProductsByDepartment(this.departmentId, this.pageNum, this.itemsPerPage);
    } else {
      productList = productService.list(this.pageNum, this.itemsPerPage);
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

	// Add pagination
	Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('_pagination.html', context, function(err, pagingRes) {
	  var pagingElem = document.querySelector('div.paging > div');
	  pagingElem.innerHTML = pagingRes;

	  productsElem.innerHTML= res;
	});


      });
    });
  }

  render(productId) {
    var that = this;

    productService.getDepartments().then(function(departments) {
      var context = {
	customer: that.customer,
	departments: departments.rows,
 	departmentId: that.departmentId,
	categoryId: that.categoryId,
	searchString: that.searchString,
	itemsList: __WEBPACK_IMPORTED_MODULE_7__constants__["b" /* ITEMS_PER_PAGE_LIST */],
	itemsPerPage: that.itemsPerPage,
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
	that.handleItemsPerPageEvent();
	if (that.departmentId) {
	  that.renderCategories();
	}
	//
	that.globalInit();
      });
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HomeController;



/***/ }),

/***/ 168:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = updateCartHeader;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_nunjucks__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_shoppingcart__ = __webpack_require__(6);
var M = __webpack_require__(4);




var routes = __webpack_require__(11);

var shoppingcartService = new __WEBPACK_IMPORTED_MODULE_1__services_shoppingcart__["a" /* default */]();


function updateCartHeader(totalAmount) {
  var cartDiv = document.querySelector('header .shopping-cart a');
  if (cartDiv) {
    cartDiv.innerHTML = Object(__WEBPACK_IMPORTED_MODULE_0__shared_nunjucks__["a" /* formatPrice */])(totalAmount);
  }
}

function handleSearch(e) {
  e.preventDefault();
  e.stopPropagation();

  var elem = e.target;
  if (elem.tagName != 'A') {
    elem = elem.closest('a');
  }
  var label = elem.closest('label');

  if (elem.classList.contains('close')) {
    label.classList.remove('shown');
  } else if (elem.classList.contains('show')) {
    label.classList.add('shown');
  }
}

function handleSearchProducts() {
  var searchString = document.querySelector('input[name=search]').value;
  var searchAll = document.querySelector('input[name=search_all]').checked ? 'on' : 'off';

  routes.router.navigate('/?search=' + searchString + '&searchAll=' + searchAll, true);
};


class BaseController {

  constructor() {
    var authorizationKey = localStorage.getItem('authorizationKey'),
	customer = localStorage.getItem('customer'),
	isFacebookLogin = localStorage.getItem('isFacebookLogin');

    try {
      customer = JSON.parse(customer);
    } catch (e) {
      customer = {};
    }

    this.customer = customer || {};
    this.isFacebookLogin = isFacebookLogin;
  }

  handleSearchEvent() {


    if (element) {
      element.removeEventListener('click', handleSearchProducts);
      element.addEventListener('click', handleSearchProducts);
    }
  }

  handleSearchEvent() {
    var elements = document.querySelectorAll('header a.close, header a.show');

    elements.forEach(function(element) {
      element.removeEventListener('click', handleSearch);
      element.addEventListener('click', handleSearch);
    });
    //
    var form = document.querySelector('.search form');
    form.removeEventListener('submit', handleSearchProducts);
    form.addEventListener('submit', handleSearchProducts);
  }

  globalInit() {
    var elems = document.querySelectorAll('.customer-menu-trigger');
    var instances = M.Dropdown.init(elems, {});

    var shoppingcart = shoppingcartService.getShoppingcart();

    updateCartHeader(shoppingcart.totalAmount);

    this.handleSearchEvent();
  }

  
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseController;



/***/ }),

/***/ 169:
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

/***/ 170:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const ITEMS_PER_PAGE_LIST = [12, 24, 36, 48];
/* harmony export (immutable) */ __webpack_exports__["b"] = ITEMS_PER_PAGE_LIST;
  // limit


const CURRENCY = '$';
/* harmony export (immutable) */ __webpack_exports__["a"] = CURRENCY;



/***/ }),

/***/ 171:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tiny_slider_src_tiny_slider__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_product__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_shoppingcart__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_attribute__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shoppingcart__ = __webpack_require__(12);


var M = __webpack_require__(4);






var forms = __webpack_require__(208);

var productService = new __WEBPACK_IMPORTED_MODULE_3__services_product__["a" /* default */]();
var attributeService = new __WEBPACK_IMPORTED_MODULE_5__services_attribute__["a" /* default */]();
var shoppingcartService = new __WEBPACK_IMPORTED_MODULE_4__services_shoppingcart__["a" /* default */]();


var timeoutId;
function updateItemQuantity(controller, quantityElem) {
  timeoutId = setTimeout(function() {
    // Quantity limited to a minimum of 1 and a maximum of 99
    if (quantityElem.value < 1) {
      quantityElem.value = 1;
    } else if (quantityElem.value > 99) {
      quantityElem.value = 99;
    }
  }, 1000);
}


class ProductController extends __WEBPACK_IMPORTED_MODULE_2__base__["a" /* default */] {

  constructor() {
    super();
  }

  handleQuantityChangeEvent() {
    var that = this;

    var quantityElem = document.querySelector(".product-view .quantity-select input");

    function attachQuantityEvent(elem, event) {
      elem.removeEventListener(event, __WEBPACK_IMPORTED_MODULE_6__shoppingcart__["c" /* handleAdjustQuantity */]);
      elem.addEventListener(event, __WEBPACK_IMPORTED_MODULE_6__shoppingcart__["c" /* handleAdjustQuantity */]);
      elem.customParams = {
	controller: that,
	quantityElem: quantityElem,
	updateItemQuantity: updateItemQuantity
      };
    }

    // Restrict input to digits and '.' by using a regular expression filter.
    forms.setInputFilter(quantityElem, function(value) {
      return /^[0-9]{0,2}$/.test(value);
    });

    var decreaseElem = quantityElem.previousElementSibling,
	increaseElem = quantityElem.nextElementSibling;

    attachQuantityEvent(decreaseElem, 'click');
    attachQuantityEvent(increaseElem, 'click');
    attachQuantityEvent(quantityElem, 'keyup');
  }

  render(params, query) {
    var that = this;

    this.params = params;

    productService.getProduct(params.productId).then(function(product) {
      if (!('error' in product)) {
	attributeService.getProductAttributes(params.productId).then(function(attributes) {

	  var mappedAttributes = attributeService.mapProductAttributes(attributes);
	  that.productAttributes = mappedAttributes;

	  var context = {
	    customer: that.customer,
	    product: product,
	    attributes: mappedAttributes
	  };

	  Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('product.html', context, function(err, res) {
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
	    Object(__WEBPACK_IMPORTED_MODULE_6__shoppingcart__["b" /* handleAddToCartEvent */])(element, {
	      productId: that.params.productId,
	      productAttributes: that.productAttributes,
	      form: document.querySelector('button.add-to-cart').closest('form')
	    });

	    that.handleQuantityChangeEvent();
	    //
	    that.globalInit();
	  });
	});

      }
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProductController;



/***/ }),

/***/ 207:
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

  getOrderList() {
    var url = this.baseUrl + '/orders/inCustomer';

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
    formData.append('amount', amount.toFixed());
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

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["setInputFilter"] = setInputFilter;
/* harmony export (immutable) */ __webpack_exports__["validateForm"] = validateForm;
/* harmony export (immutable) */ __webpack_exports__["showFormError"] = showFormError;
var validate = __webpack_require__(157);


// Restricts input for the given textbox to the given inputFilter.
// https://stackoverflow.com/a/469362
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  });
}

function validateForm(form, data, constraints) {

  form.querySelectorAll('.error-msg').forEach(function(elem) {
    elem.closest('.input-field').classList.remove('has-error');
    elem.remove();
  });

  var errors = validate(data, constraints);

  if (errors) {
    for (var key in errors) {
      var value = errors[key];

      var elem = form.querySelector('input[name=' + key + ']');
      if (elem) {
	elem.closest('.input-field').classList.add('has-error');
	
	var error = document.createElement('div');
	error.innerHTML = '<div class="error-msg">' + value[0] + '</div>';

	elem.after(error.firstChild);
      }
    }
    return false;
  }

  return true;
}


function showFormError(form, errorMsg) {
  form.querySelectorAll('.error-msg').forEach(function(elem) {
    elem.closest('.input-field').classList.remove('has-error');
    elem.remove();
  });
  
  var elem = form.querySelector('input:first-child');

  var error = document.createElement('div');
  error.innerHTML = '<div class="error-msg">' + errorMsg + '</div>';

  elem.before(error.firstChild);
}


/***/ }),

/***/ 209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["initStripe"] = initStripe;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controllers_customer__ = __webpack_require__(153);




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
	    Object(__WEBPACK_IMPORTED_MODULE_0__controllers_customer__["b" /* stripeTokenHandler */])(result.token, orderData);
	  }
	});
      });

    };
    document.getElementsByTagName("head")[0].appendChild(tag);
  }

}


/***/ }),

/***/ 210:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_order__ = __webpack_require__(207);


var routes = __webpack_require__(11);




var orderService = new __WEBPACK_IMPORTED_MODULE_2__services_order__["a" /* default */]();


class ProductController extends __WEBPACK_IMPORTED_MODULE_1__base__["a" /* default */] {

  constructor() {
    super();
  }

  render(params, query) {
    if (!localStorage.getItem('authorizationKey')) {
      return routes.router.navigate('/login', true);
    }

    var that = this;

    orderService.getOrderList().then(function(orders) {

      Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('order_history.html', {customer: that.customer, orders: orders}, function(err, res) {
	var mainDiv = document.getElementById('main');
	mainDiv.innerHTML= res;

	//
	that.globalInit();
      });

    });
  }


}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProductController;



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

/***/ 5:
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

/***/ 6:
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

},[159]);