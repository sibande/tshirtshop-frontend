//
RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Nunjucks
import './shared/nunjucks';
//
import './routes';
