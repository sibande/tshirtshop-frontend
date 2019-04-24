webpackJsonp([0],{

/***/ 135:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(136);
module.exports = __webpack_require__(150);


/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_nunjucks__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routes__ = __webpack_require__(144);
//
RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Nunjucks

//



/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_nunjucks_date_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_nunjucks_markdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_marked__ = __webpack_require__(133);
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

/***/ 144:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_navigo__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_navigo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_navigo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controllers_home__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllers_product__ = __webpack_require__(157);






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

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_product__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_urls__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_urls___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__shared_urls__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants__ = __webpack_require__(149);







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

/***/ 146:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_service__ = __webpack_require__(147);



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

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Base Service for interacting with the API


const FETCH_DEFAULTS = {
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, same-origin, *omit
  headers: {
    'content-type': 'application/json'
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

/***/ 148:
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

/***/ 149:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const ITEMS_PER_PAGE = 12;
/* harmony export (immutable) */ __webpack_exports__["a"] = ITEMS_PER_PAGE;
  // limit


/***/ }),

/***/ 150:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nunjucks___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nunjucks__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tiny_slider_src_tiny_slider__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_product__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_attribute__ = __webpack_require__(158);







var productService = new __WEBPACK_IMPORTED_MODULE_2__services_product__["a" /* default */]();
var attributeService = new __WEBPACK_IMPORTED_MODULE_3__services_attribute__["a" /* default */]();

class ProductController {

  constructor() {
  }

  render(params, query) {
    var that = this;
    
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
	    console.log(__WEBPACK_IMPORTED_MODULE_1_tiny_slider_src_tiny_slider__["a" /* tns */]);
	    
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
	  });
	});

      }
    });

  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProductController;



/***/ }),

/***/ 158:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_service__ = __webpack_require__(147);



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



/***/ })

},[135]);