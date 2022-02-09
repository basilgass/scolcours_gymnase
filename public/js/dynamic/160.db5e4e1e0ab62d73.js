"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[160],{

/***/ 160:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ IntegrallesDefinies532)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./node_modules/pidraw/esm/index.js
var esm = __webpack_require__(8259);
// EXTERNAL MODULE: ./resources/js/Components/Ui/ExampleTitle.vue + 2 modules
var ExampleTitle = __webpack_require__(4671);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegrallesDefinies532.vue?vue&type=script&setup=true&lang=js


var _hoisted_1 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)("Exercice 5.32");

var _hoisted_2 = {
  "class": "grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch"
};

var _hoisted_3 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Calculer l'aire de la partie hachurée entre \\(y=-x\\) et \\(y=\\sqrt{2-x}\\) ");

var _hoisted_4 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("h3", {
  "class": "mt-8 mb-4 font-semibold"
}, " Marche à suivre ", -1);

var _hoisted_5 = {
  "class": "list-decimal list-space space-y-4"
};
var _hoisted_6 = {
  "class": "lg:col-span-2"
};
var _hoisted_7 = {
  "class": "flex items-center mt-8 mb-4 space-x-10"
};

var _hoisted_8 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("h3", {
  "class": "font-semibold"
}, " Résolution ", -1);

var _hoisted_9 = {
  "class": "list-decimal list-space space-y-4"
};



/* harmony default export */ const IntegrallesDefinies532vue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    var root = (0,vue_esm_bundler.ref)(null),
        graphBetweenContainer = (0,vue_esm_bundler.ref)(null),
        solutions = (0,vue_esm_bundler.ref)(0);
    var graphBetween;
    var steps = [{
      'title': 'Calculer \\(a\\), la coordonnée \\(x\\) du point d\'intersection entre \\(y = -x\\) et \\(y = \\sqrt{2-x}\\)',
      'body': "R\xE9solution de l'\xE9quation \\(-x = \\sqrt{2-x}\\)\n\t\t\t\t\\[\\begin{aligned}\n\t\t\t\t-x =& \\sqrt{2-x} \\\\\n\t\t\t\tx^2 =& 2-x \\\\\n\t\t\t\tx^2+x-2 =&0 \\\\\n\t\t\t\t(x+2)(x-1) =& 0\\\\\n\t\t\t\t\\end{aligned}\\]\n\t\t\t\tOn obtient \\(x=-2 \\in \\text{ED}\\) et \\(x=1 \\not\\in\\text{ED}\\) (car une racine est positive)"
    }, {
      'title': 'Calculer \\(b\\), la coordonnée \\(x\\) du point d\'intersection entre \\(y = \\sqrt{2-x}\\) et l\'axe \\(O_x\\)',
      'body': '\\[\\sqrt{2-x}=0 \\implies 2-x = 0 \\implies x = 2\\]'
    }, {
      'title': 'Calculer les intégrales définies \\[\\mathcal{A}_1 = \\int_a^b\\sqrt{x-2}\\ \\text{d}x \\qquad \\qquad \\mathcal{A}_2=\\int_a^0 -x \\ \\text{d}x\\]',
      'body': "\\[\\mathcal{A}_1 = \\int_{-2}^{2} \\sqrt{2-x}\\ \\text{d}x = -\\int_{-2}^{2} -1 \\cdot \\underbrace{\\sqrt{2-x}}_{()' = -1}\\ \\text{d}x = -\\frac{2}{3}\\sqrt{2-x}^3 \\Big\\vert_{-2}^{2} = 0-\\left(-\\frac{2}{3}\\cdot 8\\right) = -\\frac{16}{3}\\]\n\t\t\\[\\mathcal{A}_2 = \\int_{-2}^{0} -x \\ \\text{d}x = -\\frac{1}{2}x^2\\Big\\vert_{-2}^{0} = 0 - \\left( -\\frac{1}{2}\\cdot 4 \\right) = 2\\]"
    }, {
      'title': 'Calculer l\'aire de la surface colorée \\(\\left\\vert\\mathcal{A}_1\\right\\vert - \\left\\vert\\mathcal{A}_2\\right\\vert\\)',
      'body': 'L\'aire de la figure hachurée est \\[\\left\\vert\\mathcal{A}_1\\right\\vert - \\left\\vert\\mathcal{A}_2\\right\\vert = \\frac{16}{3} - 2 = \\frac{10}{3}\\]'
    }];

    function loadGraphBetween() {
      graphBetween = new esm.Graph(graphBetweenContainer.value, {
        grid: {
          x: 100,
          y: 100
        },
        origin: {
          x: 300,
          y: 500
        }
      });
      graphBetween.axis();
      var fx = graphBetween.plot('-x'),
          fxSqrt = graphBetween.plot('sqrt(2-x)', {
        domain: {
          min: -4,
          max: 2
        },
        samples: 20
      });
      fxSqrt.fillBetween(fx, -2, 0.01);
      fxSqrt.fillBetween(false, 0, 2);
    }

    (0,vue_esm_bundler.onMounted)(function () {
      katexAutoRender(root.value);
      loadGraphBetween();
    });
    return function (_ctx, _cache) {
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
      }, null, 512), (0,vue_esm_bundler.createElementVNode)("div", null, [_hoisted_3, _hoisted_4, (0,vue_esm_bundler.createElementVNode)("ol", _hoisted_5, [((0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)((0,vue_esm_bundler.unref)(steps), function (item, index) {
        return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("li", {
          key: "step-title-".concat(index),
          "class": "katex-boxed"
        }, (0,vue_esm_bundler.toDisplayString)(item.title), 1);
      }), 128))])]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_6, [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_7, [_hoisted_8, (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("button", {
        "class": "btn px-2 py-1",
        onClick: _cache[0] || (_cache[0] = function ($event) {
          return solutions.value++;
        })
      }, " Etape suivante ", 512), [[vue_esm_bundler.vShow, solutions.value < 4]])]), (0,vue_esm_bundler.createElementVNode)("ol", _hoisted_9, [((0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)((0,vue_esm_bundler.unref)(steps), function (item, index) {
        return (0,vue_esm_bundler.withDirectives)(((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("li", {
          key: "step-".concat(index),
          "class": "katex-boxed katex-left"
        }, (0,vue_esm_bundler.toDisplayString)(item.body), 1)), [[vue_esm_bundler.vShow, solutions.value > index]]);
      }), 128))])])])], 512);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/analyse/integrales-definies/IntegrallesDefinies532.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/analyse/integrales-definies/IntegrallesDefinies532.vue



const __exports__ = IntegrallesDefinies532vue_type_script_setup_true_lang_js;

/* harmony default export */ const IntegrallesDefinies532 = (__exports__);

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