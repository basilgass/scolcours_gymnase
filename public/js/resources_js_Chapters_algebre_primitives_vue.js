"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Chapters_algebre_primitives_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Chapters/algebre/primitives.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Chapters/algebre/primitives.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/Components/Ui/Panel */ "./resources/js/Components/Ui/Panel.vue");
/* harmony import */ var _Components_Ui_KatexEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/Ui/KatexEditor */ "./resources/js/Components/Ui/KatexEditor.vue");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Primitives",
  components: {
    KatexEditor: _Components_Ui_KatexEditor__WEBPACK_IMPORTED_MODULE_1__["default"],
    Panel: _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      userAnswer: "",
      question: "",
      answer: ""
    };
  },
  computed: {
    correct: function correct() {
      return this.userAnswer === this.answer;
    }
  },
  mounted: function mounted() {
    this.newQuestion(); // Auto render the math inside this component

    katexAutoRender(this.$el);
  },
  methods: {
    newQuestion: function newQuestion() {
      var M = new Pi.Monom().random("x", Pi.Numeric.randomInt(1, 8), true);
      this.question = M.tex;
      this.answer = M.tex;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "KatexEditor",
  props: {
    name: {
      type: String,
      "default": "math"
    },
    modelValue: {
      type: String,
      "default": ""
    },
    latex: {
      type: Boolean,
      "default": false
    }
  },
  emits: ["update:modelValue"],
  data: function data() {
    return {
      tex: "",
      asciiMode: false
    };
  },
  mounted: function mounted() {
    this.tex = "" + this.modelValue;
    this.asciiMode = !this.latex;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Chapters/algebre/primitives.vue?vue&type=template&id=f4dc422c":
/*!**************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Chapters/algebre/primitives.vue?vue&type=template&id=f4dc422c ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");


var _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" La primitive \\(F\\) d'une fonction \\(f\\) est la fonction qui, lorsqu'elle est dérivée, donne la fonction \\(f\\) ");

var _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", null, "exemples", -1
/* HOISTED */
);

var _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, " \\(f(x) = x^2 \\implies F(x) = \\frac{1}{3}\\cdot x^3 + c\\) avec \\(c \\in \\mathbb{R}\\) ", -1
/* HOISTED */
);

var _hoisted_4 = {
  "class": "py-2"
};

var _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Calculer la primitive de ");

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_Panel = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("Panel");

  var _component_KatexEditor = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("KatexEditor");

  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("section", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_Panel, {
    "class": "bg-green-300 border-green-600"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_1];
    }),
    _: 1
    /* STABLE */

  }), _hoisted_2, _hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_Panel, {
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["max-w-md", $options.correct ? 'bg-green-500' : ''])
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [_hoisted_5, (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, null, 512
      /* NEED_PATCH */
      ), [[_directive_katex, "f(x)=".concat($data.question), void 0, {
        inline: true
      }]])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_KatexEditor, {
        modelValue: $data.userAnswer,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return $data.userAnswer = $event;
        })
      }, null, 8
      /* PROPS */
      , ["modelValue"])];
    }),
    _: 1
    /* STABLE */

  }, 8
  /* PROPS */
  , ["class"])]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/KatexEditor.vue?vue&type=template&id=3ccbfe4e":
/*!************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/KatexEditor.vue?vue&type=template&id=3ccbfe4e ***!
  \************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "katex-editor w-full"
};
var _hoisted_2 = {
  "class": "flex justify-between"
};
var _hoisted_3 = ["for"];
var _hoisted_4 = ["textContent"];
var _hoisted_5 = ["name", "value"];
var _hoisted_6 = {
  "class": "min-h-[40px]"
};
var _hoisted_7 = {
  key: 0
};
var _hoisted_8 = {
  key: 1
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("label", {
    "class": "block uppercase font-bold text-xs text-gray-700",
    "for": $props.name
  }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.name), 9
  /* TEXT, PROPS */
  , _hoisted_3), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
    "class": "text-xs",
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return $data.asciiMode = !$data.asciiMode;
    }),
    textContent: (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.asciiMode ? 'ASCII' : 'LaTeX')
  }, null, 8
  /* PROPS */
  , _hoisted_4)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("input", {
    name: $props.name,
    "class": "border border-gray-200 w-full p-2 rounded",
    value: $props.modelValue,
    onInput: _cache[1] || (_cache[1] = function ($event) {
      _ctx.$emit('update:modelValue', $event.target.value);

      $data.tex = $event.target.value;
    })
  }, null, 40
  /* PROPS, HYDRATE_EVENTS */
  , _hoisted_5), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_6, [$data.asciiMode ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)(((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_7, null, 512
  /* NEED_PATCH */
  )), [[_directive_katex, $data.tex, void 0, {
    ascii: true,
    left: true
  }]]) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)(((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_8, null, 512
  /* NEED_PATCH */
  )), [[_directive_katex, $data.tex, void 0, {
    left: true
  }]])])]);
}

/***/ }),

/***/ "./resources/js/Chapters/algebre/primitives.vue":
/*!******************************************************!*\
  !*** ./resources/js/Chapters/algebre/primitives.vue ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _primitives_vue_vue_type_template_id_f4dc422c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./primitives.vue?vue&type=template&id=f4dc422c */ "./resources/js/Chapters/algebre/primitives.vue?vue&type=template&id=f4dc422c");
/* harmony import */ var _primitives_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./primitives.vue?vue&type=script&lang=js */ "./resources/js/Chapters/algebre/primitives.vue?vue&type=script&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_primitives_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_primitives_vue_vue_type_template_id_f4dc422c__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Chapters/algebre/primitives.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Ui/KatexEditor.vue":
/*!****************************************************!*\
  !*** ./resources/js/Components/Ui/KatexEditor.vue ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _KatexEditor_vue_vue_type_template_id_3ccbfe4e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./KatexEditor.vue?vue&type=template&id=3ccbfe4e */ "./resources/js/Components/Ui/KatexEditor.vue?vue&type=template&id=3ccbfe4e");
/* harmony import */ var _KatexEditor_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./KatexEditor.vue?vue&type=script&lang=js */ "./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_KatexEditor_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_KatexEditor_vue_vue_type_template_id_3ccbfe4e__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Ui/KatexEditor.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Chapters/algebre/primitives.vue?vue&type=script&lang=js":
/*!******************************************************************************!*\
  !*** ./resources/js/Chapters/algebre/primitives.vue?vue&type=script&lang=js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitives_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitives_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./primitives.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Chapters/algebre/primitives.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&lang=js":
/*!****************************************************************************!*\
  !*** ./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&lang=js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_KatexEditor_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_KatexEditor_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./KatexEditor.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Chapters/algebre/primitives.vue?vue&type=template&id=f4dc422c":
/*!************************************************************************************!*\
  !*** ./resources/js/Chapters/algebre/primitives.vue?vue&type=template&id=f4dc422c ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitives_vue_vue_type_template_id_f4dc422c__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitives_vue_vue_type_template_id_f4dc422c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./primitives.vue?vue&type=template&id=f4dc422c */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Chapters/algebre/primitives.vue?vue&type=template&id=f4dc422c");


/***/ }),

/***/ "./resources/js/Components/Ui/KatexEditor.vue?vue&type=template&id=3ccbfe4e":
/*!**********************************************************************************!*\
  !*** ./resources/js/Components/Ui/KatexEditor.vue?vue&type=template&id=3ccbfe4e ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_KatexEditor_vue_vue_type_template_id_3ccbfe4e__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_KatexEditor_vue_vue_type_template_id_3ccbfe4e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./KatexEditor.vue?vue&type=template&id=3ccbfe4e */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/KatexEditor.vue?vue&type=template&id=3ccbfe4e");


/***/ })

}]);