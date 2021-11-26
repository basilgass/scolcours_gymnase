"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_Quizz_trinome_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Quizz/trinome.vue?vue&type=script&setup=true&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Quizz/trinome.vue?vue&type=script&setup=true&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var pimath_esm_maths_algebra__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pimath/esm/maths/algebra */ "./node_modules/pimath/esm/maths/algebra/index.js");
/* harmony import */ var pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pimath/esm/maths/random */ "./node_modules/pimath/esm/maths/random/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    "quizz": String
  },
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var props = __props;
    var answer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)([]),
        points = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(0),
        equation = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(newQuestion());
    var factorisation = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      if (answer.value.length === 0) {
        return "?=0";
      }

      return answer.value.map(function (x) {
        return "(".concat(x, ")");
      }).join("") + "=0";
    });

    function newQuestion() {
      return new pimath_esm_maths_algebra__WEBPACK_IMPORTED_MODULE_1__.Equation(pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_2__.Random.polynom({
        letters: "x",
        degree: 2,
        factorable: true,
        unit: true,
        allowNullMonom: false
      }), new pimath_esm_maths_algebra__WEBPACK_IMPORTED_MODULE_1__.Polynom("0"));
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

      var P = new pimath_esm_maths_algebra__WEBPACK_IMPORTED_MODULE_1__.Polynom(answer.value.map(function (x) {
        return "(".concat(x, ")");
      }).join(""));

      if (P.isEqual(equation.value.left)) {
        points.value++;
        answer.value = []; // Generate new polynom

        equation.value = newQuestion();
      } else {
        points.value = 0;
      }
    }

    var __returned__ = {
      props: props,
      answer: answer,
      points: points,
      equation: equation,
      factorisation: factorisation,
      newQuestion: newQuestion,
      updateAnswer: updateAnswer,
      validateAnswer: validateAnswer,
      computed: vue__WEBPACK_IMPORTED_MODULE_0__.computed,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref,
      Equation: pimath_esm_maths_algebra__WEBPACK_IMPORTED_MODULE_1__.Equation,
      Polynom: pimath_esm_maths_algebra__WEBPACK_IMPORTED_MODULE_1__.Polynom,
      Random: pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_2__.Random
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Quizz/trinome.vue?vue&type=template&id=7ea116bf":
/*!***********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Quizz/trinome.vue?vue&type=template&id=7ea116bf ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");


var _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h1", {
  "class": "text-xl"
}, " Factoriser ", -1
/* HOISTED */
);

var _hoisted_2 = {
  "class": "grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5"
};
var _hoisted_3 = {
  "class": "space-y-2"
};
var _hoisted_4 = ["onClick"];
var _hoisted_5 = {
  "class": "space-y-2"
};
var _hoisted_6 = ["onClick"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [_hoisted_1, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, "score actuel: " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.points), 1
  /* TEXT */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, $setup.equation.tex]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, $setup.factorisation]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    "class": "text-center"
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn btn-success",
    onClick: $setup.validateAnswer
  }, " Valider ")]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(10, function (n) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
      key: "terme-".concat(n),
      "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
      onClick: function onClick($event) {
        return $setup.updateAnswer("x-".concat(n));
      }
    }, null, 8
    /* PROPS */
    , _hoisted_4), [[_directive_katex, "x-".concat(n), void 0, {
      inline: true
    }]]);
  }), 64
  /* STABLE_FRAGMENT */
  ))]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_5, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(10, function (n) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
      key: "terme--".concat(n),
      "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
      onClick: function onClick($event) {
        return $setup.updateAnswer("x+".concat(n));
      }
    }, null, 8
    /* PROPS */
    , _hoisted_6), [[_directive_katex, "x+".concat(n), void 0, {
      inline: true
    }]]);
  }), 64
  /* STABLE_FRAGMENT */
  ))])])], 64
  /* STABLE_FRAGMENT */
  );
}

/***/ }),

/***/ "./resources/js/Components/Quizz/trinome.vue":
/*!***************************************************!*\
  !*** ./resources/js/Components/Quizz/trinome.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _trinome_vue_vue_type_template_id_7ea116bf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trinome.vue?vue&type=template&id=7ea116bf */ "./resources/js/Components/Quizz/trinome.vue?vue&type=template&id=7ea116bf");
/* harmony import */ var _trinome_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./trinome.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Quizz/trinome.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_trinome_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_trinome_vue_vue_type_template_id_7ea116bf__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Quizz/trinome.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Quizz/trinome.vue?vue&type=script&setup=true&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/Components/Quizz/trinome.vue?vue&type=script&setup=true&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_trinome_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_trinome_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./trinome.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Quizz/trinome.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Quizz/trinome.vue?vue&type=template&id=7ea116bf":
/*!*********************************************************************************!*\
  !*** ./resources/js/Components/Quizz/trinome.vue?vue&type=template&id=7ea116bf ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_trinome_vue_vue_type_template_id_7ea116bf__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_trinome_vue_vue_type_template_id_7ea116bf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./trinome.vue?vue&type=template&id=7ea116bf */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Quizz/trinome.vue?vue&type=template&id=7ea116bf");


/***/ })

}]);