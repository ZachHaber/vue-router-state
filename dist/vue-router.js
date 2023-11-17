/*!
  * vue-router-2-state v3.7.1
  * Zachary Soare
  * @license MIT
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VueRouter = factory());
})(this, (function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
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

	var pathToRegexpExports = pathToRegexp$1.exports;
	var Regexp = /*@__PURE__*/getDefaultExportFromCjs(pathToRegexpExports);

	function resolvePath(relative, base, append) {
	    var firstChar = relative.charAt(0);
	    if (firstChar === '/') {
	        return relative;
	    }
	    if (firstChar === '?' || firstChar === '#') {
	        return base + relative;
	    }
	    var stack = base.split('/');
	    // remove trailing segment if:
	    // - not appending
	    // - appending to trailing slash (last segment is empty)
	    if (!append || !stack[stack.length - 1]) {
	        stack.pop();
	    }
	    // resolve relative path
	    var segments = relative.replace(/^\//, '').split('/');
	    for (var i = 0; i < segments.length; i++) {
	        var segment = segments[i];
	        if (segment === '..') {
	            stack.pop();
	        }
	        else if (segment !== '.') {
	            stack.push(segment);
	        }
	    }
	    // ensure leading slash
	    if (stack[0] !== '') {
	        stack.unshift('');
	    }
	    return stack.join('/');
	}
	function parsePath(path) {
	    var hash = '';
	    var query = '';
	    var hashIndex = path.indexOf('#');
	    if (hashIndex >= 0) {
	        hash = path.slice(hashIndex);
	        path = path.slice(0, hashIndex);
	    }
	    var queryIndex = path.indexOf('?');
	    if (queryIndex >= 0) {
	        query = path.slice(queryIndex + 1);
	        path = path.slice(0, queryIndex);
	    }
	    return {
	        path: path,
	        query: query,
	        hash: hash,
	    };
	}
	function cleanPath(path) {
	    return path.replace(/\/(?:\s*\/)+/g, '/');
	}

	function assert(condition, message) {
	    if (!condition) {
	        throw new Error(("[vue-router] " + message));
	    }
	}
	function warn(condition, message) {
	    if (!condition) {
	        typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
	        return false;
	    }
	    return true;
	}

	function createRouteMap(routes, oldPathList, oldPathMap, oldNameMap, parentRoute) {
	    // the path list is used to control path matching priority
	    var pathList = oldPathList || [];
	    // $flow-disable-line
	    var pathMap = oldPathMap || Object.create(null);
	    // $flow-disable-line
	    var nameMap = oldNameMap || Object.create(null);
	    routes.forEach(function (route) {
	        addRouteRecord(pathList, pathMap, nameMap, route, parentRoute);
	    });
	    // ensure wildcard routes are always at the end
	    for (var i = 0, l = pathList.length; i < l; i++) {
	        if (pathList[i] === '*') {
	            pathList.push(pathList.splice(i, 1)[0]);
	            l--;
	            i--;
	        }
	    }
	    // @ts-ignore
	    {
	        // warn if routes do not include leading slashes
	        var found = pathList
	            // check for missing leading slash
	            .filter(function (path) { return path && path.charAt(0) !== '*' && path.charAt(0) !== '/'; });
	        if (found.length > 0) {
	            var pathNames = found.map(function (path) { return ("- " + path); }).join('\n');
	            warn(false, ("Non-nested routes must include a leading slash character. Fix the following routes: \n" + pathNames));
	        }
	    }
	    return {
	        pathList: pathList,
	        pathMap: pathMap,
	        nameMap: nameMap,
	    };
	}
	function addRouteRecord(pathList, pathMap, nameMap, route, parent, matchAs) {
	    var path = route.path;
	    var name = route.name;
	    // @ts-ignore
	    {
	        assert(path != null, "\"path\" is required in a route configuration.");
	        assert(typeof route.component !== 'string', "route config \"component\" for path: " + (String(path || name)) + " cannot be a " + "string id. Use an actual component instead.");
	        warn(
	        // eslint-disable-next-line no-control-regex
	        !/[^\u0000-\u007F]+/.test(path), "Route with path \"" + path + "\" contains unencoded characters, make sure " +
	            "your path is correctly encoded before passing it to the router. Use " +
	            "encodeURI to encode static segments of your path.");
	    }
	    var pathToRegexpOptions = route.pathToRegexpOptions || {};
	    var normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict);
	    if (typeof route.caseSensitive === 'boolean') {
	        pathToRegexpOptions.sensitive = route.caseSensitive;
	    }
	    var record = {
	        path: normalizedPath,
	        regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
	        components: route.components || {
	            default: route.component,
	        },
	        alias: route.alias
	            ? typeof route.alias === 'string'
	                ? [route.alias]
	                : route.alias
	            : [],
	        instances: {},
	        enteredCbs: {},
	        name: name,
	        parent: parent,
	        matchAs: matchAs,
	        redirect: route.redirect,
	        beforeEnter: route.beforeEnter,
	        meta: route.meta || {},
	        props: route.props == null
	            ? {}
	            : route.components
	                ? route.props
	                : {
	                    default: route.props,
	                },
	    };
	    if (route.children) {
	        // Warn if route is named, does not redirect and has a default child route.
	        // If users navigate to this route by name, the default child will
	        // not be rendered (GH Issue #629)
	        // @ts-ignore
	        {
	            if (route.name &&
	                !route.redirect &&
	                route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
	                warn(false, "Named Route '" + (route.name) + "' has a default child route. " +
	                    "When navigating to this named route (:to=\"{name: '" + (route.name) + "'}\"), " +
	                    "the default child route will not be rendered. Remove the name from " +
	                    "this route and use the name of the default child route for named " +
	                    "links instead.");
	            }
	        }
	        route.children.forEach(function (child) {
	            var childMatchAs = matchAs
	                ? cleanPath((matchAs + "/" + (child.path)))
	                : undefined;
	            addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
	        });
	    }
	    if (!pathMap[record.path]) {
	        pathList.push(record.path);
	        pathMap[record.path] = record;
	    }
	    if (route.alias !== undefined) {
	        var aliases = Array.isArray(route.alias) ? route.alias : [route.alias];
	        for (var i = 0; i < aliases.length; ++i) {
	            var alias = aliases[i];
	            // @ts-ignore
	            if (alias === path) {
	                warn(false, ("Found an alias with the same value as the path: \"" + path + "\". You have to remove that alias. It will be ignored in development."));
	                // skip in dev to make it work
	                continue;
	            }
	            var aliasRoute = {
	                path: alias,
	                children: route.children,
	            };
	            addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path || '/');
	        }
	    }
	    if (name) {
	        if (!nameMap[name]) {
	            nameMap[name] = record;
	            // @ts-ignore
	        }
	        else if (!matchAs) {
	            warn(false, "Duplicate named routes definition: " +
	                "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }");
	        }
	    }
	}
	function compileRouteRegex(path, pathToRegexpOptions) {
	    var regex = Regexp(path, [], pathToRegexpOptions);
	    // @ts-ignore
	    {
	        var keys = Object.create(null);
	        regex.keys.forEach(function (key) {
	            warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
	            keys[key.name] = true;
	        });
	    }
	    return regex;
	}
	function normalizePath(path, parent, strict) {
	    if (!strict)
	        { path = path.replace(/\/$/, ''); }
	    if (path[0] === '/')
	        { return path; }
	    if (parent == null)
	        { return path; }
	    return cleanPath(((parent.path) + "/" + path));
	}

	function extend(a, b) {
	    var aVal = a;
	    for (var key in b) {
	        aVal[key] = b[key];
	    }
	    return aVal;
	}
	function isPromiseLike(promiseLike) {
	    if (promiseLike &&
	        typeof promiseLike === 'object' &&
	        'then' in promiseLike &&
	        typeof promiseLike.then === 'function') {
	        return true;
	    }
	    return false;
	}

	// $flow-disable-line
	var regexpCompileCache = Object.create(null);
	function fillParams(path, params, routeMsg) {
	    params = params || {};
	    try {
	        var filler = regexpCompileCache[path] ||
	            (regexpCompileCache[path] = Regexp.compile(path));
	        // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }}
	        // and fix #3106 so that you can work with location descriptor object having params.pathMatch equal to empty string
	        if (typeof params.pathMatch === 'string')
	            { params[0] = params.pathMatch; }
	        return filler(params, { pretty: true });
	    }
	    catch (e) {
	        // @ts-ignore
	        {
	            if (e instanceof Error) {
	                // Fix #3072 no warn if `pathMatch` is string
	                warn(typeof params.pathMatch === 'string', ("missing param for " + routeMsg + ": " + (e.message)));
	            }
	        }
	        return '';
	    }
	    finally {
	        // delete the 0 if it was added
	        delete params[0];
	    }
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
	function decode(str) {
	    try {
	        return decodeURIComponent(str);
	    }
	    catch (err) {
	        // @ts-ignore
	        {
	            warn(false, ("Error decoding \"" + str + "\". Leaving it intact."));
	        }
	    }
	    return str;
	}
	function resolveQuery(query, extraQuery, _parseQuery) {
	    if ( extraQuery === void 0 ) extraQuery = {};

	    var parse = _parseQuery || parseQuery;
	    var parsedQuery;
	    try {
	        parsedQuery = parse(query || '');
	    }
	    catch (e) {
	        // @ts-ignore
	        {
	            if (e instanceof Error) {
	                warn(false, e.message);
	            }
	        }
	        parsedQuery = {};
	    }
	    for (var key in extraQuery) {
	        var value = extraQuery[key];
	        parsedQuery[key] = Array.isArray(value)
	            ? value.map(castQueryParamValue)
	            : castQueryParamValue(value);
	    }
	    return parsedQuery;
	}
	var castQueryParamValue = function (value) { return (value == null || typeof value === 'object' ? value : String(value)); };
	function parseQuery(query) {
	    var res = {};
	    query = query.trim().replace(/^(\?|#|&)/, '');
	    if (!query) {
	        return res;
	    }
	    query.split('&').forEach(function (param) {
	        var parts = param.replace(/\+/g, ' ').split('=');
	        var key = decode(parts.shift());
	        var val = parts.length > 0 ? decode(parts.join('=')) : null;
	        if (res[key] === undefined) {
	            res[key] = val;
	        }
	        else if (Array.isArray(res[key])) {
	            res[key].push(val);
	        }
	        else {
	            res[key] = [res[key], val];
	        }
	    });
	    return res;
	}
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

	function normalizeLocation(raw, current, append, router) {
	    var next = typeof raw === 'string' ? { path: raw } : raw;
	    // named target
	    if (next._normalized) {
	        return next;
	    }
	    else if (next.name) {
	        var normalized = extend({ _normalized: true }, next);
	        var params = normalized.params;
	        if (params && typeof params === 'object') {
	            normalized.params = extend({}, params);
	        }
	        return normalized;
	    }
	    // relative params
	    if (!next.path && next.params && current) {
	        var normalized$1 = extend({ _normalized: true }, next);
	        var params$1 = extend(extend({}, current.params), normalized$1.params);
	        if (current.name) {
	            normalized$1.name = current.name;
	            normalized$1.params = params$1;
	        }
	        else if (current.matched.length) {
	            var rawPath = current.matched[current.matched.length - 1].path;
	            normalized$1.path = fillParams(rawPath, params$1, ("path " + (current.path)));
	            // @ts-ignore
	        }
	        else {
	            warn(false, "relative params navigation requires a current route.");
	        }
	        return normalized$1;
	    }
	    var parsedPath = parsePath(next.path || '');
	    var basePath = (current && current.path) || '/';
	    var path = parsedPath.path
	        ? resolvePath(parsedPath.path, basePath, append || next.append)
	        : basePath;
	    var query = resolveQuery(parsedPath.query, next.query, router && router.options.parseQuery);
	    var hash = next.hash || parsedPath.hash;
	    if (hash && hash.charAt(0) !== '#') {
	        hash = "#" + hash;
	    }
	    return {
	        _normalized: true,
	        path: path,
	        query: query,
	        hash: hash,
	        state: next.state,
	    };
	}

	var trailingSlashRE = /\/?$/;
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
	var START = createRoute(null, {
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
	function isSameRoute(a, b, onlyPath) {
	    if (b === START) {
	        return a === b;
	    }
	    else if (!b) {
	        return false;
	    }
	    else if (a.path && b.path) {
	        return (a.path.replace(trailingSlashRE, '') ===
	            b.path.replace(trailingSlashRE, '') &&
	            (onlyPath ||
	                (a.hash === b.hash &&
	                    isObjectEqual(a.query, b.query) &&
	                    isObjectEqual(a.state, b.state))));
	    }
	    else if (a.name && b.name) {
	        return (a.name === b.name &&
	            (onlyPath ||
	                (a.hash === b.hash &&
	                    isObjectEqual(a.query, b.query) &&
	                    isObjectEqual(a.params, b.params) &&
	                    isObjectEqual(a.state, b.state))));
	    }
	    else {
	        return false;
	    }
	}
	function isObjectEqual(a, b) {
	    if ( a === void 0 ) a = {};
	    if ( b === void 0 ) b = {};

	    // handle null value #1566
	    if (!a || !b)
	        { return a === b; }
	    var aKeys = Object.keys(a).sort();
	    var bKeys = Object.keys(b).sort();
	    if (aKeys.length !== bKeys.length) {
	        return false;
	    }
	    return aKeys.every(function (key, i) {
	        var aVal = a[key];
	        var bKey = bKeys[i];
	        if (bKey !== key)
	            { return false; }
	        var bVal = b[key];
	        // query values can be null and undefined
	        if (aVal == null || bVal == null)
	            { return aVal === bVal; }
	        // check nested equality
	        if (typeof aVal === 'object' && typeof bVal === 'object') {
	            return isObjectEqual(aVal, bVal);
	        }
	        return String(aVal) === String(bVal);
	    });
	}
	function isIncludedRoute(current, target) {
	    return (current.path
	        .replace(trailingSlashRE, '/')
	        .indexOf(target.path.replace(trailingSlashRE, '/')) === 0 &&
	        (!target.hash || current.hash === target.hash) &&
	        queryIncludes(current.query, target.query));
	}
	function queryIncludes(current, target) {
	    for (var key in target) {
	        if (!(key in current)) {
	            return false;
	        }
	    }
	    return true;
	}
	function handleRouteEntered(route) {
	    for (var i = 0; i < route.matched.length; i++) {
	        var record = route.matched[i];
	        for (var name in record.instances) {
	            var instance = record.instances[name];
	            var cbs = record.enteredCbs[name];
	            if (!instance || !cbs)
	                { continue; }
	            delete record.enteredCbs[name];
	            for (var i$1 = 0; i$1 < cbs.length; i$1++) {
	                if (!instance._isBeingDestroyed)
	                    { cbs[i$1](instance); }
	            }
	        }
	    }
	}

	function createMatcher(routes, router) {
	    var ref = createRouteMap(routes);
	    var pathList = ref.pathList;
	    var pathMap = ref.pathMap;
	    var nameMap = ref.nameMap;
	    function addRoutes(routes) {
	        createRouteMap(routes, pathList, pathMap, nameMap);
	    }
	    function addRoute(parentOrRoute, route) {
	        var parent = typeof parentOrRoute !== 'object' ? nameMap[parentOrRoute] : undefined;
	        var parentRoute = typeof parentOrRoute === 'object' ? parentOrRoute : undefined;
	        createRouteMap([route || parentRoute], pathList, pathMap, nameMap, parent);
	        // add aliases of parent
	        if (parent && parent.alias.length) {
	            createRouteMap(
	            // $flow-disable-line route is defined if parent is
	            parent.alias.map(function (alias) { return ({ path: alias, children: [route] }); }), pathList, pathMap, nameMap, parent);
	        }
	    }
	    function getRoutes() {
	        return pathList.map(function (path) { return pathMap[path]; });
	    }
	    function match(raw, currentRoute, redirectedFrom) {
	        var location = normalizeLocation(raw, currentRoute, false, router);
	        var name = location.name;
	        if (name) {
	            var record = nameMap[name];
	            // @ts-ignore
	            {
	                warn(record, ("Route with name '" + name + "' does not exist"));
	            }
	            if (!record)
	                { return _createRoute(null, location); }
	            var paramNames = record.regex.keys
	                .filter(function (key) { return !key.optional; })
	                .map(function (key) { return key.name; });
	            if (typeof location.params !== 'object') {
	                location.params = {};
	            }
	            if (currentRoute && typeof currentRoute.params === 'object') {
	                for (var key in currentRoute.params) {
	                    if (!(key in location.params) && paramNames.indexOf(key) > -1) {
	                        location.params[key] = currentRoute.params[key];
	                    }
	                }
	            }
	            location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
	            return _createRoute(record, location, redirectedFrom);
	        }
	        else if (location.path) {
	            location.params = {};
	            for (var i = 0; i < pathList.length; i++) {
	                var path = pathList[i];
	                var record$1 = pathMap[path];
	                if (matchRoute(record$1.regex, location.path, location.params)) {
	                    return _createRoute(record$1, location, redirectedFrom);
	                }
	            }
	        }
	        // no match
	        return _createRoute(null, location);
	    }
	    function redirect(record, location) {
	        var originalRedirect = record.redirect;
	        var redirect = typeof originalRedirect === 'function'
	            ? originalRedirect(createRoute(record, location, null, router))
	            : originalRedirect;
	        if (typeof redirect === 'string') {
	            redirect = { path: redirect };
	        }
	        if (!redirect || typeof redirect !== 'object') {
	            // @ts-ignore
	            {
	                warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
	            }
	            return _createRoute(null, location);
	        }
	        var re = redirect;
	        var name = re.name;
	        var path = re.path;
	        var query = location.query;
	        var hash = location.hash;
	        var params = location.params;
	        var state = location.state;
	        query = re.hasOwnProperty('query') ? re.query : query;
	        hash = re.hasOwnProperty('hash') ? re.hash : hash;
	        params = re.hasOwnProperty('params') ? re.params : params;
	        state = re.hasOwnProperty('state') ? re.state : state;
	        if (name) {
	            // resolved named direct
	            var targetRecord = nameMap[name];
	            // @ts-ignore
	            {
	                assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
	            }
	            return match({
	                _normalized: true,
	                name: name,
	                query: query,
	                hash: hash,
	                params: params,
	                state: state,
	            }, undefined, location);
	        }
	        else if (path) {
	            // 1. resolve relative redirect
	            var rawPath = resolveRecordPath(path, record);
	            // 2. resolve params
	            var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
	            // 3. rematch with existing query and hash
	            return match({
	                _normalized: true,
	                path: resolvedPath,
	                query: query,
	                hash: hash,
	                state: state,
	            }, undefined, location);
	        }
	        else {
	            // @ts-ignore
	            {
	                warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
	            }
	            return _createRoute(null, location);
	        }
	    }
	    function alias(record, location, matchAs) {
	        var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
	        var aliasedMatch = match({
	            _normalized: true,
	            path: aliasedPath,
	        });
	        if (aliasedMatch) {
	            var matched = aliasedMatch.matched;
	            var aliasedRecord = matched[matched.length - 1];
	            location.params = aliasedMatch.params;
	            return _createRoute(aliasedRecord, location);
	        }
	        return _createRoute(null, location);
	    }
	    function _createRoute(record, location, redirectedFrom) {
	        if (record && record.redirect) {
	            return redirect(record, redirectedFrom || location);
	        }
	        if (record && record.matchAs) {
	            return alias(record, location, record.matchAs);
	        }
	        return createRoute(record, location, redirectedFrom, router);
	    }
	    return {
	        match: match,
	        addRoute: addRoute,
	        getRoutes: getRoutes,
	        addRoutes: addRoutes,
	    };
	}
	function matchRoute(regex, path, params) {
	    var m = path.match(regex);
	    if (!m) {
	        return false;
	    }
	    else if (!params) {
	        return true;
	    }
	    for (var i = 1, len = m.length; i < len; ++i) {
	        var key = regex.keys[i - 1];
	        if (key) {
	            // Fix #1994: using * with props: true generates a param named 0
	            params[key.name || 'pathMatch'] =
	                typeof m[i] === 'string' ? decode(m[i]) : m[i];
	        }
	    }
	    return true;
	}
	function resolveRecordPath(path, record) {
	    return resolvePath(path, record.parent ? record.parent.path : '/', true);
	}

	/**
	 * Re-creation of the defineComponent function to avoid having to require vue in the resulting package
	 *
	 * overload 3: object format with object props declaration
	 *
	 * see `ExtractPropTypes` in './componentProps.ts'
	 */
	function defineComponent(options) {
	    return options;
	}

	// work around weird flow bug
	var toTypes = [String, Object];
	var eventTypes = [String, Array];
	var noop = function () { };
	var warnedCustomSlot;
	var warnedTagProp;
	var warnedEventProp;
	/**
	 * Component to render a link that triggers a navigation on click.
	 */
	var RouterLink = defineComponent({
	    name: 'RouterLink',
	    props: {
	        to: {
	            type: toTypes,
	            required: true,
	        },
	        tag: {
	            type: String,
	            default: 'a',
	        },
	        custom: Boolean,
	        exact: Boolean,
	        exactPath: Boolean,
	        append: Boolean,
	        replace: Boolean,
	        // eslint-disable-next-line vue/require-default-prop
	        activeClass: String,
	        // eslint-disable-next-line vue/require-default-prop
	        exactActiveClass: String,
	        ariaCurrentValue: {
	            type: String,
	            default: 'page',
	        },
	        event: {
	            type: eventTypes,
	            default: 'click',
	        },
	    },
	    render: function render(h) {
	        var this$1$1 = this;

	        var router = this.$router;
	        var current = this.$route;
	        var ref = router.resolve(this.to, current, this.append);
	        var location = ref.location;
	        var route = ref.route;
	        var href = ref.href;
	        var classes = {};
	        var globalActiveClass = router.options.linkActiveClass;
	        var globalExactActiveClass = router.options.linkExactActiveClass;
	        // Support global empty active class
	        var activeClassFallback = globalActiveClass == null ? 'router-link-active' : globalActiveClass;
	        var exactActiveClassFallback = globalExactActiveClass == null
	            ? 'router-link-exact-active'
	            : globalExactActiveClass;
	        var activeClass = this.activeClass == null ? activeClassFallback : this.activeClass;
	        var exactActiveClass = this.exactActiveClass == null
	            ? exactActiveClassFallback
	            : this.exactActiveClass;
	        var compareTarget = route.redirectedFrom
	            ? createRoute(null, normalizeLocation(route.redirectedFrom), null, router)
	            : route;
	        classes[exactActiveClass] = isSameRoute(current, compareTarget, this.exactPath);
	        classes[activeClass] =
	            this.exact || this.exactPath
	                ? classes[exactActiveClass]
	                : isIncludedRoute(current, compareTarget);
	        var ariaCurrentValue = classes[exactActiveClass]
	            ? this.ariaCurrentValue
	            : null;
	        var handler = function (e) {
	            if (guardEvent(e)) {
	                if (this$1$1.replace) {
	                    router.replace(location, noop);
	                }
	                else {
	                    router.push(location, noop);
	                }
	            }
	        };
	        var on = {
	            click: guardEvent,
	        };
	        if (Array.isArray(this.event)) {
	            this.event.forEach(function (e) {
	                on[e] = handler;
	            });
	        }
	        else if (this.event) {
	            on[this.event] = handler;
	        }
	        var data = { class: classes };
	        var scopedSlot = !this.$scopedSlots.$hasNormal &&
	            this.$scopedSlots.default &&
	            this.$scopedSlots.default({
	                href: href,
	                route: route,
	                navigate: handler,
	                isActive: classes[activeClass],
	                isExactActive: classes[exactActiveClass],
	            });
	        if (scopedSlot) {
	            // @ts-ignore
	            if (!this.custom) {
	                !warnedCustomSlot &&
	                    warn(false, 'In Vue Router 4, the v-slot API will by default wrap its content with an <a> element. Use the custom prop to remove this warning:\n<router-link v-slot="{ navigate, href }" custom></router-link>\n');
	                warnedCustomSlot = true;
	            }
	            if (scopedSlot.length === 1) {
	                return scopedSlot[0];
	            }
	            else if (scopedSlot.length > 1 || !scopedSlot.length) {
	                // @ts-ignore
	                {
	                    warn(false, ("<router-link> with to=\"" + (this.to) + "\" is trying to use a scoped slot but it didn't provide exactly one child. Wrapping the content with a span element."));
	                }
	                return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot);
	            }
	        }
	        // @ts-ignore
	        {
	            if (this.$options.propsData) {
	                if ('tag' in this.$options.propsData && !warnedTagProp) {
	                    warn(false, "<router-link>'s tag prop is deprecated and has been removed in Vue Router 4. Use the v-slot API to remove this warning: https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link.");
	                    warnedTagProp = true;
	                }
	                if ('event' in this.$options.propsData && !warnedEventProp) {
	                    warn(false, "<router-link>'s event prop is deprecated and has been removed in Vue Router 4. Use the v-slot API to remove this warning: https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link.");
	                    warnedEventProp = true;
	                }
	            }
	        }
	        if (this.tag === 'a') {
	            data.on = on;
	            data.attrs = { href: href, 'aria-current': ariaCurrentValue };
	        }
	        else {
	            // find the first <a> child and apply listener and href
	            var a = findAnchor(this.$slots.default);
	            if (a) {
	                // in case the <a> is a static node
	                a.isStatic = false;
	                var aData = (a.data = extend({}, a.data));
	                aData.on = aData.on || {};
	                // transform existing events in both objects into arrays so we can push later
	                for (var event in aData.on) {
	                    var handler$1 = aData.on[event];
	                    if (event in on) {
	                        aData.on[event] = Array.isArray(handler$1) ? handler$1 : [handler$1];
	                    }
	                }
	                // append new listeners for router-link
	                for (var event$1 in on) {
	                    var eventType = event$1;
	                    if (eventType in aData.on) {
	                        // on[event] is always a function
	                        var onValue = aData.on[eventType];
	                        if (Array.isArray(onValue)) {
	                            onValue.push(on[eventType]);
	                        }
	                        else {
	                            aData.on[eventType] = [onValue, on[eventType]];
	                        }
	                    }
	                    else {
	                        aData.on[eventType] = handler;
	                    }
	                }
	                var aAttrs = (a.data.attrs = extend({}, a.data.attrs));
	                aAttrs.href = href;
	                aAttrs['aria-current'] = ariaCurrentValue;
	            }
	            else {
	                // doesn't have <a> child, apply listener to self
	                data.on = on;
	            }
	        }
	        return h(this.tag, data, this.$slots.default);
	    },
	});
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
	function findAnchor(children) {
	    if (children) {
	        var child;
	        for (var i = 0; i < children.length; i++) {
	            child = children[i];
	            if (child.tag === 'a') {
	                return child;
	            }
	            if (child.children && (child = findAnchor(child.children))) {
	                return child;
	            }
	        }
	    }
	}

	/**
	 * Component to display the current route the user is at.
	 */
	var RouterView = defineComponent({
	    name: 'RouterView',
	    functional: true,
	    props: {
	        name: {
	            type: String,
	            default: 'default',
	        },
	    },
	    render: function render(_, ref) {
	        var props = ref.props;
	        var children = ref.children;
	        var _parent = ref.parent;
	        var _data = ref.data;

	        // used by devtools to display a router-view badge
	        var data = _data;
	        data.routerView = true;
	        var parent = _parent;
	        // directly use parent context's createElement() function
	        // so that components rendered by router-view can resolve named slots
	        var h = parent.$createElement;
	        var name = props.name;
	        var route = parent.$route;
	        var cache = parent._routerViewCache || (parent._routerViewCache = {});
	        // determine current view depth, also check to see if the tree
	        // has been toggled inactive but kept-alive.
	        var depth = 0;
	        var inactive = false;
	        while (parent && parent._routerRoot !== parent) {
	            var vnodeData = parent.$vnode
	                ? parent.$vnode.data
	                : {};
	            if (vnodeData) {
	                if (vnodeData.routerView) {
	                    depth++;
	                }
	                if (vnodeData.keepAlive && parent._directInactive && parent._inactive) {
	                    inactive = true;
	                }
	            }
	            parent = parent.$parent;
	        }
	        data.routerViewDepth = depth;
	        // render previous view if the tree is inactive and kept-alive
	        if (inactive) {
	            var cachedData = cache[name];
	            var cachedComponent = cachedData && cachedData.component;
	            if (cachedComponent) {
	                // #2301
	                // pass props
	                if (cachedData.configProps) {
	                    fillPropsinData(cachedComponent, data, cachedData.route, cachedData.configProps);
	                }
	                return h(cachedComponent, data, children);
	            }
	            else {
	                // render previous empty view
	                return h();
	            }
	        }
	        var matched = route.matched[depth];
	        var component = matched && matched.components[name];
	        // render empty node if no matched route or no config component
	        if (!matched || !component) {
	            cache[name] = null;
	            return h();
	        }
	        // cache component
	        cache[name] = { component: component };
	        // attach instance registration hook
	        // this will be called in the instance's injected lifecycle hooks
	        data.registerRouteInstance = function (vm, val) {
	            // val could be undefined for unregistration
	            var current = matched.instances[name];
	            if ((val && current !== vm) || (!val && current === vm)) {
	                matched.instances[name] = val;
	            }
	        };
	        (data.hook || (data.hook = {})).prepatch = function (_, vnode) {
	            var instance = vnode.componentInstance;
	            if (instance) {
	                matched.instances[name] = instance;
	            }
	        };
	        // register instance in init hook
	        // in case kept-alive component be actived when routes changed
	        data.hook.init = function (vnode) {
	            if (vnode.data.keepAlive &&
	                vnode.componentInstance &&
	                vnode.componentInstance !== matched.instances[name]) {
	                matched.instances[name] = vnode.componentInstance;
	            }
	            // if the route transition has already been confirmed then we weren't
	            // able to call the cbs during confirmation as the component was not
	            // registered yet, so we call it here.
	            handleRouteEntered(route);
	        };
	        var configProps = matched.props && matched.props[name];
	        // save route and configProps in cache
	        if (configProps) {
	            extend(cache[name], {
	                route: route,
	                configProps: configProps,
	            });
	            fillPropsinData(component, data, route, configProps);
	        }
	        return h(component, data, children);
	    },
	});
	function fillPropsinData(component, data, route, configProps) {
	    // resolve props
	    var propsToPass = (data.props = resolveProps(route, configProps));
	    if (propsToPass) {
	        // clone to prevent mutation
	        propsToPass = data.props = extend({}, propsToPass);
	        // pass non-declared props as attrs
	        var attrs = (data.attrs = data.attrs || {});
	        for (var key in propsToPass) {
	            if (!('props' in component) || !(key in component.props)) {
	                attrs[key] = propsToPass[key];
	                delete propsToPass[key];
	            }
	        }
	    }
	}
	function resolveProps(route, config) {
	    switch (typeof config) {
	        case 'undefined':
	            return;
	        case 'object':
	            return config;
	        case 'function':
	            return config(route);
	        case 'boolean':
	            return config ? route.params : undefined;
	        default:
	            // @ts-ignore
	            {
	                warn(false, "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
	                    "expecting an object, function or boolean.");
	            }
	    }
	}

	var _Vue; // Vue & VueConstructor
	var install = function (Vue) {
	    if (install.installed && _Vue === Vue)
	        { return; }
	    install.installed = true;
	    _Vue = Vue;
	    var isDef = function (v) { return v !== undefined; };
	    var registerInstance = function (vm, callVal) {
	        var node = vm.$options._parentVnode;
	        if (node && node.data && node.data.registerRouteInstance) {
	            node.data.registerRouteInstance(vm, callVal);
	        }
	        // if (
	        //   isDef(i) &&
	        //   isDef((i = i.data)) &&
	        //   isDef((i = i.registerRouteInstance))
	        // ) {
	        // }
	    };
	    Vue.mixin({
	        beforeCreate: function beforeCreate() {
	            var routerThis = this;
	            if (isDef(this.$options.router)) {
	                routerThis._routerRoot = this;
	                routerThis._routerRoot = this;
	                routerThis._router = this.$options.router;
	                routerThis._router.init(this);
	                Vue.util.defineReactive(this, '_route', routerThis._router.history.current);
	            }
	            else {
	                routerThis._routerRoot =
	                    (this.$parent && this.$parent._routerRoot) ||
	                        this;
	            }
	            registerInstance(this, this);
	        },
	        destroyed: function destroyed() {
	            registerInstance(this);
	        },
	    });
	    Object.defineProperty(Vue.prototype, '$router', {
	        get: function get() {
	            return this._routerRoot._router;
	        },
	    });
	    Object.defineProperty(Vue.prototype, '$route', {
	        get: function get() {
	            return this._routerRoot._route;
	        },
	    });
	    Vue.component('RouterView', RouterView);
	    Vue.component('RouterLink', RouterLink);
	    var strats = Vue.config.optionMergeStrategies;
	    // use the same hook merging strategy for route hooks
	    strats.beforeRouteEnter =
	        strats.beforeRouteLeave =
	            strats.beforeRouteUpdate =
	                strats.created;
	};

	var inBrowser = typeof window !== 'undefined';

	/**
	 * Enumeration with all possible types for navigation failures.
	 *
	 * Can be passed to {@link isNavigationFailure} to check for specific failures.
	 */
	var NavigationFailureType;
	(function (NavigationFailureType) {
	    /**
	     * @internal
	     */
	    NavigationFailureType[NavigationFailureType["redirected"] = 2] = "redirected";
	    /**
	     * An aborted navigation is a navigation that failed because a navigation guard returned `false` or called
	     * `next(false)`
	     */
	    NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
	    /**
	     * A cancelled navigation is a navigation that failed because a more recent navigation finished started (not
	     * necessarily finished).
	     */
	    NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
	    /**
	     * A duplicated navigation is a navigation that failed because it was initiated while already being at the exact same
	     * location.
	     */
	    NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
	})(NavigationFailureType || (NavigationFailureType = {}));
	function createNavigationRedirectedError(from, to) {
	    return createRouterError(from, to, NavigationFailureType.redirected, ("Redirected when going from \"" + (from.fullPath) + "\" to \"" + (stringifyRoute(to)) + "\" via a navigation guard."));
	}
	function createNavigationDuplicatedError(from, to) {
	    var error = createRouterError(from, to, NavigationFailureType.duplicated, ("Avoided redundant navigation to current location: \"" + (from.fullPath) + "\"."));
	    // backwards compatible with the first introduction of Errors
	    error.name = 'NavigationDuplicated';
	    return error;
	}
	function createNavigationCancelledError(from, to) {
	    return createRouterError(from, to, NavigationFailureType.cancelled, ("Navigation cancelled from \"" + (from.fullPath) + "\" to \"" + (to.fullPath) + "\" with a new navigation."));
	}
	function createNavigationAbortedError(from, to) {
	    return createRouterError(from, to, NavigationFailureType.aborted, ("Navigation aborted from \"" + (from.fullPath) + "\" to \"" + (to.fullPath) + "\" via a navigation guard."));
	}
	function createRouterError(from, to, type, message) {
	    var error = new Error(message);
	    error._isRouter = true;
	    error.from = from;
	    error.to = to;
	    error.type = type;
	    return error;
	}
	var propertiesToLog = ['params', 'query', 'hash'];
	function stringifyRoute(to) {
	    if (typeof to === 'string')
	        { return to; }
	    if ('path' in to)
	        { return to.path; }
	    var location = {};
	    propertiesToLog.forEach(function (key) {
	        if (key in to)
	            { location[key] = to[key]; }
	    });
	    return JSON.stringify(location, null, 2);
	}
	function isError(err) {
	    return Object.prototype.toString.call(err).indexOf('Error') > -1;
	}
	/**
	 * Check if an object is a {@link NavigationFailure}.
	 */
	function isNavigationFailure(err, errorType) {
	    return (isError(err) &&
	        '_isRouter' in err &&
	        (errorType == null || ('type' in err && err.type === errorType)));
	}

	// use User Timing api (if present) for more accurate key precision
	var Time = inBrowser && window.performance && window.performance.now
	    ? window.performance
	    : Date;
	function genStateKey() {
	    return Time.now().toFixed(3);
	}
	var stateKeyKey = '_vue_router_key';
	var _key = genStateKey();
	function getStateKey() {
	    return _key;
	}
	function setStateKey(key) {
	    return (_key = key);
	}

	/* @flow */
	var positionStore = Object.create(null);
	function setupScroll() {
	    // Prevent browser scroll behavior on History popstate
	    if ('scrollRestoration' in window.history) {
	        window.history.scrollRestoration = 'manual';
	    }
	    // Fix for #1585 for Firefox
	    // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
	    // Fix for #2774 Support for apps loaded from Windows file shares not mapped to network drives: replaced location.origin with
	    // window.location.protocol + '//' + window.location.host
	    // location.host contains the port and location.hostname doesn't
	    var protocolAndPath = window.location.protocol + '//' + window.location.host;
	    var absolutePath = window.location.href.replace(protocolAndPath, '');
	    // preserve existing history state as it could be overriden by the user
	    var stateCopy = extend({}, window.history.state);
	    stateCopy[stateKeyKey] = getStateKey();
	    window.history.replaceState(stateCopy, '', absolutePath);
	    window.addEventListener('popstate', handlePopState);
	    return function () {
	        window.removeEventListener('popstate', handlePopState);
	    };
	}
	function handleScroll(router, to, from, isPop) {
	    if (!router.app) {
	        return;
	    }
	    var behavior = router.options.scrollBehavior;
	    if (!behavior) {
	        return;
	    }
	    // @ts-ignore
	    {
	        assert(typeof behavior === 'function', "scrollBehavior must be a function");
	    }
	    // wait until re-render finishes before scrolling
	    router.app.$nextTick(function () {
	        var position = getScrollPosition();
	        var shouldScroll = behavior.call(router, to, from, isPop ? position : undefined);
	        if (!shouldScroll) {
	            return;
	        }
	        if (isPromiseLike(shouldScroll)) {
	            shouldScroll
	                .then(function (shouldScroll) {
	                scrollToPosition(shouldScroll, position);
	            })
	                .catch(function (err) {
	                // @ts-ignore
	                {
	                    assert(false, err.toString());
	                }
	            });
	        }
	        else {
	            scrollToPosition(shouldScroll, position);
	        }
	    });
	}
	function saveScrollPosition() {
	    var key = getStateKey();
	    if (key) {
	        positionStore[key] = {
	            x: window.pageXOffset,
	            y: window.pageYOffset,
	        };
	    }
	}
	function handlePopState(e) {
	    saveScrollPosition();
	    if (e.state && e.state[stateKeyKey]) {
	        setStateKey(e.state[stateKeyKey]);
	    }
	}
	function getScrollPosition() {
	    var key = getStateKey();
	    if (key) {
	        return positionStore[key];
	    }
	}
	function getElementPosition(el, offset) {
	    var docEl = document.documentElement;
	    var docRect = docEl.getBoundingClientRect();
	    var elRect = el.getBoundingClientRect();
	    return {
	        x: elRect.left - docRect.left - offset.x,
	        y: elRect.top - docRect.top - offset.y,
	    };
	}
	function isValidPosition(obj) {
	    return isNumber(obj.x) || isNumber(obj.y);
	}
	function normalizePosition(obj) {
	    return {
	        x: isNumber(obj.x) ? obj.x : window.pageXOffset,
	        y: isNumber(obj.y) ? obj.y : window.pageYOffset,
	    };
	}
	function normalizeOffset(obj) {
	    return {
	        x: isNumber(obj.x) ? obj.x : 0,
	        y: isNumber(obj.y) ? obj.y : 0,
	    };
	}
	function isNumber(v) {
	    return typeof v === 'number';
	}
	var hashStartsWithNumberRE = /^#\d/;
	function scrollToPosition(shouldScroll, position) {
	    var isObject = typeof shouldScroll === 'object';
	    var behavior;
	    if (isObject &&
	        'selector' in shouldScroll &&
	        typeof shouldScroll.selector === 'string') {
	        behavior = shouldScroll.behavior;
	        // getElementById would still fail if the selector contains a more complicated query like #main[data-attr]
	        // but at the same time, it doesn't make much sense to select an element with an id and an extra selector
	        var el = hashStartsWithNumberRE.test(shouldScroll.selector) // $flow-disable-line
	            ? document.getElementById(shouldScroll.selector.slice(1)) // $flow-disable-line
	            : document.querySelector(shouldScroll.selector);
	        if (el) {
	            var offset = normalizeOffset(shouldScroll.offset && typeof shouldScroll.offset === 'object'
	                ? shouldScroll.offset
	                : {});
	            position = getElementPosition(el, offset);
	        }
	        else if (isValidPosition(shouldScroll)) {
	            position = normalizePosition(shouldScroll);
	        }
	    }
	    else if (isObject && isValidPosition(shouldScroll)) {
	        position = normalizePosition(shouldScroll);
	    }
	    if (position) {
	        if ('scrollBehavior' in document.documentElement.style) {
	            window.scrollTo({
	                left: position.x,
	                top: position.y,
	                behavior: behavior,
	            });
	        }
	        else {
	            window.scrollTo(position.x, position.y);
	        }
	    }
	}

	var supportsPushState = inBrowser &&
	    (function () {
	        var ua = window.navigator.userAgent;
	        if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
	            ua.indexOf('Mobile Safari') !== -1 &&
	            ua.indexOf('Chrome') === -1 &&
	            ua.indexOf('Windows Phone') === -1) {
	            return false;
	        }
	        return window.history && typeof window.history.pushState === 'function';
	    })();
	function pushState(url, replace, state) {
	    saveScrollPosition();
	    // try...catch the pushState call to get around Safari
	    // DOM Exception 18 where it limits to 100 pushState calls
	    var history = window.history;
	    try {
	        var stateCopy = extend({}, state || (replace ? history.state : {}));
	        if (replace) {
	            // preserve existing history state as it could be overriden by the user
	            // If passed in, use the new state entirely rather than the old.
	            stateCopy[stateKeyKey] = getStateKey();
	            history.replaceState(stateCopy, '', url);
	        }
	        else {
	            stateCopy[stateKeyKey] = setStateKey(genStateKey());
	            history.pushState(stateCopy, '', url);
	        }
	    }
	    catch (e) {
	        if (url) {
	            window.location[replace ? 'replace' : 'assign'](url);
	        }
	    }
	}
	function replaceState(url, state) {
	    pushState(url, true, state);
	}
	function stripStateKey(state) {
	    if (!state || !state[stateKeyKey]) {
	        return;
	    }
	    var copy = extend({}, state);
	    delete copy[stateKeyKey];
	    return copy;
	}

	function runQueue(queue, iterator, onComplete) {
	    var step = function (index) {
	        if (index >= queue.length) {
	            onComplete();
	        }
	        else {
	            if (queue[index]) {
	                iterator(queue[index], function () {
	                    step(index + 1);
	                });
	            }
	            else {
	                step(index + 1);
	            }
	        }
	    };
	    step(0);
	}

	function resolveAsyncComponents(matched) {
	    return function (to, from, next) {
	        var hasAsync = false;
	        var pending = 0;
	        var error = null;
	        flatMapComponents(matched, function (def, _, match, key) {
	            // if it's a function and doesn't have cid attached,
	            // assume it's an async component resolve function.
	            // we are not using Vue's default async resolving mechanism because
	            // we want to halt the navigation until the incoming component has been
	            // resolved.
	            if (typeof def === 'function' && def.cid === undefined) {
	                hasAsync = true;
	                pending++;
	                var resolve = once(function (resolvedDef) {
	                    if (isESModule(resolvedDef)) {
	                        resolvedDef = resolvedDef.default;
	                    }
	                    def.resolved =
	                        typeof resolvedDef === 'function'
	                            ? resolvedDef
	                            : _Vue.extend(resolvedDef);
	                    match.components[key] = resolvedDef;
	                    pending--;
	                    if (pending <= 0) {
	                        next();
	                    }
	                });
	                var reject = once(function (reason) {
	                    var msg = "Failed to resolve async component " + key + ": " + reason;
	                    // @ts-ignore
	                    warn(false, msg);
	                    if (!error) {
	                        error = isError(reason) ? reason : new Error(msg);
	                        next(error);
	                    }
	                });
	                var res;
	                try {
	                    res = def(resolve, reject);
	                }
	                catch (e) {
	                    reject(e);
	                }
	                if (res) {
	                    if (typeof res.then === 'function') {
	                        res.then(resolve, reject);
	                    }
	                    else {
	                        // new syntax in Vue 2.3
	                        var comp = res.component;
	                        if (comp && typeof comp.then === 'function') {
	                            comp.then(resolve, reject);
	                        }
	                    }
	                }
	            }
	        });
	        if (!hasAsync)
	            { next(); }
	    };
	}
	function flatMapComponents(matched, fn) {
	    return flatten(matched.map(function (m) {
	        return Object.keys(m.components).map(function (key) {
	            return fn(m.components[key], m.instances[key], m, key);
	        });
	    }));
	}
	function flatten(arr) {
	    return Array.prototype.concat.apply([], arr);
	}
	var hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	function isESModule(obj) {
	    return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module');
	}
	// in Webpack 2, require.ensure now also returns a Promise
	// so the resolve/reject functions may get called an extra time
	// if the user uses an arrow function shorthand that happens to
	// return that Promise.
	function once(fn) {
	    var called = false;
	    return function () {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        if (called)
	            { return; }
	        called = true;
	        return fn.apply(this, args);
	    };
	}

	var History = function History(router, base) {
	    this.router = router;
	    this.base = normalizeBase(base);
	    // start with a route object that stands for "nowhere"
	    this.current = START;
	    this.pending = null;
	    this.ready = false;
	    this.readyCbs = [];
	    this.readyErrorCbs = [];
	    this.errorCbs = [];
	    this.listeners = [];
	};
	History.prototype.listen = function listen (cb) {
	    this.cb = cb;
	};
	History.prototype.onReady = function onReady (cb, errorCb) {
	    if (this.ready) {
	        cb();
	    }
	    else {
	        this.readyCbs.push(cb);
	        if (errorCb) {
	            this.readyErrorCbs.push(errorCb);
	        }
	    }
	};
	History.prototype.onError = function onError (errorCb) {
	    this.errorCbs.push(errorCb);
	};
	History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
	        var this$1$1 = this;

	    var route;
	    // catch redirect option https://github.com/vuejs/vue-router/issues/3201
	    try {
	        route = this.router.match(location, this.current);
	    }
	    catch (e) {
	        this.errorCbs.forEach(function (cb) {
	            cb(e);
	        });
	        // Exception should still be thrown
	        throw e;
	    }
	    var prev = this.current;
	    this.confirmTransition(route, function () {
	        this$1$1.updateRoute(route);
	        onComplete && onComplete(route);
	        this$1$1.ensureURL();
	        this$1$1.router.afterHooks.forEach(function (hook) {
	            hook && hook(route, prev);
	        });
	        // fire ready cbs once
	        if (!this$1$1.ready) {
	            this$1$1.ready = true;
	            this$1$1.readyCbs.forEach(function (cb) {
	                cb(route);
	            });
	        }
	    }, function (err) {
	        if (onAbort) {
	            onAbort(err);
	        }
	        if (err && !this$1$1.ready) {
	            // Initial redirection should not mark the history as ready yet
	            // because it's triggered by the redirection instead
	            // https://github.com/vuejs/vue-router/issues/3225
	            // https://github.com/vuejs/vue-router/issues/3331
	            if (!isNavigationFailure(err, NavigationFailureType.redirected) ||
	                prev !== START) {
	                this$1$1.ready = true;
	                this$1$1.readyErrorCbs.forEach(function (cb) {
	                    cb(err);
	                });
	            }
	        }
	    });
	};
	History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
	        var this$1$1 = this;

	    var current = this.current;
	    this.pending = route;
	    var abort = function (err) {
	        // changed after adding errors with
	        // https://github.com/vuejs/vue-router/pull/3047 before that change,
	        // redirect and aborted navigation would produce an err == null
	        if (!isNavigationFailure(err) && isError(err)) {
	            if (this$1$1.errorCbs.length) {
	                this$1$1.errorCbs.forEach(function (cb) {
	                    cb(err);
	                });
	            }
	            else {
	                // @ts-ignore
	                {
	                    warn(false, 'uncaught error during route navigation:');
	                }
	                console.error(err);
	            }
	        }
	        onAbort && onAbort(err);
	    };
	    var lastRouteIndex = route.matched.length - 1;
	    var lastCurrentIndex = current.matched.length - 1;
	    if (isSameRoute(route, current) &&
	        // in the case the route map has been dynamically appended to
	        lastRouteIndex === lastCurrentIndex &&
	        route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]) {
	        this.ensureURL();
	        if (route.hash) {
	            handleScroll(this.router, current, route, false);
	        }
	        return abort(createNavigationDuplicatedError(current, route));
	    }
	    var ref = resolveQueue(this.current.matched, route.matched);
	        var updated = ref.updated;
	        var deactivated = ref.deactivated;
	        var activated = ref.activated;
	    var queue = [].concat(
	    // in-component leave guards
	    extractLeaveGuards(deactivated), 
	    // global before hooks
	    this.router.beforeHooks, 
	    // in-component update hooks
	    extractUpdateHooks(updated), 
	    // in-config enter guards
	    activated.map(function (m) { return m.beforeEnter; }), 
	    // async components
	    resolveAsyncComponents(activated));
	    var iterator = function (hook, next) {
	        if (this$1$1.pending !== route) {
	            return abort(createNavigationCancelledError(current, route));
	        }
	        try {
	            hook(route, current, function (to) {
	                if (to === false) {
	                    // next(false) -> abort navigation, ensure current URL
	                    this$1$1.ensureURL(true);
	                    abort(createNavigationAbortedError(current, route));
	                }
	                else if (isError(to)) {
	                    this$1$1.ensureURL(true);
	                    abort(to);
	                }
	                else if (typeof to === 'string' ||
	                    (typeof to === 'object' &&
	                        (typeof to.path === 'string' || typeof to.name === 'string'))) {
	                    // next('/') or next({ path: '/' }) -> redirect
	                    abort(createNavigationRedirectedError(current, route));
	                    if (typeof to === 'object' && to.replace) {
	                        this$1$1.replace(to);
	                    }
	                    else {
	                        this$1$1.push(to);
	                    }
	                }
	                else {
	                    // confirm transition and pass on the value
	                    next(to);
	                }
	            });
	        }
	        catch (e) {
	            abort(e);
	        }
	    };
	    runQueue(queue, iterator, function () {
	        // wait until async components are resolved before
	        // extracting in-component enter guards
	        var enterGuards = extractEnterGuards(activated);
	        var queue = enterGuards.concat(this$1$1.router.resolveHooks);
	        runQueue(queue, iterator, function () {
	            if (this$1$1.pending !== route) {
	                return abort(createNavigationCancelledError(current, route));
	            }
	            this$1$1.pending = null;
	            onComplete(route);
	            if (this$1$1.router.app) {
	                this$1$1.router.app.$nextTick(function () {
	                    handleRouteEntered(route);
	                });
	            }
	        });
	    });
	};
	History.prototype.updateRoute = function updateRoute (route) {
	    this.current = route;
	    this.cb && this.cb(route);
	};
	History.prototype.setupListeners = function setupListeners () {
	    // Default implementation is empty
	};
	History.prototype.teardown = function teardown () {
	    // clean up event listeners
	    // https://github.com/vuejs/vue-router/issues/2341
	    this.listeners.forEach(function (cleanupListener) {
	        cleanupListener();
	    });
	    this.listeners = [];
	    // reset current history route
	    // https://github.com/vuejs/vue-router/issues/3294
	    this.current = START;
	    this.pending = null;
	};
	function normalizeBase(base) {
	    if (!base) {
	        if (inBrowser) {
	            // respect <base> tag
	            var baseEl = document.querySelector('base');
	            base = (baseEl && baseEl.getAttribute('href')) || '/';
	            // strip full URL origin
	            base = base.replace(/^https?:\/\/[^\/]+/, '');
	        }
	        else {
	            base = '/';
	        }
	    }
	    // make sure there's the starting slash
	    if (base.charAt(0) !== '/') {
	        base = '/' + base;
	    }
	    // remove trailing slash
	    return base.replace(/\/$/, '');
	}
	function resolveQueue(current, next) {
	    var i;
	    var max = Math.max(current.length, next.length);
	    for (i = 0; i < max; i++) {
	        if (current[i] !== next[i]) {
	            break;
	        }
	    }
	    return {
	        updated: next.slice(0, i),
	        activated: next.slice(i),
	        deactivated: current.slice(i),
	    };
	}
	function extractGuards(records, name, bind, reverse) {
	    var guards = flatMapComponents(records, function (def, instance, match, key) {
	        var guard = extractGuard(def, name);
	        if (guard) {
	            return Array.isArray(guard)
	                ? guard.map(function (guard) { return bind(guard, instance, match, key); })
	                : bind(guard, instance, match, key);
	        }
	    });
	    return flatten(reverse ? guards.reverse() : guards);
	}
	function extractGuard(def, key) {
	    if (typeof def !== 'function') {
	        // extend now so that global mixins are applied.
	        def = _Vue.extend(def);
	    }
	    return def.options[key];
	}
	function extractLeaveGuards(deactivated) {
	    return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true);
	}
	function extractUpdateHooks(updated) {
	    return extractGuards(updated, 'beforeRouteUpdate', bindGuard);
	}
	function bindGuard(guard, instance) {
	    if (instance) {
	        return function boundRouteGuard() {
	            return guard.apply(instance, arguments);
	        };
	    }
	}
	function extractEnterGuards(activated) {
	    return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
	        return bindEnterGuard(guard, match, key);
	    });
	}
	function bindEnterGuard(guard, match, key) {
	    return function routeEnterGuard(to, from, next) {
	        return guard(to, from, function (cb) {
	            if (typeof cb === 'function') {
	                if (!match.enteredCbs[key]) {
	                    match.enteredCbs[key] = [];
	                }
	                match.enteredCbs[key].push(cb);
	            }
	            next(cb);
	        });
	    };
	}

	var AbstractHistory = /*@__PURE__*/(function (History) {
	    function AbstractHistory(router, base) {
	        History.call(this, router, base);
	        this.stack = [];
	        this.index = -1;
	    }

	    if ( History ) AbstractHistory.__proto__ = History;
	    AbstractHistory.prototype = Object.create( History && History.prototype );
	    AbstractHistory.prototype.constructor = AbstractHistory;
	    AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
	        var this$1$1 = this;

	        this.transitionTo(location, function (route) {
	            this$1$1.stack = this$1$1.stack.slice(0, this$1$1.index + 1).concat(route);
	            this$1$1.index++;
	            onComplete && onComplete(route);
	        }, onAbort);
	    };
	    AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
	        var this$1$1 = this;

	        this.transitionTo(location, function (route) {
	            this$1$1.stack = this$1$1.stack.slice(0, this$1$1.index).concat(route);
	            onComplete && onComplete(route);
	        }, onAbort);
	    };
	    AbstractHistory.prototype.go = function go (n) {
	        var this$1$1 = this;

	        var targetIndex = this.index + n;
	        if (targetIndex < 0 || targetIndex >= this.stack.length) {
	            return;
	        }
	        var route = this.stack[targetIndex];
	        this.confirmTransition(route, function () {
	            var prev = this$1$1.current;
	            this$1$1.index = targetIndex;
	            this$1$1.updateRoute(route);
	            this$1$1.router.afterHooks.forEach(function (hook) {
	                hook && hook(route, prev);
	            });
	        }, function (err) {
	            if (isNavigationFailure(err, NavigationFailureType.duplicated)) {
	                this$1$1.index = targetIndex;
	            }
	        });
	    };
	    AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
	        var current = this.stack[this.stack.length - 1];
	        return current ? current.fullPath : '/';
	    };
	    AbstractHistory.prototype.ensureURL = function ensureURL () {
	        // noop
	    };

	    return AbstractHistory;
	}(History));

	var HTML5History = /*@__PURE__*/(function (History) {
	    function HTML5History(router, base) {
	        History.call(this, router, base);
	        this._startLocation = getLocation(this.base);
	    }

	    if ( History ) HTML5History.__proto__ = History;
	    HTML5History.prototype = Object.create( History && History.prototype );
	    HTML5History.prototype.constructor = HTML5History;
	    HTML5History.prototype.setupListeners = function setupListeners () {
	        var this$1$1 = this;

	        if (this.listeners.length > 0) {
	            return;
	        }
	        var router = this.router;
	        var expectScroll = router.options.scrollBehavior;
	        var supportsScroll = supportsPushState && expectScroll;
	        if (supportsScroll) {
	            this.listeners.push(setupScroll());
	        }
	        var handleRoutingEvent = function () {
	            var current = this$1$1.current;
	            // Avoiding first `popstate` event dispatched in some browsers but first
	            // history route not updated since async guard at the same time.
	            var location = getLocation(this$1$1.base);
	            if (this$1$1.current === START && location === this$1$1._startLocation) {
	                return;
	            }
	            this$1$1.transitionTo({ path: location, state: stripStateKey(window.history.state) }, function (route) {
	                if (supportsScroll) {
	                    handleScroll(router, route, current, true);
	                }
	            });
	        };
	        window.addEventListener('popstate', handleRoutingEvent);
	        this.listeners.push(function () {
	            window.removeEventListener('popstate', handleRoutingEvent);
	        });
	    };
	    HTML5History.prototype.go = function go (n) {
	        window.history.go(n);
	    };
	    HTML5History.prototype.push = function push (location, onComplete, onAbort) {
	        var this$1$1 = this;

	        var ref = this;
	        var fromRoute = ref.current;
	        this.transitionTo(location, function (route) {
	            pushState(cleanPath(this$1$1.base + route.fullPath), false, route.state);
	            handleScroll(this$1$1.router, route, fromRoute, false);
	            onComplete && onComplete(route);
	        }, onAbort);
	    };
	    HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
	        var this$1$1 = this;

	        var ref = this;
	        var fromRoute = ref.current;
	        this.transitionTo(location, function (route) {
	            replaceState(cleanPath(this$1$1.base + route.fullPath), route.state);
	            handleScroll(this$1$1.router, route, fromRoute, false);
	            onComplete && onComplete(route);
	        }, onAbort);
	    };
	    HTML5History.prototype.ensureURL = function ensureURL (push) {
	        if (getLocation(this.base) !== this.current.fullPath) {
	            var current = cleanPath(this.base + this.current.fullPath);
	            push
	                ? pushState(current, false, this.current.state)
	                : replaceState(current, this.current.state);
	        }
	    };
	    HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
	        return getLocation(this.base);
	    };

	    return HTML5History;
	}(History));
	function getLocation(base) {
	    var path = window.location.pathname;
	    var pathLowerCase = path.toLowerCase();
	    var baseLowerCase = base.toLowerCase();
	    // base="/a" shouldn't turn path="/app" into "/a/pp"
	    // https://github.com/vuejs/vue-router/issues/3555
	    // so we ensure the trailing slash in the base
	    if (base &&
	        (pathLowerCase === baseLowerCase ||
	            pathLowerCase.indexOf(cleanPath(baseLowerCase + '/')) === 0)) {
	        path = path.slice(base.length);
	    }
	    return (path || '/') + window.location.search + window.location.hash;
	}

	var HashHistory = /*@__PURE__*/(function (History) {
	    function HashHistory(router, base, fallback) {
	        History.call(this, router, base);
	        // check history fallback deeplinking
	        if (fallback && checkFallback(this.base)) {
	            return;
	        }
	        ensureSlash();
	    }

	    if ( History ) HashHistory.__proto__ = History;
	    HashHistory.prototype = Object.create( History && History.prototype );
	    HashHistory.prototype.constructor = HashHistory;
	    // this is delayed until the app mounts
	    // to avoid the hashchange listener being fired too early
	    HashHistory.prototype.setupListeners = function setupListeners () {
	        var this$1$1 = this;

	        if (this.listeners.length > 0) {
	            return;
	        }
	        var router = this.router;
	        var expectScroll = router.options.scrollBehavior;
	        var supportsScroll = supportsPushState && expectScroll;
	        if (supportsScroll) {
	            this.listeners.push(setupScroll());
	        }
	        var handleRoutingEvent = function () {
	            var current = this$1$1.current;
	            if (!ensureSlash()) {
	                return;
	            }
	            this$1$1.transitionTo({ path: getHash(), state: stripStateKey(window.history.state) }, function (route) {
	                if (supportsScroll) {
	                    handleScroll(this$1$1.router, route, current, true);
	                }
	                if (!supportsPushState) {
	                    replaceHash(route.fullPath);
	                }
	            });
	        };
	        var eventType = supportsPushState ? 'popstate' : 'hashchange';
	        window.addEventListener(eventType, handleRoutingEvent);
	        this.listeners.push(function () {
	            window.removeEventListener(eventType, handleRoutingEvent);
	        });
	    };
	    HashHistory.prototype.push = function push (location, onComplete, onAbort) {
	        var this$1$1 = this;

	        var ref = this;
	        var fromRoute = ref.current;
	        this.transitionTo(location, function (route) {
	            pushHash(route.fullPath, route.state);
	            handleScroll(this$1$1.router, route, fromRoute, false);
	            onComplete && onComplete(route);
	        }, onAbort);
	    };
	    HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
	        var this$1$1 = this;

	        var ref = this;
	        var fromRoute = ref.current;
	        this.transitionTo(location, function (route) {
	            replaceHash(route.fullPath, route.state);
	            handleScroll(this$1$1.router, route, fromRoute, false);
	            onComplete && onComplete(route);
	        }, onAbort);
	    };
	    HashHistory.prototype.go = function go (n) {
	        window.history.go(n);
	    };
	    HashHistory.prototype.ensureURL = function ensureURL (push) {
	        var current = this.current.fullPath;
	        if (getHash() !== current) {
	            push ? pushHash(current) : replaceHash(current);
	        }
	    };
	    HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
	        return getHash();
	    };

	    return HashHistory;
	}(History));
	function checkFallback(base) {
	    var location = getLocation(base);
	    if (!/^\/#/.test(location)) {
	        window.location.replace(cleanPath(base + '/#' + location));
	        return true;
	    }
	}
	function ensureSlash() {
	    var path = getHash();
	    if (path.charAt(0) === '/') {
	        return true;
	    }
	    replaceHash('/' + path);
	    return false;
	}
	function getHash() {
	    // We can't use window.location.hash here because it's not
	    // consistent across browsers - Firefox will pre-decode it!
	    var href = window.location.href;
	    var index = href.indexOf('#');
	    // empty path
	    if (index < 0)
	        { return ''; }
	    href = href.slice(index + 1);
	    return href;
	}
	function getUrl(path) {
	    var href = window.location.href;
	    var i = href.indexOf('#');
	    var base = i >= 0 ? href.slice(0, i) : href;
	    return (base + "#" + path);
	}
	function pushHash(path, state) {
	    if (supportsPushState) {
	        pushState(getUrl(path), false, state);
	    }
	    else {
	        window.location.hash = path;
	    }
	}
	function replaceHash(path, state) {
	    if (supportsPushState) {
	        replaceState(getUrl(path), state);
	    }
	    else {
	        window.location.replace(getUrl(path));
	    }
	}

	/**
	 * Router instance.
	 */
	var VueRouter = function VueRouter(options) {
	    if ( options === void 0 ) options = {};

	    // @ts-ignore
	    {
	        warn(this instanceof VueRouter, "Router must be called with the new operator.");
	    }
	    this.app = null;
	    this.apps = [];
	    this.options = options;
	    this.beforeHooks = [];
	    this.resolveHooks = [];
	    this.afterHooks = [];
	    this.matcher = createMatcher(options.routes || [], this);
	    var mode = options.mode || 'hash';
	    this.fallback =
	        mode === 'history' && !supportsPushState && options.fallback !== false;
	    if (this.fallback) {
	        mode = 'hash';
	    }
	    if (!inBrowser) {
	        mode = 'abstract';
	    }
	    this.mode = mode;
	    switch (mode) {
	        case 'history':
	            this.history = new HTML5History(this, options.base);
	            break;
	        case 'hash':
	            this.history = new HashHistory(this, options.base, this.fallback);
	            break;
	        case 'abstract':
	            this.history = new AbstractHistory(this, options.base);
	            break;
	        default:
	            assert(false, ("invalid mode: " + mode));
	    }
	};

	var prototypeAccessors = { currentRoute: { configurable: true } };
	VueRouter.prototype.match = function match (raw, current, redirectedFrom) {
	    return this.matcher.match(raw, current, redirectedFrom);
	};
	/**
	 * Current {@link Route}
	 */
	prototypeAccessors.currentRoute.get = function () {
	    return this.history && this.history.current;
	};
	VueRouter.prototype.init = function init (app /* Vue component instance */) {
	        var this$1$1 = this;

	    // @ts-ignore
	    assert(install.installed, "not installed. Make sure to call `Vue.use(VueRouter)` " +
	            "before creating root instance.");
	    this.apps.push(app);
	    // set up app destroyed handler
	    // https://github.com/vuejs/vue-router/issues/2639
	    app.$once('hook:destroyed', function () {
	        // clean out app from this.apps array once destroyed
	        var index = this$1$1.apps.indexOf(app);
	        if (index > -1)
	            { this$1$1.apps.splice(index, 1); }
	        // ensure we still have a main app or null if no apps
	        // we do not release the router so it can be reused
	        if (this$1$1.app === app)
	            { this$1$1.app = this$1$1.apps[0] || null; }
	        if (!this$1$1.app)
	            { this$1$1.history.teardown(); }
	    });
	    // main app previously initialized
	    // return as we don't need to set up new history listener
	    if (this.app) {
	        return;
	    }
	    this.app = app;
	    var history = this.history;
	    if (history instanceof HTML5History || history instanceof HashHistory) {
	        var handleInitialScroll = function (routeOrError) {
	            var from = history.current;
	            var expectScroll = this$1$1.options.scrollBehavior;
	            var supportsScroll = supportsPushState && expectScroll;
	            if (supportsScroll && 'fullPath' in routeOrError) {
	                handleScroll(this$1$1, routeOrError, from, false);
	            }
	        };
	        var setupListeners = function (routeOrError) {
	            history.setupListeners();
	            handleInitialScroll(routeOrError);
	        };
	        history.transitionTo({
	            path: history.getCurrentLocation(),
	            state: stripStateKey(window.history.state),
	        }, setupListeners, setupListeners);
	    }
	    history.listen(function (route) {
	        this$1$1.apps.forEach(function (app) {
	            app._route = route;
	        });
	    });
	};
	/**
	 * Add a navigation guard that executes before any navigation.
	 *
	 * @param guard - navigation guard to add
	 * @returns a function that removes the registered guard
	 *
	 * @example
	 * ```js
	 * router.beforeEach((to, from, next) => {
	 *   // must call `next`
	 * })
	 * ```
	 */
	VueRouter.prototype.beforeEach = function beforeEach (fn) {
	    return registerHook(this.beforeHooks, fn);
	};
	/**
	 * Add a navigation guard that executes before navigation is about to be resolved. At this state all component have
	 * been fetched and other navigation guards have been successful.
	 *
	 * @param guard - navigation guard to add
	 * @returns a function that removes the registered guard
	 *
	 * @example
	 * ```js
	 * router.beforeResolve((to, from, next) => {
	 *   // must call `next`
	 * })
	 * ```
	 */
	VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
	    return registerHook(this.resolveHooks, fn);
	};
	/**
	 * Add a navigation hook that is executed after every navigation. Returns a function that removes the registered hook.
	 *
	 * @param hook - navigation hook to add
	 * @returns a function that removes the registered guard
	 *
	 * @example
	 * ```js
	 * router.afterEach((to, from) => {
	 *   console.log('after navigation')
	 * })
	 * ```
	 */
	VueRouter.prototype.afterEach = function afterEach (fn) {
	    return registerHook(this.afterHooks, fn);
	};
	/**
	 * This method queues a callback to be called when the router has completed the initial navigation, which means it has
	 * resolved all async enter hooks and async components that are associated with the initial route.
	 *
	 * This is useful in server-side rendering to ensure consistent output on both the server and the client.
	 * @param cb onReady callback.
	 * @param errorCb errorCb will be called when the initial route resolution runs into an error (e.g. failed to resolve
	 * an async component).
	 */
	VueRouter.prototype.onReady = function onReady (cb, errorCb) {
	    this.history.onReady(cb, errorCb);
	};
	/**
	 * Adds an error handler that is called every time a non caught error happens during navigation. This includes errors
	 * thrown synchronously and asynchronously, errors returned or passed to `next` in any navigation guard, and errors
	 * occurred when trying to resolve an async component that is required to render a route.
	 *
	 * @param handler - error handler to register
	 */
	VueRouter.prototype.onError = function onError (errorCb) {
	    this.history.onError(errorCb);
	};
	VueRouter.prototype.push = function push (location, onComplete, onAbort) {
	        var this$1$1 = this;

	    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
	        return new Promise(function (resolve, reject) {
	            this$1$1.history.push(location, resolve, reject);
	        });
	    }
	    else {
	        this.history.push(location, onComplete, onAbort);
	    }
	};
	VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
	        var this$1$1 = this;

	    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
	        return new Promise(function (resolve, reject) {
	            this$1$1.history.replace(location, resolve, reject);
	        });
	    }
	    else {
	        this.history.replace(location, onComplete, onAbort);
	    }
	};
	/**
	 * Allows you to move forward or backward through the history. Calls `history.go()`.
	 *
	 * @param delta The position in the history to which you want to move, relative to the current page
	 */
	VueRouter.prototype.go = function go (n) {
	    this.history.go(n);
	};
	/**
	 * Go back in history if possible by calling `history.back()`. Equivalent to `router.go(-1)`.
	 */
	VueRouter.prototype.back = function back () {
	    this.go(-1);
	};
	/**
	 * Go forward in history if possible by calling `history.forward()`. Equivalent to `router.go(1)`.
	 */
	VueRouter.prototype.forward = function forward () {
	    this.go(1);
	};
	VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
	    var route = to
	        ? typeof to !== 'string' && 'matched' in to
	            ? to
	            : this.resolve(to).route
	        : this.currentRoute;
	    if (!route) {
	        return [];
	    }
	    return [].concat.apply([], route.matched.map(function (m) {
	        return Object.keys(m.components).map(function (key) {
	            return m.components[key];
	        });
	    }));
	};
	/**
	 *
	 * @param to Route location
	 * @param current current is the current Route by default (most of the time you don't need to change this)
	 * @param append allows you to append the path to the `current` route (as with `router-link`)
	 */
	VueRouter.prototype.resolve = function resolve (to, current, append) {
	    current = current || this.history.current;
	    var location = normalizeLocation(to, current, append, this);
	    var route = this.match(location, current);
	    var fullPath = route.redirectedFrom || route.fullPath;
	    var base = this.history.base;
	    var href = createHref(base, fullPath, this.mode);
	    return {
	        location: location,
	        route: route,
	        href: href,
	        // for backwards compat
	        normalizedTo: location,
	        resolved: route,
	    };
	};
	/**
	 * Get the list of all the active route records.
	 */
	VueRouter.prototype.getRoutes = function getRoutes () {
	    return this.matcher.getRoutes();
	};
	VueRouter.prototype.addRoute = function addRoute (parentOrRoute, route) {
	    this.matcher.addRoute(parentOrRoute, route);
	    if (this.history.current !== START) {
	        this.history.transitionTo(this.history.getCurrentLocation());
	    }
	};
	/**
	 * @deprecated use {@link addRoute | router.addRoute()} instead
	 */
	VueRouter.prototype.addRoutes = function addRoutes (routes) {
	    // @ts-ignore
	    {
	        warn(false, 'router.addRoutes() is deprecated and has been removed in Vue Router 4. Use router.addRoute() instead.');
	    }
	    this.matcher.addRoutes(routes);
	    if (this.history.current !== START) {
	        this.history.transitionTo(this.history.getCurrentLocation());
	    }
	};

	Object.defineProperties( VueRouter.prototype, prototypeAccessors );
	/**
	 * @internal
	 */
	VueRouter.install = install;
	VueRouter.version = '3.7.1';
	VueRouter.isNavigationFailure = isNavigationFailure;
	VueRouter.NavigationFailureType = NavigationFailureType;
	/**
	 * Initial route location where the router is. Can be used in navigation guards to differentiate the initial navigation.
	 */
	VueRouter.START_LOCATION = START;
	function registerHook(list, fn) {
	    list.push(fn);
	    return function () {
	        var i = list.indexOf(fn);
	        if (i > -1)
	            { list.splice(i, 1); }
	    };
	}
	function createHref(base, fullPath, mode) {
	    var path = mode === 'hash' ? '#' + fullPath : fullPath;
	    return base ? cleanPath(base + '/' + path) : path;
	}
	if (inBrowser && window.Vue) {
	    window.Vue.use(VueRouter);
	}

	return VueRouter;

}));
