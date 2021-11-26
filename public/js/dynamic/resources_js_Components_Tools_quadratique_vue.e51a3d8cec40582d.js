"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_Tools_quadratique_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Tools/quadratique.vue?vue&type=script&setup=true&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Tools/quadratique.vue?vue&type=script&setup=true&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/Components/Ui/Panel */ "./resources/js/Components/Ui/Panel.vue");
/* harmony import */ var _Components_Form_FormInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/Form/FormInput */ "./resources/js/Components/Form/FormInput.vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var pimath_esm_maths_geometry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! pimath/esm/maths/geometry */ "./node_modules/pimath/esm/maths/geometry/index.js");
/* harmony import */ var pimath_esm_maths_algebra_equation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! pimath/esm/maths/algebra/equation */ "./node_modules/pimath/esm/maths/algebra/equation.js");
/* harmony import */ var pimath_esm_maths_algebra_polynom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! pimath/esm/maths/algebra/polynom */ "./node_modules/pimath/esm/maths/algebra/polynom.js");






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    /** Tools
     * title: quadratique
     * description: calcul d'une fonction quadratique
     * parameters: a=Point, b=Point, c=Point (optionnel)
     * tags: algebre,1M
     */

    var A = (0,vue__WEBPACK_IMPORTED_MODULE_2__.ref)("1,4"),
        B = (0,vue__WEBPACK_IMPORTED_MODULE_2__.ref)("2,3"),
        C = (0,vue__WEBPACK_IMPORTED_MODULE_2__.ref)("5,8");
    var quadratique = (0,vue__WEBPACK_IMPORTED_MODULE_2__.computed)(function () {
      var P = new pimath_esm_maths_algebra_equation__WEBPACK_IMPORTED_MODULE_4__.Equation("y = a*x^2+b*x+c"),
          pA = new pimath_esm_maths_geometry__WEBPACK_IMPORTED_MODULE_3__.Point(A.value),
          pB = new pimath_esm_maths_geometry__WEBPACK_IMPORTED_MODULE_3__.Point(B.value),
          pC = new pimath_esm_maths_geometry__WEBPACK_IMPORTED_MODULE_3__.Point(C.value); // TODO: améliorer le calcul et inclure dans PI
      // y=ax^2+bx+c

      var Pc = P.clone().replaceBy("x", new pimath_esm_maths_algebra_polynom__WEBPACK_IMPORTED_MODULE_5__.Polynom(pA.x.display)).replaceBy("y", new pimath_esm_maths_algebra_polynom__WEBPACK_IMPORTED_MODULE_5__.Polynom(pA.y.display)).isolate("c"),
          Pb = P.clone().replaceBy("x", new pimath_esm_maths_algebra_polynom__WEBPACK_IMPORTED_MODULE_5__.Polynom(pB.x.display)).replaceBy("y", new pimath_esm_maths_algebra_polynom__WEBPACK_IMPORTED_MODULE_5__.Polynom(pB.y.display)).replaceBy("c", Pc.right).isolate("b"),
          Pa;

      if (C.value !== "") {
        Pa = P.clone().replaceBy("x", new pimath_esm_maths_algebra_polynom__WEBPACK_IMPORTED_MODULE_5__.Polynom(pC.x.display)).replaceBy("y", new pimath_esm_maths_algebra_polynom__WEBPACK_IMPORTED_MODULE_5__.Polynom(pC.y.display)).replaceBy("c", Pc.right).replaceBy("b", Pb.right).isolate("a");
      } else {
        // Le point B est un sommet !
        // x = -b/2a => b = -2ax
        Pa = new pimath_esm_maths_algebra_equation__WEBPACK_IMPORTED_MODULE_4__.Equation("b = -2a*x").replaceBy("x", new pimath_esm_maths_algebra_polynom__WEBPACK_IMPORTED_MODULE_5__.Polynom(pC.x.display));
        Pa.left = Pb.right.clone();
        Pa.isolate("a");
      }

      Pb = Pb.replaceBy("a", Pa.right);
      Pc = Pc.replaceBy("b", Pb.right).replaceBy("a", Pa.right);
      return P.clone().replaceBy("a", Pa.right).replaceBy("b", Pb.right).replaceBy("c", Pc.right);
    });
    var __returned__ = {
      A: A,
      B: B,
      C: C,
      quadratique: quadratique,
      Panel: _Components_Ui_Panel__WEBPACK_IMPORTED_MODULE_0__["default"],
      FormInput: _Components_Form_FormInput__WEBPACK_IMPORTED_MODULE_1__["default"],
      computed: vue__WEBPACK_IMPORTED_MODULE_2__.computed,
      ref: vue__WEBPACK_IMPORTED_MODULE_2__.ref,
      Point: pimath_esm_maths_geometry__WEBPACK_IMPORTED_MODULE_3__.Point,
      Equation: pimath_esm_maths_algebra_equation__WEBPACK_IMPORTED_MODULE_4__.Equation,
      Polynom: pimath_esm_maths_algebra_polynom__WEBPACK_IMPORTED_MODULE_5__.Polynom
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Tools/quadratique.vue?vue&type=template&id=527a1372":
/*!***************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Tools/quadratique.vue?vue&type=template&id=527a1372 ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)($setup["Panel"], null, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["FormInput"], {
        modelValue: $setup.A,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return $setup.A = $event;
        }),
        label: "Coordonnées du point A",
        name: "fonction"
      }, null, 8
      /* PROPS */
      , ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["FormInput"], {
        modelValue: $setup.B,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
          return $setup.B = $event;
        }),
        label: $setup.C === '' ? 'Coordonnées du sommet S' : 'Coordonnées du point B',
        name: "fonction"
      }, null, 8
      /* PROPS */
      , ["modelValue", "label"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["FormInput"], {
        modelValue: $setup.C,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
          return $setup.C = $event;
        }),
        label: "Coordonnées du point C",
        name: "fonction"
      }, null, 8
      /* PROPS */
      , ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, null, 512
      /* NEED_PATCH */
      ), [[_directive_katex, "".concat($setup.quadratique.tex)]])];
    }),
    _: 1
    /* STABLE */

  });
}

/***/ }),

/***/ "./node_modules/pimath/esm/maths/geometry/circle.js":
/*!**********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/geometry/circle.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Circle": () => (/* binding */ Circle)
/* harmony export */ });
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./point */ "./node_modules/pimath/esm/maths/geometry/point.js");
/* harmony import */ var _coefficients_fraction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../coefficients/fraction */ "./node_modules/pimath/esm/maths/coefficients/fraction.js");
/* harmony import */ var _algebra_equation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../algebra/equation */ "./node_modules/pimath/esm/maths/algebra/equation.js");
/* harmony import */ var _algebra_polynom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../algebra/polynom */ "./node_modules/pimath/esm/maths/algebra/polynom.js");




class Circle {
    _center;
    _radius;
    _exists;
    constructor(...values) {
        this._exists = false;
        if (values !== undefined) {
            this.parse(...values);
        }
    }
    parse(...values) {
        if (values.length === 2) {
            this._center = new _point__WEBPACK_IMPORTED_MODULE_0__.Point(values[0]);
            this._radius = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_1__.Fraction(values[1]);
        }
    }
    get tex() {
        let cx, cy;
        if (this._center.x.isZero()) {
            cx = 'x^2';
        }
        else {
            cx = `\\left(x-${this._center.x.tex}\\right)^2`;
        }
        if (this._center.y.isZero()) {
            cy = 'y^2';
        }
        else {
            cy = `\\left(y-${this._center.y.tex}\\right)^2`;
        }
        return `${cx}+${cy}=${this._radius.pow(2).tex}`;
    }
    get developed() {
        let equ = new _algebra_equation__WEBPACK_IMPORTED_MODULE_2__.Equation(new _algebra_polynom__WEBPACK_IMPORTED_MODULE_3__.Polynom(`(x-(${this._center.x.display}))^2+(y-(${this._center.y.display}))^2`), new _algebra_polynom__WEBPACK_IMPORTED_MODULE_3__.Polynom(`${this._radius.pow(2).display}`));
        return equ.moveLeft().tex;
    }
}
//# sourceMappingURL=circle.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/geometry/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/geometry/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vector": () => (/* reexport safe */ _vector__WEBPACK_IMPORTED_MODULE_0__.Vector),
/* harmony export */   "Triangle": () => (/* reexport safe */ _triangle__WEBPACK_IMPORTED_MODULE_1__.Triangle),
/* harmony export */   "Point": () => (/* reexport safe */ _point__WEBPACK_IMPORTED_MODULE_2__.Point),
/* harmony export */   "Circle": () => (/* reexport safe */ _circle__WEBPACK_IMPORTED_MODULE_3__.Circle),
/* harmony export */   "Line": () => (/* reexport safe */ _line__WEBPACK_IMPORTED_MODULE_4__.Line)
/* harmony export */ });
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vector */ "./node_modules/pimath/esm/maths/geometry/vector.js");
/* harmony import */ var _triangle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./triangle */ "./node_modules/pimath/esm/maths/geometry/triangle.js");
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./point */ "./node_modules/pimath/esm/maths/geometry/point.js");
/* harmony import */ var _circle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./circle */ "./node_modules/pimath/esm/maths/geometry/circle.js");
/* harmony import */ var _line__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./line */ "./node_modules/pimath/esm/maths/geometry/line.js");





//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/geometry/line.js":
/*!********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/geometry/line.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Line": () => (/* binding */ Line)
/* harmony export */ });
/* harmony import */ var _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../coefficients/fraction */ "./node_modules/pimath/esm/maths/coefficients/fraction.js");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vector */ "./node_modules/pimath/esm/maths/geometry/vector.js");
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./point */ "./node_modules/pimath/esm/maths/geometry/point.js");
/* harmony import */ var _algebra_polynom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../algebra/polynom */ "./node_modules/pimath/esm/maths/algebra/polynom.js");
/* harmony import */ var _numeric__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../numeric */ "./node_modules/pimath/esm/maths/numeric.js");
/* harmony import */ var _algebra_equation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../algebra/equation */ "./node_modules/pimath/esm/maths/algebra/equation.js");






class Line {
    _a;
    _b;
    _c;
    _OA;
    _d;
    _n;
    _exists;
    constructor(...values) {
        this._exists = false;
        if (values !== undefined) {
            this.parse(...values);
        }
        return this;
    }
    get isLine() { return true; }
    get exists() { return this._exists; }
    get equation() {
        return new _algebra_equation__WEBPACK_IMPORTED_MODULE_5__.Equation(new _algebra_polynom__WEBPACK_IMPORTED_MODULE_3__.Polynom().parse('xy', this._a, this._b, this._c), new _algebra_polynom__WEBPACK_IMPORTED_MODULE_3__.Polynom('0')).simplify();
    }
    get tex() {
        let canonical = this.equation;
        if (this._a.isNegative()) {
            canonical.multiply(-1);
        }
        return {
            canonical: canonical.tex,
            mxh: this.slope.isInfinity() ? 'x=' + this.OA.x.tex : 'y=' + new _algebra_polynom__WEBPACK_IMPORTED_MODULE_3__.Polynom().parse('x', this.slope, this.height).tex,
            parametric: `${_point__WEBPACK_IMPORTED_MODULE_2__.Point.pmatrix('x', 'y')} = ${_point__WEBPACK_IMPORTED_MODULE_2__.Point.pmatrix(this._OA.x, this._OA.y)} + k\\cdot ${_point__WEBPACK_IMPORTED_MODULE_2__.Point.pmatrix(this._d.x, this._d.y)}`
        };
    }
    get a() {
        return this._a;
    }
    set a(value) {
        this._a = value;
    }
    get b() {
        return this._b;
    }
    set b(value) {
        this._b = value;
    }
    get c() {
        return this._c;
    }
    set c(value) {
        this._c = value;
    }
    get OA() {
        return this._OA;
    }
    set OA(value) {
        this._OA = value;
    }
    get d() {
        return this._d;
    }
    get n() {
        return this._n;
    }
    get normal() {
        return new _vector__WEBPACK_IMPORTED_MODULE_1__.Vector(this._a, this._b);
    }
    set d(value) {
        this._d = value;
    }
    get slope() {
        return this._a.clone().opposed().divide(this._b);
    }
    get height() {
        return this._c.clone().opposed().divide(this._b);
    }
    parse = (...values) => {
        this._exists = false;
        if (values.length === 3) {
            return this.parseByCoefficient(values[0], values[1], values[2]);
        }
        else if (values.length === 2) {
            if (values[0].isPoint && values[1].isVector) {
                return this.parseByPointAndVector(values[0], values[1]);
            }
            else if (values[0].isPoint && values[1].isPoint) {
                return this.parseByPointAndVector(values[0], new _vector__WEBPACK_IMPORTED_MODULE_1__.Vector(values[0], values[1]));
            }
        }
        else if (values.length === 1) {
            if (values[0].isLine) {
                return values[0].clone();
            }
            let equ = new _algebra_equation__WEBPACK_IMPORTED_MODULE_5__.Equation(values[0]);
            if (equ.isEquation) {
                equ.reorder(true);
                let letters = new Set(equ.letters());
                if (!(letters.has('x') || letters.has('y'))) {
                    return;
                }
                for (let elem of ['x', 'y']) {
                    if (letters.has(elem)) {
                        letters.delete(elem);
                    }
                }
                if (letters.size > 0) {
                    console.log('Extra variable in the equation.');
                    return this;
                }
                return this.parseByCoefficient(equ.left.monomByLetter('x').coefficient, equ.left.monomByLetter('y').coefficient, equ.left.monomByDegree(0).coefficient);
            }
        }
        console.log('Someting wrong happend while creating the line');
        return this;
    };
    parseByCoefficient = (a, b, c) => {
        this._a = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(a);
        this._b = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(b);
        this._c = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(c);
        this._d = new _vector__WEBPACK_IMPORTED_MODULE_1__.Vector(this._b.clone(), this._a.clone().opposed());
        this._OA = new _point__WEBPACK_IMPORTED_MODULE_2__.Point(new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction().zero(), this._c.clone());
        this._n = this._d.clone().normal();
        this._exists = true;
        return this;
    };
    parseByPointAndVector = (P, d) => {
        this.parseByCoefficient(d.y, d.x.clone().opposed(), P.x.clone().multiply(d.y).subtract(P.y.clone().multiply(d.x)).opposed());
        this._OA = P.clone();
        this._d = d.clone();
        this._n = this._d.clone().normal();
        this._exists = true;
        return this;
    };
    clone = () => {
        this._a = this._a.clone();
        this._b = this._b.clone();
        this._c = this._c.clone();
        this._d = this._d.clone();
        this._OA = this._OA.clone();
        this._n = this._n.clone();
        return this;
    };
    isParellelTo = (line) => {
        return this.slope.isEqual(line.slope) && this.height.isDifferent(line.height);
    };
    isSameAs = (line) => {
        return this.slope.isEqual(line.slope) && this.height.isEqual(line.height);
    };
    simplifyDirection = () => {
        let lcm = _numeric__WEBPACK_IMPORTED_MODULE_4__.Numeric.lcm(this._d.x.denominator, this._d.y.denominator), gcd = _numeric__WEBPACK_IMPORTED_MODULE_4__.Numeric.gcd(this._d.x.numerator, this._d.y.numerator);
        this._d.x.multiply(lcm).divide(gcd);
        this._d.y.multiply(lcm).divide(gcd);
        return this;
    };
    intersection = (line) => {
        let Pt = new _point__WEBPACK_IMPORTED_MODULE_2__.Point(), isParallel = false, isSame = false, hasIntersection = true;
        if (this._b.isZero() || line.b.isZero()) {
        }
        if (this.isParellelTo(line)) {
            Pt.x = null;
            Pt.y = null;
            isParallel = true;
        }
        else if (this.isSameAs(line)) {
            Pt.x = null;
            Pt.y = null;
            isSame = true;
        }
        else {
            Pt.x = this._b.clone().multiply(line.c).subtract(this._c.clone().multiply(line.b))
                .divide(this._a.clone().multiply(line.b).subtract(this._b.clone().multiply(line.a)));
            Pt.y = this._a.clone().multiply(line.c).subtract(this._c.clone().multiply(line.a))
                .divide(this._b.clone().multiply(line.a).subtract(this._a.clone().multiply(line.b)));
        }
        return {
            point: Pt,
            hasIntersection: !(isParallel || isSame),
            isParallel,
            isSame
        };
    };
    distanceTo(pt) {
        let numerator = pt.x.clone().multiply(this._a)
            .add(pt.y.clone().multiply(this._b))
            .add(this._c).abs(), d2 = this.normal.normSquare;
        if (d2.isZero()) {
            return {
                value: NaN,
                tex: 'Not a line',
                fraction: new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction().infinite()
            };
        }
        let value = numerator.value / Math.sqrt(d2.value), F = numerator.clone().divide(d2.clone().sqrt());
        if (d2.isSquare()) {
            return {
                value,
                tex: F.tex,
                fraction: F
            };
        }
        return {
            value,
            tex: `\\frac{${numerator.tex}}{\\sqrt{${d2.tex}}}`,
            fraction: F
        };
    }
    hitSegment(A, B) {
        let iPt = this.intersection(new Line(A, B));
        if (iPt.hasIntersection) {
            return iPt.point.x.value >= Math.min(A.x.value, B.x.value)
                && iPt.point.x.value <= Math.max(A.x.value, B.x.value)
                && iPt.point.y.value >= Math.min(A.y.value, B.y.value)
                && iPt.point.y.value <= Math.max(A.y.value, B.y.value);
        }
        return false;
    }
    canonicalAsFloatCoefficient(decimals) {
        if (decimals === undefined) {
            decimals = 2;
        }
        let ca = this._a.value, cb = this._b.value, cc = this._c.value, canonical = '';
        if (!this._a.isZero()) {
            if (this._a.isOne()) {
                canonical = 'x';
            }
            else if (this._a.clone().opposed().isOne()) {
                canonical = '-x';
            }
            else {
                canonical = this._a.value.toFixed(decimals) + 'x';
            }
        }
        if (!this._b.isZero()) {
            if (this._b.isPositive()) {
                canonical += '+';
            }
            canonical += this._b.value.toFixed(decimals) + 'y';
        }
        if (!this._c.isZero()) {
            if (this._c.isPositive()) {
                canonical += '+';
            }
            canonical += this._c.value.toFixed(decimals);
        }
        return canonical + '=0';
    }
}
//# sourceMappingURL=line.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/geometry/point.js":
/*!*********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/geometry/point.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Point": () => (/* binding */ Point)
/* harmony export */ });
/* harmony import */ var _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../coefficients/fraction */ "./node_modules/pimath/esm/maths/coefficients/fraction.js");

class Point {
    _x;
    _y;
    _exist;
    constructor(...values) {
        this._x = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction().zero();
        this._y = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction().zero();
        if (values !== undefined) {
            this.parse(...values);
        }
        return this;
    }
    ;
    get isPoint() {
        return true;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get tex() {
        let pts = [];
        pts.push(this._x.tex);
        pts.push(this._y.tex);
        return `\\left(${pts.join(';')}\\right)`;
    }
    parse = (...values) => {
        this.zero();
        if (values.length === 0) {
            return this;
        }
        if (values.length === 1) {
            if (values[0] instanceof Point) {
                this._x = values[0].x.clone();
                this._y = values[0].y.clone();
                return this;
            }
            if (typeof values[0] === 'string') {
                let xy = values[0].split(',');
                if (xy.length === 2) {
                    this._x = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(xy[0]).reduce();
                    this._y = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(xy[1]).reduce();
                    return this;
                }
            }
            if (values[0].x !== undefined && values[0].y !== undefined) {
                this._x = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(values[0].x).reduce();
                this._y = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(values[0].y).reduce();
            }
            else {
                return this.zero();
            }
        }
        if (values.length === 2) {
            this._x = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(values[0]).reduce();
            this._y = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(values[1]).reduce();
        }
        return this;
    };
    clone = () => {
        this._x = this._x.clone();
        this._y = this._y.clone();
        return this;
    };
    zero = () => {
        this._x = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(null);
        this._y = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(null);
        return this;
    };
    origin = () => {
        this.zero();
        return this;
    };
    middleOf = (P1, P2) => {
        this._x = P1.x.clone().add(P2.x).divide(2);
        this._y = P1.y.clone().add(P2.y).divide(2);
        return this;
    };
    texValues = (numberOfDigits) => {
        let pts = [];
        pts.push(this._x.value.toFixed(numberOfDigits === undefined ? 2 : numberOfDigits));
        pts.push(this._y.value.toFixed(numberOfDigits === undefined ? 2 : numberOfDigits));
        return `\\left(${pts.join(';')}\\right)`;
    };
    static pmatrix = (a, b, c) => {
        if (c === undefined) {
            return `\\begin{pmatrix} ${a.tex ? a.tex : a} \\\\ ${b.tex ? b.tex : b} \\end{pmatrix}`;
        }
        else {
            return `\\begin{pmatrix} ${a.tex ? a.tex : a} \\\\ ${b.tex ? b.tex : b} \\\\ ${c.tex ? c.tex : c} \\end{pmatrix}`;
        }
    };
}
//# sourceMappingURL=point.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/geometry/triangle.js":
/*!************************************************************!*\
  !*** ./node_modules/pimath/esm/maths/geometry/triangle.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Triangle": () => (/* binding */ Triangle)
/* harmony export */ });
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./point */ "./node_modules/pimath/esm/maths/geometry/point.js");
/* harmony import */ var _coefficients_fraction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../coefficients/fraction */ "./node_modules/pimath/esm/maths/coefficients/fraction.js");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vector */ "./node_modules/pimath/esm/maths/geometry/vector.js");
/* harmony import */ var _line__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./line */ "./node_modules/pimath/esm/maths/geometry/line.js");
/* harmony import */ var _algebra_equation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../algebra/equation */ "./node_modules/pimath/esm/maths/algebra/equation.js");





class Triangle {
    _A;
    _B;
    _C;
    _lines;
    _middles;
    _remarquables;
    constructor(...values) {
        if (values.length > 0) {
            this.parse(...values);
        }
        return this;
    }
    get isTriangle() { return true; }
    get A() {
        return this._A;
    }
    get B() {
        return this._B;
    }
    get C() {
        return this._C;
    }
    get AB() {
        return this.getSegment('A', 'B');
    }
    get BA() {
        return this.getSegment('B', 'A');
    }
    get BC() {
        return this.getSegment('B', 'C');
    }
    get CB() {
        return this.getSegment('C', 'B');
    }
    get AC() {
        return this.getSegment('A', 'C');
    }
    get CA() {
        return this.getSegment('C', 'A');
    }
    get isRectangle() {
        if (this.AB.isNormalTo(this.BC)) {
            return true;
        }
        if (this.AB.isNormalTo(this.AC)) {
            return true;
        }
        if (this.BC.isNormalTo(this.AC)) {
            return true;
        }
        return false;
    }
    get isEquilateral() {
        return this.AB.normSquare.isEqual(this.BC.normSquare) &&
            this.AB.normSquare.isEqual(this.AC.normSquare);
    }
    get isIsocele() {
        return this.AB.normSquare.isEqual(this.BC.normSquare) ||
            this.AB.normSquare.isEqual(this.AC.normSquare) ||
            this.BC.normSquare.isEqual(this.AC.normSquare);
    }
    get lines() {
        return this._lines;
    }
    get remarquables() {
        return this._remarquables;
    }
    parse = (...values) => {
        if (values.length === 6) {
            let v = values.map((x) => new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_1__.Fraction(x));
            return this.parse(new _point__WEBPACK_IMPORTED_MODULE_0__.Point(v[0], v[1]), new _point__WEBPACK_IMPORTED_MODULE_0__.Point(v[2], v[3]), new _point__WEBPACK_IMPORTED_MODULE_0__.Point(v[4], v[5]));
        }
        else if (values.length === 3) {
            if (values.filter((x) => typeof x === 'string').length === 3) {
                return this.parse(...values.map((x) => new _line__WEBPACK_IMPORTED_MODULE_3__.Line(x)));
            }
            else if (values.filter((x) => x.isLine === true).length === 3) {
                this._lines = {
                    'AB': values[0],
                    'BC': values[1],
                    'AC': values[2]
                };
                let intersect = values[0].intersection(values[1]);
                if (intersect.hasIntersection) {
                    this._B = intersect.point.clone();
                }
                else {
                    return this;
                }
                intersect = values[1].intersection(values[2]);
                if (intersect.hasIntersection) {
                    this._C = intersect.point.clone();
                }
                else {
                    return this;
                }
                intersect = values[2].intersection(values[0]);
                if (intersect.hasIntersection) {
                    this._A = intersect.point.clone();
                }
                else {
                    return this;
                }
            }
            else {
                if (values.filter((x) => x.isPoint === true).length < 3) {
                    return this.parse(new _point__WEBPACK_IMPORTED_MODULE_0__.Point(values[0]), new _point__WEBPACK_IMPORTED_MODULE_0__.Point(values[1]), new _point__WEBPACK_IMPORTED_MODULE_0__.Point(values[2]));
                }
                this._A = values[0].clone();
                this._B = values[1].clone();
                this._C = values[2].clone();
                this._lines = {
                    'AB': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._A, this._B),
                    'BC': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._B, this._C),
                    'AC': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._A, this._C)
                };
            }
        }
        else if (values.length === 1) {
            if (values[0].isTriangle === true) {
                return values[0].clone();
            }
        }
        this._updateTriangle();
        return this;
    };
    clone = () => {
        this._A = this._A.clone();
        this._B = this._B.clone();
        this._C = this._C.clone();
        this._lines = {
            'AB': this._lines.AB.clone(),
            'BC': this._lines.BC.clone(),
            'AC': this._lines.AC.clone()
        };
        this._updateTriangle();
        return this;
    };
    _updateTriangle = () => {
        this._middles = {
            'AB': new _point__WEBPACK_IMPORTED_MODULE_0__.Point().middleOf(this._A, this._B),
            'AC': new _point__WEBPACK_IMPORTED_MODULE_0__.Point().middleOf(this._A, this._C),
            'BC': new _point__WEBPACK_IMPORTED_MODULE_0__.Point().middleOf(this._B, this._C)
        };
        this._remarquables = this._calculateRemarquableLines();
    };
    getPointByName = (ptName) => {
        switch (ptName.toUpperCase()) {
            case 'A':
                return this._A;
            case 'B':
                return this._B;
            case 'C':
                return this._C;
        }
        return this._A;
    };
    getSegment = (ptName1, ptName2) => {
        return new _vector__WEBPACK_IMPORTED_MODULE_2__.Vector(this.getPointByName(ptName1), this.getPointByName(ptName2));
    };
    _calculateRemarquableLines = () => {
        let remarquables = {
            'medians': {
                'A': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._A, this._middles.BC),
                'B': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._B, this._middles.AC),
                'C': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._C, this._middles.AB),
                'intersection': null
            },
            'mediators': {
                'AB': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._middles.AB, new _vector__WEBPACK_IMPORTED_MODULE_2__.Vector(this._A, this._B).normal()),
                'AC': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._middles.AC, new _vector__WEBPACK_IMPORTED_MODULE_2__.Vector(this._A, this._C).normal()),
                'BC': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._middles.BC, new _vector__WEBPACK_IMPORTED_MODULE_2__.Vector(this._B, this._C).normal()),
                'intersection': null
            },
            'heights': {
                'A': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._A, new _vector__WEBPACK_IMPORTED_MODULE_2__.Vector(this._B, this._C).normal()),
                'B': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._B, new _vector__WEBPACK_IMPORTED_MODULE_2__.Vector(this._A, this._C).normal()),
                'C': new _line__WEBPACK_IMPORTED_MODULE_3__.Line(this._C, new _vector__WEBPACK_IMPORTED_MODULE_2__.Vector(this._A, this._B).normal()),
                'intersection': null
            },
            'bisectors': {
                'A': this._calculateBisectors('A'),
                'B': this._calculateBisectors('B'),
                'C': this._calculateBisectors('C'),
                'intersection': null
            }
        };
        remarquables.medians.intersection = remarquables.medians.A.intersection(remarquables.medians.B).point;
        remarquables.mediators.intersection = remarquables.mediators.AB.intersection(remarquables.mediators.BC).point;
        remarquables.heights.intersection = remarquables.heights.A.intersection(remarquables.heights.B).point;
        remarquables.bisectors.intersection = remarquables.bisectors.A.intersection(remarquables.bisectors.B).point;
        return remarquables;
    };
    _calculateBisectors = (pt) => {
        let tlines = this.lines, d1, d2;
        if (pt === 'A') {
            d1 = tlines.AB;
            d2 = tlines.AC;
        }
        else if (pt === 'B') {
            d1 = tlines.AB;
            d2 = tlines.BC;
        }
        else if (pt === 'C') {
            d1 = tlines.BC;
            d2 = tlines.AC;
        }
        let b1 = new _line__WEBPACK_IMPORTED_MODULE_3__.Line(new _algebra_equation__WEBPACK_IMPORTED_MODULE_4__.Equation(d1.equation.left.clone().multiply(d2.n.simplify().norm), d2.equation.left.clone().multiply(d1.n.simplify().norm)).reorder(true).simplify()), b2 = new _line__WEBPACK_IMPORTED_MODULE_3__.Line(new _algebra_equation__WEBPACK_IMPORTED_MODULE_4__.Equation(d1.equation.left.clone().multiply(d2.n.simplify().norm), d2.equation.left.clone().multiply(d1.n.simplify().norm).opposed()).reorder(true).simplify());
        if (pt === 'A') {
            return b1.hitSegment(this.B, this.C) ? b1 : b2;
        }
        if (pt === 'B') {
            return b1.hitSegment(this.A, this.C) ? b1 : b2;
        }
        if (pt === 'C') {
            return b1.hitSegment(this.B, this.A) ? b1 : b2;
        }
        return b1;
    };
}
//# sourceMappingURL=triangle.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/geometry/vector.js":
/*!**********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/geometry/vector.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vector": () => (/* binding */ Vector)
/* harmony export */ });
/* harmony import */ var _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../coefficients/fraction */ "./node_modules/pimath/esm/maths/coefficients/fraction.js");
/* harmony import */ var _numeric__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../numeric */ "./node_modules/pimath/esm/maths/numeric.js");


class Vector {
    _x;
    _y;
    constructor(...values) {
        this._x = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction().zero();
        this._y = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction().zero();
        if (values !== undefined) {
            this.parse(...values);
        }
    }
    ;
    get isVector() {
        return true;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get normSquare() {
        return this._x.clone().pow(2).add(this._y.clone().pow(2));
    }
    get norm() {
        return Math.sqrt(this.normSquare.value);
    }
    get tex() {
        return `\\begin{pmatrix}${this._x.tex} \\\\\ ${this._y.tex} \\end{pmatrix}`;
    }
    parse = (...values) => {
        this.zero();
        if (values.length === 0) {
            return this;
        }
        if (values.length === 1) {
            if (values[0].isVector) {
                return values[0].clone();
            }
            else {
                return this._parseString(values[0]);
            }
        }
        if (values.length >= 2) {
            if (values[0].isPoint && values[1].isPoint) {
                this._x = values[1].x.clone().subtract(values[0].x);
                this._y = values[1].y.clone().subtract(values[0].y);
                return this;
            }
            if (values[0].isFraction || !isNaN(values[0])) {
                this._x = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(values[0]);
            }
            if (values[1].isFraction || !isNaN(values[1])) {
                this._y = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(values[1]);
            }
        }
        return this;
    };
    clone = () => {
        let V = new Vector();
        if (this._x !== null) {
            V.x = this._x.clone();
        }
        if (this._y !== null) {
            V.y = this._y.clone();
        }
        return V;
    };
    reset = () => {
        this._x = null;
        this._y = null;
        return this;
    };
    zero = () => {
        this.reset();
        this._x = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(null);
        this._y = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(null);
        return this;
    };
    one = () => {
        this._x = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction();
        this._y = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction();
        return this;
    };
    _parseString = (value) => {
        let components = value.split(/[,;\s]/g);
        this.x = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(components[0] || null);
        this.y = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(components[1] || null);
        return this;
    };
    opposed = () => {
        this._x.opposed();
        this._y.opposed();
        return this;
    };
    add = (V) => {
        this._x.add(V.x);
        this._y.add(V.y);
        return this;
    };
    subtract = (V) => {
        return this.add(V.clone().opposed());
    };
    scalarProductWithVector = (V) => {
        return this._x.clone().multiply(V.x).add(this._y.clone().multiply(V.y));
    };
    static scalarProduct = (v1, v2) => {
        return v1.x.value * v2.x.value + v1.y.value * v2.y.value;
    };
    normal = () => {
        let x = this.x.clone().opposed(), y = this.y.clone();
        this._x = y;
        this._y = x;
        return this;
    };
    isNormalTo = (v) => {
        return this.scalarProductWithVector(v).isZero();
    };
    multiplyByScalar = (k) => {
        let scalar = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(k);
        this._x.multiply(scalar);
        this._y.multiply(scalar);
        return this;
    };
    divideByScalar = (k) => {
        return this.multiplyByScalar(new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(k).invert());
    };
    simplify = () => {
        return this.multiplyByScalar(_numeric__WEBPACK_IMPORTED_MODULE_1__.Numeric.lcm(this._x.denominator, this._y.denominator))
            .divideByScalar(_numeric__WEBPACK_IMPORTED_MODULE_1__.Numeric.gcd(this._x.numerator, this._y.numerator));
    };
    angleWith = (V, sharp, radian) => {
        let scalar = this.scalarProductWithVector(V).value, toDegree = radian ? 1 : 180 / Math.PI;
        if (sharp) {
            scalar = Math.abs(scalar);
        }
        return toDegree * Math.acos(scalar / (this.norm * V.norm));
    };
}
//# sourceMappingURL=vector.js.map

/***/ }),

/***/ "./resources/js/Components/Tools/quadratique.vue":
/*!*******************************************************!*\
  !*** ./resources/js/Components/Tools/quadratique.vue ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _quadratique_vue_vue_type_template_id_527a1372__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./quadratique.vue?vue&type=template&id=527a1372 */ "./resources/js/Components/Tools/quadratique.vue?vue&type=template&id=527a1372");
/* harmony import */ var _quadratique_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./quadratique.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Tools/quadratique.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_quadratique_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_quadratique_vue_vue_type_template_id_527a1372__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Tools/quadratique.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Tools/quadratique.vue?vue&type=script&setup=true&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/Components/Tools/quadratique.vue?vue&type=script&setup=true&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratique_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratique_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./quadratique.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Tools/quadratique.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Tools/quadratique.vue?vue&type=template&id=527a1372":
/*!*************************************************************************************!*\
  !*** ./resources/js/Components/Tools/quadratique.vue?vue&type=template&id=527a1372 ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratique_vue_vue_type_template_id_527a1372__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratique_vue_vue_type_template_id_527a1372__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./quadratique.vue?vue&type=template&id=527a1372 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Tools/quadratique.vue?vue&type=template&id=527a1372");


/***/ })

}]);