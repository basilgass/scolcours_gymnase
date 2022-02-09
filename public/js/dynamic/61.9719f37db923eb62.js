"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[61,871],{

/***/ 7061:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ quadratiques_forme_du_sommet)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/algebra/index.js
var algebra = __webpack_require__(873);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/random/index.js
var random = __webpack_require__(4682);
// EXTERNAL MODULE: ./resources/js/Components/Challenges/ui/challengeTitle.vue + 2 modules
var challengeTitle = __webpack_require__(9871);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js

var _hoisted_1 = {
  "class": "grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5"
};
var _hoisted_2 = {
  "class": "space-y-2"
};
var _hoisted_3 = ["onClick"];
var _hoisted_4 = {
  "class": "space-y-2"
};
var _hoisted_5 = ["onClick"];



 // Valeur nécessaire pour nommer la fonction

/* harmony default export */ const quadratiques_forme_du_sommetvue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    var title = 'quadratique - la forme du sommet'; // Le programme...

    var answer = (0,vue_esm_bundler.ref)({
      a: 'a',
      b: '-\\alpha',
      c: '+\\beta'
    }),
        currentGivenAnswer = (0,vue_esm_bundler.ref)('a'),
        points = (0,vue_esm_bundler.ref)(0),
        level = (0,vue_esm_bundler.ref)(5),
        poly = (0,vue_esm_bundler.ref)(newQuestion());
    var displayAnswer = (0,vue_esm_bundler.computed)(function () {
      var texA, texB, texC;

      if (answer.value.a === '+1') {
        texA = '';
      } else if (answer.value.a === '-1') {
        texA = '-';
      } else {
        texA = isNaN(answer.value.a) ? answer.value.a : +answer.value.a;
      }

      texA = currentGivenAnswer.value === 'a' ? "\\colorbox{Lime}{$ ".concat(texA, " $}") : texA;
      texB = currentGivenAnswer.value === 'b' ? "\\colorbox{Lime}{$".concat(answer.value.b, "$}") : answer.value.b;
      texC = currentGivenAnswer.value === 'c' ? "\\colorbox{Lime}{$".concat(answer.value.c, "$}") : answer.value.c;
      return "".concat(texA, "(x").concat(texB, ")^2").concat(texC);
    });

    function newQuestion() {
      resetAnswer();
      var ra = points.value >= level.value ? random.Random.numberSym(6, false) : 1,
          rb = random.Random.numberSym(6, false),
          rc = random.Random.numberSym(10, false);
      return new algebra.Polynom('x', ra, 2 * rb * ra, rb * rb * ra + rc);
    }

    function resetAnswer() {
      answer.value = {
        a: 'a',
        b: '-\\alpha',
        c: '+\\beta'
      };
      currentGivenAnswer.value = 'a';

      if (points.value < level.value) {
        answer.value.a = '+1';
        currentGivenAnswer.value = 'b';
      }
    }

    function updateAnswer(value) {
      answer.value[currentGivenAnswer.value] = value;

      if (currentGivenAnswer.value === undefined) {
        resetAnswer(); // updateAnswer(value)
      } else {
        currentGivenAnswer.value = ['a', 'b', 'c'][(['a', 'b', 'c'].indexOf(currentGivenAnswer.value) + 1) % 3];

        if (points.value < level.value && currentGivenAnswer.value === 'a') {
          currentGivenAnswer.value = 'b';
        }
      }
    }

    function validateAnswer() {
      var ra = +answer.value.a,
          rb = +answer.value.b,
          rc = +answer.value.c;
      var P = new algebra.Polynom('x', ra, 2 * rb * ra, rb * rb * ra + rc);

      if (P.isEqual(poly.value)) {
        points.value++;
        answer.value = {
          a: '',
          b: '',
          c: ''
        };
        currentGivenAnswer.value = 'a'; // Generate new polynom

        poly.value = newQuestion();
      } else {
        points.value = 0;
      }
    }

    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("article", null, [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(challengeTitle["default"]), {
        title: title
      }), (0,vue_esm_bundler.createElementVNode)("div", null, "score actuel: " + (0,vue_esm_bundler.toDisplayString)((0,vue_esm_bundler.unref)(points)), 1), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(poly).tex]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(displayAnswer)]]), (0,vue_esm_bundler.createElementVNode)("div", {
        "class": "grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5"
      }, [(0,vue_esm_bundler.createElementVNode)("button", {
        "class": "btn btn-primary",
        onClick: resetAnswer
      }, " recommencer "), (0,vue_esm_bundler.createElementVNode)("button", {
        "class": "btn btn-success",
        onClick: validateAnswer
      }, " valider ")]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_1, [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_2, [((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)(10, function (n) {
        return (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", {
          key: "terme-".concat(n),
          "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
          onClick: function onClick($event) {
            return updateAnswer("-".concat(n));
          }
        }, null, 8, _hoisted_3), [[_directive_katex, "-".concat(n), void 0, {
          inline: true
        }]]);
      }), 64))]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_4, [((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)(10, function (n) {
        return (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", {
          key: "terme--".concat(n),
          "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
          onClick: function onClick($event) {
            return updateAnswer("+".concat(n));
          }
        }, null, 8, _hoisted_5), [[_directive_katex, "+".concat(n), void 0, {
          inline: true
        }]]);
      }), 64))])])]);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue



const __exports__ = quadratiques_forme_du_sommetvue_type_script_setup_true_lang_js;

/* harmony default export */ const quadratiques_forme_du_sommet = (__exports__);

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