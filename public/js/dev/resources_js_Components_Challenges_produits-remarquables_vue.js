"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_Challenges_produits-remarquables_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=script&setup=true&lang=js":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=script&setup=true&lang=js ***!
  \*************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var _Components_Challenges_ui_challengeTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/Challenges/ui/challengeTitle */ "./resources/js/Components/Challenges/ui/challengeTitle.vue");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var title = 'produits remarquables du 2ème degré';
    var answer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)([]),
        points = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(0),
        poly = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(newQuestion());
    var factorisation = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      if (answer.value.length === 0) {
        return '?';
      }

      return answer.value.map(function (x) {
        return "(".concat(x, ")");
      }).join('');
    });

    function newQuestion() {
      var P = Pi.Random.polynom({
        letters: 'x',
        degree: 1,
        unit: true,
        allowNullMonom: false
      });

      if (Pi.Random.bool(0.40)) {
        var Q = P.clone();
        Q.monoms[1].opposed();
        return P.clone().multiply(Q);
      } else {
        return P.pow(2);
      }
    }

    function updateAnswer(value) {
      answer.value.push(value);

      if (answer.value.length > 2) {
        answer.value.shift();
      }
    }

    function validateAnswer() {
      if (answer.value.length !== 2) {
        return false;
      }

      var P = new Pi.Polynom(answer.value.map(function (x) {
        return "(".concat(x, ")");
      }).join(''));

      if (P.isEqual(poly.value)) {
        points.value++;
        answer.value = []; // Generate new polynom

        poly.value = newQuestion();
      } else {
        points.value = 0;
      }
    }

    var __returned__ = {
      title: title,
      answer: answer,
      points: points,
      poly: poly,
      factorisation: factorisation,
      newQuestion: newQuestion,
      updateAnswer: updateAnswer,
      validateAnswer: validateAnswer,
      computed: vue__WEBPACK_IMPORTED_MODULE_0__.computed,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref,
      ChallengeTitle: _Components_Challenges_ui_challengeTitle__WEBPACK_IMPORTED_MODULE_1__["default"]
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js ***!
  \*********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    title: String
  },
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var __returned__ = {};
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=template&id=37d7a3f9":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=template&id=37d7a3f9 ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5"
};
var _hoisted_2 = {
  "class": "space-y-2"
};
var _hoisted_3 = ["onClick"];
var _hoisted_4 = {
  "class": "space-y-2"
};
var _hoisted_5 = ["onClick"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("article", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["ChallengeTitle"], {
    title: $setup.title
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, "score actuel: " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.points), 1
  /* TEXT */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, $setup.poly.tex]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, $setup.factorisation]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    "class": "text-center"
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn btn-success",
    onClick: $setup.validateAnswer
  }, " Valider ")]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(10, function (n) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
      key: "terme-".concat(n),
      "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
      onClick: function onClick($event) {
        return $setup.updateAnswer("x-".concat(n));
      }
    }, null, 8
    /* PROPS */
    , _hoisted_3), [[_directive_katex, "x-".concat(n), void 0, {
      inline: true
    }]]);
  }), 64
  /* STABLE_FRAGMENT */
  ))]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(10, function (n) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
      key: "terme--".concat(n),
      "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
      onClick: function onClick($event) {
        return $setup.updateAnswer("x+".concat(n));
      }
    }, null, 8
    /* PROPS */
    , _hoisted_5), [[_directive_katex, "x+".concat(n), void 0, {
      inline: true
    }]]);
  }), 64
  /* STABLE_FRAGMENT */
  ))])])]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08 ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "text-xl"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("h1", _hoisted_1, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.title), 1
  /* TEXT */
  );
}

/***/ }),

/***/ "./resources/js/Components/Challenges/produits-remarquables.vue":
/*!**********************************************************************!*\
  !*** ./resources/js/Components/Challenges/produits-remarquables.vue ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _produits_remarquables_vue_vue_type_template_id_37d7a3f9__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./produits-remarquables.vue?vue&type=template&id=37d7a3f9 */ "./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=template&id=37d7a3f9");
/* harmony import */ var _produits_remarquables_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./produits-remarquables.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_produits_remarquables_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_produits_remarquables_vue_vue_type_template_id_37d7a3f9__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Challenges/produits-remarquables.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Challenges/ui/challengeTitle.vue":
/*!******************************************************************!*\
  !*** ./resources/js/Components/Challenges/ui/challengeTitle.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _challengeTitle_vue_vue_type_template_id_3f33bc08__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./challengeTitle.vue?vue&type=template&id=3f33bc08 */ "./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08");
/* harmony import */ var _challengeTitle_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./challengeTitle.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_challengeTitle_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_challengeTitle_vue_vue_type_template_id_3f33bc08__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Challenges/ui/challengeTitle.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=script&setup=true&lang=js":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=script&setup=true&lang=js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_produits_remarquables_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_produits_remarquables_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./produits-remarquables.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeTitle_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeTitle_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./challengeTitle.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=template&id=37d7a3f9":
/*!****************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=template&id=37d7a3f9 ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_produits_remarquables_vue_vue_type_template_id_37d7a3f9__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_produits_remarquables_vue_vue_type_template_id_37d7a3f9__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./produits-remarquables.vue?vue&type=template&id=37d7a3f9 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=template&id=37d7a3f9");


/***/ }),

/***/ "./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08":
/*!************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08 ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeTitle_vue_vue_type_template_id_3f33bc08__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeTitle_vue_vue_type_template_id_3f33bc08__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./challengeTitle.vue?vue&type=template&id=3f33bc08 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08");


/***/ })

}]);