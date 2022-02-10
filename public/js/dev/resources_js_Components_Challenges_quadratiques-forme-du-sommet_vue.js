"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_Challenges_quadratiques-forme-du-sommet_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js":
/*!********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var _Components_Challenges_ui_challengeTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/Challenges/ui/challengeTitle */ "./resources/js/Components/Challenges/ui/challengeTitle.vue");

 // Valeur nécessaire pour nommer la fonction

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var title = 'quadratique - la forme du sommet'; // Le programme...

    var answer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)({
      a: 'a',
      b: '-\\alpha',
      c: '+\\beta'
    }),
        currentGivenAnswer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)('a'),
        points = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(0),
        level = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(5),
        poly = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(newQuestion());
    var displayAnswer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      var texA, texB, texC;

      if (answer.value.a === '+1') {
        texA = '';
      } else if (answer.value.a === '-1') {
        texA = '-';
      } else {
        texA = isNaN(answer.value.a) ? answer.value.a : +answer.value.a;
      }

      texA = currentGivenAnswer.value === 'a' ? "\\colorbox{Lime}{$ ".concat(texA, " $}") : texA;
      texB = currentGivenAnswer.value === 'b' ? "\\colorbox{Lime}{$".concat(answer.value.b, "$}") : answer.value.b;
      texC = currentGivenAnswer.value === 'c' ? "\\colorbox{Lime}{$".concat(answer.value.c, "$}") : answer.value.c;
      return "".concat(texA, "(x").concat(texB, ")^2").concat(texC);
    });

    function newQuestion() {
      resetAnswer();
      var ra = points.value >= level.value ? Pi.Random.numberSym(6, false) : 1,
          rb = Pi.Random.numberSym(6, false),
          rc = Pi.Random.numberSym(10, false);
      return new Pi.Polynom('x', ra, 2 * rb * ra, rb * rb * ra + rc);
    }

    function resetAnswer() {
      answer.value = {
        a: 'a',
        b: '-\\alpha',
        c: '+\\beta'
      };
      currentGivenAnswer.value = 'a';

      if (points.value < level.value) {
        answer.value.a = '+1';
        currentGivenAnswer.value = 'b';
      }
    }

    function updateAnswer(value) {
      answer.value[currentGivenAnswer.value] = value;

      if (currentGivenAnswer.value === undefined) {
        resetAnswer(); // updateAnswer(value)
      } else {
        currentGivenAnswer.value = ['a', 'b', 'c'][(['a', 'b', 'c'].indexOf(currentGivenAnswer.value) + 1) % 3];

        if (points.value < level.value && currentGivenAnswer.value === 'a') {
          currentGivenAnswer.value = 'b';
        }
      }
    }

    function validateAnswer() {
      var ra = +answer.value.a,
          rb = +answer.value.b,
          rc = +answer.value.c;
      var P = new Pi.Polynom('x', ra, 2 * rb * ra, rb * rb * ra + rc);

      if (P.isEqual(poly.value)) {
        points.value++;
        answer.value = {
          a: '',
          b: '',
          c: ''
        };
        currentGivenAnswer.value = 'a'; // Generate new Pi.polynom

        poly.value = newQuestion();
      } else {
        points.value = 0;
      }
    }

    var __returned__ = {
      title: title,
      answer: answer,
      currentGivenAnswer: currentGivenAnswer,
      points: points,
      level: level,
      poly: poly,
      displayAnswer: displayAnswer,
      newQuestion: newQuestion,
      resetAnswer: resetAnswer,
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2 ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  ), [[_directive_katex, $setup.displayAnswer]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    "class": "grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5"
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn btn-primary",
    onClick: $setup.resetAnswer
  }, " recommencer "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn btn-success",
    onClick: $setup.validateAnswer
  }, " valider ")]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(10, function (n) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
      key: "terme-".concat(n),
      "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
      onClick: function onClick($event) {
        return $setup.updateAnswer("-".concat(n));
      }
    }, null, 8
    /* PROPS */
    , _hoisted_3), [[_directive_katex, "-".concat(n), void 0, {
      inline: true
    }]]);
  }), 64
  /* STABLE_FRAGMENT */
  ))]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(10, function (n) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
      key: "terme--".concat(n),
      "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
      onClick: function onClick($event) {
        return $setup.updateAnswer("+".concat(n));
      }
    }, null, 8
    /* PROPS */
    , _hoisted_5), [[_directive_katex, "+".concat(n), void 0, {
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

/***/ "./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue":
/*!*****************************************************************************!*\
  !*** ./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _quadratiques_forme_du_sommet_vue_vue_type_template_id_c16550a2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2 */ "./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2");
/* harmony import */ var _quadratiques_forme_du_sommet_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_quadratiques_forme_du_sommet_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_quadratiques_forme_du_sommet_vue_vue_type_template_id_c16550a2__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue"]])
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

/***/ "./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js":
/*!****************************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratiques_forme_du_sommet_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratiques_forme_du_sommet_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js");
 

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

/***/ "./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2 ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratiques_forme_du_sommet_vue_vue_type_template_id_c16550a2__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratiques_forme_du_sommet_vue_vue_type_template_id_c16550a2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2");


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