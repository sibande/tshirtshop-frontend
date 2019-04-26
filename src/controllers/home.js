import {configure, renderString, render} from 'nunjucks';

import ProductService from './../services/product';
import ShoppingcartService from './../services/shoppingcart';
import {getParameterByName} from './../shared/urls';
import {ITEMS_PER_PAGE} from './../constants';


var productService = new ProductService();
var shoppingcartService = new ShoppingcartService();

export default class HomeController {

  constructor() {
    //
    this.departmentId = null;
    this.categoryId = null;
    this.searchString = null;
    this.pageNum = parseInt(getParameterByName('page')) || 1;
  }

  getPagingData(totalRows) {

    return {
      page: this.pageNum,
      total: Math.ceil(totalRows / ITEMS_PER_PAGE)
    };
  }

  renderProducts() {
    var that = this;

    var productList;

    if (this.searchString) {
      productList = productService.list(this.pageNum, ITEMS_PER_PAGE);
    } else if (this.categoryId) {
      productList = productService.list(this.pageNum, ITEMS_PER_PAGE);
    } else if (this.departmentId) {
      productList = productService.list(this.pageNum, ITEMS_PER_PAGE);
    } else {
      productList = productService.list(this.pageNum, ITEMS_PER_PAGE);
    }

    productList = productService.search('beautiful', 'yes', this.pageNum, ITEMS_PER_PAGE);

    productList.then(function(products) {
      render('_products.html',
	     {products: products, paging: that.getPagingData(products.count)}, function(err, res) {
	var productsElem = document.querySelector('div.products-list');

	productsElem.innerHTML= res;
      });
    });
  }

  renderShoppingcartSummary() {
    var shoppingCart = shoppingcartService.getShoppingcart();

    if (shoppingCart.totalAmount) {
      render('_cart_summary.html', {shoppingCart: shoppingCart}, function(err, res) {

	var summaryElem = document.querySelector('div.shoppingcart-summary .col');

	summaryElem.innerHTML= res;
      });
    }
  }

  render(productId) {
    var that = this;

    render('home.html', {}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.renderProducts();

      that.renderShoppingcartSummary();

      M.updateTextFields();
    });
  }
}
