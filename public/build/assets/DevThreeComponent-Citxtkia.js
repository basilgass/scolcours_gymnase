import{_ as l}from"./PiThreeParser.vue_vue_type_script_setup_true_lang-DOQ6juR-.js";import{F as i}from"./FormMaker-B5zl7ZU5.js";import{d as s,r as a,aM as d,X as n,Y as m,a3 as p}from"./@vue-C7CAQydB.js";import"./pithree-De9EoZRh.js";import"./katex-BGZWzji8.js";import"./call-bind-aBC2DkHY.js";import"./get-intrinsic-BKEvijrG.js";import"./es-errors-DzOT6E3C.js";import"./has-symbols-eVqrYdw7.js";import"./has-proto-JnoBQRdH.js";import"./function-bind-BbkWVFrm.js";import"./hasown-DYqjtFKE.js";import"./set-function-length-B5OANX0j.js";import"./define-data-property-DO9o5wXF.js";import"./es-define-property-tzmkNPou.js";import"./gopd-CEkvUycD.js";import"./has-property-descriptors-DphFXkuo.js";import"./@vueuse-Cmb8eUK9.js";import"./prismjs-pcO6U3_1.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./checkersConfig-CQFKPipF.js";import"./pimath-ipE5veYI.js";import"./app-BMkTAXOC.js";import"./axios-DsPaXkF5.js";import"./@inertiajs-BRSEFVQN.js";import"./deepmerge-CtOfIP5S.js";import"./qs-DYit9DaA.js";import"./side-channel-CbjMffun.js";import"./object-inspect-8Tg_cmh0.js";import"./nprogress-uqLJ5xmn.js";import"./lodash.clonedeep-Bxvn-V0B.js";import"./lodash.isequal-BYpQg7Um.js";import"./vuedraggable-lLs_UhuF.js";import"./sortablejs-D5Oeo24j.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./MarkdownIt.vue_vue_type_script_setup_true_lang-D6A5aCm_.js";import"./markdown-it-DI8MEbma.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-Dj65hjkv.js";import"./markdown-it-attrs-BzjOIdNz.js";import"./markdown-it-bracketed-spans-DBuKuf9B.js";import"./markdown-it-texmath-IgwaQ_Ij.js";const c={ref:"root"},u=m("h1",{class:"text-2xl"}," Test de Three.js avec composant ",-1),v={class:"grid grid-cols-1 md:grid-cols-2 gap-3"},_={class:"flex flex-col gap-2"},so=s({__name:"DevThreeComponent",setup(f){const t=a("grid,axis"),o=a(`A(6,2,2)
B(3,8,3)
C(1,1,10)->*
p=plane A,B,C
O(0,0,6)->*
P=proj O,p
l=PA->w=2
v1=vPA,2->color=red,w=6
v2=vPB,3,1,0.5
a=arc A,P,B`);return o.value=`G(8,0,0)
H(0,4,0)
I(0,0,10)
p=plane G,H,I,20,15
A(6,6,6)->*,tex=A
B=proj A,p->tex=B
n=BA.->color=red,w=2
J(2,0,7)
C=proj J,p->tex=C
v=CA.
d=BC.->dash
a=arc B,A,C->mark
z=plane v,C->color=green/0.4`,(B,r)=>(d(),n("div",c,[u,m("div",v,[m("div",_,[p(i,{"font-code":"",sm:"",modelValue:t.value,"onUpdate:modelValue":r[0]||(r[0]=e=>t.value=e)},null,8,["modelValue"]),p(i,{type:"code","font-code":"",sm:"",modelValue:o.value,"onUpdate:modelValue":r[1]||(r[1]=e=>o.value=e)},null,8,["modelValue"])]),p(l,{draw:{code:o.value,parameters:t.value}},null,8,["draw"])])],512))}});export{so as default};
