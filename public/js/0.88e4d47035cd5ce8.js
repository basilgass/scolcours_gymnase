"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[0],{

/***/ 7000:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ IntegralesDefiniesAireBorneRacine)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./node_modules/pidraw/esm/index.js
var esm = __webpack_require__(8259);
// EXTERNAL MODULE: ./resources/js/Components/Ui/ExampleTitle.vue + 2 modules
var ExampleTitle = __webpack_require__(4671);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireBorneRacine.vue?vue&type=script&setup=true&lang=js


var _hoisted_1 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)("Aire entre deux courbes et l'axe \\(O_x\\)");

var _hoisted_2 = {
  "class": "grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch"
};

var _hoisted_3 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Calculer l'aire entre \\(f(x)=2x-1\\) et \\(g(x)=\\sqrt{8x+17}\\) ");

var _hoisted_4 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("h3", {
  "class": "mt-8 mb-4 font-semibold"
}, " Marche à suivre ", -1);

var _hoisted_5 = {
  "class": "list-decimal list-space space-y-4"
};

var _hoisted_6 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, " Calculer \\(a\\), la coordonnée \\(x\\) du point d'intersection entre \\(g(x)\\) et l'axe \\(O_x\\) ", -1);

var _hoisted_7 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, " Calculer \\(b\\), la coordonnée \\(x\\) du point d'intersection entre \\(f(x)\\) et l'axe \\(O_x\\) ", -1);

var _hoisted_8 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, " Calculer \\(c\\), la coordonnée \\(x\\) du point d'intersection de \\(f(x)\\) et \\(g(x)\\) ", -1);

var _hoisted_9 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Calculer les intégrales suivantes: ");

var _hoisted_10 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, " Calculer l'aire du domaine borné \\(\\big\\vert\\mathcal{A}_1\\big\\vert-\\big\\vert\\mathcal{A}_2\\big\\vert\\) ", -1);

var _hoisted_11 = {
  "class": "lg:col-span-2"
};
var _hoisted_12 = {
  "class": "flex items-center mt-8 mb-4 space-x-10"
};

var _hoisted_13 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("h3", {
  "class": "font-semibold"
}, " Résolution ", -1);

var _hoisted_14 = {
  "class": "list-decimal list-space space-y-4"
};

var _hoisted_15 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Résolution de l'équation \\(2x-1 = \\sqrt{8x+17}\\) en élevant chaque membre au carré. ");

var _hoisted_16 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("div", null, " On obtient \\(x = -1 \\not\\in \\text{ED}\\) et \\(x=4 \\in \\text{ED}\\) ", -1);

var _hoisted_17 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Calculer les intégrales bornées ");

var _hoisted_18 = {
  "class": "space-y-5"
};



/* harmony default export */ const IntegralesDefiniesAireBorneRacinevue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    var root = (0,vue_esm_bundler.ref)(null),
        graphBetweenContainer = (0,vue_esm_bundler.ref)(null),
        solutions = (0,vue_esm_bundler.ref)(0);
    var graphBetween;

    function loadGraphBetween() {
      graphBetween = new esm.Graph(graphBetweenContainer.value, {
        origin: {
          x: 300,
          y: 500
        }
      });
      graphBetween.axis();
      var fx = graphBetween.plot('2*x-1'),
          fxSqrt = graphBetween.plot('sqrt(8*x+17)', {
        domain: {
          min: -17 / 8,
          max: 10
        },
        samples: 20
      });
      graphBetween.point(-17 / 8, 0, 'A').asCircle();
      graphBetween.point(0.5, 0, 'B').asCircle();
      graphBetween.point(4, 0, 'C').asCircle();
      graphBetween.point(4, 7, 'D').asCircle();
      fxSqrt.fillBetween(false, -17 / 8, 4);
      fx.fillBetween(false, 0.5, 4).svg.fill('red');
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
      }, null, 512), (0,vue_esm_bundler.createElementVNode)("div", null, [_hoisted_3, _hoisted_4, (0,vue_esm_bundler.createElementVNode)("ol", _hoisted_5, [_hoisted_6, _hoisted_7, _hoisted_8, (0,vue_esm_bundler.createElementVNode)("li", null, [_hoisted_9, (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, '\\mathcal{A}_1 = \\int_{a}^{c}\\ g(x) \\text{d}x \\qquad \\qquad \\mathcal{A}_2 = \\int_{b}^{c}\\ f(x) \\text{d}x ', void 0, {
        display: true
      }]])]), _hoisted_10])]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_11, [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_12, [_hoisted_13, (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("button", {
        "class": "btn px-2 py-1",
        onClick: _cache[0] || (_cache[0] = function ($event) {
          return solutions.value++;
        })
      }, " Etape suivante ", 512), [[vue_esm_bundler.vShow, solutions.value < 5]])]), (0,vue_esm_bundler.createElementVNode)("ol", _hoisted_14, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("li", null, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, '\\sqrt{8x+17} = 0\\implies 8x+17=0 \\implies x = -\\dfrac{17}{8}', void 0, {
        boxed: true
      }]])], 512), [[vue_esm_bundler.vShow, solutions.value > 0]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("li", null, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, '2x-1 = 0 \\implies x = \\dfrac{1}{2}', void 0, {
        boxed: true
      }]])], 512), [[vue_esm_bundler.vShow, solutions.value > 1]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("li", null, [_hoisted_15, (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, "\n\t\t\t\t\t\\begin{aligned}\n\t\t\t\t\t2x-1 &= \\sqrt{8x+17}\\\\\n\t\t\t\t\t(2x-1)^2 &= 8x+17\\\\\n\t\t\t\t\t4x^2-4x+1 &= 8x+17\\\\\n\t\t\t\t\t4x^2-12x-16 &= 0\\\\\n\t\t\t\t\tx^2-3x-4 &= 0\\\\\n\t\t\t\t\t(x-4)(x+1) &= 0\n\t\t\t\t\t\\end{aligned}\n\t\t\t\t\t", void 0, {
        display: true,
        left: true
      }]]), _hoisted_16], 512), [[vue_esm_bundler.vShow, solutions.value > 2]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("li", null, [_hoisted_17, (0,vue_esm_bundler.createElementVNode)("div", _hoisted_18, [(0,vue_esm_bundler.createElementVNode)("p", null, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, '\\displaystyle \\mathcal{A}_1 = \\int_{-17/8}^{4} \\sqrt{8x+17} \\text{d}x =\n' + '\t\t\t\t\t\t\t\t\\frac{2}{24}\\sqrt{8x+17}^3 \\Big\\vert_{-17/8}^{4} \\approx 28.58', void 0, {
        boxed: true
      }]])]), (0,vue_esm_bundler.createElementVNode)("p", null, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, '\\displaystyle \\mathcal{A}_2 = \\int_{1/2}^{4} 2x-1 \\text{d}x = x^2-x\\Big\\vert_{1/2}^{4} = 12.25', void 0, {
        boxed: true
      }]])])])], 512), [[vue_esm_bundler.vShow, solutions.value > 3]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("li", null, " \\(\\big\\vert\\mathcal{A}_1\\big\\vert-\\big\\vert\\mathcal{A}_2\\big\\vert = 28.58-12.25 \\approx 16.33\\) ", 512), [[vue_esm_bundler.vShow, solutions.value > 4]])])])])], 512);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireBorneRacine.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireBorneRacine.vue



const __exports__ = IntegralesDefiniesAireBorneRacinevue_type_script_setup_true_lang_js;

/* harmony default export */ const IntegralesDefiniesAireBorneRacine = (__exports__);

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