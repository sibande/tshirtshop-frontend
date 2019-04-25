webpackJsonp([0],{

/***/ 140:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_service__ = __webpack_require__(141);



class PostService extends __WEBPACK_IMPORTED_MODULE_0__base_service__["a" /* default */] {

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

  getProduct(productId) {
    let url = this.baseUrl + '/products/' + productId;

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
/* harmony export (immutable) */ __webpack_exports__["a"] = PostService;



/***/ }),

/***/ 141:
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


const BASE_URL = 'http://localhost:3000';
/* unused harmony export BASE_URL */



class BaseService {

  constructor() {
    this.baseUrl = BASE_URL;
  }

  getOptions() {
    return FETCH_DEFAULTS;
  }

  getQuery(params, skipEmpty) {
    let esc = encodeURIComponent;

    let queryStr = Object.keys(params)
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

/***/ 146:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(147);
module.exports = __webpack_require__(196);


/***/ }),

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_nunjucks__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routes__ = __webpack_require__(155);
//
RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Nunjucks

//



/***/ }),

/***/ 148:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_marked__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_marked___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_marked__);








//nunjucks
var env = Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["configure"])('/static/views', {
  autoescape: true,
  web: { async: true }
});

env.addFilter('date', __WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter__);
// Add markdown
__WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown__["register"](env, __WEBPACK_IMPORTED_MODULE_3_marked__);


/***/ }),

/***/ 155:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_navigo__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_navigo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_navigo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controllers_home__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllers_product__ = __webpack_require__(159);






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




router
  .on({
    'product/:productId': function (params, query) {
      console.log(params);
      console.log(query);

      var controller = new __WEBPACK_IMPORTED_MODULE_3__controllers_product__["a" /* default */];
      controller.render(params, query);
    },
    '*': function () {
      console.log('hello dashboard');
      
      var controller = new __WEBPACK_IMPORTED_MODULE_2__controllers_home__["a" /* default */];
      controller.render();
      
    },
    '/hello2': function () {

      console.log('hello2 hello2');

    }
  })
  .resolve();


/***/ }),

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_product__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_urls__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_urls___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__shared_urls__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants__ = __webpack_require__(158);







var productService = new __WEBPACK_IMPORTED_MODULE_1__services_product__["a" /* default */]();

class HomeController {

  constructor() {
    //
    this.departmentId = null;
    this.categoryId = null;
    this.searchString = null;
    this.pageNum = parseInt(Object(__WEBPACK_IMPORTED_MODULE_2__shared_urls__["getParameterByName"])('page')) || 1;
  }

  getPagingData(totalRows) {

    return {
      page: this.pageNum,
      total: Math.ceil(totalRows / __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* ITEMS_PER_PAGE */])
    };
  }

  renderProducts() {
    var that = this;

    var productList;

    if (this.searchString) {
      productList = productService.list(this.pageNum, __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* ITEMS_PER_PAGE */]);
    } else if (this.categoryId) {
      productList = productService.list(this.pageNum, __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* ITEMS_PER_PAGE */]);
    } else if (this.departmentId) {
      productList = productService.list(this.pageNum, __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* ITEMS_PER_PAGE */]);
    } else {
      productList = productService.list(this.pageNum, __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* ITEMS_PER_PAGE */]);
    }

    productList = productService.search('beautiful', 'yes', this.pageNum, __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* ITEMS_PER_PAGE */]);

    productList.then(function(products) {
         Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('_products.html',
	     {products: products, paging: that.getPagingData(products.count)}, function(err, res) {
	var productsElem = document.querySelector('div.products-list');

	productsElem.innerHTML= res;
      });
    });
  }

  render(productId) {
    var that = this;

    Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('home.html', {}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.renderProducts();

      M.updateTextFields();
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HomeController;



/***/ }),

/***/ 157:
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

/***/ 158:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const ITEMS_PER_PAGE = 12;
/* harmony export (immutable) */ __webpack_exports__["a"] = ITEMS_PER_PAGE;
  // limit


/***/ }),

/***/ 159:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tiny_slider_src_tiny_slider__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_product__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_shoppingcart__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_attribute__ = __webpack_require__(195);


var M = __webpack_require__(199);






var productService = new __WEBPACK_IMPORTED_MODULE_2__services_product__["a" /* default */]();
var attributeService = new __WEBPACK_IMPORTED_MODULE_4__services_attribute__["a" /* default */]();
var shoppingcartService = new __WEBPACK_IMPORTED_MODULE_3__services_shoppingcart__["a" /* default */]();

class ProductController {

  constructor() {
  }

  handleAddToCartEvent() {
    var that = this;
    
    var element = document.querySelector('button.add-to-cart');


    var handleAddToCart = function(e) {

      var form = document.querySelector('form');
      var quantity = form.querySelector('input[name=quantity]').value;
      var color = form.querySelector('input[name="Color"]:checked');
      color = color ? color.value : color;

      var size = form.querySelector('input[name="Size"]:checked');
      size = size ? size.value : size;

      var attributes = {
	Size: size,
	Color: color
      };

      shoppingcartService.addToCart(that.params.productId, quantity, attributes).then(function(data) {
	console.log('added to cart');
	console.log(data);
      });
    };
    element.removeEventListener('click', handleAddToCart);
    element.addEventListener('click', handleAddToCart);

  }

  render(params, query) {
    var that = this;

    this.params = params;

    productService.getProduct(params.productId).then(function(product) {

      if (!('error' in product)) {
	attributeService.getProductAttributes(params.productId).then(function(attributes) {
	  var mappedAttributes = {};

	  for (var index in attributes) {
	    var attribute = attributes[index];
	    if (!(attribute.attribute_name in mappedAttributes)) {
	      mappedAttributes[attribute.attribute_name] = [];
	    }
	    mappedAttributes[attribute.attribute_name].push(attribute);
	  }

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

	    that.handleAddToCartEvent();

	  });
	});

      }
    });

  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProductController;



/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_service__ = __webpack_require__(141);



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

}
/* harmony export (immutable) */ __webpack_exports__["a"] = PostService;



/***/ }),

/***/ 196:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 204:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_service__ = __webpack_require__(141);



class ShoppingcartService extends __WEBPACK_IMPORTED_MODULE_0__base_service__["a" /* default */] {

  constructor() {
    super();
  }

  addToCart(productId, quantity, attributes) {
    var that = this;
    
    var shoppingCart = localStorage.getItem('shoppingCart');
    try {
      shoppingCart = JSON.parse(shoppingCart);
    } catch (e) {
      shoppingCart = {};
    }

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

	  return that.updateItem(addedItem.item_id, quantity).then(function(data) {
	    shoppingCart.items = data;
	    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

	    return data;
	  });
	}
	return data;
      });

    });
  }

  updateItem(itemId, quantity) {
    let url = this.baseUrl + '/shoppingcart/update/' + itemId;

    var formData = new FormData();
    formData.append('quantity', quantity);

    return fetch(url, Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'PUT'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getCartId() {
    let url = this.baseUrl + '/shoppingcart/generateUniqueId';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ShoppingcartService;



/***/ })

},[146]);