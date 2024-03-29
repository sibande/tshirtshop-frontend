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

export const BASE_URL = 'https://www.themba.xyz/v1';

export const INVALID_SERVER_RESPONSE = {
  code: 'SVR_01',
  message: 'Invalid server response',
  status: 500
};

export function handleFetchResponse(res) {
  if (res.status !== 200) {
    var error = null;

    try {
      return res.json().then(function(err) {
	throw err;
      });
    } catch (e) {
      error = INVALID_SERVER_RESPONSE;
    }

    return Promise.reject(error);
  } else {
    return Promise.resolve(res.json());
  }
}


export default class BaseService {

  constructor() {
    this.baseUrl = BASE_URL;
  }

  getOptions() {
    var authorizationKey = localStorage.getItem('authorizationKey');

    if (authorizationKey) {
      FETCH_DEFAULTS.headers['USER-KEY'] = authorizationKey;
    }
    return FETCH_DEFAULTS;
  }

  getQuery(params, skipEmpty) {
    var esc = encodeURIComponent;

    var queryStr = Object.keys(params)
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

