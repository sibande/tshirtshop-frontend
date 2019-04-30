import {configure, renderString, render} from 'nunjucks';

import ProductService from './../services/product';
import ShoppingcartService from './../services/shoppingcart';
import AttributeService from './../services/attribute';

import {getParameterByName} from './../shared/urls';
import {handleAddToCartEvent} from './shoppingcart';

import {ITEMS_PER_PAGE} from './../constants';


var productService = new ProductService();
var attributeService = new AttributeService();
var shoppingcartService = new ShoppingcartService();


function renderShoppingcartSummary() {
  var shoppingCart = shoppingcartService.getShoppingcart();

  if (shoppingCart.totalAmount) {
    var summaryElem = document.querySelector('div.shoppingcart-summary .col');

    var loadingDiv = '<div>'
	+ '<img src="/static/img/ajax_small.gif" class="quick-view-loading" alt="Loading..."></div>';
    summaryElem.innerHTML= loadingDiv;

    render('_cart_summary.html', {shoppingCart: shoppingCart}, function(err, res) {

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
	      handleAddToCartEvent(button, {
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

export default class HomeController {

  constructor() {
    //
    this.departmentId = localStorage.getItem('departmentId') || null;
    this.categoryId = localStorage.getItem('categoryId') || null;
    this.searchString = getParameterByName('search') || null;
    this.searchAll = getParameterByName('searchAll') || null;
    if (this.searchString) {
      this.categoryId = "";
      localStorage.setItem('categoryId', "");
      this.departmentId = "";
      localStorage.setItem('departmentId', "");
    }
    this.pageNum = parseInt(getParameterByName('page')) || 1;
  }

  getPagingData(totalRows) {

    return {
      page: this.pageNum,
      total: Math.ceil(totalRows / ITEMS_PER_PAGE)
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
      render('_categories.html', {categories: categories, categoryId: that.categoryId}, function(err, res) {
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
      productList = productService.search(this.searchString, this.searchAll, this.pageNum, ITEMS_PER_PAGE);
    } else if (this.categoryId) {
      productList = productService.getProductsByCategory(this.categoryId, this.pageNum, ITEMS_PER_PAGE);
    } else if (this.departmentId) {
      productList = productService.getProductsByDepartment(this.departmentId, this.pageNum, ITEMS_PER_PAGE);
    } else {
      productList = productService.list(this.pageNum, ITEMS_PER_PAGE);
    }

    productList.then(function(products) {

      var context = {
	products: products,
	searchString: that.searchString,
	searchAll: that.searchAll,
	paging: that.getPagingData(products.count)
      };

      render('_products.html', context, function(err, res) {
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

      render('home.html', context, function(err, res) {
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
