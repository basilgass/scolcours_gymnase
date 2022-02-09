"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[686,871],{

/***/ 4686:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ produits_remarquables)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/algebra/index.js
var algebra = __webpack_require__(873);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/random/index.js
var random = __webpack_require__(4682);
// EXTERNAL MODULE: ./resources/js/Components/Challenges/ui/challengeTitle.vue + 2 modules
var challengeTitle = __webpack_require__(9871);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=script&setup=true&lang=js

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




/* harmony default export */ const produits_remarquablesvue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    var title = 'produits remarquables du 2ème degré';
    var answer = (0,vue_esm_bundler.ref)([]),
        points = (0,vue_esm_bundler.ref)(0),
        poly = (0,vue_esm_bundler.ref)(newQuestion());
    var factorisation = (0,vue_esm_bundler.computed)(function () {
      if (answer.value.length === 0) {
        return '?';
      }

      return answer.value.map(function (x) {
        return "(".concat(x, ")");
      }).join('');
    });

    function newQuestion() {
      var P = random.Random.polynom({
        letters: 'x',
        degree: 1,
        unit: true,
        allowNullMonom: false
      });

      if (random.Random.bool(0.40)) {
        var Q = P.clone();
        Q.monoms[1].opposed();
        return P.clone().multiply(Q);
      } else {
        return P.pow(2);
      }
    }

    function updateAnswer(value) {
      answer.value.push(value);

      if (answer.value.length > 2) {
        answer.value.shift();
      }
    }

    function validateAnswer() {
      if (answer.value.length !== 2) {
        return false;
      }

      var P = new algebra.Polynom(answer.value.map(function (x) {
        return "(".concat(x, ")");
      }).join(''));

      if (P.isEqual(poly.value)) {
        points.value++;
        answer.value = []; // Generate new polynom

        poly.value = newQuestion();
      } else {
        points.value = 0;
      }
    }

    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("article", null, [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(challengeTitle["default"]), {
        title: title
      }), (0,vue_esm_bundler.createElementVNode)("div", null, "score actuel: " + (0,vue_esm_bundler.toDisplayString)((0,vue_esm_bundler.unref)(points)), 1), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(poly).tex]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(factorisation)]]), (0,vue_esm_bundler.createElementVNode)("div", {
        "class": "text-center"
      }, [(0,vue_esm_bundler.createElementVNode)("button", {
        "class": "btn btn-success",
        onClick: validateAnswer
      }, " Valider ")]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_1, [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_2, [((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)(10, function (n) {
        return (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", {
          key: "terme-".concat(n),
          "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
          onClick: function onClick($event) {
            return updateAnswer("x-".concat(n));
          }
        }, null, 8, _hoisted_3), [[_directive_katex, "x-".concat(n), void 0, {
          inline: true
        }]]);
      }), 64))]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_4, [((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)(10, function (n) {
        return (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", {
          key: "terme--".concat(n),
          "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
          onClick: function onClick($event) {
            return updateAnswer("x+".concat(n));
          }
        }, null, 8, _hoisted_5), [[_directive_katex, "x+".concat(n), void 0, {
          inline: true
        }]]);
      }), 64))])])]);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/produits-remarquables.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Challenges/produits-remarquables.vue



const __exports__ = produits_remarquablesvue_type_script_setup_true_lang_js;

/* harmony default export */ const produits_remarquables = (__exports__);

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