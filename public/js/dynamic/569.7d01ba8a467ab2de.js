"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[569],{

/***/ 7569:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ IntegralesDefiniesRiemann)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./node_modules/pidraw/esm/index.js
var esm = __webpack_require__(8259);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=script&setup=true&lang=js

var _hoisted_1 = {
  "class": "space-x-5 flex justify-center items-center mt-5"
};
var _hoisted_2 = ["disabled"];


/* harmony default export */ const IntegralesDefiniesRiemannvue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    var root = (0,vue_esm_bundler.ref)(null),
        riemann = (0,vue_esm_bundler.ref)(null),
        rectangles = (0,vue_esm_bundler.ref)(8);
    var graph, riemannfx;

    function loadRieman() {
      // Generate the graph function
      graph = new esm.Graph(riemann.value);
      graph.axis(); // Load the function

      riemannfx = graph.plot('(x-1)*(x-5)*(x-7)/20+3'); // Draw the rieman

      riemannfx.riemann(2, 8, rectangles.value);
    }

    function updateRectangles(value) {
      if (rectangles.value <= 2 && value < 0) {
        return;
      }

      rectangles.value = rectangles.value + value; // update the rectangle

      riemannfx.riemann(2, 8, rectangles.value);
    }

    (0,vue_esm_bundler.onMounted)(function () {
      katexAutoRender(root.value);
      loadRieman();
    });
    return function (_ctx, _cache) {
      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", {
        ref_key: "root",
        ref: root,
        "class": "max-w-lg flex flex-col"
      }, [(0,vue_esm_bundler.createElementVNode)("div", {
        ref_key: "riemann",
        ref: riemann
      }, null, 512), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_1, [(0,vue_esm_bundler.createElementVNode)("button", {
        "class": "btn",
        disabled: rectangles.value <= 2,
        onClick: _cache[0] || (_cache[0] = function ($event) {
          return updateRectangles(-1);
        })
      }, " - ", 8, _hoisted_2), (0,vue_esm_bundler.createElementVNode)("span", null, (0,vue_esm_bundler.toDisplayString)(rectangles.value), 1), (0,vue_esm_bundler.createElementVNode)("button", {
        "class": "btn",
        onClick: _cache[1] || (_cache[1] = function ($event) {
          return updateRectangles(1);
        })
      }, " + ")])], 512);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue



const __exports__ = IntegralesDefiniesRiemannvue_type_script_setup_true_lang_js;

/* harmony default export */ const IntegralesDefiniesRiemann = (__exports__);

/***/ })

}]);