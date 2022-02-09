(self["webpackChunk"] = self["webpackChunk"] || []).push([[773],{

/***/ 8826:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./node_modules/@inertiajs/inertia-vue3/dist/index.js
var dist = __webpack_require__(9038);
// EXTERNAL MODULE: ./node_modules/@inertiajs/progress/dist/index.js
var progress_dist = __webpack_require__(1966);
// EXTERNAL MODULE: ./node_modules/katex/dist/katex.mjs
var katex = __webpack_require__(1008);
// EXTERNAL MODULE: ./node_modules/asciimath2tex/dist/asciimath2tex.mjs
var asciimath2tex = __webpack_require__(8133);
;// CONCATENATED MODULE: ./resources/js/vueDirectives.js



function katexUpdate(el, binding, vnode) {
  if (binding.value.length === 0) {
    el.innerHTML = '';
  } else {
    var tex = binding.modifiers.ascii ? new asciimath2tex/* default */.Z().parse(binding.value) : binding.value;

    if (!binding.modifiers.clear) {
      el.classList.add('katex-container');
    } // Add boxed to the inline container


    if (binding.modifiers.boxed) {
      el.classList.add('katex-boxed');
    }

    if (binding.modifiers.left) {
      el.classList.add('katex-left');
    }

    if (binding.modifiers.nomargin) {
      el.classList.add('katex-m-0');
    }

    el.innerHTML = katex/* default.renderToString */.Z.renderToString((binding.modifiers.display ? '\\displaystyle ' : '') + tex, {
      throwOnError: false,
      displayMode: !binding.modifiers.inline
    });
  }
}

var katexDirective = {
  mounted: function mounted(el, binding, vnode) {
    katexUpdate(el, binding, vnode);
  },
  updated: function updated(el, binding, vnode) {
    katexUpdate(el, binding, vnode);
  },
  unmounted: function unmounted(el) {
    el.innerHTML = '';
  }
};
var visibleDirective = {
  mounted: function mounted(el, binding, vnode) {
    el.style.visibility = binding.value ? 'visible' : 'hidden';
  }
};
;// CONCATENATED MODULE: ./resources/js/app.js
var _window$document$getE;



 // Custom directives



__webpack_require__(7333);

var appName = ((_window$document$getE = window.document.getElementsByTagName('title')[0]) === null || _window$document$getE === void 0 ? void 0 : _window$document$getE.innerText) || 'ScolCours';
(0,dist/* createInertiaApp */.yP)({
  title: function title(_title) {
    return "".concat(_title, " - ").concat(appName);
  },
  resolve: function resolve(name) {
    return __webpack_require__(4985)("./".concat(name));
  },
  setup: function setup(_ref) {
    var el = _ref.el,
        app = _ref.app,
        props = _ref.props,
        plugin = _ref.plugin;
    var vueApp = (0,vue_esm_bundler.createApp)({
      render: function render() {
        return (0,vue_esm_bundler.h)(app, props);
      }
    }).component('Link', dist/* Link */.rU).component('Head', dist/* Head */.Fb).use(plugin).directive('katex', katexDirective).directive('visible', visibleDirective).mixin({
      methods: {
        route: route
      }
    });
    vueApp.config.globalProperties.$log = console.log;
    return vueApp.mount(el);
  }
});
progress_dist/* InertiaProgress.init */.I.init({
  color: '#4B5563'
});

/***/ }),

/***/ 7333:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var katex_dist_contrib_auto_render_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9137);
window._ = __webpack_require__(6486);
window.axios = __webpack_require__(9669);
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


window.katexAutoRender = function (el, display) {
  (0,katex_dist_contrib_auto_render_mjs__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(el, {
    // customised options
    // • auto-render specific keys, e.g.:
    delimiters: [{
      left: '$$',
      right: '$$',
      display: true
    }, {
      left: '$',
      right: '$',
      display: false
    }, {
      left: '\\[',
      right: '\\]',
      display: true
    }, {
      left: '\\(',
      right: '\\)',
      display: false
    }],
    // • rendering keys, e.g.:
    throwOnError: false
  });
};

/***/ }),

/***/ 2584:
/***/ (() => {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 4985:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./Admin": [
		6277,
		898,
		277
	],
	"./Admin.vue": [
		6277,
		898,
		277
	],
	"./Auth/ConfirmPassword": [
		479,
		898,
		479
	],
	"./Auth/ConfirmPassword.vue": [
		479,
		898,
		479
	],
	"./Auth/ForgotPassword": [
		4918,
		898,
		918
	],
	"./Auth/ForgotPassword.vue": [
		4918,
		898,
		918
	],
	"./Auth/Login": [
		7928,
		898,
		928
	],
	"./Auth/Login.vue": [
		7928,
		898,
		928
	],
	"./Auth/Register": [
		325,
		898,
		325
	],
	"./Auth/Register.vue": [
		325,
		898,
		325
	],
	"./Auth/ResetPassword": [
		5925,
		898,
		925
	],
	"./Auth/ResetPassword.vue": [
		5925,
		898,
		925
	],
	"./Auth/VerifyEmail": [
		8790,
		898,
		790
	],
	"./Auth/VerifyEmail.vue": [
		8790,
		898,
		790
	],
	"./Challenges": [
		9711,
		898,
		711
	],
	"./Challenges/": [
		9711,
		898,
		711
	],
	"./Challenges/index": [
		9711,
		898,
		711
	],
	"./Challenges/index.vue": [
		9711,
		898,
		711
	],
	"./Challenges/show": [
		6678,
		898,
		678
	],
	"./Challenges/show.vue": [
		6678,
		898,
		678
	],
	"./Chapters": [
		7339,
		898,
		339
	],
	"./Chapters/": [
		7339,
		898,
		339
	],
	"./Chapters/Chapter": [
		5078,
		898,
		78
	],
	"./Chapters/Chapter.vue": [
		5078,
		898,
		78
	],
	"./Chapters/index": [
		7339,
		898,
		339
	],
	"./Chapters/index.vue": [
		7339,
		898,
		339
	],
	"./Dashboard": [
		189,
		898,
		189
	],
	"./Dashboard.vue": [
		189,
		898,
		189
	],
	"./Dev": [
		6669,
		898,
		669
	],
	"./Dev.vue": [
		6669,
		898,
		669
	],
	"./Exercises/create": [
		680,
		898,
		680
	],
	"./Exercises/create.vue": [
		680,
		898,
		680
	],
	"./Shared/LayoutFullpage": [
		280,
		898,
		280
	],
	"./Shared/LayoutFullpage.vue": [
		280,
		898,
		280
	],
	"./Shared/LayoutMain": [
		9462,
		898,
		462
	],
	"./Shared/LayoutMain.vue": [
		9462,
		898,
		462
	],
	"./Tools": [
		7,
		898,
		7
	],
	"./Tools.vue": [
		7,
		898,
		7
	],
	"./Welcome": [
		3248,
		898,
		248
	],
	"./Welcome.vue": [
		3248,
		898,
		248
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = 4985;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 4654:
/***/ (() => {

/* (ignored) */

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, [170,898], () => (__webpack_exec__(8826), __webpack_exec__(2584)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);