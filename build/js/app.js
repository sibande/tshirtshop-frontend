webpackJsonp([0],{

/***/ 135:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(136);
module.exports = __webpack_require__(148);


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





var root = '';
var router = new __WEBPACK_IMPORTED_MODULE_1_navigo___default.a(root);

router
  .on({
    '/hello': function () {

      console.log('hello hello');

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





var productService = new __WEBPACK_IMPORTED_MODULE_1__services_product__["a" /* default */]();

class HomeController {

  constructor() {
    //
    this.departmentId = null;
    this.categoryId = null;
    this.searchString = null;
  }

  renderProducts() {

    var productList;

    if (this.searchString) {
      productList = productService.list();
    } else if (this.categoryId) {
      productList = productService.list();
    } else if (this.departmentId) {
      productList = productService.list();
    } else {
      productList = productService.list();
    }

    productList = productService.search('beautiful', 'yes');

    productList.then(function(products) {
      Object(__WEBPACK_IMPORTED_MODULE_0_nunjucks__["render"])('_products.html', {products: products}, function(err, res) {
	var productsElem = document.querySelector('div.products-list');

	productsElem.innerHTML= res;
      });
    });
  }
  
  render() {
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

  list() {
    let queryParams = this.getQuery({
    }, true);

    let url = this.baseUrl + '/products';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }


  search(queryString, allWords) {
    let queryParams = this.getQuery({
      query_string: queryString,
      all_words: allWords
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

// removed by extract-text-webpack-plugin

/***/ })

},[135]);