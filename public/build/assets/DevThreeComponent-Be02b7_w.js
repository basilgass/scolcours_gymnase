import{_ as l}from"./PiThreeParser.vue_vue_type_script_setup_true_lang-CKjgZRBo.js";import{F as i}from"./FormMaker-BGLWqbjc.js";import{d as s,r as a,aU as d,a1 as n,a2 as p,a9 as m}from"./@vue-D-HBrq3Q.js";import"./pithree-pVJO8Rx2.js";import"./three-COR8XSb1.js";import"./katex-BGZWzji8.js";import"./call-bind-aBC2DkHY.js";import"./get-intrinsic-BKEvijrG.js";import"./es-errors-DzOT6E3C.js";import"./has-symbols-eVqrYdw7.js";import"./has-proto-JnoBQRdH.js";import"./function-bind-BbkWVFrm.js";import"./hasown-DYqjtFKE.js";import"./set-function-length-B5OANX0j.js";import"./define-data-property-DO9o5wXF.js";import"./es-define-property-tzmkNPou.js";import"./gopd-CEkvUycD.js";import"./has-property-descriptors-DphFXkuo.js";import"./@vueuse-Ds0mpvNY.js";import"./prismjs-pcO6U3_1.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./checkersConfig-BHwILXXn.js";import"./app-Bd-m9Bd9.js";import"./axios-CCb-kr4I.js";import"./@inertiajs-RMml1IUU.js";import"./deepmerge-CtOfIP5S.js";import"./qs-Bgg5YRNC.js";import"./side-channel-CbjMffun.js";import"./object-inspect-8Tg_cmh0.js";import"./nprogress-uqLJ5xmn.js";import"./lodash.clonedeep-Bxvn-V0B.js";import"./lodash.isequal-BYpQg7Um.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-BLhcdsmd.js";import"./vuedraggable-D8rOE95J.js";import"./sortablejs-D5Oeo24j.js";import"./pimath-qcbX-Z2q.js";import"./MarkdownIt.vue_vue_type_script_setup_true_lang-BFfbQ-5x.js";import"./markdown-it-DI8MEbma.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-Dj65hjkv.js";import"./markdown-it-attrs-BzjOIdNz.js";import"./markdown-it-bracketed-spans-DBuKuf9B.js";import"./markdown-it-texmath-IgwaQ_Ij.js";const c={ref:"root"},u={class:"grid grid-cols-1 md:grid-cols-2 gap-3"},v={class:"flex flex-col gap-2"},no=s({__name:"DevThreeComponent",setup(f){const t=a("grid,axis"),r=a(`A(6,2,2)
B(3,8,3)
C(1,1,10)->*
p=plane A,B,C
O(0,0,6)->*
P=proj O,p
l=PA->w=2
v1=vPA,2->color=red,w=6
v2=vPB,3,1,0.5
a=arc A,P,B`);return r.value=`G(8,0,0)
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
z=plane v,C->color=green/0.4`,(B,o)=>(d(),n("div",c,[o[2]||(o[2]=p("h1",{class:"text-2xl"}," Test de Three.js avec composant ",-1)),p("div",u,[p("div",v,[m(i,{"font-code":"",sm:"",modelValue:t.value,"onUpdate:modelValue":o[0]||(o[0]=e=>t.value=e)},null,8,["modelValue"]),m(i,{type:"code","font-code":"",sm:"",modelValue:r.value,"onUpdate:modelValue":o[1]||(o[1]=e=>r.value=e)},null,8,["modelValue"])]),m(l,{draw:{code:r.value,parameters:t.value}},null,8,["draw"])])],512))}});export{no as default};
