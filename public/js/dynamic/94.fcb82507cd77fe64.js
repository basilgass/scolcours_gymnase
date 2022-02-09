"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[94],{

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