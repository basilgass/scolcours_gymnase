"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[20],{

/***/ 4020:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ quadratique)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./resources/js/Components/Ui/Panel.vue + 2 modules
var Panel = __webpack_require__(816);
// EXTERNAL MODULE: ./resources/js/Components/Form/FormInput.vue + 2 modules
var FormInput = __webpack_require__(8633);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/geometry/index.js
var geometry = __webpack_require__(6425);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/algebra/equation.js
var equation = __webpack_require__(9925);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/algebra/polynom.js
var polynom = __webpack_require__(4941);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Tools/quadratique.vue?vue&type=script&setup=true&lang=js

var _hoisted_1 = {
  key: 0
};
var _hoisted_2 = {
  key: 1,
  "class": "text-red-700 text-sm"
};






/* harmony default export */ const quadratiquevue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    /** Tools
     * title: quadratique
     * body: calcul d'une fonction quadratique
     * parameters: a=Point, b=Point, c=Point (optionnel)
     * tags: algebre,1M
     */
    var A = (0,vue_esm_bundler.ref)('1,4'),
        B = (0,vue_esm_bundler.ref)('2,3'),
        C = (0,vue_esm_bundler.ref)('5,8');
    var result = (0,vue_esm_bundler.computed)(function () {
      try {
        var P = new equation.Equation('y = a*x^2+b*x+c'),
            pA = new geometry.Point(A.value),
            pB = new geometry.Point(B.value),
            pC = new geometry.Point(C.value); // TODO: améliorer le calcul et inclure dans PI
        // y=ax^2+bx+c

        var Pc = P.clone().replaceBy('x', new polynom.Polynom(pA.x.display)).replaceBy('y', new polynom.Polynom(pA.y.display)).isolate('c'),
            Pb = P.clone().replaceBy('x', new polynom.Polynom(pB.x.display)).replaceBy('y', new polynom.Polynom(pB.y.display)).replaceBy('c', Pc.right).isolate('b'),
            Pa;

        if (C.value !== '') {
          Pa = P.clone().replaceBy('x', new polynom.Polynom(pC.x.display)).replaceBy('y', new polynom.Polynom(pC.y.display)).replaceBy('c', Pc.right).replaceBy('b', Pb.right).isolate('a');
        } else {
          // Le point B est un sommet !
          // x = -b/2a => b = -2ax
          Pa = new equation.Equation('b = -2a*x').replaceBy('x', new polynom.Polynom(pC.x.display));
          Pa.left = Pb.right.clone();
          Pa.isolate('a');
        }

        Pb = Pb.replaceBy('a', Pa.right);
        Pc = Pc.replaceBy('b', Pb.right).replaceBy('a', Pa.right);
        return P.clone().replaceBy('a', Pa.right).replaceBy('b', Pb.right).replaceBy('c', Pc.right);
      } catch (e) {
        console.error(e);
        return false;
      }
    });
    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createBlock)((0,vue_esm_bundler.unref)(Panel/* default */.Z), null, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(FormInput/* default */.Z), {
            modelValue: (0,vue_esm_bundler.unref)(A),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
              return (0,vue_esm_bundler.isRef)(A) ? A.value = $event : A = $event;
            }),
            label: "Coordonnées du point A",
            name: "fonction"
          }, null, 8, ["modelValue"]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(FormInput/* default */.Z), {
            modelValue: (0,vue_esm_bundler.unref)(B),
            "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
              return (0,vue_esm_bundler.isRef)(B) ? B.value = $event : B = $event;
            }),
            label: (0,vue_esm_bundler.unref)(C) === '' ? 'Coordonnées du sommet S' : 'Coordonnées du point B',
            name: "fonction"
          }, null, 8, ["modelValue", "label"]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(FormInput/* default */.Z), {
            modelValue: (0,vue_esm_bundler.unref)(C),
            "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
              return (0,vue_esm_bundler.isRef)(C) ? C.value = $event : C = $event;
            }),
            label: "Coordonnées du point C",
            name: "fonction"
          }, null, 8, ["modelValue"]), (0,vue_esm_bundler.unref)(result) ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_1, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, "".concat((0,vue_esm_bundler.unref)(result).tex)]])])) : ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_2, " Une erreur s'est produite avec vos données. "))];
        }),
        _: 1
      });
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Tools/quadratique.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Tools/quadratique.vue



const __exports__ = quadratiquevue_type_script_setup_true_lang_js;

/* harmony default export */ const quadratique = (__exports__);

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