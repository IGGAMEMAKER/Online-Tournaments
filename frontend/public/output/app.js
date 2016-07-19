/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _preact = __webpack_require__(1);

	var _preactRouter = __webpack_require__(149);

	var _preactRouter2 = _interopRequireDefault(_preactRouter);

	var _Pages = __webpack_require__(150);

	var Pages = _interopRequireWildcard(_Pages);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var appElement = document.getElementById('app');


	var Routing = function Routing() {
	  return (0, _preact.h)(
	    _preactRouter2.default,
	    null,
	    (0, _preact.h)(Pages.Home, { path: '/' }),
	    (0, _preact.h)(Pages.Tournaments, { path: '/Tournaments' }),
	    (0, _preact.h)(Pages.Packs, { path: '/Packs' }),
	    (0, _preact.h)(Pages.Profile, { path: '/Profile' }),
	    (0, _preact.h)(Pages.About, { path: '/About' }),
	    (0, _preact.h)(Pages.Home, { 'default': true })
	  );
	};
	// <Pages.Tournaments path="/Tournaments" />
	// <Pages.Packs path="/Packs" />
	// <Pages.Profile path="/Profile" />
	// <Pages.Error404 default />

	(0, _preact.render)((0, _preact.h)(Routing, null), appElement.parentNode, appElement);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {!function(global, factory) {
	     true ? module.exports = factory() : 'function' == typeof define && define.amd ? define(factory) : global.preact = factory();
	}(this, function() {
	    'use strict';
	    function VNode(nodeName, attributes, children) {
	        this.nodeName = nodeName;
	        this.attributes = attributes;
	        this.children = children;
	    }
	    function extend(obj, props) {
	        for (var i in props) if (hasOwnProperty.call(props, i)) obj[i] = props[i];
	        return obj;
	    }
	    function clone(obj) {
	        var out = {};
	        for (var i in obj) out[i] = obj[i];
	        return out;
	    }
	    function memoize(fn, mem) {
	        mem = mem || {};
	        return function(k) {
	            return hasOwnProperty.call(mem, k) ? mem[k] : mem[k] = fn(k);
	        };
	    }
	    function delve(obj, key) {
	        for (var p = key.split('.'), i = 0; i < p.length && obj; i++) obj = obj[p[i]];
	        return obj;
	    }
	    function toArray(obj) {
	        var arr = [], i = obj.length;
	        for (;i--; ) arr[i] = obj[i];
	        return arr;
	    }
	    function styleObjToCss(s) {
	        var str = '';
	        for (var prop in s) {
	            var val = s[prop];
	            if (!empty(val)) {
	                if (str) str += ' ';
	                str += jsToCss(prop);
	                str += ': ';
	                str += val;
	                if ('number' == typeof val && !NON_DIMENSION_PROPS[prop]) str += 'px';
	                str += ';';
	            }
	        }
	        return str;
	    }
	    function hashToClassName(c) {
	        var str = '';
	        for (var prop in c) if (c[prop]) {
	            if (str) str += ' ';
	            str += prop;
	        }
	        return str;
	    }
	    function normalize(obj, prop, fn) {
	        var v = obj[prop];
	        if (v && !isString(v)) obj[prop] = fn(v);
	    }
	    function optionsHook(name, a, b) {
	        return hook(options, name, a, b);
	    }
	    function hook(obj, name, a, b, c) {
	        if (obj[name]) return obj[name](a, b, c); else ;
	    }
	    function deepHook(obj, type) {
	        do hook(obj, type); while (obj = obj._component);
	    }
	    function h(nodeName, attributes) {
	        var len = arguments.length, attributeChildren = attributes && attributes.children, children = void 0, arr = void 0, lastSimple = void 0;
	        if (attributeChildren) {
	            delete attributes.children;
	            if (3 > len) return h(nodeName, attributes, attributeChildren);
	        }
	        for (var i = 2; len > i; i++) {
	            var _p = arguments[i];
	            if (!falsey(_p)) {
	                if (!children) children = [];
	                if (_p.join) arr = _p; else {
	                    arr = SHARED_TEMP_ARRAY;
	                    arr[0] = _p;
	                }
	                for (var j = 0; j < arr.length; j++) {
	                    var child = arr[j], simple = !(falsey(child) || child instanceof VNode);
	                    if (simple) child = String(child);
	                    if (simple && lastSimple) children[children.length - 1] += child; else if (!falsey(child)) children.push(child);
	                    lastSimple = simple;
	                }
	            } else ;
	        }
	        var p = new VNode(nodeName, attributes || void 0, children || void 0);
	        optionsHook('vnode', p);
	        return p;
	    }
	    function createLinkedState(component, key, eventPath) {
	        var path = key.split('.'), p0 = path[0], len = path.length;
	        return function(e) {
	            var _component$setState;
	            var t = this, s = component.state, obj = s, v = void 0, i = void 0;
	            if (isString(eventPath)) {
	                v = delve(e, eventPath);
	                if (empty(v) && (t = t._component)) v = delve(t, eventPath);
	            } else v = (t.nodeName + t.type).match(/^input(check|rad)/i) ? t.checked : t.value;
	            if (isFunction(v)) v = v.call(t);
	            if (len > 1) {
	                for (i = 0; len - 1 > i; i++) obj = obj[path[i]] || (obj[path[i]] = {});
	                obj[path[i]] = v;
	                v = s[p0];
	            }
	            component.setState((_component$setState = {}, _component$setState[p0] = v, _component$setState));
	        };
	    }
	    function enqueueRender(component) {
	        if (1 === items.push(component)) (options.debounceRendering || setImmediate)(rerender);
	    }
	    function rerender() {
	        if (items.length) {
	            var currentItems = items, p = void 0;
	            items = itemsOffline;
	            itemsOffline = currentItems;
	            for (;p = currentItems.pop(); ) if (p._dirty) renderComponent(p);
	        }
	    }
	    function isFunctionalComponent(_ref) {
	        var nodeName = _ref.nodeName;
	        return isFunction(nodeName) && !(nodeName.prototype && nodeName.prototype.render);
	    }
	    function buildFunctionalComponent(vnode, context) {
	        return vnode.nodeName(getNodeProps(vnode), context || EMPTY) || EMPTY_BASE;
	    }
	    function ensureNodeData(node) {
	        return node[ATTR_KEY] || (node[ATTR_KEY] = {});
	    }
	    function getNodeType(node) {
	        return node.nodeType;
	    }
	    function appendChildren(parent, children) {
	        var len = children.length, many = len > 2, into = many ? document.createDocumentFragment() : parent;
	        for (var i = 0; len > i; i++) into.appendChild(children[i]);
	        if (many) parent.appendChild(into);
	    }
	    function removeNode(node) {
	        var p = node.parentNode;
	        if (p) p.removeChild(node);
	    }
	    function getAccessor(node, name, value, cache) {
	        if ('type' !== name && 'style' !== name && name in node) return node[name];
	        var attrs = node[ATTR_KEY];
	        if (cache !== !1 && attrs && hasOwnProperty.call(attrs, name)) return attrs[name];
	        if ('class' === name) return node.className;
	        if ('style' === name) return node.style.cssText; else return value;
	    }
	    function setAccessor(node, name, value) {
	        if ('class' === name) node.className = value || ''; else if ('style' === name) node.style.cssText = value || ''; else if ('dangerouslySetInnerHTML' === name) {
	            if (value && value.__html) node.innerHTML = value.__html;
	        } else if ('key' === name || name in node && 'type' !== name) {
	            node[name] = value;
	            if (falsey(value)) node.removeAttribute(name);
	        } else setComplexAccessor(node, name, value);
	        ensureNodeData(node)[name] = value;
	    }
	    function setComplexAccessor(node, name, value) {
	        if ('on' !== name.substring(0, 2)) {
	            var type = typeof value;
	            if (falsey(value)) node.removeAttribute(name); else if ('function' !== type && 'object' !== type) node.setAttribute(name, value);
	        } else {
	            var _type = normalizeEventName(name), l = node._listeners || (node._listeners = {}), fn = !l[_type] ? 'add' : !value ? 'remove' : null;
	            if (fn) node[fn + 'EventListener'](_type, eventProxy);
	            l[_type] = value;
	        }
	    }
	    function eventProxy(e) {
	        var fn = this._listeners[normalizeEventName(e.type)];
	        if (fn) return fn.call(this, optionsHook('event', e) || e); else ;
	    }
	    function getNodeAttributes(node) {
	        return node[ATTR_KEY] || getRawNodeAttributes(node) || EMPTY;
	    }
	    function getRawNodeAttributes(node) {
	        var list = node.attributes;
	        if (!list || !list.getNamedItem) return list; else return getAttributesAsObject(list);
	    }
	    function getAttributesAsObject(list) {
	        var attrs = void 0;
	        for (var i = list.length; i--; ) {
	            var item = list[i];
	            if (!attrs) attrs = {};
	            attrs[item.name] = item.value;
	        }
	        return attrs;
	    }
	    function isSameNodeType(node, vnode) {
	        if (isFunctionalComponent(vnode)) return !0;
	        var nodeName = vnode.nodeName;
	        if (isFunction(nodeName)) return node._componentConstructor === nodeName;
	        if (3 === getNodeType(node)) return isString(vnode); else return toLowerCase(node.nodeName) === nodeName;
	    }
	    function getNodeProps(vnode) {
	        var props = clone(vnode.attributes), c = vnode.children;
	        if (c) props.children = c;
	        var defaultProps = vnode.nodeName.defaultProps;
	        if (defaultProps) for (var i in defaultProps) if (hasOwnProperty.call(defaultProps, i) && !(i in props)) props[i] = defaultProps[i];
	        return props;
	    }
	    function collectNode(node) {
	        cleanNode(node);
	        var name = normalizeName(node.nodeName), list = nodes[name];
	        if (list) list.push(node); else nodes[name] = [ node ];
	    }
	    function createNode(nodeName) {
	        var name = normalizeName(nodeName), list = nodes[name], node = list && list.pop() || document.createElement(nodeName);
	        ensureNodeData(node);
	        return node;
	    }
	    function cleanNode(node) {
	        removeNode(node);
	        if (3 !== getNodeType(node)) {
	            if (!node[ATTR_KEY]) node[ATTR_KEY] = getRawNodeAttributes(node);
	            node._component = node._componentConstructor = null;
	        }
	    }
	    function diff(dom, vnode, context) {
	        var originalAttributes = vnode.attributes;
	        for (;isFunctionalComponent(vnode); ) vnode = buildFunctionalComponent(vnode, context);
	        if (isFunction(vnode.nodeName)) return buildComponentFromVNode(dom, vnode, context);
	        if (isString(vnode)) {
	            if (dom) {
	                var type = getNodeType(dom);
	                if (3 === type) {
	                    dom[TEXT_CONTENT] = vnode;
	                    return dom;
	                } else if (1 === type) collectNode(dom);
	            }
	            return document.createTextNode(vnode);
	        }
	        var out = dom, nodeName = vnode.nodeName || UNDEFINED_ELEMENT;
	        if (!dom) out = createNode(nodeName); else if (toLowerCase(dom.nodeName) !== nodeName) {
	            out = createNode(nodeName);
	            appendChildren(out, toArray(dom.childNodes));
	            recollectNodeTree(dom);
	        }
	        innerDiffNode(out, vnode, context);
	        diffAttributes(out, vnode);
	        if (originalAttributes && originalAttributes.ref) (out[ATTR_KEY].ref = originalAttributes.ref)(out);
	        return out;
	    }
	    function innerDiffNode(dom, vnode, context) {
	        var children = void 0, keyed = void 0, keyedLen = 0, len = dom.childNodes.length, childrenLen = 0;
	        if (len) {
	            children = [];
	            for (var i = 0; len > i; i++) {
	                var child = dom.childNodes[i], key = child._component ? child._component.__key : getAccessor(child, 'key');
	                if (!empty(key)) {
	                    if (!keyed) keyed = {};
	                    keyed[key] = child;
	                    keyedLen++;
	                } else children[childrenLen++] = child;
	            }
	        }
	        var vchildren = vnode.children, vlen = vchildren && vchildren.length, min = 0;
	        if (vlen) for (var i = 0; vlen > i; i++) {
	            var vchild = vchildren[i], child = void 0;
	            if (keyedLen) {
	                var attrs = vchild.attributes, key = attrs && attrs.key;
	                if (!empty(key) && hasOwnProperty.call(keyed, key)) {
	                    child = keyed[key];
	                    keyed[key] = null;
	                    keyedLen--;
	                }
	            }
	            if (!child && childrenLen > min) for (var j = min; childrenLen > j; j++) {
	                var c = children[j];
	                if (c && isSameNodeType(c, vchild)) {
	                    child = c;
	                    children[j] = null;
	                    if (j === childrenLen - 1) childrenLen--;
	                    if (j === min) min++;
	                    break;
	                }
	            }
	            child = diff(child, vchild, context);
	            if (dom.childNodes[i] !== child) {
	                var c = child.parentNode !== dom && child._component, next = dom.childNodes[i + 1];
	                if (c) deepHook(c, 'componentWillMount');
	                if (next) dom.insertBefore(child, next); else dom.appendChild(child);
	                if (c) deepHook(c, 'componentDidMount');
	            }
	        }
	        if (keyedLen) for (var i in keyed) if (hasOwnProperty.call(keyed, i) && keyed[i]) children[min = childrenLen++] = keyed[i];
	        if (childrenLen > min) removeOrphanedChildren(children);
	    }
	    function removeOrphanedChildren(children, unmountOnly) {
	        for (var i = children.length; i--; ) {
	            var child = children[i];
	            if (child) recollectNodeTree(child, unmountOnly);
	        }
	    }
	    function recollectNodeTree(node, unmountOnly) {
	        var attrs = node[ATTR_KEY];
	        if (attrs) hook(attrs, 'ref', null);
	        var component = node._component;
	        if (component) unmountComponent(component, !unmountOnly); else {
	            if (!unmountOnly) {
	                if (1 !== getNodeType(node)) {
	                    removeNode(node);
	                    return;
	                }
	                collectNode(node);
	            }
	            var c = node.childNodes;
	            if (c && c.length) removeOrphanedChildren(c, unmountOnly);
	        }
	    }
	    function diffAttributes(dom, vnode) {
	        var old = getNodeAttributes(dom) || EMPTY, attrs = vnode.attributes || EMPTY, name = void 0, value = void 0;
	        for (name in old) if (empty(attrs[name])) setAccessor(dom, name, null);
	        if (attrs !== EMPTY) for (name in attrs) if (hasOwnProperty.call(attrs, name)) {
	            value = attrs[name];
	            if (!empty(value) && value != getAccessor(dom, name)) setAccessor(dom, name, value);
	        }
	    }
	    function collectComponent(component) {
	        var name = component.constructor.name, list = components[name];
	        if (list) list.push(component); else components[name] = [ component ];
	    }
	    function createComponent(Ctor, props, context) {
	        var list = components[Ctor.name], len = list && list.length, c = void 0;
	        for (var i = 0; len > i; i++) {
	            c = list[i];
	            if (c.constructor === Ctor) {
	                list.splice(i, 1);
	                var inst = new Ctor(props, context);
	                inst.nextBase = c.base;
	                return inst;
	            }
	        }
	        return new Ctor(props, context);
	    }
	    function triggerComponentRender(component) {
	        if (!component._dirty) {
	            component._dirty = !0;
	            enqueueRender(component);
	        }
	    }
	    function setComponentProps(component, props, opts, context) {
	        var d = component._disableRendering;
	        component.__ref = props.ref;
	        component.__key = props.key;
	        delete props.ref;
	        delete props.key;
	        component._disableRendering = !0;
	        if (context) {
	            if (!component.prevContext) component.prevContext = component.context;
	            component.context = context;
	        }
	        if (component.base) hook(component, 'componentWillReceiveProps', props, component.context);
	        if (!component.prevProps) component.prevProps = component.props;
	        component.props = props;
	        component._disableRendering = d;
	        if (!opts || opts.render !== !1) if (opts && opts.renderSync || options.syncComponentUpdates !== !1) renderComponent(component); else triggerComponentRender(component);
	        hook(component, '__ref', component);
	    }
	    function renderComponent(component, opts) {
	        if (!component._disableRendering) {
	            var skip = void 0, rendered = void 0, props = component.props, state = component.state, context = component.context, previousProps = component.prevProps || props, previousState = component.prevState || state, previousContext = component.prevContext || context, isUpdate = component.base, initialBase = isUpdate || component.nextBase;
	            if (isUpdate) {
	                component.props = previousProps;
	                component.state = previousState;
	                component.context = previousContext;
	                if (hook(component, 'shouldComponentUpdate', props, state, context) === !1) skip = !0; else hook(component, 'componentWillUpdate', props, state, context);
	                component.props = props;
	                component.state = state;
	                component.context = context;
	            }
	            component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	            component._dirty = !1;
	            if (!skip) {
	                rendered = hook(component, 'render', props, state, context);
	                var childComponent = rendered && rendered.nodeName, childContext = component.getChildContext ? component.getChildContext() : context, toUnmount = void 0, base = void 0;
	                if (isFunction(childComponent) && childComponent.prototype.render) {
	                    var inst = component._component;
	                    if (inst && inst.constructor !== childComponent) {
	                        toUnmount = inst;
	                        inst = null;
	                    }
	                    var childProps = getNodeProps(rendered);
	                    if (inst) setComponentProps(inst, childProps, SYNC_RENDER, childContext); else {
	                        inst = createComponent(childComponent, childProps, childContext);
	                        inst._parentComponent = component;
	                        component._component = inst;
	                        if (isUpdate) deepHook(inst, 'componentWillMount');
	                        setComponentProps(inst, childProps, NO_RENDER, childContext);
	                        renderComponent(inst, DOM_RENDER);
	                        if (isUpdate) deepHook(inst, 'componentDidMount');
	                    }
	                    base = inst.base;
	                } else {
	                    var cbase = initialBase;
	                    toUnmount = component._component;
	                    if (toUnmount) cbase = component._component = null;
	                    if (initialBase || opts && opts.build) base = diff(cbase, rendered || EMPTY_BASE, childContext);
	                }
	                if (initialBase && base !== initialBase) {
	                    var p = initialBase.parentNode;
	                    if (p && base !== p) p.replaceChild(base, initialBase);
	                }
	                if (toUnmount) unmountComponent(toUnmount, !0);
	                component.base = base;
	                if (base) {
	                    var componentRef = component, t = component;
	                    for (;t = t._parentComponent; ) componentRef = t;
	                    base._component = componentRef;
	                    base._componentConstructor = componentRef.constructor;
	                }
	                if (isUpdate) hook(component, 'componentDidUpdate', previousProps, previousState, previousContext);
	            }
	            var cb = component._renderCallbacks, fn = void 0;
	            if (cb) for (;fn = cb.pop(); ) fn.call(component);
	            return rendered;
	        }
	    }
	    function buildComponentFromVNode(dom, vnode, context) {
	        var c = dom && dom._component, oldDom = dom;
	        var isOwner = c && dom._componentConstructor === vnode.nodeName;
	        for (;c && !isOwner && (c = c._parentComponent); ) isOwner = c.constructor === vnode.nodeName;
	        if (isOwner) {
	            setComponentProps(c, getNodeProps(vnode), SYNC_RENDER, context);
	            dom = c.base;
	        } else {
	            if (c) {
	                unmountComponent(c, !0);
	                dom = oldDom = null;
	            }
	            dom = createComponentFromVNode(vnode, dom, context);
	            if (oldDom && dom !== oldDom) {
	                oldDom._component = null;
	                recollectNodeTree(oldDom);
	            }
	        }
	        return dom;
	    }
	    function createComponentFromVNode(vnode, dom, context) {
	        var props = getNodeProps(vnode);
	        var component = createComponent(vnode.nodeName, props, context);
	        if (dom && !component.base) component.base = dom;
	        setComponentProps(component, props, NO_RENDER, context);
	        renderComponent(component, DOM_RENDER);
	        return component.base;
	    }
	    function unmountComponent(component, remove) {
	        hook(component, '__ref', null);
	        hook(component, 'componentWillUnmount');
	        var inner = component._component;
	        if (inner) {
	            unmountComponent(inner, remove);
	            remove = !1;
	        }
	        var base = component.base;
	        if (base) {
	            if (remove !== !1) removeNode(base);
	            removeOrphanedChildren(base.childNodes, !0);
	        }
	        if (remove) {
	            component._parentComponent = null;
	            collectComponent(component);
	        }
	        hook(component, 'componentDidUnmount');
	    }
	    function Component(props, context) {
	        this._dirty = this._disableRendering = !1;
	        this.prevState = this.prevProps = this.prevContext = this.base = this.nextBase = this._parentComponent = this._component = this.__ref = this.__key = this._linkedStates = this._renderCallbacks = null;
	        this.context = context || {};
	        this.props = props;
	        this.state = hook(this, 'getInitialState') || {};
	    }
	    function render(vnode, parent, merge) {
	        var existing = merge && merge._component && merge._componentConstructor === vnode.nodeName, built = diff(merge, vnode), c = !existing && built._component;
	        if (c) deepHook(c, 'componentWillMount');
	        if (built.parentNode !== parent) parent.appendChild(built);
	        if (c) deepHook(c, 'componentDidMount');
	        return built;
	    }
	    var NO_RENDER = {
	        render: !1
	    };
	    var SYNC_RENDER = {
	        renderSync: !0
	    };
	    var DOM_RENDER = {
	        build: !0
	    };
	    var EMPTY = {};
	    var EMPTY_BASE = '';
	    var HAS_DOM = 'undefined' != typeof document;
	    var TEXT_CONTENT = !HAS_DOM || 'textContent' in document ? 'textContent' : 'nodeValue';
	    var ATTR_KEY = 'undefined' != typeof Symbol ? Symbol['for']('preactattr') : '__preactattr_';
	    var UNDEFINED_ELEMENT = 'undefined';
	    var NON_DIMENSION_PROPS = {
	        boxFlex: 1,
	        boxFlexGroup: 1,
	        columnCount: 1,
	        fillOpacity: 1,
	        flex: 1,
	        flexGrow: 1,
	        flexPositive: 1,
	        flexShrink: 1,
	        flexNegative: 1,
	        fontWeight: 1,
	        lineClamp: 1,
	        lineHeight: 1,
	        opacity: 1,
	        order: 1,
	        orphans: 1,
	        strokeOpacity: 1,
	        widows: 1,
	        zIndex: 1,
	        zoom: 1
	    };
	    var isFunction = function(obj) {
	        return 'function' == typeof obj;
	    };
	    var isString = function(obj) {
	        return 'string' == typeof obj;
	    };
	    var hasOwnProperty = {}.hasOwnProperty;
	    var empty = function(x) {
	        return null == x;
	    };
	    var falsey = function(value) {
	        return value === !1 || null == value;
	    };
	    var jsToCss = memoize(function(s) {
	        return s.replace(/([A-Z])/g, '-$1').toLowerCase();
	    });
	    var toLowerCase = memoize(function(s) {
	        return s.toLowerCase();
	    });
	    var ch = void 0;
	    try {
	        ch = new MessageChannel();
	    } catch (e) {}
	    var setImmediate = ch ? function(f) {
	        ch.port1.onmessage = f;
	        ch.port2.postMessage('');
	    } : setTimeout;
	    var options = {
	        vnode: function(n) {
	            var attrs = n.attributes;
	            if (attrs && !isFunction(n.nodeName)) {
	                var p = attrs.className;
	                if (p) {
	                    attrs['class'] = p;
	                    delete attrs.className;
	                }
	                if (attrs['class']) normalize(attrs, 'class', hashToClassName);
	                if (attrs.style) normalize(attrs, 'style', styleObjToCss);
	            }
	        }
	    };
	    var SHARED_TEMP_ARRAY = [];
	    var items = [];
	    var itemsOffline = [];
	    var normalizeEventName = memoize(function(t) {
	        return t.replace(/^on/i, '').toLowerCase();
	    });
	    var nodes = {};
	    var normalizeName = memoize(function(name) {
	        return name.toUpperCase();
	    });
	    var components = {};
	    extend(Component.prototype, {
	        linkState: function(key, eventPath) {
	            var c = this._linkedStates || (this._linkedStates = {}), cacheKey = key + '|' + (eventPath || '');
	            return c[cacheKey] || (c[cacheKey] = createLinkedState(this, key, eventPath));
	        },
	        setState: function(state, callback) {
	            var s = this.state;
	            if (!this.prevState) this.prevState = clone(s);
	            extend(s, isFunction(state) ? state(s, this.props) : state);
	            if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
	            triggerComponentRender(this);
	        },
	        forceUpdate: function() {
	            renderComponent(this);
	        },
	        render: function() {
	            return null;
	        }
	    });
	    var preact = {
	        h: h,
	        Component: Component,
	        render: render,
	        rerender: rerender,
	        options: options,
	        hooks: options
	    };
	    return preact;
	});
	//# sourceMappingURL=preact.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).setImmediate))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(3).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).setImmediate, __webpack_require__(2).clearImmediate))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(6), __esModule: true };

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(7);
	module.exports = __webpack_require__(10).Object.assign;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(8);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(23)});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(9)
	  , core      = __webpack_require__(10)
	  , ctx       = __webpack_require__(11)
	  , hide      = __webpack_require__(13)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 9 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 10 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(12);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(14)
	  , createDesc = __webpack_require__(22);
	module.exports = __webpack_require__(18) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(15)
	  , IE8_DOM_DEFINE = __webpack_require__(17)
	  , toPrimitive    = __webpack_require__(21)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(18) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(18) && !__webpack_require__(19)(function(){
	  return Object.defineProperty(__webpack_require__(20)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(19)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16)
	  , document = __webpack_require__(9).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(16);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(24)
	  , gOPS     = __webpack_require__(39)
	  , pIE      = __webpack_require__(40)
	  , toObject = __webpack_require__(41)
	  , IObject  = __webpack_require__(28)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(19)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(25)
	  , enumBugKeys = __webpack_require__(38);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(26)
	  , toIObject    = __webpack_require__(27)
	  , arrayIndexOf = __webpack_require__(31)(false)
	  , IE_PROTO     = __webpack_require__(35)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(28)
	  , defined = __webpack_require__(30);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(29);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(27)
	  , toLength  = __webpack_require__(32)
	  , toIndex   = __webpack_require__(34);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(33)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(33)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(36)('keys')
	  , uid    = __webpack_require__(37);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(9)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 39 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 40 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(30);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(43), __esModule: true };

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(44);
	module.exports = __webpack_require__(10).Object.getPrototypeOf;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(41)
	  , $getPrototypeOf = __webpack_require__(45);

	__webpack_require__(46)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(26)
	  , toObject    = __webpack_require__(41)
	  , IE_PROTO    = __webpack_require__(35)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(8)
	  , core    = __webpack_require__(10)
	  , fails   = __webpack_require__(19);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(49);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(50), __esModule: true };

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(51);
	var $Object = __webpack_require__(10).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(8);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(18), 'Object', {defineProperty: __webpack_require__(14).f});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(53);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(54);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(73);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(55), __esModule: true };

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(56);
	__webpack_require__(68);
	module.exports = __webpack_require__(72).f('iterator');

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(57)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(58)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(33)
	  , defined   = __webpack_require__(30);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(59)
	  , $export        = __webpack_require__(8)
	  , redefine       = __webpack_require__(60)
	  , hide           = __webpack_require__(13)
	  , has            = __webpack_require__(26)
	  , Iterators      = __webpack_require__(61)
	  , $iterCreate    = __webpack_require__(62)
	  , setToStringTag = __webpack_require__(66)
	  , getPrototypeOf = __webpack_require__(45)
	  , ITERATOR       = __webpack_require__(67)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(13);

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(63)
	  , descriptor     = __webpack_require__(22)
	  , setToStringTag = __webpack_require__(66)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(13)(IteratorPrototype, __webpack_require__(67)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(15)
	  , dPs         = __webpack_require__(64)
	  , enumBugKeys = __webpack_require__(38)
	  , IE_PROTO    = __webpack_require__(35)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(20)('iframe')
	    , i      = enumBugKeys.length
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(65).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(14)
	  , anObject = __webpack_require__(15)
	  , getKeys  = __webpack_require__(24);

	module.exports = __webpack_require__(18) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9).document && document.documentElement;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(14).f
	  , has = __webpack_require__(26)
	  , TAG = __webpack_require__(67)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(36)('wks')
	  , uid        = __webpack_require__(37)
	  , Symbol     = __webpack_require__(9).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(69);
	var global        = __webpack_require__(9)
	  , hide          = __webpack_require__(13)
	  , Iterators     = __webpack_require__(61)
	  , TO_STRING_TAG = __webpack_require__(67)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(70)
	  , step             = __webpack_require__(71)
	  , Iterators        = __webpack_require__(61)
	  , toIObject        = __webpack_require__(27);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(58)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(67);

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(74), __esModule: true };

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(75);
	__webpack_require__(84);
	__webpack_require__(85);
	__webpack_require__(86);
	module.exports = __webpack_require__(10).Symbol;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(9)
	  , has            = __webpack_require__(26)
	  , DESCRIPTORS    = __webpack_require__(18)
	  , $export        = __webpack_require__(8)
	  , redefine       = __webpack_require__(60)
	  , META           = __webpack_require__(76).KEY
	  , $fails         = __webpack_require__(19)
	  , shared         = __webpack_require__(36)
	  , setToStringTag = __webpack_require__(66)
	  , uid            = __webpack_require__(37)
	  , wks            = __webpack_require__(67)
	  , wksExt         = __webpack_require__(72)
	  , wksDefine      = __webpack_require__(77)
	  , keyOf          = __webpack_require__(78)
	  , enumKeys       = __webpack_require__(79)
	  , isArray        = __webpack_require__(80)
	  , anObject       = __webpack_require__(15)
	  , toIObject      = __webpack_require__(27)
	  , toPrimitive    = __webpack_require__(21)
	  , createDesc     = __webpack_require__(22)
	  , _create        = __webpack_require__(63)
	  , gOPNExt        = __webpack_require__(81)
	  , $GOPD          = __webpack_require__(83)
	  , $DP            = __webpack_require__(14)
	  , $keys          = __webpack_require__(24)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(82).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(40).f  = $propertyIsEnumerable;
	  __webpack_require__(39).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(59)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(13)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(37)('meta')
	  , isObject = __webpack_require__(16)
	  , has      = __webpack_require__(26)
	  , setDesc  = __webpack_require__(14).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(19)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(9)
	  , core           = __webpack_require__(10)
	  , LIBRARY        = __webpack_require__(59)
	  , wksExt         = __webpack_require__(72)
	  , defineProperty = __webpack_require__(14).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(24)
	  , toIObject = __webpack_require__(27);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(24)
	  , gOPS    = __webpack_require__(39)
	  , pIE     = __webpack_require__(40);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(29);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(27)
	  , gOPN      = __webpack_require__(82).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(25)
	  , hiddenKeys = __webpack_require__(38).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(40)
	  , createDesc     = __webpack_require__(22)
	  , toIObject      = __webpack_require__(27)
	  , toPrimitive    = __webpack_require__(21)
	  , has            = __webpack_require__(26)
	  , IE8_DOM_DEFINE = __webpack_require__(17)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(18) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 84 */
/***/ function(module, exports) {

	

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(77)('asyncIterator');

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(77)('observable');

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(88);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(92);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(53);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(89), __esModule: true };

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(90);
	module.exports = __webpack_require__(10).Object.setPrototypeOf;

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(8);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(91).set});

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(16)
	  , anObject = __webpack_require__(15);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(11)(Function.call, __webpack_require__(83).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(93), __esModule: true };

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(94);
	var $Object = __webpack_require__(10).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(8)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(63)});

/***/ },
/* 95 */,
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _Menu = __webpack_require__(97);

	var _Menu2 = _interopRequireDefault(_Menu);

	var _Footer = __webpack_require__(116);

	var _Footer2 = _interopRequireDefault(_Footer);

	var _SocketListener = __webpack_require__(117);

	var _SocketListener2 = _interopRequireDefault(_SocketListener);

	var _ModalContainer = __webpack_require__(139);

	var _ModalContainer2 = _interopRequireDefault(_ModalContainer);

	var _Chat = __webpack_require__(145);

	var _Chat2 = _interopRequireDefault(_Chat);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Layout = function (_Component) {
	  (0, _inherits3.default)(Layout, _Component);

	  function Layout() {
	    (0, _classCallCheck3.default)(this, Layout);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Layout).apply(this, arguments));
	  }

	  (0, _createClass3.default)(Layout, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {}
	  }, {
	    key: 'render',
	    value: function render(props, state) {
	      var chat = !props.chat ? '' : (0, _preact.h)(_Chat2.default, null);
	      var header = props.noheader ? '' : (0, _preact.h)(_Menu2.default, { active: props.active || '' });
	      var modals = props.nomodals ? '' : (0, _preact.h)(_ModalContainer2.default, null);
	      var footer = props.nofooter ? '' : (0, _preact.h)(_Footer2.default, null);
	      return (0, _preact.h)(
	        'div',
	        null,
	        (0, _preact.h)(
	          'center',
	          null,
	          header,
	          modals,
	          (0, _preact.h)(
	            'div',
	            null,
	            props.content
	          ),
	          chat,
	          footer
	        )
	      );
	    }
	  }]);
	  return Layout;
	}(_preact.Component);

	exports.default = Layout;

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _ProfileStore = __webpack_require__(98);

	var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

	var _stats = __webpack_require__(109);

	var _stats2 = _interopRequireDefault(_stats);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import actions from '../../actions/ProfileActions';

	var Menu = function (_Component) {
	  (0, _inherits3.default)(Menu, _Component);

	  function Menu() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Menu);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Menu)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      loaded: false
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(Menu, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _this2 = this;

	      _ProfileStore2.default.addChangeListener(function () {
	        // console.warn('callback in store');
	        _this2.setState({
	          money: _ProfileStore2.default.getMoney(),
	          loaded: true
	        });
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render(props, state) {
	      var text = state.loaded ? '  На вашем счету ' + state.money + 'p   : ' : '';
	      var loginMenu = (0, _preact.h)(
	        'li',
	        null,
	        (0, _preact.h)(
	          'a',
	          { href: '/Login', className: 'light-blue' },
	          'Вход'
	        )
	      );

	      if (login) {
	        loginMenu = '';
	      }

	      var hover = ''; //light-blue
	      var menuTournaments = hover + ' ' + (props.active === 'Tournaments' ? 'active' : '');
	      var menuPacks = hover + ' ' + (props.active === 'Packs' ? 'active' : '');
	      var menuProfile = hover + ' ' + (props.active === 'Profile' ? 'active' : '');
	      var menuAbout = hover + ' ' + (props.active === 'About' ? 'active' : '');
	      var menuIndex = hover + ' ' + (props.active === 'Index' ? 'active' : '');

	      //     font-size: 18px;
	      // line-height: 20px;
	      // <a href="/" className={`navbar-brand ${menuIndex}`}>Онлайн Турниры</a>

	      // navbar-brand

	      // <li><a href="/Packs" className={menuPacks}>Призы</a></li>
	      // <li><a href="/Packs" className={menuPacks}>Призы</a></li>
	      return (0, _preact.h)(
	        'center',
	        null,
	        (0, _preact.h)(
	          'nav',
	          { role: 'navigation', className: 'navbar navbar-inverse navbar-fixed-top navbar-my' },
	          (0, _preact.h)(
	            'div',
	            { className: 'container-fluid' },
	            (0, _preact.h)(
	              'div',
	              { style: 'margin: auto;' },
	              (0, _preact.h)(
	                'div',
	                { className: 'navbar-header' },
	                (0, _preact.h)(
	                  'button',
	                  {
	                    type: 'button',
	                    'data-toggle': 'collapse',
	                    'data-target': '#bs-example-navbar-collapse-1',
	                    className: 'navbar-toggle'
	                  },
	                  (0, _preact.h)(
	                    'span',
	                    { className: 'sr-only' },
	                    'Toggle navigation'
	                  ),
	                  (0, _preact.h)('span', { className: 'icon-bar' }),
	                  (0, _preact.h)('span', { className: 'icon-bar' }),
	                  (0, _preact.h)('span', { className: 'icon-bar' })
	                )
	              ),
	              (0, _preact.h)(
	                'div',
	                { id: 'bs-example-navbar-collapse-1', className: 'collapse navbar-collapse' },
	                (0, _preact.h)(
	                  'ul',
	                  { className: 'nav navbar-nav' },
	                  (0, _preact.h)(
	                    'li',
	                    null,
	                    (0, _preact.h)(
	                      'a',
	                      { href: '/', className: '' + menuIndex },
	                      'Онлайн Турниры'
	                    )
	                  ),
	                  (0, _preact.h)(
	                    'li',
	                    null,
	                    (0, _preact.h)(
	                      'a',
	                      { href: '/Tournaments', className: menuTournaments },
	                      'Турниры'
	                    )
	                  ),
	                  (0, _preact.h)(
	                    'li',
	                    null,
	                    (0, _preact.h)(
	                      'a',
	                      { href: '/Profile', className: menuProfile },
	                      'Профиль'
	                    )
	                  ),
	                  (0, _preact.h)(
	                    'li',
	                    null,
	                    (0, _preact.h)(
	                      'a',
	                      { href: '/About', className: menuAbout },
	                      ' О нас'
	                    )
	                  ),
	                  loginMenu
	                )
	              )
	            )
	          ),
	          (0, _preact.h)(
	            'div',
	            { className: 'container-fluid' },
	            (0, _preact.h)(
	              'center',
	              null,
	              (0, _preact.h)(
	                'div',
	                { style: 'background-color:#111111; display: ' + (login ? 'block' : 'none'), className: 'balance' },
	                (0, _preact.h)(
	                  'span',
	                  null,
	                  text
	                ),
	                (0, _preact.h)(
	                  'a',
	                  { href: '/Profile#dep', onClick: _stats2.default.pressedMenuFulfill },
	                  'Пополнить'
	                ),
	                (0, _preact.h)(
	                  'span',
	                  null,
	                  ' / '
	                ),
	                (0, _preact.h)(
	                  'a',
	                  { href: '/Profile#cashoutMoney', onClick: _stats2.default.pressedMenuCashout },
	                  'Снять'
	                )
	              )
	            )
	          ),
	          (0, _preact.h)(
	            'div',
	            { className: 'container-fluid' },
	            (0, _preact.h)(
	              'center',
	              null,
	              (0, _preact.h)('div', { style: 'width:100%; background-color:#222;', className: 'balance' })
	            )
	          )
	        )
	      );
	    }
	  }]);
	  return Menu;
	}(_preact.Component);

	exports.default = Menu;

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(99);

	var _keys2 = _interopRequireDefault(_keys);

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _events = __webpack_require__(102);

	var _dispatcher = __webpack_require__(103);

	var _dispatcher2 = _interopRequireDefault(_dispatcher);

	var _constants = __webpack_require__(107);

	var c = _interopRequireWildcard(_constants);

	var _types = __webpack_require__(108);

	var t = _interopRequireWildcard(_types);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// let _tournaments: Array<TournamentType> = [];
	var _tournaments = {}; // tournaments, where the player is registered
	var _adresses = {}; // adresses of tournaments
	var _running = {};

	var _availableTournaments = [];

	var _money = 0;
	var _packs = {};
	var _loaded = false;

	var _news = [];
	var _chatMessages = [];

	var _testValue = 0;

	var EC = 'EVENT_CHANGE';

	var ProfileStore = function (_EventEmitter) {
	  (0, _inherits3.default)(ProfileStore, _EventEmitter);

	  function ProfileStore() {
	    (0, _classCallCheck3.default)(this, ProfileStore);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ProfileStore).apply(this, arguments));
	  }

	  (0, _createClass3.default)(ProfileStore, [{
	    key: 'addChangeListener',
	    value: function addChangeListener(cb) {
	      this.addListener(EC, cb);
	    }
	  }, {
	    key: 'removeChangeListener',
	    value: function removeChangeListener(cb) {
	      this.removeListener(EC, cb);
	    }
	  }, {
	    key: 'emitChange',
	    value: function emitChange() {
	      this.emit(EC);
	    }
	  }, {
	    key: 'getMyTournaments',
	    value: function getMyTournaments() {
	      return _tournaments;
	    }
	  }, {
	    key: 'getMyTournamentList',
	    value: function getMyTournamentList() {
	      return (0, _keys2.default)(_tournaments);
	    }
	  }, {
	    key: 'getRunningTournaments',
	    value: function getRunningTournaments() {
	      // return _running;
	      // console.log('getRunningTournaments', _running);
	      // console.log('getRunningTournaments', Object.keys(_running));
	      var arr = (0, _keys2.default)(_running).filter(function (obj) {
	        return _running[obj] === 1;
	      }).map(function (obj) {
	        return parseInt(obj, 10);
	      });
	      return arr;
	    }
	  }, {
	    key: 'hasRunningTournaments',
	    value: function hasRunningTournaments() {
	      return (0, _keys2.default)(_running).filter(function (obj) {
	        return obj === 1;
	      });
	    }
	  }, {
	    key: 'getMoney',
	    value: function getMoney() {
	      return _money;
	    }
	  }, {
	    key: 'getMyPacks',
	    value: function getMyPacks() {
	      return _packs;
	    }
	  }, {
	    key: 'isLoaded',
	    value: function isLoaded() {
	      return _loaded;
	    }
	  }, {
	    key: 'isRegisteredIn',
	    value: function isRegisteredIn(id) {
	      // console.log('currently', _tournaments, _money, _packs, id);
	      return _tournaments[id];
	    }
	  }, {
	    key: 'register',
	    value: function register(id) {
	      // _regs[id] = 1;
	      _tournaments[id] = 1;
	    }
	  }, {
	    key: 'unregister',
	    value: function unregister(id) {
	      // _regs[id] = null;
	      _tournaments[id] = null;
	    }
	  }, {
	    key: 'getTestValue',
	    value: function getTestValue() {
	      return _testValue;
	    }
	  }, {
	    key: 'getAdress',
	    value: function getAdress(id) {
	      return _adresses[id];
	    }
	  }, {
	    key: 'getGameUrl',
	    value: function getGameUrl(id) {
	      // var addr = `http://${host}:${port}/Game?tournamentID=${tournamentID}`;
	      return 'http://' + _adresses[id].host + ':' + _adresses[id].port + '/Game?tournamentID=' + id;
	      // return `http://localhost:5010/Game?tournamentID=${id}`;
	    }
	  }, {
	    key: 'getMyNews',
	    value: function getMyNews() {
	      return _news;
	    }
	  }, {
	    key: 'hasNews',
	    value: function hasNews() {
	      return _news.length;
	    }
	  }, {
	    key: 'getChatMessages',
	    value: function getChatMessages() {
	      return _chatMessages;
	    }
	  }, {
	    key: 'getAvailableTournaments',
	    value: function getAvailableTournaments() {
	      return _availableTournaments;
	    }
	  }]);
	  return ProfileStore;
	}(_events.EventEmitter);

	var store = new ProfileStore();

	var delayedUpdate = function delayedUpdate(s) {
	  // const time = 1000;
	  // setTimeout(() => { s.emitChange(); }, time);
	};

	_dispatcher2.default.register(function (p) {
	  // console.error(p.type);//, p);
	  var change = true;
	  switch (p.type) {
	    case c.ACTION_INITIALIZE:
	      // console.log('initialize', p.type, p);
	      _loaded = true;
	      _tournaments = p.tournaments;
	      _money = p.money;
	      _packs = p.packs;
	      break;
	    case c.UPDATE_TOURNAMENTS:
	      _availableTournaments = p.tournaments;
	      break;
	    case c.ACTION_REGISTER_IN_TOURNAMENT:
	      _tournaments[p.tournamentID] = 1;
	      break;
	    case c.ACTION_UNREGISTER_FROM_TOURNAMENT:
	      _tournaments = p.tournaments;
	      break;
	    case c.ACTION_ADD_MESSAGE:
	      _news.splice(0, 0, {
	        data: p.data,
	        type: p.modal_type,
	        _id: 0
	      });
	      break;
	    case c.ACTION_ADD_CHAT_MESSAGE:
	      _chatMessages.push({
	        sender: p.data.sender,
	        text: p.data.text,
	        _id: 0
	      });
	      break;
	    case c.ACTION_SET_MESSAGES:
	      _chatMessages = p.messages;
	      break;
	    case c.ACTION_LOAD_NEWS:
	      // console.log('load my news', p.news);
	      _news = p.news;
	      break;

	    case c.ACTION_START_TOURNAMENT:
	      _running[p.tournamentID] = 1;
	      _adresses[p.tournamentID] = { port: p.port, host: p.host };
	      delayedUpdate(store);
	      break;
	    case c.ACTION_FINISH_TOURNAMENT:
	      _running[p.tournamentID] = 0;
	      delayedUpdate(store);
	      break;
	    case c.SET_TOURNAMENT_DATA:
	      console.warn('running is....', p.running, p.tournamentID);
	      _running[p.tournamentID] = p.running === true || p.running === 1 ? 1 : 0;
	      // _running[p.tournamentID] = 1;
	      _adresses[p.tournamentID] = { port: p.port, host: p.host };
	      delayedUpdate(store);
	      break;
	    case c.CLEAR_TOURNAMENT_DATA:
	      _running = {};
	      _adresses = {};
	      break;
	    case c.ACTION_ADD_NOTIFICATION:
	      _news.splice(0, 0, {
	        data: p.data,
	        type: p.modalType,
	        _id: 0
	      });
	      break;
	    case c.ACTION_TEST:
	      console.warn('_testValue', _testValue);
	      _testValue++;
	      break;
	    default:
	      change = false;
	      console.warn('Dispatcher.register unexpected type ' + p.type);
	      break;
	  }
	  if (change) store.emitChange();
	  // setInterval(() => {
	  //   store.emitChange();
	  // }, 3000);
	});

	exports.default = store;

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(100), __esModule: true };

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(101);
	module.exports = __webpack_require__(10).Object.keys;

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(41)
	  , $keys    = __webpack_require__(24);

	__webpack_require__(46)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 102 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _flux = __webpack_require__(104);

	exports.default = new _flux.Dispatcher();

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	module.exports.Dispatcher = __webpack_require__(105);


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Dispatcher
	 * 
	 * @preventMunge
	 */

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var invariant = __webpack_require__(106);

	var _prefix = 'ID_';

	/**
	 * Dispatcher is used to broadcast payloads to registered callbacks. This is
	 * different from generic pub-sub systems in two ways:
	 *
	 *   1) Callbacks are not subscribed to particular events. Every payload is
	 *      dispatched to every registered callback.
	 *   2) Callbacks can be deferred in whole or part until other callbacks have
	 *      been executed.
	 *
	 * For example, consider this hypothetical flight destination form, which
	 * selects a default city when a country is selected:
	 *
	 *   var flightDispatcher = new Dispatcher();
	 *
	 *   // Keeps track of which country is selected
	 *   var CountryStore = {country: null};
	 *
	 *   // Keeps track of which city is selected
	 *   var CityStore = {city: null};
	 *
	 *   // Keeps track of the base flight price of the selected city
	 *   var FlightPriceStore = {price: null}
	 *
	 * When a user changes the selected city, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'city-update',
	 *     selectedCity: 'paris'
	 *   });
	 *
	 * This payload is digested by `CityStore`:
	 *
	 *   flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'city-update') {
	 *       CityStore.city = payload.selectedCity;
	 *     }
	 *   });
	 *
	 * When the user selects a country, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'country-update',
	 *     selectedCountry: 'australia'
	 *   });
	 *
	 * This payload is digested by both stores:
	 *
	 *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       CountryStore.country = payload.selectedCountry;
	 *     }
	 *   });
	 *
	 * When the callback to update `CountryStore` is registered, we save a reference
	 * to the returned token. Using this token with `waitFor()`, we can guarantee
	 * that `CountryStore` is updated before the callback that updates `CityStore`
	 * needs to query its data.
	 *
	 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       // `CountryStore.country` may not be updated.
	 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
	 *       // `CountryStore.country` is now guaranteed to be updated.
	 *
	 *       // Select the default city for the new country
	 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
	 *     }
	 *   });
	 *
	 * The usage of `waitFor()` can be chained, for example:
	 *
	 *   FlightPriceStore.dispatchToken =
	 *     flightDispatcher.register(function(payload) {
	 *       switch (payload.actionType) {
	 *         case 'country-update':
	 *         case 'city-update':
	 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
	 *           FlightPriceStore.price =
	 *             getFlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *     }
	 *   });
	 *
	 * The `country-update` payload will be guaranteed to invoke the stores'
	 * registered callbacks in order: `CountryStore`, `CityStore`, then
	 * `FlightPriceStore`.
	 */

	var Dispatcher = (function () {
	  function Dispatcher() {
	    _classCallCheck(this, Dispatcher);

	    this._callbacks = {};
	    this._isDispatching = false;
	    this._isHandled = {};
	    this._isPending = {};
	    this._lastID = 1;
	  }

	  /**
	   * Registers a callback to be invoked with every dispatched payload. Returns
	   * a token that can be used with `waitFor()`.
	   */

	  Dispatcher.prototype.register = function register(callback) {
	    var id = _prefix + this._lastID++;
	    this._callbacks[id] = callback;
	    return id;
	  };

	  /**
	   * Removes a callback based on its token.
	   */

	  Dispatcher.prototype.unregister = function unregister(id) {
	    !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
	    delete this._callbacks[id];
	  };

	  /**
	   * Waits for the callbacks specified to be invoked before continuing execution
	   * of the current callback. This method should only be used by a callback in
	   * response to a dispatched payload.
	   */

	  Dispatcher.prototype.waitFor = function waitFor(ids) {
	    !this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
	    for (var ii = 0; ii < ids.length; ii++) {
	      var id = ids[ii];
	      if (this._isPending[id]) {
	        !this._isHandled[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
	        continue;
	      }
	      !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
	      this._invokeCallback(id);
	    }
	  };

	  /**
	   * Dispatches a payload to all registered callbacks.
	   */

	  Dispatcher.prototype.dispatch = function dispatch(payload) {
	    !!this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
	    this._startDispatching(payload);
	    try {
	      for (var id in this._callbacks) {
	        if (this._isPending[id]) {
	          continue;
	        }
	        this._invokeCallback(id);
	      }
	    } finally {
	      this._stopDispatching();
	    }
	  };

	  /**
	   * Is this Dispatcher currently dispatching.
	   */

	  Dispatcher.prototype.isDispatching = function isDispatching() {
	    return this._isDispatching;
	  };

	  /**
	   * Call the callback stored with the given id. Also do some internal
	   * bookkeeping.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
	    this._isPending[id] = true;
	    this._callbacks[id](this._pendingPayload);
	    this._isHandled[id] = true;
	  };

	  /**
	   * Set up bookkeeping needed when dispatching.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
	    for (var id in this._callbacks) {
	      this._isPending[id] = false;
	      this._isHandled[id] = false;
	    }
	    this._pendingPayload = payload;
	    this._isDispatching = true;
	  };

	  /**
	   * Clear bookkeeping used for dispatching.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._stopDispatching = function _stopDispatching() {
	    delete this._pendingPayload;
	    this._isDispatching = false;
	  };

	  return Dispatcher;
	})();

	module.exports = Dispatcher;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	"use strict";

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function (condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 107 */
/***/ function(module, exports) {

	'use strict';

	var constants = {
	  NOTIFICATION_GIVE_ACCELERATOR: 1,
	  NOTIFICATION_GIVE_MONEY: 2,
	  NOTIFICATION_ACCEPT_MONEY: 3, // give money to a user if he clicks on button

	  NOTIFICATION_MARATHON_PRIZE: 4,
	  NOTIFICATION_FORCE_PLAYING: 5,
	  NOTIFICATION_CUSTOM: 6,
	  NOTIFICATION_UPDATE: 7,

	  NOTIFICATION_FIRST_MESSAGE: 8,
	  NOTIFICATION_MARATHON_CURRENT: 9,

	  NOTIFICATION_AUTOREG: 10,
	  NOTIFICATION_JOIN_VK: 11,

	  NOTIFICATION_WIN_MONEY: 12,
	  NOTIFICATION_LOSE_TOURNAMENT: 13,

	  NOTIFICATION_ADVICE: 14,
	  NOTIFICATION_CARD_GIVEN: 15,
	  NOTIFICATION_GIVE_PACK: 16,

	  NOTIFICATION_TOURNAMENT_START: 17,

	  RARITY_RARE: 0,
	  RARITY_LOW: 1,
	  RARITY_MID: 2,
	  RARITY_HIGH: 3,

	  CARD_COLOUR_RED: 1,
	  CARD_COLOUR_BLUE: 2,
	  CARD_COLOUR_GREEN: 3,
	  CARD_COLOUR_GRAY: 4,

	  PAYMENT_TOURNAMENT: 0,
	  PAYMENT_ACCELERATOR: 1,
	  PAYMENT_FULLFILL: 2,
	  PAYMENT_PACK: 3,

	  UPDATE_TOURNAMENTS: 'UPDATE_TOURNAMENTS',

	  ACTION_INITIALIZE: 'ACTION_INITIALIZE',
	  ACTION_REGISTER_IN_TOURNAMENT: 'ACTION_REGISTER_IN_TOURNAMENT',
	  ACTION_UNREGISTER_FROM_TOURNAMENT: 'ACTION_UNREGISTER_FROM_TOURNAMENT',
	  ACTION_TEST: 'ACTION_TEST',
	  ACTION_START_TOURNAMENT: 'ACTION_START_TOURNAMENT',
	  ACTION_FINISH_TOURNAMENT: 'ACTION_FINISH_TOURNAMENT',
	  ACTION_LOAD_NEWS: 'ACTION_LOAD_NEWS',
	  ACTION_ADD_MESSAGE: 'ACTION_ADD_MESSAGE', // notification or pay modals
	  ACTION_ADD_CHAT_MESSAGE: 'ACTION_ADD_CHAT_MESSAGE',
	  ACTION_SET_MESSAGES: 'ACTION_SET_MESSAGES',
	  SET_TOURNAMENT_DATA: 'SET_TOURNAMENT_DATA',
	  CLEAR_TOURNAMENT_DATA: 'CLEAR_TOURNAMENT_DATA',

	  ACTION_ADD_NOTIFICATION: 'ACTION_ADD_NOTIFICATION',

	  MODAL_NO_PACK_MONEY: 'MODAL_NO_PACK_MONEY',
	  MODAL_NO_TOURNAMENT_MONEY: 'MODAL_NO_TOURNAMENT_MONEY',

	  TREG_NO_MONEY: 'TREG_NO_MONEY',
	  TREG_FULL: 'TREG_FULL',
	  TREG_ALREADY: 'Registered'
	};

	module.exports = constants;

/***/ },
/* 108 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _superagent = __webpack_require__(110);

	var _superagent2 = _interopRequireDefault(_superagent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function send(url) {
	  _superagent2.default.get(url).end(function (e, resp) {
	    console.log('send stat', url, e, resp);
	  });
	}

	function post(url, data) {
	  _superagent2.default.post(url).send(data);
	}

	exports.default = {
	  pressedMenuFulfill: function pressedMenuFulfill() {
	    send('/mark/metrics/MenuFulfill');
	  },
	  pressedMenuCashout: function pressedMenuCashout() {
	    send('/mark/metrics/MenuCashout');
	  },
	  pressedModalTournamentNoMoney: function pressedModalTournamentNoMoney() {
	    send('/mark/metrics/ModalTournamentNoMoney');
	  },
	  pressedModalPackNoMoney: function pressedModalPackNoMoney() {
	    send('/mark/metrics/ModalPackNoMoney');
	  },
	  pressedCashout: function pressedCashout(amount) {
	    post('/mark/metrics/Cashout', { amount: amount });
	  }
	};

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Emitter = __webpack_require__(111);
	var reduce = __webpack_require__(112);
	var requestBase = __webpack_require__(113);
	var isObject = __webpack_require__(114);

	/**
	 * Root reference for iframes.
	 */

	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  root = this;
	}

	/**
	 * Noop.
	 */

	function noop(){};

	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isHost(obj) {
	  var str = {}.toString.call(obj);

	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}

	/**
	 * Expose `request`.
	 */

	var request = module.exports = __webpack_require__(115).bind(null, Request);

	/**
	 * Determine XHR.
	 */

	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  return false;
	};

	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */

	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */

	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    if (null != obj[key]) {
	      pushEncodedKeyValuePair(pairs, key, obj[key]);
	        }
	      }
	  return pairs.join('&');
	}

	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */

	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (Array.isArray(val)) {
	    return val.forEach(function(v) {
	      pushEncodedKeyValuePair(pairs, key, v);
	    });
	  }
	  pairs.push(encodeURIComponent(key)
	    + '=' + encodeURIComponent(val));
	}

	/**
	 * Expose serialization method.
	 */

	 request.serializeObject = serialize;

	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */

	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var parts;
	  var pair;

	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    parts = pair.split('=');
	    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
	  }

	  return obj;
	}

	/**
	 * Expose parser.
	 */

	request.parseString = parseString;

	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */

	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};

	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */

	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };

	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */

	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};

	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;

	  lines.pop(); // trailing CRLF

	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }

	  return fields;
	}

	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */

	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}

	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function type(str){
	  return str.split(/ *; */).shift();
	};

	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function params(str){
	  return reduce(str.split(/ *; */), function(obj, str){
	    var parts = str.split(/ *= */)
	      , key = parts.shift()
	      , val = parts.shift();

	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};

	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */

	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this.setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this.setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this.parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}

	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};

	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */

	Response.prototype.setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);

	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};

	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */

	Response.prototype.parseBody = function(str){
	  var parse = request.parse[this.type];
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};

	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */

	Response.prototype.setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }

	  var type = status / 100 | 0;

	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;

	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;

	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};

	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */

	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;

	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;

	  return err;
	};

	/**
	 * Expose `Response`.
	 */

	request.Response = Response;

	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */

	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;

	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      // issue #876: return the http status code if the response parsing fails
	      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
	      return self.callback(err);
	    }

	    self.emit('response', res);

	    if (err) {
	      return self.callback(err, res);
	    }

	    if (res.status >= 200 && res.status < 300) {
	      return self.callback(err, res);
	    }

	    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	    new_err.original = err;
	    new_err.response = res;
	    new_err.status = res.status;

	    self.callback(new_err, res);
	  });
	}

	/**
	 * Mixin `Emitter` and `requestBase`.
	 */

	Emitter(Request.prototype);
	for (var key in requestBase) {
	  Request.prototype[key] = requestBase[key];
	}

	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */

	Request.prototype.abort = function(){
	  if (this.aborted) return;
	  this.aborted = true;
	  this.xhr.abort();
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};

	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};

	/**
	 * Set responseType to `val`. Presently valid responseTypes are 'blob' and 
	 * 'arraybuffer'.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};

	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.auth = function(user, pass, options){
	  if (!options) {
	    options = {
	      type: 'basic'
	    }
	  }

	  switch (options.type) {
	    case 'basic':
	      var str = btoa(user + ':' + pass);
	      this.set('Authorization', 'Basic ' + str);
	    break;

	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	  }
	  return this;
	};

	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/

	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};

	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.attach = function(field, file, filename){
	  this._getFormData().append(field, file, filename || file.name);
	  return this;
	};

	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};

	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	  *      request.post('/user')
	  *        .send('name=tobi')
	  *        .send('species=ferret')
	  *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.send = function(data){
	  var obj = isObject(data);
	  var type = this._header['content-type'];

	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }

	  if (!obj || isHost(data)) return this;
	  if (!type) this.type('json');
	  return this;
	};

	/**
	 * @deprecated
	 */
	Response.prototype.parse = function serialize(fn){
	  if (root.console) {
	    console.warn("Client-side parse() method has been renamed to serialize(). This method is not compatible with superagent v2.0");
	  }
	  this.serialize(fn);
	  return this;
	};

	Response.prototype.serialize = function serialize(fn){
	  this._parser = fn;
	  return this;
	};

	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */

	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};

	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */

	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;

	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;

	  this.callback(err);
	};

	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */

	Request.prototype.timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};

	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */

	Request.prototype.withCredentials = function(){
	  this._withCredentials = true;
	  return this;
	};

	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var query = this._query.join('&');
	  var timeout = this._timeout;
	  var data = this._formData || this._data;

	  // store callback
	  this._callback = fn || noop;

	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;

	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }

	    if (0 == status) {
	      if (self.timedout) return self.timeoutError();
	      if (self.aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };

	  // progress
	  var handleProgress = function(e){
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = 'download';
	    self.emit('progress', e);
	  };
	  if (this.hasListeners('progress')) {
	    xhr.onprogress = handleProgress;
	  }
	  try {
	    if (xhr.upload && this.hasListeners('progress')) {
	      xhr.upload.onprogress = handleProgress;
	    }
	  } catch(e) {
	    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	    // Reported here:
	    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	  }

	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }

	  // querystring
	  if (query) {
	    query = request.serializeObject(query);
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }

	  // initiate request
	  if (this.username && this.password) {
	    xhr.open(this.method, this.url, true, this.username, this.password);
	  } else {
	    xhr.open(this.method, this.url, true);
	  }

	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;

	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._parser || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }

	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }

	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }

	  // send stuff
	  this.emit('request', this);

	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};


	/**
	 * Expose `Request`.
	 */

	request.Request = Request;

	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	function del(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};

	request['del'] = del;
	request['delete'] = del;

	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	if (true) {
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 112 */
/***/ function(module, exports) {

	
	/**
	 * Reduce `arr` with `fn`.
	 *
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Mixed} initial
	 *
	 * TODO: combatible error handling?
	 */

	module.exports = function(arr, fn, initial){  
	  var idx = 0;
	  var len = arr.length;
	  var curr = arguments.length == 3
	    ? initial
	    : arr[idx++];

	  while (idx < len) {
	    curr = fn.call(null, curr, arr[idx], ++idx, arr);
	  }
	  
	  return curr;
	};

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(114);

	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.clearTimeout = function _clearTimeout(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};

	/**
	 * Force given parser
	 *
	 * Sets the body parser no matter type.
	 *
	 * @param {Function}
	 * @api public
	 */

	exports.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};

	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.timeout = function timeout(ms){
	  this._timeout = ms;
	  return this;
	};

	/**
	 * Faux promise support
	 *
	 * @param {Function} fulfill
	 * @param {Function} reject
	 * @return {Request}
	 */

	exports.then = function then(fulfill, reject) {
	  return this.end(function(err, res) {
	    err ? reject(err) : fulfill(res);
	  });
	}

	/**
	 * Allow for extension
	 */

	exports.use = function use(fn) {
	  fn(this);
	  return this;
	}


	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	exports.get = function(field){
	  return this._header[field.toLowerCase()];
	};

	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */

	exports.getHeader = exports.get;

	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};

	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	exports.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};

	/**
	 * Write the field `name` and `val` for "multipart/form-data"
	 * request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	exports.field = function(name, val) {
	  this._getFormData().append(name, val);
	  return this;
	};


/***/ },
/* 114 */
/***/ function(module, exports) {

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(obj) {
	  return null != obj && 'object' == typeof obj;
	}

	module.exports = isObject;


/***/ },
/* 115 */
/***/ function(module, exports) {

	// The node and browser modules expose versions of this with the
	// appropriate constructor function bound as first argument
	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */

	function request(RequestConstructor, method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new RequestConstructor('GET', method).end(url);
	  }

	  // url first
	  if (2 == arguments.length) {
	    return new RequestConstructor('GET', method);
	  }

	  return new RequestConstructor(method, url);
	}

	module.exports = request;


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _ProfileStore = __webpack_require__(98);

	var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Footer = function (_Component) {
	  (0, _inherits3.default)(Footer, _Component);

	  function Footer() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Footer);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Footer)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      loaded: false,
	      vk: !false
	    }, _this.arraysEqual = function (a, b) {
	      if (a === b) return true;
	      if (a == null || b == null) return false;
	      if (a.length !== b.length) return false;

	      // If you don't care about the order of the elements inside
	      // the array, you should sort both arrays here.

	      for (var i = 0; i < a.length; ++i) {
	        if (a[i] !== b[i]) return false;
	      }
	      return true;
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(Footer, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _this2 = this;

	      _ProfileStore2.default.addChangeListener(function () {
	        // if (!this.arraysEqual(this.state.messages, store.getChatMessages())) {
	        _this2.setState({
	          messages: _ProfileStore2.default.getChatMessages(),
	          loaded: true
	        });
	        // }
	      });
	      // VK.Widgets.Group('vk_groups', {
	      //   mode: 2,
	      //   width: '300',
	      //   height: '360',
	      //   color1: 'FFFFFF',
	      //   color2: '2B587A',
	      //   color3: '5B7FA6'
	      // }, 111187123);
	    }
	    // toggleVK = () => {
	    //   this.setState({ vk: !this.state.vk });
	    // };

	  }, {
	    key: 'render',
	    value: function render(props, state) {
	      var chat = '';
	      if (state.loaded && state.messages.length) {
	        var m = state.messages[state.messages.length - 1];
	        chat = (0, _preact.h)(
	          'a',
	          { href: '#chat', className: 'text-center' },
	          m.sender || 'Гость',
	          ': ',
	          m.text
	        );
	      }
	      //
	      // <li>
	      //   <a href="/about"> auth()</a>
	      // </li>

	      /*
	       <li>
	       <a className="fa fa-vk fa-lg" href="https://vk.com/o_tournaments" target="_blank"> Группа ВК</a>
	       </li>
	       <li>
	       <a href="https://vk.com/topic-111187123_33419618" target="_blank"> Техподдержка</a>
	       </li>
	       <li>
	       <a href="/about"> О нас</a>
	       </li>
	        */

	      /*
	        <button
	       type="button"
	       className="navbar-toggle"
	       data-toggle="collapse"
	       data-target="#bs-example-navbar-collapse-2"
	       >
	       <span className="sr-only"> Toggle navigation</span>
	       <span className="icon-bar" />
	       <span className="icon-bar" />
	       <span className="icon-bar" />
	       </button>
	             <script>
	              console.log('script VK')
	              const options = {};
	              options.mode = 2;
	              options.width = "auto";
	              options.height = "360";
	              options.color1 = 'FFFFFF';
	              options.color2 = '2B587A';
	              options.color3 = '5B7FA6';
	              console.log(VK);
	              VK.Widgets.Group("vk_groups", options, 111187123);
	            </script>
	       */

	      // <div id="vk_groups" className={`${state.vk ? 'show' : 'hide'}`}></div>
	      // <a className="fa fa-vk fa-lg" onClick={this.toggleVK}>Группа ВК</a>

	      var tpLink = 'https://vk.com/topic-111187123_33419618';
	      var group = 'https://vk.com/o_tournaments';

	      var vkText = 'Вступайте, будем рады вам :)';

	      var contacts = (0, _preact.h)(
	        'center',
	        null,
	        (0, _preact.h)(
	          'div',
	          { className: 'white page' },
	          (0, _preact.h)(
	            'div',
	            { className: 'offset text-center contacts-tab' },
	            (0, _preact.h)(
	              'i',
	              { className: 'fa fa-vk fa-lg' },
	              ' ',
	              (0, _preact.h)(
	                'a',
	                { href: group, target: '_blank' },
	                'Наша группа ВК'
	              )
	            ),
	            (0, _preact.h)(
	              'div',
	              { className: 'white' },
	              vkText
	            )
	          ),
	          (0, _preact.h)(
	            'div',
	            { className: 'offset text-center contacts-tab' },
	            (0, _preact.h)(
	              'i',
	              { className: 'fa fa-lg' },
	              (0, _preact.h)(
	                'a',
	                { href: tpLink, target: '_blank' },
	                'Техподдержка'
	              )
	            ),
	            (0, _preact.h)(
	              'div',
	              { className: 'white' },
	              'Что-то не так? Пишите, не стесняйтесь'
	            )
	          )
	        )
	      );

	      return (0, _preact.h)(
	        'center',
	        null,
	        (0, _preact.h)('div', { style: 'height: 35px;' }),
	        (0, _preact.h)(
	          'h1',
	          { className: 'white page' },
	          'Контакты'
	        ),
	        contacts,
	        (0, _preact.h)('div', { style: 'height: 60px;' }),
	        (0, _preact.h)(
	          'nav',
	          { className: 'navbar navbar-inverse navbar-fixed-bottom chat', role: 'navigation' },
	          (0, _preact.h)(
	            'div',
	            { className: 'container-fluid' },
	            (0, _preact.h)(
	              'div',
	              { className: 'navbar-header' },
	              (0, _preact.h)(
	                'p',
	                { id: 'activity' },
	                chat
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);
	  return Footer;
	}(_preact.Component);

	exports.default = Footer;

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ProfileActions = __webpack_require__(118);

	var _ProfileActions2 = _interopRequireDefault(_ProfileActions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// console.error('SOCKET LISTENER INIT');
	socket.on('StartTournament', function (msg) {
	  // console.log('startTournament SocketListener', msg);
	  _ProfileActions2.default.startTournament(msg);
	});

	socket.on('chat message', function (msg) {
	  _ProfileActions2.default.appendChatMessage(msg);
	});
	// socket.on('Tell', Tell);
	socket.on('FinishTournament', function (msg) {
	  console.error('FinishTournament', msg);
	  _ProfileActions2.default.finishTournament(msg);
	});

	socket.on('activity', function (msg) {
	  // alert(JSON.stringify(msg));
	});

	socket.on('update', function (msg) {
	  // console.log('update', msg);
	  _ProfileActions2.default.updateTournaments(msg.tournaments);
	});

	socket.on('newsUpdate', function (msg) {
	  // console.log('newsUpdate', msg);
	  if (msg && msg.msg === login) {
	    console.warn('newsUpdate for me', msg);
	    // actions.loadNews();
	    _ProfileActions2.default.update();
	  }
	});

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(5);

	var _assign2 = _interopRequireDefault(_assign);

	var _regenerator = __webpack_require__(119);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(138);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var loadChatMessages = function () {
	  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
	    var response, messages;
	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            _context.next = 3;
	            return _superagent2.default.post('/messages/chat/recent');

	          case 3:
	            response = _context.sent;

	            // .end((err, res: ResponseType) => {
	            messages = response.body.msg.reverse().map(function (item) {
	              return { sender: item.senderName, text: item.text };
	            });

	            _dispatcher2.default.dispatch({
	              type: c.ACTION_SET_MESSAGES,
	              messages: messages
	            });
	            _context.next = 11;
	            break;

	          case 8:
	            _context.prev = 8;
	            _context.t0 = _context['catch'](0);

	            sendError(_context.t0, 'chat/recent');

	          case 11:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this, [[0, 8]]);
	  }));
	  return function loadChatMessages() {
	    return ref.apply(this, arguments);
	  };
	}();

	var loadProfile = function () {
	  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
	    var _this = this;

	    return _regenerator2.default.wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            _context3.prev = 0;
	            return _context3.delegateYield(_regenerator2.default.mark(function _callee2() {
	              var response, profile, tournaments, money, packs, tRegs, registeredIn;
	              return _regenerator2.default.wrap(function _callee2$(_context2) {
	                while (1) {
	                  switch (_context2.prev = _context2.next) {
	                    case 0:
	                      console.log('async initialize');
	                      _context2.next = 3;
	                      return _superagent2.default.get('/myProfile');

	                    case 3:
	                      response = _context2.sent;

	                      // console.log('async initialize response...', response.body);
	                      profile = response.body.profile;
	                      tournaments = profile.tournaments;
	                      money = profile.money;
	                      packs = profile.packs;
	                      tRegs = tournaments;
	                      registeredIn = {};

	                      tRegs.forEach(function (reg) {
	                        var tID = reg.tournamentID;
	                        registeredIn[tID] = 1;
	                      });

	                      // console.warn('async ACTION_INITIALIZE');
	                      _dispatcher2.default.dispatch({
	                        type: c.ACTION_INITIALIZE,
	                        tournaments: registeredIn,
	                        money: money,
	                        packs: packs
	                      });

	                      _dispatcher2.default.dispatch({
	                        type: c.CLEAR_TOURNAMENT_DATA
	                      });

	                      tRegs.forEach(function (reg) {
	                        var tournamentID = reg.tournamentID;
	                        _superagent2.default.post('/GetTournamentAddress').send({ tournamentID: tournamentID }).end(function (err, res) {
	                          if (err) throw err;
	                          var _JSON$parse$address = JSON.parse(res.text).address;
	                          var host = _JSON$parse$address.host;
	                          var port = _JSON$parse$address.port;
	                          var running = _JSON$parse$address.running;
	                          // console.log('/GetTournamentAddress GetTournamentAddress', host, port, running, tID);

	                          console.warn('async SET_TOURNAMENT_DATA');
	                          _dispatcher2.default.dispatch({
	                            type: c.SET_TOURNAMENT_DATA,
	                            host: host,
	                            port: port,
	                            running: running ? 1 : 0,
	                            tournamentID: tournamentID
	                          });
	                        });
	                      });

	                    case 14:
	                    case 'end':
	                      return _context2.stop();
	                  }
	                }
	              }, _callee2, _this);
	            })(), 't0', 2);

	          case 2:
	            _context3.next = 7;
	            break;

	          case 4:
	            _context3.prev = 4;
	            _context3.t1 = _context3['catch'](0);

	            console.error(_context3.t1);

	          case 7:
	          case 'end':
	            return _context3.stop();
	        }
	      }
	    }, _callee3, this, [[0, 4]]);
	  }));
	  return function loadProfile() {
	    return ref.apply(this, arguments);
	  };
	}();

	var _superagent = __webpack_require__(110);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _dispatcher = __webpack_require__(103);

	var _dispatcher2 = _interopRequireDefault(_dispatcher);

	var _constants = __webpack_require__(107);

	var c = _interopRequireWildcard(_constants);

	var _types = __webpack_require__(108);

	var _ProfileStore = __webpack_require__(98);

	var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var sendError = function sendError(err, name) {
	  console.error('error happened in ', name, err);
	};

	var sendPaymentStat = function sendPaymentStat(name, ammount, user) {
	  console.log('no money(', name, ammount, user);
	};

	// this.setMessages(messages);
	// this.scrollToMessageEnd();
	// });


	function loadNews() {
	  _superagent2.default.get('/notifications/news').end(function (err, res) {
	    var news = res.body.msg;
	    _dispatcher2.default.dispatch({
	      type: c.ACTION_LOAD_NEWS,
	      news: news
	    });
	  });
	}

	function addNotification(data, modalType) {
	  _dispatcher2.default.dispatch({
	    type: c.ACTION_ADD_NOTIFICATION,
	    data: data,
	    modalType: modalType
	  });
	}

	function initialize() {
	  loadProfile();
	  loadChatMessages();
	  loadNews();
	}

	function update() {
	  loadProfile();
	  loadNews();
	}

	exports.default = {
	  initialize: initialize,
	  update: update,
	  report: function report(err, where) {
	    _superagent2.default.post('/mark/clientError').send({ err: err, where: where });
	  },
	  register: function register(tournamentID, buyIn) {
	    var _this2 = this;

	    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
	      var response, result, registeredIn;
	      return _regenerator2.default.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              _context4.prev = 0;
	              _context4.next = 3;
	              return _superagent2.default.post('RegisterInTournament').send({ login: login, tournamentID: tournamentID });

	            case 3:
	              response = _context4.sent;
	              result = response.body.result;
	              registeredIn = (0, _assign2.default)({}, _ProfileStore2.default.getMyTournaments());


	              registeredIn[tournamentID] = 1;

	              _context4.t0 = result;
	              _context4.next = _context4.t0 === 'OK' ? 10 : _context4.t0 === c.TREG_NO_MONEY ? 12 : 14;
	              break;

	            case 10:
	              _dispatcher2.default.dispatch({
	                type: c.ACTION_REGISTER_IN_TOURNAMENT,
	                tournaments: registeredIn,
	                tournamentID: tournamentID
	              });
	              return _context4.abrupt('break', 14);

	            case 12:
	              addNotification({
	                ammount: buyIn
	              }, c.MODAL_NO_TOURNAMENT_MONEY);
	              return _context4.abrupt('break', 14);

	            case 14:
	              _context4.next = 19;
	              break;

	            case 16:
	              _context4.prev = 16;
	              _context4.t1 = _context4['catch'](0);

	              console.error(_context4.t1);

	            case 19:
	            case 'end':
	              return _context4.stop();
	          }
	        }
	      }, _callee4, _this2, [[0, 16]]);
	    }))();
	  },
	  unregister: function unregister(tournamentID) {
	    var _this3 = this;

	    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
	      var response, registeredIn;
	      return _regenerator2.default.wrap(function _callee5$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              _context5.prev = 0;
	              _context5.next = 3;
	              return _superagent2.default.post('CancelRegister').send({ login: login, tournamentID: tournamentID });

	            case 3:
	              response = _context5.sent;

	              // .end((err, response) => {
	              console.log('CancelRegister', response);

	              registeredIn = (0, _assign2.default)({}, _ProfileStore2.default.getMyTournaments());

	              registeredIn[tournamentID] = null;

	              _dispatcher2.default.dispatch({
	                type: c.ACTION_UNREGISTER_FROM_TOURNAMENT,
	                tournaments: registeredIn,
	                tournamentID: tournamentID
	              });

	              update();
	              _context5.next = 14;
	              break;

	            case 11:
	              _context5.prev = 11;
	              _context5.t0 = _context5['catch'](0);

	              console.error(_context5.t0);

	            case 14:
	            case 'end':
	              return _context5.stop();
	          }
	        }
	      }, _callee5, _this3, [[0, 11]]);
	    }))();
	  },
	  startTournament: function startTournament(msg) {
	    var tournamentID = msg.tournamentID;

	    if (!_ProfileStore2.default.isRegisteredIn(tournamentID)) {
	      return;
	    }

	    var audio = new Audio('/sounds/TOURN_START.wav');
	    audio.play();

	    var host = msg.host;
	    var port = msg.port;

	    _dispatcher2.default.dispatch({
	      type: c.ACTION_START_TOURNAMENT,
	      tournamentID: tournamentID,
	      host: host,
	      port: port
	    });
	  },
	  finishTournament: function finishTournament(msg) {
	    var tournamentID = msg.tournamentID;

	    console.warn('finish', msg);
	    if (!_ProfileStore2.default.isRegisteredIn(tournamentID)) {
	      return;
	    }

	    var audio = new Audio('/sounds/TOURN_START.wav');
	    audio.play();

	    _dispatcher2.default.dispatch({
	      type: c.ACTION_FINISH_TOURNAMENT,
	      tournamentID: tournamentID
	    });
	  },


	  loadNews: loadNews,

	  openPack: function openPack(value, pay) {
	    var _this4 = this;

	    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
	      var response;
	      return _regenerator2.default.wrap(function _callee6$(_context6) {
	        while (1) {
	          switch (_context6.prev = _context6.next) {
	            case 0:
	              _context6.prev = 0;
	              _context6.next = 3;
	              return _superagent2.default.post('openPack/' + value + '/' + pay);

	            case 3:
	              response = _context6.sent;

	              if (!response.body.err) {
	                _context6.next = 6;
	                break;
	              }

	              throw response.body.err;

	            case 6:
	              // console.log('async openPack', response.body.err);

	              if (response.body.result === 'pay' && response.body.ammount) {
	                _dispatcher2.default.dispatch({
	                  type: c.ACTION_ADD_MESSAGE,
	                  modal_type: c.MODAL_NO_PACK_MONEY,
	                  data: {
	                    ammount: parseInt(response.body.ammount, 10)
	                  }
	                });
	              } else {
	                _this4.loadNews();
	              }
	              _context6.next = 12;
	              break;

	            case 9:
	              _context6.prev = 9;
	              _context6.t0 = _context6['catch'](0);

	              sendError(_context6.t0, 'openPack');

	            case 12:
	            case 'end':
	              return _context6.stop();
	          }
	        }
	      }, _callee6, _this4, [[0, 9]]);
	    }))();
	  },


	  loadChatMessages: loadChatMessages,
	  addNotification: addNotification,
	  payModalStat: function payModalStat() {},
	  updateTournaments: function updateTournaments(tournaments) {
	    _dispatcher2.default.dispatch({
	      type: c.UPDATE_TOURNAMENTS,
	      tournaments: tournaments
	    });
	  },
	  appendChatMessage: function appendChatMessage(data) {
	    _dispatcher2.default.dispatch({
	      type: c.ACTION_ADD_CHAT_MESSAGE,
	      data: data
	    });
	  },
	  sendMessage: function sendMessage(text, sender) {
	    socket.emit('chat message', { text: text, sender: sender });
	  },
	  testFunction: function testFunction() {
	    _dispatcher2.default.dispatch({
	      type: c.ACTION_TEST
	    });
	  }
	};

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {// This method of obtaining a reference to the global object needs to be
	// kept identical to the way it is obtained in runtime.js
	var g =
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this;

	// Use `getOwnPropertyNames` because not all browsers support calling
	// `hasOwnProperty` on the global `self` object in a worker. See #183.
	var hadRuntime = g.regeneratorRuntime &&
	  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

	// Save the old regeneratorRuntime in case it needs to be restored later.
	var oldRuntime = hadRuntime && g.regeneratorRuntime;

	// Force reevalutation of runtime.js.
	g.regeneratorRuntime = undefined;

	module.exports = __webpack_require__(120);

	if (hadRuntime) {
	  // Restore the original runtime.
	  g.regeneratorRuntime = oldRuntime;
	} else {
	  // Remove the global property added by runtime.js.
	  try {
	    delete g.regeneratorRuntime;
	  } catch(e) {
	    g.regeneratorRuntime = undefined;
	  }
	}

	module.exports = { "default": module.exports, __esModule: true };

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module, process) {"use strict";

	var _promise = __webpack_require__(122);

	var _promise2 = _interopRequireDefault(_promise);

	var _setPrototypeOf = __webpack_require__(88);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(92);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(53);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _iterator = __webpack_require__(54);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(73);

	var _symbol2 = _interopRequireDefault(_symbol);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */

	!function (global) {
	  "use strict";

	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var iteratorSymbol = typeof _symbol2.default === "function" && _iterator2.default || "@@iterator";

	  var inModule = ( false ? "undefined" : (0, _typeof3.default)(module)) === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided, then outerFn.prototype instanceof Generator.
	    var generator = (0, _create2.default)((outerFn || Generator).prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function (method) {
	      prototype[method] = function (arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function (genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor ? ctor === GeneratorFunction ||
	    // For the native GeneratorFunction constructor, the best we can
	    // do is to check its .name property.
	    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
	  };

	  runtime.mark = function (genFun) {
	    if (_setPrototypeOf2.default) {
	      (0, _setPrototypeOf2.default)(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	    }
	    genFun.prototype = (0, _create2.default)(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `value instanceof AwaitArgument` to determine if the yielded value is
	  // meant to be awaited. Some may consider the name of this method too
	  // cutesy, but they are curmudgeons.
	  runtime.awrap = function (arg) {
	    return new AwaitArgument(arg);
	  };

	  function AwaitArgument(arg) {
	    this.arg = arg;
	  }

	  function AsyncIterator(generator) {
	    // This invoke function is written in a style that assumes some
	    // calling function (or Promise) will handle exceptions.
	    function invoke(method, arg) {
	      var result = generator[method](arg);
	      var value = result.value;
	      return value instanceof AwaitArgument ? _promise2.default.resolve(value.arg).then(invokeNext, invokeThrow) : _promise2.default.resolve(value).then(function (unwrapped) {
	        // When a yielded Promise is resolved, its final value becomes
	        // the .value of the Promise<{value,done}> result for the
	        // current iteration. If the Promise is rejected, however, the
	        // result for this iteration will be rejected with the same
	        // reason. Note that rejections of yielded Promises are not
	        // thrown back into the generator function, as is the case
	        // when an awaited Promise is rejected. This difference in
	        // behavior between yield and await is important, because it
	        // allows the consumer to decide what to do with the yielded
	        // rejection (swallow it and continue, manually .throw it back
	        // into the generator, abandon iteration, whatever). With
	        // await, by contrast, there is no opportunity to examine the
	        // rejection reason outside the generator function, so the
	        // only option is to throw it from the await expression, and
	        // let the generator function handle the exception.
	        result.value = unwrapped;
	        return result;
	      });
	    }

	    if ((typeof process === "undefined" ? "undefined" : (0, _typeof3.default)(process)) === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }

	    var invokeNext = invoke.bind(generator, "next");
	    var invokeThrow = invoke.bind(generator, "throw");
	    var invokeReturn = invoke.bind(generator, "return");
	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return invoke(method, arg);
	      }

	      return previousPromise =
	      // If enqueue has been called before, then we want to wait until
	      // all previous Promises have been resolved before calling invoke,
	      // so that results are always delivered in the correct order. If
	      // enqueue has not been called before, then it is important to
	      // call invoke immediately, without waiting on a callback to fire,
	      // so that the async generator function has the opportunity to do
	      // any necessary setup in a predictable way. This predictability
	      // is why the Promise constructor synchronously invokes its
	      // executor callback, and why async functions synchronously
	      // execute code before the first await. Since we implement simple
	      // async functions in terms of async generators, it is especially
	      // important to get this right, even though it requires care.
	      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
	      // Avoid propagating failures to Promises returned by later
	      // invocations of the iterator.
	      callInvokeWithMethodAndArg) : new _promise2.default(function (resolve) {
	        resolve(callInvokeWithMethodAndArg());
	      });
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

	    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
	    : iter.next().then(function (result) {
	      return result.done ? result.value : iter.next();
	    });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
	            // A return or throw (when the delegate iterator has no throw
	            // method) always terminates the yield* loop.
	            context.delegate = null;

	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            var returnMethod = delegate.iterator["return"];
	            if (returnMethod) {
	              var record = tryCatch(returnMethod, delegate.iterator, arg);
	              if (record.type === "throw") {
	                // If the return method threw an exception, let that
	                // exception prevail over the original return or throw.
	                method = "throw";
	                arg = record.arg;
	                continue;
	              }
	            }

	            if (method === "return") {
	              // Continue with the outer return, now that the delegate
	              // iterator has been terminated.
	              continue;
	            }
	          }

	          var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

	          if (record.type === "throw") {
	            context.delegate = null;

	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	            continue;
	          }

	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;

	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }

	          context.delegate = null;
	        }

	        if (method === "next") {
	          context._sent = arg;

	          if (state === GenStateSuspendedYield) {
	            context.sent = arg;
	          } else {
	            context.sent = undefined;
	          }
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }

	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }
	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

	          var info = {
	            value: record.arg,
	            done: context.done
	          };

	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }
	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(arg) call above.
	          method = "throw";
	          arg = record.arg;
	        }
	      }
	    };
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[iteratorSymbol] = function () {
	    return this;
	  };

	  Gp.toString = function () {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function (object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1,
	            next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function reset(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      this.sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function stop() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function dispatchException(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function abrupt(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }

	      return ContinueSentinel;
	    },

	    complete: function complete(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" || record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	    },

	    finish: function finish(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function _catch(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      return ContinueSentinel;
	    }
	  };
	}(
	// Among the various tricks for obtaining a reference to the global
	// object, this seems to be the most reliable technique that does not
	// use indirect eval (which violates Content Security Policy).
	(typeof global === "undefined" ? "undefined" : (0, _typeof3.default)(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : (0, _typeof3.default)(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : (0, _typeof3.default)(self)) === "object" ? self : undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(121)(module), __webpack_require__(3)))

/***/ },
/* 121 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(123), __esModule: true };

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(84);
	__webpack_require__(56);
	__webpack_require__(68);
	__webpack_require__(124);
	module.exports = __webpack_require__(10).Promise;

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY            = __webpack_require__(59)
	  , global             = __webpack_require__(9)
	  , ctx                = __webpack_require__(11)
	  , classof            = __webpack_require__(125)
	  , $export            = __webpack_require__(8)
	  , isObject           = __webpack_require__(16)
	  , anObject           = __webpack_require__(15)
	  , aFunction          = __webpack_require__(12)
	  , anInstance         = __webpack_require__(126)
	  , forOf              = __webpack_require__(127)
	  , setProto           = __webpack_require__(91).set
	  , speciesConstructor = __webpack_require__(131)
	  , task               = __webpack_require__(132).set
	  , microtask          = __webpack_require__(134)()
	  , PROMISE            = 'Promise'
	  , TypeError          = global.TypeError
	  , process            = global.process
	  , $Promise           = global[PROMISE]
	  , process            = global.process
	  , isNode             = classof(process) == 'process'
	  , empty              = function(){ /* empty */ }
	  , Internal, GenericPromiseCapability, Wrapper;

	var USE_NATIVE = !!function(){
	  try {
	    // correct subclassing with @@species support
	    var promise     = $Promise.resolve(1)
	      , FakePromise = (promise.constructor = {})[__webpack_require__(67)('species')] = function(exec){ exec(empty, empty); };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch(e){ /* empty */ }
	}();

	// helpers
	var sameConstructor = function(a, b){
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function(C){
	  return sameConstructor($Promise, C)
	    ? new PromiseCapability(C)
	    : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject  = aFunction(reject);
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(promise, isReject){
	  if(promise._n)return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function(){
	    var value = promise._v
	      , ok    = promise._s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , domain  = reaction.domain
	        , result, then;
	      try {
	        if(handler){
	          if(!ok){
	            if(promise._h == 2)onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if(handler === true)result = value;
	          else {
	            if(domain)domain.enter();
	            result = handler(value);
	            if(domain)domain.exit();
	          }
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if(isReject && !promise._h)onUnhandled(promise);
	  });
	};
	var onUnhandled = function(promise){
	  task.call(global, function(){
	    var value = promise._v
	      , abrupt, handler, console;
	    if(isUnhandled(promise)){
	      abrupt = perform(function(){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if(abrupt)throw abrupt.error;
	  });
	};
	var isUnhandled = function(promise){
	  if(promise._h == 1)return false;
	  var chain = promise._a || promise._c
	    , i     = 0
	    , reaction;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
	  } return true;
	};
	var onHandleUnhandled = function(promise){
	  task.call(global, function(){
	    var handler;
	    if(isNode){
	      process.emit('rejectionHandled', promise);
	    } else if(handler = global.onrejectionhandled){
	      handler({promise: promise, reason: promise._v});
	    }
	  });
	};
	var $reject = function(value){
	  var promise = this;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if(!promise._a)promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function(value){
	  var promise = this
	    , then;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if(promise === value)throw TypeError("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      microtask(function(){
	        var wrapper = {_w: promise, _d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch(e){
	    $reject.call({_w: promise, _d: false}, e); // wrap
	  }
	};

	// constructor polyfill
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor){
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch(err){
	      $reject.call(this, err);
	    }
	  };
	  Internal = function Promise(executor){
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__(135)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail   = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if(this._a)this._a.push(reaction);
	      if(this._s)notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	  PromiseCapability = function(){
	    var promise  = new Internal;
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject  = ctx($reject, promise, 1);
	  };
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
	__webpack_require__(66)($Promise, PROMISE);
	__webpack_require__(136)(PROMISE);
	Wrapper = __webpack_require__(10)[PROMISE];

	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = newPromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
	    var capability = newPromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(137)(function(iter){
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      var values    = []
	        , index     = 0
	        , remaining = 1;
	      forOf(iterable, false, function(promise){
	        var $index        = index++
	          , alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled  = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(29)
	  , TAG = __webpack_require__(67)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 126 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(11)
	  , call        = __webpack_require__(128)
	  , isArrayIter = __webpack_require__(129)
	  , anObject    = __webpack_require__(15)
	  , toLength    = __webpack_require__(32)
	  , getIterFn   = __webpack_require__(130)
	  , BREAK       = {}
	  , RETURN      = {};
	var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator, result;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if(result === BREAK || result === RETURN)return result;
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    result = call(iterator, f, step.value, entries);
	    if(result === BREAK || result === RETURN)return result;
	  }
	};
	exports.BREAK  = BREAK;
	exports.RETURN = RETURN;

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(15);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(61)
	  , ITERATOR   = __webpack_require__(67)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(125)
	  , ITERATOR  = __webpack_require__(67)('iterator')
	  , Iterators = __webpack_require__(61);
	module.exports = __webpack_require__(10).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(15)
	  , aFunction = __webpack_require__(12)
	  , SPECIES   = __webpack_require__(67)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(11)
	  , invoke             = __webpack_require__(133)
	  , html               = __webpack_require__(65)
	  , cel                = __webpack_require__(20)
	  , global             = __webpack_require__(9)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(29)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 133 */
/***/ function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(9)
	  , macrotask = __webpack_require__(132).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(29)(process) == 'process';

	module.exports = function(){
	  var head, last, notify;

	  var flush = function(){
	    var parent, fn;
	    if(isNode && (parent = process.domain))parent.exit();
	    while(head){
	      fn   = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch(e){
	        if(head)notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if(parent)parent.enter();
	  };

	  // Node.js
	  if(isNode){
	    notify = function(){
	      process.nextTick(flush);
	    };
	  // browsers with MutationObserver
	  } else if(Observer){
	    var toggle = true
	      , node   = document.createTextNode('');
	    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	    notify = function(){
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if(Promise && Promise.resolve){
	    var promise = Promise.resolve();
	    notify = function(){
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function(){
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }

	  return function(fn){
	    var task = {fn: fn, next: undefined};
	    if(last)last.next = task;
	    if(!head){
	      head = task;
	      notify();
	    } last = task;
	  };
	};

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	var hide = __webpack_require__(13);
	module.exports = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global      = __webpack_require__(9)
	  , core        = __webpack_require__(10)
	  , dP          = __webpack_require__(14)
	  , DESCRIPTORS = __webpack_require__(18)
	  , SPECIES     = __webpack_require__(67)('species');

	module.exports = function(KEY){
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(67)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _promise = __webpack_require__(122);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (fn) {
	  return function () {
	    var gen = fn.apply(this, arguments);
	    return new _promise2.default(function (resolve, reject) {
	      function step(key, arg) {
	        try {
	          var info = gen[key](arg);
	          var value = info.value;
	        } catch (error) {
	          reject(error);
	          return;
	        }

	        if (info.done) {
	          resolve(value);
	        } else {
	          return _promise2.default.resolve(value).then(function (value) {
	            return step("next", value);
	          }, function (err) {
	            return step("throw", err);
	          });
	        }
	      }

	      return step("next");
	    });
	  };
	};

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _types = __webpack_require__(108);

	var _ProfileStore = __webpack_require__(98);

	var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

	var _ProfileActions = __webpack_require__(118);

	var _ProfileActions2 = _interopRequireDefault(_ProfileActions);

	var _NotificationModalContainer = __webpack_require__(140);

	var _NotificationModalContainer2 = _interopRequireDefault(_NotificationModalContainer);

	var _PlayModalContainer = __webpack_require__(143);

	var _PlayModalContainer2 = _interopRequireDefault(_PlayModalContainer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ModalContainer = function (_Component) {
	  (0, _inherits3.default)(ModalContainer, _Component);

	  function ModalContainer() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, ModalContainer);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(ModalContainer)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      messages: [],
	      runningTournaments: []
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(ModalContainer, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _this2 = this;

	      _ProfileStore2.default.addChangeListener(function () {
	        _this2.setState({
	          messages: _ProfileStore2.default.getMyNews(),
	          runningTournaments: _ProfileStore2.default.getRunningTournaments(),

	          money: _ProfileStore2.default.getMoney()
	        });
	      });

	      _ProfileActions2.default.loadNews();
	    }
	  }, {
	    key: 'render',
	    value: function render(props, state) {
	      if (state.runningTournaments.length) {
	        console.warn('has running tournaments');
	        var tournaments = state.runningTournaments.map(function (tournamentID) {
	          return {
	            tournamentID: tournamentID,
	            gameUrl: _ProfileStore2.default.getGameUrl(tournamentID)
	          };
	        });
	        return (0, _preact.h)(_PlayModalContainer2.default, { tournaments: tournaments });
	      }

	      var messages = state.messages;

	      if (messages.length) {
	        return (0, _preact.h)(_NotificationModalContainer2.default, { message: messages[0], count: messages.length });
	      }

	      // $('#modal-standard').modal('hide');
	      return (0, _preact.h)('div', { style: 'display: none;' });
	    }
	  }]);
	  return ModalContainer;
	}(_preact.Component);

	exports.default = ModalContainer;

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(5);

	var _assign2 = _interopRequireDefault(_assign);

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _ProfileStore = __webpack_require__(98);

	var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

	var _ProfileActions = __webpack_require__(118);

	var _ProfileActions2 = _interopRequireDefault(_ProfileActions);

	var _constants = __webpack_require__(107);

	var c = _interopRequireWildcard(_constants);

	var _superagent = __webpack_require__(110);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _stats = __webpack_require__(109);

	var _stats2 = _interopRequireDefault(_stats);

	var _PackCard = __webpack_require__(141);

	var _PackCard2 = _interopRequireDefault(_PackCard);

	var _Modal = __webpack_require__(142);

	var _Modal2 = _interopRequireDefault(_Modal);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// state: Object,

	var NotificationModalContainer = function (_Component) {
	  (0, _inherits3.default)(NotificationModalContainer, _Component);

	  function NotificationModalContainer() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, NotificationModalContainer);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(NotificationModalContainer)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      visible: true
	    }, _this.skip = function (text, id) {
	      return (0, _preact.h)(
	        'button',
	        {
	          className: 'btn btn-primary',
	          onClick: _this.hide
	        },
	        text
	      );
	    }, _this.hide = function () {
	      // $("#modal-standard").modal('hide');
	      _this.setState({ visible: false });
	      _ProfileActions2.default.loadNews();
	    }, _this.answer = function (code, messageID) {
	      _superagent2.default.get('message/action/' + code + '/' + messageID);
	      _this.hide();
	    }, _this.modal_pic = function (name) {
	      return (0, _preact.h)(
	        'div',
	        null,
	        (0, _preact.h)('br', null),
	        (0, _preact.h)('img', { alt: '', style: 'width:100%', src: '/img/' + name })
	      );
	    }, _this.winningPicture = function () {
	      return _this.modal_pic('win_1.png');
	    }, _this.ratingPicture = function () {
	      return _this.modal_pic('win_2.jpg');
	    }, _this.losePicture = function () {
	      return _this.modal_pic('lose_1.jpg');
	    }, _this.getModalData = function (message, info, messageID) {
	      // console.log('getModalData');
	      var header = '';
	      var body = '';
	      var footer = '';
	      var invisible = false;

	      var money = _ProfileStore2.default.getMoney();

	      try {
	        var main = function main(m) {
	          return (0, _preact.h)(
	            'h3',
	            null,
	            m
	          );
	        };
	        switch (message.type) {
	          case c.NOTIFICATION_GIVE_MONEY:
	            header = 'Деньги, деньги, деньги!';
	            body = 'Вы получаете ' + info.ammount + 'руб на счёт!';
	            footer = _this.skip('Спасибо!', messageID);
	            break;
	          case c.NOTIFICATION_ACCEPT_MONEY:
	            header = 'Бонус!';
	            body = 'Примите ' + info.ammount + 'рублей на счёт!';

	            // footer = news.buttons.action(0, messageID, { text: 'Спасибо!' });
	            footer = (0, _preact.h)(
	              'a',
	              {
	                className: 'btn btn-primary',
	                onClick: function onClick() {
	                  _this.answer(0, messageID);
	                }
	              },
	              'Спасибо'
	            );
	            break;
	          case c.NOTIFICATION_CUSTOM:
	            header = info.header;
	            body = info.text;

	            if (info.imageUrl) {
	              body += _this.modal_pic(info.imageUrl);
	            }

	            footer = _this.skip('Хорошо', messageID);
	            break;
	          case c.NOTIFICATION_FIRST_MESSAGE:
	            var mainPrize = info.mainPrize;
	            header = 'С почином!';
	            // 'Проверь свои знания, участвуй в турнирах, и выигрывай ценные призы!'

	            body = 'Вы сыграли в первом турнире<br><br>';
	            body += 'Продолжайте играть и выигрывайте призы благодаря своим знаниям!';
	            footer = _this.skip('ОК', messageID);
	            break;
	          case c.NOTIFICATION_WIN_MONEY:
	            // {
	            //   tournamentID : data.tournamentID,
	            //   winners:winners,
	            //   count:winnerCount,
	            //   prizes:prizes
	            // }
	            console.log('messageID of NOTIFICATION_WIN_MONEY is', messageID);
	            var txt = main('Вы выиграли ' + info.prizes[0] + ' РУБ !! Так держать!');
	            header = 'Вы победили в турнире #' + info.tournamentID;

	            body = (0, _preact.h)(
	              'div',
	              null,
	              txt,
	              _this.winningPicture()
	            );

	            footer = _this.skip('Урра!', messageID);
	            break;
	          case c.NOTIFICATION_LOSE_TOURNAMENT:
	            header = 'Турнир #' + info.tournamentID + ' завершён';
	            body = main('Эх, не повезло( <br>В следующий раз точно получится!') + _this.losePicture();

	            footer = _this.skip('Продолжить', messageID);
	            break;
	          case c.NOTIFICATION_CARD_GIVEN:
	            // console.error('notification card given');
	            header = 'Вы получаете карточку!';
	            var card = info;
	            body = (0, _preact.h)(
	              'div',
	              null,
	              (0, _preact.h)(
	                'p',
	                { className: 'card-title' },
	                card.description
	              ),
	              (0, _preact.h)(_PackCard2.default, {
	                src: '/img/topics/realmadrid/' + card.photoURL,
	                description: card.description,
	                color: card.colour
	              })
	            );

	            var close = (0, _preact.h)(
	              'button',
	              { className: 'btn btn-default', onClick: _this.hide },
	              ' Закрыть '
	            );
	            var value = info.value || c.CARD_COLOUR_GRAY;
	            var btn = (0, _preact.h)(
	              'a',
	              { className: 'btn btn-primary', href: '/Packs' },
	              ' Подробнее '
	            );

	            if (!card.isFree) {
	              btn = (0, _preact.h)(
	                'button',
	                {
	                  className: 'btn btn-primary',
	                  onClick: function onClick() {
	                    _ProfileActions2.default.openPack(value, 1);
	                  }
	                },
	                'Открыть ещё!'
	              );
	            }

	            footer = (0, _preact.h)(
	              'div',
	              null,
	              btn,
	              close
	            );
	            break;
	          case c.NOTIFICATION_GIVE_PACK:
	            header = 'Вы получаете паки: ' + info.count + 'x';
	            body = drawPackButton(info.colour);
	            footer = _this.skip('Урра!', messageID);
	            break;
	          case c.NOTIFICATION_TOURNAMENT_START:
	            header = 'Турниры начинаются!';
	            body = 'КНОПКИ КНОПКИ';
	            footer = '';
	            break;
	          case c.MODAL_NO_TOURNAMENT_MONEY:
	            header = 'Упс... не хватает средств';
	            var diff = info.ammount - money;

	            body = (0, _preact.h)(
	              'div',
	              { className: 'card-title' },
	              'Пополните счёт и вы сможете сыграть в этом турнире!',
	              (0, _preact.h)('br', null),
	              'Стоимость участия: ',
	              info.ammount,
	              ' РУБ',
	              (0, _preact.h)('br', null),
	              'У вас на счету: ',
	              money,
	              ' РУБ'
	            );

	            footer = (0, _preact.h)(
	              'div',
	              null,
	              (0, _preact.h)(
	                'a',
	                {
	                  href: '/Payment?ammount=' + diff + '&buyType=' + 3,
	                  className: 'btn btn-primary',
	                  onClick: _stats2.default.pressedModalTournamentNoMoney
	                },
	                'Пополнить на ',
	                diff,
	                ' руб'
	              )
	            );
	            break;
	          case c.MODAL_NO_PACK_MONEY:
	            header = 'Упс... не хватает средств';
	            diff = info.ammount - money;

	            body = (0, _preact.h)(
	              'div',
	              { className: 'card-title' },
	              'Пополните счёт и вы сможете открыть этот пак!',
	              (0, _preact.h)('br', null),
	              'Стоимость пака: ',
	              info.ammount,
	              ' РУБ',
	              (0, _preact.h)('br', null),
	              'У вас на счету: ',
	              money,
	              ' РУБ'
	            );

	            footer = (0, _preact.h)(
	              'div',
	              null,
	              (0, _preact.h)(
	                'a',
	                {
	                  href: '/Payment?ammount=' + diff + '&buyType=' + 1,
	                  className: 'btn btn-primary',
	                  onClick: _stats2.default.pressedModalPackNoMoney
	                },
	                'Пополнить на ',
	                diff,
	                ' руб'
	              )
	            );
	            break;
	          default:
	            console.warn('no such modal type', message.type);
	            _ProfileActions2.default.report('no such modal type ' + message.type, 'NotificationModalContainer');
	            break;
	        }
	      } catch (e) {
	        console.error('error in modals', e);
	        _ProfileActions2.default.report(e, 'NotificationModalContainer switch');
	      }
	      return { header: header, body: body, footer: footer, invisible: invisible };
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(NotificationModalContainer, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {}

	    // buttons = {
	    //   action: (code, messageID, style) => {
	    //     return <a className="btn btn-primary" onClick={this.answer(code, messageID)}>{style.text}</a>;
	    //   },
	    // };

	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps() {
	      this.setState({ visible: true });
	    }
	  }, {
	    key: 'render',
	    value: function render(props, state) {
	      var message = props.message;
	      var data = message.data || {};
	      var messageID = message["_id"] || 0;

	      var modalData = this.getModalData(message, data, messageID);
	      var drawData = (0, _assign2.default)({}, modalData, { count: props.count, messageID: messageID });

	      return (0, _preact.h)(_Modal2.default, { data: drawData, hide: !state.visible, onClose: this.hide });
	    }
	  }]);
	  return NotificationModalContainer;
	}(_preact.Component);

	exports.default = NotificationModalContainer;

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (props) {
	  var style = {};
	  if (props.color > -1) {
	    style['background-image'] = 'url(\'/img/cardLayers/' + props.color + '.jpg\')';
	  }
	  // width="283" height="238"
	  // <p className="card-name white">{props.name}</p>
	  return (0, _preact.h)(
	    'div',
	    { className: 'pack-cover' },
	    (0, _preact.h)('img', {
	      border: '0',
	      alt: '',
	      className: 'pack-card pack-wrapper',
	      style: style,
	      src: props.src
	    }),
	    (0, _preact.h)(
	      'p',
	      { className: 'card-description' },
	      props.description
	    )
	  );
	};

	var _preact = __webpack_require__(1);

	var _superagent = __webpack_require__(110);

	var _superagent2 = _interopRequireDefault(_superagent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _superagent = __webpack_require__(110);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _ProfileActions = __webpack_require__(118);

	var _ProfileActions2 = _interopRequireDefault(_ProfileActions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Modal = function (_Component) {
	  (0, _inherits3.default)(Modal, _Component);

	  function Modal() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Modal);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Modal)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.markAsRead = function (id) {
	      console.log('Modal markAsRead', id);
	      _superagent2.default.post('/message/shown').send({ id: id }).end(function (err, res) {
	        if (err) throw err;
	        // console.log('Modal markAsRead callback', id, err, res);
	        // actions.loadNews();
	      });
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(Modal, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {}
	  }, {
	    key: 'render',
	    value: function render(props) {
	      var title = props.data.header;
	      if (props.data.count > 1) title += ' (' + props.data.count + ')';
	      var messageID = props.data.messageID;

	      if (messageID) this.markAsRead(messageID);

	      // const modalID = `modal-standard${messageID}`;
	      var modalID = 'modal-standard';
	      /*
	       <script>
	       $("#" + modalID).modal(props.hide ? 'hide' : 'show');
	       </script>
	        <div id={modalID} className="modal fade in" role="dialog">
	       */
	      // onClick={props.onClose}
	      // <div id={modalID} className={`modal ${className}`} role="dialog">
	      var className = props.hide ? 'modal fade hide' : 'modal show';
	      // <div style={{ display: props.hide ? 'none' : 'block' }}>
	      // <div id={modalID} className="modal fade" role="dialog">
	      return (0, _preact.h)(
	        'div',
	        { id: modalID, className: className, role: 'dialog' },
	        (0, _preact.h)(
	          'div',
	          { className: 'modal-dialog' },
	          (0, _preact.h)(
	            'div',
	            { className: 'modal-content' },
	            (0, _preact.h)(
	              'div',
	              { className: 'modal-header' },
	              (0, _preact.h)(
	                'button',
	                {
	                  type: 'button',
	                  className: 'close',
	                  'data-dismiss': 'modal',
	                  style: 'font-size: 40px;',
	                  onClick: props.onClose
	                },
	                ' ×'
	              ),
	              (0, _preact.h)(
	                'h4',
	                { className: 'modal-title' },
	                ' ',
	                title,
	                ' '
	              )
	            ),
	            (0, _preact.h)(
	              'div',
	              { className: 'modal-body', id: 'cBody' },
	              props.data.body
	            ),
	            (0, _preact.h)(
	              'div',
	              { className: 'modal-footer', id: 'cFooter' },
	              props.data.footer
	            )
	          )
	        )
	      );
	    }
	  }]);
	  return Modal;
	}(_preact.Component);
	// {$(`#${modalID}`).modal(props.hide ? 'hide' : 'show')}


	exports.default = Modal;

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _Modal = __webpack_require__(142);

	var _Modal2 = _interopRequireDefault(_Modal);

	var _ModalTest = __webpack_require__(144);

	var _ModalTest2 = _interopRequireDefault(_ModalTest);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// type ResponseType = {}

	// import store from '../../stores/ProfileStore';
	// import actions from '../../actions/ProfileActions';

	var PlayModalContainer = function (_Component) {
	  (0, _inherits3.default)(PlayModalContainer, _Component);

	  function PlayModalContainer() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, PlayModalContainer);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(PlayModalContainer)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      visible: true
	    }, _this.hide = function () {
	      _this.setState({ visible: false });
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(PlayModalContainer, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {}
	  }, {
	    key: 'render',
	    value: function render(props, state) {
	      var tournaments = props.tournaments;
	      console.warn('render runningTournaments', tournaments);
	      // return <ModalTest />;

	      if (!tournaments.length) return (0, _preact.h)('div', null);
	      // if (!tournaments.length) return <div></div>;

	      var header = 'Турниры начинаются!';
	      // const body = 'BODY';

	      var body = tournaments.map(function (t) {
	        var id = t.tournamentID;
	        // const gameUrl = store.getGameUrl(id);
	        var gameUrl = t.gameUrl;
	        // id="form1"
	        return (0, _preact.h)(
	          'form',
	          { method: 'post', action: gameUrl },
	          (0, _preact.h)('input', { type: 'hidden', name: 'login', value: login }),
	          (0, _preact.h)('input', {
	            type: 'submit',
	            className: 'btn btn-primary btn-lg',
	            value: 'Сыграть в турнир #' + id
	          })
	        );
	      });

	      var footer = (0, _preact.h)(
	        'button',
	        {
	          className: 'btn btn-default',
	          onClick: this.hide
	        },
	        'Закрыть'
	      );
	      // return <ModalTest />;
	      // if (!state.visible)
	      return (0, _preact.h)(_Modal2.default, {
	        data: { header: header, body: body, footer: footer, count: 0 },
	        hide: !state.visible,
	        onClose: this.hide
	      });
	    }
	  }]);
	  return PlayModalContainer;
	}(_preact.Component);

	exports.default = PlayModalContainer;

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ModalTest = function (_Component) {
	  (0, _inherits3.default)(ModalTest, _Component);

	  function ModalTest() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, ModalTest);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(ModalTest)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {}, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(ModalTest, [{
	    key: "componentWillMount",
	    value: function componentWillMount() {}
	  }, {
	    key: "render",
	    value: function render(props) {
	      return (0, _preact.h)(
	        "div",
	        null,
	        (0, _preact.h)(
	          "button",
	          {
	            type: "button",
	            className: "btn btn-info btn-lg",
	            "data-toggle": "modal",
	            "data-target": "#myModal"
	          },
	          "Open Modal"
	        ),
	        (0, _preact.h)(
	          "div",
	          { id: "myModal", className: "modal fade", role: "dialog" },
	          (0, _preact.h)(
	            "div",
	            { className: "modal-dialog" },
	            (0, _preact.h)(
	              "div",
	              { className: "modal-content" },
	              (0, _preact.h)(
	                "div",
	                { className: "modal-header" },
	                (0, _preact.h)(
	                  "button",
	                  { type: "button", className: "close", "data-dismiss": "modal" },
	                  "×"
	                ),
	                (0, _preact.h)(
	                  "h4",
	                  { className: "modal-title" },
	                  "Modal Header"
	                )
	              ),
	              (0, _preact.h)(
	                "div",
	                { className: "modal-body" },
	                (0, _preact.h)(
	                  "p",
	                  null,
	                  "Some text in the modal."
	                )
	              ),
	              (0, _preact.h)(
	                "div",
	                { className: "modal-footer" },
	                (0, _preact.h)(
	                  "button",
	                  { type: "button", className: "btn btn-default", "data-dismiss": "modal" },
	                  "Close"
	                )
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);
	  return ModalTest;
	}(_preact.Component);

	exports.default = ModalTest;

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _superagent = __webpack_require__(110);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _ProfileStore = __webpack_require__(98);

	var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

	var _ProfileActions = __webpack_require__(118);

	var _ProfileActions2 = _interopRequireDefault(_ProfileActions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Chat = function (_Component) {
	  (0, _inherits3.default)(Chat, _Component);

	  function Chat() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Chat);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Chat)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      messages: [],
	      text: ''
	    }, _this.appendMessage = function (sender, text) {
	      // $("#messages").append($("<p>").text(login + " : " + text));
	      _this.scrollToMessageEnd();
	      var messages = _this.state.messages;
	      messages.push({ sender: sender, text: text });
	      _this.setMessages(messages);
	    }, _this.setMessages = function (messages) {
	      _this.setState({ messages: messages });
	    }, _this.loadMessages = function () {
	      _ProfileActions2.default.loadChatMessages();
	      setTimeout(_this.scrollToMessageEnd, 100);
	      // setAsync('/messages/chat/recent', {}, this.drawMessages)

	      // request
	      //   .post('/messages/chat/recent')
	      //   .end((err, res: ResponseType) => {
	      //     const messages = res.body.msg
	      //       .reverse()
	      //       .map(item => {
	      //         return { sender: item.senderName, text: item.text };
	      //       });
	      //     this.setMessages(messages);
	      //     this.scrollToMessageEnd();
	      //   });
	    }, _this.scrollToMessageEnd = function () {
	      setTimeout(function () {
	        var elem = document.getElementById('messages');
	        elem.scrollTop = elem.scrollHeight;
	      }, 100);
	    }, _this.getText = function () {
	      var text = document.getElementById('m').value;
	      console.log(text);
	      _this.setState({ text: text });
	    }, _this.sendMessage = function () {
	      // console.log('sendMessage');
	      var text = _this.state.text;
	      _this.scrollToMessageEnd();
	      if (!text) return;

	      // actions.sendMessage(text, login || 'nil');
	      // this.state.socket.emit('chat message', { text, login });
	      socket.emit('chat message', { text: text, login: login });
	      _this.setState({ text: '' });
	    }, _this.onEnter = function (e) {
	      var KEY_CODE_ENTER = 13;
	      if (e.keyCode === KEY_CODE_ENTER) {
	        _this.sendMessage();
	      }
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(Chat, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _this2 = this;

	      _ProfileStore2.default.addChangeListener(function () {
	        _this2.setState({
	          messages: _ProfileStore2.default.getChatMessages()
	        });
	      });
	      this.loadMessages();
	    }
	  }, {
	    key: 'render',
	    value: function render(props, state) {
	      var messageList = state.messages.map(function (m, i, arr) {
	        if (!m) return '';
	        var style = '';
	        if (m.sender === login) {
	          style = 'color: gold;';
	        }
	        var text = (m.sender || 'Гость') + ': ' + m.text;
	        if (i === arr.length - 1) {
	          return (0, _preact.h)(
	            'p',
	            { id: 'chat', className: 'chat-text', style: style },
	            text
	          );
	        }
	        return (0, _preact.h)(
	          'p',
	          { className: 'chat-text', style: style },
	          text
	        );
	      });
	      /*
	        <link rel="stylesheet" type="text/css" href="/css/chat1.css" />
	      */
	      return (0, _preact.h)(
	        'div',
	        { className: 'full', style: 'max-width: 600px;' },
	        (0, _preact.h)(
	          'h2',
	          { className: 'page' },
	          'Чат'
	        ),
	        (0, _preact.h)(
	          'ul',
	          { id: 'messages', style: 'max-height:300px; overflow:auto;' },
	          messageList
	        ),
	        (0, _preact.h)(
	          'input',
	          {
	            id: 'm',
	            className: 'circle-input full',
	            style: '',
	            autoComplete: 'off',
	            onInput: this.getText,
	            onKeyDown: this.onEnter,
	            value: state.text
	          },
	          state.text
	        ),
	        (0, _preact.h)('br', null),
	        (0, _preact.h)(
	          'button',
	          {
	            className: 'btn btn-primary btn-lg',
	            onClick: this.sendMessage,
	            style: 'margin-top: 10px;'
	          },
	          'Отправить'
	        )
	      );
	    }
	  }]);
	  return Chat;
	}(_preact.Component);

	exports.default = Chat;

/***/ },
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
		 true ? module.exports = factory(__webpack_require__(1)) :
		typeof define === 'function' && define.amd ? define(['preact'], factory) :
		(global.preactRouter = factory(global.preact));
	}(this, function (preact) { 'use strict';

		var babelHelpers = {};

		babelHelpers.classCallCheck = function (instance, Constructor) {
		  if (!(instance instanceof Constructor)) {
		    throw new TypeError("Cannot call a class as a function");
		  }
		};

		babelHelpers.extends = Object.assign || function (target) {
		  for (var i = 1; i < arguments.length; i++) {
		    var source = arguments[i];

		    for (var key in source) {
		      if (Object.prototype.hasOwnProperty.call(source, key)) {
		        target[key] = source[key];
		      }
		    }
		  }

		  return target;
		};

		babelHelpers.inherits = function (subClass, superClass) {
		  if (typeof superClass !== "function" && superClass !== null) {
		    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		  }

		  subClass.prototype = Object.create(superClass && superClass.prototype, {
		    constructor: {
		      value: subClass,
		      enumerable: false,
		      writable: true,
		      configurable: true
		    }
		  });
		  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
		};

		babelHelpers.objectWithoutProperties = function (obj, keys) {
		  var target = {};

		  for (var i in obj) {
		    if (keys.indexOf(i) >= 0) continue;
		    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
		    target[i] = obj[i];
		  }

		  return target;
		};

		babelHelpers.possibleConstructorReturn = function (self, call) {
		  if (!self) {
		    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		  }

		  return call && (typeof call === "object" || typeof call === "function") ? call : self;
		};

		babelHelpers;

		var EMPTY$1 = {};

		function exec(url, route) {
			var opts = arguments.length <= 2 || arguments[2] === undefined ? EMPTY$1 : arguments[2];

			var reg = /(?:\?([^#]*))?(#.*)?$/,
			    c = url.match(reg),
			    matches = {},
			    ret = void 0;
			if (c && c[1]) {
				var p = c[1].split('&');
				for (var i = 0; i < p.length; i++) {
					var r = p[i].split('=');
					matches[decodeURIComponent(r[0])] = decodeURIComponent(r.slice(1).join('='));
				}
			}
			url = segmentize(url.replace(reg, ''));
			route = segmentize(route || '');
			var max = Math.max(url.length, route.length);
			for (var _i = 0; _i < max; _i++) {
				if (route[_i] && route[_i].charAt(0) === ':') {
					var param = route[_i].replace(/(^\:|[+*?]+$)/g, ''),
					    flags = (route[_i].match(/[+*?]+$/) || EMPTY$1)[0] || '',
					    plus = ~flags.indexOf('+'),
					    star = ~flags.indexOf('*'),
					    val = url[_i] || '';
					if (!val && !star && (flags.indexOf('?') < 0 || plus)) {
						ret = false;
						break;
					}
					matches[param] = decodeURIComponent(val);
					if (plus || star) {
						matches[param] = url.slice(_i).map(decodeURIComponent).join('/');
						break;
					}
				} else if (route[_i] !== url[_i]) {
					ret = false;
					break;
				}
			}
			if (opts.default !== true && ret === false) return false;
			return matches;
		}

		function pathRankSort(a, b) {
			var aAttr = a.attributes || EMPTY$1,
			    bAttr = b.attributes || EMPTY$1;
			if (aAttr.default) return 1;
			if (bAttr.default) return -1;
			var diff = rank(aAttr.path) - rank(bAttr.path);
			return diff || aAttr.path.length - bAttr.path.length;
		}

		function segmentize(url) {
			return strip(url).split('/');
		}

		function rank(url) {
			return (strip(url).match(/\/+/g) || '').length;
		}

		function strip(url) {
			return url.replace(/(^\/+|\/+$)/g, '');
		}

		var ROUTERS = [];

		var EMPTY = {};

		function route(url) {
			var replace = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			if (typeof url !== 'string' && url.url) {
				replace = url.replace;
				url = url.url;
			}
			if (typeof history !== 'undefined' && history.pushState) {
				if (replace === true) {
					history.replaceState(null, null, url);
				} else {
					history.pushState(null, null, url);
				}
			}
			return routeTo(url);
		}

		function routeTo(url) {
			var didRoute = false;
			ROUTERS.forEach(function (router) {
				if (router.routeTo(url) === true) {
					didRoute = true;
				}
			});
			return didRoute;
		}

		function getCurrentUrl() {
			var url = typeof location !== 'undefined' ? location : EMPTY;
			return '' + (url.pathname || '') + (url.search || '');
		}

		function routeFromLink(node) {
			// only valid elements
			if (!node || !node.getAttribute) return;

			var href = node.getAttribute('href'),
			    target = node.getAttribute('target');

			// ignore links with targets and non-path URLs
			if (!href || !href.match(/^\//g) || target && !target.match(/^_?self$/i)) return;

			// attempt to route, if no match simply cede control to browser
			return route(href);
		}

		function handleLinkClick(e) {
			routeFromLink(e.currentTarget || e.target || this);
			return prevent(e);
		}

		function prevent(e) {
			if (e) {
				if (e.stopImmediatePropagation) e.stopImmediatePropagation();
				if (e.stopPropagation) e.stopPropagation();
				e.preventDefault();
			}
			return false;
		}

		function delegateLinkHandler(e) {
			// ignore events the browser takes care of already:
			if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;

			var t = e.target;
			do {
				if (String(t.nodeName).toUpperCase() === 'A' && t.getAttribute('href')) {
					// if link is handled by the router, prevent browser defaults
					if (routeFromLink(t)) {
						return prevent(e);
					}
				}
			} while (t = t.parentNode);
		}

		if (typeof addEventListener === 'function') {
			addEventListener('popstate', function () {
				return routeTo(getCurrentUrl());
			});
			addEventListener('click', delegateLinkHandler);
		}

		var Link = function (_ref) {
			var children = _ref.children;
			var props = babelHelpers.objectWithoutProperties(_ref, ['children']);
			return preact.h(
				'a',
				babelHelpers.extends({}, props, { onClick: handleLinkClick }),
				children
			);
		};

		var Router = function (_Component) {
			babelHelpers.inherits(Router, _Component);

			function Router() {
				var _temp, _this, _ret;

				babelHelpers.classCallCheck(this, Router);

				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
					url: _this.props.url || getCurrentUrl()
				}, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
			}

			Router.prototype.shouldComponentUpdate = function shouldComponentUpdate(props) {
				if (props.static !== true) return true;
				return props.url !== this.props.url || props.onChange !== this.props.onChange;
			};

			Router.prototype.routeTo = function routeTo(url) {
				this._didRoute = false;
				this.setState({ url: url });
				this.forceUpdate();
				return this._didRoute;
			};

			Router.prototype.componentWillMount = function componentWillMount() {
				ROUTERS.push(this);
			};

			Router.prototype.componentWillUnmount = function componentWillUnmount() {
				ROUTERS.splice(ROUTERS.indexOf(this), 1);
			};

			Router.prototype.render = function render(_ref2, _ref3) {
				var children = _ref2.children;
				var onChange = _ref2.onChange;
				var url = _ref3.url;

				var active = children.slice().sort(pathRankSort).filter(function (_ref4) {
					var attributes = _ref4.attributes;

					var path = attributes.path,
					    matches = exec(url, path, attributes);
					if (matches) {
						attributes.url = url;
						attributes.matches = matches;
						// copy matches onto props
						for (var i in matches) {
							if (matches.hasOwnProperty(i)) {
								attributes[i] = matches[i];
							}
						}
						return true;
					}
				});

				var current = active[0] || null;
				this._didRoute = !!current;

				var previous = this.previousUrl;
				if (url !== previous) {
					this.previousUrl = url;
					if (typeof onChange === 'function') {
						onChange({
							router: this,
							url: url,
							previous: previous,
							active: active,
							current: current
						});
					}
				}

				return current;
			};

			return Router;
		}(preact.Component);

		var Route = function (_ref5) {
			var RoutedComponent = _ref5.component;
			var url = _ref5.url;
			var matches = _ref5.matches;
			return preact.h(RoutedComponent, { url: url, matches: matches });
		};

		Router.route = route;
		Router.Router = Router;
		Router.Route = Route;
		Router.Link = Link;

		return Router;

	}));
	//# sourceMappingURL=preact-router.js.map

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.About = exports.Payment = exports.Tournaments = exports.Profile = exports.Packs = exports.Home = undefined;

	var _Home2 = __webpack_require__(151);

	var _Home3 = _interopRequireDefault(_Home2);

	var _Packs2 = __webpack_require__(153);

	var _Packs3 = _interopRequireDefault(_Packs2);

	var _Profile2 = __webpack_require__(158);

	var _Profile3 = _interopRequireDefault(_Profile2);

	var _Tournaments2 = __webpack_require__(160);

	var _Tournaments3 = _interopRequireDefault(_Tournaments2);

	var _Payment2 = __webpack_require__(164);

	var _Payment3 = _interopRequireDefault(_Payment2);

	var _About2 = __webpack_require__(167);

	var _About3 = _interopRequireDefault(_About2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Home = _Home3.default;
	exports.Packs = _Packs3.default;
	exports.Profile = _Profile3.default;
	exports.Tournaments = _Tournaments3.default;
	exports.Payment = _Payment3.default;
	exports.About = _About3.default;

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _Index = __webpack_require__(152);

	var _Index2 = _interopRequireDefault(_Index);

	var _index = __webpack_require__(96);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Home = function (_Component) {
	    (0, _inherits3.default)(Home, _Component);

	    function Home() {
	        (0, _classCallCheck3.default)(this, Home);
	        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Home).apply(this, arguments));
	    }

	    (0, _createClass3.default)(Home, [{
	        key: 'render',
	        value: function render() {
	            return (0, _preact.h)(_index2.default, { content: (0, _preact.h)(_Index2.default, null), nochat: true, nofooter: true, active: 'Index' });
	        }
	    }]);
	    return Home;
	}(_preact.Component);

	exports.default = Home;

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _ProfileStore = __webpack_require__(98);

	var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

	var _ProfileActions = __webpack_require__(118);

	var _ProfileActions2 = _interopRequireDefault(_ProfileActions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Index = function (_Component) {
	  (0, _inherits3.default)(Index, _Component);

	  function Index() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Index);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Index)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      copied: false
	    }, _this.CopyShareLink = function () {
	      var id = 'invite-link';
	      var node = document.getElementById(id);
	      node.select();
	      document.execCommand('copy');
	      node.blur();
	      _this.setState({ copied: true });
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(Index, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      // store.addChangeListener(() => {
	      //   this.setState({
	      //     registeredIn: store.getMyTournaments(),
	      //     money: store.getMoney(),
	      //     value: store.getTestValue(),
	      //     tournaments: store.getAvailableTournaments(),
	      //   });
	      // });

	      _ProfileActions2.default.initialize();
	    }
	  }, {
	    key: 'render',
	    value: function render(props, state) {
	      var dailyFreeroll = (0, _preact.h)(
	        'div',
	        { className: 'freeroll ctr green' },
	        (0, _preact.h)(
	          'div',
	          { className: 'white' },
	          (0, _preact.h)(
	            'h1',
	            { className: 'fadeText' },
	            ' Выиграй 50 рублей в бесплатной викторине!'
	          ),
	          (0, _preact.h)(
	            'p',
	            null,
	            (0, _preact.h)(
	              'div',
	              null,
	              'Время начала - 20:00 (каждый день)'
	            ),
	            (0, _preact.h)(
	              'div',
	              null,
	              'Присоединяйся!'
	            )
	          ),
	          (0, _preact.h)(
	            'center',
	            null,
	            (0, _preact.h)(
	              'a',
	              {
	                className: 'btn btn-primary btn-large btn-lg btn-fixed',
	                href: '/Tournaments#daily'
	              },
	              'Участвовать'
	            )
	          )
	        )
	      );

	      var weeklyFreeroll = (0, _preact.h)(
	        'div',
	        { className: 'freeroll ctr red' },
	        (0, _preact.h)(
	          'div',
	          { className: 'white' },
	          (0, _preact.h)(
	            'h1',
	            { className: 'fadeText' },
	            'Сорви куш в ТОП турнирах!'
	          ),
	          (0, _preact.h)(
	            'p',
	            null,
	            (0, _preact.h)(
	              'div',
	              null,
	              'Участвуй в турнирах с большими призами'
	            ),
	            (0, _preact.h)(
	              'div',
	              null,
	              'Выиграй вплоть до 5000 рублей'
	            ),
	            (0, _preact.h)(
	              'div',
	              null,
	              'Стоимость участия в главном турнире - 50 рублей'
	            )
	          ),
	          (0, _preact.h)(
	            'center',
	            null,
	            (0, _preact.h)(
	              'a',
	              {
	                className: 'btn btn-primary btn-large btn-lg btn-fixed',
	                href: '/Tournaments#top'
	              },
	              'Участвовать '
	            )
	          )
	        )
	      );

	      /*
	       <hr width="40%" />
	       <p>Если вы (или ваш друг) выиграете в ежедневном бесплатном турнире,</p>
	       <p>то вся команда получит вплоть до 150 рублей</p>
	       <p>(в зависимости от размера команды)</p>
	       */
	      var link = 'http://online-tournaments.org/register?inviter=' + login;
	      // <a className="btn btn-primary btn-large btn-lg" href="/Team">Создать команду</a>
	      var teamTab = (0, _preact.h)(
	        'div',
	        null,
	        (0, _preact.h)(
	          'div',
	          { className: 'freeroll ctr purple' },
	          (0, _preact.h)(
	            'div',
	            { className: 'white' },
	            (0, _preact.h)(
	              'h1',
	              { className: 'fadeText' },
	              'Раздели радость побед с друзьями'
	            ),
	            (0, _preact.h)(
	              'p',
	              { className: 'center' },
	              (0, _preact.h)(
	                'div',
	                null,
	                'Отправь ссылку друзьям и участвуй с ними в турнирах'
	              ),
	              (0, _preact.h)(
	                'div',
	                null,
	                'Если они займут призовое место в бесплатном турнире'
	              ),
	              (0, _preact.h)(
	                'div',
	                null,
	                'ты получишь дополнительные 50% от их выигрыша!'
	              )
	            ),
	            (0, _preact.h)(
	              'div',
	              {
	                style: {
	                  display: login ? 'block' : 'none'
	                }
	              },
	              (0, _preact.h)(
	                'center',
	                null,
	                (0, _preact.h)(
	                  'input',
	                  {
	                    id: 'invite-link',
	                    type: 'text',
	                    className: 'black circle-input',
	                    value: link,
	                    onClick: this.CopyShareLink
	                  },
	                  link
	                ),
	                (0, _preact.h)(
	                  'a',
	                  {
	                    className: 'btn btn-primary btn-large btn-lg',
	                    onClick: this.CopyShareLink
	                  },
	                  'Скопировать ссылку'
	                ),
	                (0, _preact.h)(
	                  'p',
	                  {
	                    style: {
	                      display: state.copied ? 'block' : 'none'
	                    }
	                  },
	                  'Ссылка скопирована'
	                )
	              )
	            )
	          )
	        )
	      );

	      return (0, _preact.h)(
	        'div',
	        null,
	        (0, _preact.h)(
	          'div',
	          { className: 'big-cards-container' },
	          (0, _preact.h)(
	            'ul',
	            { style: 'display: table-row;' },
	            (0, _preact.h)(
	              'li',
	              { style: 'display: table-cell; width: 320px; float: left' },
	              (0, _preact.h)('div', { className: 'card-container-semi' })
	            ),
	            (0, _preact.h)(
	              'li',
	              { style: 'display: table-cell; width: 320px; float: right;' },
	              (0, _preact.h)('div', { className: 'card-container-semi' })
	            )
	          )
	        ),
	        (0, _preact.h)('div', { className: 'col-lg-12 col-sm-12 col-md-12 col-xs-12' }),
	        (0, _preact.h)(
	          'div',
	          { id: 'WeeklyFreeroll', className: 'row', style: 'height: inherit;' },
	          weeklyFreeroll
	        ),
	        (0, _preact.h)(
	          'div',
	          { id: 'Freeroll', className: 'row', style: 'height: inherit;' },
	          dailyFreeroll
	        ),
	        (0, _preact.h)(
	          'div',
	          { className: 'row' },
	          teamTab
	        )
	      );
	    }
	  }]);
	  return Index;
	}(_preact.Component);

	exports.default = Index;

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _Packs = __webpack_require__(154);

	var _Packs2 = _interopRequireDefault(_Packs);

	var _index = __webpack_require__(96);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PackPage = function (_Component) {
	  (0, _inherits3.default)(PackPage, _Component);

	  function PackPage() {
	    (0, _classCallCheck3.default)(this, PackPage);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PackPage).apply(this, arguments));
	  }

	  (0, _createClass3.default)(PackPage, [{
	    key: 'render',
	    value: function render() {
	      console.log('PackPage page');
	      // return <div>aaaa</div>;
	      return (0, _preact.h)(_index2.default, { content: (0, _preact.h)(_Packs2.default, null), nochat: true, active: 'Packs' });
	    }
	  }]);
	  return PackPage;
	}(_preact.Component);

	exports.default = PackPage;

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _superagent = __webpack_require__(110);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _ModalContainer = __webpack_require__(139);

	var _ModalContainer2 = _interopRequireDefault(_ModalContainer);

	var _PackCard = __webpack_require__(141);

	var _PackCard2 = _interopRequireDefault(_PackCard);

	var _Pack = __webpack_require__(155);

	var _Pack2 = _interopRequireDefault(_Pack);

	var _PackGallery = __webpack_require__(157);

	var _PackGallery2 = _interopRequireDefault(_PackGallery);

	var _SocketListener = __webpack_require__(117);

	var _SocketListener2 = _interopRequireDefault(_SocketListener);

	var _ProfileActions = __webpack_require__(118);

	var _ProfileActions2 = _interopRequireDefault(_ProfileActions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import Chat from '../components/Activity/Chat';


	function openPack(packID, pay) {
	  console.log('openPack pack page', packID, pay);
	  _ProfileActions2.default.openPack(packID, pay);
	  // request
	  //   .post(`openPack/${packID}/${pay}`)
	  //   .end(console.log);
	}

	var standardPacks = [{
	  src: '/img/topics/realmadrid.jpg',
	  name: 'realmadrid',
	  id: 1
	}, {
	  src: '/img/topics/bale.jpg',
	  name: 'bale',
	  id: 2
	}, {
	  src: '/img/topics/manutd.jpg',
	  name: 'manutd',
	  id: 3
	}, {
	  src: '/img/topics/realmadrid.jpg',
	  name: 'realmadrid',
	  id: 1
	}, {
	  src: '/img/topics/bale.jpg',
	  name: 'bale',
	  id: 2
	}, {
	  src: '/img/topics/manutd.jpg',
	  name: 'manutd',
	  id: 3
	}, {
	  src: '/img/topics/realmadrid.jpg',
	  name: 'realmadrid',
	  id: 1
	}, {
	  src: '/img/topics/bale.jpg',
	  name: 'bale',
	  id: 2
	}, {
	  src: '/img/topics/manutd.jpg',
	  name: 'manutd',
	  id: 3
	}, {
	  src: '/img/topics/realmadrid.jpg',
	  name: 'realmadrid',
	  id: 1
	}, {
	  src: '/img/topics/bale.jpg',
	  name: 'bale',
	  id: 2
	}, {
	  src: '/img/topics/manutd.jpg',
	  name: 'manutd',
	  id: 3
	}];

	// PACKS.map(p => ({ src: p.image, packID: p.packID, name: p.topic, price: p.price })) ||

	var PackPage = function (_Component) {
	  (0, _inherits3.default)(PackPage, _Component);

	  function PackPage() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, PackPage);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(PackPage)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      cards: [{
	        name: '2000 рублей',
	        description: '2000 рублей на счёт',
	        // src: '../../gifts/1000.png',
	        src: '../../gifts/gold1.png',
	        color: 0
	      }, {
	        name: '500 рублей',
	        description: '500 рублей на счёт',
	        src: '../../gifts/gold1.png',
	        color: 1
	      }, {
	        name: '100 рублей',
	        description: '100 рублей на счёт',
	        src: '../../gifts/gold1.png',
	        color: 2
	      }, {
	        name: 'Футболка',
	        description: 'Выиграй футболку любимого клуба и мы подарим её тебе!',
	        src: '../../gifts/shirt.jpg',
	        color: 1
	      }, {
	        name: 'Футболка',
	        description: 'Выиграй футболку любимого клуба и мы подарим её тебе!',
	        src: '../../gifts/shirt2.jpg',
	        color: 1
	      }, {
	        name: 'Футболка',
	        description: 'Выиграй футболку любимого клуба и мы подарим её тебе!',
	        src: '../../gifts/shirt3.jpg',
	        color: 1
	      }, {
	        name: 'Карточка Модрича',
	        description: 'Карточка Модрича для игры в Funny Football',
	        src: '19.png',
	        color: 1
	      }, {
	        name: 'Карточка Модрича',
	        description: 'Карточка Модрича для игры в Funny Football',
	        src: '19.png',
	        color: 1
	      }, {
	        name: 'Карточка Модрича',
	        description: 'Карточка Модрича для игры в Funny Football',
	        src: '19.png',
	        color: 1
	      }],

	      chosenPack: -1,
	      allPacks: standardPacks,

	      packs: [{
	        price: 100,
	        buttons: [],
	        color: 0,
	        frees: []
	      }]
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(PackPage, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      _ProfileActions2.default.initialize();
	    }
	  }, {
	    key: 'openFree',
	    value: function openFree(packId) {
	      return function () {
	        openPack(packId, 0);
	      };
	    }
	  }, {
	    key: 'openPaid',
	    value: function openPaid(packId) {
	      return function () {
	        openPack(packId, 1);
	      };
	    }
	  }, {
	    key: 'chosePack',
	    value: function chosePack(id) {
	      // console.log('chosePack', id);
	      this.setState({ chosenPack: id });
	      window.scrollTo(0, 0);
	    }
	  }, {
	    key: 'choseAnother',
	    value: function choseAnother() {
	      this.setState({ chosenPack: -1 });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var chosenPack = this.state.chosenPack;
	      console.log('chosenPack', chosenPack, this.state);
	      // <div className="col-sm-3 col-md-3 col-xs-12">
	      var CardList = this.state.cards.map(function (card) {
	        return (0, _preact.h)(
	          'div',
	          { className: 'col-md-4 col-sm-6 col-xs-12' },
	          (0, _preact.h)(_PackCard2.default, {
	            name: card.name,
	            description: card.description,
	            src: '/img/topics/realmadrid/' + card.src,
	            color: card.color
	          })
	        );
	      });

	      var PackList = '';
	      var packIndex = 0;
	      this.state.allPacks.forEach(function (pack, index) {
	        // <div className="col-sm-3 col-md-3 col-xs-6 killPaddings">
	        // console.log('iterate...', pack, index, 'chosenPack', chosenPack);
	        if (chosenPack === pack.packID) {
	          packIndex = index;
	          PackList = (0, _preact.h)('div', {
	            className: 'pack img-wrapper',
	            style: 'margin-bottom: 0px; background-image: url(' + pack.src + ');'
	          });
	        }
	      });
	      // style="margin: 0 auto; display: block;"

	      var content = '';
	      if (chosenPack < 0) {
	        content = (0, _preact.h)(_PackGallery2.default, {
	          chosePack: this.chosePack.bind(this),
	          packs: this.state.allPacks
	        });
	      } else {
	        content = (0, _preact.h)(
	          'div',
	          null,
	          (0, _preact.h)(
	            'div',
	            {
	              className: 'row pack-container light-blue-big',
	              style: 'margin-top: 15px;'
	            },
	            PackList,
	            (0, _preact.h)('br', null),
	            (0, _preact.h)('br', null),
	            (0, _preact.h)(
	              'button',
	              {
	                className: 'btn btn-primary btn-lg btn-block',
	                style: 'border-radius: 0;',
	                onClick: this.openPaid(chosenPack)
	              },
	              'Открыть пак за ',
	              this.state.allPacks[packIndex].price || 30,
	              ' руб'
	            )
	          ),
	          (0, _preact.h)('br', null),
	          (0, _preact.h)(
	            'a',
	            {
	              onClick: this.choseAnother.bind(this),
	              style: 'cursor: pointer; text-underline: none;'
	            },
	            'выбрать другой пак'
	          ),
	          (0, _preact.h)('br', null),
	          (0, _preact.h)(
	            'h1',
	            { className: 'text-center' },
	            ' Что может выпасть в этом паке? '
	          ),
	          (0, _preact.h)(
	            'div',
	            { className: 'col-sm-12 col-md-12 col-xs-12 killPaddings' },
	            CardList
	          )
	        );
	      }

	      return (0, _preact.h)(
	        'div',
	        null,
	        (0, _preact.h)(
	          'div',
	          { className: 'white text-center' },
	          content
	        )
	      );
	    }
	  }]);
	  return PackPage;
	}(_preact.Component);

	exports.default = PackPage;

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (props) {
	  var style = {};
	  if (props.pack.color > -1) {
	    style['background-image'] = 'url(\'/img/cardLayers/' + props.pack.color + '.jpg\')';
	  }

	  return (0, _preact.h)(
	    'div',
	    null,
	    (0, _preact.h)('img', { border: '0', alt: '', className: 'card img-wrapper', style: style, src: '/img/topics/realmadrid/pack.png' }),
	    (0, _preact.h)(_PackButtons2.default, { onClick: props.onClick, onClickFree: props.onClickFree, pack: props.pack })
	  );
	};

	var _preact = __webpack_require__(1);

	var _PackButtons = __webpack_require__(156);

	var _PackButtons2 = _interopRequireDefault(_PackButtons);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (props) {
	  // console.log('PackButtons.js', props);
	  var buttons = props.pack.frees.map(function (value, i) {
	    var text = '';
	    var className = '';
	    var onClick = void 0;

	    if (value > 0) {
	      text = (0, _preact.h)(
	        'span',
	        null,
	        ' Открыть ',
	        (0, _preact.h)('br', null),
	        ' бесплатно (',
	        value,
	        'X) '
	      );
	      className = 'btn btn-success full';
	      onClick = props.onClickFree;
	    } else {
	      text = 'Открыть за ' + props.pack.buttons[i] + ' РУБ';
	      className = 'btn btn-primary full btn-lg';
	      onClick = props.onClick;
	    }

	    return (0, _preact.h)(
	      'div',
	      null,
	      (0, _preact.h)(
	        'button',
	        { className: className, onClick: onClick },
	        text
	      ),
	      (0, _preact.h)('br', null),
	      (0, _preact.h)('br', null)
	    );
	  });

	  return (0, _preact.h)(
	    'div',
	    null,
	    buttons
	  );
	};

	var _preact = __webpack_require__(1);

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (props) {
	  // col-sm-4 white img-wrapper nopadding
	  var gallery = props.packs.map(function (pack) {
	    console.log('gallery', pack);
	    return (0, _preact.h)('div', {
	      className: 'pack img-wrapper light-blue-big',
	      style: {
	        'background-image': 'url(' + pack.src + ')'
	      }
	      // src={pack.src}
	      // alt={pack.name}
	      , // width: '100%',
	      // height: '100%',
	      onClick: chosePack(pack.packID, props)
	    });
	  });

	  return (0, _preact.h)(
	    'div',
	    null,
	    (0, _preact.h)(
	      'h2',
	      { className: 'page' },
	      'Выберите пак'
	    ),
	    gallery
	  );
	};

	var _preact = __webpack_require__(1);

	// import PackButtons from './PackButtons';

	function chosePack(id, props) {
	  return function () {
	    props.chosePack(id);
	  };
	} /**
	   * Created by gaginho on 07.06.16.
	   */

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _Profile = __webpack_require__(159);

	var _Profile2 = _interopRequireDefault(_Profile);

	var _index = __webpack_require__(96);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var elements = (0, _preact.h)(_index2.default, { content: (0, _preact.h)(_Profile2.default, null), nochat: true, active: 'Profile' });

	var ProfilePage = function (_Component) {
	  (0, _inherits3.default)(ProfilePage, _Component);

	  function ProfilePage() {
	    (0, _classCallCheck3.default)(this, ProfilePage);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ProfilePage).apply(this, arguments));
	  }

	  (0, _createClass3.default)(ProfilePage, [{
	    key: 'render',
	    value: function render() {
	      return elements;
	    }
	  }]);
	  return ProfilePage;
	}(_preact.Component);

	exports.default = ProfilePage;

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _ProfileStore = __webpack_require__(98);

	var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

	var _ProfileActions = __webpack_require__(118);

	var _ProfileActions2 = _interopRequireDefault(_ProfileActions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Profile = function (_Component) {
	  (0, _inherits3.default)(Profile, _Component);

	  function Profile() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Profile);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Profile)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      deposit: 200,
	      cashout: 500,

	      money: 0,
	      registeredIn: []
	    }, _this.onDepositInput = function () {
	      var deposit = document.getElementById("deposit").value;
	      _this.setState({ deposit: deposit });
	    }, _this.onCashoutInput = function () {
	      var cashout = document.getElementById("cashout").value;
	      _this.setState({ cashout: cashout });
	    }, _this.getTournamentRegs = function (state) {
	      // console.log(state);
	      var registeredIn = state.registeredIn;

	      if (!registeredIn.length) {
	        return '';
	      }

	      if (!registeredIn.length) {
	        return (0, _preact.h)(
	          "div",
	          null,
	          (0, _preact.h)(
	            "div",
	            { className: "text-center white" },
	            (0, _preact.h)(
	              "h3",
	              null,
	              "Вы не зарегистрированы ни в одном турнире(("
	            ),
	            (0, _preact.h)(
	              "a",
	              { href: "Tournaments", className: "btn btn-primary pointer" },
	              "Начните играть !"
	            ),
	            (0, _preact.h)("br", null),
	            (0, _preact.h)("br", null)
	          )
	        );
	      }

	      var tournaments = registeredIn.map(function (tournamentID) {
	        return (0, _preact.h)(
	          "tr",
	          null,
	          (0, _preact.h)(
	            "td",
	            null,
	            (0, _preact.h)(
	              "i",
	              null,
	              tournamentID
	            )
	          ),
	          (0, _preact.h)(
	            "td",
	            null,
	            "регистрация"
	          ),
	          (0, _preact.h)(
	            "td",
	            null,
	            (0, _preact.h)(
	              "a",
	              { className: "pointer", onclick: function onclick() {
	                  _ProfileActions2.default.unregister(tournamentID);
	                } },
	              "сняться с турнира"
	            )
	          )
	        );
	      });

	      return (0, _preact.h)(
	        "div",
	        null,
	        (0, _preact.h)(
	          "h2",
	          { "class": "text-center white" },
	          "Мои турниры"
	        ),
	        (0, _preact.h)(
	          "table",
	          { className: "table table-bordered panel" },
	          (0, _preact.h)(
	            "thead",
	            null,
	            (0, _preact.h)(
	              "tr",
	              null,
	              (0, _preact.h)(
	                "th",
	                null,
	                "№"
	              ),
	              (0, _preact.h)(
	                "th",
	                null,
	                "Статус"
	              ),
	              (0, _preact.h)(
	                "th",
	                null,
	                "Действие"
	              )
	            )
	          ),
	          (0, _preact.h)(
	            "tbody",
	            null,
	            tournaments
	          )
	        )
	      );
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(Profile, [{
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      var _this2 = this;

	      _ProfileStore2.default.addChangeListener(function () {
	        _this2.setState({
	          registeredIn: _ProfileStore2.default.getMyTournamentList(),
	          money: _ProfileStore2.default.getMoney()
	        });
	      });
	      _ProfileActions2.default.initialize();
	    }
	  }, {
	    key: "render",
	    value: function render(props, state) {
	      var tournaments = this.getTournamentRegs(state);
	      var email = '';
	      // <h3 class="mg-clear">Профиль</h3>
	      var profileInfo = (0, _preact.h)(
	        "div",
	        { "class": "panel" },
	        (0, _preact.h)("div", { "class": "panel-heading" }),
	        (0, _preact.h)(
	          "div",
	          { "class": "panel-body" },
	          (0, _preact.h)(
	            "form",
	            { id: "form-928", novalidate: "novalidate" },
	            (0, _preact.h)(
	              "div",
	              { "class": "form-group" },
	              (0, _preact.h)(
	                "label",
	                null,
	                "Логин"
	              ),
	              (0, _preact.h)(
	                "h4",
	                { "class": "mg-md" },
	                login
	              )
	            ),
	            (0, _preact.h)(
	              "div",
	              { "class": "form-group" },
	              (0, _preact.h)(
	                "label",
	                null,
	                "Email"
	              ),
	              (0, _preact.h)(
	                "h4",
	                { "class": "mg-md" },
	                email
	              )
	            ),
	            (0, _preact.h)(
	              "div",
	              { "class": "form-group" },
	              (0, _preact.h)(
	                "label",
	                null,
	                "Баланс"
	              ),
	              (0, _preact.h)(
	                "h4",
	                { id: "money1", "class": "mg-md" },
	                state.money,
	                " p"
	              )
	            )
	          )
	        )
	      );

	      var depositForm = (0, _preact.h)(
	        "div",
	        { className: "container-mobile" },
	        (0, _preact.h)(
	          "div",
	          { className: "input-mid inline pull-left" },
	          (0, _preact.h)(
	            "div",
	            { className: "button-input-rur" },
	            (0, _preact.h)("input", {
	              name: "sum"
	              // type="number"
	              , id: "deposit",
	              value: state.deposit,
	              required: "required",
	              autocomplete: "off",
	              className: "form-control circle-input",
	              onInput: this.onDepositInput
	            })
	          )
	        ),
	        (0, _preact.h)(
	          "a",
	          { id: "depositLink3",
	            href: "/Payment?ammount=" + state.deposit + "&buyType=2",
	            className: "btn btn-lg btn-primary inline pull-left"
	          },
	          "Пополнить"
	        )
	      );

	      //  на {state.deposit} РУБ
	      var deposit = (0, _preact.h)(
	        "div",
	        { className: "panel" },
	        (0, _preact.h)(
	          "div",
	          { className: "panel-heading" },
	          (0, _preact.h)(
	            "h3",
	            { id: "depositMoney", className: "mg-clear" },
	            "Пополнить счет"
	          )
	        ),
	        (0, _preact.h)(
	          "div",
	          { className: "panel-body" },
	          (0, _preact.h)(
	            "form",
	            { id: "form-928", method: "POST", action: "https://money.yandex.ru/quickpay/confirm.xml", novalidate: "novalidate" },
	            (0, _preact.h)(
	              "div",
	              { className: "form-group" },
	              (0, _preact.h)(
	                "label",
	                null,
	                "Сумма"
	              ),
	              (0, _preact.h)("input", { type: "hidden", name: "receiver", value: "410013860652119" }),
	              (0, _preact.h)("input", { type: "hidden", name: "formcomment", value: "Пополнение счёта в online-tournaments.org" }),
	              (0, _preact.h)("input", { type: "hidden", name: "short-dest", value: "Пополнение счёта в online-tournaments.org" }),
	              (0, _preact.h)("input", { type: "hidden", id: "userLogin", name: "label" }),
	              (0, _preact.h)("input", { type: "hidden", name: "quickpay-form", value: "shop" }),
	              (0, _preact.h)("input", { type: "hidden", id: "targets", name: "targets", value: "Пополнение счёта у undefined" }),
	              (0, _preact.h)("input", { type: "hidden", id: "sumAttribute", name: "sum", value: "4568.25", "data-type": "number" }),
	              (0, _preact.h)("input", { type: "hidden", name: "comment", value: "Платёж принят!" }),
	              (0, _preact.h)("input", { type: "hidden", name: "paymentType", value: "AC" }),
	              depositForm
	            )
	          )
	        )
	      );

	      var cashoutForm = (0, _preact.h)(
	        "div",
	        { className: "container-mobile" },
	        (0, _preact.h)(
	          "div",
	          { className: "input-mid inline pull-left" },
	          (0, _preact.h)(
	            "div",
	            { className: "button-input-rur" },
	            (0, _preact.h)("input", {
	              name: "sum"
	              // type="number"
	              , min: "500",
	              id: "cashout",
	              value: state.cashout,
	              required: "required",
	              autocomplete: "off",
	              className: "form-control circle-input",
	              onInput: this.onCashoutInput
	            })
	          )
	        ),
	        (0, _preact.h)(
	          "button",
	          { className: "btn btn-lg btn-primary button" },
	          "Вывести"
	        )
	      );

	      var cashout = (0, _preact.h)(
	        "div",
	        null,
	        (0, _preact.h)(
	          "div",
	          { className: "panel" },
	          (0, _preact.h)(
	            "div",
	            { className: "panel-heading" },
	            (0, _preact.h)(
	              "h3",
	              { id: "depositMoney", className: "mg-clear" },
	              "Вывод средств"
	            )
	          ),
	          (0, _preact.h)(
	            "div",
	            { className: "panel-body" },
	            (0, _preact.h)(
	              "div",
	              { className: "form-group" },
	              (0, _preact.h)(
	                "label",
	                { className: "full text-center" },
	                "Минимальная сумма вывода - 500 рублей"
	              ),
	              (0, _preact.h)("br", null),
	              cashoutForm
	            )
	          )
	        )
	      );

	      // <h1 class="text-center white page">Профиль</h1>
	      return (0, _preact.h)(
	        "div",
	        null,
	        (0, _preact.h)(
	          "h1",
	          { "class": "text-center white page" },
	          "Профиль"
	        ),
	        (0, _preact.h)(
	          "div",
	          { "class": "full" },
	          tournaments,
	          profileInfo,
	          (0, _preact.h)(
	            "div",
	            { id: "dep" },
	            deposit
	          )
	        ),
	        (0, _preact.h)(
	          "div",
	          { id: "cashoutMoney", "class": "full" },
	          cashout
	        )
	      );
	    }
	  }]);
	  return Profile;
	}(_preact.Component);

	exports.default = Profile;

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _Tournaments = __webpack_require__(161);

	var _Tournaments2 = _interopRequireDefault(_Tournaments);

	var _index = __webpack_require__(96);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var TournamentPage = function (_Component) {
	  (0, _inherits3.default)(TournamentPage, _Component);

	  function TournamentPage() {
	    (0, _classCallCheck3.default)(this, TournamentPage);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TournamentPage).apply(this, arguments));
	  }

	  (0, _createClass3.default)(TournamentPage, [{
	    key: 'render',
	    value: function render() {
	      return (0, _preact.h)(_index2.default, { content: (0, _preact.h)(_Tournaments2.default, null), chat: true, active: 'Tournaments' });
	    }
	  }]);
	  return TournamentPage;
	}(_preact.Component);

	exports.default = TournamentPage;

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _date = __webpack_require__(162);

	var _types = __webpack_require__(108);

	var _tournament = __webpack_require__(163);

	var _tournament2 = _interopRequireDefault(_tournament);

	var _ProfileStore = __webpack_require__(98);

	var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

	var _ProfileActions = __webpack_require__(118);

	var _ProfileActions2 = _interopRequireDefault(_ProfileActions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Created by gaginho on 04.06.16.
	 */

	var Tournaments = function (_Component) {
	  (0, _inherits3.default)(Tournaments, _Component);

	  function Tournaments() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Tournaments);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Tournaments)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      tournaments: TOURNAMENTS,
	      registeredIn: {},
	      options: {},
	      value: _ProfileStore2.default.getTestValue(),
	      selected: 0
	    }, _this.register = function (tournamentID, buyIn) {
	      _ProfileActions2.default.register(tournamentID, buyIn);
	    }, _this.unregister = function (tournamentID) {
	      _ProfileActions2.default.unregister(tournamentID);
	    }, _this.onSelected = function (id) {
	      _this.setState({
	        selected: _this.state.selected === id ? 0 : id
	      });
	    }, _this.filter = function (tournaments, filterFunction, group) {
	      var registeredIn = _this.state.registeredIn || {};

	      var list = tournaments.filter(filterFunction).map(function (t) {
	        return (0, _preact.h)(_tournament2.default, {
	          data: t,
	          register: _this.register,
	          unregister: _this.unregister,
	          authenticated: true,
	          registeredInTournament: registeredIn[t.tournamentID],
	          onSelected: _this.onSelected,
	          isSelected: _this.state.selected === t.tournamentID
	        });
	      });

	      if (!list.length) {
	        return '';
	      }

	      if (group) {
	        // <hr colour="white" width="30%" align="center" />
	        return (0, _preact.h)(
	          'div',
	          null,
	          (0, _preact.h)(
	            'h2',
	            { className: 'page' },
	            group
	          ),
	          (0, _preact.h)(
	            'div',
	            { className: 'row nomargins' },
	            list
	          )
	        );
	        // killPaddings nomargins
	      }

	      return list;
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(Tournaments, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _this2 = this;

	      // const tourns: Array<TournamentType> = TOURNAMENTS;
	      _ProfileStore2.default.addChangeListener(function () {
	        _this2.setState({
	          money: _ProfileStore2.default.getMoney(),
	          value: _ProfileStore2.default.getTestValue(),
	          registeredIn: _ProfileStore2.default.getMyTournaments(),
	          tournaments: _ProfileStore2.default.getAvailableTournaments()
	        });
	      });

	      _ProfileActions2.default.updateTournaments(TOURNAMENTS);
	      _ProfileActions2.default.initialize();
	    }
	  }, {
	    key: 'render',
	    value: function render(props, state) {
	      // const state: StateType = this.state;
	      // const tourns: Array<TournamentType> = TOURNAMENTS;

	      // console.log('render TOURNAMENTS');
	      // console.log(TOURNAMENTS);

	      var tourns = state.tournaments;
	      var REGULARITY_REGULAR = 1;

	      var todayF = function todayF(t) {
	        return t.startDate && (0, _date.isToday)(t.startDate);
	      };
	      var tommorrowF = function tommorrowF(t) {
	        return t.startDate && (0, _date.isTomorrow)(t.startDate);
	      };
	      var regularF = function regularF(t) {
	        return t.settings && t.settings.regularity === REGULARITY_REGULAR;
	      };
	      var freeF = function freeF(t) {
	        return t.buyIn === 0;
	      };
	      var streamF = function streamF(t) {
	        return t.settings.regularity === 2;
	      };

	      var richest = tourns.filter(function (t) {
	        return !isNaN(t.Prizes[0]);
	      }).sort(function (a, b) {
	        return b.Prizes[0] - a.Prizes[0];
	      }).slice(0, 3);

	      // const all = this.filter(tourns, () => true, 'Все турниры');
	      var TodayTournaments = this.filter(tourns, todayF, 'Пройдут сегодня');
	      var TomorrowTournaments = this.filter(tourns, tommorrowF, 'Пройдут завтра');
	      var RegularTournaments = this.filter(tourns, regularF, 'Регулярные турниры');
	      // const FreeTournaments = this.filter(tourns, freeF, 'Бесплатные турниры');
	      // const StreamTournaments = this.filter(tourns, streamF);
	      var RichestTournaments = (0, _preact.h)(
	        'div',
	        { id: 'top' },
	        this.filter(richest, function () {
	          return true;
	        }, 'ТОП турниры')
	      );

	      /*
	      // <div className="row">{TournamentList}</div>
	        <h2 className="page">Бесплатные</h2>
	       <div className="row killPaddings nomargins">{FreeTournaments}</div>
	        <h2 className="page">Турниры с наибольшими призами</h2>
	       <div className="row killPaddings nomargins">{RichestList}</div>
	       */
	      // const auth = login ? '' : <a href="/Login" className="btn btn-success">Авторизуйтесь, чтобы сыграть!</a>;
	      /*
	       <Modal show>
	       <Modal.Header closeButton>
	       <Modal.Title>Modal heading</Modal.Title>
	       </Modal.Header>
	       <Modal.Body>
	       <h4>Text in a modal</h4>
	       </Modal.Body>
	       <Modal.Footer>
	       <button onClick={this.close}>Close</button>
	       </Modal.Footer>
	       </Modal>
	          <h2 className="page">all</h2>
	          <div className="row killPaddings nomargins">{all}</div>
	       */
	      //     <TestComponent />
	      //         <h2 className="page">Стримовые</h2>
	      // <div className="row killPaddings nomargins">{StreamTournaments}</div>

	      // <h2 className="page">Бесплатные турниры</h2>
	      // <div className="row killPaddings nomargins">{FreeTournaments}</div>

	      // if (!tourns.length) {
	      //   return <h1>AZAZAZA</h1>;
	      // }
	      var authButton = (0, _preact.h)(
	        'a',
	        {
	          href: '/Login',
	          className: 'btn btn-success',
	          style: { display: login ? 'none' : 'block' }
	        },
	        'Авторизуйтесь, чтобы сыграть!'
	      );
	      return (0, _preact.h)(
	        'div',
	        null,
	        authButton,
	        RegularTournaments,
	        TodayTournaments,
	        TomorrowTournaments,
	        RichestTournaments,
	        (0, _preact.h)('hr', { colour: 'white', width: '60%', align: 'center' })
	      );
	    }
	  }]);
	  return Tournaments;
	}(_preact.Component);

	exports.default = Tournaments;

/***/ },
/* 162 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.isToday = isToday;
	exports.isTomorrow = isTomorrow;
	var _MS_PER_DAY = 1000 * 60 * 60 * 24;

	// a and b are javascript Date objects
	function diff(a, b) {
	  // Discard the time and time-zone information.
	  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
	}

	function isNearDate(date1, days, todayOffset) {
	  var now = new Date();

	  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	  today.setDate(today.getDate() + todayOffset);
	  var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	  tomorrow.setDate(tomorrow.getDate() + days);

	  var date = new Date(date1);
	  var dateDiff = diff(date, today);
	  var result = dateDiff < 1 && dateDiff >= 0; //&& date.toDateString() < tomorrow.toDateString();
	  // console.log(today, tomorrow, date, todayOffset === 1 ? 'isTomorrow' : 'isToday', result);
	  return result;
	}

	function isToday(date) {
	  return isNearDate(date, 1, 0);
	}

	function isTomorrow(date) {
	  return isNearDate(date, 2, 1);
	}

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _types = __webpack_require__(108);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getFormOfParticipants(num) {
	  var modulo = num % 10;
	  if (modulo === 1) return 'игрок';

	  if (modulo > 1 && modulo < 5) return 'игрока';
	  // if (modulo === 0 || modulo >= 5)
	  return 'игроков';
	}

	function phrase(num, wordOne, word14, wordLot) {
	  var modulo = num % 10;
	  var word = wordLot;
	  if (modulo === 1) word = wordOne;

	  if (modulo > 1 && modulo < 5) word = word14;

	  return num + ' ' + word;
	}

	function sphrase(num, word) {
	  // именит падеж: игрок
	  return phrase(num, word, word + 'а', word + 'ов');
	}

	function formatDate(date1) {
	  if (!date1) return '';
	  var date = new Date(date1);
	  // console.log('forced data', date);
	  var options = {
	    // era: 'long',
	    // year: 'numeric',
	    month: 'long',
	    day: 'numeric',
	    // weekday: 'long',
	    // timezone: 'UTC',
	    hour: 'numeric',
	    minute: 'numeric'
	  };
	  // second: 'numeric'
	  var localed = date.toLocaleString('ru', options);
	  // console.log('localed time', localed);
	  return localed;
	}

	function roman(number) {
	  switch (number) {
	    case 1:
	      return 'I';
	    case 2:
	      return 'II';
	    case 3:
	      return 'III';
	    case 4:
	      return 'IV';
	    case 5:
	      return 'V';
	    case 6:
	      return 'VI';
	    case 7:
	      return 'VII';
	    case 8:
	      return 'VIII';
	    case 9:
	      return 'IX';
	    case 10:
	      return 'X';
	    default:
	      return number;
	  }
	}

	var Tournament = function (_Component) {
	  (0, _inherits3.default)(Tournament, _Component);

	  function Tournament() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Tournament);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Tournament)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.getActionButtons = function (props) {
	      var actionButtons = '';
	      var _props$data = props.data;
	      var buyIn = _props$data.buyIn;
	      var tournamentID = _props$data.tournamentID;


	      if (props.authenticated) {
	        if (props.registeredInTournament) {
	          actionButtons = (0, _preact.h)(
	            'a',
	            { className: 'btn toggle-tickets wrap-text' },
	            'Вы участвуете в турнире',
	            (0, _preact.h)('br', null),
	            'Дождитесь начала'
	          );
	        } else {
	          var text = buyIn > 0 ? 'за ' + buyIn + ' РУБ' : 'бесплатно';
	          actionButtons = (0, _preact.h)(
	            'a',
	            { className: 'btn toggle-tickets wrap-text', onClick: function onClick() {
	                return props.register(tournamentID, buyIn);
	              } },
	            'Участвовать ',
	            text
	          );
	        }
	      }
	      return actionButtons;
	    }, _this.getStartConditions = function (props) {
	      var date = props.data.startDate; // || new Date();
	      var formattedDate = formatDate(date);
	      var frees = props.data.goNext[0] - props.data.players;
	      // console.log('startConditions', props.data.tournamentID, date);

	      if (date) {
	        return (0, _preact.h)(
	          'div',
	          null,
	          'Турнир начнётся ',
	          formattedDate
	        );
	      }

	      if (frees === 0) {
	        return (0, _preact.h)(
	          'div',
	          null,
	          'Свободных мест нет'
	        );
	      }

	      return (0, _preact.h)(
	        'div',
	        null,
	        'Свободных мест: ',
	        frees
	      );
	    }, _this.pickTournamentCoverColour = function (id) {
	      var modulo = id % 10;
	      switch (modulo) {
	        case 1:
	          return 'green';
	        case 2:
	          return 'red';
	        case 3:
	          return 'purple';
	        case 4:
	          return 'pomegranate';
	        case 5:
	          return 'blue';
	        case 6:
	          return 'pomegranate';
	        case 7:
	          return 'darkblue';
	        case 8:
	          return 'pomegranate';
	        case 9:
	          return 'purple';
	        default:
	          return '';
	      }
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(Tournament, [{
	    key: 'render',
	    value: function render(props) {
	      var id = props.data.tournamentID;

	      var prizes = props.data.Prizes || [100, 20, 20, 5]; //
	      var prizeList = prizes.map(function (p, i) {
	        return (0, _preact.h)(
	          'p',
	          null,
	          i + 1,
	          '-е место: ',
	          p,
	          ' РУБ'
	        );
	      });
	      var buyIn = props.data.buyIn;

	      var maxPlayers = props.data.goNext[0];

	      // const coverUrl = `/img/topics/default.jpg`;
	      var coverUrl = '/img/logo.png';
	      var color = 'white';
	      var coverColor = this.pickTournamentCoverColour(id);
	      // console.log(coverColor);

	      var easiest = 'Проще простого';
	      var easy = 'Вполне по силам';
	      var middle = 'Средне';
	      var impossible = 'Будет жарко';

	      var difficulty = easiest;

	      if (maxPlayers > 5) {
	        if (maxPlayers > 28) {
	          if (maxPlayers > 100) {
	            difficulty = impossible;
	          } else {
	            difficulty = middle;
	          }
	        } else {
	          difficulty = easy;
	        }
	      }

	      var playerCount = props.data.players;

	      var startDate = props.data.startDate;
	      if (!startDate) {
	        playerCount = props.data.players + '/' + props.data.goNext[0];
	      }

	      var cost = buyIn === 0 ? 'БЕСПЛАТНО' : 'Всего за ' + buyIn + ' руб';
	      var cover = (0, _preact.h)(
	        'div',
	        { className: 'cover', onClick: function onClick() {
	            return props.onSelected(id);
	          } },
	        (0, _preact.h)(
	          'div',
	          { className: 'tournament-cover' },
	          (0, _preact.h)(
	            'p',
	            { style: { color: color }, className: 'fa fa-user fa-lg fa-1x', 'aria-hidden': 'true' },
	            '  ',
	            playerCount
	          )
	        ),
	        (0, _preact.h)(
	          'div',
	          { className: 'tournament-difficulty' },
	          'Сложность',
	          (0, _preact.h)('br', null),
	          difficulty
	        ),
	        (0, _preact.h)(
	          'div',
	          { className: 'tournament-date-start ' + (startDate ? 'show' : 'hide') },
	          formatDate(startDate)
	        ),
	        (0, _preact.h)(
	          'span',
	          { className: 'tournament-users', style: { color: color } },
	          '№',
	          id
	        ),
	        (0, _preact.h)(
	          'div',
	          { className: 'tournament-prize-count' },
	          'Призов: ',
	          prizes.length
	        ),
	        (0, _preact.h)(
	          'div',
	          { className: 'tournament-cost' },
	          cost
	        ),
	        (0, _preact.h)(
	          'div',
	          { className: 'tournament-cover-container ' + coverColor },
	          (0, _preact.h)(
	            'div',
	            { className: 'tournament-centerize' },
	            (0, _preact.h)(
	              'div',
	              { className: 'white tournament-cover-text' },
	              (0, _preact.h)(
	                'div',
	                null,
	                'Главный приз'
	              ),
	              (0, _preact.h)(
	                'span',
	                null,
	                prizes[0],
	                ' Р'
	              )
	            )
	          )
	        )
	      );

	      // <img src={coverUrl} alt="" />
	      var participants = (0, _preact.h)(
	        'div',
	        null,
	        (0, _preact.h)(
	          'div',
	          { className: 'going', id: 'plrs-' + id },
	          (0, _preact.h)('i', { className: 'fa fa-group fa-lg' }),
	          'Игроки : ',
	          props.data.players,
	          '/',
	          props.data.goNext[0]
	        ),
	        (0, _preact.h)(
	          'div',
	          { className: 'tickets-left' },
	          '№',
	          id
	        )
	      );

	      // style="width: 300px; display: inline-block;"
	      // box-shadow: 0 0 5px 2px rgba(0,0,0,.35);
	      // <div className="from">Призы</div>
	      // box-shadow: -5px -5px 9px 5px rgba(0,0,0,0.4);
	      var participating = props.registeredInTournament ? 'participating' : '';
	      var ticketCardClassName = 'ticket-card ' + participating + ' light-blue-big bounceIn';
	      // killPaddings
	      //   <div className="col-sm-6 col-md-4">
	      //   <div className="" style="width: 305px; display: inline-block; margin: 7px;">

	      var tournamentSpecialID = '';
	      if (prizes[0] === 50) {
	        tournamentSpecialID = 'daily';
	      }

	      return (0, _preact.h)(
	        'div',
	        { className: 'col-sm-6 col-md-4', id: tournamentSpecialID },
	        (0, _preact.h)(
	          'div',
	          { className: ticketCardClassName, id: 'bgd' + id },
	          cover,
	          (0, _preact.h)(
	            'div',
	            { className: 'tournament-body ' + participating + ' ' + (props.isSelected ? '' : 'hide') },
	            (0, _preact.h)(
	              'div',
	              { className: 'body' },
	              (0, _preact.h)(
	                'div',
	                { className: 'price text-center' },
	                (0, _preact.h)(
	                  'div',
	                  { className: 'value' },
	                  prizeList
	                )
	              ),
	              (0, _preact.h)('div', { className: 'clearfix' }),
	              (0, _preact.h)('div', { className: 'clearfix' })
	            ),
	            (0, _preact.h)('div', { className: 'collapse' }),
	            (0, _preact.h)(
	              'div',
	              { className: 'info text-center' },
	              this.getStartConditions(props)
	            ),
	            (0, _preact.h)('br', null),
	            (0, _preact.h)(
	              'div',
	              { className: 'footer', id: 'footer' + id },
	              this.getActionButtons(props)
	            )
	          )
	        )
	      );
	    }
	  }]);
	  return Tournament;
	}(_preact.Component);

	exports.default = Tournament;

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _index = __webpack_require__(165);

	var _index2 = _interopRequireDefault(_index);

	var _queryParser = __webpack_require__(166);

	var _queryParser2 = _interopRequireDefault(_queryParser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// const appElement: HTMLElement = document.getElementById('app');
	// const url = location;
	// const captured = /ammount=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
	var captured = _queryParser2.default.parameter('ammount');
	var ammount = captured ? captured : 100;

	var elements = (0, _preact.h)(
	  'center',
	  null,
	  (0, _preact.h)(_index2.default, { ammount: ammount })
	);

	// render(
	//   elements,
	//   appElement.parentNode,
	//   appElement
	// );

	var PaymentPage = function (_Component) {
	  (0, _inherits3.default)(PaymentPage, _Component);

	  function PaymentPage() {
	    (0, _classCallCheck3.default)(this, PaymentPage);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PaymentPage).apply(this, arguments));
	  }

	  (0, _createClass3.default)(PaymentPage, [{
	    key: 'render',
	    value: function render() {
	      return elements;
	    }
	  }]);
	  return PaymentPage;
	}(_preact.Component);

	exports.default = PaymentPage;

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _superagent = __webpack_require__(110);

	var _superagent2 = _interopRequireDefault(_superagent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Created by gaginho on 06.06.16.
	 */


	var PAY_QIWI = 1;
	var PAY_MOBILE = 2;
	var PAY_YANDEX = 3;
	var PAY_BANK = 4;

	var Payment = function (_Component) {
	  (0, _inherits3.default)(Payment, _Component);

	  function Payment() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Payment);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Payment)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      chosen: 0
	    }, _this.payform = function (value, paymentType) {
	      /*
	       label Яндекс.Деньгами
	       input(type="radio" name="paymentType" value="PC")
	       label Банковской картой
	       input(type="radio" name="paymentType" value="AC")
	       label С мобильного
	       input(type="radio" name="paymentType" value="MC")
	       input(type="submit" id="depositLink1" class="btn btn-lg btn-primary" value="Оплатить " + value+ " руб")
	       */
	      return (0, _preact.h)(
	        'form',
	        { id: 'form-928', method: 'POST', action: 'https://money.yandex.ru/quickpay/confirm.xml', noValidate: true },
	        (0, _preact.h)(
	          'div',
	          { className: 'form-group' },
	          (0, _preact.h)('input', { type: 'hidden', name: 'receiver', value: '410013860652119' }),
	          (0, _preact.h)('input', { type: 'hidden', name: 'formcomment', value: 'Пополнение счёта в online-tournaments.org' }),
	          (0, _preact.h)('input', { type: 'hidden', name: 'short-dest', value: 'Пополнение счёта в online-tournaments.org' }),
	          (0, _preact.h)('input', { type: 'hidden', id: 'userLogin', name: 'label', value: login }),
	          (0, _preact.h)('input', { type: 'hidden', name: 'quickpay-form', value: 'shop' }),
	          (0, _preact.h)('input', { type: 'hidden', id: 'targets', name: 'targets', value: 'Пополнение счёта у ' + login }),
	          (0, _preact.h)('input', { type: 'hidden', id: 'sumAttribute', name: 'sum', value: value, 'data-type': 'number' }),
	          (0, _preact.h)('input', { type: 'hidden', name: 'comment', value: 'Платёж принят!' }),
	          (0, _preact.h)('input', { type: 'hidden', name: 'paymentType', value: paymentType }),
	          (0, _preact.h)('input', { type: 'submit', className: 'btn btn-lg btn-primary', value: 'Оплатить ' + value + ' руб' })
	        )
	      );
	    }, _this.choosePaymentType = function (id) {
	      return function () {
	        _this.setState({
	          chosen: id
	        });
	      };
	    }, _this.getPaymentImage = function (chosen, alt, src, width, height) {
	      return(
	        // <div style="background-color: white;">
	        (0, _preact.h)('img', {
	          src: src,
	          alt: alt,
	          onClick: _this.choosePaymentType(chosen)
	          // width={width}
	          , height: height * 1.25,
	          className: 'light-blue-big',
	          color: 'white',
	          style: {
	            'margin-right': '35px',
	            cursor: 'pointer',
	            'border-radius': '15px',
	            'margin-bottom': '25px'
	          }
	        })
	        // </div>

	      );
	    }, _this.drawChosenPaymentForm = function (chosen, ammount) {

	      // const qiwi = '1) QIWI: +79648847260';
	      // const mobile = '2) С мобильного';
	      // const yandexMoney = '3) Яндекс.Деньги';
	      // const bankCard = '4) Банковская карточка';

	      var qiwi = 'QIWI: +79648847260';
	      var mobile = 'С мобильного';
	      var yandexMoney = 'Яндекс.Деньги';
	      var bankCard = 'Банковская карточка';

	      if (chosen === PAY_QIWI) {
	        return (0, _preact.h)(
	          'div',
	          null,
	          (0, _preact.h)(
	            'h2',
	            { className: 'page' },
	            qiwi
	          ),
	          (0, _preact.h)(
	            'p',
	            { className: 'page' },
	            ' Укажите ваш логин (',
	            login,
	            ') в комментарии к платежу '
	          ),
	          (0, _preact.h)(
	            'a',
	            {
	              href: 'https://qiwi.ru',
	              target: '_blank',
	              className: 'btn btn-lg btn-primary'
	            },
	            'Оплатить ',
	            ammount,
	            ' руб'
	          )
	        );
	      }

	      if (chosen === PAY_MOBILE) {
	        return (0, _preact.h)(
	          'div',
	          null,
	          (0, _preact.h)(
	            'h2',
	            { className: 'page' },
	            mobile
	          ),
	          (0, _preact.h)(
	            'p',
	            { className: 'page' },
	            'НЕ УДАЛЯЙТЕ СМС до зачисления средств'
	          ),
	          _this.payform(ammount, 'MC')
	        );
	      }

	      if (chosen === PAY_YANDEX) {
	        return (0, _preact.h)(
	          'div',
	          null,
	          (0, _preact.h)(
	            'h2',
	            { className: 'page' },
	            yandexMoney
	          ),
	          _this.payform(ammount, 'PC')
	        );
	      }

	      if (chosen === PAY_BANK) {
	        return (0, _preact.h)(
	          'div',
	          null,
	          (0, _preact.h)(
	            'h2',
	            { className: 'page' },
	            bankCard
	          ),
	          _this.payform(ammount, 'AC')
	        );
	      }

	      return '';
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(Payment, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      // this.loadData();
	    }
	  }, {
	    key: 'loadData',
	    value: function loadData() {
	      var _this2 = this;

	      _superagent2.default.get('/api/teams/').end(function (err, res) {
	        var message = res.body;
	        console.log('got request', err, message);

	        _this2.setState({ joined: message.joined, team: message.team });
	      });
	    }
	  }, {
	    key: 'render',

	    // <h2 className="page">Вы собираетесь пополнить счёт на {props.ammount} руб</h2>
	    value: function render(props, state) {
	      var paymentForm = this.drawChosenPaymentForm(state.chosen, props.ammount);
	      var width = 50;
	      var height = 50;
	      // Если у вас возникли какие-то трудности, напишите в
	      var choseText = 'Выберите способ оплаты';
	      if (state.chosen === PAY_QIWI) {
	        choseText = 'QIWI';
	      }
	      if (state.chosen === PAY_MOBILE) {
	        choseText = 'Оплата с мобильного';
	      }

	      if (state.chosen === PAY_YANDEX) {
	        choseText = 'Оплата Яндекс.Деньгами';
	      }

	      if (state.chosen === PAY_BANK) {
	        choseText = 'Оплата банковской картой';
	      }
	      // {this.getPaymentImage(2, 'Оплата с мобильного', 'http://s1.iconbird.com/ico/2013/9/452/w352h5121380477012phone.png', width, height)}
	      // {this.getPaymentImage(3, 'Яндекс.Деньги', 'http://avatars.mds.yandex.net/get-yablogs/28577/EkehfwEF_l/orig', width, height)}
	      // {this.getPaymentImage(3, 'Яндекс.Деньги', '/img/yandex.png', width, height)}
	      return (0, _preact.h)(
	        'div',
	        null,
	        (0, _preact.h)(
	          'div',
	          { style: 'width: 100%; height: auto;' },
	          (0, _preact.h)(
	            'h1',
	            { className: 'page' },
	            'Пополнение счёта на ',
	            props.ammount,
	            ' РУБ'
	          ),
	          (0, _preact.h)('i', { className: 'fa fa-icon-ya-money' }),
	          (0, _preact.h)('i', { className: 'fa fa-yandex' }),
	          (0, _preact.h)(
	            'h2',
	            { className: 'page' },
	            choseText
	          ),
	          this.getPaymentImage(1, 'QIWI', 'http://qiwi.by/uploads/files/logo_qiwi_rgb.png', width, height),
	          this.getPaymentImage(2, 'Оплата с мобильного', '/img/mobile.png', width, height),
	          (0, _preact.h)(
	            'div',
	            {
	              style: {
	                'background-color': 'white',
	                display: 'inline-block',
	                width: '245px',
	                height: height * 1.25,
	                'border-radius': '15px',
	                'margin-right': '35px'
	              }
	            },
	            this.getPaymentImage(3, 'Яндекс.Деньги', 'http://avatars.mds.yandex.net/get-yablogs/114306/VyZTMD4F_g/orig', width, height)
	          ),
	          this.getPaymentImage(4, 'Оплата картой', 'http://learnthat.com/files/2010/02/credit-cards1.png', width, height),
	          paymentForm
	        ),
	        (0, _preact.h)('br', null),
	        (0, _preact.h)(
	          'div',
	          {
	            className: 'white text-center',
	            style: {
	              // position: 'fixed',
	              width: '100%'
	            }
	          },
	          'Что-то не так? Пишите в  ',
	          (0, _preact.h)(
	            'span',
	            null,
	            (0, _preact.h)(
	              'a',
	              {
	                href: 'https://vk.com/topic-111187123_33419618',
	                target: '_blank'
	              },
	              'техподдержку'
	            )
	          )
	        )
	      );
	    }
	  }]);
	  return Payment;
	}(_preact.Component);

	exports.default = Payment;

/***/ },
/* 166 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  parameter: function parameter(name) {
	    var params = {};

	    if (location.search) {
	      var parts = location.search.substring(1).split('&');

	      for (var i = 0; i < parts.length; i++) {
	        var nv = parts[i].split('=');
	        if (!nv[0]) continue;
	        params[nv[0]] = nv[1] || true;
	      }
	    }

	    return params[name];

	    // const url = location.pathName;
	    //
	    // if (!url) {
	    //   return '';
	    // }
	    // console.log(url);
	    //
	    // return /$name=([^&]+)/.exec(url)[1];
	  }
	};

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	var _About = __webpack_require__(168);

	var _About2 = _interopRequireDefault(_About);

	var _index = __webpack_require__(96);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var elements = (0, _preact.h)(_index2.default, { content: (0, _preact.h)(_About2.default, null), nochat: true, active: 'About' });

	var ProfilePage = function (_Component) {
	  (0, _inherits3.default)(ProfilePage, _Component);

	  function ProfilePage() {
	    (0, _classCallCheck3.default)(this, ProfilePage);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ProfilePage).apply(this, arguments));
	  }

	  (0, _createClass3.default)(ProfilePage, [{
	    key: 'render',
	    value: function render() {
	      return elements;
	    }
	  }]);
	  return ProfilePage;
	}(_preact.Component);

	exports.default = ProfilePage;

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(42);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(47);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(48);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(87);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _preact = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var About = function (_Component) {
	  (0, _inherits3.default)(About, _Component);

	  function About() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, About);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(About)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {}, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  (0, _createClass3.default)(About, [{
	    key: "componentWillMount",
	    value: function componentWillMount() {}
	  }, {
	    key: "render",
	    value: function render() {
	      return (0, _preact.h)(
	        "div",
	        null,
	        (0, _preact.h)(
	          "div",
	          { className: "white" },
	          (0, _preact.h)(
	            "div",
	            { className: "col-sm-12" },
	            (0, _preact.h)(
	              "h1",
	              { className: "mg-md text-center" },
	              "О нас"
	            ),
	            (0, _preact.h)(
	              "p",
	              { className: "justify" },
	              "Мы проводим онлайн–турниры, в которых разыгрываем деньги и футбольную атрибутику. Ваша цель - ответить на наибольшее количество вопросов. Вы можете играть в любое время. Турниры начинаются тогда, когда в них регистрируется необходимое количество игроков."
	            )
	          ),
	          (0, _preact.h)(
	            "div",
	            { className: "col-sm-12" },
	            (0, _preact.h)(
	              "h2",
	              { className: "mg-md text-center" },
	              "Порядок проведения турниров"
	            ),
	            (0, _preact.h)(
	              "p",
	              { className: "justify" },
	              "В самом начале турнира вам даётся 20 секунд на подготовку. После этого, вам предлагается ответить на ряд вопросов викторины. Число вопросов - от 6 до 20, в зависимости от типа турнира. В каждом вопросе 4 варианта ответа, где лишь один из них является верным. На ответ даётся 10 секунд и в зависимости от скорости и точности ответа начисляются очки. Для победы в турнире необходимо набрать наибольшее количество очков. В случае равенства очков (что крайне маловероятно), победа присуждается тому, кто первым зарегистрировался в турнире."
	            )
	          ),
	          (0, _preact.h)(
	            "div",
	            { className: "col-sm-12" },
	            (0, _preact.h)(
	              "h2",
	              { className: "mg-md text-center" },
	              "Как пополнить счёт?"
	            ),
	            (0, _preact.h)(
	              "p",
	              { className: "justify" },
	              "Пополнить счёт вы можете в своём ",
	              (0, _preact.h)(
	                "a",
	                { href: "profile#depositMoney" },
	                "профиле"
	              ),
	              "."
	            )
	          ),
	          (0, _preact.h)(
	            "div",
	            { className: "col-sm-12" },
	            (0, _preact.h)(
	              "h2",
	              { className: "mg-md text-center" },
	              "Как снять деньги?"
	            ),
	            (0, _preact.h)(
	              "p",
	              { className: "justify" },
	              "Вывести средства вы можете в своём ",
	              (0, _preact.h)(
	                "a",
	                { href: "profile#cashoutMoney" },
	                "профиле"
	              ),
	              ". Отправьте заявку в техподдержку и мы переведём вам деньги удобным для вас способом в течение одной рабочей недели. Минимальная сумма вывода - 500 рублей. В будущем, постараемся смягчить или даже отменить это ограничение. Это наша цель №1! Просим отнестись к этому с пониманием."
	            )
	          )
	        )
	      );
	    }
	  }]);
	  return About;
	}(_preact.Component);

	exports.default = About;

/***/ }
/******/ ]);