"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[810],{

/***/ 5810:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ cercles)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./resources/js/Components/Ui/Panel.vue + 2 modules
var Panel = __webpack_require__(816);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/geometry/index.js
var geometry = __webpack_require__(6425);
// EXTERNAL MODULE: ./node_modules/pimath/esm/maths/random/index.js
var random = __webpack_require__(4682);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Chapters/geometrie/cercles.vue?vue&type=script&setup=true&lang=js


var _hoisted_1 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Soit ");

var _hoisted_2 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" un cercle et \\(\\Gamma_2\\) un cercle centré en ");

var _hoisted_3 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" et passant par ");

var _hoisted_4 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(". ");

var _hoisted_5 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("ol", {
  "class": "list-decimal list-space mt-5 space-y-3"
}, [/*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, [/*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Mettre sous forme "), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("span", {
  "class": "italic"
}, "centre-rayon"), /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" les équations des cercles \\(\\Gamma_1\\) et \\(\\Gamma_2\\) ")]), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, "Calculer l'équation de la tangente \\(t\\) à \\(\\Gamma_2\\) passant par \\(T\\)"), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, "Calculer la position relative entre la droite \\(t\\) et le cercle \\(\\Gamma_1\\)"), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, " Calculer, s'il y en a, le/les point(s) d'intersection entre la droite \\(t\\) et le cercle \\(\\Gamma_1\\) "), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, "Calculer l'équation cartésienne de la droite \\(d\\) passant par les deux centres des cercles"), /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("li", null, "Calculer la médiatrice du sergment reliant les deux sommets")], -1);

var _hoisted_6 = {
  "class": "list-decimal list-space mt-5 space-y-3 text-gray-100 hover:text-gray-600 transition-colors"
};

var _hoisted_7 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" La distance vaut ");

var _hoisted_8 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Intersection: ");

var _hoisted_9 = {
  key: 0
};
var _hoisted_10 = {
  key: 1
};




/* harmony default export */ const cerclesvue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    /** Chapter
     * title: équation cartésienne d'un cercle
     * body: équation d'un cercle, sous la forme centre-rayon
     */
    var root = (0,vue_esm_bundler.ref)(null),
        ex1 = (0,vue_esm_bundler.ref)({
      C1: new geometry.Point(-5, 4),
      r1: 36,
      G1: new geometry.Circle(),
      C2: new geometry.Point(7, -2),
      T: new geometry.Point(2, 3),
      G2: new geometry.Circle(),
      t: new geometry.Line(),
      d: new geometry.Line(),
      m: new geometry.Line(),
      M: new geometry.Point(0, 0),
      P1: new geometry.Point(),
      P2: new geometry.Point()
    }),
        count = (0,vue_esm_bundler.ref)(0);
    var relPositionSign = (0,vue_esm_bundler.computed)(function () {
      var nb = ex1.value.G1.relativePosition(ex1.value.t);
      var sign, text;

      if (nb === 0) {
        sign = '>';
        text = 'externe';
      } else if (nb === 1) {
        sign = '=';
        text = 'tangent';
      } else {
        sign = '<';
        text = 'sécant';
      }

      return "".concat(ex1.value.t.distanceTo(ex1.value.G1.center).tex).concat(sign).concat(ex1.value.G1.radius.tex, "\\implies \\text{").concat(text, "}");
    });

    function updateEx1(random) {
      count.value = 0;
      updateEx1Rnd();
    }

    function updateEx1Rnd() {
      var position, P1, P2, M, t, Tx, T, perp1, perp2, C1x, C1, C2x, C2, r1, r2;
      var nb = 20;
      position = random.Random.number(0, 2);

      if (position === 2) {
        P1 = new geometry.Point(random.Random.numberSym(nb, true), random.Random.numberSym(nb, true));
        P2 = new geometry.Point(random.Random.numberSym(nb, true), random.Random.numberSym(nb, true)); // On s'assure que les deux points ne sont pas de même coordonnées
        // On impose (artificiellement), que la coordonnées x doit être différente

        while (P2.x.isEqual(P1.x)) {
          P2 = new geometry.Point(random.Random.numberSym(nb, true), random.Random.numberSym(nb, true));
        } // On calcule ce qui sera la tangente.


        t = new geometry.Line(P1, P2).simplify(); // On prend un point aléatoire sur cette tangente.

        Tx = random.Random.numberSym(nb, true);
        T = new geometry.Point(Tx, t.getValueAtX(Tx)); // Le point T ne doit pas être une des coordonnées P1, P2 (impossible), ni entre P1 et P2

        while (T.x.value >= Math.min(P1.x.value, P2.x.value) && T.x.value <= Math.max(P1.x.value, P2.x.value)) {
          Tx = random.Random.numberSym(nb, true);
          T = new geometry.Point(Tx, t.getValueAtX(Tx));
        } // On recheche la droite


        M = new geometry.Point().middleOf(P1, P2);
        perp1 = new geometry.Line().parseByPointAndNormal(M, t.director);
        C1x = random.Random.numberSym(nb, true);
        C1 = new geometry.Point(C1x, perp1.getValueAtX(C1x));
        r1 = new geometry.Vector(C1, P1).normSquare;
        perp2 = new geometry.Line().parseByPointAndNormal(T, t.director);
        C2x = random.Random.numberSym(nb, true);
        C2 = new geometry.Point(C2x, perp2.getValueAtX(C1x));
        r2 = new geometry.Vector(C2, T).normSquare;
      } else if (position === 1) {
        P1 = new geometry.Point(random.Random.numberSym(nb, true), random.Random.numberSym(nb, true));
        P2 = false;
        T = new geometry.Point(random.Random.numberSym(nb, true), random.Random.numberSym(nb, true)); // La point T et P1 ne doivent pas être identique.

        while (T.x.isEqual(P1.x) && T.y.isEqual(P1.y)) {
          T = new geometry.Point(random.Random.numberSym(nb, true), random.Random.numberSym(nb, true));
        } // On calcule ce qui sera la tangente.


        t = new geometry.Line(P1, T).simplify(); // On recheche la droite

        perp1 = new geometry.Line().parseByPointAndNormal(P1, t.director);
        C1x = random.Random.numberSym(nb, true);
        C1 = new geometry.Point(C1x, perp1.getValueAtX(C1x));
        r1 = new geometry.Vector(C1, P1).normSquare;
        perp2 = new geometry.Line().parseByPointAndNormal(T, t.director);
        C2x = random.Random.numberSym(nb, true);
        C2 = new geometry.Point(C2x, perp2.getValueAtX(C1x));
        r2 = new geometry.Vector(C2, T).normSquare;
      } else {
        P1 = false;
        P2 = false;
        T = new geometry.Point(random.Random.numberSym(nb, true), random.Random.numberSym(nb, true));
        C2 = new geometry.Point(random.Random.numberSym(nb, true), random.Random.numberSym(nb, true)); // Le point de tangence ne peut pas être sur le centre

        while (T.x.isEqual(C2.x)) {
          T = new geometry.Point(random.Random.numberSym(nb, true), random.Random.numberSym(nb, true));
        }

        var vecteurRadius = new geometry.Vector(T, C2),
            rayon = vecteurRadius.norm;
        t = new geometry.Line(T, vecteurRadius, geometry.Line.PERPENDICULAR); // On recheche la droite

        var Kx = random.Random.numberSym(nb, true),
            K = new geometry.Point(Kx, t.getValueAtX(Kx)); // Le point de tangence ne peut pas être sur le centre

        while (K.x.isEqual(T.x)) {
          Kx = random.Random.numberSym(nb, true);
          K = new geometry.Point(Kx, t.getValueAtX(Kx));
        }

        perp1 = new geometry.Line().parseByPointAndNormal(K, t.director);
        C1x = random.Random.numberSym(nb, true);
        C1 = new geometry.Point(C1x, perp1.getValueAtX(C1x));
        r1 = Math.round(t.distanceTo(C1).value * 0.8);

        while (r1 >= rayon) {
          C1x = random.Random.numberSym(nb, true);
          C1 = new geometry.Point(C1x, perp1.getValueAtX(C1x));
          r1 = Math.round(t.distanceTo(C1).value * 0.8);
        }

        r2 = new geometry.Vector(C2, T).normSquare;
      } // Points à valeurs entières : C1, C2, T


      if (C1.x.isNatural() && C1.y.isNatural() && C2.x.isNatural() && C2.y.isNatural() && T.x.isNatural() && T.y.isNatural() || count.value > 20) {
        ex1.value.C1 = C1;
        ex1.value.r1 = r1;
        ex1.value.G1 = new geometry.Circle(C1, r1, true);
        ex1.value.C2 = C2;
        ex1.value.T = T;
        ex1.value.G2 = new geometry.Circle(C2, r2, true);
        ex1.value.t = t;
        ex1.value.d = new geometry.Line(C1, C2);
        ex1.value.m = new geometry.Line().parseByPointAndNormal(new geometry.Point().middleOf(C1, C2), ex1.value.d.director);
        ex1.value.P1 = P1;
        ex1.value.P2 = P2;
      } else {
        count.value++;
        updateEx1Rnd();
      }
    } // Load the function


    updateEx1(); // When loaded - auto katex

    (0,vue_esm_bundler.onMounted)(function () {
      katexAutoRender(root.value);
    });
    return function (_ctx, _cache) {
      var _directive_katex = (0,vue_esm_bundler.resolveDirective)("katex");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("section", {
        ref_key: "root",
        ref: root
      }, [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(Panel/* default */.Z), {
        type: "exercise"
      }, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [_hoisted_1, (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, '(\\Gamma_1): ' + ex1.value.G1.developed, void 0, {
            inline: true
          }]]), _hoisted_2, (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, 'C_2' + ex1.value.C2.tex, void 0, {
            inline: true
          }]]), _hoisted_3, (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, 'T' + ex1.value.T.tex, void 0, {
            inline: true
          }]]), _hoisted_4, _hoisted_5, (0,vue_esm_bundler.createElementVNode)("ol", _hoisted_6, [(0,vue_esm_bundler.createElementVNode)("li", null, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, '(\\Gamma_1): ' + ex1.value.G1.tex, void 0, {
            left: true
          }]]), (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, '(\\Gamma_2): ' + ex1.value.G2.tex, void 0, {
            left: true
          }]])]), (0,vue_esm_bundler.createElementVNode)("li", null, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, '(t): ' + ex1.value.t.tex.canonical, void 0, {
            left: true
          }]])]), (0,vue_esm_bundler.createElementVNode)("li", null, [_hoisted_7, (0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("span", null, null, 512), [[_directive_katex, (0,vue_esm_bundler.unref)(relPositionSign), void 0, {
            inline: true
          }]])]), (0,vue_esm_bundler.createElementVNode)("li", null, [_hoisted_8, ex1.value.P1 !== false ? (0,vue_esm_bundler.withDirectives)(((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_9, null, 512)), [[_directive_katex, "P_1".concat(ex1.value.P1.tex), void 0, {
            left: true
          }]]) : (0,vue_esm_bundler.createCommentVNode)("", true), ex1.value.P2 !== false ? (0,vue_esm_bundler.withDirectives)(((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_10, null, 512)), [[_directive_katex, "P_2".concat(ex1.value.P2.tex), void 0, {
            left: true
          }]]) : (0,vue_esm_bundler.createCommentVNode)("", true)]), (0,vue_esm_bundler.createElementVNode)("li", null, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, '(d): ' + ex1.value.d.tex.canonical, void 0, {
            left: true
          }]])]), (0,vue_esm_bundler.createElementVNode)("li", null, [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", null, null, 512), [[_directive_katex, '(m): ' + ex1.value.m.tex.canonical, void 0, {
            left: true
          }]])])]),  false ? (0) : (0,vue_esm_bundler.createCommentVNode)("", true)];
        }),
        _: 1
      })], 512);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/geometrie/cercles.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Chapters/geometrie/cercles.vue



const __exports__ = cerclesvue_type_script_setup_true_lang_js;

/* harmony default export */ const cercles = (__exports__);

/***/ })

}]);