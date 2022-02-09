"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[840],{

/***/ 3840:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ IntegralesDefiniesAireParaboleNeg)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./node_modules/pidraw/esm/index.js
var esm = __webpack_require__(8259);
// EXTERNAL MODULE: ./resources/js/Components/Ui/ExampleTitle.vue + 2 modules
var ExampleTitle = __webpack_require__(4671);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=script&setup=true&lang=js


var _hoisted_1 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)("Aire entre une parabole et l'axe \\(O_x\\)");

var _hoisted_2 = {
  "class": "grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch"
};

var _hoisted_3 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("div", null, [/*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Calculer l'aire entre \\(f(x)= \\dfrac{1}{4}x^2-\\dfrac{7}{4}x-2\\) et l'axe \\(O_x\\) "), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("h3", {
  "class": "mt-8 mb-4 font-semibold"
}, " Marche à suivre "), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("ol", {
  "class": "list-decimal list-space space-y-4"
}, [/*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, "Calculer les zéros de \\(f(x)\\)"), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, "Calculer l'intégrale définie bornée entre les deux zéros"), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, "En déduire l'aire")])], -1);

var _hoisted_4 = {
  "class": "lg:col-span-2"
};
var _hoisted_5 = {
  "class": "flex items-center mt-8 mb-4 space-x-10"
};

var _hoisted_6 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("h3", {
  "class": "font-semibold"
}, " Résolution ", -1);

var _hoisted_7 = {
  "class": "list-decimal list-space space-y-4"
};



/* harmony default export */ const IntegralesDefiniesAireParaboleNegvue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    var root = (0,vue_esm_bundler.ref)(null),
        graphBetweenContainer = (0,vue_esm_bundler.ref)(null),
        solutions = (0,vue_esm_bundler.ref)(0);
    var graphBetween;

    function loadGraphBetween() {
      graphBetween = new esm.Graph(graphBetweenContainer.value, {
        origin: {
          x: 200,
          y: 200
        }
      });
      graphBetween.axis();
      var fx = graphBetween.plot('1/4*x^2-7/4*x-2'); // '1/4*(x+8)*(x-1)

      graphBetween.point(-1, 0).asCircle();
      graphBetween.point(8, 0).asCircle();
      fx.fillBetween(false, -1, 8);
    }

    (0,vue_esm_bundler.onMounted)(function () {
      katexAutoRender(root.value);
      loadGraphBetween();
    });
    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", {
        ref_key: "root",
        ref: root
      }, [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(ExampleTitle/* default */.Z), null, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [_hoisted_1];
        }),
        _: 1
      }), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_2, [(0,vue_esm_bundler.createElementVNode)("div", {
        ref_key: "graphBetweenContainer",
        ref: graphBetweenContainer,
        "class": "max-w-lg"
      }, null, 512), _hoisted_3, (0,vue_esm_bundler.createElementVNode)("div", _hoisted_4, [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_5, [_hoisted_6, (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("button", {
        "class": "btn px-2 py-1",
        onClick: _cache[0] || (_cache[0] = function ($event) {
          return solutions.value++;
        })
      }, " Etape suivante ", 512), [[vue_esm_bundler.vShow, solutions.value < 3]])]), (0,vue_esm_bundler.createElementVNode)("ol", _hoisted_7, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("li", null, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, '\\dfrac{1}{4}x^2-\\frac{7}{4}x-2= 0 \\implies \\dfrac{1}{4}\\big( x^2-7x-8 \\big) = 0 \\implies \\dfrac{1}{4}(x+1 )(x-8) = 0 \\implies x=-1 \\text{ et } x = 8', void 0, {
        boxed: true
      }]])], 512), [[vue_esm_bundler.vShow, solutions.value > 0]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("li", null, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, '\\displaystyle \\int_{-1}^{8} \\frac{1}{4}x^2-\\frac{7}{4}x-2 \\ \\text{d}x = \\frac{1}{12}x^3 - \\frac{7}{8}x^2-2x \\Big\\vert_{-1}^8 \\approx -\\frac{88}{3} - \\frac{25}{24} = -\\frac{243}{8} = -30.375', void 0, {
        boxed: true
      }]])], 512), [[vue_esm_bundler.vShow, solutions.value > 1]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("li", null, " L'aire entre la courbe et l'axe \\(O_x\\) vaut \\(\\big\\vert-30.375\\big\\vert = 30.375\\) ", 512), [[vue_esm_bundler.vShow, solutions.value > 2]])])])])], 512);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue



const __exports__ = IntegralesDefiniesAireParaboleNegvue_type_script_setup_true_lang_js;

/* harmony default export */ const IntegralesDefiniesAireParaboleNeg = (__exports__);

/***/ }),

/***/ 4671:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ ExampleTitle)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/ExampleTitle.vue?vue&type=template&id=2fef7249

var _hoisted_1 = {
  "class": "text-xl font-mono mt-6 mb-2"
};
function render(_ctx, _cache) {
  return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("h2", _hoisted_1, [(0,vue_esm_bundler.renderSlot)(_ctx.$slots, "default")]);
}
;// CONCATENATED MODULE: ./resources/js/Components/Ui/ExampleTitle.vue?vue&type=template&id=2fef7249

// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(3744);
;// CONCATENATED MODULE: ./resources/js/Components/Ui/ExampleTitle.vue

const script = {}

;
const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(script, [['render',render]])

/* harmony default export */ const ExampleTitle = (__exports__);

/***/ })

}]);