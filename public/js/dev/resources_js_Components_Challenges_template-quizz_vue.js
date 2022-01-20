"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_Challenges_template-quizz_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/template-quizz.vue?vue&type=script&setup=true&lang=js":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/template-quizz.vue?vue&type=script&setup=true&lang=js ***!
  \******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var _Components_Ui_Keyboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/Ui/Keyboard */ "./resources/js/Components/Ui/Keyboard.vue");
/* harmony import */ var pimath_esm_maths_coefficients__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pimath/esm/maths/coefficients */ "./node_modules/pimath/esm/maths/coefficients/index.js");
/* harmony import */ var pimath_esm_maths_coefficients__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pimath_esm_maths_coefficients__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! pimath/esm/maths/random */ "./node_modules/pimath/esm/maths/random/index.js");
/* harmony import */ var pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Components_Challenges_ui_challengeWrapper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/Components/Challenges/ui/challengeWrapper */ "./resources/js/Components/Challenges/ui/challengeWrapper.vue");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var title = 'titre du challenge'; // Active variables

    var root = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null),
        // main reference wrapper
    answer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(''),
        // the answer given by the user
    points = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(0),
        // current number of points and how to handle them
    results = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)([]),
        // list of given results - simple list display.
    keyboard = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null),
        // keyboard reference.
    question = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(newQuestion()); // question: {answer: string, tex: string, ...}

    var displayAnswer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      return answer.value;
    }),
        displayQuestion = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      return question.value.tex;
    });

    function newQuestion() {
      var result = '',
          tex = ''; // Create the question

      return {
        answer: result,
        tex: tex
      };
    }

    function reset() {
      // Reset keyboard.
      keyboard.value.resetKeyStrokes();
    }

    function validate() {
      // Display the list of results.
      var result = {
        tex: question.value.tex,
        ascii: answer.value,
        correct: false
      }; // Validate answer

      if (answer.value === question.value.answer) {
        // Answer is correct
        points.value++;
        result.correct = true; // Reset and create new question

        reset();
        question.value = newQuestion();
      } else {
        // Answer is wrong
        points.value = 0;
        root.value.shake();
      } // Add the given answer to the result list.


      results.value.push(result);
    }

    var __returned__ = {
      title: title,
      root: root,
      answer: answer,
      points: points,
      results: results,
      keyboard: keyboard,
      question: question,
      displayAnswer: displayAnswer,
      displayQuestion: displayQuestion,
      newQuestion: newQuestion,
      reset: reset,
      validate: validate,
      computed: vue__WEBPACK_IMPORTED_MODULE_0__.computed,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref,
      Keyboard: _Components_Ui_Keyboard__WEBPACK_IMPORTED_MODULE_1__["default"],
      Fraction: pimath_esm_maths_coefficients__WEBPACK_IMPORTED_MODULE_2__.Fraction,
      Random: pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_3__.Random,
      ChallengeWrapper: _Components_Challenges_ui_challengeWrapper__WEBPACK_IMPORTED_MODULE_4__["default"]
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=script&setup=true&lang=js":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=script&setup=true&lang=js ***!
  \***********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/Components/Ui/Panel */ "./resources/js/Components/Ui/Panel.vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    title: String,
    points: Number,
    results: Array,
    validate: Function
  },
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;

    function shake() {
      questionWrapper.value.style.setProperty('animation-name', 'v-shake-horizontal');
      questionWrapper.value.style.setProperty('animation-duration', '500ms');
      setTimeout(function () {
        questionWrapper.value.style.setProperty('animation-name', '');
      }, 500);
    }

    var showResults = (0,vue__WEBPACK_IMPORTED_MODULE_1__.ref)(false),
        showAnswerFormat = (0,vue__WEBPACK_IMPORTED_MODULE_1__.ref)(false),
        questionWrapper = (0,vue__WEBPACK_IMPORTED_MODULE_1__.ref)(null);
    expose({
      shake: shake
    });
    var __returned__ = {
      shake: shake,
      showResults: showResults,
      showAnswerFormat: showAnswerFormat,
      questionWrapper: questionWrapper,
      Panel: _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_0__["default"],
      ref: vue__WEBPACK_IMPORTED_MODULE_1__.ref
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Keyboard.vue?vue&type=script&setup=true&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Keyboard.vue?vue&type=script&setup=true&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var _keyboards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/keyboards */ "./resources/js/keyboards.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    modelValue: String,
    keyboard: {
      type: [Object, String],
      "default": function _default() {
        return 'simple';
      }
    },
    validate: {
      type: Boolean,
      "default": false
    },
    mathOutput: {
      type: Boolean,
      "default": false
    },
    textOutput: {
      type: Boolean,
      "default": false
    }
  },
  emits: ['update:modelValue', 'validate'],
  setup: function setup(__props, _ref) {
    var expose = _ref.expose,
        emit = _ref.emit;
    var props = __props;
    var root = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null),
        keyboardGrid = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)('grid-cols-4'),
        keyStrokes = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)([]);
    var keyboardData = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      if (typeof props.keyboard === 'string' && _keyboards__WEBPACK_IMPORTED_MODULE_1__.keyboards[props.keyboard] !== undefined) {
        return _keyboards__WEBPACK_IMPORTED_MODULE_1__.keyboards[props.keyboard];
      } else {
        return props.keyboard;
      }
    });
    var keyboardComputed = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      var data = []; // Loop through all keyboard keys in the layout.

      var _iterator = _createForOfIteratorHelper(keyboardData.value.layout),
          _step;

      try {
        var _loop = function _loop() {
          var key = _step.value;
          var kkey = typeof key === 'string' ? key : key[0],
              spankey = typeof key === 'string' ? 0 : key[1],
              kdata = {};

          if (spankey === 2) {
            spankey = 'col-span-2';
          } else if (spankey === 3) {
            spankey = 'col-span-3';
          } else if (spankey === 4) {
            spankey = 'col-span-4';
          } else if (spankey === 5) {
            spankey = 'col-span-5';
          }

          kdata = {
            key: kkey,
            visible: kkey === '',
            type: _keyboards__WEBPACK_IMPORTED_MODULE_1__.keyboardKeys[kkey] === undefined ? false : _keyboards__WEBPACK_IMPORTED_MODULE_1__.keyboardKeys[kkey].type,
            display: _keyboards__WEBPACK_IMPORTED_MODULE_1__.keyboardKeys[kkey] === undefined ? false : _keyboards__WEBPACK_IMPORTED_MODULE_1__.keyboardKeys[kkey].display,
            span: spankey
          };

          if (_keyboards__WEBPACK_IMPORTED_MODULE_1__.keyboardKeys[kkey] === undefined) {
            kdata.fn = function (key) {
              return props.modelValue + '';
            };
          } else {
            if (_keyboards__WEBPACK_IMPORTED_MODULE_1__.keyboardKeys[kkey].fn === undefined) {
              kdata.fn = function (value) {
                return value + kkey;
              };
            } else {
              kdata.fn = _keyboards__WEBPACK_IMPORTED_MODULE_1__.keyboardKeys[kkey].fn;
            }
          } // Overrides existing values.


          if (keyboardData.value.keys !== undefined && keyboardData.value.keys[kkey] !== undefined) {
            kdata.type = keyboardData.value.keys[kkey].type === undefined ? kdata.type : keyboardData.value.keys[kkey].type;
            kdata.display = keyboardData.value.keys[kkey].display === undefined ? kdata.display : keyboardData.value.keys[kkey].display;
            kdata.fn = keyboardData.value.keys[kkey].fn === undefined ? kdata.fn : keyboardData.value.keys[kkey].fn;
          }

          data.push(kdata);
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return data;
    });

    function resetKeyStrokes() {
      keyStrokes.value = [];
      emit('update:modelValue', '');
    }

    function ButtonKeyClick(key) {
      if (key.key === '@back') {
        keyStrokes.value.pop();
      } else if (key.key === '@reset') {
        resetKeyStrokes();
      } else {
        keyStrokes.value.push(key);
      }

      var output = '';
      emit('update:modelValue', keyStrokes.value.map(function (k) {
        return k.fn(output);
      }).join(''));
    }

    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onMounted)(function () {
      katexAutoRender(root.value);
    });
    expose({
      resetKeyStrokes: resetKeyStrokes
    });
    var __returned__ = {
      emit: emit,
      props: props,
      root: root,
      keyboardGrid: keyboardGrid,
      keyStrokes: keyStrokes,
      keyboardData: keyboardData,
      keyboardComputed: keyboardComputed,
      resetKeyStrokes: resetKeyStrokes,
      ButtonKeyClick: ButtonKeyClick,
      computed: vue__WEBPACK_IMPORTED_MODULE_0__.computed,
      onMounted: vue__WEBPACK_IMPORTED_MODULE_0__.onMounted,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref,
      keyboardKeys: _keyboards__WEBPACK_IMPORTED_MODULE_1__.keyboardKeys,
      keyboards: _keyboards__WEBPACK_IMPORTED_MODULE_1__.keyboards
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Panel.vue?vue&type=script&setup=true&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Panel.vue?vue&type=script&setup=true&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    type: {
      type: String,
      "default": null
    },
    title: {
      type: String,
      "default": null
    }
  },
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var props = __props;
    var panelClass = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      if (props.type !== null && design[props.type] !== undefined) {
        return design[props.type];
      } else {
        return design["default"];
      }
    });
    var panelTitle = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      if (props.title !== null) {
        return props.title;
      }

      if (props.type !== null && design[props.type] !== undefined) {
        return design[props.type].label;
      } else {
        return '';
      }
    });
    var design = {
      'default': {
        panel: 'bg-white border border-gray-200',
        title: 'text-black'
      },
      'success': {
        panel: 'bg-white border-2 border-green-600',
        title: 'text-green-800'
      },
      'definition': {
        panel: 'bg-white border-2 border-green-600',
        title: 'text-green-800',
        label: 'définition'
      },
      'theorem': {
        panel: 'bg-white border-2 border-purple-600',
        title: 'text-purple-800',
        label: 'théorème'
      },
      'exercise': {
        panel: 'bg-white border-2 border-pink-600',
        title: 'text-pink-800',
        label: 'exercice'
      }
    };
    var __returned__ = {
      props: props,
      panelClass: panelClass,
      panelTitle: panelTitle,
      design: design,
      computed: vue__WEBPACK_IMPORTED_MODULE_0__.computed
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/template-quizz.vue?vue&type=template&id=7a119cf6":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/template-quizz.vue?vue&type=template&id=7a119cf6 ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");


var _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Donnée ");

var _hoisted_2 = {
  "class": "h-16 text-center"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)($setup["ChallengeWrapper"], {
    ref: "root",
    title: $setup.title,
    points: $setup.points,
    results: $setup.results,
    validate: $setup.validate
  }, {
    information: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_1];
    }),
    question: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, null, 512
      /* NEED_PATCH */
      ), [[_directive_katex, $setup.displayQuestion, void 0, {
        nomargin: true
      }]])];
    }),
    answer: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, null, 512
      /* NEED_PATCH */
      ), [[_directive_katex, $setup.displayAnswer, void 0, {
        ascii: true
      }]])];
    }),
    answerFormat: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [];
    }),
    inputs: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["Keyboard"], {
        ref: "keyboard",
        modelValue: $setup.answer,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return $setup.answer = $event;
        }),
        keyboard: "algebre",
        "class": "max-w-sm mx-auto"
      }, null, 8
      /* PROPS */
      , ["modelValue"])];
    }),
    _: 1
    /* STABLE */

  }, 8
  /* PROPS */
  , ["points", "results"]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=template&id=13004892":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=template&id=13004892 ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "flex justify-between flex-col md:flex-row mb-5"
};
var _hoisted_2 = {
  "class": "text-xl"
};
var _hoisted_3 = {
  key: 0,
  "class": "mb-5"
};
var _hoisted_4 = {
  ref: "questionWrapper"
};
var _hoisted_5 = {
  key: 1,
  "class": "text-gray-400 text-xs text-center"
};
var _hoisted_6 = {
  "class": "pb-4"
};
var _hoisted_7 = {
  "class": "text-center pt-1 pb-5"
};
var _hoisted_8 = {
  "class": "space-y-2"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h1", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.title), 1
  /* TEXT */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, "score actuel: " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.points), 1
  /* TEXT */
  )]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeProps)((0,vue__WEBPACK_IMPORTED_MODULE_0__.guardReactiveProps)(_ctx.$attrs)), [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Information (optional) "), _ctx.$slots.information ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "information")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Question display - it's generated "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "question")], 512
  /* NEED_PATCH */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Answer display "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "answer")]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Answer format (static - optional) "), _ctx.$slots.answerFormat ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_5, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    "class": "my-3 cursor-pointer",
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return $setup.showAnswerFormat = !$setup.showAnswerFormat;
    })
  }, " Format des réponses "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "slide-right"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_6, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "answerFormat")], 512
      /* NEED_PATCH */
      ), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, $setup.showAnswerFormat]])];
    }),
    _: 3
    /* FORWARDED */

  })])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Validate button TODO: Must add a \"skip question\" "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_7, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn btn-success w-64",
    onClick: _cache[1] || (_cache[1] = function () {
      return $props.validate && $props.validate.apply($props, arguments);
    })
  }, " Valider ")]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Inputs, usually a keyboard TODO: ability to add default keyboard without using a slot "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "inputs")]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Display the results already given "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h3", {
    "class": "max-w-2xl mx-auto text-center cursor-pointer font-semibold mt-10 mb-2",
    onClick: _cache[2] || (_cache[2] = function ($event) {
      return $setup.showResults = !$setup.showResults;
    })
  }, " Afficher les résultats ", 512
  /* NEED_PATCH */
  ), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, $props.results.length > 0]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "slide-left"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["Panel"], {
        "class": "result-wrapper text-center max-w-2xl mx-auto"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_8, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($props.results, function (item, index) {
            return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
              key: "result-".concat(index)
            }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
              "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)({
                'text-green-600': item.correct,
                'text-red-600': !item.correct
              })
            }, null, 2
            /* CLASS */
            ), [[_directive_katex, item.tex, void 0, {
              display: true,
              inline: true
            }]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
              "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)({
                'text-green-600': item.correct,
                'text-red-600': !item.correct
              })
            }, null, 2
            /* CLASS */
            ), [[_directive_katex, item.ascii, void 0, {
              ascii: true,
              display: true,
              inline: true
            }]])]);
          }), 128
          /* KEYED_FRAGMENT */
          ))])];
        }),
        _: 1
        /* STABLE */

      }, 512
      /* NEED_PATCH */
      ), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, $setup.showResults]])];
    }),
    _: 1
    /* STABLE */

  })])], 16
  /* FULL_PROPS */
  )], 64
  /* STABLE_FRAGMENT */
  );
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Keyboard.vue?vue&type=template&id=44fd8727":
/*!*********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Keyboard.vue?vue&type=template&id=44fd8727 ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  key: 0,
  "class": "grid grid-cols-1 min-h-[50px]"
};
var _hoisted_2 = {
  "class": "self-center"
};
var _hoisted_3 = {
  key: 1,
  "class": "grid grid-cols-1 min-h-[40px] italic"
};
var _hoisted_4 = ["textContent"];
var _hoisted_5 = ["onClick"];
var _hoisted_6 = {
  key: 0
};
var _hoisted_7 = {
  key: 2
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _$setup$keyboardData$;

  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [$props.mathOutput ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, $setup.props.modelValue, void 0, {
    ascii: true,
    left: true,
    nomargin: true
  }]])])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), $props.textOutput ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    "class": "self-center",
    textContent: (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.props.modelValue)
  }, null, 8
  /* PROPS */
  , _hoisted_4)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    ref: "root",
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["grid gap-2 keyboard", (_$setup$keyboardData$ = $setup.keyboardData.grid) !== null && _$setup$keyboardData$ !== void 0 ? _$setup$keyboardData$ : 'grid-cols-4'])
  }, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($setup.keyboardComputed, function (key, index) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("button", {
      key: "key-".concat(key.key, "-").concat(index),
      "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["key", "".concat(key.span, " ").concat(key.visible ? 'invisible' : '')]),
      onClick: function onClick($event) {
        return $setup.ButtonKeyClick(key);
      }
    }, [key.type === 'math' ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)(((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_6, null, 512
    /* NEED_PATCH */
    )), [[_directive_katex, key.display]]) : key.type === 'icon' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("i", {
      key: 1,
      "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(key.display)
    }, null, 2
    /* CLASS */
    )) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)], 10
    /* CLASS, PROPS */
    , _hoisted_5);
  }), 128
  /* KEYED_FRAGMENT */
  ))], 2
  /* CLASS */
  ), $props.validate ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_7, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn btn-success",
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return _ctx.$emit('validate');
    })
  }, " Valider ")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Panel.vue?vue&type=template&id=628b1f74":
/*!******************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Panel.vue?vue&type=template&id=628b1f74 ***!
  \******************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("article", {
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)([$setup.panelClass.panel, "bg-white px-4 py-2 rounded-xl border border-gray-300 transition-all"])
  }, [$setup.panelTitle ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    key: 0,
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["uppercase -mt-1 mb-1", $setup.panelClass.title])
  }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.panelTitle), 3
  /* TEXT, CLASS */
  )) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "default")], 2
  /* CLASS */
  );
}

/***/ }),

/***/ "./resources/js/keyboards.js":
/*!***********************************!*\
  !*** ./resources/js/keyboards.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "keyboardKeys": () => (/* binding */ keyboardKeys),
/* harmony export */   "keyboards": () => (/* binding */ keyboards)
/* harmony export */ });
var keyboardKeys = {
  '0': {
    type: 'math',
    display: '0'
  },
  '1': {
    type: 'math',
    display: '1'
  },
  '2': {
    type: 'math',
    display: '2'
  },
  '3': {
    type: 'math',
    display: '3'
  },
  '4': {
    type: 'math',
    display: '4'
  },
  '5': {
    type: 'math',
    display: '5'
  },
  '6': {
    type: 'math',
    display: '6'
  },
  '7': {
    type: 'math',
    display: '7'
  },
  '8': {
    type: 'math',
    display: '8'
  },
  '9': {
    type: 'math',
    display: '9'
  },
  '+': {
    type: 'math',
    display: '+'
  },
  '-': {
    type: 'math',
    display: '-'
  },
  '*': {
    type: 'math',
    display: '\\times'
  },
  '/': {
    type: 'math',
    display: '\\div'
  },
  'x': {
    type: 'math',
    display: 'x'
  },
  '^2': {
    type: 'math',
    display: '\\textcolor{lightgray}{x}^2'
  },
  '^': {
    type: 'math',
    display: 'x^y'
  },
  'sqrt': {
    type: 'math',
    display: '\\sqrt{\\phantom{x}}'
  },
  '|': {
    type: 'math',
    display: '\\big\\vert \\textcolor{lightgray}{x} \\big\\vert'
  },
  'y': {
    type: 'math',
    display: 'y'
  },
  'e': {
    type: 'math',
    display: '\\text{e}'
  },
  'ln': {
    type: 'math',
    display: '\\ln'
  },
  '(': {
    type: 'math',
    display: '('
  },
  ')': {
    type: 'math',
    display: ')'
  },
  ' ': {
    type: 'math',
    display: '\\cdot'
  },
  '@reset': {
    type: 'icon',
    display: 'bi bi-trash'
  },
  '@back': {
    type: 'icon',
    display: 'bi bi-backspace'
  }
};
var keyboards = {
  'simple': {
    grid: 'grid-cols-4',
    layout: ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', '@back', ['0', 2], '/']
  },
  'algebra': {
    grid: 'grid-cols-7',
    layout: ['1', '2', '3', '+', 'x', 'y', 'e', '4', '5', '6', '-', '^2', '^', 'ln', '7', '8', '9', '*', '|', 'sqrt', '', '@reset', '@back', '0', '/', '(', ')', '']
  }
};

/***/ }),

/***/ "./resources/js/Components/Challenges/template-quizz.vue":
/*!***************************************************************!*\
  !*** ./resources/js/Components/Challenges/template-quizz.vue ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _template_quizz_vue_vue_type_template_id_7a119cf6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template-quizz.vue?vue&type=template&id=7a119cf6 */ "./resources/js/Components/Challenges/template-quizz.vue?vue&type=template&id=7a119cf6");
/* harmony import */ var _template_quizz_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./template-quizz.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Challenges/template-quizz.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_template_quizz_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_template_quizz_vue_vue_type_template_id_7a119cf6__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Challenges/template-quizz.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Challenges/ui/challengeWrapper.vue":
/*!********************************************************************!*\
  !*** ./resources/js/Components/Challenges/ui/challengeWrapper.vue ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _challengeWrapper_vue_vue_type_template_id_13004892__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./challengeWrapper.vue?vue&type=template&id=13004892 */ "./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=template&id=13004892");
/* harmony import */ var _challengeWrapper_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./challengeWrapper.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_challengeWrapper_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_challengeWrapper_vue_vue_type_template_id_13004892__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Challenges/ui/challengeWrapper.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Ui/Keyboard.vue":
/*!*************************************************!*\
  !*** ./resources/js/Components/Ui/Keyboard.vue ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Keyboard_vue_vue_type_template_id_44fd8727__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Keyboard.vue?vue&type=template&id=44fd8727 */ "./resources/js/Components/Ui/Keyboard.vue?vue&type=template&id=44fd8727");
/* harmony import */ var _Keyboard_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Keyboard.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Ui/Keyboard.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_Keyboard_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Keyboard_vue_vue_type_template_id_44fd8727__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Ui/Keyboard.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Ui/Panel.vue":
/*!**********************************************!*\
  !*** ./resources/js/Components/Ui/Panel.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Panel_vue_vue_type_template_id_628b1f74__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Panel.vue?vue&type=template&id=628b1f74 */ "./resources/js/Components/Ui/Panel.vue?vue&type=template&id=628b1f74");
/* harmony import */ var _Panel_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Panel.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Ui/Panel.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_Panel_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Panel_vue_vue_type_template_id_628b1f74__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Ui/Panel.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Challenges/template-quizz.vue?vue&type=script&setup=true&lang=js":
/*!**************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/template-quizz.vue?vue&type=script&setup=true&lang=js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_template_quizz_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_template_quizz_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./template-quizz.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/template-quizz.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=script&setup=true&lang=js":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=script&setup=true&lang=js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeWrapper_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeWrapper_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./challengeWrapper.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Ui/Keyboard.vue?vue&type=script&setup=true&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/Components/Ui/Keyboard.vue?vue&type=script&setup=true&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Keyboard_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Keyboard_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Keyboard.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Keyboard.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Ui/Panel.vue?vue&type=script&setup=true&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/Components/Ui/Panel.vue?vue&type=script&setup=true&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Panel_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Panel_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Panel.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Panel.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Challenges/template-quizz.vue?vue&type=template&id=7a119cf6":
/*!*********************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/template-quizz.vue?vue&type=template&id=7a119cf6 ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_template_quizz_vue_vue_type_template_id_7a119cf6__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_template_quizz_vue_vue_type_template_id_7a119cf6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./template-quizz.vue?vue&type=template&id=7a119cf6 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/template-quizz.vue?vue&type=template&id=7a119cf6");


/***/ }),

/***/ "./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=template&id=13004892":
/*!**************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=template&id=13004892 ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeWrapper_vue_vue_type_template_id_13004892__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeWrapper_vue_vue_type_template_id_13004892__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./challengeWrapper.vue?vue&type=template&id=13004892 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=template&id=13004892");


/***/ }),

/***/ "./resources/js/Components/Ui/Keyboard.vue?vue&type=template&id=44fd8727":
/*!*******************************************************************************!*\
  !*** ./resources/js/Components/Ui/Keyboard.vue?vue&type=template&id=44fd8727 ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Keyboard_vue_vue_type_template_id_44fd8727__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Keyboard_vue_vue_type_template_id_44fd8727__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Keyboard.vue?vue&type=template&id=44fd8727 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Keyboard.vue?vue&type=template&id=44fd8727");


/***/ }),

/***/ "./resources/js/Components/Ui/Panel.vue?vue&type=template&id=628b1f74":
/*!****************************************************************************!*\
  !*** ./resources/js/Components/Ui/Panel.vue?vue&type=template&id=628b1f74 ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Panel_vue_vue_type_template_id_628b1f74__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Panel_vue_vue_type_template_id_628b1f74__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Panel.vue?vue&type=template&id=628b1f74 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Panel.vue?vue&type=template&id=628b1f74");


/***/ })

}]);