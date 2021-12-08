"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_Challenges_quadratiques-forme-du-sommet_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js":
/*!********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var pimath_esm_maths_algebra__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pimath/esm/maths/algebra */ "./node_modules/pimath/esm/maths/algebra/index.js");
/* harmony import */ var pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pimath/esm/maths/random */ "./node_modules/pimath/esm/maths/random/index.js");
/* harmony import */ var _Components_Challenges_ui_challengeTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/Components/Challenges/ui/challengeTitle */ "./resources/js/Components/Challenges/ui/challengeTitle.vue");



 // Valeur nécessaire pour nommer la fonction

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var title = 'quadratique - la forme du sommet'; // Le programme...

    var answer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)({
      a: 'a',
      b: '-\\alpha',
      c: '+\\beta'
    }),
        currentGivenAnswer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)('a'),
        points = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(0),
        level = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(5),
        poly = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(newQuestion());
    var displayAnswer = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(function () {
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
      var ra = points.value >= level.value ? pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_2__.Random.numberSym(6, false) : 1,
          rb = pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_2__.Random.numberSym(6, false),
          rc = pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_2__.Random.numberSym(10, false);
      return new pimath_esm_maths_algebra__WEBPACK_IMPORTED_MODULE_1__.Polynom('x', ra, 2 * rb * ra, rb * rb * ra + rc);
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
      var P = new pimath_esm_maths_algebra__WEBPACK_IMPORTED_MODULE_1__.Polynom('x', ra, 2 * rb * ra, rb * rb * ra + rc);

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

    var __returned__ = {
      title: title,
      answer: answer,
      currentGivenAnswer: currentGivenAnswer,
      points: points,
      level: level,
      poly: poly,
      displayAnswer: displayAnswer,
      newQuestion: newQuestion,
      resetAnswer: resetAnswer,
      updateAnswer: updateAnswer,
      validateAnswer: validateAnswer,
      computed: vue__WEBPACK_IMPORTED_MODULE_0__.computed,
      ref: vue__WEBPACK_IMPORTED_MODULE_0__.ref,
      Polynom: pimath_esm_maths_algebra__WEBPACK_IMPORTED_MODULE_1__.Polynom,
      Random: pimath_esm_maths_random__WEBPACK_IMPORTED_MODULE_2__.Random,
      ChallengeTitle: _Components_Challenges_ui_challengeTitle__WEBPACK_IMPORTED_MODULE_3__["default"]
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js ***!
  \*********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    title: String
  },
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    expose();
    var __returned__ = {};
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2 ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

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
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_katex = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("katex");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("article", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)($setup["ChallengeTitle"], {
    title: $setup.title
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, "score actuel: " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.points), 1
  /* TEXT */
  ), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, $setup.poly.tex]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, null, 512
  /* NEED_PATCH */
  ), [[_directive_katex, $setup.displayAnswer]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    "class": "grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5"
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn btn-primary",
    onClick: $setup.resetAnswer
  }, " recommencer "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    "class": "btn btn-success",
    onClick: $setup.validateAnswer
  }, " valider ")]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(10, function (n) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
      key: "terme-".concat(n),
      "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
      onClick: function onClick($event) {
        return $setup.updateAnswer("-".concat(n));
      }
    }, null, 8
    /* PROPS */
    , _hoisted_3), [[_directive_katex, "-".concat(n), void 0, {
      inline: true
    }]]);
  }), 64
  /* STABLE_FRAGMENT */
  ))]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(10, function (n) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
      key: "terme--".concat(n),
      "class": "border rounded-2xl bg-white hover:bg-green-100 text-center py-2",
      onClick: function onClick($event) {
        return $setup.updateAnswer("+".concat(n));
      }
    }, null, 8
    /* PROPS */
    , _hoisted_5), [[_directive_katex, "+".concat(n), void 0, {
      inline: true
    }]]);
  }), 64
  /* STABLE_FRAGMENT */
  ))])])]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08 ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "text-xl"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("h1", _hoisted_1, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.title), 1
  /* TEXT */
  );
}

/***/ }),

/***/ "./node_modules/pimath/esm/maths/algebra/equation.js":
/*!***********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/algebra/equation.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Equation": () => (/* binding */ Equation)
/* harmony export */ });
/* harmony import */ var _polynom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polynom */ "./node_modules/pimath/esm/maths/algebra/polynom.js");
/* harmony import */ var _numeric__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../numeric */ "./node_modules/pimath/esm/maths/numeric.js");
/* harmony import */ var _coefficients__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../coefficients */ "./node_modules/pimath/esm/maths/coefficients/index.js");




class Equation {
    _left;
    _right;
    _sign;
    _polynom;
    _solutions;
    _varnothing = '\\varnothing';
    _real = '\\mathbb{R}';
    constructor(...equations) {
        this._left = new _polynom__WEBPACK_IMPORTED_MODULE_0__.Polynom().zero();
        this._right = new _polynom__WEBPACK_IMPORTED_MODULE_0__.Polynom().zero();
        this._sign = '=';
        if (equations.length === 1) {
            if (equations[0].isEquation === true) {
                return equations[0].clone();
            }
            else {
                this.parse(equations[0]);
            }
        }
        else if (equations.length === 2) {
            this.left = equations[0].isPolynom ? equations[0].clone() : new _polynom__WEBPACK_IMPORTED_MODULE_0__.Polynom(equations[0]);
            this.right = equations[1].isPolynom ? equations[1].clone() : new _polynom__WEBPACK_IMPORTED_MODULE_0__.Polynom(equations[1]);
        }
        else {
            return this;
        }
        return this;
    }
    get isEquation() {
        return true;
    }
    get solutions() {
        return this._solutions;
    }
    get solution() {
        if (this._solutions.length === 1
            &&
                (this._solutions[0] === this._real
                    || this._solutions[0] === this._varnothing
                    || this._solutions[0].includes('\\left'))) {
            return `S = ${this._solutions[0]}`;
        }
        return `S = \\left{ ${this._solutions.join(';')} \\right}`;
    }
    get isReal() {
        if (this._solutions === undefined) {
            this.solve();
        }
        return this._solutions[0] === this._real;
    }
    get isVarnothing() {
        if (this._solutions === undefined) {
            this.solve();
        }
        return this._solutions[0] === this._varnothing;
    }
    get signAsTex() {
        if (this._sign === '>=' || this._sign === '=>' || this._sign === 'geq') {
            return '\\geq';
        }
        if (this._sign === '<=' || this._sign === '=<' || this._sign === 'leq') {
            return '\\leq';
        }
        return this._sign;
    }
    get tex() {
        return `${this._left.tex}${this.signAsTex}${this._right.tex}`;
    }
    get raw() {
        return `${this._left.raw}${this.signAsTex}${this._right.raw}`;
    }
    get variables() {
        return [...new Set(this._right.variables.concat(this._left.variables))];
    }
    get numberOfVars() {
        return this.variables.length;
    }
    get left() {
        return this._left;
    }
    set left(value) {
        this._left = value;
    }
    get right() {
        return this._right;
    }
    set right(value) {
        this._right = value;
    }
    get sign() {
        return this._sign;
    }
    set sign(value) {
        this._sign = this._formatSign(value);
    }
    parse = (equationString) => {
        let pStr, strSign;
        strSign = this._findSign(equationString);
        if (strSign === false) {
            console.log('The equation is not valid (no sign found)');
            return;
        }
        pStr = equationString.split(strSign);
        return this.create(new _polynom__WEBPACK_IMPORTED_MODULE_0__.Polynom(pStr[0]), new _polynom__WEBPACK_IMPORTED_MODULE_0__.Polynom(pStr[1]), this._formatSign(strSign));
    };
    _findSign = (equationString) => {
        let strSign = '';
        if (equationString.includes('geq')) {
            return (equationString.includes('\\geq')) ? '\\geq' : 'geq';
        }
        else if (equationString.includes('leq')) {
            return (equationString.includes('\\leq')) ? '\\leq' : 'leq';
        }
        else if (equationString.includes('>=')) {
            return '>=';
        }
        else if (equationString.includes('=>')) {
            return '=>';
        }
        else if (equationString.includes('>')) {
            return '>';
        }
        else if (equationString.includes('<=')) {
            return '<=';
        }
        else if (equationString.includes('=<')) {
            return '=<';
        }
        else if (equationString.includes('<')) {
            return '<';
        }
        else if (equationString.includes('=')) {
            return '=';
        }
        if (strSign === '') {
            console.log('Equation: parse string : sign not found');
            return false;
        }
    };
    _formatSign = (signStr) => {
        if (signStr === undefined) {
            return '=';
        }
        if (signStr.includes('geq')) {
            return '>=';
        }
        else if (signStr.includes('>=')) {
            return '>=';
        }
        else if (signStr.includes('=>')) {
            return '>=';
        }
        else if (signStr.includes('>')) {
            return '>';
        }
        else if (signStr.includes('leq')) {
            return '<=';
        }
        else if (signStr.includes('<=')) {
            return '<=';
        }
        else if (signStr.includes('=<')) {
            return '<=';
        }
        else if (signStr.includes('<')) {
            return '<';
        }
        else {
            return '=';
        }
    };
    _reverseSign = () => {
        if (this._sign === '=') {
            return this;
        }
        if (this._sign.includes('<')) {
            this._sign.replace('<', '>');
            return this;
        }
        if (this._sign.includes('>')) {
            this._sign.replace('>', '<');
            return this;
        }
        return this;
    };
    create = (left, right, sign) => {
        this._left = left;
        this._right = right;
        this._sign = this._formatSign(sign);
        return this;
    };
    clone = () => {
        return new Equation().create(this._left.clone(), this._right.clone(), this._sign + '');
    };
    _randomizeDefaults = {
        degree: 2
    };
    get randomizeDefaults() {
        return this._randomizeDefaults;
    }
    set randomizeDefaults(value) {
        this._randomizeDefaults = value;
    }
    randomize = (opts, sign) => {
        return new Equation().create(new _polynom__WEBPACK_IMPORTED_MODULE_0__.Polynom(), new _polynom__WEBPACK_IMPORTED_MODULE_0__.Polynom(), sign);
    };
    moveLeft = () => {
        this._left = this._left.clone().subtract(this._right);
        this._right.zero();
        return this;
    };
    reorder = (allLeft) => {
        this._left.subtract(this._right);
        this._right.zero();
        if (allLeft) {
            return this.moveLeft();
        }
        let mMove;
        for (let m of this._left.monoms) {
            if (m.degree() === 0) {
                mMove = m.clone();
                this._left.subtract(mMove);
                this._right.subtract(mMove);
            }
        }
        this._left.reorder();
        this._right.reorder();
        return this;
    };
    simplify = () => {
        this.multiply(_numeric__WEBPACK_IMPORTED_MODULE_1__.Numeric.lcm(...this._left.getDenominators(), ...this._right.getDenominators()));
        this.divide(_numeric__WEBPACK_IMPORTED_MODULE_1__.Numeric.gcd(...this._left.getNumerators(), ...this._right.getNumerators()));
        return this;
    };
    isolate = (letter) => {
        if (this.degree(letter) !== 1) {
            return false;
        }
        if (this.isMultiVariable()) {
            return false;
        }
        let mMove, cMove;
        this._left.subtract(this._right);
        this._right.zero();
        for (let m of this._left.monoms) {
            if (!m.hasLetter(letter)) {
                mMove = m.clone();
                this._left.add(mMove.clone().opposed());
                this._right.add(mMove.clone().opposed());
            }
        }
        if (this._left.length !== 1) {
            return false;
        }
        cMove = this._left.monoms[0].coefficient.clone();
        this._left.divide(cMove);
        this._right.divide(cMove);
        return this;
    };
    replaceBy = (letter, P) => {
        this._left.replaceBy(letter, P);
        this._right.replaceBy(letter, P);
        return this;
    };
    multiply = (value) => {
        let F = new _coefficients__WEBPACK_IMPORTED_MODULE_2__.Fraction(value);
        this._left.multiply(F);
        this._right.multiply(F);
        if (this._sign !== '=' && F.sign() === -1) {
            this._reverseSign();
        }
        return this;
    };
    divide = (value) => {
        let F = new _coefficients__WEBPACK_IMPORTED_MODULE_2__.Fraction(value);
        if (F.isZero()) {
            return this;
        }
        else {
            return this.multiply(F.invert());
        }
    };
    degree = (letter) => {
        return Math.max(this._left.degree(letter), this._right.degree(letter));
    };
    isMultiVariable = () => {
        return this._left.isMultiVariable || this._right.isMultiVariable;
    };
    letters = () => {
        return [...new Set([...this._left.letters(), ...this._right.letters()])];
    };
    solve = (letter) => {
        this._solutions = [];
        this._polynom = this._left.clone().subtract(this._right);
        switch (this._polynom.degree(letter)) {
            case 0:
            case 1:
                this._solveDegree1(letter);
                break;
            case 2:
                this._solveDegree2(letter);
                break;
            default:
                this._solveDegree3plus(letter);
        }
        return this;
    };
    isGreater = () => {
        if (this._sign.indexOf('>') !== -1) {
            return true;
        }
        return this._sign.indexOf('geq') !== -1;
    };
    isStrictEqual = () => {
        return this._sign === '=';
    };
    isAlsoEqual = () => {
        if (this._sign.indexOf('=') !== -1) {
            return true;
        }
        if (this._sign.indexOf('geq') !== -1) {
            return true;
        }
        if (this._sign.indexOf('leq') !== -1) {
            return true;
        }
    };
    _solveDegree1 = (letter) => {
        const m1 = this._polynom.monomByDegree(1, letter).coefficient, m0 = this._polynom.monomByDegree(0, letter).coefficient, v = m0.clone().opposed().divide(m1).display;
        let s;
        if (this.isStrictEqual()) {
            if (m1.value === 0) {
                if (m0.value === 0) {
                    this._solutions = [this._real];
                }
                else {
                    this._solutions = [this._varnothing];
                }
            }
            else {
                this._solutions = [v];
            }
        }
        else {
            if (m1.value === 0) {
                if (m0.value === 0 && this.isAlsoEqual()) {
                    s = '\\mathbb{R}';
                }
                else {
                    if (m0.value > 0) {
                        s = this.isGreater() ? this._real : this._varnothing;
                    }
                    else {
                        s = !this.isGreater() ? this._real : this._varnothing;
                    }
                }
            }
            else {
                if ((this.isGreater() && m1.sign() === 1) || (!this.isGreater() && m1.sign() === -1)) {
                    s = `\\left${this.isAlsoEqual() ? '\\[' : '\\]'}${v};+\\infty\\right\\[`;
                }
                else {
                    s = `\\left\\]-\\infty;${v} \\right\\${this.isAlsoEqual() ? '\\]' : '\\['}`;
                }
            }
            this._solutions = [s];
        }
        return this._solutions;
    };
    _solveDegree2 = (letter) => {
        let aF = this._polynom.monomByDegree(2, letter).coefficient, bF = this._polynom.monomByDegree(1, letter).coefficient, cF = this._polynom.monomByDegree(0, letter).coefficient, delta, nthDelta, lcm = _numeric__WEBPACK_IMPORTED_MODULE_1__.Numeric.lcm(aF.denominator, bF.denominator, cF.denominator), a = aF.multiply(lcm).value, b = bF.multiply(lcm).value, c = cF.multiply(lcm).value, realX1, realX2, sX1, sX2;
        delta = b * b - 4 * a * c;
        if (delta > 0) {
            realX1 = (-b - Math.sqrt(delta)) / (2 * a);
            realX2 = (-b + Math.sqrt(delta)) / (2 * a);
            if (delta > 1.0e5) {
                this._solutions = [
                    ((-b - Math.sqrt(delta)) / (2 * a)).toFixed(5),
                    ((-b + Math.sqrt(delta)) / (2 * a)).toFixed(5)
                ];
            }
            else {
                nthDelta = new _coefficients__WEBPACK_IMPORTED_MODULE_2__.Nthroot().parse(delta).reduce();
                if (nthDelta.hasRadical()) {
                    let gcd = _numeric__WEBPACK_IMPORTED_MODULE_1__.Numeric.gcd(b, 2 * a, nthDelta.coefficient);
                    nthDelta.coefficient = nthDelta.coefficient / gcd;
                    if (b !== 0) {
                        if (2 * a / gcd === 1) {
                            this._solutions = [
                                `${-b / gcd} - ${nthDelta.tex}`,
                                `${-b / gcd} + ${nthDelta.tex}`,
                            ];
                        }
                        else {
                            this._solutions = [
                                `\\dfrac{${-b / gcd} - ${nthDelta.tex} }{ ${2 * a / gcd} }`,
                                `\\dfrac{${-b / gcd} + ${nthDelta.tex} }{ ${2 * a / gcd} }`,
                            ];
                        }
                    }
                    else {
                        if (2 * a / gcd === 1) {
                            this._solutions = [
                                `- ${nthDelta.tex}`,
                                `${nthDelta.tex}`,
                            ];
                        }
                        else {
                            this._solutions = [
                                `\\dfrac{- ${nthDelta.tex} }{ ${2 * a / gcd} }`,
                                `\\dfrac{${nthDelta.tex} }{ ${2 * a / gcd} }`,
                            ];
                        }
                    }
                }
                else {
                    this._solutions = [
                        new _coefficients__WEBPACK_IMPORTED_MODULE_2__.Fraction(-b - nthDelta.coefficient, 2 * a).reduce().dfrac,
                        new _coefficients__WEBPACK_IMPORTED_MODULE_2__.Fraction(-b + nthDelta.coefficient, 2 * a).reduce().dfrac
                    ];
                }
            }
        }
        else if (delta === 0) {
            this._solutions = [new _coefficients__WEBPACK_IMPORTED_MODULE_2__.Fraction(-b, 2 * a).reduce().dfrac];
        }
        else {
            this._solutions = [this._varnothing];
        }
        if (!this.isStrictEqual()) {
            if (this._solutions.length === 2) {
                sX1 = (realX1 < realX2) ? this._solutions[0] : this._solutions[1];
                sX2 = (realX1 < realX2) ? this._solutions[1] : this._solutions[0];
                if ((this.isGreater() && aF.sign() === 1) || (!this.isGreater() && aF.sign() === -1)) {
                    this._solutions = [
                        `\\left]-\\infty ; ${sX1}\\right${this.isAlsoEqual() ? ']' : '['} \\cup \\left${this.isAlsoEqual() ? '[' : ']'}${sX2};+\\infty\\right[`
                    ];
                }
                else {
                    this._solutions = [
                        `\\left${this.isAlsoEqual() ? '[' : ']'}${sX1} ; ${sX2}\\right${this.isAlsoEqual() ? ']' : '['}`
                    ];
                }
            }
            else if (this._solutions.length === 1 && this._solutions[0] !== this._varnothing) {
                if (!this.isAlsoEqual()) {
                    if ((this.isGreater() && aF.sign() === 1) || (!this.isGreater() && aF.sign() === -1)) {
                        this._solutions = [
                            `\\left]-\\infty ; ${this._solutions[0]}\\right[ \\cup \\left]${this._solutions[0]};+\\infty\\right[`
                        ];
                    }
                    else {
                        this._solutions = [this._varnothing];
                    }
                }
                else {
                    if ((this.isGreater() && aF.sign() === 1) || (!this.isGreater() && aF.sign() === -1)) {
                        this._solutions = [this._real];
                    }
                    else {
                    }
                }
            }
            else {
                if (this.isGreater()) {
                    this._solutions = [aF.sign() === 1 ? this._real : this._varnothing];
                }
                else {
                    this._solutions = [aF.sign() === -1 ? this._real : this._varnothing];
                }
            }
        }
        return this._solutions;
    };
    _solveDegree3plus = (letter) => {
        this._solutions = [letter];
        return this._solutions;
    };
}
//# sourceMappingURL=equation.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/algebra/index.js":
/*!********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/algebra/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Equation": () => (/* reexport safe */ _equation__WEBPACK_IMPORTED_MODULE_0__.Equation),
/* harmony export */   "LinearSystem": () => (/* reexport safe */ _linearSystem__WEBPACK_IMPORTED_MODULE_1__.LinearSystem),
/* harmony export */   "Logicalset": () => (/* reexport safe */ _logicalset__WEBPACK_IMPORTED_MODULE_2__.Logicalset),
/* harmony export */   "Monom": () => (/* reexport safe */ _monom__WEBPACK_IMPORTED_MODULE_3__.Monom),
/* harmony export */   "Polynom": () => (/* reexport safe */ _polynom__WEBPACK_IMPORTED_MODULE_4__.Polynom),
/* harmony export */   "Rational": () => (/* reexport safe */ _rational__WEBPACK_IMPORTED_MODULE_5__.Rational)
/* harmony export */ });
/* harmony import */ var _equation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./equation */ "./node_modules/pimath/esm/maths/algebra/equation.js");
/* harmony import */ var _linearSystem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./linearSystem */ "./node_modules/pimath/esm/maths/algebra/linearSystem.js");
/* harmony import */ var _logicalset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logicalset */ "./node_modules/pimath/esm/maths/algebra/logicalset.js");
/* harmony import */ var _monom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./monom */ "./node_modules/pimath/esm/maths/algebra/monom.js");
/* harmony import */ var _polynom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./polynom */ "./node_modules/pimath/esm/maths/algebra/polynom.js");
/* harmony import */ var _rational__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rational */ "./node_modules/pimath/esm/maths/algebra/rational.js");






//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/algebra/linearSystem.js":
/*!***************************************************************!*\
  !*** ./node_modules/pimath/esm/maths/algebra/linearSystem.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LinearSystem": () => (/* binding */ LinearSystem)
/* harmony export */ });
/* harmony import */ var _coefficients__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../coefficients */ "./node_modules/pimath/esm/maths/coefficients/index.js");
/* harmony import */ var _equation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./equation */ "./node_modules/pimath/esm/maths/algebra/equation.js");
/* harmony import */ var _polynom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./polynom */ "./node_modules/pimath/esm/maths/algebra/polynom.js");
/* harmony import */ var _random__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../random */ "./node_modules/pimath/esm/maths/random/index.js");




class LinearSystem {
    _solutions;
    _resolutionSteps;
    _equations;
    _letters;
    constructor(...equationStrings) {
        this._equations = [];
        this._letters = 'xy'.split('');
        if (equationStrings !== undefined && equationStrings.length > 0) {
            this.parse(...equationStrings);
        }
        return this;
    }
    get isLinerarSystem() {
        return true;
    }
    get equations() {
        return this._equations;
    }
    set equations(value) {
        this._equations = value;
    }
    get letters() {
        return this._letters.join('');
    }
    set letters(value) {
        this._letters = value.split('');
    }
    get isSolvable() {
        let V = this.variables;
        if (V.length !== this._equations.length) {
            return false;
        }
        return true;
    }
    get variables() {
        let V = [];
        for (let E of this._equations) {
            V = V.concat(E.variables);
        }
        return [...new Set(V)].sort();
    }
    get tex() {
        let LS = this.clone().reorder(), letters = LS.variables, equStr, equArray = [], m;
        for (let equ of LS.equations) {
            equStr = [];
            for (let L of letters) {
                m = equ.left.monomByLetter(L);
                if (equStr.length === 0) {
                    equStr.push(m.isZero() ? '' : m.tex);
                }
                else {
                    equStr.push(m.isZero() ? '' : ((m.coefficient.sign() === 1) ? '+' : '') + m.tex);
                }
            }
            equStr.push('=');
            equStr.push(equ.right.tex);
            equArray.push(equStr.join('&'));
        }
        return `\\left\\{\\begin{array}{${"r".repeat(letters.length)}cl}${equArray.join('\\\\\ ')}\\end{array}\\right.`;
    }
    get texSolution() {
        let tex = [];
        if (this._solutions === undefined) {
            this.solve();
        }
        for (let letter in this._solutions) {
            if (this._solutions[letter].isReal) {
                console.log(`Undetermined (letter ${letter})`);
                return;
            }
            if (this._solutions[letter].isVarnothing) {
                console.log(`Undefined (letter ${letter})`);
                return;
            }
            tex.push(this._solutions[letter].value.dfrac);
        }
        return `(${tex.join(';')})`;
    }
    parse = (...equations) => {
        this._equations = equations.map(value => new _equation__WEBPACK_IMPORTED_MODULE_1__.Equation(value));
        this._findLetters();
        return this;
    };
    setCoefficient = (...coefficients) => {
        this._equations = [];
        let i = 0;
        while (i < coefficients.length - this._letters.length) {
            let left = new _polynom__WEBPACK_IMPORTED_MODULE_2__.Polynom().parse(this._letters.join(''), ...coefficients.slice(i, i + this._letters.length)), right = new _polynom__WEBPACK_IMPORTED_MODULE_2__.Polynom(coefficients[i + this._letters.length].toString()), equ = new _equation__WEBPACK_IMPORTED_MODULE_1__.Equation().create(left, right);
            this._equations.push(equ.clone());
            i = i + this._letters.length + 1;
        }
        return this;
    };
    clone = () => {
        return new LinearSystem().parse(...this._equations.map(equ => equ.clone()));
    };
    setLetters = (...letters) => {
        this._letters = letters;
        return this;
    };
    _findLetters = () => {
        let variables = new Set();
        for (let equ of this._equations) {
            variables = new Set([...variables, ...equ.variables]);
        }
        this._letters = [...variables];
        return this;
    };
    generate = (...solutions) => {
        let solutionsF = [];
        for (let s of solutions) {
            if (typeof s === "number") {
                solutionsF.push(new _coefficients__WEBPACK_IMPORTED_MODULE_0__.Fraction(s.toString()));
            }
            else {
                solutionsF.push(s.clone());
            }
        }
        this._equations = [];
        for (let i = 0; i < solutions.length; i++) {
            this._equations.push(this._generateOneEquation(...solutionsF));
        }
        return this;
    };
    _generateOneEquation = (...solutions) => {
        let coeff = [], leftValue = new _coefficients__WEBPACK_IMPORTED_MODULE_0__.Fraction().zero(), letters = ['x', 'y', 'z', 't', 'u', 'v', 'w', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'], equString = '', equ;
        for (let i = 0; i < solutions.length; i++) {
            coeff.push(_random__WEBPACK_IMPORTED_MODULE_3__.Random.numberSym(5));
            leftValue.add(solutions[i].clone().multiply(coeff[i]));
            equString += `${(coeff[i] < 0) ? coeff[i] : '+' + coeff[i]}${letters[i]}`;
        }
        equ = new _equation__WEBPACK_IMPORTED_MODULE_1__.Equation(`${equString}=${leftValue.display}`);
        if (equ.right.monoms[0].coefficient.denominator != 1) {
            equ.multiply(new _coefficients__WEBPACK_IMPORTED_MODULE_0__.Fraction(equ.right.monoms[0].coefficient.denominator, 1));
        }
        if (this._checkIfLinerCombination(equ)) {
            return equ;
        }
        else {
            return this._generateOneEquation(...solutions);
        }
    };
    _linearReduction(eq1, eq2, letter) {
        let c1 = eq1.left.monomByDegree(1, letter).coefficient.clone(), c2 = eq2.left.monomByDegree(1, letter).coefficient.clone().opposed();
        return this.mergeEquations(eq1, eq2, c2, c1);
    }
    mergeEquations = (eq1, eq2, factor1, factor2) => {
        let eq1multiplied = eq1.clone().multiply(new _coefficients__WEBPACK_IMPORTED_MODULE_0__.Fraction(factor1)), eq2multiplied = eq2.clone().multiply(new _coefficients__WEBPACK_IMPORTED_MODULE_0__.Fraction(factor2));
        eq1multiplied.left.add(eq2multiplied.left);
        eq1multiplied.right.add(eq2multiplied.right);
        return eq1multiplied;
    };
    reorder = () => {
        for (let E of this._equations) {
            E.reorder();
        }
        return this;
    };
    solve = () => {
        this._solutions = {};
        this._resolutionSteps = [];
        this.reorder();
        let V = this.variables.sort();
        for (let letter of V) {
            this._solutions[letter] = this._solveOneLetter(letter, V);
        }
        return this;
    };
    _checkIfLinerCombination = (equ) => {
        return true;
    };
    _solveOneLetter(letter, V) {
        let LE = this.clone().equations, reducedEquations = [];
        for (let L of V) {
            if (L === letter) {
                continue;
            }
            for (let i = 0; i < LE.length - 1; i++) {
                reducedEquations.push(this._linearReduction(LE[i], LE[i + 1], L));
            }
            this._resolutionSteps.push(new LinearSystem().parse(...reducedEquations));
            LE = this._resolutionSteps[this._resolutionSteps.length - 1].clone().equations;
            reducedEquations = [];
        }
        let E = this._resolutionSteps[this._resolutionSteps.length - 1].equations[0];
        E.solve();
        return {
            value: new _coefficients__WEBPACK_IMPORTED_MODULE_0__.Fraction(E.solutions[0]),
            isReal: E.isReal,
            isVarnothing: E.isVarnothing
        };
    }
    log = () => {
        let str = '';
        for (let E of this._equations) {
            console.log(E.tex);
            str += `${E.tex}\\n}`;
        }
        return str;
    };
}
//# sourceMappingURL=linearSystem.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/algebra/logicalset.js":
/*!*************************************************************!*\
  !*** ./node_modules/pimath/esm/maths/algebra/logicalset.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Logicalset": () => (/* binding */ Logicalset)
/* harmony export */ });
/* harmony import */ var _shutingyard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shutingyard */ "./node_modules/pimath/esm/maths/shutingyard.js");

class Logicalset {
    _rawString;
    _rpn;
    constructor(value) {
        this._rawString = value;
        this.parse(value);
        return this;
    }
    get isLogicalset() {
        return true;
    }
    ;
    parse = (value) => {
        this._rpn = new _shutingyard__WEBPACK_IMPORTED_MODULE_0__.Shutingyard('set').parse(value).rpn;
        return this;
    };
    evaluate(tokenSets, reference) {
        let varStack = [];
        let referenceSet;
        if (reference === undefined) {
            referenceSet = new Set();
            for (let key in tokenSets) {
                referenceSet = new Set([...referenceSet, ...tokenSets[key]]);
            }
        }
        else {
            referenceSet = new Set(reference);
        }
        for (let token of this._rpn) {
            if (token.tokenType === 'variable') {
                if (tokenSets[token.token] === undefined) {
                    varStack.push(new Set());
                }
                else {
                    varStack.push(new Set(tokenSets[token.token]));
                }
            }
            else {
                switch (token.token) {
                    case '&':
                        if (varStack.length >= 2) {
                            let second = varStack.pop(), first = varStack.pop();
                            varStack.push(new Set([...first].filter(x => second.has(x))));
                        }
                        break;
                    case '|':
                        if (varStack.length >= 2) {
                            let second = varStack.pop(), first = varStack.pop();
                            varStack.push(new Set([...first, ...second]));
                        }
                        break;
                    case '-':
                        if (varStack.length >= 2) {
                            let second = varStack.pop(), first = varStack.pop();
                            varStack.push(new Set([...first].filter(x => !second.has(x))));
                        }
                        break;
                    case '!':
                        if (varStack.length >= 1) {
                            let first = varStack.pop();
                            varStack.push(new Set([...referenceSet].filter(x => !first.has(x))));
                        }
                        break;
                }
            }
        }
        return [...varStack[0]].sort();
    }
    vennAB() {
        return this.evaluate({
            A: ['A', 'AB'],
            B: ['B', 'AB']
        }, ['A', 'B', 'AB', 'E']);
    }
    vennABC() {
        return this.evaluate({
            A: ['A', 'AB', 'AC', 'ABC'],
            B: ['B', 'AB', 'BC', 'ABC'],
            C: ['C', 'AC', 'BC', 'ABC']
        }, ['A', 'B', 'C', 'AB', 'AC', 'BC', 'E']);
    }
    get rpn() {
        return this._rpn;
    }
    get tex() {
        let varStack = [];
        for (let token of this._rpn) {
            if (token.tokenType === 'variable') {
                varStack.push(token);
            }
            else {
                switch (token.token) {
                    case '&':
                        if (varStack.length >= 2) {
                            let second = varStack.pop(), first = varStack.pop();
                            if (first.tokenType === 'mix') {
                                first.token = `( ${first.token} )`;
                            }
                            if (second.tokenType === 'mix') {
                                second.token = `( ${second.token} )`;
                            }
                            varStack.push({ token: `${first.token} \\cap ${second.token}`, tokenType: 'mix' });
                        }
                        break;
                    case '|':
                        if (varStack.length >= 2) {
                            let second = varStack.pop(), first = varStack.pop();
                            if (first.tokenType === 'mix') {
                                first.token = `( ${first.token} )`;
                            }
                            if (second.tokenType === 'mix') {
                                second.token = `( ${second.token} )`;
                            }
                            varStack.push({ token: `${first.token} \\cup ${second.token}`, tokenType: 'mix' });
                        }
                        break;
                    case '-':
                        if (varStack.length >= 2) {
                            let second = varStack.pop(), first = varStack.pop();
                            if (first.tokenType === 'mix') {
                                first.token = `( ${first.token} )`;
                            }
                            if (second.tokenType === 'mix') {
                                second.token = `( ${second.token} )`;
                            }
                            varStack.push({ token: `${first.token} \\setminus ${second.token}`, tokenType: 'mix' });
                        }
                        break;
                    case '!':
                        if (varStack.length >= 1) {
                            let first = varStack.pop();
                            varStack.push({ token: `\\overline{ ${first.token} }`, tokenType: 'variable' });
                        }
                        break;
                }
            }
        }
        return varStack[0].token;
    }
}
//# sourceMappingURL=logicalset.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/algebra/monom.js":
/*!********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/algebra/monom.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Monom": () => (/* binding */ Monom)
/* harmony export */ });
/* harmony import */ var _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../coefficients/fraction */ "./node_modules/pimath/esm/maths/coefficients/fraction.js");
/* harmony import */ var _numeric__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../numeric */ "./node_modules/pimath/esm/maths/numeric.js");


class Monom {
    _coefficient;
    _literal;
    constructor(value) {
        this.zero();
        if (value !== undefined) {
            this.parse(value);
        }
        return this;
    }
    get isMonom() {
        return true;
    }
    get coefficient() {
        return this._coefficient;
    }
    set coefficient(F) {
        this._coefficient = F;
    }
    get literal() {
        return this._literal;
    }
    get literalSqrt() {
        if (this.isLitteralSquare()) {
            let L = {};
            for (let key in this._literal) {
                L[key] = this._literal[key] / 2;
            }
            return L;
        }
        else {
            return this._literal;
        }
    }
    set literal(L) {
        this._literal = L;
    }
    set literalStr(inputStr) {
        for (const v of [...inputStr.matchAll(/([a-z])\^([+-]?[0-9]+)/g)]) {
            if (!(v[1] in this._literal)) {
                this._literal[v[1]] = 0;
            }
            this._literal[v[1]] += +v[2];
        }
        for (const v of [...inputStr.matchAll(/([a-z](?!\^))/g)]) {
            if (!(v[1] in this._literal)) {
                this._literal[v[1]] = 0;
            }
            this._literal[v[1]] += 1;
        }
    }
    get variables() {
        this.clone().clean();
        return Object.keys(this._literal);
    }
    get display() {
        let L = '';
        for (let letter in this._literal) {
            if (this._literal[letter] !== 0) {
                L += `${letter}`;
                if (this._literal[letter] > 1) {
                    L += `^${this._literal[letter]}`;
                }
            }
        }
        if (L === '') {
            if (this._coefficient.value != 0) {
                return `${this._coefficient.display}`;
            }
            else {
                return '';
            }
        }
        else {
            if (this._coefficient.value === 1) {
                return L;
            }
            else if (this._coefficient.value === -1) {
                return `-${L}`;
            }
            else if (this._coefficient.value === 0) {
                return '0';
            }
            else {
                return `${this._coefficient.display}${L}`;
            }
        }
    }
    get dividers() {
        if (this.coefficient.denominator !== 1) {
            return [this.clone()];
        }
        if (this.coefficient.numerator > 10000) {
            return [this.clone()];
        }
        const dividers = _numeric__WEBPACK_IMPORTED_MODULE_1__.Numeric.dividers(Math.abs(this.coefficient.numerator));
        let litterals = [];
        for (let L in this.literal) {
            litterals = this._getLitteralDividers(litterals, L);
        }
        const monomDividers = [];
        if (litterals.length > 0 && dividers.length > 0) {
            for (let N of dividers) {
                for (let L of litterals) {
                    let M = new Monom();
                    M.coefficient = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(N);
                    M.literal = L;
                    monomDividers.push(M);
                }
            }
        }
        else if (dividers.length === 0) {
            for (let L of litterals) {
                let M = new Monom();
                M.coefficient = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction().one();
                M.literal = L;
                monomDividers.push(M);
            }
        }
        else {
            for (let N of dividers) {
                let M = new Monom();
                M.coefficient = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(N);
                monomDividers.push(M);
            }
        }
        return monomDividers.length === 0 ? [new Monom().one()] : monomDividers;
    }
    _getLitteralDividers(arr, letter) {
        let tmpList = [];
        for (let d = 0; d <= this.literal[letter]; d++) {
            if (arr.length === 0) {
                let litt = {};
                litt[letter] = d;
                tmpList.push(litt);
            }
            else {
                for (let item of arr) {
                    let litt = {};
                    for (let currentLetter in item) {
                        litt[currentLetter] = item[currentLetter];
                    }
                    litt[letter] = d;
                    tmpList.push(litt);
                }
            }
        }
        return tmpList;
    }
    get displayWithSign() {
        let d = this.display;
        return (d[0] !== '-' ? '+' : '') + d;
    }
    get tex() {
        let L = '';
        for (let letter in this._literal) {
            if (this._literal[letter] !== 0) {
                L += `${letter}`;
                if (this._literal[letter] > 1) {
                    L += `^${this._literal[letter]}`;
                }
            }
        }
        if (L === '') {
            if (this._coefficient.value != 0) {
                return `${this._coefficient.dfrac}`;
            }
            else {
                return '0';
            }
        }
        else {
            if (this._coefficient.value === 1) {
                return L;
            }
            else if (this._coefficient.value === -1) {
                return `-${L}`;
            }
            else if (this._coefficient.value === 0) {
                return '0';
            }
            else {
                return `${this._coefficient.dfrac}${L}`;
            }
        }
    }
    parse = (inputStr) => {
        this.literalStr = inputStr;
        this._coefficient = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction();
        for (const v of [...inputStr.replace(/([a-z])|(\^[+-]?[0-9]+)/g, ',').split(',')]) {
            if (v.trim() === '') {
                continue;
            }
            this._coefficient.multiply(new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(v.trim()));
        }
        return this;
    };
    clone = () => {
        let F = new Monom();
        F.coefficient = this._coefficient.clone();
        for (let k in this._literal) {
            F.setLetter(k, this._literal[k]);
        }
        return F;
    };
    zero = () => {
        this._coefficient = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction().zero();
        this._literal = {};
        return this;
    };
    one = () => {
        this._coefficient = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction().one();
        this._literal = {};
        return this;
    };
    clean = () => {
        for (let letter in this._literal) {
            if (this._literal[letter] === 0) {
                delete this._literal[letter];
            }
        }
        return this;
    };
    opposed = () => {
        this._coefficient.opposed();
        return this;
    };
    add = (...M) => {
        for (let m of M) {
            if (this.isSameAs(m)) {
                this._coefficient.add(m.coefficient);
            }
            else {
                console.log('Add: Is not similar: ', m.display);
            }
        }
        return this;
    };
    subtract = (...M) => {
        for (let m of M) {
            if (this.isSameAs(m)) {
                this._coefficient.add(m.coefficient.clone().opposed());
            }
            else {
                console.log('Subtract: Is not similar: ', m.display);
            }
        }
        return this;
    };
    multiply = (...M) => {
        for (let m of M) {
            this._coefficient.multiply(m.coefficient);
            for (let letter in m.literal) {
                this._literal[letter] = (this._literal[letter] === undefined) ? m.literal[letter] : this._literal[letter] + m.literal[letter];
            }
        }
        return this;
    };
    multiplyByNumber = (F) => {
        this._coefficient.multiply(F);
        return this;
    };
    divide = (...M) => {
        for (let v of M) {
            this._coefficient.divide(v.coefficient);
            for (let letter in v.literal) {
                this._literal[letter] = (this._literal[letter] === undefined) ? -v.literal[letter] : this._literal[letter] - v.literal[letter];
                if (this._literal[letter] === 0) {
                    delete this._literal[letter];
                }
            }
        }
        return this;
    };
    pow = (nb) => {
        this._coefficient.pow(nb);
        for (let letter in this._literal) {
            this._literal[letter] *= nb;
        }
        return this;
    };
    root = (p) => {
        return this;
    };
    sqrt = () => {
        if (this.isSquare()) {
            this._coefficient.sqrt();
            for (let letter in this._literal) {
                this._literal[letter] /= 2;
            }
        }
        return this.root(2);
    };
    compare = (M, sign) => {
        if (sign === undefined) {
            sign = '=';
        }
        switch (sign) {
            case '=':
                if (!this.compare(M, 'same')) {
                    return false;
                }
                return this._coefficient.isEqual(M.coefficient);
            case 'same':
                let M1 = this.variables, M2 = M.variables, K = M1.concat(M2.filter((item) => M1.indexOf(item) < 0));
                for (let key of K) {
                    if (this._literal[key] === undefined || M.literal[key] === undefined) {
                        return false;
                    }
                    if (this._literal[key] !== M.literal[key]) {
                        return false;
                    }
                }
                return true;
            default:
                return false;
        }
    };
    isZero() {
        return this._coefficient.value === 0;
    }
    isOne() {
        return this._coefficient.value === 1 && this.variables.length === 0;
    }
    isEqual = (M) => {
        return this.compare(M, '=');
    };
    isSameAs = (M) => {
        return this.compare(M, 'same');
    };
    isSquare = () => {
        if (!this.coefficient.isSquare()) {
            return false;
        }
        return this.isLitteralSquare();
    };
    isLitteralSquare = () => {
        for (let letter in this.literal) {
            if (this.literal[letter] % 2 !== 0) {
                return false;
            }
        }
        return true;
    };
    hasLetter = (letter) => {
        return this._literal[letter === undefined ? 'x' : letter] > 0;
    };
    setLetter = (letter, pow) => {
        if (pow <= 0 || !Number.isSafeInteger(pow)) {
            if (this._literal[letter] !== undefined) {
                delete this._literal[letter];
            }
        }
        else {
            this._literal[letter] = pow;
        }
    };
    degree = (letter) => {
        if (this.variables.length === 0) {
            return 0;
        }
        if (letter === undefined) {
            return Object.values(this._literal).reduce((t, n) => t + n);
        }
        else {
            return this._literal[letter] === undefined ? 0 : this._literal[letter];
        }
    };
    evaluate = (values) => {
        let r = this.coefficient.clone();
        if (typeof values === 'number' || values instanceof _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction) {
            let tmpValues = {};
            tmpValues[this.variables[0]] = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(values);
            return this.evaluate(tmpValues);
        }
        if (typeof values === 'object') {
            for (let L in this._literal) {
                if (values[L] === undefined) {
                    return new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction().zero();
                }
                let value = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(values[L]);
                r.multiply(value.pow(this._literal[L]));
            }
        }
        return r;
    };
    derivative = (letter) => {
        if (letter === undefined) {
            letter = 'x';
        }
        if (this.hasLetter(letter)) {
            let d = +this._literal[letter], dM = this.clone();
            dM._literal[letter] -= 1;
            dM._coefficient.multiply(new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction('' + d));
            return dM;
        }
        else {
            return new Monom().zero();
        }
    };
    primitive = (letter) => {
        if (letter === undefined) {
            letter = 'x';
        }
        let M = this.clone();
        if (M.hasLetter(letter)) {
            M.coefficient = M.coefficient.clone().divide(M.degree(letter) + 1);
            M.setLetter(letter, M.degree(letter) + 1);
        }
        else {
            if (M.coefficient.isZero()) {
                M.coefficient = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction().one();
            }
            M.setLetter(letter, 1);
        }
        return M;
    };
    static lcm = (...monoms) => {
        let M = new Monom(), coeffN = monoms.map(value => value.coefficient.numerator), coeffD = monoms.map(value => value.coefficient.denominator), n = _numeric__WEBPACK_IMPORTED_MODULE_1__.Numeric.gcd(...coeffN), d = _numeric__WEBPACK_IMPORTED_MODULE_1__.Numeric.lcm(...coeffD);
        M.coefficient = new _coefficients_fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction(n, d).reduce();
        for (let m of monoms) {
            for (let letter in M.literal) {
                if (!(letter in m.literal)) {
                    M.literal[letter] = 0;
                }
            }
            for (let letter in m.literal) {
                if (M.literal[letter] === undefined && m.literal[letter] > 0) {
                    M.literal[letter] = m.literal[letter];
                }
                else {
                    M.literal[letter] = Math.min(m.literal[letter], M.literal[letter]);
                }
            }
        }
        return M;
    };
    static xmultiply = (...monoms) => {
        let M = new Monom().one();
        for (let m of monoms) {
            M.multiply(m);
        }
        return M;
    };
    areSameAs = (...M) => {
        let result = true;
        for (let i = 0; i < M.length; i++) {
            if (!this.isSameAs(M[i])) {
                return false;
            }
        }
        return result;
    };
    areEquals = (...M) => {
        if (!this.areSameAs(...M)) {
            return false;
        }
        for (let m of M) {
            if (!this._coefficient.isEqual(m.coefficient)) {
                return false;
            }
        }
        return true;
    };
}
//# sourceMappingURL=monom.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/algebra/polynom.js":
/*!**********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/algebra/polynom.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Polynom": () => (/* binding */ Polynom)
/* harmony export */ });
/* harmony import */ var _monom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./monom */ "./node_modules/pimath/esm/maths/algebra/monom.js");
/* harmony import */ var _shutingyard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shutingyard */ "./node_modules/pimath/esm/maths/shutingyard.js");
/* harmony import */ var _numeric__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../numeric */ "./node_modules/pimath/esm/maths/numeric.js");
/* harmony import */ var _random__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../random */ "./node_modules/pimath/esm/maths/random/index.js");
/* harmony import */ var _coefficients__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../coefficients */ "./node_modules/pimath/esm/maths/coefficients/index.js");





class Polynom {
    _rawString;
    _monoms;
    _factors;
    _texString;
    constructor(polynomString, ...values) {
        this._monoms = [];
        this._factors = [];
        if (polynomString !== undefined) {
            this.parse(polynomString, ...values);
        }
        return this;
    }
    get isPolynom() {
        return true;
    }
    ;
    get monoms() {
        return this._monoms;
    }
    set monoms(M) {
        this._monoms = M;
    }
    get factors() {
        return this._factors;
    }
    set factors(value) {
        this._factors = value;
    }
    get texFactors() {
        this.factorize();
        let tex = '';
        for (let f of this.factors) {
            if (f.monoms.length > 1) {
                tex += `(${f.tex})`;
            }
            else {
                tex = f.tex + tex;
            }
        }
        return tex;
    }
    get texString() {
        return this._texString;
    }
    get length() {
        return this._monoms.length;
    }
    get display() {
        return this.genDisplay();
    }
    get raw() {
        return this._rawString;
    }
    get tex() {
        return this.genDisplay('tex');
    }
    get isMultiVariable() {
        const B = false;
        for (const m of this._monoms) {
            if (m.variables.length > 1) {
                return true;
            }
        }
        return B;
    }
    get variables() {
        let V = [];
        for (const m of this._monoms) {
            V = V.concat(m.variables);
        }
        V = [...new Set(V)];
        return V;
    }
    get numberOfVars() {
        return this.variables.length;
    }
    genDisplay = (output, forceSign, wrapParentheses) => {
        let P = '';
        for (const k of this._monoms) {
            if (k.coefficient.value === 0) {
                continue;
            }
            P += `${(k.coefficient.sign() === 1 && (P !== '' || forceSign === true)) ? '+' : ''}${(output === 'tex') ? k.tex : k.display}`;
        }
        if (wrapParentheses === true && this.length > 1) {
            if (output === 'tex') {
                P = `\\left( ${P} \\right)`;
            }
            else {
                P = `(${P})`;
            }
        }
        if (P === '') {
            P = '0';
        }
        return P;
    };
    parse = (inputStr, ...values) => {
        if (values === undefined || values.length === 0) {
            inputStr = '' + inputStr;
            this._rawString = inputStr;
            if (inputStr !== '' && !isNaN(Number(inputStr))) {
                this.empty();
                let m = new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom();
                m.coefficient = new _coefficients__WEBPACK_IMPORTED_MODULE_4__.Fraction(inputStr);
                m.literalStr = '';
                this.add(m);
                return this;
            }
            return this.shutingYardToReducedPolynom(inputStr);
        }
        else if (/^[a-z]/.test(inputStr)) {
            this.empty();
            let fractions = values.map(x => new _coefficients__WEBPACK_IMPORTED_MODULE_4__.Fraction(x));
            if (inputStr.length > 1) {
                let letters = inputStr.split(''), i = 0;
                for (let F of fractions) {
                    let m = new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom();
                    m.coefficient = F.clone();
                    m.literalStr = letters[i] || '';
                    this.add(m);
                    i++;
                }
            }
            else {
                let n = fractions.length - 1;
                for (let F of fractions) {
                    let m = new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom();
                    m.coefficient = F.clone();
                    m.literalStr = `${inputStr}^${n}`;
                    this.add(m);
                    n--;
                }
            }
            return this;
        }
        else {
            return this.zero();
        }
    };
    shutingYardToReducedPolynom = (inputStr) => {
        const SY = new _shutingyard__WEBPACK_IMPORTED_MODULE_1__.Shutingyard().parse(inputStr);
        const rpn = SY.rpn;
        let m1;
        let m2;
        let stack = [], previousToken = null, tempPolynom;
        for (const element of rpn) {
            if (element.tokenType === 'coefficient' || element.tokenType === 'variable') {
                tempPolynom = new Polynom().zero();
                tempPolynom.monoms = [new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom(element.token)];
                stack.push(tempPolynom.clone());
            }
            else if (element.tokenType === 'operation') {
                m2 = (stack.pop()) || new Polynom().zero();
                m1 = (stack.pop()) || new Polynom().zero();
                switch (element.token) {
                    case '+':
                        stack.push(m1.add(m2));
                        break;
                    case '-':
                        stack.push(m1.subtract(m2));
                        break;
                    case '*':
                        stack.push(m1.multiply(m2));
                        break;
                    case '^':
                        stack.push(m1.pow(+previousToken));
                }
            }
            previousToken = element.token;
        }
        this._monoms = stack[0].monoms;
        return this;
    };
    clone = () => {
        const P = new Polynom();
        const M = [];
        for (const m of this._monoms) {
            M.push(m.clone());
        }
        P.monoms = M;
        return P;
    };
    zero = () => {
        this._monoms = [];
        this._monoms.push(new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom().zero());
        this._rawString = '0';
        return this;
    };
    one = () => {
        this._monoms = [];
        this._monoms.push(new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom().one());
        this._rawString = '1';
        return this;
    };
    empty = () => {
        this._monoms = [];
        this._rawString = '';
        return this;
    };
    random(config) {
        return _random__WEBPACK_IMPORTED_MODULE_3__.Random.polynom(config);
    }
    _randomizeDefaults = {
        degree: 2,
        unit: true,
        fractions: false,
        factorable: false,
        letters: 'x',
        allowNullMonom: false,
        numberOfMonoms: false
    };
    get randomizeDefaults() {
        return this._randomizeDefaults;
    }
    set randomizeDefaults(value) {
        this._randomizeDefaults = value;
    }
    randomize = (config) => {
        let P = new Polynom();
        if (config === undefined) {
            config = {};
        }
        for (let k in this._randomizeDefaults) {
            if (config[k] === undefined) {
                config[k] = this._randomizeDefaults[k];
            }
        }
        return P;
    };
    rndFactorable = (degree = 2, unit = false, letters = 'x') => {
        this._factors = [];
        for (let i = 0; i < degree; i++) {
            let factorUnit = unit === true || i >= unit, p = _random__WEBPACK_IMPORTED_MODULE_3__.Random.polynom({
                degree: 1,
                unit: factorUnit,
                fraction: false,
                letters
            });
            this._factors.push(p);
        }
        this.empty().monoms = this._factors[0].monoms;
        for (let i = 1; i < this._factors.length; i++) {
            this.multiply(this._factors[i]);
        }
        return this;
    };
    opposed = () => {
        this._monoms = this._monoms.map(m => m.opposed());
        return this;
    };
    add = (...values) => {
        for (let value of values) {
            if (value.isPolynom) {
                this._monoms = this._monoms.concat(value.monoms);
            }
            else if (value.isMonom) {
                this._monoms.push(value.clone());
            }
            else if (Number.isSafeInteger(value)) {
                this._monoms.push(new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom(value.toString()));
            }
            else {
                this._monoms.push(new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom(value));
            }
        }
        return this.reduce();
    };
    subtract = (...values) => {
        for (let value of values) {
            if (value.isPolynom) {
                this._monoms = this._monoms.concat(value.clone().opposed().monoms);
            }
            else if (value.isMonom) {
                this._monoms.push(value.clone().opposed());
            }
            else if (Number.isSafeInteger(value)) {
                this._monoms.push(new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom(value.toString()).opposed());
            }
            else {
                this._monoms.push(new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom(value).opposed());
            }
        }
        return this.reduce();
    };
    multiply = (value) => {
        if (value.isPolynom) {
            return this.multiplyByPolynom(value);
        }
        else if (value.isFraction) {
            return this.multiplyByFraction(value);
        }
        else if (value.isMonom) {
            return this.multiplyByMonom(value);
        }
        else if (Number.isSafeInteger(value)) {
            return this.multiplyByInteger(value);
        }
        return this;
    };
    multiplyByPolynom = (P) => {
        const M = [];
        for (const m1 of this._monoms) {
            for (const m2 of P.monoms) {
                M.push(_monom__WEBPACK_IMPORTED_MODULE_0__.Monom.xmultiply(m1, m2));
            }
        }
        this._monoms = M;
        return this.reduce();
    };
    multiplyByFraction = (F) => {
        for (const m of this._monoms) {
            m.coefficient.multiply(F);
        }
        return this.reduce();
    };
    multiplyByInteger = (nb) => {
        return this.multiplyByFraction(new _coefficients__WEBPACK_IMPORTED_MODULE_4__.Fraction(nb));
    };
    multiplyByMonom = (M) => {
        for (const m of this._monoms) {
            m.multiply(M);
        }
        return this.reduce();
    };
    euclidian = (P) => {
        const letter = P.variables[0];
        const quotient = new Polynom().zero();
        const reminder = this.clone().reorder(letter);
        if (P.variables.length === 0) {
            return { quotient, reminder };
        }
        const maxMP = P.monomByDegree(undefined, letter);
        const degreeP = P.degree(letter);
        let newM;
        let MaxIteration = this.degree(letter) * 2;
        while (reminder.degree(letter) >= degreeP && MaxIteration >= 0) {
            MaxIteration--;
            newM = reminder.monomByDegree(undefined, letter).clone().divide(maxMP);
            if (newM.isZero()) {
                break;
            }
            quotient.add(newM);
            reminder.subtract(P.clone().multiply(newM));
        }
        return { quotient, reminder };
    };
    divide = (value) => {
        if (value.isFraction) {
            this.divideByFraction(value);
        }
        else if (Number.isSafeInteger(value)) {
            return this.divideByInteger(value);
        }
    };
    divideByInteger = (nb) => {
        const nbF = new _coefficients__WEBPACK_IMPORTED_MODULE_4__.Fraction(nb);
        for (const m of this._monoms) {
            m.coefficient.divide(nbF);
        }
        return this;
    };
    divideByFraction = (F) => {
        for (const m of this._monoms) {
            m.coefficient.divide(F);
        }
        return this;
    };
    pow = (nb) => {
        if (!Number.isSafeInteger(nb)) {
            return this.zero();
        }
        if (nb < 0) {
            return this.zero();
        }
        if (nb === 0) {
            return new Polynom();
        }
        const P = this.clone();
        for (let i = 1; i < nb; i++) {
            this.multiply(P);
        }
        return this.reduce();
    };
    compare = (P, sign) => {
        if (sign === undefined) {
            sign = '=';
        }
        const cP1 = this.clone().reduce().reorder();
        const cP2 = P.clone().reduce().reorder();
        switch (sign) {
            case '=':
                if (cP1.length !== cP2.length || cP1.degree() !== cP2.degree()) {
                    return false;
                }
                for (const i in cP1.monoms) {
                    if (!cP1.monoms[i].isEqual(cP2.monoms[i])) {
                        return false;
                    }
                }
                return true;
            case 'same':
                if (cP1.length !== cP2.length || cP1.degree() !== cP2.degree()) {
                    return false;
                }
                for (const i in cP1.monoms) {
                    if (!cP1.monoms[i].isSameAs(cP2.monoms[i])) {
                        return false;
                    }
                }
                return true;
            default:
                return false;
        }
    };
    isZero() {
        return (this._monoms.length === 1 && this._monoms[0].coefficient.isZero()) || this._monoms.length === 0;
    }
    isOne() {
        return this._monoms.length === 1 && this._monoms[0].coefficient.isOne();
    }
    isEqual = (P) => {
        return this.compare(P, '=');
    };
    isSameAs = (P) => {
        return this.compare(P, 'same');
    };
    isOpposedAt = (P) => {
        return this.compare(P.clone().opposed(), '=');
    };
    isFactorized = (polynomString) => {
        let P;
        if (polynomString.match(/\(/g).length !== polynomString.match(/\)/g).length) {
            return false;
        }
        try {
            P = new Polynom(polynomString);
        }
        catch (e) {
            return false;
        }
        if (!this.isEqual(P)) {
            return false;
        }
        let polynomStringNormalized = polynomString.replaceAll('*', ''), polynomStringReduced = '' + polynomStringNormalized, factors = [];
        for (let x of polynomStringNormalized.matchAll(/\(([a-z0-9+\-]+)\)(\^[0-9]*)?/g)) {
            if (x[2] !== undefined) {
                for (let i = 0; i < +x[2].substr(1); i++) {
                    factors.push(x[1]);
                }
            }
            else {
                factors.push(x[1]);
            }
            polynomStringReduced = polynomStringReduced.replaceAll(x[0], '');
        }
        if (polynomStringReduced !== '') {
            factors.push(polynomStringReduced);
        }
        let polyFactors = factors.map(x => new Polynom(x));
        this.factorize();
        let sign = 1;
        for (let f of this.factors) {
            for (let i = 0; i < polyFactors.length; i++) {
                if (f.isEqual(polyFactors[i])) {
                    polyFactors.splice(i, 1);
                    break;
                }
                else if (f.isOpposedAt(polyFactors[i])) {
                    polyFactors.splice(i, 1);
                    sign = -sign;
                    break;
                }
            }
        }
        return (polyFactors.length === 0 && sign === 1);
    };
    isDeveloped = (polynomString) => {
        let P;
        if (polynomString.match(/\(/g).length + polynomString.match(/\)/g).length) {
            return false;
        }
        try {
            P = new Polynom(polynomString);
        }
        catch (e) {
            return false;
        }
        if (!this.isEqual(P)) {
            return false;
        }
        let polynomStringNormalized = polynomString.replaceAll('[*\s]', '');
        return polynomStringNormalized === P.reduce().reorder().display;
    };
    reduce = () => {
        for (let i = 0; i < this._monoms.length; i++) {
            for (let j = i + 1; j < this._monoms.length; j++) {
                if (this._monoms[i].isSameAs(this.monoms[j])) {
                    this._monoms[i].add(this.monoms[j]);
                    this._monoms.splice(j, 1);
                }
            }
        }
        this._monoms = this._monoms.filter((m) => {
            return m.coefficient.value !== 0;
        });
        for (const m of this._monoms) {
            m.coefficient.reduce();
        }
        if (this.length === 0) {
            return new Polynom().zero();
        }
        return this;
    };
    reorder = (letter = 'x') => {
        this._monoms.sort(function (a, b) {
            return b.degree(letter) - a.degree(letter);
        });
        return this.reduce();
    };
    degree = (letter) => {
        let d = 0;
        for (const m of this._monoms) {
            d = Math.max(m.degree(letter), d);
        }
        return d;
    };
    letters = () => {
        let L = [], S = new Set();
        for (let m of this._monoms) {
            S = new Set([...S, ...m.variables]);
        }
        return [...S];
    };
    replaceBy = (letter, P) => {
        let pow;
        const resultPolynom = new Polynom().zero();
        for (const m of this.monoms) {
            if (m.literal[letter] === undefined || m.literal[letter] === 0) {
                resultPolynom.add(m.clone());
            }
            else {
                pow = +m.literal[letter];
                delete m.literal[letter];
                resultPolynom.add(P.clone().pow(pow).multiply(m));
            }
        }
        this._monoms = resultPolynom.reduce().reorder().monoms;
        return this;
    };
    evaluate = (values) => {
        const r = new _coefficients__WEBPACK_IMPORTED_MODULE_4__.Fraction().zero();
        this._monoms.forEach(monom => {
            r.add(monom.evaluate(values));
        });
        return r;
    };
    derivative = (letter) => {
        let dP = new Polynom();
        for (let m of this._monoms) {
            dP.add(m.derivative(letter));
        }
        return dP;
    };
    primitive = (letter) => {
        let dP = new Polynom();
        for (let m of this._monoms) {
            dP.add(m.primitive(letter));
        }
        return dP;
    };
    integrate = (a, b, letter) => {
        const primitive = this.primitive(letter);
        if (letter === undefined) {
            letter = 'x';
        }
        let valuesA = {}, valuesB = {};
        valuesA[letter] = a;
        valuesB[letter] = b;
        return primitive.evaluate(valuesB).subtract(primitive.evaluate(valuesA));
    };
    factorize_OLD = (maxValue) => {
        this._factors = [];
        let P = this.clone(), nbFactorsFound = 0;
        if (P.monomByDegree().coefficient.numerator < 0) {
            this._factors.push(new Polynom('-1'));
        }
        let M = P.commonMonom();
        if (!M.isOne()) {
            let commonPolynom = new Polynom();
            commonPolynom.monoms = [M];
            if (this._factors.length === 0) {
                this._factors.push(commonPolynom);
            }
            else {
                this._factors = [];
                this._factors.push(commonPolynom.opposed());
            }
            P = P.euclidian(commonPolynom).quotient;
            nbFactorsFound = commonPolynom.degree();
        }
        if (P.degree() <= 1) {
            this._factors.push(P.clone());
        }
        else {
            let Q = new _coefficients__WEBPACK_IMPORTED_MODULE_4__.Fraction(), F, degree = P.degree();
            maxValue = maxValue === undefined ? 20 : maxValue;
            for (let a = 1; a <= maxValue; a++) {
                for (let b = -maxValue; b <= maxValue; b++) {
                    Q.parse(-b, a);
                    if (P.evaluate({ x: Q })) {
                        F = new Polynom(`${a}x+${b}`);
                        while (P.evaluate({ x: Q }).value === 0) {
                            this._factors.push(F.clone());
                            nbFactorsFound++;
                            P = P.euclidian(F).quotient;
                        }
                    }
                    if (nbFactorsFound > degree) {
                        return this;
                    }
                }
            }
            if (P.degree() > 1) {
                this._factors.push(P.clone());
                return this;
            }
        }
        return this;
    };
    factorize = (letter) => {
        let factors = [];
        let P = this.clone().reorder(), M = P.commonMonom(), tempPolynom;
        if (!M.isOne()) {
            tempPolynom = new Polynom();
            tempPolynom.monoms = [M];
            factors = [tempPolynom.clone()];
            P = P.euclidian(tempPolynom).quotient;
        }
        let securityLoop = P.degree() * 2;
        while (securityLoop >= 0) {
            securityLoop--;
            if (P.monoms.length < 2) {
                if (!P.isOne()) {
                    factors.push(P.clone());
                }
                break;
            }
            else {
                let m1 = P.monoms[0].dividers, m2 = P.monoms[P.monoms.length - 1].dividers;
                for (let m1d of m1) {
                    for (let m2d of m2) {
                        let dividerPolynom = new Polynom(), result;
                        dividerPolynom.monoms = [m1d.clone(), m2d.clone()];
                        result = P.euclidian(dividerPolynom);
                        if (result.reminder.isZero()) {
                            P = result.quotient.clone();
                            factors.push(dividerPolynom);
                            continue;
                        }
                        dividerPolynom.monoms = [m1d.clone(), m2d.clone().opposed()];
                        result = P.euclidian(dividerPolynom);
                        if (result.reminder.isZero()) {
                            P = result.quotient.clone();
                            factors.push(dividerPolynom);
                        }
                    }
                }
            }
        }
        this.factors = factors;
        return factors;
    };
    _factorize2ndDegree = (letter) => {
        let P1, P2, a, b, c, delta, x1, x2, factor;
        if (this.numberOfVars === 1) {
            a = this.monomByDegree(2, letter).coefficient;
            b = this.monomByDegree(1, letter).coefficient;
            c = this.monomByDegree(0, letter).coefficient;
            delta = b.clone().pow(2).subtract(a.clone().multiply(c).multiply(4));
            if (delta.isZero()) {
                x1 = b.clone().opposed().divide(a.clone().multiply(2));
                P1 = new Polynom(letter).subtract(x1.display).multiply(x1.denominator);
                P2 = new Polynom(letter).subtract(x1.display).multiply(x1.denominator);
                factor = a.divide(x1.denominator).divide(x1.denominator);
                if (!factor.isOne()) {
                    return [new Polynom(factor.display), P1, P2];
                }
                else {
                    return [P1, P2];
                }
            }
            else if (delta.isPositive() && delta.isSquare()) {
                x1 = b.clone().opposed()
                    .add(delta.clone().sqrt())
                    .divide(a.clone().multiply(2));
                x2 = b.clone().opposed()
                    .subtract(delta.clone().sqrt())
                    .divide(a.clone().multiply(2));
                factor = a.divide(x1.denominator).divide(x2.denominator);
                if (factor.isOne()) {
                    return [
                        new Polynom(letter).subtract(x1.display).multiply(x1.denominator),
                        new Polynom(letter).subtract(x2.display).multiply(x2.denominator),
                    ];
                }
                else {
                    return [
                        new Polynom(factor.display),
                        new Polynom(letter).subtract(x1.display).multiply(x1.denominator),
                        new Polynom(letter).subtract(x2.display).multiply(x2.denominator),
                    ];
                }
            }
            else {
                return [this.clone()];
            }
        }
        else {
            a = this.monomByDegree(2, letter);
            b = this.monomByDegree(1, letter);
            c = this.monomByDegree(0, letter);
            if (a.isLitteralSquare() && c.isLitteralSquare()) {
                if (b.clone().pow(2).isSameAs(a.clone().multiply(c))) {
                    let xPolynom = new Polynom('x', a.coefficient, b.coefficient, c.coefficient);
                    let xFactors = xPolynom._factorize2ndDegree('x');
                    let factors = [], xyzPolynom;
                    if (xFactors.length >= 2) {
                        for (let p of xFactors) {
                            if (p.degree() === 0) {
                                factors.push(p.clone());
                            }
                            else {
                                xyzPolynom = p.clone();
                                xyzPolynom.monoms[0].literal = a.literalSqrt;
                                xyzPolynom.monoms[1].literal = c.literalSqrt;
                                factors.push(xyzPolynom.clone());
                            }
                        }
                        return factors;
                    }
                }
            }
            return [this.clone()];
        }
    };
    _factorizeByGroups = () => {
        return [];
    };
    getZeroes = () => {
        const Z = [];
        switch (this.degree()) {
            case 0:
                if (this._monoms[0].coefficient.value === 0) {
                    return [true];
                }
                else {
                    return [false];
                }
            case 1:
                if (this._monoms.length === 1) {
                    return [new _coefficients__WEBPACK_IMPORTED_MODULE_4__.Fraction().zero()];
                }
                else {
                    const P = this.clone().reduce().reorder();
                    return [P.monoms[1].coefficient.opposed().divide(P.monoms[0].coefficient)];
                }
            default:
                if (this._factors.length === 0) {
                    this.factorize();
                }
                let zeroes = [], zeroesAsTex = [];
                for (let P of this._factors) {
                    if (P.degree() > 2) {
                    }
                    else if (P.degree() === 2) {
                        let A = P.monomByDegree(2).coefficient, B = P.monomByDegree(1).coefficient, C = P.monomByDegree(0).coefficient, D = B.clone().pow(2).subtract(A.clone().multiply(C).multiply(4));
                        if (D.value > 0) {
                            let x1 = (-(B.value) + Math.sqrt(D.value)) / (2 * A.value), x2 = (-(B.value) - Math.sqrt(D.value)) / (2 * A.value);
                            zeroes.push(new _coefficients__WEBPACK_IMPORTED_MODULE_4__.Fraction(x1.toFixed(3)).reduce());
                            zeroes.push(new _coefficients__WEBPACK_IMPORTED_MODULE_4__.Fraction(x2.toFixed(3)).reduce());
                        }
                        else if (D.value === 0) {
                        }
                        else {
                            console.log('No zero for ', P.tex);
                        }
                    }
                    else {
                        for (let z of P.getZeroes()) {
                            if (z === false || z === true) {
                                continue;
                            }
                            if (zeroesAsTex.indexOf(z.frac) === -1) {
                                zeroes.push(z);
                                zeroesAsTex.push(z.frac);
                            }
                        }
                    }
                }
                return zeroes;
        }
        return Z;
    };
    monomByDegree = (degree, letter) => {
        if (degree === undefined) {
            return this.monomByDegree(this.degree(letter), letter);
        }
        const M = this.clone().reduce();
        for (const m of M._monoms) {
            if (m.degree(letter) === degree) {
                return m.clone();
            }
        }
        return new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom().zero();
    };
    monomsByDegree = (degree, letter) => {
        if (degree === undefined) {
            return this.monomsByDegree(this.degree(letter));
        }
        let Ms = [];
        const M = this.clone().reduce();
        for (const m of M._monoms) {
            if (m.degree(letter) === degree) {
                Ms.push(m.clone());
            }
        }
        return Ms;
    };
    monomByLetter = (letter) => {
        const M = this.clone().reduce();
        for (const m of M._monoms) {
            if (m.hasLetter(letter)) {
                return m.clone();
            }
        }
        return new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom().zero();
    };
    getDenominators = () => {
        const denominators = [];
        for (const m of this._monoms) {
            denominators.push(m.coefficient.denominator);
        }
        return denominators;
    };
    getNumerators = () => {
        const numerators = [];
        for (const m of this._monoms) {
            numerators.push(m.coefficient.numerator);
        }
        return numerators;
    };
    lcmDenominator = () => {
        return _numeric__WEBPACK_IMPORTED_MODULE_2__.Numeric.lcm(...this.getDenominators());
    };
    gcdDenominator = () => {
        return _numeric__WEBPACK_IMPORTED_MODULE_2__.Numeric.gcd(...this.getDenominators());
    };
    lcmNumerator = () => {
        return _numeric__WEBPACK_IMPORTED_MODULE_2__.Numeric.lcm(...this.getNumerators());
    };
    gcdNumerator = () => {
        return _numeric__WEBPACK_IMPORTED_MODULE_2__.Numeric.gcd(...this.getNumerators());
    };
    commonMonom = () => {
        let M = new _monom__WEBPACK_IMPORTED_MODULE_0__.Monom().one(), numerator, denominator, degree = this.degree();
        numerator = this.gcdNumerator();
        denominator = this.gcdDenominator();
        M.coefficient = new _coefficients__WEBPACK_IMPORTED_MODULE_4__.Fraction(numerator, denominator);
        for (let L of this.variables) {
            M.setLetter(L, degree);
            for (let m of this._monoms) {
                M.setLetter(L, Math.min(m.degree(L), M.degree(L)));
                if (M.degree(L) === 0) {
                    break;
                }
            }
        }
        return M;
    };
    makeItComplicate = (complexity = 1) => {
        this._texString = '';
        if (this.degree() < 1) {
            return this;
        }
        const mDegree = _random__WEBPACK_IMPORTED_MODULE_3__.Random.number(0, this.degree() - 1);
        return this;
    };
    factorizePartial = (forceSign) => {
        this._texString = '';
        if (this.length <= 1) {
            return this;
        }
        let mMain, mCheck, mFactor, pFactor, g, sign;
        for (let i = 0; i < this.length; i++) {
            mMain = this._monoms[i].clone();
            for (let j = i + 1; j < this.length; j++) {
                mCheck = this._monoms[j].clone();
                g = _numeric__WEBPACK_IMPORTED_MODULE_2__.Numeric.gcd(mMain.coefficient.numerator, mCheck.coefficient.numerator);
                if (g !== 1) {
                    mFactor = _monom__WEBPACK_IMPORTED_MODULE_0__.Monom.lcm(mMain, mCheck);
                    sign = mMain.coefficient.sign() === 1 ? '+' : '-';
                    this._texString = `${forceSign === true ? sign : (sign === '+' ? '' : sign)}${mFactor.tex}`;
                    pFactor = new Polynom().add(mMain.divide(mFactor)).add(mCheck.divide(mFactor));
                    this._texString += pFactor.genDisplay('tex', false, true);
                    this._texString += this.clone().subtract(pFactor.clone().multiply(mFactor)).genDisplay('tex', true, false);
                    return this;
                }
            }
        }
        this._texString = this.genDisplay('tex', forceSign);
        return this;
    };
    minify = () => {
        this.multiply(this.lcmDenominator()).divide(this.gcdNumerator()).reduce();
        return this.reduce();
    };
    canDivide = (P, letter = 'x') => {
        const d = P.degree();
        const evalValue = {};
        if (d === 0) {
            return !P.isZero;
        }
        if (d === 1) {
            const z = P.getZeroes();
            if (z[0] === true || z[0] === false) {
                return false;
            }
            evalValue[letter] = z[0];
            return this.evaluate(evalValue).value === 0;
        }
        if (d > 1) {
            console.log('Currently, only first degree polynom are supported');
            return false;
        }
        return false;
    };
}
//# sourceMappingURL=polynom.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/algebra/rational.js":
/*!***********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/algebra/rational.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Rational": () => (/* binding */ Rational)
/* harmony export */ });
/* harmony import */ var _polynom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polynom */ "./node_modules/pimath/esm/maths/algebra/polynom.js");

class Rational {
    _rawString;
    _numerator;
    _denominator;
    constructor(numerator, denominator) {
        this._numerator = numerator ? numerator.clone() : new _polynom__WEBPACK_IMPORTED_MODULE_0__.Polynom();
        this._denominator = denominator ? denominator.clone() : new _polynom__WEBPACK_IMPORTED_MODULE_0__.Polynom();
    }
    clone = () => {
        this._numerator = this._numerator.clone();
        this._denominator = this._denominator.clone();
        return this;
    };
    get tex() {
        return `\\dfrac{ ${this._numerator.tex} }{ ${this._denominator.tex} }`;
    }
    get texFactors() {
        this._numerator.factorize();
        this._denominator.factorize();
        return `\\dfrac{ ${this._numerator.texFactors} }{ ${this._denominator.texFactors} }`;
    }
    get numerator() {
        return this._numerator;
    }
    get denominator() {
        return this._denominator;
    }
    domain = () => {
        let zeroes = this._denominator.getZeroes();
        if (zeroes.length === 0 || zeroes[0] === false) {
            return '\\mathbb{R}';
        }
        else if (zeroes[0] === true) {
            return '\\varnothing';
        }
        else {
            return '\\mathbb{R}\\setminus\\left{' +
                zeroes.map(x => {
                    return (typeof x === 'boolean') ? '' : x.frac;
                })
                    .join(';') + '\\right}';
        }
    };
    amplify = (P) => {
        this._numerator.multiply(P);
        this._denominator.multiply(P);
        return this;
    };
    simplify = (P) => {
        let NumeratorEuclidien = this._numerator.euclidian(P);
        if (!NumeratorEuclidien.reminder.isZero()) {
            return this;
        }
        let DenominatorEuclidien = this._denominator.euclidian(P);
        if (!DenominatorEuclidien.reminder.isZero()) {
            return this;
        }
        this._numerator = NumeratorEuclidien.quotient;
        this._denominator = DenominatorEuclidien.quotient;
        return this;
    };
    reduce = () => {
        console.log(this._numerator.tex);
        this._numerator.factorize();
        console.log(this._numerator.factors.map(x => x.tex));
        for (let f of this._numerator.factors) {
            this.simplify(f);
        }
        return this;
    };
    opposed = () => {
        this._numerator.opposed();
        return this;
    };
    add = (R) => {
        let denominator = this._denominator.clone();
        this.amplify(R._denominator);
        this._numerator.add(R._numerator.clone().multiply(denominator));
        return this;
    };
    subtract = (R) => {
        return this.add(R.clone().opposed());
    };
    limits = (value, letter) => {
        if (value === Infinity || value === -Infinity) {
            let N = this._numerator.monomByDegree(this._numerator.degree(letter), letter), D = this._denominator.monomByDegree(this._denominator.degree(letter), letter);
            N.divide(D);
            if (N.degree(letter) > 0) {
                return N.coefficient.sign() * (Math.pow((value > 0 ? 1 : -1), N.degree(letter) % 2)) === 1 ? Infinity : -Infinity;
            }
            if (N.degree(letter) === 0) {
                return N.coefficient;
            }
            if (N.degree(letter) > 0) {
                return N.coefficient.sign() * (Math.pow(-1, N.degree(letter) % 2)) === 1 ? 0 : -0;
            }
        }
        else {
            return this._numerator.evaluate({ letter: value }).divide(this._denominator.evaluate({ letter: value }));
        }
    };
}
//# sourceMappingURL=rational.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/coefficients/fraction.js":
/*!****************************************************************!*\
  !*** ./node_modules/pimath/esm/maths/coefficients/fraction.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fraction": () => (/* binding */ Fraction)
/* harmony export */ });
/* harmony import */ var _numeric__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../numeric */ "./node_modules/pimath/esm/maths/numeric.js");

class Fraction {
    _numerator;
    _denominator;
    constructor(value, denominatorOrPeriodic) {
        this._numerator = 1;
        this._denominator = 1;
        if (value !== undefined) {
            this.parse(value, denominatorOrPeriodic);
        }
        return this;
    }
    get isFraction() {
        return true;
    }
    get numerator() {
        return this._numerator;
    }
    set numerator(value) {
        this._numerator = value;
    }
    get denominator() {
        return this._denominator;
    }
    set denominator(value) {
        this._denominator = value;
    }
    get value() {
        return this._numerator / this._denominator;
    }
    get tex() {
        if (this._denominator === 1) {
            return `${this._numerator}`;
        }
        else if (this._numerator < 0) {
            return `-\\frac{ ${-this._numerator} }{ ${this._denominator} }`;
        }
        else {
            return `\\frac{ ${this._numerator} }{ ${this._denominator} }`;
        }
    }
    get display() {
        if (this._denominator === 1) {
            return `${this._numerator}`;
        }
        else {
            return `${this._numerator}/${this._denominator}`;
        }
    }
    get frac() {
        return this.tex;
    }
    get dfrac() {
        return this.tex.replace('\\frac', '\\dfrac');
    }
    parse = (value, denominatorOrPeriodic) => {
        let S;
        if (value === null || value === "") {
            this._numerator = 0;
            this._denominator = 1;
            return this;
        }
        switch (typeof value) {
            case "string":
                S = value.split('/');
                if (S.length > 2)
                    throw "Two many divide signs";
                if (S.map(x => x === '' || isNaN(Number(x))).includes(true))
                    throw "Not a number";
                if (S.length === 1) {
                    return this.parse(+S[0]);
                }
                else if (S.length === 2) {
                    if (S[1] === '0') {
                        this._numerator = NaN;
                        this._denominator = 1;
                    }
                    else {
                        this._numerator = +S[0];
                        this._denominator = +S[1];
                    }
                }
                else {
                    this._numerator = NaN;
                    this._denominator = 1;
                }
                break;
            case "number":
                if (Number.isSafeInteger(value)) {
                    this._numerator = +value;
                    if (denominatorOrPeriodic === undefined || !Number.isSafeInteger(denominatorOrPeriodic)) {
                        this._denominator = 1;
                    }
                    else {
                        this._denominator = +denominatorOrPeriodic;
                    }
                }
                else {
                    let p = (value.toString()).split('.')[1].length;
                    if (denominatorOrPeriodic === undefined) {
                        this._numerator = value * Math.pow(10, p);
                        this._denominator = Math.pow(10, p);
                    }
                    else if (Number.isSafeInteger(denominatorOrPeriodic)) {
                        this._numerator = value * Math.pow(10, p) - Math.floor(value * Math.pow(10, p - denominatorOrPeriodic));
                        this.denominator = Math.pow(10, p) - Math.pow(10, p - denominatorOrPeriodic);
                    }
                }
                break;
            case "object":
                if (value.isFraction) {
                    this._numerator = +value.numerator;
                    this._denominator = +value.denominator;
                }
                break;
        }
        return this;
    };
    clone = () => {
        let F = new Fraction();
        F.numerator = +this._numerator;
        F.denominator = +this._denominator;
        return F;
    };
    zero = () => {
        this._numerator = 0;
        this._denominator = 1;
        return this;
    };
    one = () => {
        this._numerator = 1;
        this._denominator = 1;
        return this;
    };
    infinite = () => {
        this._numerator = Infinity;
        this._denominator = 1;
        return this;
    };
    invalid = () => {
        this._numerator = NaN;
        this._denominator = 1;
        return this;
    };
    opposed = () => {
        this._numerator = -this._numerator;
        return this;
    };
    add = (F) => {
        let N = this._numerator, D = this._denominator;
        this._numerator = N * F.denominator + F.numerator * D;
        this._denominator = D * F.denominator;
        return this.reduce();
    };
    subtract = (F) => {
        return this.add(F.clone().opposed());
    };
    multiply = (F) => {
        let Q = new Fraction(F);
        this._numerator = this._numerator * Q.numerator;
        this._denominator = this._denominator * Q.denominator;
        return this.reduce();
    };
    divide = (F) => {
        let Q = new Fraction(F);
        if (Q.numerator === 0) {
            return new Fraction().infinite();
        }
        let N = +this._numerator, D = +this._denominator;
        this._numerator = N * Q.denominator;
        this._denominator = D * Q.numerator;
        return this.reduce();
    };
    invert = () => {
        let n = +this._numerator, d = +this._denominator;
        this._numerator = d;
        this._denominator = n;
        return this;
    };
    pow = (p) => {
        if (!Number.isSafeInteger(p)) {
            return this.invalid();
        }
        this.reduce();
        if (p < 0) {
            this.invert();
        }
        this._numerator = this._numerator ** Math.abs(p);
        this._denominator = this._denominator ** Math.abs(p);
        return this;
    };
    root = (p) => {
        if (p === 0) {
            return this;
        }
        if (p < 0) {
            this.invert();
        }
        let n = Math.pow(this._numerator, Math.abs(1 / p)), d = Math.pow(this._denominator, Math.abs(1 / p));
        this._numerator = Math.pow(this._numerator, Math.abs(1 / p));
        this._denominator = Math.pow(this._denominator, Math.abs(1 / p));
        return this;
    };
    sqrt = () => {
        return this.root(2);
    };
    abs = () => {
        this._numerator = Math.abs(this._numerator);
        this._denominator = Math.abs(this._denominator);
        return this;
    };
    reduce = () => {
        let g = _numeric__WEBPACK_IMPORTED_MODULE_0__.Numeric.gcd(this._numerator, this._denominator);
        this._numerator = this._numerator / g;
        this._denominator = this._denominator / g;
        if (this._denominator < 0) {
            this._denominator = -this._denominator;
            this._numerator = -this._numerator;
        }
        return this;
    };
    amplify = (k) => {
        if (Number.isSafeInteger(k)) {
            this._numerator *= k;
            this._denominator *= k;
        }
        return this;
    };
    compare = (F, sign) => {
        if (sign === undefined) {
            sign = '=';
        }
        switch (sign) {
            case '>':
                return this.value > F.value;
            case ">=" || 0 || 0:
                return this.value >= F.value;
            case "<":
                return this.value < F.value;
            case "<=" || 0 || 0:
                return this.value <= F.value;
            case "=":
                return this.value === F.value;
            case "<>":
                return this.value !== F.value;
            default:
                return false;
        }
    };
    lesser = (than) => {
        return this.compare(than, '<');
    };
    leq = (than) => {
        return this.compare(than, '<=');
    };
    greater = (than) => {
        return this.compare(than, '>');
    };
    geq = (than) => {
        return this.compare(than, '>=');
    };
    isEqual = (than) => {
        return this.compare(than, '=');
    };
    isDifferent = (than) => {
        return this.compare(than, '<>');
    };
    isOpposed = (p) => {
        return this.isEqual(p.clone().opposed());
    };
    isInverted = (p) => {
        return this.isEqual(new Fraction().one().divide(p.clone()));
    };
    isZero = () => {
        return this._numerator === 0;
    };
    isOne = () => {
        return this._numerator === 1 && this._denominator === 1;
    };
    isPositive = () => {
        return this.sign() === 1;
    };
    isNegative = () => {
        return this.sign() === -1;
    };
    isNaN = () => {
        return isNaN(this._numerator);
    };
    isInfinity = () => {
        return this._numerator === Infinity;
    };
    isFinite = () => {
        return !this.isInfinity();
    };
    isSquare = () => {
        return Math.sqrt(this._numerator) % 1 === 0 && Math.sqrt(this._denominator) % 1 === 0;
    };
    isReduced = () => {
        return Math.abs(_numeric__WEBPACK_IMPORTED_MODULE_0__.Numeric.gcd(this._numerator, this._denominator)) === 1;
    };
    sign = () => {
        return (this._numerator * this._denominator >= 0) ? 1 : -1;
    };
    areEquals = (...F) => {
        for (let i = 0; i < F.length; i++) {
            if (!this.isEqual(F[i])) {
                return false;
            }
        }
        return true;
    };
}
//# sourceMappingURL=fraction.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/coefficients/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/pimath/esm/maths/coefficients/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fraction": () => (/* reexport safe */ _fraction__WEBPACK_IMPORTED_MODULE_0__.Fraction),
/* harmony export */   "Nthroot": () => (/* reexport safe */ _nthroot__WEBPACK_IMPORTED_MODULE_1__.Nthroot)
/* harmony export */ });
/* harmony import */ var _fraction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fraction */ "./node_modules/pimath/esm/maths/coefficients/fraction.js");
/* harmony import */ var _nthroot__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nthroot */ "./node_modules/pimath/esm/maths/coefficients/nthroot.js");


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/coefficients/nthroot.js":
/*!***************************************************************!*\
  !*** ./node_modules/pimath/esm/maths/coefficients/nthroot.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Nthroot": () => (/* binding */ Nthroot)
/* harmony export */ });
class Nthroot {
    _radical;
    _nth;
    _coefficient;
    _isValid;
    constructor() {
        this._radical = 1;
        this._coefficient = 1;
        this._nth = 2;
        this._isValid = true;
    }
    get radical() {
        return this._radical;
    }
    set radical(value) {
        this._radical = value;
    }
    get nth() {
        return this._nth;
    }
    set nth(value) {
        if (Number.isSafeInteger(value) && value >= 2) {
            this._nth = value;
        }
        else {
            console.log('Error setting the nth root');
            this._nth = 2;
        }
    }
    get coefficient() {
        return this._coefficient;
    }
    set coefficient(value) {
        this._coefficient = value;
    }
    get tex() {
        let C;
        if (this._coefficient === 1) {
            C = '';
        }
        else if (this._coefficient === -1) {
            C = '-';
        }
        else {
            C = this._coefficient.toString();
        }
        if (this._radical === 1) {
            return `${this._coefficient}`;
        }
        else {
            if (this._nth === 2) {
                return `${C}\\sqrt{${this._radical}}`;
            }
            else {
                return `${C}\\sqrt[${this._nth}]{${this._radical}}`;
            }
        }
    }
    get value() {
        return this._coefficient * Math.pow(this._radical, 1 / this._nth);
    }
    parse = (radical, nthroot, coefficient) => {
        this._coefficient = (coefficient === undefined) ? 1 : coefficient;
        this._nth = (nthroot === undefined) ? 2 : nthroot;
        this._radical = (radical === undefined) ? 1 : radical;
        if (this._nth % 2 === 0 && this._radical < 0) {
            this._isValid = false;
        }
        return this;
    };
    reduce = () => {
        let V = Math.floor(Math.pow(this._radical, 1 / this._nth));
        while (V > 1) {
            if (this._radical % Math.pow(V, this._nth) === 0) {
                this._coefficient *= V;
                this._radical = this._radical / Math.pow(V, this._nth);
                V = Math.floor(Math.pow(this._radical, 1 / this._nth));
                continue;
            }
            V--;
        }
        return this;
    };
    multiply = (N) => {
        this._radical *= N.radical;
        return this.reduce();
    };
    hasRadical = () => {
        return !(this._radical === 1 || this._radical === 0 || this._isValid === false);
    };
}
//# sourceMappingURL=nthroot.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/numeric.js":
/*!**************************************************!*\
  !*** ./node_modules/pimath/esm/maths/numeric.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Numeric": () => (/* binding */ Numeric)
/* harmony export */ });
class Numeric {
    static round(value, decimals = 2) {
        return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    }
    static prime(nb) {
        let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, 1999, 2003, 2011, 2017, 2027, 2029, 2039, 2053, 2063, 2069, 2081, 2083, 2087, 2089, 2099, 2111, 2113, 2129, 2131, 2137, 2141, 2143, 2153, 2161, 2179, 2203, 2207, 2213, 2221, 2237, 2239, 2243, 2251, 2267, 2269, 2273, 2281, 2287, 2293, 2297, 2309, 2311, 2333, 2339, 2341, 2347, 2351, 2357, 2371, 2377, 2381, 2383, 2389, 2393, 2399, 2411, 2417, 2423, 2437, 2441, 2447, 2459, 2467, 2473, 2477, 2503, 2521, 2531, 2539, 2543, 2549, 2551, 2557, 2579, 2591, 2593, 2609, 2617, 2621, 2633, 2647, 2657, 2659, 2663, 2671, 2677, 2683, 2687, 2689, 2693, 2699, 2707, 2711, 2713, 2719, 2729, 2731, 2741, 2749, 2753, 2767, 2777, 2789, 2791, 2797, 2801, 2803, 2819, 2833, 2837, 2843, 2851, 2857, 2861, 2879, 2887, 2897, 2903, 2909, 2917, 2927, 2939, 2953, 2957, 2963, 2969, 2971, 2999, 3001, 3011, 3019, 3023, 3037, 3041, 3049, 3061, 3067, 3079, 3083, 3089, 3109, 3119, 3121, 3137, 3163, 3167, 3169, 3181, 3187, 3191, 3203, 3209, 3217, 3221, 3229, 3251, 3253, 3257, 3259, 3271, 3299, 3301, 3307, 3313, 3319, 3323, 3329, 3331, 3343, 3347, 3359, 3361, 3371, 3373, 3389, 3391, 3407, 3413, 3433, 3449, 3457, 3461, 3463, 3467, 3469, 3491, 3499, 3511, 3517, 3527, 3529, 3533, 3539, 3541, 3547, 3557, 3559, 3571, 3581, 3583, 3593, 3607, 3613, 3617, 3623, 3631, 3637, 3643, 3659, 3671, 3673, 3677, 3691, 3697, 3701, 3709, 3719, 3727, 3733, 3739, 3761, 3767, 3769, 3779, 3793, 3797, 3803, 3821, 3823, 3833, 3847, 3851, 3853, 3863, 3877, 3881, 3889, 3907, 3911, 3917, 3919, 3923, 3929, 3931, 3943, 3947, 3967, 3989, 4001, 4003, 4007, 4013, 4019, 4021, 4027, 4049, 4051, 4057, 4073, 4079, 4091, 4093, 4099, 4111, 4127, 4129, 4133, 4139, 4153, 4157, 4159, 4177, 4201, 4211, 4217, 4219, 4229, 4231, 4241, 4243, 4253, 4259, 4261, 4271, 4273, 4283, 4289, 4297, 4327, 4337, 4339, 4349, 4357, 4363, 4373, 4391, 4397, 4409, 4421, 4423, 4441, 4447, 4451, 4457, 4463, 4481, 4483, 4493, 4507, 4513, 4517, 4519, 4523, 4547, 4549, 4561, 4567, 4583, 4591, 4597, 4603, 4621, 4637, 4639, 4643, 4649, 4651, 4657, 4663, 4673, 4679, 4691, 4703, 4721, 4723, 4729, 4733, 4751, 4759, 4783, 4787, 4789, 4793, 4799, 4801, 4813, 4817, 4831, 4861, 4871, 4877, 4889, 4903, 4909, 4919, 4931, 4933, 4937, 4943, 4951, 4957, 4967, 4969, 4973, 4987, 4993, 4999, 5003, 5009, 5011, 5021, 5023, 5039, 5051, 5059, 5077, 5081, 5087, 5099, 5101, 5107, 5113, 5119, 5147, 5153, 5167, 5171, 5179, 5189, 5197, 5209, 5227, 5231, 5233, 5237, 5261, 5273, 5279, 5281, 5297, 5303, 5309, 5323, 5333, 5347, 5351, 5381, 5387, 5393, 5399, 5407, 5413, 5417, 5419, 5431, 5437, 5441, 5443, 5449, 5471, 5477, 5479, 5483, 5501, 5503, 5507, 5519, 5521, 5527, 5531, 5557, 5563, 5569, 5573, 5581, 5591, 5623, 5639, 5641, 5647, 5651, 5653, 5657, 5659, 5669, 5683, 5689, 5693, 5701, 5711, 5717, 5737, 5741, 5743, 5749, 5779, 5783, 5791, 5801, 5807, 5813, 5821, 5827, 5839, 5843, 5849, 5851, 5857, 5861, 5867, 5869, 5879, 5881, 5897, 5903, 5923, 5927, 5939, 5953, 5981, 5987, 6007, 6011, 6029, 6037, 6043, 6047, 6053, 6067, 6073, 6079, 6089, 6091, 6101, 6113, 6121, 6131, 6133, 6143, 6151, 6163, 6173, 6197, 6199, 6203, 6211, 6217, 6221, 6229, 6247, 6257, 6263, 6269, 6271, 6277, 6287, 6299, 6301, 6311, 6317, 6323, 6329, 6337, 6343, 6353, 6359, 6361, 6367, 6373, 6379, 6389, 6397, 6421, 6427, 6449, 6451, 6469, 6473, 6481, 6491, 6521, 6529, 6547, 6551, 6553, 6563, 6569, 6571, 6577, 6581, 6599, 6607, 6619, 6637, 6653, 6659, 6661, 6673, 6679, 6689, 6691, 6701, 6703, 6709, 6719, 6733, 6737, 6761, 6763, 6779, 6781, 6791, 6793, 6803, 6823, 6827, 6829, 6833, 6841, 6857, 6863, 6869, 6871, 6883, 6899, 6907, 6911, 6917, 6947, 6949, 6959, 6961, 6967, 6971, 6977, 6983, 6991, 6997, 7001, 7013, 7019, 7027, 7039, 7043, 7057, 7069, 7079, 7103, 7109, 7121, 7127, 7129, 7151, 7159, 7177, 7187, 7193, 7207, 7211, 7213, 7219, 7229, 7237, 7243, 7247, 7253, 7283, 7297, 7307, 7309, 7321, 7331, 7333, 7349, 7351, 7369, 7393, 7411, 7417, 7433, 7451, 7457, 7459, 7477, 7481, 7487, 7489, 7499, 7507, 7517, 7523, 7529, 7537, 7541, 7547, 7549, 7559, 7561, 7573, 7577, 7583, 7589, 7591, 7603, 7607, 7621, 7639, 7643, 7649, 7669, 7673, 7681, 7687, 7691, 7699, 7703, 7717, 7723, 7727, 7741, 7753, 7757, 7759, 7789, 7793, 7817, 7823, 7829, 7841, 7853, 7867, 7873, 7877, 7879, 7883, 7901, 7907, 7919, 7927, 7933, 7937, 7949, 7951, 7963, 7993, 8009, 8011, 8017, 8039, 8053, 8059, 8069, 8081, 8087, 8089, 8093, 8101, 8111, 8117, 8123, 8147, 8161, 8167, 8171, 8179, 8191, 8209, 8219, 8221, 8231, 8233, 8237, 8243, 8263, 8269, 8273, 8287, 8291, 8293, 8297, 8311, 8317, 8329, 8353, 8363, 8369, 8377, 8387, 8389, 8419, 8423, 8429, 8431, 8443, 8447, 8461, 8467, 8501, 8513, 8521, 8527, 8537, 8539, 8543, 8563, 8573, 8581, 8597, 8599, 8609, 8623, 8627, 8629, 8641, 8647, 8663, 8669, 8677, 8681, 8689, 8693, 8699, 8707, 8713, 8719, 8731, 8737, 8741, 8747, 8753, 8761, 8779, 8783, 8803, 8807, 8819, 8821, 8831, 8837, 8839, 8849, 8861, 8863, 8867, 8887, 8893, 8923, 8929, 8933, 8941, 8951, 8963, 8969, 8971, 8999, 9001, 9007, 9011, 9013, 9029, 9041, 9043, 9049, 9059, 9067, 9091, 9103, 9109, 9127, 9133, 9137, 9151, 9157, 9161, 9173, 9181, 9187, 9199, 9203, 9209, 9221, 9227, 9239, 9241, 9257, 9277, 9281, 9283, 9293, 9311, 9319, 9323, 9337, 9341, 9343, 9349, 9371, 9377, 9391, 9397, 9403, 9413, 9419, 9421, 9431, 9433, 9437, 9439, 9461, 9463, 9467, 9473, 9479, 9491, 9497, 9511, 9521, 9533, 9539, 9547, 9551, 9587, 9601, 9613, 9619, 9623, 9629, 9631, 9643, 9649, 9661, 9677, 9679, 9689, 9697, 9719, 9721, 9733, 9739, 9743, 9749, 9767, 9769, 9781, 9787, 9791, 9803, 9811, 9817, 9829, 9833, 9839, 9851, 9857, 9859, 9871, 9883, 9887, 9901, 9907, 9923, 9929, 9931, 9941, 9949, 9967, 9973];
        if (nb === undefined) {
            return primes;
        }
        else {
            return primes.slice(0, Math.max(primes.length, nb));
        }
    }
    static dividers(value) {
        let D;
        const maxV = Math.sqrt(Math.abs(value));
        D = [];
        for (let i = 1; i <= maxV; i++) {
            if (value % i === 0) {
                D.push(i);
                D.push(value / i);
            }
        }
        D.sort(function (a, b) { return a - b; });
        return [...new Set(D)];
    }
    static gcd(...values) {
        let gcd2 = function (a, b) {
            if (b === 0) {
                return a;
            }
            return gcd2(b, a % b);
        };
        let g = 1, i = 2;
        if (values.length === 0) {
            return 1;
        }
        if (values.length === 1) {
            if (values[0] === 0) {
                return 1;
            }
            return values[0];
        }
        g = gcd2(values[0], values[1]);
        if (g === 1) {
            return 1;
        }
        for (i = 2; i < values.length; i++) {
            g = gcd2(g, values[i]);
            if (g === 1) {
                break;
            }
        }
        return Math.abs(g);
    }
    static lcm(...values) {
        return values.reduce(function (a, b) {
            return Math.abs(a * b / Numeric.gcd(a, b));
        });
    }
}
//# sourceMappingURL=numeric.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/random/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/pimath/esm/maths/random/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Random": () => (/* binding */ Random)
/* harmony export */ });
/* harmony import */ var _rndPolynom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rndPolynom */ "./node_modules/pimath/esm/maths/random/rndPolynom.js");
/* harmony import */ var _rndMonom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rndMonom */ "./node_modules/pimath/esm/maths/random/rndMonom.js");
/* harmony import */ var _rndHelpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rndHelpers */ "./node_modules/pimath/esm/maths/random/rndHelpers.js");
/* harmony import */ var _rndTypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rndTypes */ "./node_modules/pimath/esm/maths/random/rndTypes.js");




var Random;
(function (Random) {
    function polynom(config) {
        return (new _rndPolynom__WEBPACK_IMPORTED_MODULE_0__.rndPolynom(config)).generate();
    }
    Random.polynom = polynom;
    function monom(config) {
        return (new _rndMonom__WEBPACK_IMPORTED_MODULE_1__.rndMonom(config)).generate();
    }
    Random.monom = monom;
    function number(from, to) { return _rndHelpers__WEBPACK_IMPORTED_MODULE_2__.rndHelpers.randomInt(from, to); }
    Random.number = number;
    function numberSym(max, allowZero) { return _rndHelpers__WEBPACK_IMPORTED_MODULE_2__.rndHelpers.randomIntSym(max, allowZero); }
    Random.numberSym = numberSym;
    function bool(percent) { return _rndHelpers__WEBPACK_IMPORTED_MODULE_2__.rndHelpers.randomBool(percent); }
    Random.bool = bool;
    function array(arr, number) { return _rndHelpers__WEBPACK_IMPORTED_MODULE_2__.rndHelpers.randomArray(arr, number); }
    Random.array = array;
    function item(arr) { return _rndHelpers__WEBPACK_IMPORTED_MODULE_2__.rndHelpers.randomItem(arr); }
    Random.item = item;
    function shuffle(arr) { _rndHelpers__WEBPACK_IMPORTED_MODULE_2__.rndHelpers.shuffleArray(arr); }
    Random.shuffle = shuffle;
})(Random || (Random = {}));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/random/randomCore.js":
/*!************************************************************!*\
  !*** ./node_modules/pimath/esm/maths/random/randomCore.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "randomCore": () => (/* binding */ randomCore)
/* harmony export */ });
class randomCore {
    _config;
    _defaultConfig;
    mergeConfig = (config, defaultConfig) => {
        if (config !== undefined) {
            return { ...defaultConfig, ...config };
        }
        return defaultConfig;
    };
    generate = () => {
        return undefined;
    };
    config = (config) => {
        this._config = this.mergeConfig(config, this._defaultConfig);
        return this;
    };
}
//# sourceMappingURL=randomCore.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/random/rndHelpers.js":
/*!************************************************************!*\
  !*** ./node_modules/pimath/esm/maths/random/rndHelpers.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rndHelpers": () => (/* binding */ rndHelpers)
/* harmony export */ });
class rndHelpers {
    static randomBool(percent = 0.5) {
        return Math.random() < percent;
    }
    static randomInt(a, b) {
        if (b === undefined) {
            return this.randomInt(0, a);
        }
        return Math.floor(Math.random() * (b - a + 1) + a);
    }
    static randomIntSym(max, zero) {
        if (zero === false) {
            return this.randomBool() ? this.randomInt(1, max) : -this.randomInt(1, max);
        }
        else {
            return this.randomInt(-max, max);
        }
    }
    static randomArray(arr, number) {
        if (number === undefined) {
            number = 1;
        }
        if (arr.length <= 0) {
            return Object.values(arr);
        }
        return rndHelpers.shuffleArray(arr).slice(0, number);
    }
    static randomItem(arr) {
        if (arr.length === 0) {
            return '';
        }
        return this.randomArray(arr, 1)[0];
    }
    static shuffleArray(arr) {
        let shuffleArray = Object.values(arr);
        for (let i = shuffleArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = shuffleArray[i];
            shuffleArray[i] = shuffleArray[j];
            shuffleArray[j] = temp;
        }
        return shuffleArray;
    }
}
//# sourceMappingURL=rndHelpers.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/random/rndMonom.js":
/*!**********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/random/rndMonom.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rndMonom": () => (/* binding */ rndMonom)
/* harmony export */ });
/* harmony import */ var _randomCore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./randomCore */ "./node_modules/pimath/esm/maths/random/randomCore.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./node_modules/pimath/esm/maths/random/index.js");
/* harmony import */ var _algebra_monom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../algebra/monom */ "./node_modules/pimath/esm/maths/algebra/monom.js");



class rndMonom extends _randomCore__WEBPACK_IMPORTED_MODULE_0__.randomCore {
    constructor(userConfig) {
        super();
        this._defaultConfig = {
            letters: 'x',
            degree: 2,
            fraction: true,
            zero: false
        };
        this._config = this.mergeConfig(userConfig, this._defaultConfig);
    }
    generate = () => {
        let M = new _algebra_monom__WEBPACK_IMPORTED_MODULE_2__.Monom();
        M.coefficient.parse(_index__WEBPACK_IMPORTED_MODULE_1__.Random.numberSym(10, this._config.zero), (this._config.fraction) ? _index__WEBPACK_IMPORTED_MODULE_1__.Random.number(1, 10) : 1).reduce();
        if (this._config.letters.length > 1) {
            for (let L of this._config.letters.split('')) {
                M.setLetter(L, 0);
            }
            for (let i = 0; i < this._config.degree; i++) {
                const L = _index__WEBPACK_IMPORTED_MODULE_1__.Random.item(this._config.letters.split(""));
                M.setLetter(L, M.degree(L) + 1);
            }
        }
        else {
            M.setLetter(this._config.letters, this._config.degree);
        }
        return M;
    };
}
//# sourceMappingURL=rndMonom.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/random/rndPolynom.js":
/*!************************************************************!*\
  !*** ./node_modules/pimath/esm/maths/random/rndPolynom.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rndPolynom": () => (/* binding */ rndPolynom)
/* harmony export */ });
/* harmony import */ var _randomCore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./randomCore */ "./node_modules/pimath/esm/maths/random/randomCore.js");
/* harmony import */ var _rndMonom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rndMonom */ "./node_modules/pimath/esm/maths/random/rndMonom.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index */ "./node_modules/pimath/esm/maths/random/index.js");
/* harmony import */ var _algebra__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../algebra */ "./node_modules/pimath/esm/maths/algebra/index.js");




class rndPolynom extends _randomCore__WEBPACK_IMPORTED_MODULE_0__.randomCore {
    constructor(userConfig) {
        super();
        this._defaultConfig = {
            letters: 'x',
            degree: 2,
            fraction: false,
            zero: false,
            unit: false,
            factorable: false,
            allowNullMonom: true,
            numberOfMonoms: 0
        };
        this._config = this.mergeConfig(userConfig, this._defaultConfig);
    }
    generate = () => {
        if (this._config.factorable && this._config.degree > 1) {
            return this.factorable();
        }
        let P = new _algebra__WEBPACK_IMPORTED_MODULE_3__.Polynom().empty(), M;
        for (let i = this._config.degree; i >= 0; i--) {
            M = new _rndMonom__WEBPACK_IMPORTED_MODULE_1__.rndMonom({
                letters: this._config.letters,
                degree: i,
                fraction: this._config.fraction,
                zero: (i === this._config.degree) ? false : this._config.allowNullMonom
            }).generate();
            if (this._config.unit && this._config.degree === i) {
                M.coefficient.one();
            }
            P.add(M);
        }
        if (this._config.numberOfMonoms > 0 && this._config.numberOfMonoms < P.length) {
            console.log(P.monoms.length);
            P.monoms = _index__WEBPACK_IMPORTED_MODULE_2__.Random.array(P.monoms, this._config.numberOfMonoms);
        }
        return P;
    };
    factorable = () => {
        let P = new _algebra__WEBPACK_IMPORTED_MODULE_3__.Polynom().one();
        let _factorableConfig = { ...this._config };
        _factorableConfig.degree = 1;
        _factorableConfig.factorable = false;
        for (let i = 0; i < this._config.degree; i++) {
            P.multiply(_index__WEBPACK_IMPORTED_MODULE_2__.Random.polynom(_factorableConfig));
        }
        return P;
    };
}
//# sourceMappingURL=rndPolynom.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/random/rndTypes.js":
/*!**********************************************************!*\
  !*** ./node_modules/pimath/esm/maths/random/rndTypes.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=rndTypes.js.map

/***/ }),

/***/ "./node_modules/pimath/esm/maths/shutingyard.js":
/*!******************************************************!*\
  !*** ./node_modules/pimath/esm/maths/shutingyard.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Shutingyard": () => (/* binding */ Shutingyard)
/* harmony export */ });
class Shutingyard {
    _rpn = [];
    _mode;
    _tokenConfig;
    _uniformize;
    constructor(mode) {
        this._mode = typeof mode === 'undefined' ? 'polynom' : mode;
        this.tokenConfigInitialization();
    }
    isOperation(token) {
        if (token[0].match(/[+\-*/^]/g)) {
            return true;
        }
        return false;
    }
    tokenConfigInitialization() {
        if (this._mode === 'set') {
            this._tokenConfig = {
                '&': { precedence: 3, associative: 'left' },
                '|': { precedence: 3, associative: 'left' },
                '!': { precedence: 4, associative: 'right' },
                '-': { precedence: 2, associative: 'left' }
            };
            this._uniformize = false;
        }
        else {
            this._tokenConfig = {
                '^': { precedence: 4, associative: 'right' },
                '*': { precedence: 3, associative: 'left' },
                '/': { precedence: 3, associative: 'left' },
                '+': { precedence: 2, associative: 'left' },
                '-': { precedence: 2, associative: 'left' },
                '%': { precedence: 3, associative: 'right' },
                'sin': { precedence: 4, associative: 'right' },
                'cos': { precedence: 4, associative: 'right' },
                'tab': { precedence: 4, associative: 'right' },
            };
            this._uniformize = true;
        }
        return this._tokenConfig;
    }
    NextToken2(expr, start) {
        let token, tokenType;
        token = '';
        tokenType = '';
        if (expr[start] === '(') {
            token = '(';
            tokenType = '(';
        }
        else if (expr[start] === ')') {
            token = ')';
            tokenType = ')';
        }
        else if (expr[start] === ',') {
            token = ',';
            tokenType = 'function-argument';
        }
        else {
            const keys = Object.keys(this._tokenConfig).sort((a, b) => b.length - a.length);
            for (let key of keys) {
                if (expr.substr(start, key.length) === key) {
                    token += key;
                    tokenType = 'operation';
                    break;
                }
            }
            if (token === '') {
                if (expr[start].match(/[0-9]/)) {
                    token = expr.substr(start).match(/^([0-9.,/]+)/)[0];
                    tokenType = 'coefficient';
                }
                else if (expr[start].match(/[a-zA-Z]/)) {
                    token = expr.substr(start).match(/^([a-zA-Z])/)[0];
                    tokenType = 'variable';
                }
                else {
                    console.log('Unidentified token', expr[start], expr, start);
                    token = expr[start];
                    tokenType = 'monom';
                }
            }
        }
        return [token, start + token.length, tokenType];
    }
    NextToken(expr, start) {
        let tokenMatch, token, tokenType;
        this.NextToken2(expr, start);
        tokenMatch = (expr.substr(start).match(/^[0-9/a-zA-Z^]+/g)) || [];
        if (expr.substr(start, start + 3).match(/^(sin|cos|tan)/g)) {
            token = expr.substr(start, 3);
            tokenType = 'function';
        }
        else if (tokenMatch.length > 0) {
            token = tokenMatch[0];
            tokenType = 'monom';
        }
        else if (expr[start].match(/[+\-*/^]/g)) {
            token = expr[start];
            tokenType = 'operation';
        }
        else if (expr[start].match(/[&|!]/g)) {
            token = expr[start];
            tokenType = 'operation';
        }
        else if (expr[start] === '(') {
            token = '(';
            tokenType = '(';
        }
        else if (expr[start] === ')') {
            token = ')';
            tokenType = ')';
        }
        else if (expr[start] === ',') {
            token = ',';
            tokenType = 'function-argument';
        }
        else {
            token = tokenMatch[0];
            tokenType = 'monom';
            if (token === '') {
                token = expr[start];
                tokenType = 'monom';
                console.log('SHUTING YARD - NEXT TOKEN: error at ', start);
            }
        }
        return [token, start + token.length, tokenType];
    }
    Uniformizer(expr) {
        if (!this._uniformize) {
            return expr;
        }
        let expr2;
        expr2 = expr.replace(/\)\(/g, ')*(');
        expr2 = expr2.replace(/([\da-zA-Z])(\()/g, "$1*$2");
        expr2 = expr2.replace(/(\))([\da-zA-Z])/g, "$1*$2");
        expr2 = expr2.replace(/([0-9])([a-zA-Z])/g, "$1*$2");
        expr2 = expr2.replace(/([a-zA-Z])([0-9])/g, "$1*$2");
        expr2 = expr2.replace(/([abcxyz])([abcxyz])/g, "$1*$2");
        let fnToken = ['sin', 'cos', 'tan'];
        for (let token of fnToken) {
            expr2 = expr2.replace(new RegExp(token + '\\*', 'g'), token);
        }
        return expr2;
    }
    parse(expr, operators) {
        let outQueue = [], opStack = [], token = '', tokenPos = 0, tokenType = '', previousOpStatckLength = 0;
        expr = this.Uniformizer(expr);
        let securityLoopLvl1 = 50, securityLoopLvl2_default = 50, securityLoopLvl2;
        while (tokenPos < expr.length) {
            securityLoopLvl1--;
            if (securityLoopLvl1 === 0) {
                console.log('SECURITY LEVEL 1 EXIT');
                break;
            }
            [token, tokenPos, tokenType] = this.NextToken2(expr, tokenPos);
            switch (tokenType) {
                case 'monom':
                case 'coefficient':
                case 'variable':
                    outQueue.push({
                        token,
                        tokenType
                    });
                    break;
                case 'operation':
                    previousOpStatckLength = opStack.length;
                    if (opStack.length > 0) {
                        let opTop = opStack[opStack.length - 1];
                        securityLoopLvl2 = +securityLoopLvl2_default;
                        while (opTop.token in this._tokenConfig && ((this._tokenConfig[token].associative === 'left' && this._tokenConfig[token].precedence <= this._tokenConfig[opTop.token].precedence)
                            ||
                                (this._tokenConfig[token].associative === 'right' && this._tokenConfig[token].precedence < this._tokenConfig[opTop.token].precedence))) {
                            securityLoopLvl2--;
                            if (securityLoopLvl2 === 0) {
                                console.log('SECURITY LEVEL 2 OPERATION EXIT');
                                break;
                            }
                            outQueue.push((opStack.pop()) || { token: '', tokenType: 'operation' });
                            if (opStack.length === 0) {
                                break;
                            }
                            opTop = opStack[opStack.length - 1];
                        }
                    }
                    opStack.push({ token, tokenType });
                    break;
                case 'function-argument':
                    securityLoopLvl2 = +securityLoopLvl2_default;
                    while (opStack[opStack.length - 1].token !== '(' && opStack.length > 0) {
                        securityLoopLvl2--;
                        if (securityLoopLvl2 === 0) {
                            console.log('SECURITY LEVEL 2 FUNCTION ARGUMENT EXIT');
                            break;
                        }
                        outQueue.push((opStack.pop()) || { token, tokenType });
                    }
                    break;
                case '(':
                    opStack.push({ token, tokenType });
                    if (expr[tokenPos] === '-') {
                        outQueue.push({ token: '0', tokenType: 'coefficient' });
                    }
                    break;
                case ')':
                    securityLoopLvl2 = +securityLoopLvl2_default;
                    while (opStack[opStack.length - 1].token !== '(' && opStack.length > 1) {
                        securityLoopLvl2--;
                        if (securityLoopLvl2 === 0) {
                            console.log('SECURITY LEVEL 2 CLOSING PARENTHESE EXIT');
                            break;
                        }
                        outQueue.push((opStack.pop()) || { token, tokenType });
                    }
                    opStack.pop();
                    break;
                case 'function':
                    opStack.push({ token, tokenType });
                    break;
                default:
                    console.log(`SHUTING YARD: ${tokenType} : ${token} `);
            }
        }
        this._rpn = outQueue.concat(opStack.reverse());
        return this;
    }
    get rpn() {
        return this._rpn;
    }
}
//# sourceMappingURL=shutingyard.js.map

/***/ }),

/***/ "./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue":
/*!*****************************************************************************!*\
  !*** ./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _quadratiques_forme_du_sommet_vue_vue_type_template_id_c16550a2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2 */ "./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2");
/* harmony import */ var _quadratiques_forme_du_sommet_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_quadratiques_forme_du_sommet_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_quadratiques_forme_du_sommet_vue_vue_type_template_id_c16550a2__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Challenges/ui/challengeTitle.vue":
/*!******************************************************************!*\
  !*** ./resources/js/Components/Challenges/ui/challengeTitle.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _challengeTitle_vue_vue_type_template_id_3f33bc08__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./challengeTitle.vue?vue&type=template&id=3f33bc08 */ "./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08");
/* harmony import */ var _challengeTitle_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./challengeTitle.vue?vue&type=script&setup=true&lang=js */ "./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js");
/* harmony import */ var C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,C_websites_scolcours_gymnase_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_challengeTitle_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_challengeTitle_vue_vue_type_template_id_3f33bc08__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Challenges/ui/challengeTitle.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js":
/*!****************************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratiques_forme_du_sommet_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratiques_forme_du_sommet_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeTitle_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeTitle_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./challengeTitle.vue?vue&type=script&setup=true&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=script&setup=true&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2 ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratiques_forme_du_sommet_vue_vue_type_template_id_c16550a2__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_quadratiques_forme_du_sommet_vue_vue_type_template_id_c16550a2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/quadratiques-forme-du-sommet.vue?vue&type=template&id=c16550a2");


/***/ }),

/***/ "./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08":
/*!************************************************************************************************!*\
  !*** ./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08 ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeTitle_vue_vue_type_template_id_3f33bc08__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_challengeTitle_vue_vue_type_template_id_3f33bc08__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./challengeTitle.vue?vue&type=template&id=3f33bc08 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Challenges/ui/challengeTitle.vue?vue&type=template&id=3f33bc08");


/***/ })

}]);