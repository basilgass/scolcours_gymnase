"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[98,871],{

/***/ 4098:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ cercle)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./resources/js/Components/Challenges/ui/challengeTitle.vue + 2 modules
var challengeTitle = __webpack_require__(9871);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/algebra/index.js
var algebra = __webpack_require__(873);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/random/index.js
var random = __webpack_require__(4682);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/cercle.vue?vue&type=script&setup=true&lang=js

var _hoisted_1 = {
  "class": "grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5"
};
var _hoisted_2 = ["onClick"];
var _hoisted_3 = {
  "class": "space-y-2"
};
var _hoisted_4 = ["onClick"];




/* harmony default export */ const cerclevue_type_script_setup_true_lang_js = ({
  props: {
    modelValue: {
      type: Number,
      "default": 0
    }
  },
  emits: ['update:modelValue'],
  setup: function setup(__props, _ref) {
    var emit = _ref.emit;
    var modelProp = __props;
    var title = 'cercle';
    var answer = (0,vue_esm_bundler.ref)({
      x: null,
      y: null,
      r: null
    }),
        question = (0,vue_esm_bundler.ref)(newQuestion()),
        crtLetter = (0,vue_esm_bundler.ref)('x');
    var displayAnswer = (0,vue_esm_bundler.computed)(function () {
      var tex = '';

      if (answer.value.x !== null) {
        if (+answer.value.x === 0) {
          tex += 'x^2';
        } else {
          tex += "(x".concat(answer.value.x < 0 ? '+' : '').concat(-answer.value.x, ")^2");
        }
      }

      tex += '+';

      if (answer.value.y != null) {
        if (+answer.value.y === 0) {
          tex += 'y^2';
        } else {
          tex += "(y".concat(answer.value.y < 0 ? '+' : '').concat(-answer.value.y, ")^2");
        }
      }

      tex += '=';

      if (answer.value.r !== null) {
        tex += answer.value.r;
      }

      return tex;
    });
    var displayQuestion = (0,vue_esm_bundler.computed)(function () {
      return question.value.tex;
    });

    function newQuestion() {
      var ca = random.Random.numberSym(10, true),
          cb = random.Random.numberSym(10, true),
          r = random.Random.number(1, 10);
      var Px = new algebra.Polynom("x".concat(ca <= 0 ? '+' : '').concat(-ca)).pow(2),
          Py = new algebra.Polynom("y".concat(cb <= 0 ? '+' : '').concat(-cb)).pow(2);
      return {
        ca: ca,
        cb: cb,
        r: r,
        tex: Px.clone().add(Py).add(new algebra.Polynom("".concat(-r))).reorder('y').reorder('x').tex + '=0'
      };
    }

    function resetAsnwer() {
      answer.value.x = null;
      answer.value.y = null;
      answer.value.r = null;
      crtLetter.value = 'x';
    }

    function updateAnswer(value) {
      answer.value[crtLetter.value] = value;

      if (crtLetter.value === 'x') {
        crtLetter.value = 'y';
      } else if (crtLetter.value === 'y') {
        crtLetter.value = 'r';
      } else {
        crtLetter.value = 'x';
      }
    }

    function checkAnswer() {
      return question.value.ca === answer.value.x && question.value.cb === answer.value.y && question.value.r === answer.value.r;
    } // Shared data for all challenges components.


    function validateAnswer() {
      if (checkAnswer()) {
        resetAsnwer();
        question.value = newQuestion();
        emit('update:modelValue', modelProp.modelValue + 1);
      } else {
        emit('update:modelValue', 0);
      }
    }

    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("article", null, [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(challengeTitle["default"]), {
        title: title
      }), (0,vue_esm_bundler.createElementVNode)("div", null, "score actuel: " + (0,vue_esm_bundler.toDisplayString)(modelProp.modelValue), 1), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(displayQuestion)]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(displayAnswer)]]), (0,vue_esm_bundler.createElementVNode)("div", {
        "class": "text-center"
      }, [(0,vue_esm_bundler.createElementVNode)("button", {
        "class": "btn btn-success",
        onClick: validateAnswer
      }, " Valider ")]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_1, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", {
        "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2 col-span-2",
        onClick: _cache[0] || (_cache[0] = function ($event) {
          return updateAnswer(0);
        })
      }, null, 512), [[vue_esm_bundler.vShow, (0,vue_esm_bundler.unref)(crtLetter) !== 'r'], [_directive_katex, "".concat((0,vue_esm_bundler.unref)(crtLetter), "^2"), void 0, {
        inline: true
      }]]), (0,vue_esm_bundler.createElementVNode)("div", {
        "class": (0,vue_esm_bundler.normalizeClass)(["space-y-2", {
          'col-span-2': (0,vue_esm_bundler.unref)(crtLetter) === 'r'
        }])
      }, [((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)(10, function (n) {
        return (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", {
          key: "terme-".concat(n),
          "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
          onClick: function onClick($event) {
            return updateAnswer(n);
          }
        }, null, 8, _hoisted_2), [[_directive_katex, (0,vue_esm_bundler.unref)(crtLetter) === 'r' ? "".concat(n) : "(".concat((0,vue_esm_bundler.unref)(crtLetter), "-").concat(n, ")^2"), void 0, {
          inline: true
        }]]);
      }), 64))], 2), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", _hoisted_3, [((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)(10, function (n) {
        return (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", {
          key: "terme--".concat(n),
          "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
          onClick: function onClick($event) {
            return updateAnswer(-n);
          }
        }, null, 8, _hoisted_4), [[_directive_katex, (0,vue_esm_bundler.unref)(crtLetter) === 'r' ? "".concat(n) : "(".concat((0,vue_esm_bundler.unref)(crtLetter), "+").concat(n, ")^2"), void 0, {
          inline: true
        }]]);
      }), 64))], 512), [[vue_esm_bundler.vShow, (0,vue_esm_bundler.unref)(crtLetter) !== 'r']])])]);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/cercle.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/cercle.vue



const __exports__ = cerclevue_type_script_setup_true_lang_js;

/* harmony default export */ const cercle = (__exports__);

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

/***/ })

}]);