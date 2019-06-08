import {configure, renderString, render} from 'nunjucks';

import * as nunjucks from 'nunjucks';
import * as dateFilter from 'nunjucks-date-filter';
import * as markdown from 'nunjucks-markdown';
import * as marked from 'marked';

import { CURRENCY } from './../constants';


//nunjucks
var env = configure('/static/views', {
  autoescape: true,
  web: { async: true }
});

env.addFilter('date', dateFilter);

export function formatPrice(num, length) {
  if (!parseFloat(num)) {
    num = 0;
  }
  return CURRENCY + num.toFixed(length || 2);
}

env.addFilter('price', formatPrice);


// Status ID to description
export function orderStatusName(statusId) {
  var name = 'Unknown';

  if (statusId == 1) {
    name = 'Completed';
  }
  return name;
}

env.addFilter('orderStatusName', orderStatusName);


// Add markdown
markdown.register(env, marked);
