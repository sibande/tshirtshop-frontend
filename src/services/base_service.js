// Base Service for interacting with the API


export const FETCH_DEFAULTS = {
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, same-origin, *omit
  headers: {
  },
  mode: 'cors', // no-cors, cors, *same-origin
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer' // *client, no-referrer
};

export const BASE_URL = 'http://localhost:3000';


export default class BaseService {

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

