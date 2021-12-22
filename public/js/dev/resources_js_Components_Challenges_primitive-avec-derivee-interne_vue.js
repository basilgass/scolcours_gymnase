"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_Challenges_primitive-avec-derivee-interne_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=script&setup=true&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=script&setup=true&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var _Components_Challenges_ui_challengeTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/Challenges/ui/challengeTitle */ "./resources/js/Components/Challenges/ui/challengeTitle.vue");
/* harmony import */ var _Components_Ui_Keyboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/Components/Ui/Keyboard */ "./resources/js/Components/Ui/Keyboard.vue");
/* harmony import */ var pimath_esm_maths_coefficients__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! pimath/esm/maths/coefficients */ "./node_modules/pimath/esm/maths/coefficients/index.js");
/* harmony import */ var pimath_esm_maths_coefficients__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(pimath_esm_maths_coefficients__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! pimath/esm/maths/random */ "./node_modules/pimath/esm/maths/random/index.js");
/* harmony import */ var pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/Components/Ui/Panel */ "./resources/js/Components/Ui/Panel.vue");
/* harmony import */ var _Components_Challenges_ui_challengeWrapper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/Components/Challenges/ui/challengeWrapper */ "./resources/js/Components/Challenges/ui/challengeWrapper.vue");







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var title = 'primitive avec dérivée interne';
    var customKeyboard = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)({
      grid: 'grid-cols-5',
      layout: ['1', '2', '3', '+', '-', '4', '5', '6', '/', '', '7', '8', '9', 'x', '^', '@reset', '@back', '0', '(', ')', ['equ1', 5], ['equ2', 5]],
      keys: {
        'equ1': {
          type: 'math',
          display: 'x',
          fn: function fn() {
            return 'xxxxx';
          }
        },
        'equ2': {
          type: 'math',
          display: 'x',
          fn: function fn() {
            return 'yyyyy';
          }
        }
      }
    });
    var questionWrapper = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null),
        keyboard = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null),
        answer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(''),
        points = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(0),
        level = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(0),
        results = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)([]),
        showResults = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(false),
        question = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(newQuestion());
    var displayAnswer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      if (question.value.rational) {
        if (answer.value.includes('/')) {
          return answer.value.split('/').map(function (value) {
            return value === '' ? '' : "(".concat(value, ")");
          }).join('/');
        } else {
          return answer.value;
        }
      } else {
        return answer.value;
      }
    });
    var displayQuestion = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      return question.value.tex;
    });

    function newQuestion() {
      var P = pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_4__.Random.polynom({
        letters: 'x',
        degree: pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_4__.Random.number(2, 5),
        numberOfMonoms: pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_4__.Random.number(2, 3),
        fraction: false
      }).reorder(),
          degree = pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_4__.Random.number(2, 5),
          factor = points.value < 3 ? 1 : pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_4__.Random.numberSym(10, false),
          Q = P.divide(P.gcdNumerator()).clone().derivative().multiply(factor),
          k,
          kden,
          result,
          tex,
          rational;

      if (pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_4__.Random.bool()) {
        // Two factors
        // Constant
        k = new pimath_esm_maths_coefficients__WEBPACK_IMPORTED_MODULE_3__.Fraction(factor, degree + 1).reduce(); // Result as ascii math

        result = "".concat(k.display, "(").concat(P.display, ")^").concat(degree + 1); // Latex output

        tex = "\\int\\ (".concat(P.tex, ")^").concat(degree, "\\cdot(").concat(Q.tex, ")"); // Is rational ?

        rational = false;
      } else {
        // Rational
        // Constant
        k = new pimath_esm_maths_coefficients__WEBPACK_IMPORTED_MODULE_3__.Fraction(factor, -degree + 1).reduce(); // Get the denominator

        kden = k.denominator === 1 ? '' : k.denominator === -1 ? '-' : k.denominator; // Result as "partial" ascii math

        if (degree - 1 === 1) {
          result = "".concat(k.numerator, "/").concat(P.display);
        } else {
          result = "".concat(k.numerator, "/").concat(kden, "(").concat(P.display, ")^").concat(degree - 1);
        } // Latex output


        tex = "\\int\\ \\frac{".concat(Q.tex, "}{ (").concat(P.tex, ")^").concat(degree, " }"); // Is rational ?

        rational = true;
      } // console.log(result)
      // Mise à jour du clavier.


      customKeyboard.value.keys.equ1.display = P.tex;

      customKeyboard.value.keys.equ1.fn = function (value) {
        return value + P.display;
      };

      customKeyboard.value.keys.equ2.display = Q.tex;

      customKeyboard.value.keys.equ2.fn = function (value) {
        return value + Q.display;
      };

      return {
        answer: result,
        tex: tex + ' = ',
        rational: rational
      };
    }

    function resetAsnwer() {
      keyboard.value.resetKeyStrokes();
    }

    function validateAnswer() {
      // console.log(answer.value)
      var result = {
        tex: question.value.tex,
        ascii: answer.value,
        correct: false
      };

      if (answer.value === question.value.answer) {
        points.value++;
        result.correct = true;
        resetAsnwer();
        question.value = newQuestion();
      } else {
        points.value = 0;
        questionWrapper.value.style.setProperty('animation-name', 'v-shake-horizontal');
        questionWrapper.value.style.setProperty('animation-duration', '500ms');
        setTimeout(function () {
          questionWrapper.value.style.setProperty('animation-name', '');
        }, 500);
        points.value = 0;
      }

      results.value.push(result);
    }

    var __returned__ = {
      title: title,
      customKeyboard: customKeyboard,
      questionWrapper: questionWrapper,
      keyboard: keyboard,
      answer: answer,
      points: points,
      level: level,
      results: results,
      showResults: showResults,
      question: question,
      displayAnswer: displayAnswer,
      displayQuestion: displayQuestion,
      newQuestion: newQuestion,
      resetAsnwer: resetAsnwer,
      validateAnswer: validateAnswer,
      computed: vue__WEBPACK_IMPORTED_MODULE_0__.computed,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref,
      ChallengeTitle: _Components_Challenges_ui_challengeTitle__WEBPACK_IMPORTED_MODULE_1__["default"],
      Keyboard: _Components_Ui_Keyboard__WEBPACK_IMPORTED_MODULE_2__["default"],
      Fraction: pimath_esm_maths_coefficients__WEBPACK_IMPORTED_MODULE_3__.Fraction,
      Random: pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_4__.Random,
      Panel: _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_5__["default"],
      ChallengeWrapper: _Components_Challenges_ui_challengeWrapper__WEBPACK_IMPORTED_MODULE_6__["default"]
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
    points: Number
  },
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var results = (0,vue__WEBPACK_IMPORTED_MODULE_1__.ref)([]),
        showResults = (0,vue__WEBPACK_IMPORTED_MODULE_1__.ref)(false);
    var __returned__ = {
      results: results,
      showResults: showResults,
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=template&id=7da1c214":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=template&id=7da1c214 ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");


var _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Calculer une primitive de la fonction suivante ");

var _hoisted_2 = {
  "class": "h-16 text-center"
};
var _hoisted_3 = {
  ref: "questionWrapper"
};
var _hoisted_4 = {
  "class": "h-16"
};
var _hoisted_5 = {
  "class": "h-16 text-center"
};
var _hoisted_6 = {
  "class": "space-y-2"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["ChallengeWrapper"], {
    title: $setup.title
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
    inputs: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["Keyboard"], {
        ref: "keyboard",
        modelValue: $setup.answer,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return $setup.answer = $event;
        }),
        keyboard: $setup.customKeyboard,
        "class": "max-w-sm mx-auto"
      }, null, 8
      /* PROPS */
      , ["modelValue", "keyboard"])];
    }),
    _: 1
    /* STABLE */

  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("article", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["ChallengeTitle"], {
    title: $setup.title
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, "score actuel: " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.points), 1
  /* TEXT */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, $setup.displayQuestion, void 0, {
    nomargin: true
  }]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_5, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, $setup.displayAnswer, void 0, {
    ascii: true
  }]])], 512
  /* NEED_PATCH */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    "class": "text-center py-5"
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn btn-success w-64",
    onClick: $setup.validateAnswer
  }, " Valider ")]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["Keyboard"], {
    ref: "keyboard",
    modelValue: $setup.answer,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
      return $setup.answer = $event;
    }),
    keyboard: $setup.customKeyboard,
    "class": "max-w-sm mx-auto"
  }, null, 8
  /* PROPS */
  , ["modelValue", "keyboard"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h3", {
    "class": "max-w-2xl mx-auto text-center cursor-pointer font-semibold mt-10 mb-2",
    onClick: _cache[2] || (_cache[2] = function ($event) {
      return $setup.showResults = !$setup.showResults;
    })
  }, " Afficher les résultats ", 512
  /* NEED_PATCH */
  ), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, $setup.results.length > 0]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "slide-left"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["Panel"], {
        "class": "result-wrapper text-center max-w-2xl mx-auto"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_6, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($setup.results, function (item, index) {
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

  })])], 64
  /* STABLE_FRAGMENT */
  );
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
  "class": "text-xl"
};
var _hoisted_2 = {
  "class": "text-center py-5"
};
var _hoisted_3 = {
  "class": "space-y-2"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h1", _hoisted_1, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.title), 1
  /* TEXT */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, "score actuel: " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.points), 1
  /* TEXT */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "information"), (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "question"), (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "answer"), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn btn-success w-64",
    onClick: _cache[0] || (_cache[0] = function () {
      return _ctx.validateAnswer && _ctx.validateAnswer.apply(_ctx, arguments);
    })
  }, " Valider ")]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "inputs"), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h3", {
    "class": "max-w-2xl mx-auto text-center cursor-pointer font-semibold mt-10 mb-2",
    onClick: _cache[1] || (_cache[1] = function ($event) {
      return $setup.showResults = !$setup.showResults;
    })
  }, " Afficher les résultats ", 512
  /* NEED_PATCH */
  ), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, $setup.results.length > 0]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "slide-left"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["Panel"], {
        "class": "result-wrapper text-center max-w-2xl mx-auto"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($setup.results, function (item, index) {
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

  })], 64
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

/***/ "./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue":
/*!*******************************************************************************!*\
  !*** ./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _primitive_avec_derivee_interne_vue_vue_type_template_id_7da1c214__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./primitive-avec-derivee-interne.vue?vue&type=template&id=7da1c214 */ "./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=template&id=7da1c214");
/* harmony import */ var _primitive_avec_derivee_interne_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./primitive-avec-derivee-interne.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_primitive_avec_derivee_interne_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_primitive_avec_derivee_interne_vue_vue_type_template_id_7da1c214__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Challenges/primitive-avec-derivee-interne.vue"]])
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

/***/ "./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=script&setup=true&lang=js":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=script&setup=true&lang=js ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitive_avec_derivee_interne_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitive_avec_derivee_interne_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./primitive-avec-derivee-interne.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=script&setup=true&lang=js");
 

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

/***/ "./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=template&id=7da1c214":
/*!*************************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=template&id=7da1c214 ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitive_avec_derivee_interne_vue_vue_type_template_id_7da1c214__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitive_avec_derivee_interne_vue_vue_type_template_id_7da1c214__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./primitive-avec-derivee-interne.vue?vue&type=template&id=7da1c214 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=template&id=7da1c214");


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