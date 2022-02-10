"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_Chapters_analyse_integrales-definies_IntegralesDefiniesRiemann_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=script&setup=true&lang=js":
/*!*******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=script&setup=true&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var root = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null),
        riemann = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null),
        rectangles = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(8);
    var graph, riemannfx;

    function loadRieman() {
      // Generate the graph function
      graph = new PiDraw(riemann.value);
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

    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onMounted)(function () {
      katexAutoRender(root.value);
      loadRieman();
    });
    var __returned__ = {
      root: root,
      riemann: riemann,
      rectangles: rectangles,
      graph: graph,
      riemannfx: riemannfx,
      loadRieman: loadRieman,
      updateRectangles: updateRectangles,
      onMounted: vue__WEBPACK_IMPORTED_MODULE_0__.onMounted,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=template&id=e1ca441c":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=template&id=e1ca441c ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  ref: "root",
  "class": "max-w-lg flex flex-col"
};
var _hoisted_2 = {
  ref: "riemann"
};
var _hoisted_3 = {
  "class": "space-x-5 flex justify-center items-center mt-5"
};
var _hoisted_4 = ["disabled"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, null, 512
  /* NEED_PATCH */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn",
    disabled: $setup.rectangles <= 2,
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return $setup.updateRectangles(-1);
    })
  }, " - ", 8
  /* PROPS */
  , _hoisted_4), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.rectangles), 1
  /* TEXT */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn",
    onClick: _cache[1] || (_cache[1] = function ($event) {
      return $setup.updateRectangles(1);
    })
  }, " + ")])], 512
  /* NEED_PATCH */
  );
}

/***/ }),

/***/ "./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue":
/*!****************************************************************************************************!*\
  !*** ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _IntegralesDefiniesRiemann_vue_vue_type_template_id_e1ca441c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IntegralesDefiniesRiemann.vue?vue&type=template&id=e1ca441c */ "./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=template&id=e1ca441c");
/* harmony import */ var _IntegralesDefiniesRiemann_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IntegralesDefiniesRiemann.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_IntegralesDefiniesRiemann_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_IntegralesDefiniesRiemann_vue_vue_type_template_id_e1ca441c__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=script&setup=true&lang=js":
/*!***************************************************************************************************************************************!*\
  !*** ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=script&setup=true&lang=js ***!
  \***************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_IntegralesDefiniesRiemann_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_IntegralesDefiniesRiemann_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./IntegralesDefiniesRiemann.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=template&id=e1ca441c":
/*!**********************************************************************************************************************************!*\
  !*** ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=template&id=e1ca441c ***!
  \**********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_IntegralesDefiniesRiemann_vue_vue_type_template_id_e1ca441c__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_IntegralesDefiniesRiemann_vue_vue_type_template_id_e1ca441c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./IntegralesDefiniesRiemann.vue?vue&type=template&id=e1ca441c */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann.vue?vue&type=template&id=e1ca441c");


/***/ })

}]);