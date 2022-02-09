"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[452],{

/***/ 2452:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ affine)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./resources/js/Components/Ui/Panel.vue + 2 modules
var Panel = __webpack_require__(816);
// EXTERNAL MODULE: ./resources/js/Components/Form/FormInput.vue + 2 modules
var FormInput = __webpack_require__(8633);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/geometry/line.js
var line = __webpack_require__(2832);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/geometry/point.js
var point = __webpack_require__(9905);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/geometry/vector.js
var vector = __webpack_require__(8320);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Tools/affine.vue?vue&type=script&setup=true&lang=js


var _hoisted_1 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Utiliser ");

var _hoisted_2 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("code", {
  "class": "px-2 bg-gray-200"
}, "a,b", -1);

var _hoisted_3 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" pour les coordonnées d'un point ");

var _hoisted_4 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Utiliser ");

var _hoisted_5 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("code", {
  "class": "px-2 bg-gray-200"
}, "a,b", -1);

var _hoisted_6 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" pour les coordonnées d'un point ou ");

var _hoisted_7 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("code", {
  "class": "px-2 bg-gray-200"
}, "va,b", -1);

var _hoisted_8 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" pour un vecteur directeur ");

var _hoisted_9 = {
  key: 0
};
var _hoisted_10 = {
  key: 1,
  "class": "text-red-700 text-sm"
};






/* harmony default export */ const affinevue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    /** Tools
     * title: affine
     * body: calcul d'une fonction affine par deux points
     * parameters: a=Point, b=Point
     * tags: algebre,1M
     */
    var A = (0,vue_esm_bundler.ref)('3,4'),
        B = (0,vue_esm_bundler.ref)('1,2');
    var affine = (0,vue_esm_bundler.computed)(function () {
      try {
        return new line.Line(new point.Point(A.value), B.value[0] === 'v' ? new vector.Vector(B.value.substring(1)) : new point.Point(B.value));
      } catch (e) {
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
            label: "Point A",
            name: "A"
          }, {
            "default": (0,vue_esm_bundler.withCtx)(function () {
              return [_hoisted_1, _hoisted_2, _hoisted_3];
            }),
            _: 1
          }, 8, ["modelValue"]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(FormInput/* default */.Z), {
            modelValue: (0,vue_esm_bundler.unref)(B),
            "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
              return (0,vue_esm_bundler.isRef)(B) ? B.value = $event : B = $event;
            }),
            label: (0,vue_esm_bundler.unref)(B)[0] === 'v' ? 'Vecteur directeur' : 'Point B',
            name: "B"
          }, {
            "default": (0,vue_esm_bundler.withCtx)(function () {
              return [_hoisted_4, _hoisted_5, _hoisted_6, _hoisted_7, _hoisted_8];
            }),
            _: 1
          }, 8, ["modelValue", "label"]), (0,vue_esm_bundler.unref)(affine) ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_9, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, "".concat((0,vue_esm_bundler.unref)(affine).tex.mxh)]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, "".concat((0,vue_esm_bundler.unref)(affine).tex.canonical)]])])) : ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_10, " Une erreur s'est produite lors de l'introduction des coordonnées. "))];
        }),
        _: 1
      });
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Tools/affine.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Tools/affine.vue



const __exports__ = affinevue_type_script_setup_true_lang_js;

/* harmony default export */ const affine = (__exports__);

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