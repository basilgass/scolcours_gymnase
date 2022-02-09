"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[581,871],{

/***/ 6581:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ primitive_monome)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/random/index.js
var random = __webpack_require__(4682);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/coefficients/index.js
var coefficients = __webpack_require__(2482);
// EXTERNAL MODULE: ./resources/js/Components/Challenges/ui/challengeTitle.vue + 2 modules
var challengeTitle = __webpack_require__(9871);
// EXTERNAL MODULE: ./resources/js/Components/Ui/Keyboard.vue + 3 modules
var Keyboard = __webpack_require__(3163);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-monome.vue?vue&type=script&setup=true&lang=js

var _hoisted_1 = {
  "class": "mr-2"
};

var _hoisted_2 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("div", {
  "class": "text-sm text-gray-400 text-center mt-4"
}, [/*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Pas de puissance négative, pas de puissance sous forme de fraction."), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("br"), /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Les racines peuvent rester au dénominateur"), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("br"), /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Pour écrire plusieurs éléments au dénominateur, il faut l'entourer par des parenthèses ")], -1);





 // Le titre

/* harmony default export */ const primitive_monomevue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    var title = 'primitive d\'un monôme';
    var answer = (0,vue_esm_bundler.ref)(''),
        points = (0,vue_esm_bundler.ref)(0),
        question = (0,vue_esm_bundler.ref)(newQuestion()),
        keyboard = (0,vue_esm_bundler.ref)(null),
        questionWrapper = (0,vue_esm_bundler.ref)(null);
    var displayAnswer = (0,vue_esm_bundler.computed)(function () {
      return 'display';
    });
    var displayQuestion = (0,vue_esm_bundler.computed)(function () {
      return '\\int \\ ' + question.value.tex + '\\ \\text{d}x = ';
    });

    function newQuestion() {
      var degree = random.Random.bool(Math.min(0.1 + points.value * 0.05, 0.8)) ? random.Random.number(0, 6) : random.Random.numberSym(6, true),
          // Degree of the x value
      root = random.Random.bool(points.value * 0.07),
          // if there is a root item.
      q = random.Random.fraction({
        natural: points.value < 5,
        zero: false
      }),
          // random fraction
      tex,
          texX,
          qa,
          a,
          degree1,
          degreeDisplay; // Créer une racine (éventuellement, elle disparaît)

      if (root && degree !== 0) {
        degree = new coefficients.Fraction(degree, 2);
      } else {
        degree = new coefficients.Fraction(degree, 1);
      }

      degree.reduce(); // Création de la question
      // Affichage de la question
      // f(x) = q * x^{degree}

      degreeDisplay = Math.abs(degree.numerator) === 1 ? '' : "^{".concat(Math.abs(degree.numerator), "}");

      if (degree.denominator === 1) {
        texX = "x".concat(degreeDisplay);
      } else {
        texX = "\\sqrt{ x".concat(degreeDisplay, " }");
      }

      if (degree.isZero()) {
        tex = q.frac;
      } else if (degree.isNegative()) {
        if (q.denominator === 1) {
          tex = "\\frac{".concat(q.numerator, "}{").concat(texX, "}");
        } else {
          tex = "\\frac{".concat(q.numerator, "}{").concat(q.denominator).concat(texX, "}");
        }
      } else if (degree.isPositive()) {
        if (q.denominator === 1) {
          if (q.numerator === 1) {
            tex = "".concat(texX);
          } else if (q.numerator === -1) {
            tex = "-".concat(texX);
          } else {
            tex = "".concat(q.numerator).concat(texX);
          }
        } else {
          tex = "\\frac{".concat(q.numerator).concat(texX, "}{").concat(q.denominator, "}");
        }
      } // Mise en forme de la réponse
      // On ajoute un à la puissance.


      degree1 = degree.clone().add(new coefficients.Fraction().one());

      if (degree.value !== -1) {
        qa = q.clone().divide(degree1).reduce();

        if (degree1.isPositive()) {
          degreeDisplay = degree1.numerator === 1 ? '' : "^".concat(degree1.numerator);

          if (degree.denominator === 1) {
            // Pas de racine
            if (qa.isOne()) {
              // si la fraction vaut 1, on n'affiche pas le coefficient
              a = "x".concat(degreeDisplay);
            } else if (qa.isEqual(-1)) {
              // si la fraction vaut -1, on n'affiche pas le coefficient, que le signe
              a = "-x".concat(degreeDisplay);
            } else {
              // on affiche la fraction.
              a = "".concat(qa.display, "x").concat(degreeDisplay);
            }
          } else {
            // avec racine
            if (qa.isOne()) {
              // si la fraction vaut 1, on n'affiche pas le coefficient
              a = "sqrtx".concat(degreeDisplay);
            } else if (qa.isEqual(-1)) {
              // si la fraction vaut -1, on n'affiche pas le coefficient, que le signe
              a = "-sqrtx".concat(degreeDisplay);
            } else {
              // on affiche la fraction.
              a = "".concat(qa.display, "sqrtx").concat(degreeDisplay);
            }
          }
        } else {
          degreeDisplay = degree1.numerator === -1 ? '' : "^".concat(-degree1.numerator); // Sous forme de fraction car la puissance est négative.

          if (degree.denominator === 1) {
            // Pas de racine
            if (qa.isOne()) {
              // si la fraction vaut 1, on n'affiche pas le coefficient
              a = "1/(x".concat(degreeDisplay, ")");
            } else if (qa.isEqual(-1)) {
              // si la fraction vaut -1, on n'affiche pas le coefficient, que le signe
              a = "-1/(x".concat(degreeDisplay, ")");
            } else {
              // on affiche la fraction.
              if (qa.denominator === 1) {
                a = "".concat(qa.numerator, "/(x").concat(degreeDisplay, ")");
              } else {
                a = "".concat(qa.numerator, "/(").concat(qa.denominator, "x").concat(degreeDisplay, ")");
              }
            }
          } else {
            // avec racine
            if (qa.isOne()) {
              // si la fraction vaut 1, on n'affiche pas le coefficient
              a = "1/(sqrtx".concat(degreeDisplay, ")");
            } else if (qa.isEqual(-1)) {
              // si la fraction vaut -1, on n'affiche pas le coefficient, que le signe
              a = "-1/(sqrtx".concat(degreeDisplay, ")");
            } else {
              // on affiche la fraction.
              if (qa.denominator === 1) {
                a = "".concat(qa.numerator, "/(sqrtx").concat(degreeDisplay, ")");
              } else {
                a = "".concat(qa.numerator, "/(").concat(qa.denominator, "sqrtx").concat(degreeDisplay, ")");
              }
            }
          }
        }
      } else {
        // cas pariculier avec LN
        if (q.isOne()) {
          // si la fraction vaut 1, on n'affiche pas le coefficient
          a = 'ln(|x|)';
        } else if (q.isEqual(-1)) {
          // si la fraction vaut -1, on n'affiche pas le coefficient, que le signe
          a = '-ln(|x|)';
        } else {
          a = "".concat(q.display, "ln(|x|)");
        }
      }

      console.log(a);
      return {
        tex: tex,
        answer: a
      };
    }

    function resetAsnwer() {
      keyboard.value.resetKeyStrokes();
    }

    function validateAnswer() {
      if (question.value.answer === answer.value) {
        points.value++;
        resetAsnwer();
        question.value = newQuestion();
      } else {
        questionWrapper.value.style.setProperty('animation-name', 'v-shake-horizontal');
        questionWrapper.value.style.setProperty('animation-duration', '500ms');
        setTimeout(function () {
          questionWrapper.value.style.setProperty('animation-name', '');
        }, 500);
        points.value = 0;
      }
    }

    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("article", null, [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(challengeTitle["default"]), {
        title: title
      }), (0,vue_esm_bundler.createElementVNode)("div", null, "score actuel: " + (0,vue_esm_bundler.toDisplayString)((0,vue_esm_bundler.unref)(points)), 1), (0,vue_esm_bundler.createElementVNode)("div", {
        ref_key: "questionWrapper",
        ref: questionWrapper,
        "class": "text-center space-y-2"
      }, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", _hoisted_1, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(displayQuestion), void 0, {
        inline: true,
        display: true
      }]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(answer), void 0, {
        ascii: true,
        inline: true,
        display: true
      }]])], 512), (0,vue_esm_bundler.createElementVNode)("div", {
        "class": "text-center my-5"
      }, [(0,vue_esm_bundler.createElementVNode)("button", {
        "class": "btn btn-success",
        onClick: validateAnswer
      }, " Valider ")]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(Keyboard/* default */.Z), {
        ref_key: "keyboard",
        ref: keyboard,
        modelValue: (0,vue_esm_bundler.unref)(answer),
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return (0,vue_esm_bundler.isRef)(answer) ? answer.value = $event : answer = $event;
        }),
        keyboard: "algebra",
        "class": "max-w-sm mx-auto"
      }, null, 8, ["modelValue"]), _hoisted_2]);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/primitive-monome.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/primitive-monome.vue



const __exports__ = primitive_monomevue_type_script_setup_true_lang_js;

/* harmony default export */ const primitive_monome = (__exports__);

/***/ }),

/***/ 9871:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ challengeTitle)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js

var _hoisted_1 = {
  "class": "text-xl"
};
/* harmony default export */ const challengeTitlevue_type_script_setup_true_lang_js = ({
  props: {
    title: String
  },
  setup: function setup(__props) {
    return function (_ctx, _cache) {
      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("h1", _hoisted_1, (0,vue_esm_bundler.toDisplayString)(__props.title), 1);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/ui/challengeTitle.vue



const __exports__ = challengeTitlevue_type_script_setup_true_lang_js;

/* harmony default export */ const challengeTitle = (__exports__);

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

/***/ })

}]);