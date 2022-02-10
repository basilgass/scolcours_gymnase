"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_Chapters_algebre_primitives_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=script&setup=true&lang=js":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=script&setup=true&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var _Components_Exercise_algebre_PrimitiveSimple__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/Exercise/algebre/PrimitiveSimple */ "./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue");
/* harmony import */ var _Components_Ui_WhatToKnow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/Components/Ui/WhatToKnow */ "./resources/js/Components/Ui/WhatToKnow.vue");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    /** Chapter
     * title: Primitive ou intégrale indéfinie
     * body: calcul de primitive
     */

    var root = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null);

    function formatQuestion(A, pow, k) {
      var F,
          B,
          D,
          question = '',
          answer = '';

      if (pow instanceof Pi.Fraction) {
        var numerator = pow.numerator,
            denominator = pow.denominator,
            _D = A.clone().multiply(k).derivative(),
            primitivePow = pow.clone().add(1);

        F = new Pi.Fraction(k).divide(primitivePow);
        question = (_D.monoms.length === 1 ? _D.tex : "\\left( ".concat(_D.tex, " \\right)")) + "\\sqrt".concat(denominator === 2 ? '' : '[' + denominator + ']', "{ ").concat(numerator > 1 ? '\\left(' + A.tex + '\\right)^' + numerator : A.tex, " }");
        answer = (F.isOne() ? '' : F.tex) + ' \\cdot ' + "\\sqrt".concat(primitivePow.denominator === 2 ? '' : '[' + primitivePow.denominator + ']', "{ ").concat(primitivePow.numerator > 1 ? '\\left(' + A.tex + '\\right)^' + primitivePow.numerator : A.tex, " }");
      } else if (pow === undefined || pow === 1) {
        question = A.tex;
        answer = A.primitive().tex;
      } else if (pow > 1) {
        B = new Pi.Polynom("x^(".concat(pow, ")"));
        D = A.clone().multiply(k).derivative();
        question = (D.monoms.length === 1 ? D.tex : "\\left( ".concat(D.tex, " \\right)")) + B.tex.replace('x', "\\left(".concat(A.tex, "\\right)"));
        answer = B.multiply(k).primitive().tex.replace('x', "(".concat(A.tex, ")"));
      } else if (pow < -1) {
        F = new Pi.Fraction(k).divide(pow + 1);
        question = "\\frac{ ".concat(A.clone().multiply(k).derivative().tex, " }{ ( ").concat(A.tex, " )^{ ").concat(-pow, " } }");

        if (pow + 1 < -1) {
          answer = "\\dfrac{ ".concat(F.numerator, " }{ ").concat(F.denominator !== 1 ? F.denominator : '', " (").concat(A.tex, ")^{").concat(-(pow + 1), "} }");
        } else {
          answer = "\\dfrac{ ".concat(F.numerator, " }{ ").concat(F.denominator !== 1 ? F.denominator + '(' + A.tex + ')' : A.tex, " }");
        }
      } else if (pow === -1) {
        question = "\\dfrac{ ".concat(A.clone().multiply(k).derivative().tex, " }{ ").concat(A.tex, " }");
        answer = "".concat(k.isOne() ? '' : k.tex + ' \\cdot ', "\\ln \\left( {\\left\\vert ").concat(A.tex, " \\right\\vert} \\right)");
      } else if (pow === 0) {
        D = A.clone().multiply(k).derivative();
        question = "".concat(D.monoms.length === 1 ? D.tex : '\\left(' + D.tex + '\\right)', " \\cdot \\text{e}^{ ").concat(A.tex, " }");
        answer = "".concat(k.isOne() ? '' : k.tex + ' \\cdot ', " \\text{e}^{ ").concat(A.tex, " }");
      }

      return {
        question: question,
        answer: answer
      };
    }

    function generatePower(model) {
      var pow = 1;

      if (model === 'factors') {
        pow = Pi.Random.number(2, 6);
      } else if (model === 'rationals') {
        pow = -Pi.Random.number(2, 6);
      } else if (model === 'ln') {
        pow = -1;
      } else if (model === 'e') {
        pow = 0;
      } else if (model === 'roots') {
        pow = new Pi.Fraction(Pi.Random.fraction({
          max: 3,
          zero: false,
          natural: false,
          negative: false
        }));

        if (pow.isOne()) {
          pow = new Pi.Fraction('1/2');
        } else if (pow.isNatural()) {
          pow.invert();
        }
      }

      return pow;
    }

    function generateQuestions(randomize) {
      var questions = [],
          pow,
          n,
          D,
          maxValue = 5;

      if (randomize) {
        var items = []; // 3

        items.push({
          A: new Pi.Random.polynom({
            degree: 0,
            fraction: {
              natural: true,
              max: maxValue
            }
          }),
          pow: 1,
          k: 1
        }); // 3x

        items.push({
          A: new Pi.Random.polynom({
            degree: 1,
            allowNullMonom: false,
            numberOfMonoms: 1,
            fraction: {
              natural: true,
              max: maxValue
            }
          }).reorder(),
          pow: 1,
          k: 1
        }); // 3x^2

        items.push({
          A: new Pi.Random.polynom({
            degree: Pi.Random.number(2, 9),
            allowNullMonom: false,
            numberOfMonoms: 1,
            fraction: {
              natural: true,
              max: maxValue
            }
          }).reorder(),
          pow: 1,
          k: 1
        }); // 3/2x^3

        D = new Pi.Random.polynom({
          degree: Pi.Random.number(2, 9),
          allowNullMonom: false,
          numberOfMonoms: 1,
          fraction: {
            max: 5,
            natural: false
          }
        }).reorder();

        while (D.monoms[0].coefficient.isNatural()) {
          D = new Pi.Random.polynom({
            degree: Pi.Random.number(2, 9),
            allowNullMonom: false,
            numberOfMonoms: 1,
            fraction: {
              max: 5,
              natural: false
            }
          }).reorder();
        }

        items.push({
          A: D.clone(),
          pow: 1,
          k: 1
        }); // 3x^4+5x-4

        items.push({
          A: new Pi.Random.polynom({
            degree: Pi.Random.number(2, 5),
            allowNullMonom: false,
            numberOfMonoms: Pi.Random.number(2, 3),
            fraction: {
              natural: true,
              max: maxValue
            }
          }).reorder(),
          pow: 1,
          k: 1
        });
        var models = ['factors', 'roots', 'rationals', 'ln', 'e'];

        for (var _i = 0, _models = models; _i < _models.length; _i++) {
          var model = _models[_i];
          // Basic version
          items.push({
            A: new Pi.Random.polynom({
              degree: Pi.Random.number(2, 5),
              allowNullMonom: false,
              numberOfMonoms: Pi.Random.number(2, 3),
              fraction: {
                natural: true,
                max: maxValue
              }
            }).reorder(),
            pow: generatePower(model),
            k: new Pi.Fraction(1)
          }); // With a natural factor

          items.push({
            A: new Pi.Random.polynom({
              degree: Pi.Random.number(2, 5),
              numberOfMonoms: Pi.Random.number(2, 3),
              fraction: {
                natural: true,
                max: maxValue
              }
            }).reorder(),
            pow: generatePower(model),
            k: new Pi.Fraction(Pi.Random.number(2, 5))
          }); // With a fraction factor - must create the polynom.

          n = Pi.Random.number(2, 5);
          D = new Pi.Random.polynom({
            degree: Pi.Random.number(1, 4),
            numberOfMonoms: Pi.Random.number(2, 3),
            fraction: {
              natural: true,
              max: maxValue
            }
          }).reorder().multiply(n).primitive();
          D.multiply(D.lcmDenominator());
          items.push({
            A: D,
            pow: generatePower(model),
            k: new Pi.Fraction(1).divide(n)
          });
        }

        for (var _i2 = 0, _items = items; _i2 < _items.length; _i2++) {
          var i = _items[_i2];
          questions.push(formatQuestion(i.A, i.pow, i.k));
        }
      } else {
        questions.push(formatQuestion(new Pi.Polynom('7')));
        questions.push(formatQuestion(new Pi.Polynom('3x')));
        questions.push(formatQuestion(new Pi.Polynom('5x^3')));
        questions.push(formatQuestion(new Pi.Polynom('2/5x^2')));
        questions.push(formatQuestion(new Pi.Polynom('4x^2+3x+5')));
        questions.push(formatQuestion(new Pi.Polynom('x^2+3x'), 3, new Pi.Fraction(1)));
        questions.push(formatQuestion(new Pi.Polynom('2x^3+5x'), 5, new Pi.Fraction(2)));
        questions.push(formatQuestion(new Pi.Polynom('x^2+4x'), 3, new Pi.Fraction('1/2')));
        questions.push(formatQuestion(new Pi.Polynom('3x^2+7x+9'), -3, new Pi.Fraction('1')));
        questions.push(formatQuestion(new Pi.Polynom('x^3+9'), -4, new Pi.Fraction(6)));
        questions.push(formatQuestion(new Pi.Polynom('3x^4+2x^2+1'), -2, new Pi.Fraction('1/4')));
        questions.push(formatQuestion(new Pi.Polynom('3x^4+2x^2+1'), -1, new Pi.Fraction(1)));
        questions.push(formatQuestion(new Pi.Polynom('x^3+2x^2'), -1, new Pi.Fraction('6')));
        questions.push(formatQuestion(new Pi.Polynom('2x^3+x^2'), -1, new Pi.Fraction('1/2')));
        questions.push(formatQuestion(new Pi.Polynom('x^2-5'), 0, new Pi.Fraction(1)));
        questions.push(formatQuestion(new Pi.Polynom('x^3+4x'), 0, new Pi.Fraction(2)));
        questions.push(formatQuestion(new Pi.Polynom('x^5+5x^3'), 0, new Pi.Fraction('1/5')));
      }

      for (var _i3 = 0, _questions = questions; _i3 < _questions.length; _i3++) {
        var q = _questions[_i3];
        q.question = "\\int ".concat(q.question, " \\ \\text{d}{x}");
      }

      return questions;
    }

    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onMounted)(function () {
      katexAutoRender(root.value);
    });
    var __returned__ = {
      root: root,
      formatQuestion: formatQuestion,
      generatePower: generatePower,
      generateQuestions: generateQuestions,
      onMounted: vue__WEBPACK_IMPORTED_MODULE_0__.onMounted,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref,
      PrimitiveSimple: _Components_Exercise_algebre_PrimitiveSimple__WEBPACK_IMPORTED_MODULE_1__["default"],
      WhatToKnow: _Components_Ui_WhatToKnow__WEBPACK_IMPORTED_MODULE_2__["default"]
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=script&setup=true&lang=js":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=script&setup=true&lang=js ***!
  \*************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Components_Ui_KatexEditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/Components/Ui/KatexEditor */ "./resources/js/Components/Ui/KatexEditor.vue");
/* harmony import */ var _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/Ui/Panel */ "./resources/js/Components/Ui/Panel.vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var state = (0,vue__WEBPACK_IMPORTED_MODULE_2__.reactive)({
      userAnswer: '',
      question: '',
      answer: '',
      correct: false
    });
    (0,vue__WEBPACK_IMPORTED_MODULE_2__.onMounted)(function () {
      newQuestion();
    });

    function validate() {
      if (state.correct) {
        newQuestion();
      }

      state.correct = state.userAnswer === state.answer;
    }

    function newQuestion() {
      var M = Pi.Random.monom({
        letter: 'x',
        degree: Pi.Random.number(1, 8),
        fraction: true
      });
      state.userAnswer = '';
      state.question = M.tex;
      state.answer = M.primitive().display;
    }

    var __returned__ = {
      state: state,
      validate: validate,
      newQuestion: newQuestion,
      KatexEditor: _Components_Ui_KatexEditor__WEBPACK_IMPORTED_MODULE_0__["default"],
      Panel: _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_1__["default"],
      onMounted: vue__WEBPACK_IMPORTED_MODULE_2__.onMounted,
      reactive: vue__WEBPACK_IMPORTED_MODULE_2__.reactive
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&setup=true&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&setup=true&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    modelValue: {
      type: String,
      "default": ""
    },
    name: {
      type: String,
      "default": "math"
    },
    latex: {
      type: Boolean,
      "default": false
    },
    correct: {
      type: Boolean,
      "default": false
    }
  },
  emits: ["update:modelValue", "validate"],
  setup: function setup(__props, _ref) {
    var expose = _ref.expose,
        emits = _ref.emit;
    expose();
    var props = __props;
    var asciiMode = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(false);
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onMounted)(function () {
      asciiMode.value = !props.latex;
    });
    var __returned__ = {
      emits: emits,
      props: props,
      asciiMode: asciiMode,
      onMounted: vue__WEBPACK_IMPORTED_MODULE_0__.onMounted,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/WhatToKnow.vue?vue&type=script&setup=true&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/WhatToKnow.vue?vue&type=script&setup=true&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/Ui/Panel */ "./resources/js/Components/Ui/Panel.vue");
/* harmony import */ var _inertiajs_inertia_vue3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @inertiajs/inertia-vue3 */ "./node_modules/@inertiajs/inertia-vue3/dist/index.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    questions: Function
  },
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var props = __props;
    var downloadGenerating = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(false),
        generatedQuestions = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)([]),
        questionNo = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(0),
        showAnswer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(false),
        showFinished = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(false);
    generatedQuestions.value = props.questions(true);

    function nextQuestion() {
      if (showFinished.value) {
        return;
      }

      showAnswer.value = !showAnswer.value; // It's a new question

      if (!showAnswer.value) {
        if (generatedQuestions.value.length - 1 === questionNo.value) {
          showFinished.value = true;
          generatedQuestions.value = props.questions(true);
          questionNo.value = 0;
        } else {
          questionNo.value++;
        }
      }
    }

    function generatePDF() {
      downloadGenerating.value = true;
      var questions = [];

      var _iterator = _createForOfIteratorHelper(props.questions(true)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var q = _step.value;
          questions.push({
            question: q.question,
            answer: q.answer
          });
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      axios.post('/latex', {
        questions: questions,
        theme: (0,_inertiajs_inertia_vue3__WEBPACK_IMPORTED_MODULE_2__.usePage)().props.value.theme.slug,
        slug: (0,_inertiajs_inertia_vue3__WEBPACK_IMPORTED_MODULE_2__.usePage)().props.value.chapter.slug,
        title: (0,_inertiajs_inertia_vue3__WEBPACK_IMPORTED_MODULE_2__.usePage)().props.value.chapter.title
      }).then(function (res) {
        downloadGenerating.value = false;
        document.location = '/download/' + res.data;
      })["catch"](function (err) {
        console.log(err.response.data);
      });
    }

    var __returned__ = {
      props: props,
      downloadGenerating: downloadGenerating,
      generatedQuestions: generatedQuestions,
      questionNo: questionNo,
      showAnswer: showAnswer,
      showFinished: showFinished,
      nextQuestion: nextQuestion,
      generatePDF: generatePDF,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref,
      Panel: _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_1__["default"],
      usePage: _inertiajs_inertia_vue3__WEBPACK_IMPORTED_MODULE_2__.usePage
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=template&id=3bd3c1c6":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=template&id=3bd3c1c6 ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  ref: "root"
};

var _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Liste des calculs à savoir ");

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("section", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["WhatToKnow"], {
    questions: $setup.generateQuestions
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_2];
    }),
    _: 1
    /* STABLE */

  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["PrimitiveSimple"])], 512
  /* NEED_PATCH */
  );
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=template&id=a05d9bec":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=template&id=a05d9bec ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "py-2 h-20 flex items-center"
};

var _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Calculer une primitive de ");

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)($setup["Panel"], {
    "class": "max-w-md mt-4"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, [_hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, null, 512
      /* NEED_PATCH */
      ), [[_directive_katex, "f(x)=".concat($setup.state.question), void 0, {
        inline: true,
        clear: true
      }]])])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["KatexEditor"], {
        modelValue: $setup.state.userAnswer,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return $setup.state.userAnswer = $event;
        }),
        correct: $setup.state.correct,
        onKeypress: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)($setup.validate, ["enter"]),
        onValidate: $setup.validate
      }, null, 8
      /* PROPS */
      , ["modelValue", "correct", "onKeypress"])];
    }),
    _: 1
    /* STABLE */

  });
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
var _hoisted_9 = {
  "class": "flex justify-end"
};
var _hoisted_10 = ["textContent"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("label", {
    "for": $props.name,
    "class": "block uppercase font-bold text-xs text-gray-700"
  }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.name), 9
  /* TEXT, PROPS */
  , _hoisted_3), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
    "class": "text-xs cursor-pointer",
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return $setup.asciiMode = !$setup.asciiMode;
    }),
    textContent: (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.asciiMode ? 'ASCII' : 'LaTeX')
  }, null, 8
  /* PROPS */
  , _hoisted_4)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("input", {
    name: $props.name,
    value: $props.modelValue,
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["w-full p-2 rounded bg-transparent border focus:outline-none", {
      'border-gray-200 focus:border-gray-600': !$props.correct,
      'border-2 border-green-600': $props.correct
    }]),
    onInput: _cache[1] || (_cache[1] = function ($event) {
      return _ctx.$emit('update:modelValue', $event.target.value);
    })
  }, null, 42
  /* CLASS, PROPS, HYDRATE_EVENTS */
  , _hoisted_5), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_6, [$setup.asciiMode ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)(((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_7, null, 512
  /* NEED_PATCH */
  )), [[_directive_katex, $props.modelValue, void 0, {
    ascii: true,
    left: true
  }]]) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)(((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_8, null, 512
  /* NEED_PATCH */
  )), [[_directive_katex, $props.modelValue, void 0, {
    left: true
  }]])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_9, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["btn", $props.correct ? 'btn-success' : 'btn-primary']),
    onClick: _cache[2] || (_cache[2] = function ($event) {
      return _ctx.$emit('validate', $props.modelValue);
    }),
    textContent: (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.correct ? 'Nouveau' : 'Valider')
  }, null, 10
  /* CLASS, PROPS */
  , _hoisted_10)])]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/WhatToKnow.vue?vue&type=template&id=219caf4a":
/*!***********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/WhatToKnow.vue?vue&type=template&id=219caf4a ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "flex justify-between flex-col sm:flex-row sm:items-end"
};

var _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h2", {
  "class": "text-xl font-semibold"
}, " A savoir ", -1
/* HOISTED */
);

var _hoisted_3 = {
  "class": "text-sm text-gray-700"
};
var _hoisted_4 = {
  "class": "text-sm text-gray-500"
};

var _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Cliquer pour afficher la ");

var _hoisted_6 = ["textContent"];
var _hoisted_7 = {
  key: 0,
  "class": "flex items-center flex-col sm:flex-row"
};
var _hoisted_8 = {
  key: 0
};
var _hoisted_9 = {
  key: 1
};

var _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Terminé ! ");

var _hoisted_11 = {
  "class": "text-gray-300 text-sm flex justify-between"
};
var _hoisted_12 = ["disabled"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, [_hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "default")])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [_hoisted_5, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
    textContent: (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.showAnswer ? 'prochaine question' : 'réponse')
  }, null, 8
  /* PROPS */
  , _hoisted_6)])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["Panel"], null, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
        "class": "flex md:items-center min-h-[160px] md:min-h-[80px] select-none px-10 cursor-pointer",
        onClick: _cache[1] || (_cache[1] = function ($event) {
          return $setup.nextQuestion();
        })
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
        name: "fade",
        mode: "out-in"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [!$setup.showFinished ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_7, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, null, 512
          /* NEED_PATCH */
          ), [[_directive_katex, $setup.generatedQuestions[$setup.questionNo].question + '\\ = \\ ', void 0, {
            left: true,
            clear: true
          }]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
            name: "slide-right"
          }, {
            "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
              return [$setup.showAnswer ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)(((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_8, null, 512
              /* NEED_PATCH */
              )), [[_directive_katex, $setup.generatedQuestions[$setup.questionNo].answer, void 0, {
                left: true,
                clear: true
              }]]) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
            }),
            _: 1
            /* STABLE */

          })])) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_9, [_hoisted_10, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
            "class": "btn",
            onClick: _cache[0] || (_cache[0] = function ($event) {
              return $setup.showFinished = false;
            })
          }, " Recommencer (aléatoire) ")]))];
        }),
        _: 1
        /* STABLE */

      })]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_11, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.questionNo + 1) + " / " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.generatedQuestions.length), 1
      /* TEXT */
      ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
        "class": "btn py-0",
        disabled: $setup.downloadGenerating,
        onClick: $setup.generatePDF
      }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.downloadGenerating ? 'Patienter...' : 'Générer PDF'), 9
      /* TEXT, PROPS */
      , _hoisted_12)])];
    }),
    _: 1
    /* STABLE */

  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("\t<div"), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("\t\tv-for=\"item in generatedQuestions\""), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("\t\t:key=\"item.question\""), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("\t>"), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("\t\t<span v-katex=\"`${item.question} = ${ item.answer }`\" />"), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("\t</div>")], 64
  /* STABLE_FRAGMENT */
  );
}

/***/ }),

/***/ "./resources/js/Components/Chapters/algebre/primitives.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/Components/Chapters/algebre/primitives.vue ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _primitives_vue_vue_type_template_id_3bd3c1c6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./primitives.vue?vue&type=template&id=3bd3c1c6 */ "./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=template&id=3bd3c1c6");
/* harmony import */ var _primitives_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./primitives.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_primitives_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_primitives_vue_vue_type_template_id_3bd3c1c6__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Chapters/algebre/primitives.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue":
/*!**********************************************************************!*\
  !*** ./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PrimitiveSimple_vue_vue_type_template_id_a05d9bec__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PrimitiveSimple.vue?vue&type=template&id=a05d9bec */ "./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=template&id=a05d9bec");
/* harmony import */ var _PrimitiveSimple_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PrimitiveSimple.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_PrimitiveSimple_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_PrimitiveSimple_vue_vue_type_template_id_a05d9bec__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Exercise/algebre/PrimitiveSimple.vue"]])
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
/* harmony import */ var _KatexEditor_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./KatexEditor.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_KatexEditor_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_KatexEditor_vue_vue_type_template_id_3ccbfe4e__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Ui/KatexEditor.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Ui/WhatToKnow.vue":
/*!***************************************************!*\
  !*** ./resources/js/Components/Ui/WhatToKnow.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _WhatToKnow_vue_vue_type_template_id_219caf4a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WhatToKnow.vue?vue&type=template&id=219caf4a */ "./resources/js/Components/Ui/WhatToKnow.vue?vue&type=template&id=219caf4a");
/* harmony import */ var _WhatToKnow_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WhatToKnow.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Ui/WhatToKnow.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_WhatToKnow_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_WhatToKnow_vue_vue_type_template_id_219caf4a__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Ui/WhatToKnow.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=script&setup=true&lang=js":
/*!****************************************************************************************************!*\
  !*** ./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=script&setup=true&lang=js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitives_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitives_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./primitives.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=script&setup=true&lang=js":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=script&setup=true&lang=js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_PrimitiveSimple_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_PrimitiveSimple_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./PrimitiveSimple.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&setup=true&lang=js":
/*!***************************************************************************************!*\
  !*** ./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&setup=true&lang=js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_KatexEditor_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_KatexEditor_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./KatexEditor.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Ui/WhatToKnow.vue?vue&type=script&setup=true&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/Components/Ui/WhatToKnow.vue?vue&type=script&setup=true&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_WhatToKnow_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_WhatToKnow_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./WhatToKnow.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/WhatToKnow.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=template&id=3bd3c1c6":
/*!***********************************************************************************************!*\
  !*** ./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=template&id=3bd3c1c6 ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitives_vue_vue_type_template_id_3bd3c1c6__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_primitives_vue_vue_type_template_id_3bd3c1c6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./primitives.vue?vue&type=template&id=3bd3c1c6 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=template&id=3bd3c1c6");


/***/ }),

/***/ "./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=template&id=a05d9bec":
/*!****************************************************************************************************!*\
  !*** ./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=template&id=a05d9bec ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_PrimitiveSimple_vue_vue_type_template_id_a05d9bec__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_PrimitiveSimple_vue_vue_type_template_id_a05d9bec__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./PrimitiveSimple.vue?vue&type=template&id=a05d9bec */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=template&id=a05d9bec");


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


/***/ }),

/***/ "./resources/js/Components/Ui/WhatToKnow.vue?vue&type=template&id=219caf4a":
/*!*********************************************************************************!*\
  !*** ./resources/js/Components/Ui/WhatToKnow.vue?vue&type=template&id=219caf4a ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_WhatToKnow_vue_vue_type_template_id_219caf4a__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_WhatToKnow_vue_vue_type_template_id_219caf4a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./WhatToKnow.vue?vue&type=template&id=219caf4a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/WhatToKnow.vue?vue&type=template&id=219caf4a");


/***/ })

}]);