"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[952],{

/***/ 6952:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ division_euclidienne)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./resources/js/Components/Ui/Panel.vue + 2 modules
var Panel = __webpack_require__(816);
// EXTERNAL MODULE: ./resources/js/Components/Form/FormInput.vue + 2 modules
var FormInput = __webpack_require__(8633);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/algebra/index.js
var algebra = __webpack_require__(873);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Tools/division-euclidienne.vue?vue&type=script&setup=true&lang=js
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


var _hoisted_1 = {
  key: 0,
  "class": "mt-10 space-y-10"
};
var _hoisted_2 = {
  "class": "border-collapse"
};
var _hoisted_3 = {
  key: 1,
  "class": "text-red-700 text-sm"
};



 // TODO: Rework the euclidian division output as table - it's complicated :)
// TODO:  Make the display array of euclidian fraction as tex -> should be put in PiMath

/* harmony default export */ const division_euclidiennevue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    /** Tools
     * title: division de polynômes
     * body: division euclidienne avec des polynômes
     * parameters: numerator=Polynom, denominator=Polynom
     * tags: algebre,1M
     */
    var numerator = (0,vue_esm_bundler.ref)('3x^2+5x-4'),
        denominator = (0,vue_esm_bundler.ref)('x-5');

    function addStep(P, degree, withParenthesis) {
      withParenthesis = withParenthesis === undefined ? false : withParenthesis;
      var step = [],
          cntMonom = 0;

      for (var i = degree; i >= 0; i--) {
        var M = P.monomByDegree(i);

        if (M.isZero()) {
          step.push('');
        } else {
          if (i < degree && M.coefficient.isStrictlyPositive() && cntMonom > 0) {
            step.push('+' + M.tex);
          } else {
            step.push(M.tex);
          }

          cntMonom++;
        }
      }

      if (withParenthesis !== undefined) {
        if (withParenthesis) {
          var inside = false;

          for (var _i = 0; _i < step.length; _i++) {
            if (step[_i] !== '' && inside === false) {
              step.splice(_i, 0, '-\\big(');
              break;
            }
          }

          inside = false;

          for (var _i2 = step.length - 1; _i2 >= 0; _i2--) {
            if (step[_i2] !== '' && inside === false) {
              step.splice(_i2 + 1, 0, '\\big)');
              break;
            }
          }
        } else {
          step.unshift('');
          step.push('');
        }
      }

      return step;
    }

    var result = (0,vue_esm_bundler.computed)(function () {
      try {
        var N = new algebra.Polynom(numerator.value),
            D = new algebra.Polynom(denominator.value),
            euclidian = N.euclidian(D); // For the euclidian division display.

        var steps = [],
            degree = N.degree().value,
            crtPolynom = N.clone(),
            zeroPolynom = new algebra.Polynom().zero(),
            maxDegreeRight = Math.max(D.degree().value, euclidian.quotient.degree().value),
            underline = []; // Première ligne

        steps.push([_toConsumableArray(addStep(crtPolynom, degree, false)), _toConsumableArray(addStep(D, maxDegreeRight))]);

        var _iterator = _createForOfIteratorHelper(euclidian.quotient.monoms),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var m = _step.value;
            var DM = D.clone().multiply(m);
            steps.push([_toConsumableArray(addStep(DM, degree, true)), _toConsumableArray(addStep(steps.length === 1 ? euclidian.quotient : zeroPolynom, maxDegreeRight))]); // Create the underline.

            var start = void 0,
                stop = void 0;

            for (var i = 0; i < steps[steps.length - 1][0].length; i++) {
              if (steps[steps.length - 1][0][i] === '-\\big(') {
                start = +i + 1;
              } else if (steps[steps.length - 1][0][i] === '\\big)') {
                stop = +i - 1;
                break;
              }
            }

            underline.push({
              start: start,
              stop: stop
            });
            crtPolynom.subtract(DM);
            steps.push([_toConsumableArray(addStep(crtPolynom, degree, false)), _toConsumableArray(addStep(zeroPolynom, maxDegreeRight))]);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return {
          numerator: N,
          denominator: D,
          euclidian: euclidian,
          table: {
            steps: steps,
            underline: underline
          }
        };
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
            modelValue: (0,vue_esm_bundler.unref)(numerator),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
              return (0,vue_esm_bundler.isRef)(numerator) ? numerator.value = $event : numerator = $event;
            }),
            label: "numérateur",
            name: "numerator"
          }, null, 8, ["modelValue"]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(FormInput/* default */.Z), {
            modelValue: (0,vue_esm_bundler.unref)(denominator),
            "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
              return (0,vue_esm_bundler.isRef)(denominator) ? denominator.value = $event : denominator = $event;
            }),
            label: "dénominateur",
            name: "denominator"
          }, null, 8, ["modelValue"]), (0,vue_esm_bundler.unref)(result) ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_1, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, "\\frac{ ".concat((0,vue_esm_bundler.unref)(result).numerator.tex, " }{ ").concat((0,vue_esm_bundler.unref)(result).denominator.tex, " } = ").concat((0,vue_esm_bundler.unref)(result).euclidian.quotient.tex, " + \\frac{ ").concat((0,vue_esm_bundler.unref)(result).euclidian.reminder.tex, " }{ ").concat((0,vue_esm_bundler.unref)(result).denominator.tex, " }"), void 0, {
            display: true,
            left: true
          }]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, "".concat((0,vue_esm_bundler.unref)(result).numerator.tex, " = \\left(").concat((0,vue_esm_bundler.unref)(result).denominator.tex, "\\right) \\cdot \\left(").concat((0,vue_esm_bundler.unref)(result).euclidian.quotient.tex, "\\right) + \\left(").concat((0,vue_esm_bundler.unref)(result).euclidian.reminder.tex, "\\right)"), void 0, {
            display: true,
            left: true
          }]]), (0,vue_esm_bundler.createElementVNode)("table", _hoisted_2, [((0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)((0,vue_esm_bundler.unref)(result).table.steps, function (step, index) {
            return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("tr", {
              key: 'step' + index
            }, [((0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)(step[0], function (item, index2) {
              return (0,vue_esm_bundler.withDirectives)(((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("td", {
                key: 'stepItem' + index2,
                "class": (0,vue_esm_bundler.normalizeClass)(["w-[60px]", {
                  'katex-right': item.includes('\\big('),
                  'katex-left': !item.includes('\\big('),
                  'border-b border-black': index % 2 === 1 && index2 >= (0,vue_esm_bundler.unref)(result).table.underline[(index - 1) / 2].start && index2 <= (0,vue_esm_bundler.unref)(result).table.underline[(index - 1) / 2].stop
                }])
              }, null, 2)), [[_directive_katex, item, void 0, {
                display: true
              }]]);
            }), 128)), ((0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)(step[1], function (item, index2) {
              return (0,vue_esm_bundler.withDirectives)(((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("td", {
                key: 'stepItem' + index2,
                "class": (0,vue_esm_bundler.normalizeClass)(["w-[60px]", {
                  'border-l border-black': index2 === 0,
                  'border-b border-black': index === 0
                }])
              }, null, 2)), [[_directive_katex, item, void 0, {
                display: true,
                left: true
              }]]);
            }), 128))]);
          }), 128))])])) : ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_3, " Une erreur s'est produite avec vos données. "))];
        }),
        _: 1
      });
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Tools/division-euclidienne.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Tools/division-euclidienne.vue



const __exports__ = division_euclidiennevue_type_script_setup_true_lang_js;

/* harmony default export */ const division_euclidienne = (__exports__);

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