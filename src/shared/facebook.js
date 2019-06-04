import {handleAuthResponseChange, handleStatusChange} from './../controllers/auth';

// Init Facebook
export  function initFacebook() {
  var tag = document.createElement("script");
  tag.src = "https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v3.2&appId=664434307312339&autoLogAppEvents=1";
  tag.crossorigin="anonymous";
  document.getElementsByTagName("head")[0].appendChild(tag);

  function initFB() {
    FB.init({
      appId            : '664434307312339',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v3.2'
    });

    FB.Event.subscribe('auth.authResponseChange', handleAuthResponseChange);
    FB.Event.subscribe('auth.statusChange', handleStatusChange);
  }

  if (window.FB) {
    initFB();
  } else {
    window.fbAsyncInit = function() {
      initFB();
    };
  }

}
