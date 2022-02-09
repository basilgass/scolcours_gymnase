"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[426],{

/***/ 3426:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ integrale)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./resources/js/Components/Ui/Panel.vue + 2 modules
var Panel = __webpack_require__(816);
// EXTERNAL MODULE: ./resources/js/Components/Form/FormInput.vue + 2 modules
var FormInput = __webpack_require__(8633);
// EXTERNAL MODULE: ./resources/js/Components/Form/FormField.vue + 2 modules
var FormField = __webpack_require__(464);
// EXTERNAL MODULE: ./resources/js/Components/Form/FormLabel.vue + 2 modules
var FormLabel = __webpack_require__(6955);
// EXTERNAL MODULE: ./resources/js/Components/Form/FormError.vue + 2 modules
var FormError = __webpack_require__(159);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Form/FormNumber.vue?vue&type=script&setup=true&lang=js

var _hoisted_1 = ["id", "name", "value"];



/* harmony default export */ const FormNumbervue_type_script_setup_true_lang_js = ({
  props: {
    modelValue: {
      type: Number,
      "default": null
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      "default": ""
    },
    error: {
      type: String,
      "default": ""
    }
  },
  emits: ["update:modelValue"],
  setup: function setup(__props) {
    return function (_ctx, _cache) {
      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createBlock)((0,vue_esm_bundler.unref)(FormField/* default */.Z), null, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(FormLabel/* default */.Z), {
            label: __props.label,
            name: __props.name
          }, null, 8, ["label", "name"]), (0,vue_esm_bundler.createElementVNode)("input", {
            id: __props.name,
            name: __props.name,
            type: "number",
            "class": "border border-gray-200 p-2 w-full rounded",
            value: __props.modelValue,
            onInput: _cache[0] || (_cache[0] = function ($event) {
              return _ctx.$emit('update:modelValue', $event.target.value);
            })
          }, null, 40, _hoisted_1), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(FormError/* default */.Z), {
            name: __props.name,
            message: __props.error
          }, null, 8, ["name", "message"])];
        }),
        _: 1
      });
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Form/FormNumber.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Form/FormNumber.vue



const __exports__ = FormNumbervue_type_script_setup_true_lang_js;

/* harmony default export */ const FormNumber = (__exports__);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/algebra/polynom.js
var polynom = __webpack_require__(4941);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Tools/integrale.vue?vue&type=script&setup=true&lang=js

var integralevue_type_script_setup_true_lang_js_hoisted_1 = {
  key: 0
};
var _hoisted_2 = ["textContent"];
var _hoisted_3 = {
  key: 1,
  "class": "text-red-700 text-sm"
};





/* harmony default export */ const integralevue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    /** Tools
     * title: intégrale entre deux bornes
     * body: calcul d'intégrale entre deux bornes
     * parameters: fx=Polynom, a=Fraction, b=Fraction
     * tags: algebre,3M
     */
    var fx = (0,vue_esm_bundler.ref)(''),
        a = (0,vue_esm_bundler.ref)(0),
        b = (0,vue_esm_bundler.ref)(5);
    var result = (0,vue_esm_bundler.computed)(function () {
      try {
        if (fx.value === '') {
          return '\\text{Aucune fonction...}';
        }

        var P = new polynom.Polynom(fx.value).primitive(),
            Pa = P.evaluate({
          x: a.value
        }),
            Pb = P.evaluate({
          x: b.value
        });
        return "\\int_{".concat(a.value, "}^{").concat(b.value, "} ").concat(fx.value, " \\ dx\n\t\t= \\left. ").concat(P.tex, "\\right\\vert_{").concat(a.value, "}^{").concat(b.value, "}\n\t\t= ").concat(Pb.frac, " - ").concat(Pa.tex, " = ").concat(Pb.subtract(Pa).tex);
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
            modelValue: (0,vue_esm_bundler.unref)(fx),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
              return (0,vue_esm_bundler.isRef)(fx) ? fx.value = $event : fx = $event;
            }),
            label: "fonction",
            name: "fonction"
          }, null, 8, ["modelValue"]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(FormNumber), {
            modelValue: (0,vue_esm_bundler.unref)(a),
            "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
              return (0,vue_esm_bundler.isRef)(a) ? a.value = $event : a = $event;
            }),
            modelModifiers: {
              number: true
            },
            label: "borne inférieure",
            name: "a"
          }, null, 8, ["modelValue"]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(FormNumber), {
            modelValue: (0,vue_esm_bundler.unref)(b),
            "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
              return (0,vue_esm_bundler.isRef)(b) ? b.value = $event : b = $event;
            }),
            modelModifiers: {
              number: true
            },
            label: "borne supérieure",
            name: "b"
          }, null, 8, ["modelValue"]), (0,vue_esm_bundler.unref)(result) ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", integralevue_type_script_setup_true_lang_js_hoisted_1, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(result)]]), (0,vue_esm_bundler.createElementVNode)("p", {
            "class": "text-center text-sm font-extralight text-gray-400",
            textContent: (0,vue_esm_bundler.toDisplayString)((0,vue_esm_bundler.unref)(result))
          }, null, 8, _hoisted_2)])) : ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_3, " Une erreur s'est produite avec vos données. "))];
        }),
        _: 1
      });
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Tools/integrale.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Tools/integrale.vue



const integrale_exports_ = integralevue_type_script_setup_true_lang_js;

/* harmony default export */ const integrale = (integrale_exports_);

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