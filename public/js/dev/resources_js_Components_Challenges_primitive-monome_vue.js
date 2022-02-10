"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_Challenges_primitive-monome_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-monome.vue?vue&type=script&setup=true&lang=js":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-monome.vue?vue&type=script&setup=true&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var _Components_Challenges_ui_challengeTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/Challenges/ui/challengeTitle */ "./resources/js/Components/Challenges/ui/challengeTitle.vue");
/* harmony import */ var _Components_Ui_Keyboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/Components/Ui/Keyboard */ "./resources/js/Components/Ui/Keyboard.vue");


 // Le titre

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var title = 'primitive d\'un monôme';
    var answer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(''),
        points = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(0),
        question = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(newQuestion()),
        keyboard = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null),
        questionWrapper = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null);
    var displayAnswer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      return 'display';
    });
    var displayQuestion = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
      return '\\int \\ ' + question.value.tex + '\\ \\text{d}x = ';
    });

    function newQuestion() {
      var degree = Pi.Random.bool(Math.min(0.1 + points.value * 0.05, 0.8)) ? Pi.Random.number(0, 6) : Pi.Random.numberSym(6, true),
          // Degree of the x value
      root = Pi.Random.bool(points.value * 0.07),
          // if there is a root item.
      q = Pi.Random.fraction({
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
        degree = new Pi.Fraction(degree, 2);
      } else {
        degree = new Pi.Fraction(degree, 1);
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


      degree1 = degree.clone().add(new Pi.Fraction().one());

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

    var __returned__ = {
      title: title,
      answer: answer,
      points: points,
      question: question,
      keyboard: keyboard,
      questionWrapper: questionWrapper,
      displayAnswer: displayAnswer,
      displayQuestion: displayQuestion,
      newQuestion: newQuestion,
      resetAsnwer: resetAsnwer,
      validateAnswer: validateAnswer,
      computed: vue__WEBPACK_IMPORTED_MODULE_0__.computed,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref,
      ChallengeTitle: _Components_Challenges_ui_challengeTitle__WEBPACK_IMPORTED_MODULE_1__["default"],
      Keyboard: _Components_Ui_Keyboard__WEBPACK_IMPORTED_MODULE_2__["default"]
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
    var root = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null),
        keyStrokes = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)([]),
        keyboardGridDefault = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)('grid-cols-4');
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
    }),
        keyboardCommands = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
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
      keyStrokes: keyStrokes,
      keyboardGridDefault: keyboardGridDefault,
      keyboardData: keyboardData,
      keyboardComputed: keyboardComputed,
      keyboardCommands: keyboardCommands,
      resetKeyStrokes: resetKeyStrokes,
      backKeyStrokes: backKeyStrokes,
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-monome.vue?vue&type=template&id=7322a425":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-monome.vue?vue&type=template&id=7322a425 ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  ref: "questionWrapper",
  "class": "text-center space-y-2"
};
var _hoisted_2 = {
  "class": "mr-2"
};

var _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
  "class": "text-sm text-gray-400 text-center mt-4"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Pas de puissance négative, pas de puissance sous forme de fraction."), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("br"), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Les racines peuvent rester au dénominateur"), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("br"), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Pour écrire plusieurs éléments au dénominateur, il faut l'entourer par des parenthèses ")], -1
/* HOISTED */
);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("article", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["ChallengeTitle"], {
    title: $setup.title
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, "score actuel: " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.points), 1
  /* TEXT */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, $setup.displayQuestion, void 0, {
    inline: true,
    display: true
  }]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, $setup.answer, void 0, {
    ascii: true,
    inline: true,
    display: true
  }]])], 512
  /* NEED_PATCH */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    "class": "text-center my-5"
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn btn-success",
    onClick: $setup.validateAnswer
  }, " Valider ")]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["Keyboard"], {
    ref: "keyboard",
    modelValue: $setup.answer,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $setup.answer = $event;
    }),
    keyboard: "algebra",
    "class": "max-w-sm mx-auto"
  }, null, 8
  /* PROPS */
  , ["modelValue"]), _hoisted_3]);
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
var _hoisted_7 = ["onClick"];

var _hoisted_8 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)();

var _hoisted_9 = {
  "class": "hidden md:inline md:ml-2"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _$setup$keyboardData$, _$setup$keyboardData$2;

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
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["grid gap-2 keyboard", ((_$setup$keyboardData$ = $setup.keyboardData.grid) !== null && _$setup$keyboardData$ !== void 0 ? _$setup$keyboardData$ : $setup.keyboardGridDefault) + ($props.small ? ' keyboard-sm' : '')])
  }, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($setup.keyboardComputed, function (key, index) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("button", {
      key: "key-".concat(key.key, "-").concat(index),
      "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["key", "".concat(key.span, " ").concat(key.visible ? 'invisible' : '')]),
      onClick: function onClick($event) {
        return $setup.ButtonKeyClick(key);
      }
    }, [key.type === 'math' ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)(((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_6, null, 512
    /* NEED_PATCH */
    )), [[_directive_katex, key.display, void 0, {
      clear: true
    }]]) : key.type === 'icon' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("i", {
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
  ), $setup.keyboardCommands.length > 0 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    key: 2,
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["keyboard grid gap-2 w-full mt-10", ((_$setup$keyboardData$2 = $setup.keyboardData.grid) !== null && _$setup$keyboardData$2 !== void 0 ? _$setup$keyboardData$2 : $setup.keyboardGridDefault) + ($props.small ? ' keyboard-sm' : '')])
  }, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($setup.keyboardCommands, function (item, index) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("button", {
      key: "keyboard-command-".concat(index),
      "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)("key col-span-".concat(item.span, " ").concat(item.atEnd ? 'order-last' : '')),
      onClick: function onClick($event) {
        return item.fn();
      }
    }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("i", {
      "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(item.icon)
    }, null, 2
    /* CLASS */
    ), _hoisted_8, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_9, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(item.label), 1
    /* TEXT */
    )], 10
    /* CLASS, PROPS */
    , _hoisted_7);
  }), 128
  /* KEYED_FRAGMENT */
  ))], 2
  /* CLASS */
  )) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]);
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

/***/ }),

/***/ "./resources/js/Components/Challenges/primitive-monome.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/Components/Challenges/primitive-monome.vue ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _primitive_monome_vue_vue_type_template_id_7322a425__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./primitive-monome.vue?vue&type=template&id=7322a425 */ "./resources/js/Components/Challenges/primitive-monome.vue?vue&type=template&id=7322a425");
/* harmony import */ var _primitive_monome_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./primitive-monome.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Challenges/primitive-monome.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_primitive_monome_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_primitive_monome_vue_vue_type_template_id_7322a425__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Challenges/primitive-monome.vue"]])
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

/***/ "./resources/js/Components/Challenges/primitive-monome.vue?vue&type=script&setup=true&lang=js":
/*!****************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/primitive-monome.vue?vue&type=script&setup=true&lang=js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitive_monome_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitive_monome_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./primitive-monome.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-monome.vue?vue&type=script&setup=true&lang=js");
 

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

/***/ "./resources/js/Components/Challenges/primitive-monome.vue?vue&type=template&id=7322a425":
/*!***********************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/primitive-monome.vue?vue&type=template&id=7322a425 ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitive_monome_vue_vue_type_template_id_7322a425__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitive_monome_vue_vue_type_template_id_7322a425__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./primitive-monome.vue?vue&type=template&id=7322a425 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/primitive-monome.vue?vue&type=template&id=7322a425");


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


/***/ })

}]);