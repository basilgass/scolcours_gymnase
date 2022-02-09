"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[339,462],{

/***/ 4751:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ MainFooter)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MainFooter.vue?vue&type=template&id=4bcf5a20

var _hoisted_1 = {
  "class": "bg-black text-white px-10 mt-24"
};
var _hoisted_2 = {
  "class": "max-w-5xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-5"
};
var _hoisted_3 = {
  "class": "md:mx-auto"
};

var _hoisted_4 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("h3", {
  "class": "text-lg font-semibold"
}, " Plan du site ", -1);

var _hoisted_5 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("div", {
  "class": "md:mx-auto"
}, [/*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("h3", {
  "class": "text-lg font-semibold"
}, " Liens ")], -1);

var _hoisted_6 = {
  "class": "md:mx-auto"
};

var _hoisted_7 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("h3", {
  "class": "text-lg font-semibold"
}, " Utilisateur ", -1);

var _hoisted_8 = {
  key: 0
};
var _hoisted_9 = {
  key: 1
};

var _hoisted_10 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" Se connecter ");

var _hoisted_11 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("div", {
  "class": "pb-5 text-center text-sm text-gray-400"
}, [/*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("span", null, "Ce site est à usage mathématiques uniquement")], -1);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_ThemeLinks = (0,vue_esm_bundler.resolveComponent)("ThemeLinks");

  var _component_Link = (0,vue_esm_bundler.resolveComponent)("Link");

  var _component_LogoutButton = (0,vue_esm_bundler.resolveComponent)("LogoutButton");

  return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_1, [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_2, [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_3, [_hoisted_4, (0,vue_esm_bundler.createVNode)(_component_ThemeLinks)]), _hoisted_5, (0,vue_esm_bundler.createElementVNode)("div", _hoisted_6, [_hoisted_7, _ctx.$page.props.auth.user ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_8, [(0,vue_esm_bundler.createVNode)(_component_Link, {
    href: "/dashboard",
    "class": "block"
  }, {
    "default": (0,vue_esm_bundler.withCtx)(function () {
      return [(0,vue_esm_bundler.createTextVNode)((0,vue_esm_bundler.toDisplayString)(_ctx.$page.props.auth.user.name), 1)];
    }),
    _: 1
  }), (0,vue_esm_bundler.createVNode)(_component_LogoutButton, {
    "class": "mt-10 px-0 py-0"
  })])) : ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", _hoisted_9, [(0,vue_esm_bundler.createVNode)(_component_Link, {
    href: "/login"
  }, {
    "default": (0,vue_esm_bundler.withCtx)(function () {
      return [_hoisted_10];
    }),
    _: 1
  })]))])]), _hoisted_11]);
}
;// CONCATENATED MODULE: ./resources/js/Components/MainFooter.vue?vue&type=template&id=4bcf5a20

// EXTERNAL MODULE: ./resources/js/Components/Ui/LogoutButton.vue + 4 modules
var LogoutButton = __webpack_require__(761);
// EXTERNAL MODULE: ./resources/js/Components/Ui/ThemeLinks.vue + 2 modules
var ThemeLinks = __webpack_require__(4333);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MainFooter.vue?vue&type=script&lang=js


/* harmony default export */ const MainFootervue_type_script_lang_js = ({
  name: 'MainFooter',
  components: {
    LogoutButton: LogoutButton/* default */.Z,
    ThemeLinks: ThemeLinks/* default */.Z
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/MainFooter.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(3744);
;// CONCATENATED MODULE: ./resources/js/Components/MainFooter.vue




;
const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(MainFootervue_type_script_lang_js, [['render',render]])

/* harmony default export */ const MainFooter = (__exports__);

/***/ }),

/***/ 4391:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ ArticleTitle)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/ArticleTitle.vue?vue&type=script&setup=true&lang=js

var _hoisted_1 = {
  key: 0,
  "class": "text-3xl pt-5 mb-2"
};

/* harmony default export */ const ArticleTitlevue_type_script_setup_true_lang_js = ({
  props: {
    title: String,
    head: String,
    chapter: String
  },
  setup: function setup(__props) {
    var props = __props;
    var headTitle = (0,vue_esm_bundler.computed)(function () {
      if (props.head) {
        return props.head;
      }

      var calculatedTitle = 'ScolCours';

      if (props.chapter) {
        calculatedTitle = props.chapter + '-' + calculatedTitle;
      }

      if (props.title) {
        calculatedTitle = props.title + '-' + calculatedTitle;
      }

      return calculatedTitle;
    });
    var showTitle = (0,vue_esm_bundler.ref)(false);
    (0,vue_esm_bundler.onMounted)(function () {
      showTitle.value = true;
    });
    return function (_ctx, _cache) {
      var _component_Head = (0,vue_esm_bundler.resolveComponent)("Head");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, [(0,vue_esm_bundler.createVNode)(_component_Head, null, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.createElementVNode)("title", null, "\n\t\t\t" + (0,vue_esm_bundler.toDisplayString)((0,vue_esm_bundler.unref)(headTitle)) + "\n\t\t", 1)];
        }),
        _: 1
      }), (0,vue_esm_bundler.createVNode)(vue_esm_bundler.Transition, {
        name: "title-effect"
      }, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.unref)(showTitle) ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("h1", _hoisted_1, (0,vue_esm_bundler.toDisplayString)(__props.title), 1)) : (0,vue_esm_bundler.createCommentVNode)("", true)];
        }),
        _: 1
      })], 64);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Ui/ArticleTitle.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Ui/ArticleTitle.vue



const __exports__ = ArticleTitlevue_type_script_setup_true_lang_js;

/* harmony default export */ const ArticleTitle = (__exports__);

/***/ }),

/***/ 761:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ LogoutButton)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/LogoutButton.vue?vue&type=template&id=26db61ee


var _hoisted_1 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" se déconnecter ");

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_Link = (0,vue_esm_bundler.resolveComponent)("Link");

  return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createBlock)(_component_Link, {
    as: "button",
    "class": "text-left px-3 py-2",
    href: "/logout",
    method: "post"
  }, {
    "default": (0,vue_esm_bundler.withCtx)(function () {
      return [_hoisted_1];
    }),
    _: 1
  });
}
;// CONCATENATED MODULE: ./resources/js/Components/Ui/LogoutButton.vue?vue&type=template&id=26db61ee

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/LogoutButton.vue?vue&type=script&lang=js
/* harmony default export */ const LogoutButtonvue_type_script_lang_js = ({
  name: 'LogoutButton'
});
;// CONCATENATED MODULE: ./resources/js/Components/Ui/LogoutButton.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(3744);
;// CONCATENATED MODULE: ./resources/js/Components/Ui/LogoutButton.vue




;
const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(LogoutButtonvue_type_script_lang_js, [['render',render]])

/* harmony default export */ const LogoutButton = (__exports__);

/***/ }),

/***/ 4333:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ ThemeLinks)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Ui/ThemeLinks.vue?vue&type=script&setup=true&lang=js

/* harmony default export */ const ThemeLinksvue_type_script_setup_true_lang_js = ({
  emits: ['ClickNavigationLinks'],
  setup: function setup(__props, _ref) {
    var emit = _ref.emit;
    return function (_ctx, _cache) {
      var _component_Link = (0,vue_esm_bundler.resolveComponent)("Link");

      return (0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)(_ctx.$page.props.themes, function (theme) {
        return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createBlock)(_component_Link, {
          key: "anchor-".concat(theme.slug),
          href: _ctx.route('theme', theme.slug),
          "class": "block transition duration-300 hover:translate-x-2 px-4 py-1",
          onClick: _cache[0] || (_cache[0] = function ($event) {
            return (0,vue_esm_bundler.unref)(emit)('ClickNavigationLinks');
          })
        }, {
          "default": (0,vue_esm_bundler.withCtx)(function () {
            return [(0,vue_esm_bundler.createElementVNode)("i", {
              "class": (0,vue_esm_bundler.normalizeClass)(["bi-".concat(theme.icon), "mr-2"])
            }, null, 2), (0,vue_esm_bundler.createTextVNode)((0,vue_esm_bundler.toDisplayString)(theme.title), 1)];
          }),
          _: 2
        }, 1032, ["href"]);
      }), 128);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/Ui/ThemeLinks.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/Ui/ThemeLinks.vue



const __exports__ = ThemeLinksvue_type_script_setup_true_lang_js;

/* harmony default export */ const ThemeLinks = (__exports__);

/***/ }),

/***/ 7339:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Chapters)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./resources/js/Components/Ui/ArticleTitle.vue + 2 modules
var ArticleTitle = __webpack_require__(4391);
// EXTERNAL MODULE: ./resources/js/Pages/Shared/LayoutMain.vue + 8 modules
var LayoutMain = __webpack_require__(9462);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Chapters/index.vue?vue&type=script&setup=true&lang=js

var _hoisted_1 = {
  "class": "space-y-5 mt-10"
};
var _hoisted_2 = ["href"];


var __default__ = {
  layout: LayoutMain["default"]
};
/* harmony default export */ const Chaptersvue_type_script_setup_true_lang_js = (/*#__PURE__*/Object.assign(__default__, {
  props: {
    theme: {
      type: Object,
      "default": function _default() {}
    },
    chapters: {
      type: Array,
      "default": function _default() {
        return [];
      }
    }
  },
  setup: function setup(__props) {
    return function (_ctx, _cache) {
      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(ArticleTitle/* default */.Z), {
        title: __props.theme.title
      }, null, 8, ["title"]), (0,vue_esm_bundler.createElementVNode)("div", _hoisted_1, [((0,vue_esm_bundler.openBlock)(true), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, (0,vue_esm_bundler.renderList)(__props.chapters, function (chapter) {
        return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", {
          key: "chapter-".concat(chapter.slug)
        }, [(0,vue_esm_bundler.createElementVNode)("a", {
          href: _ctx.route('theme.chapter', [_ctx.$page.props.theme.slug, chapter.slug]),
          "class": "text-2xl hover:pl-3 transform transition-all"
        }, (0,vue_esm_bundler.toDisplayString)(chapter.title), 9, _hoisted_2), (0,vue_esm_bundler.createElementVNode)("p", null, (0,vue_esm_bundler.toDisplayString)(chapter.body), 1)]);
      }), 128))])], 64);
    };
  }
}));
;// CONCATENATED MODULE: ./resources/js/Pages/Chapters/index.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Pages/Chapters/index.vue



const __exports__ = Chaptersvue_type_script_setup_true_lang_js;

/* harmony default export */ const Chapters = (__exports__);

/***/ }),

/***/ 9462:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ LayoutMain)
});

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm-bundler.js + 6 modules
var vue_esm_bundler = __webpack_require__(821);
// EXTERNAL MODULE: ./resources/js/Components/Ui/LogoutButton.vue + 4 modules
var LogoutButton = __webpack_require__(761);
// EXTERNAL MODULE: ./resources/js/Components/Ui/ThemeLinks.vue + 2 modules
var ThemeLinks = __webpack_require__(4333);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MainAside.vue?vue&type=script&setup=true&lang=js

var _hoisted_1 = {
  "class": "fixed top-0 left-0 w-full z-50 sm:w-60 bg-black min-h-screen text-white"
};
var _hoisted_2 = {
  "class": "space-y-1 py-2 text-sm"
};
var _hoisted_3 = {
  "class": "relative"
};

var _hoisted_4 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" ScolCours ");

var _hoisted_5 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" accueil ");

var _hoisted_6 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("hr", null, null, -1);

var _hoisted_7 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("hr", null, null, -1);



/* harmony default export */ const MainAsidevue_type_script_setup_true_lang_js = ({
  setup: function setup(__props) {
    return function (_ctx, _cache) {
      var _component_Link = (0,vue_esm_bundler.resolveComponent)("Link");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("aside", null, [(0,vue_esm_bundler.createVNode)(vue_esm_bundler.Transition, {
        name: "fade"
      }, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", {
            "class": "fixed top-0 left-0 w-full h-full bg-black/60",
            onClick: _cache[0] || (_cache[0] = function ($event) {
              return _ctx.$parent.showAside = false;
            })
          }, null, 512), [[vue_esm_bundler.vShow, _ctx.$parent.showAside]])];
        }),
        _: 1
      }), (0,vue_esm_bundler.createVNode)(vue_esm_bundler.Transition, {
        name: "slide-fade"
      }, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [(0,vue_esm_bundler.withDirectives)((0,vue_esm_bundler.createElementVNode)("div", _hoisted_1, [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_2, [(0,vue_esm_bundler.createElementVNode)("div", _hoisted_3, [(0,vue_esm_bundler.createElementVNode)("i", {
            "class": "absolute top-0 right-4 text-lg text-gray-500 hover:text-white transition duration-300 bi bi-x-circle cursor-pointer",
            onClick: _cache[1] || (_cache[1] = function ($event) {
              return _ctx.$parent.showAside = false;
            })
          }), (0,vue_esm_bundler.createVNode)(_component_Link, {
            "class": "text-lg mt-5 px-4",
            href: _ctx.route('home')
          }, {
            "default": (0,vue_esm_bundler.withCtx)(function () {
              return [_hoisted_4];
            }),
            _: 1
          }, 8, ["href"])]), (0,vue_esm_bundler.createVNode)(_component_Link, {
            href: _ctx.route('home'),
            "class": "block transition duration-300 hover:translate-x-2 px-4 py-1",
            onClick: _cache[2] || (_cache[2] = function ($event) {
              return _ctx.$parent.showAside = false;
            })
          }, {
            "default": (0,vue_esm_bundler.withCtx)(function () {
              return [_hoisted_5];
            }),
            _: 1
          }, 8, ["href"]), _hoisted_6, (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(ThemeLinks/* default */.Z), {
            onClickNavigationLinks: _cache[3] || (_cache[3] = function ($event) {
              return _ctx.$parent.showAside = false;
            })
          }), _hoisted_7, _ctx.$page.props.auth.user ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createBlock)((0,vue_esm_bundler.unref)(LogoutButton/* default */.Z), {
            key: 0
          })) : (0,vue_esm_bundler.createCommentVNode)("", true)])], 512), [[vue_esm_bundler.vShow, _ctx.$parent.showAside]])];
        }),
        _: 1
      })]);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/MainAside.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/MainAside.vue



const __exports__ = MainAsidevue_type_script_setup_true_lang_js;

/* harmony default export */ const MainAside = (__exports__);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MainHeader.vue?vue&type=script&setup=true&lang=js

var MainHeadervue_type_script_setup_true_lang_js_hoisted_1 = {
  "class": "scolcours-container py-6 flex justify-between items-center"
};
var MainHeadervue_type_script_setup_true_lang_js_hoisted_2 = {
  "class": "text-3xl"
};
var MainHeadervue_type_script_setup_true_lang_js_hoisted_3 = ["href"];
var MainHeadervue_type_script_setup_true_lang_js_hoisted_4 = {
  key: 0
};
var MainHeadervue_type_script_setup_true_lang_js_hoisted_5 = {
  key: 0,
  "class": "w-40 flex flex-col text-left space-y-1 py-2 absolute top-5 -right-1 bg-white text-gray-800 border-gray-200 rounded shadow-lg"
};

var MainHeadervue_type_script_setup_true_lang_js_hoisted_6 = /*#__PURE__*/(0,vue_esm_bundler.createTextVNode)(" profil ");

var MainHeadervue_type_script_setup_true_lang_js_hoisted_7 = {
  key: 1
};

var _hoisted_8 = /*#__PURE__*/(0,vue_esm_bundler.createElementVNode)("a", {
  href: "/login"
}, " Se connecter ", -1);

var _hoisted_9 = [_hoisted_8];



/* harmony default export */ const MainHeadervue_type_script_setup_true_lang_js = ({
  props: {
    theme: Object
  },
  setup: function setup(__props, _ref) {
    var expose = _ref.expose;
    var showMenu = (0,vue_esm_bundler.ref)(false),
        showAside = (0,vue_esm_bundler.ref)(false);
    expose({
      showAside: showAside,
      showMenu: showMenu
    });
    return function (_ctx, _cache) {
      var _component_Link = (0,vue_esm_bundler.resolveComponent)("Link");

      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("header", {
        "class": (0,vue_esm_bundler.normalizeClass)(["shadow text-white", "scolcours-".concat(__props.theme.slug)])
      }, [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(MainAside)), (0,vue_esm_bundler.createElementVNode)("div", MainHeadervue_type_script_setup_true_lang_js_hoisted_1, [(0,vue_esm_bundler.createElementVNode)("div", MainHeadervue_type_script_setup_true_lang_js_hoisted_2, [(0,vue_esm_bundler.createElementVNode)("i", {
        "class": "bi bi-list cursor-pointer mr-2",
        onClick: _cache[0] || (_cache[0] = function ($event) {
          return (0,vue_esm_bundler.isRef)(showAside) ? showAside.value = !(0,vue_esm_bundler.unref)(showAside) : showAside = !(0,vue_esm_bundler.unref)(showAside);
        })
      }), (0,vue_esm_bundler.createElementVNode)("a", {
        href: __props.theme.slug === 'main' ? "/" : "/".concat(__props.theme.slug)
      }, (0,vue_esm_bundler.toDisplayString)(__props.theme.title), 9, MainHeadervue_type_script_setup_true_lang_js_hoisted_3)]), (0,vue_esm_bundler.createElementVNode)("div", null, [_ctx.$page.props.auth.user ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", MainHeadervue_type_script_setup_true_lang_js_hoisted_4, [(0,vue_esm_bundler.createElementVNode)("div", {
        "class": "relative cursor-pointer",
        onClick: _cache[1] || (_cache[1] = function ($event) {
          return (0,vue_esm_bundler.isRef)(showMenu) ? showMenu.value = !(0,vue_esm_bundler.unref)(showMenu) : showMenu = !(0,vue_esm_bundler.unref)(showMenu);
        })
      }, [(0,vue_esm_bundler.createTextVNode)((0,vue_esm_bundler.toDisplayString)(_ctx.$page.props.auth.user.name) + " ", 1), (0,vue_esm_bundler.unref)(showMenu) ? ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", MainHeadervue_type_script_setup_true_lang_js_hoisted_5, [(0,vue_esm_bundler.createVNode)(_component_Link, {
        "class": "hover:bg-gray-100 px-3 py-2",
        href: "/dashboard"
      }, {
        "default": (0,vue_esm_bundler.withCtx)(function () {
          return [MainHeadervue_type_script_setup_true_lang_js_hoisted_6];
        }),
        _: 1
      }), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(LogoutButton/* default */.Z), {
        "class": "hover:bg-gray-100"
      })])) : (0,vue_esm_bundler.createCommentVNode)("", true)])])) : ((0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)("div", MainHeadervue_type_script_setup_true_lang_js_hoisted_7, _hoisted_9))])])], 2);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Components/MainHeader.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Components/MainHeader.vue



const MainHeader_exports_ = MainHeadervue_type_script_setup_true_lang_js;

/* harmony default export */ const MainHeader = (MainHeader_exports_);
// EXTERNAL MODULE: ./resources/js/Components/MainFooter.vue + 4 modules
var MainFooter = __webpack_require__(4751);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Shared/LayoutMain.vue?vue&type=script&setup=true&lang=js

var LayoutMainvue_type_script_setup_true_lang_js_hoisted_1 = {
  "class": "min-h-screen bg-gray-100"
};
var LayoutMainvue_type_script_setup_true_lang_js_hoisted_2 = {
  "class": "scolcours-container min-h-screen"
};


/* harmony default export */ const LayoutMainvue_type_script_setup_true_lang_js = ({
  props: {
    theme: {
      type: Object,
      "default": function _default() {
        return {
          title: 'Scolcours',
          slug: 'main'
        };
      }
    }
  },
  setup: function setup(__props) {
    return function (_ctx, _cache) {
      return (0,vue_esm_bundler.openBlock)(), (0,vue_esm_bundler.createElementBlock)(vue_esm_bundler.Fragment, null, [(0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(MainHeader), {
        theme: __props.theme
      }, null, 8, ["theme"]), (0,vue_esm_bundler.createElementVNode)("div", LayoutMainvue_type_script_setup_true_lang_js_hoisted_1, [(0,vue_esm_bundler.createElementVNode)("main", LayoutMainvue_type_script_setup_true_lang_js_hoisted_2, [(0,vue_esm_bundler.renderSlot)(_ctx.$slots, "default")]), (0,vue_esm_bundler.createVNode)((0,vue_esm_bundler.unref)(MainFooter/* default */.Z))])], 64);
    };
  }
});
;// CONCATENATED MODULE: ./resources/js/Pages/Shared/LayoutMain.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./resources/js/Pages/Shared/LayoutMain.vue



const LayoutMain_exports_ = LayoutMainvue_type_script_setup_true_lang_js;

/* harmony default export */ const LayoutMain = (LayoutMain_exports_);

/***/ })

}]);