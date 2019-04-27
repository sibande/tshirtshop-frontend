import {configure, renderString, render} from 'nunjucks';

import ProductService from './../services/product';
import ShoppingcartService from './../services/shoppingcart';
import AttributeService from './../services/attribute';

import {getParameterByName} from './../shared/urls';
import {handleAddToCart} from './product';

import {ITEMS_PER_PAGE} from './../constants';


var productService = new ProductService();
var attributeService = new AttributeService();
var shoppingcartService = new ShoppingcartService();


function handleAddToCarMouseLeave(e) {
  var currentElem = e.target;

  currentElem.remove();
}

var lastCalled = new Date().getTime();

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

	render('_quick_product_view.html', {
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
	      button.removeEventListener('click', handleAddToCart);
	      button.addEventListener('click', handleAddToCart);
	      button.customParams = {
		productId: product.product_id,
		productAttributes: mappedAttributes,
		form: button.closest('form')
	      };
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

  handleQuickAddToCartEvent() {
    lastCalled = new Date().getTime();

    document.removeEventListener('mouseover', handleAddToCartMouseOver);
    document.addEventListener('mouseover', handleAddToCartMouseOver);
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
      that.handleQuickAddToCartEvent();
    });
  }
}
