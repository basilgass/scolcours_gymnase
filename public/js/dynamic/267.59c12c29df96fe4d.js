"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[267],{

/***/ 3267:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ primitives)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&setup=true&lang=js

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

/* harmony default export */ const KatexEditorvue_type_script_setup_true_lang_js = ({
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
    var emits = _ref.emit;
    var props = __props;
    var asciiMode = (0,vue_esm_bundler.ref)(false);
    (0,vue_esm_bundler.onMounted)(function () {
      asciiMode.value = !props.latex;
    });
    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_1, [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_2, [(0,vue_esm_bundler.createElementVNode)("label", {
        "for": __props.name,
        "class": "block uppercase font-bold text-xs text-gray-700"
      }, (0,vue_esm_bundler.toDisplayString)(__props.name), 9, _hoisted_3), (0,vue_esm_bundler.createElementVNode)("span", {
        "class": "text-xs cursor-pointer",
        onClick: _cache[0] || (_cache[0] = function ($event) {
          return (0,vue_esm_bundler.isRef)(asciiMode) ? asciiMode.value = !(0,vue_esm_bundler.unref)(asciiMode) : asciiMode = !(0,vue_esm_bundler.unref)(asciiMode);
        }),
        textContent: (0,vue_esm_bundler.toDisplayString)((0,vue_esm_bundler.unref)(asciiMode) ? 'ASCII' : 'LaTeX')
      }, null, 8, _hoisted_4)]), (0,vue_esm_bundler.createElementVNode)("input", {
        name: __props.name,
        value: __props.modelValue,
        "class": (0,vue_esm_bundler.normalizeClass)(["w-full p-2 rounded bg-transparent border focus:outline-none", {
          'border-gray-200 focus:border-gray-600': !__props.correct,
          'border-2 border-green-600': __props.correct
        }]),
        onInput: _cache[1] || (_cache[1] = function ($event) {
          return _ctx.$emit('update:modelValue', $event.target.value);
        })
      }, null, 42, _hoisted_5), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_6, [(0,vue_esm_bundler.unref)(asciiMode) ? (0,vue_esm_bundler.withDirectives)(((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_7, null, 512)), [[_directive_katex, __props.modelValue, void 0, {
        ascii: true,
        left: true
      }]]) : (0,vue_esm_bundler.withDirectives)(((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_8, null, 512)), [[_directive_katex, __props.modelValue, void 0, {
        left: true
      }]])]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_9, [(0,vue_esm_bundler.createElementVNode)("button", {
        "class": (0,vue_esm_bundler.normalizeClass)(["btn", __props.correct ? 'btn-success' : 'btn-primary']),
        onClick: _cache[2] || (_cache[2] = function ($event) {
          return _ctx.$emit('validate', __props.modelValue);
        }),
        textContent: (0,vue_esm_bundler.toDisplayString)(__props.correct ? 'Nouveau' : 'Valider')
      }, null, 10, _hoisted_10)])]);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Ui/KatexEditor.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Ui/KatexEditor.vue



const __exports__ = KatexEditorvue_type_script_setup_true_lang_js;

/* harmony default export */ const KatexEditor = (__exports__);
// EXTERNAL MODULE: ./resources/js/Components/Ui/Panel.vue + 2 modules
var Panel = __webpack_require__(816);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/random/index.js
var random = __webpack_require__(4682);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=script&setup=true&lang=js

var PrimitiveSimplevue_type_script_setup_true_lang_js_hoisted_1 = {
  "class": "py-2 h-20 flex items-center"
};

var PrimitiveSimplevue_type_script_setup_true_lang_js_hoisted_2 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)("Calculer une primitive de ");





/* harmony default export */ const PrimitiveSimplevue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    var state = (0,vue_esm_bundler.reactive)({
      userAnswer: '',
      question: '',
      answer: '',
      correct: false
    });
    (0,vue_esm_bundler.onMounted)(function () {
      newQuestion();
    });

    function validate() {
      if (state.correct) {
        newQuestion();
      }

      state.correct = state.userAnswer === state.answer;
    }

    function newQuestion() {
      var M = random.Random.monom({
        letter: 'x',
        degree: random.Random.number(1, 8),
        fraction: true
      });
      state.userAnswer = '';
      state.question = M.tex;
      state.answer = M.primitive().display;
    }

    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createBlock)((0,vue_esm_bundler.unref)(Panel/* default */.Z), {
        "class": "max-w-md mt-4"
      }, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.createElementVNode)("div", PrimitiveSimplevue_type_script_setup_true_lang_js_hoisted_1, [(0,vue_esm_bundler.createElementVNode)("div", null, [PrimitiveSimplevue_type_script_setup_true_lang_js_hoisted_2, (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, "f(x)=".concat((0,vue_esm_bundler.unref)(state).question), void 0, {
            inline: true,
            clear: true
          }]])])]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(KatexEditor), {
            modelValue: (0,vue_esm_bundler.unref)(state).userAnswer,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
              return (0,vue_esm_bundler.unref)(state).userAnswer = $event;
            }),
            correct: (0,vue_esm_bundler.unref)(state).correct,
            onKeypress: (0,vue_esm_bundler.withKeys)(validate, ["enter"]),
            onValidate: validate
          }, null, 8, ["modelValue", "correct", "onKeypress"])];
        }),
        _: 1
      });
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Exercise/algebre/PrimitiveSimple.vue



const PrimitiveSimple_exports_ = PrimitiveSimplevue_type_script_setup_true_lang_js;

/* harmony default export */ const PrimitiveSimple = (PrimitiveSimple_exports_);
// EXTERNAL MODULE: ./node_modules/@inertiajs/inertia-vue3/dist/index.js
var dist = __webpack_require__(9038);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/WhatToKnow.vue?vue&type=script&setup=true&lang=js
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


var WhatToKnowvue_type_script_setup_true_lang_js_hoisted_1 = {
  "class": "flex justify-between flex-col sm:flex-row sm:items-end"
};

var WhatToKnowvue_type_script_setup_true_lang_js_hoisted_2 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("h2", {
  "class": "text-xl font-semibold"
}, " A savoir ", -1);

var WhatToKnowvue_type_script_setup_true_lang_js_hoisted_3 = {
  "class": "text-sm text-gray-700"
};
var WhatToKnowvue_type_script_setup_true_lang_js_hoisted_4 = {
  "class": "text-sm text-gray-500"
};

var WhatToKnowvue_type_script_setup_true_lang_js_hoisted_5 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Cliquer pour afficher la ");

var WhatToKnowvue_type_script_setup_true_lang_js_hoisted_6 = ["textContent"];
var WhatToKnowvue_type_script_setup_true_lang_js_hoisted_7 = {
  key: 0,
  "class": "flex items-center flex-col sm:flex-row"
};
var WhatToKnowvue_type_script_setup_true_lang_js_hoisted_8 = {
  key: 0
};
var WhatToKnowvue_type_script_setup_true_lang_js_hoisted_9 = {
  key: 1
};

var WhatToKnowvue_type_script_setup_true_lang_js_hoisted_10 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Terminé ! ");

var _hoisted_11 = {
  "class": "text-gray-300 text-sm flex justify-between"
};
var _hoisted_12 = ["disabled"];



/* harmony default export */ const WhatToKnowvue_type_script_setup_true_lang_js = ({
  props: {
    questions: Function
  },
  setup: function setup(__props) {
    var props = __props;
    var downloadGenerating = (0,vue_esm_bundler.ref)(false),
        generatedQuestions = (0,vue_esm_bundler.ref)([]),
        questionNo = (0,vue_esm_bundler.ref)(0),
        showAnswer = (0,vue_esm_bundler.ref)(false),
        showFinished = (0,vue_esm_bundler.ref)(false);
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
        theme: (0,dist/* usePage */.qt)().props.value.theme.slug,
        slug: (0,dist/* usePage */.qt)().props.value.chapter.slug,
        title: (0,dist/* usePage */.qt)().props.value.chapter.title
      }).then(function (res) {
        downloadGenerating.value = false;
        document.location = '/download/' + res.data;
      })["catch"](function (err) {
        console.log(err.response.data);
      });
    }

    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, [(0,vue_esm_bundler.createElementVNode)("div", WhatToKnowvue_type_script_setup_true_lang_js_hoisted_1, [(0,vue_esm_bundler.createElementVNode)("div", null, [WhatToKnowvue_type_script_setup_true_lang_js_hoisted_2, (0,vue_esm_bundler.createElementVNode)("div", WhatToKnowvue_type_script_setup_true_lang_js_hoisted_3, [(0,vue_esm_bundler.renderSlot)(_ctx.$slots, "default")])]), (0,vue_esm_bundler.createElementVNode)("div", WhatToKnowvue_type_script_setup_true_lang_js_hoisted_4, [WhatToKnowvue_type_script_setup_true_lang_js_hoisted_5, (0,vue_esm_bundler.createElementVNode)("span", {
        textContent: (0,vue_esm_bundler.toDisplayString)((0,vue_esm_bundler.unref)(showAnswer) ? 'prochaine question' : 'réponse')
      }, null, 8, WhatToKnowvue_type_script_setup_true_lang_js_hoisted_6)])]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(Panel/* default */.Z), null, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.createElementVNode)("div", {
            "class": "flex md:items-center min-h-[160px] md:min-h-[80px] select-none px-10 cursor-pointer",
            onClick: _cache[1] || (_cache[1] = function ($event) {
              return nextQuestion();
            })
          }, [(0,vue_esm_bundler.createVNode)(vue_esm_bundler.Transition, {
            name: "fade",
            mode: "out-in"
          }, {
            "default": (0,vue_esm_bundler.withCtx)(function () {
              return [!(0,vue_esm_bundler.unref)(showFinished) ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", WhatToKnowvue_type_script_setup_true_lang_js_hoisted_7, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(generatedQuestions)[(0,vue_esm_bundler.unref)(questionNo)].question + '\\ = \\ ', void 0, {
                left: true,
                clear: true
              }]]), (0,vue_esm_bundler.createVNode)(vue_esm_bundler.Transition, {
                name: "slide-right"
              }, {
                "default": (0,vue_esm_bundler.withCtx)(function () {
                  return [(0,vue_esm_bundler.unref)(showAnswer) ? (0,vue_esm_bundler.withDirectives)(((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", WhatToKnowvue_type_script_setup_true_lang_js_hoisted_8, null, 512)), [[_directive_katex, (0,vue_esm_bundler.unref)(generatedQuestions)[(0,vue_esm_bundler.unref)(questionNo)].answer, void 0, {
                    left: true,
                    clear: true
                  }]]) : (0,vue_esm_bundler.createCommentVNode)("", true)];
                }),
                _: 1
              })])) : ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", WhatToKnowvue_type_script_setup_true_lang_js_hoisted_9, [WhatToKnowvue_type_script_setup_true_lang_js_hoisted_10, (0,vue_esm_bundler.createElementVNode)("button", {
                "class": "btn",
                onClick: _cache[0] || (_cache[0] = function ($event) {
                  return (0,vue_esm_bundler.isRef)(showFinished) ? showFinished.value = false : showFinished = false;
                })
              }, " Recommencer (aléatoire) ")]))];
            }),
            _: 1
          })]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_11, [(0,vue_esm_bundler.createElementVNode)("div", null, (0,vue_esm_bundler.toDisplayString)((0,vue_esm_bundler.unref)(questionNo) + 1) + " / " + (0,vue_esm_bundler.toDisplayString)((0,vue_esm_bundler.unref)(generatedQuestions).length), 1), (0,vue_esm_bundler.createElementVNode)("button", {
            "class": "btn py-0",
            disabled: (0,vue_esm_bundler.unref)(downloadGenerating),
            onClick: generatePDF
          }, (0,vue_esm_bundler.toDisplayString)((0,vue_esm_bundler.unref)(downloadGenerating) ? 'Patienter...' : 'Générer PDF'), 9, _hoisted_12)])];
        }),
        _: 1
      })], 64);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Ui/WhatToKnow.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Ui/WhatToKnow.vue



const WhatToKnow_exports_ = WhatToKnowvue_type_script_setup_true_lang_js;

/* harmony default export */ const WhatToKnow = (WhatToKnow_exports_);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/algebra/index.js
var algebra = __webpack_require__(873);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/coefficients/index.js
var coefficients = __webpack_require__(2482);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=script&setup=true&lang=js


var primitivesvue_type_script_setup_true_lang_js_hoisted_1 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Liste des calculs à savoir ");







/* harmony default export */ const primitivesvue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    /** Chapter
     * title: Primitive ou intégrale indéfinie
     * body: calcul de primitive
     */
    var root = (0,vue_esm_bundler.ref)(null);

    function formatQuestion(A, pow, k) {
      var F,
          B,
          D,
          question = '',
          answer = '';

      if (pow instanceof coefficients.Fraction) {
        var numerator = pow.numerator,
            denominator = pow.denominator,
            _D = A.clone().multiply(k).derivative(),
            primitivePow = pow.clone().add(1);

        F = new coefficients.Fraction(k).divide(primitivePow);
        question = (_D.monoms.length === 1 ? _D.tex : "\\left( ".concat(_D.tex, " \\right)")) + "\\sqrt".concat(denominator === 2 ? '' : '[' + denominator + ']', "{ ").concat(numerator > 1 ? '\\left(' + A.tex + '\\right)^' + numerator : A.tex, " }");
        answer = (F.isOne() ? '' : F.tex) + ' \\cdot ' + "\\sqrt".concat(primitivePow.denominator === 2 ? '' : '[' + primitivePow.denominator + ']', "{ ").concat(primitivePow.numerator > 1 ? '\\left(' + A.tex + '\\right)^' + primitivePow.numerator : A.tex, " }");
      } else if (pow === undefined || pow === 1) {
        question = A.tex;
        answer = A.primitive().tex;
      } else if (pow > 1) {
        B = new algebra.Polynom("x^(".concat(pow, ")"));
        D = A.clone().multiply(k).derivative();
        question = (D.monoms.length === 1 ? D.tex : "\\left( ".concat(D.tex, " \\right)")) + B.tex.replace('x', "\\left(".concat(A.tex, "\\right)"));
        answer = B.multiply(k).primitive().tex.replace('x', "(".concat(A.tex, ")"));
      } else if (pow < -1) {
        F = new coefficients.Fraction(k).divide(pow + 1);
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
        pow = random.Random.number(2, 6);
      } else if (model === 'rationals') {
        pow = -random.Random.number(2, 6);
      } else if (model === 'ln') {
        pow = -1;
      } else if (model === 'e') {
        pow = 0;
      } else if (model === 'roots') {
        pow = new coefficients.Fraction(random.Random.fraction({
          max: 3,
          zero: false,
          natural: false,
          negative: false
        }));

        if (pow.isOne()) {
          pow = new coefficients.Fraction('1/2');
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
          A: new random.Random.polynom({
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
          A: new random.Random.polynom({
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
          A: new random.Random.polynom({
            degree: random.Random.number(2, 9),
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

        D = new random.Random.polynom({
          degree: random.Random.number(2, 9),
          allowNullMonom: false,
          numberOfMonoms: 1,
          fraction: {
            max: 5,
            natural: false
          }
        }).reorder();

        while (D.monoms[0].coefficient.isNatural()) {
          D = new random.Random.polynom({
            degree: random.Random.number(2, 9),
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
          A: new random.Random.polynom({
            degree: random.Random.number(2, 5),
            allowNullMonom: false,
            numberOfMonoms: random.Random.number(2, 3),
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
            A: new random.Random.polynom({
              degree: random.Random.number(2, 5),
              allowNullMonom: false,
              numberOfMonoms: random.Random.number(2, 3),
              fraction: {
                natural: true,
                max: maxValue
              }
            }).reorder(),
            pow: generatePower(model),
            k: new coefficients.Fraction(1)
          }); // With a natural factor

          items.push({
            A: new random.Random.polynom({
              degree: random.Random.number(2, 5),
              numberOfMonoms: random.Random.number(2, 3),
              fraction: {
                natural: true,
                max: maxValue
              }
            }).reorder(),
            pow: generatePower(model),
            k: new coefficients.Fraction(random.Random.number(2, 5))
          }); // With a fraction factor - must create the polynom.

          n = random.Random.number(2, 5);
          D = new random.Random.polynom({
            degree: random.Random.number(1, 4),
            numberOfMonoms: random.Random.number(2, 3),
            fraction: {
              natural: true,
              max: maxValue
            }
          }).reorder().multiply(n).primitive();
          D.multiply(D.lcmDenominator());
          items.push({
            A: D,
            pow: generatePower(model),
            k: new coefficients.Fraction(1).divide(n)
          });
        }

        for (var _i2 = 0, _items = items; _i2 < _items.length; _i2++) {
          var i = _items[_i2];
          questions.push(formatQuestion(i.A, i.pow, i.k));
        }
      } else {
        questions.push(formatQuestion(new algebra.Polynom('7')));
        questions.push(formatQuestion(new algebra.Polynom('3x')));
        questions.push(formatQuestion(new algebra.Polynom('5x^3')));
        questions.push(formatQuestion(new algebra.Polynom('2/5x^2')));
        questions.push(formatQuestion(new algebra.Polynom('4x^2+3x+5')));
        questions.push(formatQuestion(new algebra.Polynom('x^2+3x'), 3, new coefficients.Fraction(1)));
        questions.push(formatQuestion(new algebra.Polynom('2x^3+5x'), 5, new coefficients.Fraction(2)));
        questions.push(formatQuestion(new algebra.Polynom('x^2+4x'), 3, new coefficients.Fraction('1/2')));
        questions.push(formatQuestion(new algebra.Polynom('3x^2+7x+9'), -3, new coefficients.Fraction('1')));
        questions.push(formatQuestion(new algebra.Polynom('x^3+9'), -4, new coefficients.Fraction(6)));
        questions.push(formatQuestion(new algebra.Polynom('3x^4+2x^2+1'), -2, new coefficients.Fraction('1/4')));
        questions.push(formatQuestion(new algebra.Polynom('3x^4+2x^2+1'), -1, new coefficients.Fraction(1)));
        questions.push(formatQuestion(new algebra.Polynom('x^3+2x^2'), -1, new coefficients.Fraction('6')));
        questions.push(formatQuestion(new algebra.Polynom('2x^3+x^2'), -1, new coefficients.Fraction('1/2')));
        questions.push(formatQuestion(new algebra.Polynom('x^2-5'), 0, new coefficients.Fraction(1)));
        questions.push(formatQuestion(new algebra.Polynom('x^3+4x'), 0, new coefficients.Fraction(2)));
        questions.push(formatQuestion(new algebra.Polynom('x^5+5x^3'), 0, new coefficients.Fraction('1/5')));
      }

      for (var _i3 = 0, _questions = questions; _i3 < _questions.length; _i3++) {
        var q = _questions[_i3];
        q.question = "\\int ".concat(q.question, " \\ \\text{d}{x}");
      }

      return questions;
    }

    (0,vue_esm_bundler.onMounted)(function () {
      katexAutoRender(root.value);
    });
    return function (_ctx, _cache) {
      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("section", {
        ref_key: "root",
        ref: root
      }, [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(WhatToKnow), {
        questions: generateQuestions
      }, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [primitivesvue_type_script_setup_true_lang_js_hoisted_1];
        }),
        _: 1
      }), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(PrimitiveSimple))], 512);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/algebre/primitives.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/algebre/primitives.vue



const primitives_exports_ = primitivesvue_type_script_setup_true_lang_js;

/* harmony default export */ const primitives = (primitives_exports_);

/***/ })

}]);