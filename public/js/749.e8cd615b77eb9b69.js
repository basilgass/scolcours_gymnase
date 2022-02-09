"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[749,94],{

/***/ 9749:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ primitive_avec_derivee_interne)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./resources/js/Components/Ui/Keyboard.vue + 3 modules
var Keyboard = __webpack_require__(3163);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/coefficients/index.js
var coefficients = __webpack_require__(2482);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/random/index.js
var random = __webpack_require__(4682);
// EXTERNAL MODULE: ./resources/js/Components/Challenges/ui/challengeWrapper.vue + 2 modules
var challengeWrapper = __webpack_require__(7094);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=script&setup=true&lang=js


var _hoisted_1 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Calculer une primitive de la fonction suivante ");

var _hoisted_2 = {
  "class": "h-20 text-center"
};
var _hoisted_3 = {
  "class": "grid xs:grid-cols-2 md:grid-cols-4"
};





/* harmony default export */ const primitive_avec_derivee_internevue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    var title = 'primitive avec dérivée interne';
    var customKeyboard = (0,vue_esm_bundler.ref)({
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
    }); // Active variables

    var root = (0,vue_esm_bundler.ref)(null),
        // main reference wrapper
    points = (0,vue_esm_bundler.ref)(0),
        // current number of points and how to handle them
    answer = (0,vue_esm_bundler.ref)(''),
        // the answer given by the user
    results = (0,vue_esm_bundler.ref)([]),
        // list of given results - simple list display.
    keyboard = (0,vue_esm_bundler.ref)(null),
        // keyboard reference.
    question = (0,vue_esm_bundler.ref)(newQuestion()); // question: {answer: string, tex: string, ...}

    var displayAnswer = (0,vue_esm_bundler.computed)(function () {
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
    var displayQuestion = (0,vue_esm_bundler.computed)(function () {
      return question.value.tex;
    });

    function newQuestion() {
      var P = random.Random.polynom({
        letters: 'x',
        degree: random.Random.number(2, 5),
        numberOfMonoms: random.Random.number(2, 3),
        fraction: false
      }).reorder(),
          degree = random.Random.number(2, 5),
          factor = points.value < 3 ? 1 : random.Random.numberSym(10, false),
          Q = P.divide(P.gcdNumerator()).clone().derivative().multiply(factor),
          k,
          kden,
          result,
          tex,
          rational;

      if (random.Random.bool()) {
        // Two factors
        // Constant
        k = new coefficients.Fraction(factor, degree + 1).reduce(); // Result as ascii math

        result = "".concat(k.display, "(").concat(P.display, ")^").concat(degree + 1); // Latex output

        tex = "\\int\\ (".concat(P.tex, ")^").concat(degree, "\\cdot(").concat(Q.tex, ")"); // Is rational ?

        rational = false;
      } else {
        // Rational
        // Constant
        k = new coefficients.Fraction(factor, -degree + 1).reduce(); // Get the denominator

        kden = k.denominator === 1 ? '' : k.denominator === -1 ? '-' : k.denominator; // Result as "partial" ascii math

        if (degree - 1 === 1) {
          result = "".concat(k.numerator, "/").concat(P.display);
        } else {
          result = "".concat(k.numerator, "/").concat(kden, "(").concat(P.display, ")^").concat(degree - 1);
        } // Latex output


        tex = "\\int\\ \\frac{".concat(Q.tex, "}{ (").concat(P.tex, ")^").concat(degree, " }"); // Is rational ?

        rational = true;
      } // Mise à jour du clavier.


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

    function reset() {
      keyboard.value.resetKeyStrokes();
    }

    function validate() {
      // console.log(answer.value)
      var result = {
        tex: question.value.tex,
        ascii: answer.value,
        correct: false
      };

      if (answer.value === question.value.answer) {
        points.value++;
        result.correct = true;
        reset();
        question.value = newQuestion();
      } else {
        points.value = 0;
        root.value.shake();
      }

      results.value.push(result);
    }

    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createBlock)((0,vue_esm_bundler.unref)(challengeWrapper["default"]), {
        ref_key: "root",
        ref: root,
        title: title,
        points: (0,vue_esm_bundler.unref)(points),
        results: (0,vue_esm_bundler.unref)(results),
        validate: validate,
        "class": "max-w-xl mx-auto"
      }, {
        information: (0,vue_esm_bundler.withCtx)(function () {
          return [_hoisted_1];
        }),
        question: (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(displayQuestion), void 0, {
            nomargin: true
          }]])];
        }),
        answer: (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", _hoisted_2, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(displayAnswer) === '' ? '?' : (0,vue_esm_bundler.unref)(displayAnswer), void 0, {
            ascii: true
          }]])];
        }),
        answerFormat: (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_3, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, '\\frac{3}{\\textcolor{red}{-}2(x+3)^2}\\implies \\frac{-3}{2(x+3)^2}', void 0, {
            inline: true,
            display: true
          }]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, '\\frac{-3}{\\textcolor{red}{1}(x+3)^2}\\implies \\frac{-3}{(x+3)^2}', void 0, {
            inline: true,
            display: true
          }]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, '\\frac{-3}{2(x+3)^{\\textcolor{red}{1}}}\\implies \\frac{-3}{2(x+3)}', void 0, {
            inline: true,
            display: true
          }]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, '\\frac{-3}{\\textcolor{red}{(}x+3\\textcolor{red}{)^1}}\\implies \\frac{-3}{x+3}', void 0, {
            inline: true,
            display: true
          }]])]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(Keyboard/* default */.Z), {
            ref_key: "keyboard",
            ref: keyboard,
            modelValue: (0,vue_esm_bundler.unref)(answer),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
              return (0,vue_esm_bundler.isRef)(answer) ? answer.value = $event : answer = $event;
            }),
            keyboard: (0,vue_esm_bundler.unref)(customKeyboard),
            "class": "max-w-sm mx-auto"
          }, null, 8, ["modelValue", "keyboard"])];
        }),
        _: 1
      }, 8, ["points", "results"]);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/primitive-avec-derivee-interne.vue



const __exports__ = primitive_avec_derivee_internevue_type_script_setup_true_lang_js;

/* harmony default export */ const primitive_avec_derivee_interne = (__exports__);

/***/ }),

/***/ 7094:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ challengeWrapper)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./resources/js/Components/Ui/Panel.vue + 2 modules
var Panel = __webpack_require__(816);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=script&setup=true&lang=js

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
  key: 1,
  "class": "text-gray-400 text-xs text-center"
};
var _hoisted_5 = {
  "class": "pb-4"
};
var _hoisted_6 = {
  "class": "text-center pt-1 pb-5"
};
var _hoisted_7 = {
  "class": "space-y-2"
};


/* harmony default export */ const challengeWrappervue_type_script_setup_true_lang_js = ({
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

    var showResults = (0,vue_esm_bundler.ref)(false),
        showAnswerFormat = (0,vue_esm_bundler.ref)(false),
        questionWrapper = (0,vue_esm_bundler.ref)(null);
    expose({
      shake: shake
    });
    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_1, [(0,vue_esm_bundler.createElementVNode)("h1", _hoisted_2, (0,vue_esm_bundler.toDisplayString)(__props.title), 1), (0,vue_esm_bundler.createElementVNode)("div", null, "score actuel: " + (0,vue_esm_bundler.toDisplayString)(__props.points), 1)]), (0,vue_esm_bundler.createElementVNode)("div", (0,vue_esm_bundler.normalizeProps)((0,vue_esm_bundler.guardReactiveProps)(_ctx.$attrs)), [_ctx.$slots.information ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_3, [(0,vue_esm_bundler.renderSlot)(_ctx.$slots, "information")])) : (0,vue_esm_bundler.createCommentVNode)("", true), (0,vue_esm_bundler.createElementVNode)("div", {
        ref_key: "questionWrapper",
        ref: questionWrapper
      }, [(0,vue_esm_bundler.renderSlot)(_ctx.$slots, "question")], 512), (0,vue_esm_bundler.createElementVNode)("div", null, [(0,vue_esm_bundler.renderSlot)(_ctx.$slots, "answer")]), _ctx.$slots.answerFormat ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_4, [(0,vue_esm_bundler.createElementVNode)("div", {
        "class": "my-3 cursor-pointer",
        onClick: _cache[0] || (_cache[0] = function ($event) {
          return (0,vue_esm_bundler.isRef)(showAnswerFormat) ? showAnswerFormat.value = !(0,vue_esm_bundler.unref)(showAnswerFormat) : showAnswerFormat = !(0,vue_esm_bundler.unref)(showAnswerFormat);
        })
      }, " Format des réponses "), (0,vue_esm_bundler.createVNode)(vue_esm_bundler.Transition, {
        name: "slide-right"
      }, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", _hoisted_5, [(0,vue_esm_bundler.renderSlot)(_ctx.$slots, "answerFormat")], 512), [[vue_esm_bundler.vShow, (0,vue_esm_bundler.unref)(showAnswerFormat)]])];
        }),
        _: 3
      })])) : (0,vue_esm_bundler.createCommentVNode)("", true), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_6, [(0,vue_esm_bundler.createElementVNode)("button", {
        "class": "btn btn-success w-64",
        onClick: _cache[1] || (_cache[1] = function () {
          return __props.validate && __props.validate.apply(__props, arguments);
        })
      }, " Valider ")]), (0,vue_esm_bundler.createElementVNode)("div", null, [(0,vue_esm_bundler.renderSlot)(_ctx.$slots, "inputs")]), (0,vue_esm_bundler.createElementVNode)("div", null, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("h3", {
        "class": "max-w-2xl mx-auto text-center cursor-pointer font-semibold mt-10 mb-2",
        onClick: _cache[2] || (_cache[2] = function ($event) {
          return (0,vue_esm_bundler.isRef)(showResults) ? showResults.value = !(0,vue_esm_bundler.unref)(showResults) : showResults = !(0,vue_esm_bundler.unref)(showResults);
        })
      }, " Afficher les résultats ", 512), [[vue_esm_bundler.vShow, __props.results.length > 0]]), (0,vue_esm_bundler.createVNode)(vue_esm_bundler.Transition, {
        name: "slide-left"
      }, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(Panel/* default */.Z), {
            "class": "result-wrapper text-center max-w-2xl mx-auto"
          }, {
            "default": (0,vue_esm_bundler.withCtx)(function () {
              return [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_7, [((0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)(__props.results, function (item, index) {
                return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", {
                  key: "result-".concat(index)
                }, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", {
                  "class": (0,vue_esm_bundler.normalizeClass)({
                    'text-green-600': item.correct,
                    'text-red-600': !item.correct
                  })
                }, null, 2), [[_directive_katex, item.tex, void 0, {
                  display: true,
                  inline: true
                }]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", {
                  "class": (0,vue_esm_bundler.normalizeClass)({
                    'text-green-600': item.correct,
                    'text-red-600': !item.correct
                  })
                }, null, 2), [[_directive_katex, item.ascii, void 0, {
                  ascii: true,
                  display: true,
                  inline: true
                }]])]);
              }), 128))])];
            }),
            _: 1
          }, 512), [[vue_esm_bundler.vShow, (0,vue_esm_bundler.unref)(showResults)]])];
        }),
        _: 1
      })])], 16)], 64);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/ui/challengeWrapper.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/ui/challengeWrapper.vue



const __exports__ = challengeWrappervue_type_script_setup_true_lang_js;

/* harmony default export */ const challengeWrapper = (__exports__);

/***/ }),

/***/ 3163:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ Keyboard)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
;// CONCATENATED MODULE: ./resources/js/keyboards.js
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
  'x^2': {
    type: 'math',
    display: 'x^2'
  },
  'x^3': {
    type: 'math',
    display: 'x^3'
  },
  'x^4': {
    type: 'math',
    display: 'x^4'
  },
  'x^5': {
    type: 'math',
    display: 'x^5'
  },
  'x^6': {
    type: 'math',
    display: 'x^6'
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
  '.': {
    type: 'math',
    display: '.'
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
  'number': {
    grid: 'grid-cols-3',
    layout: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '-']
  },
  'fraction': {
    grid: 'grid-cols-3',
    layout: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '/', '0', '-']
  },
  'simple': {
    grid: 'grid-cols-4',
    layout: ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', '@back', ['0', 2], '/']
  },
  'algebra': {
    grid: 'grid-cols-7',
    layout: ['1', '2', '3', '+', 'x', 'y', 'e', '4', '5', '6', '-', '^2', '^', 'ln', '7', '8', '9', '*', '|', 'sqrt', '', '@reset', '@back', '0', '/', '(', ')', '']
  },
  'polynom': {
    grid: 'grid-cols-6',
    layout: ['1', '2', '3', '+', 'x', 'x^2', '4', '5', '6', '-', 'x^3', 'x^4', '7', '8', '9', '*', 'x^5', 'x^6', '(', ')', '0', '/', ['^', 2]]
  }
};
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Keyboard.vue?vue&type=script&setup=true&lang=js
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


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
var _hoisted_7 = ["onClick"];

var _hoisted_8 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)();

var _hoisted_9 = {
  "class": "hidden md:inline md:ml-2"
};


/* harmony default export */ const Keyboardvue_type_script_setup_true_lang_js = ({
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
      "default": null
    },
    reset: {
      type: Boolean,
      "default": null
    },
    back: {
      type: Boolean,
      "default": null
    },
    next: {
      type: Boolean,
      "default": null
    },
    mathOutput: {
      type: Boolean,
      "default": false
    },
    textOutput: {
      type: Boolean,
      "default": false
    },
    small: {
      type: Boolean,
      "default": false
    }
  },
  emits: ['update:modelValue', 'validate', 'next'],
  setup: function setup(__props, _ref) {
    var expose = _ref.expose,
        emit = _ref.emit;
    var props = __props;
    var root = (0,vue_esm_bundler.ref)(null),
        keyStrokes = (0,vue_esm_bundler.ref)([]),
        keyboardGridDefault = (0,vue_esm_bundler.ref)('grid-cols-4');
    var keyboardData = (0,vue_esm_bundler.computed)(function () {
      if (typeof props.keyboard === 'string' && keyboards[props.keyboard] !== undefined) {
        return keyboards[props.keyboard];
      } else {
        return props.keyboard;
      }
    });
    var keyboardComputed = (0,vue_esm_bundler.computed)(function () {
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
            type: keyboardKeys[kkey] === undefined ? false : keyboardKeys[kkey].type,
            display: keyboardKeys[kkey] === undefined ? false : keyboardKeys[kkey].display,
            span: spankey
          };

          if (keyboardKeys[kkey] === undefined) {
            kdata.fn = function (key) {
              return props.modelValue + '';
            };
          } else {
            if (keyboardKeys[kkey].fn === undefined) {
              kdata.fn = function (value) {
                return value + kkey;
              };
            } else {
              kdata.fn = keyboardKeys[kkey].fn;
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
    }),
        keyboardCommands = (0,vue_esm_bundler.computed)(function () {
      var btnReset = {
        label: 'tout effacer',
        icon: 'bi bi-trash',
        span: 1,
        fn: function fn() {
          return resetKeyStrokes();
        },
        atEnd: false
      },
          btnBack = {
        label: 'effacer',
        icon: 'bi bi-backspace',
        span: 1,
        fn: function fn() {
          return backKeyStrokes();
        },
        atEnd: false
      },
          btnNext = {
        label: 'suivant',
        icon: 'bi bi-arrow-bar-right',
        span: 1,
        fn: function fn() {
          return emit('next');
        },
        atEnd: false
      },
          btnValidate = {
        label: 'valider',
        icon: 'bi bi-check',
        span: 3,
        fn: function fn() {
          return emit('validate');
        },
        atEnd: false
      };
      var grid = 3,
          commandsBtn = [];

      if (keyboardData.value.grid) {
        grid = keyboardData.value.grid.split('-').pop();
      }

      var smallButtons = 0,
          col = 0;

      if (props.back) {
        smallButtons++;
      }

      if (props.reset) {
        smallButtons++;
      }

      if (props.next) {
        smallButtons++;
      }

      if (props.validate) {
        if (smallButtons + 2 > grid) {
          // The grid is too small
          if (props.reset) {
            commandsBtn.push(btnReset);
          }

          if (props.back) {
            commandsBtn.push(btnBack);
          }

          if (props.next) {
            commandsBtn.push(btnNext);
          }

          if (commandsBtn.length === 1) {
            // smallBtn + ValidateBzn
            btnValidate.span = grid - 1;
          } else {
            // smallBtn smallBtn
            // validateBtn (on another line)
            btnValidate.span = grid;
          }

          commandsBtn.push(btnValidate);
        } else {
          col = Math.min(2, Math.trunc((grid - 2) / smallButtons));
          btnBack.span = col;
          btnReset.span = col;
          btnNext.span = col;
          btnValidate.span = +grid;

          if (props.reset) {
            commandsBtn.push(btnReset);
            btnValidate.span -= col;
          }

          if (props.back) {
            commandsBtn.push(btnBack);
            btnValidate.span -= col;
          }

          commandsBtn.push(btnValidate);

          if (props.next) {
            commandsBtn.push(btnNext);
            btnValidate.span -= col;
          }
        }
      } else if (smallButtons > 0) {
        if (props.reset) {
          commandsBtn.push(btnReset);
        }

        if (props.back) {
          commandsBtn.push(btnBack);
        }

        if (props.next) {
          commandsBtn.push(btnNext);
        }

        var _col = Math.trunc(grid / commandsBtn.length);

        btnReset.span = _col;
        btnBack.span = _col;
        btnNext.span = _col;
        commandsBtn[commandsBtn.length - 1].atEnd = true;
      }

      return commandsBtn;
    });

    function resetKeyStrokes() {
      keyStrokes.value = [];
      emit('update:modelValue', '');
    }

    function backKeyStrokes() {
      ButtonKeyClick({
        key: '@back'
      });
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

    (0,vue_esm_bundler.onMounted)(function () {
      katexAutoRender(root.value);
    });
    expose({
      resetKeyStrokes: resetKeyStrokes
    });
    return function (_ctx, _cache) {
      var _unref$grid, _unref$grid2;

      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", null, [__props.mathOutput ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_1, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", _hoisted_2, null, 512), [[_directive_katex, props.modelValue, void 0, {
        ascii: true,
        left: true,
        nomargin: true
      }]])])) : (0,vue_esm_bundler.createCommentVNode)("", true), __props.textOutput ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_3, [(0,vue_esm_bundler.createElementVNode)("div", {
        "class": "self-center",
        textContent: (0,vue_esm_bundler.toDisplayString)(props.modelValue)
      }, null, 8, _hoisted_4)])) : (0,vue_esm_bundler.createCommentVNode)("", true), (0,vue_esm_bundler.createElementVNode)("div", {
        ref_key: "root",
        ref: root,
        "class": (0,vue_esm_bundler.normalizeClass)(["grid gap-2 keyboard", ((_unref$grid = (0,vue_esm_bundler.unref)(keyboardData).grid) !== null && _unref$grid !== void 0 ? _unref$grid : (0,vue_esm_bundler.unref)(keyboardGridDefault)) + (__props.small ? ' keyboard-sm' : '')])
      }, [((0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)((0,vue_esm_bundler.unref)(keyboardComputed), function (key, index) {
        return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("button", {
          key: "key-".concat(key.key, "-").concat(index),
          "class": (0,vue_esm_bundler.normalizeClass)(["key", "".concat(key.span, " ").concat(key.visible ? 'invisible' : '')]),
          onClick: function onClick($event) {
            return ButtonKeyClick(key);
          }
        }, [key.type === 'math' ? (0,vue_esm_bundler.withDirectives)(((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("span", _hoisted_6, null, 512)), [[_directive_katex, key.display, void 0, {
          clear: true
        }]]) : key.type === 'icon' ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("i", {
          key: 1,
          "class": (0,vue_esm_bundler.normalizeClass)(key.display)
        }, null, 2)) : (0,vue_esm_bundler.createCommentVNode)("", true)], 10, _hoisted_5);
      }), 128))], 2), (0,vue_esm_bundler.unref)(keyboardCommands).length > 0 ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", {
        key: 2,
        "class": (0,vue_esm_bundler.normalizeClass)(["keyboard grid gap-2 w-full mt-10", ((_unref$grid2 = (0,vue_esm_bundler.unref)(keyboardData).grid) !== null && _unref$grid2 !== void 0 ? _unref$grid2 : (0,vue_esm_bundler.unref)(keyboardGridDefault)) + (__props.small ? ' keyboard-sm' : '')])
      }, [((0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)((0,vue_esm_bundler.unref)(keyboardCommands), function (item, index) {
        return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("button", {
          key: "keyboard-command-".concat(index),
          "class": (0,vue_esm_bundler.normalizeClass)("key col-span-".concat(item.span, " ").concat(item.atEnd ? 'order-last' : '')),
          onClick: function onClick($event) {
            return item.fn();
          }
        }, [(0,vue_esm_bundler.createElementVNode)("i", {
          "class": (0,vue_esm_bundler.normalizeClass)(item.icon)
        }, null, 2), _hoisted_8, (0,vue_esm_bundler.createElementVNode)("span", _hoisted_9, (0,vue_esm_bundler.toDisplayString)(item.label), 1)], 10, _hoisted_7);
      }), 128))], 2)) : (0,vue_esm_bundler.createCommentVNode)("", true)]);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Ui/Keyboard.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Ui/Keyboard.vue



const __exports__ = Keyboardvue_type_script_setup_true_lang_js;

/* harmony default export */ const Keyboard = (__exports__);

/***/ }),

/***/ 816:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ Panel)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Panel.vue?vue&type=script&setup=true&lang=js


/* harmony default export */ const Panelvue_type_script_setup_true_lang_js = ({
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
  setup: function setup(__props) {
    var props = __props;
    var panelClass = (0,vue_esm_bundler.computed)(function () {
      if (props.type !== null && design[props.type] !== undefined) {
        return design[props.type];
      } else {
        return design["default"];
      }
    });
    var panelTitle = (0,vue_esm_bundler.computed)(function () {
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
    return function (_ctx, _cache) {
      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("article", {
        "class": (0,vue_esm_bundler.normalizeClass)([(0,vue_esm_bundler.unref)(panelClass).panel, "bg-white px-4 py-2 rounded-xl border border-gray-300 transition-all"])
      }, [(0,vue_esm_bundler.unref)(panelTitle) ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", {
        key: 0,
        "class": (0,vue_esm_bundler.normalizeClass)(["uppercase -mt-1 mb-1", (0,vue_esm_bundler.unref)(panelClass).title])
      }, (0,vue_esm_bundler.toDisplayString)((0,vue_esm_bundler.unref)(panelTitle)), 3)) : (0,vue_esm_bundler.createCommentVNode)("", true), (0,vue_esm_bundler.renderSlot)(_ctx.$slots, "default")], 2);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Ui/Panel.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Ui/Panel.vue



const __exports__ = Panelvue_type_script_setup_true_lang_js;

/* harmony default export */ const Panel = (__exports__);

/***/ })

}]);