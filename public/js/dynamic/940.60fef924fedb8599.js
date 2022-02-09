"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[940],{

/***/ 9940:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ evaluer_fonction)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./resources/js/Components/Ui/Panel.vue + 2 modules
var Panel = __webpack_require__(816);
// EXTERNAL MODULE: ./resources/js/Components/Form/FormInput.vue + 2 modules
var FormInput = __webpack_require__(8633);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/coefficients/index.js
var coefficients = __webpack_require__(2482);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/algebra/index.js
var algebra = __webpack_require__(873);
// EXTERNAL MODULE: ./resources/js/Components/Ui/Keyboard.vue + 3 modules
var Keyboard = __webpack_require__(3163);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Tools/evaluer-fonction.vue?vue&type=script&setup=true&lang=js


var _hoisted_1 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Utiliser un nombre ou une fraction ");

var _hoisted_2 = {
  "class": "h-24 flex items-center justify-center"
};
var _hoisted_3 = {
  key: 0
};
var _hoisted_4 = {
  key: 1,
  "class": "text-red-700 text-sm bg-red-100 w-full py-5 text-center"
};
var _hoisted_5 = {
  "class": "mt-2"
};






/* harmony default export */ const evaluer_fonctionvue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    /** Tools
     * title: évaluation d'une fonction polynomiale
     * body: évaluation d'une fonction polynomiale
     * parameters: fx=Fonction (texte), b=Nombre ou Fraction
     * tags: algebre,1M
     */
    var f = (0,vue_esm_bundler.ref)('3*x+1'),
        x = (0,vue_esm_bundler.ref)('1'),
        activeInput = (0,vue_esm_bundler.ref)('fx');
    var fx = (0,vue_esm_bundler.computed)(function () {
      try {
        var FX = new algebra.Polynom(f.value),
            data = {
          x: '',
          fx: '',
          value: null
        };

        if (x.value === '') {
          data.x = 'x';
          data.fx = FX.tex;
          data.value = null;
        } else {
          var fB = new coefficients.Fraction(x.value);
          data.x = fB.tex;
          data.fx = FX.tex.replace(/x/g, "\\left(".concat(x.value, "\\right)"));
          data.value = FX.evaluate(fB).tex;
        }

        return data;
      } catch (e) {
        return false;
      }
    });
    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createBlock)((0,vue_esm_bundler.unref)(Panel/* default */.Z), null, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(FormInput/* default */.Z), {
            modelValue: (0,vue_esm_bundler.unref)(f),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
              return (0,vue_esm_bundler.isRef)(f) ? f.value = $event : f = $event;
            }),
            active: (0,vue_esm_bundler.unref)(activeInput) === 'fx',
            label: "fonction",
            name: "f",
            onInputFocus: _cache[1] || (_cache[1] = function ($event) {
              return (0,vue_esm_bundler.isRef)(activeInput) ? activeInput.value = 'fx' : activeInput = 'fx';
            })
          }, null, 8, ["modelValue", "active"]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(FormInput/* default */.Z), {
            modelValue: (0,vue_esm_bundler.unref)(x),
            "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
              return (0,vue_esm_bundler.isRef)(x) ? x.value = $event : x = $event;
            }),
            active: (0,vue_esm_bundler.unref)(activeInput) === 'x',
            label: "valeur",
            name: "x",
            onInputFocus: _cache[3] || (_cache[3] = function ($event) {
              return (0,vue_esm_bundler.isRef)(activeInput) ? activeInput.value = 'x' : activeInput = 'x';
            })
          }, {
            "default": (0,vue_esm_bundler.withCtx)(function () {
              return [_hoisted_1];
            }),
            _: 1
          }, 8, ["modelValue", "active"]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_2, [(0,vue_esm_bundler.unref)(fx) ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_3, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, "f\\left(".concat((0,vue_esm_bundler.unref)(fx).x, "\\right) = ").concat((0,vue_esm_bundler.unref)(fx).fx, " ").concat((0,vue_esm_bundler.unref)(fx).value ? '=' + (0,vue_esm_bundler.unref)(fx).value : '')]])])) : ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_4, " Une erreur s'est produite lors de l'introduction des coordonnées. "))]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_5, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(Keyboard/* default */.Z), {
            modelValue: (0,vue_esm_bundler.unref)(f),
            "onUpdate:modelValue": _cache[4] || (_cache[4] = function ($event) {
              return (0,vue_esm_bundler.isRef)(f) ? f.value = $event : f = $event;
            }),
            back: "",
            reset: "",
            next: "",
            keyboard: "polynom",
            onNext: _cache[5] || (_cache[5] = function ($event) {
              return (0,vue_esm_bundler.isRef)(activeInput) ? activeInput.value = 'x' : activeInput = 'x';
            })
          }, null, 8, ["modelValue"]), [[vue_esm_bundler.vShow, (0,vue_esm_bundler.unref)(activeInput) === 'fx']]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(Keyboard/* default */.Z), {
            modelValue: (0,vue_esm_bundler.unref)(x),
            "onUpdate:modelValue": _cache[6] || (_cache[6] = function ($event) {
              return (0,vue_esm_bundler.isRef)(x) ? x.value = $event : x = $event;
            }),
            back: "",
            reset: "",
            next: "",
            keyboard: "fraction",
            onNext: _cache[7] || (_cache[7] = function ($event) {
              return (0,vue_esm_bundler.isRef)(activeInput) ? activeInput.value = 'fx' : activeInput = 'fx';
            })
          }, null, 8, ["modelValue"]), [[vue_esm_bundler.vShow, (0,vue_esm_bundler.unref)(activeInput) === 'x']])])];
        }),
        _: 1
      });
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Tools/evaluer-fonction.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Tools/evaluer-fonction.vue



const __exports__ = evaluer_fonctionvue_type_script_setup_true_lang_js;

/* harmony default export */ const evaluer_fonction = (__exports__);

/***/ }),

/***/ 3163:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ Keyboard)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
;// CONCATENATED MODULE: ./resources/js/keyboards.js
var keyboardKeys = {
  '0': {
    type: 'math',
    display: '0'
  },
  '1': {
    type: 'math',
    display: '1'
  },
  '2': {
    type: 'math',
    display: '2'
  },
  '3': {
    type: 'math',
    display: '3'
  },
  '4': {
    type: 'math',
    display: '4'
  },
  '5': {
    type: 'math',
    display: '5'
  },
  '6': {
    type: 'math',
    display: '6'
  },
  '7': {
    type: 'math',
    display: '7'
  },
  '8': {
    type: 'math',
    display: '8'
  },
  '9': {
    type: 'math',
    display: '9'
  },
  '+': {
    type: 'math',
    display: '+'
  },
  '-': {
    type: 'math',
    display: '-'
  },
  '*': {
    type: 'math',
    display: '\\times'
  },
  '/': {
    type: 'math',
    display: '\\div'
  },
  'x': {
    type: 'math',
    display: 'x'
  },
  'x^2': {
    type: 'math',
    display: 'x^2'
  },
  'x^3': {
    type: 'math',
    display: 'x^3'
  },
  'x^4': {
    type: 'math',
    display: 'x^4'
  },
  'x^5': {
    type: 'math',
    display: 'x^5'
  },
  'x^6': {
    type: 'math',
    display: 'x^6'
  },
  '^2': {
    type: 'math',
    display: '\\textcolor{lightgray}{x}^2'
  },
  '^': {
    type: 'math',
    display: 'x^y'
  },
  'sqrt': {
    type: 'math',
    display: '\\sqrt{\\phantom{x}}'
  },
  '|': {
    type: 'math',
    display: '\\big\\vert \\textcolor{lightgray}{x} \\big\\vert'
  },
  'y': {
    type: 'math',
    display: 'y'
  },
  'e': {
    type: 'math',
    display: '\\text{e}'
  },
  'ln': {
    type: 'math',
    display: '\\ln'
  },
  '(': {
    type: 'math',
    display: '('
  },
  ')': {
    type: 'math',
    display: ')'
  },
  ' ': {
    type: 'math',
    display: '\\cdot'
  },
  '.': {
    type: 'math',
    display: '.'
  },
  '@reset': {
    type: 'icon',
    display: 'bi bi-trash'
  },
  '@back': {
    type: 'icon',
    display: 'bi bi-backspace'
  }
};
var keyboards = {
  'number': {
    grid: 'grid-cols-3',
    layout: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '-']
  },
  'fraction': {
    grid: 'grid-cols-3',
    layout: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '/', '0', '-']
  },
  'simple': {
    grid: 'grid-cols-4',
    layout: ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', '@back', ['0', 2], '/']
  },
  'algebra': {
    grid: 'grid-cols-7',
    layout: ['1', '2', '3', '+', 'x', 'y', 'e', '4', '5', '6', '-', '^2', '^', 'ln', '7', '8', '9', '*', '|', 'sqrt', '', '@reset', '@back', '0', '/', '(', ')', '']
  },
  'polynom': {
    grid: 'grid-cols-6',
    layout: ['1', '2', '3', '+', 'x', 'x^2', '4', '5', '6', '-', 'x^3', 'x^4', '7', '8', '9', '*', 'x^5', 'x^6', '(', ')', '0', '/', ['^', 2]]
  }
};
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/Keyboard.vue?vue&type=script&setup=true&lang=js
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


var _hoisted_1 = {
  key: 0,
  "class": "grid grid-cols-1 min-h-[50px]"
};
var _hoisted_2 = {
  "class": "self-center"
};
var _hoisted_3 = {
  key: 1,
  "class": "grid grid-cols-1 min-h-[40px] italic"
};
var _hoisted_4 = ["textContent"];
var _hoisted_5 = ["onClick"];
var _hoisted_6 = {
  key: 0
};
var _hoisted_7 = ["onClick"];

var _hoisted_8 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)();

var _hoisted_9 = {
  "class": "hidden md:inline md:ml-2"
};


/* harmony default export */ const Keyboardvue_type_script_setup_true_lang_js = ({
  props: {
    modelValue: String,
    keyboard: {
      type: [Object, String],
      "default": function _default() {
        return 'simple';
      }
    },
    validate: {
      type: Boolean,
      "default": null
    },
    reset: {
      type: Boolean,
      "default": null
    },
    back: {
      type: Boolean,
      "default": null
    },
    next: {
      type: Boolean,
      "default": null
    },
    mathOutput: {
      type: Boolean,
      "default": false
    },
    textOutput: {
      type: Boolean,
      "default": false
    },
    small: {
      type: Boolean,
      "default": false
    }
  },
  emits: ['update:modelValue', 'validate', 'next'],
  setup: function setup(__props, _ref) {
    var expose = _ref.expose,
        emit = _ref.emit;
    var props = __props;
    var root = (0,vue_esm_bundler.ref)(null),
        keyStrokes = (0,vue_esm_bundler.ref)([]),
        keyboardGridDefault = (0,vue_esm_bundler.ref)('grid-cols-4');
    var keyboardData = (0,vue_esm_bundler.computed)(function () {
      if (typeof props.keyboard === 'string' && keyboards[props.keyboard] !== undefined) {
        return keyboards[props.keyboard];
      } else {
        return props.keyboard;
      }
    });
    var keyboardComputed = (0,vue_esm_bundler.computed)(function () {
      var data = []; // Loop through all keyboard keys in the layout.

      var _iterator = _createForOfIteratorHelper(keyboardData.value.layout),
          _step;

      try {
        var _loop = function _loop() {
          var key = _step.value;
          var kkey = typeof key === 'string' ? key : key[0],
              spankey = typeof key === 'string' ? 0 : key[1],
              kdata = {};

          if (spankey === 2) {
            spankey = 'col-span-2';
          } else if (spankey === 3) {
            spankey = 'col-span-3';
          } else if (spankey === 4) {
            spankey = 'col-span-4';
          } else if (spankey === 5) {
            spankey = 'col-span-5';
          }

          kdata = {
            key: kkey,
            visible: kkey === '',
            type: keyboardKeys[kkey] === undefined ? false : keyboardKeys[kkey].type,
            display: keyboardKeys[kkey] === undefined ? false : keyboardKeys[kkey].display,
            span: spankey
          };

          if (keyboardKeys[kkey] === undefined) {
            kdata.fn = function (key) {
              return props.modelValue + '';
            };
          } else {
            if (keyboardKeys[kkey].fn === undefined) {
              kdata.fn = function (value) {
                return value + kkey;
              };
            } else {
              kdata.fn = keyboardKeys[kkey].fn;
            }
          } // Overrides existing values.


          if (keyboardData.value.keys !== undefined && keyboardData.value.keys[kkey] !== undefined) {
            kdata.type = keyboardData.value.keys[kkey].type === undefined ? kdata.type : keyboardData.value.keys[kkey].type;
            kdata.display = keyboardData.value.keys[kkey].display === undefined ? kdata.display : keyboardData.value.keys[kkey].display;
            kdata.fn = keyboardData.value.keys[kkey].fn === undefined ? kdata.fn : keyboardData.value.keys[kkey].fn;
          }

          data.push(kdata);
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return data;
    }),
        keyboardCommands = (0,vue_esm_bundler.computed)(function () {
      var btnReset = {
        label: 'tout effacer',
        icon: 'bi bi-trash',
        span: 1,
        fn: function fn() {
          return resetKeyStrokes();
        },
        atEnd: false
      },
          btnBack = {
        label: 'effacer',
        icon: 'bi bi-backspace',
        span: 1,
        fn: function fn() {
          return backKeyStrokes();
        },
        atEnd: false
      },
          btnNext = {
        label: 'suivant',
        icon: 'bi bi-arrow-bar-right',
        span: 1,
        fn: function fn() {
          return emit('next');
        },
        atEnd: false
      },
          btnValidate = {
        label: 'valider',
        icon: 'bi bi-check',
        span: 3,
        fn: function fn() {
          return emit('validate');
        },
        atEnd: false
      };
      var grid = 3,
          commandsBtn = [];

      if (keyboardData.value.grid) {
        grid = keyboardData.value.grid.split('-').pop();
      }

      var smallButtons = 0,
          col = 0;

      if (props.back) {
        smallButtons++;
      }

      if (props.reset) {
        smallButtons++;
      }

      if (props.next) {
        smallButtons++;
      }

      if (props.validate) {
        if (smallButtons + 2 > grid) {
          // The grid is too small
          if (props.reset) {
            commandsBtn.push(btnReset);
          }

          if (props.back) {
            commandsBtn.push(btnBack);
          }

          if (props.next) {
            commandsBtn.push(btnNext);
          }

          if (commandsBtn.length === 1) {
            // smallBtn + ValidateBzn
            btnValidate.span = grid - 1;
          } else {
            // smallBtn smallBtn
            // validateBtn (on another line)
            btnValidate.span = grid;
          }

          commandsBtn.push(btnValidate);
        } else {
          col = Math.min(2, Math.trunc((grid - 2) / smallButtons));
          btnBack.span = col;
          btnReset.span = col;
          btnNext.span = col;
          btnValidate.span = +grid;

          if (props.reset) {
            commandsBtn.push(btnReset);
            btnValidate.span -= col;
          }

          if (props.back) {
            commandsBtn.push(btnBack);
            btnValidate.span -= col;
          }

          commandsBtn.push(btnValidate);

          if (props.next) {
            commandsBtn.push(btnNext);
            btnValidate.span -= col;
          }
        }
      } else if (smallButtons > 0) {
        if (props.reset) {
          commandsBtn.push(btnReset);
        }

        if (props.back) {
          commandsBtn.push(btnBack);
        }

        if (props.next) {
          commandsBtn.push(btnNext);
        }

        var _col = Math.trunc(grid / commandsBtn.length);

        btnReset.span = _col;
        btnBack.span = _col;
        btnNext.span = _col;
        commandsBtn[commandsBtn.length - 1].atEnd = true;
      }

      return commandsBtn;
    });

    function resetKeyStrokes() {
      keyStrokes.value = [];
      emit('update:modelValue', '');
    }

    function backKeyStrokes() {
      ButtonKeyClick({
        key: '@back'
      });
    }

    function ButtonKeyClick(key) {
      if (key.key === '@back') {
        keyStrokes.value.pop();
      } else if (key.key === '@reset') {
        resetKeyStrokes();
      } else {
        keyStrokes.value.push(key);
      }

      var output = '';
      emit('update:modelValue', keyStrokes.value.map(function (k) {
        return k.fn(output);
      }).join(''));
    }

    (0,vue_esm_bundler.onMounted)(function () {
      katexAutoRender(root.value);
    });
    expose({
      resetKeyStrokes: resetKeyStrokes
    });
    return function (_ctx, _cache) {
      var _unref$grid, _unref$grid2;

      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", null, [__props.mathOutput ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_1, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", _hoisted_2, null, 512), [[_directive_katex, props.modelValue, void 0, {
        ascii: true,
        left: true,
        nomargin: true
      }]])])) : (0,vue_esm_bundler.createCommentVNode)("", true), __props.textOutput ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_3, [(0,vue_esm_bundler.createElementVNode)("div", {
        "class": "self-center",
        textContent: (0,vue_esm_bundler.toDisplayString)(props.modelValue)
      }, null, 8, _hoisted_4)])) : (0,vue_esm_bundler.createCommentVNode)("", true), (0,vue_esm_bundler.createElementVNode)("div", {
        ref_key: "root",
        ref: root,
        "class": (0,vue_esm_bundler.normalizeClass)(["grid gap-2 keyboard", ((_unref$grid = (0,vue_esm_bundler.unref)(keyboardData).grid) !== null && _unref$grid !== void 0 ? _unref$grid : (0,vue_esm_bundler.unref)(keyboardGridDefault)) + (__props.small ? ' keyboard-sm' : '')])
      }, [((0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)((0,vue_esm_bundler.unref)(keyboardComputed), function (key, index) {
        return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("button", {
          key: "key-".concat(key.key, "-").concat(index),
          "class": (0,vue_esm_bundler.normalizeClass)(["key", "".concat(key.span, " ").concat(key.visible ? 'invisible' : '')]),
          onClick: function onClick($event) {
            return ButtonKeyClick(key);
          }
        }, [key.type === 'math' ? (0,vue_esm_bundler.withDirectives)(((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("span", _hoisted_6, null, 512)), [[_directive_katex, key.display, void 0, {
          clear: true
        }]]) : key.type === 'icon' ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("i", {
          key: 1,
          "class": (0,vue_esm_bundler.normalizeClass)(key.display)
        }, null, 2)) : (0,vue_esm_bundler.createCommentVNode)("", true)], 10, _hoisted_5);
      }), 128))], 2), (0,vue_esm_bundler.unref)(keyboardCommands).length > 0 ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", {
        key: 2,
        "class": (0,vue_esm_bundler.normalizeClass)(["keyboard grid gap-2 w-full mt-10", ((_unref$grid2 = (0,vue_esm_bundler.unref)(keyboardData).grid) !== null && _unref$grid2 !== void 0 ? _unref$grid2 : (0,vue_esm_bundler.unref)(keyboardGridDefault)) + (__props.small ? ' keyboard-sm' : '')])
      }, [((0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)((0,vue_esm_bundler.unref)(keyboardCommands), function (item, index) {
        return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("button", {
          key: "keyboard-command-".concat(index),
          "class": (0,vue_esm_bundler.normalizeClass)("key col-span-".concat(item.span, " ").concat(item.atEnd ? 'order-last' : '')),
          onClick: function onClick($event) {
            return item.fn();
          }
        }, [(0,vue_esm_bundler.createElementVNode)("i", {
          "class": (0,vue_esm_bundler.normalizeClass)(item.icon)
        }, null, 2), _hoisted_8, (0,vue_esm_bundler.createElementVNode)("span", _hoisted_9, (0,vue_esm_bundler.toDisplayString)(item.label), 1)], 10, _hoisted_7);
      }), 128))], 2)) : (0,vue_esm_bundler.createCommentVNode)("", true)]);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Ui/Keyboard.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Ui/Keyboard.vue



const __exports__ = Keyboardvue_type_script_setup_true_lang_js;

/* harmony default export */ const Keyboard = (__exports__);

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