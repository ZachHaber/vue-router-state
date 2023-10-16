/*!
  * vue-router-2-state v3.6.5
  * Zachary Soare
  * @license MIT
  */
'use strict';

var vue = require('vue');

// dev only warn if no current instance
function throwNoCurrentInstance(method) {
    if (!vue.getCurrentInstance()) {
        throw new Error(("[vue-router]: Missing current instance. " + method + "() must be called inside <script setup> or setup()."));
    }
}

function useRouter() {
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production') {
        throwNoCurrentInstance('useRouter');
    }
    return vue.getCurrentInstance().proxy.$root.$router;
}
function useRoute() {
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production') {
        throwNoCurrentInstance('useRoute');
    }
    var root = vue.getCurrentInstance().proxy.$root;
    var thisRoot = root;
    if (!thisRoot._$route) {
        var route = vue.effectScope(true).run(function () { return vue.shallowReactive(Object.assign({}, thisRoot.$router.currentRoute)); });
        thisRoot._$route = route;
        thisRoot.$router.afterEach(function (to) {
            Object.assign(route, to);
        });
    }
    return thisRoot._$route;
}
function useRouteState() {
    var route = useRoute();
    return vue.computed(function () { return route.state; });
}

/**
 * Add a navigation guard that triggers whenever the current location is about to be updated. Similar to beforeRouteUpdate but can be used in any component. The guard is removed when the component is unmounted.
 *
 * @param updateGuard
 */
function onBeforeRouteUpdate(updateGuard) {
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production') {
        throwNoCurrentInstance('onBeforeRouteUpdate');
    }
    return useFilteredGuard(updateGuard, isUpdateNavigation);
}
function isUpdateNavigation(to, from, depth) {
    var toMatched = to.matched;
    var fromMatched = from.matched;
    return (toMatched.length >= depth &&
        toMatched
            .slice(0, depth + 1)
            .every(function (record, i) { return record === fromMatched[i]; }));
}
function isLeaveNavigation(to, from, depth) {
    var toMatched = to.matched;
    var fromMatched = from.matched;
    return toMatched.length < depth || toMatched[depth] !== fromMatched[depth];
}
/**
 * Add a navigation guard that triggers whenever the component for the current location is about to be left. Similar to beforeRouteLeave but can be used in any component. The guard is removed when the component is unmounted.
 *
 * @param leaveGuard
 */
function onBeforeRouteLeave(leaveGuard) {
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production') {
        throwNoCurrentInstance('onBeforeRouteLeave');
    }
    return useFilteredGuard(leaveGuard, isLeaveNavigation);
}
var noop = function () { };
function useFilteredGuard(guard, fn) {
    var instance = vue.getCurrentInstance();
    var router = useRouter();
    var target = instance.proxy;
    // find the nearest RouterView to know the depth
    while (target &&
        target.$vnode &&
        target.$vnode.data &&
        target.$vnode.data.routerViewDepth == null) {
        target = target.$parent;
    }
    var depth = target && target.$vnode && target.$vnode.data
        ? target.$vnode.data.routerViewDepth
        : null;
    if (depth != null) {
        var removeGuard = router.beforeEach(function (to, from, next) {
            return fn(to, from, depth) ? guard(to, from, next) : next();
        });
        vue.onUnmounted(removeGuard);
        return removeGuard;
    }
    return noop;
}

var pathToRegexp$1 = {exports: {}};

var isarray$1 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

var isarray = isarray$1;

/**
 * Expose `pathToRegexp`.
 */
pathToRegexp$1.exports = pathToRegexp;
pathToRegexp$1.exports.parse = parse;
pathToRegexp$1.exports.compile = compile;
pathToRegexp$1.exports.tokensToFunction = tokensToFunction;
pathToRegexp$1.exports.tokensToRegExp = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options), options)
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens, options) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options));
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;
// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
    .replace(encodeReserveRE, encodeReserveReplacer)
    .replace(commaRE, ','); };
function stringifyQuery(obj) {
    var res = obj
        ? Object.keys(obj)
            .map(function (key) {
            var val = obj[key];
            if (val === undefined) {
                return '';
            }
            if (val === null) {
                return encode(key);
            }
            if (Array.isArray(val)) {
                var result = [];
                val.forEach(function (val2) {
                    if (val2 === undefined) {
                        return;
                    }
                    if (val2 === null) {
                        result.push(encode(key));
                    }
                    else {
                        result.push(encode(key) + '=' + encode(val2));
                    }
                });
                return result.join('&');
            }
            return encode(key) + '=' + encode(val);
        })
            .filter(function (x) { return x.length > 0; })
            .join('&')
        : null;
    return res ? ("?" + res) : '';
}

function createRoute(record, location, redirectedFrom, router) {
    var stringifyQuery = router && router.options.stringifyQuery;
    var query = location.query || {};
    try {
        query = clone(query);
    }
    catch (e) { }
    var route = {
        name: location.name || (record && record.name),
        meta: (record && record.meta) || {},
        path: location.path || '/',
        hash: location.hash || '',
        query: query,
        params: location.params || {},
        state: location.state || {},
        fullPath: getFullPath(location, stringifyQuery),
        matched: record ? formatMatch(record) : [],
    };
    if (redirectedFrom) {
        route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery);
    }
    return Object.freeze(route);
}
function clone(value) {
    if (Array.isArray(value)) {
        return value.map(clone);
    }
    else if (value && typeof value === 'object') {
        var res = {};
        for (var key in value) {
            res[key] = clone(value[key]);
        }
        return res;
    }
    else {
        return value;
    }
}
/**
 * Initial route location where the router is. Can be used in navigation guards to differentiate the initial navigation.
 */
createRoute(null, {
    path: '/',
});
function formatMatch(record) {
    var res = [];
    while (record) {
        res.unshift(record);
        record = record.parent;
    }
    return res;
}
function getFullPath(ref, stringify) {
    var path = ref.path;
    var query = ref.query; if ( query === void 0 ) query = {};
    var hash = ref.hash; if ( hash === void 0 ) hash = '';
    if ( stringify === void 0 ) stringify = stringifyQuery;

    return (path || '/') + stringify(query) + hash;
}

function guardEvent(e) {
    // don't redirect with control keys
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
        { return; }
    // don't redirect when preventDefault called
    if (e.defaultPrevented)
        { return; }
    // don't redirect on right click
    if (e.button !== undefined && e.button !== 0)
        { return; }
    // don't redirect if `target="_blank"`
    if (e.currentTarget && e.currentTarget instanceof HTMLElement) {
        var target = e.currentTarget.getAttribute('target');
        if (target && /\b_blank\b/i.test(target))
            { return; }
    }
    // this may be a Weex event which doesn't have this method
    if (e.preventDefault) {
        e.preventDefault();
    }
    return true;
}

function includesParams(outer, inner) {
    var loop = function ( key ) {
        var innerValue = inner[key];
        var outerValue = outer[key];
        if (typeof innerValue === 'string') {
            if (innerValue !== outerValue)
                { return { v: false }; }
        }
        else {
            if (!Array.isArray(outerValue) ||
                outerValue.length !== innerValue.length ||
                innerValue.some(function (value, i) { return value !== outerValue[i]; })) {
                return { v: false };
            }
        }
    };

    for (var key in inner) {
        var returned = loop( key );

        if ( returned ) return returned.v;
    }
    return true;
}
// helpers from vue router 4
function isSameRouteLocationParamsValue(a, b) {
    return Array.isArray(a)
        ? isEquivalentArray(a, b)
        : Array.isArray(b)
            ? isEquivalentArray(b, a)
            : a === b;
}
function isEquivalentArray(a, b) {
    return Array.isArray(b)
        ? a.length === b.length && a.every(function (value, i) { return value === b[i]; })
        : a.length === 1 && a[0] === b;
}
function isSameRouteLocationParams(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length)
        { return false; }
    for (var key in a) {
        if (!isSameRouteLocationParamsValue(a[key], b[key]))
            { return false; }
    }
    return true;
}
function useLink(ref) {
    var to = ref.to;
    var replace = ref.replace;

    // @ts-ignore
    if (process.env.NODE_ENV !== 'production') {
        throwNoCurrentInstance('useLink');
    }
    var router = useRouter();
    var currentRoute = useRoute();
    var resolvedRoute = vue.computed(function () { return router.resolve(vue.unref(to), currentRoute); });
    var activeRecordIndex = vue.computed(function () {
        var route = resolvedRoute.value.route;
        var matched = route.matched;
        var length = matched.length;
        var routeMatched = matched[length - 1];
        var currentMatched = currentRoute.matched;
        if (!routeMatched || !currentMatched.length)
            { return -1; }
        var index = currentMatched.indexOf(routeMatched);
        if (index > -1)
            { return index; }
        // possible parent record
        var parentRecord = currentMatched[currentMatched.length - 2];
        return (
        // we are dealing with nested routes
        length > 1 &&
            // if the parent and matched route have the same path, this link is
            // referring to the empty child. Or we currently are on a different
            // child of the same parent
            parentRecord &&
            parentRecord === routeMatched.parent);
    });
    var isActive = vue.computed(function () { return activeRecordIndex.value > -1 &&
        includesParams(currentRoute.params, resolvedRoute.value.route.params); });
    var isExactActive = vue.computed(function () { return activeRecordIndex.value > -1 &&
        activeRecordIndex.value === currentRoute.matched.length - 1 &&
        isSameRouteLocationParams(currentRoute.params, resolvedRoute.value.route.params); });
    var navigate = function (e) {
        var href = resolvedRoute.value.location;
        if (guardEvent(e)) {
            return replace ? router.replace(href) : router.push(href);
        }
        return Promise.resolve();
    };
    return {
        href: vue.computed(function () { return resolvedRoute.value.href; }),
        route: vue.computed(function () { return resolvedRoute.value.route; }),
        isExactActive: isExactActive,
        isActive: isActive,
        navigate: navigate,
    };
}

exports.isSameRouteLocationParams = isSameRouteLocationParams;
exports.onBeforeRouteLeave = onBeforeRouteLeave;
exports.onBeforeRouteUpdate = onBeforeRouteUpdate;
exports.useLink = useLink;
exports.useRoute = useRoute;
exports.useRouteState = useRouteState;
exports.useRouter = useRouter;
