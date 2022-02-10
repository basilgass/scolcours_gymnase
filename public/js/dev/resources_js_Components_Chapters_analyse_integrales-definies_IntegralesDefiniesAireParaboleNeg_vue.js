"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_Chapters_analyse_integrales-definies_IntegralesDefiniesAireParaboleNeg_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=script&setup=true&lang=js":
/*!***************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=script&setup=true&lang=js ***!
  \***************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var _Components_Ui_ExampleTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/Ui/ExampleTitle */ "./resources/js/Components/Ui/ExampleTitle.vue");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var root = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null),
        graphBetweenContainer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null),
        solutions = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(0);
    var graphBetween;

    function loadGraphBetween() {
      graphBetween = new PiDraw(graphBetweenContainer.value, {
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

    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onMounted)(function () {
      katexAutoRender(root.value);
      loadGraphBetween();
    });
    var __returned__ = {
      root: root,
      graphBetweenContainer: graphBetweenContainer,
      solutions: solutions,
      graphBetween: graphBetween,
      loadGraphBetween: loadGraphBetween,
      onMounted: vue__WEBPACK_IMPORTED_MODULE_0__.onMounted,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref,
      ExampleTitle: _Components_Ui_ExampleTitle__WEBPACK_IMPORTED_MODULE_1__["default"]
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=template&id=73499e02":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=template&id=73499e02 ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  ref: "root"
};

var _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Aire entre une parabole et l'axe \\(O_x\\)");

var _hoisted_3 = {
  "class": "grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch"
};
var _hoisted_4 = {
  ref: "graphBetweenContainer",
  "class": "max-w-lg"
};

var _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Calculer l'aire entre \\(f(x)= \\dfrac{1}{4}x^2-\\dfrac{7}{4}x-2\\) et l'axe \\(O_x\\) "), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h3", {
  "class": "mt-8 mb-4 font-semibold"
}, " Marche à suivre "), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("ol", {
  "class": "list-decimal list-space space-y-4"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("li", null, "Calculer les zéros de \\(f(x)\\)"), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("li", null, "Calculer l'intégrale définie bornée entre les deux zéros"), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("li", null, "En déduire l'aire")])], -1
/* HOISTED */
);

var _hoisted_6 = {
  "class": "lg:col-span-2"
};
var _hoisted_7 = {
  "class": "flex items-center mt-8 mb-4 space-x-10"
};

var _hoisted_8 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h3", {
  "class": "font-semibold"
}, " Résolution ", -1
/* HOISTED */
);

var _hoisted_9 = {
  "class": "list-decimal list-space space-y-4"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["ExampleTitle"], null, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_2];
    }),
    _: 1
    /* STABLE */

  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, null, 512
  /* NEED_PATCH */
  ), _hoisted_5, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_6, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_7, [_hoisted_8, (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn px-2 py-1",
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return $setup.solutions++;
    })
  }, " Etape suivante ", 512
  /* NEED_PATCH */
  ), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, $setup.solutions < 3]])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("ol", _hoisted_9, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("li", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, '\\dfrac{1}{4}x^2-\\frac{7}{4}x-2= 0 \\implies \\dfrac{1}{4}\\big( x^2-7x-8 \\big) = 0 \\implies \\dfrac{1}{4}(x+1 )(x-8) = 0 \\implies x=-1 \\text{ et } x = 8', void 0, {
    boxed: true
  }]])], 512
  /* NEED_PATCH */
  ), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, $setup.solutions > 0]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("li", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, '\\displaystyle \\int_{-1}^{8} \\frac{1}{4}x^2-\\frac{7}{4}x-2 \\ \\text{d}x = \\frac{1}{12}x^3 - \\frac{7}{8}x^2-2x \\Big\\vert_{-1}^8 \\approx -\\frac{88}{3} - \\frac{25}{24} = -\\frac{243}{8} = -30.375', void 0, {
    boxed: true
  }]])], 512
  /* NEED_PATCH */
  ), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, $setup.solutions > 1]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("li", null, " L'aire entre la courbe et l'axe \\(O_x\\) vaut \\(\\big\\vert-30.375\\big\\vert = 30.375\\) ", 512
  /* NEED_PATCH */
  ), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, $setup.solutions > 2]])])])])], 512
  /* NEED_PATCH */
  );
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/ExampleTitle.vue?vue&type=template&id=c5d97264":
/*!*************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/ExampleTitle.vue?vue&type=template&id=c5d97264 ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "text-xl font-mono mt-6 mb-2"
};
function render(_ctx, _cache) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("h2", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "default")]);
}

/***/ }),

/***/ "./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue":
/*!************************************************************************************************************!*\
  !*** ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _IntegralesDefiniesAireParaboleNeg_vue_vue_type_template_id_73499e02__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IntegralesDefiniesAireParaboleNeg.vue?vue&type=template&id=73499e02 */ "./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=template&id=73499e02");
/* harmony import */ var _IntegralesDefiniesAireParaboleNeg_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IntegralesDefiniesAireParaboleNeg.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_IntegralesDefiniesAireParaboleNeg_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_IntegralesDefiniesAireParaboleNeg_vue_vue_type_template_id_73499e02__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Ui/ExampleTitle.vue":
/*!*****************************************************!*\
  !*** ./resources/js/Components/Ui/ExampleTitle.vue ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ExampleTitle_vue_vue_type_template_id_c5d97264__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExampleTitle.vue?vue&type=template&id=c5d97264 */ "./resources/js/Components/Ui/ExampleTitle.vue?vue&type=template&id=c5d97264");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");

const script = {}

;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(script, [['render',_ExampleTitle_vue_vue_type_template_id_c5d97264__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Ui/ExampleTitle.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=script&setup=true&lang=js":
/*!***********************************************************************************************************************************************!*\
  !*** ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=script&setup=true&lang=js ***!
  \***********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_IntegralesDefiniesAireParaboleNeg_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_IntegralesDefiniesAireParaboleNeg_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./IntegralesDefiniesAireParaboleNeg.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=template&id=73499e02":
/*!******************************************************************************************************************************************!*\
  !*** ./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=template&id=73499e02 ***!
  \******************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_IntegralesDefiniesAireParaboleNeg_vue_vue_type_template_id_73499e02__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_IntegralesDefiniesAireParaboleNeg_vue_vue_type_template_id_73499e02__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./IntegralesDefiniesAireParaboleNeg.vue?vue&type=template&id=73499e02 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireParaboleNeg.vue?vue&type=template&id=73499e02");


/***/ }),

/***/ "./resources/js/Components/Ui/ExampleTitle.vue?vue&type=template&id=c5d97264":
/*!***********************************************************************************!*\
  !*** ./resources/js/Components/Ui/ExampleTitle.vue?vue&type=template&id=c5d97264 ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ExampleTitle_vue_vue_type_template_id_c5d97264__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ExampleTitle_vue_vue_type_template_id_c5d97264__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./ExampleTitle.vue?vue&type=template&id=c5d97264 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/ExampleTitle.vue?vue&type=template&id=c5d97264");


/***/ })

}]);