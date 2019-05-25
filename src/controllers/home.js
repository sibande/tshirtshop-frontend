import {configure, renderString, render} from 'nunjucks';

import ProductService from './../services/product';
import ShoppingcartService from './../services/shoppingcart';
import AttributeService from './../services/attribute';

import {getParameterByName} from './../shared/urls';
import {handleAddToCartEvent} from './shoppingcart';

import {ITEMS_PER_PAGE_LIST} from './../constants';


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

    	render('_quick_product_view.html', ctx, function(err, res) {
	  quickElem.innerHTML = res;
	  quickElem.classList.remove('loading');
	  quickElem.classList.add('loaded');

    	  var button = document.querySelector(
    	    'div.product-quick-view > div[data-product-id="' + product.product_id + '"] button.add-to-cart');

    	  if (button) {
    	    handleAddToCartEvent(button, {
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

  if (ITEMS_PER_PAGE_LIST.includes(itemsPerPage)) {
    localStorage.setItem('itemsPerPage', itemsPerPage);
    controller.itemsPerPage = itemsPerPage;

    var currentItemsElem = document.querySelector('div.items-per-page span.current');
    if (currentItemsElem) {
      currentItemsElem.classList.remove('current');
    }
    controller.renderProducts();
    //
    elem.parentNode.classList.add('current');
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
    this.itemsPerPage = parseInt(localStorage.getItem('itemsPerPage'));
    if (!ITEMS_PER_PAGE_LIST.includes(this.itemsPerPage)) {
      this.itemsPerPage = ITEMS_PER_PAGE_LIST[0];
    }

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

      render('_products.html', context, function(err, res) {
	var productsElem = document.querySelector('div.products-list');

	// Add pagination
	render('_pagination.html', context, function(err, pagingRes) {
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
	departments: departments.rows,
 	departmentId: that.departmentId,
	categoryId: that.categoryId,
	searchString: that.searchString,
	itemsList: ITEMS_PER_PAGE_LIST,
	itemsPerPage: that.itemsPerPage,
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
	that.handleItemsPerPageEvent();
	handleSearchEvent();
	if (that.departmentId) {
	  that.renderCategories();
	}
      });
    });
  }
}
