import {configure, renderString, render} from 'nunjucks';

import * as nunjucks from 'nunjucks';
import * as dateFilter from 'nunjucks-date-filter';
import * as markdown from 'nunjucks-markdown';
import * as marked from 'marked';


//nunjucks
var env = configure('/static/views', {
  autoescape: true,
  web: { async: true }
});

env.addFilter('date', dateFilter);
// Add markdown
markdown.register(env, marked);
