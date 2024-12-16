import{_ as l}from"./PiThreeParser.vue_vue_type_script_setup_true_lang-CM2SNf3u.js";import{F as i}from"./FormMaker-OLf0Ib1E.js";import{d as s,r as a,L as d,M as n,N as e,Q as m}from"./@vue-C3RmibDr.js";import"./pithree-pVJO8Rx2.js";import"./three-COR8XSb1.js";import"./katex-C51zy0L-.js";import"./@vueuse-D7VVM3OV.js";import"./prismjs-DJBFtFNI.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./checkersConfig-DiPl9cay.js";import"./app-c9g_1h8a.js";import"./axios-upsvKRUO.js";import"./@inertiajs-DeK-2VcO.js";import"./deepmerge-B5vHlSG1.js";import"./qs-D4wRCCn6.js";import"./side-channel-i6h8oCVd.js";import"./es-errors-BzoIU2Qy.js";import"./object-inspect-DkgTANUN.js";import"./side-channel-list-JwgBesJK.js";import"./side-channel-map-CZ1URma-.js";import"./get-intrinsic-CNZ9a46L.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-PiMeFzxC.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./dunder-proto-D2CoUv6U.js";import"./call-bind-apply-helpers-B22ippET.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-Brbgm2Bq.js";import"./side-channel-weakmap-CFzGIYQQ.js";import"./lodash.clonedeep-DlhxUqcD.js";import"./lodash.isequal-kgeV4t6g.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-Db-fsz3C.js";import"./vue-demi-Dq6ymT-8.js";import"./vuedraggable-UlnRoSSG.js";import"./sortablejs-D5Oeo24j.js";import"./pimath-qcbX-Z2q.js";import"./MarkdownIt.vue_vue_type_script_setup_true_lang-CPl57NHF.js";import"./markdown-it-DI8MEbma.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-Dj65hjkv.js";import"./markdown-it-attrs-Cls-6C1c.js";import"./markdown-it-bracketed-spans-kJdXFC-S.js";import"./markdown-it-texmath-BZXs0d7W.js";const c={ref:"root"},u={class:"grid grid-cols-1 md:grid-cols-2 gap-3"},v={class:"flex flex-col gap-2"},vo=s({__name:"DevThreeComponent",setup(f){const t=a("grid,axis"),r=a(`A(6,2,2)
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
z=plane v,C->color=green/0.4`,(B,o)=>(d(),n("div",c,[o[2]||(o[2]=e("h1",{class:"text-2xl"}," Test de Three.js avec composant ",-1)),e("div",u,[e("div",v,[m(i,{"font-code":"",sm:"",modelValue:t.value,"onUpdate:modelValue":o[0]||(o[0]=p=>t.value=p)},null,8,["modelValue"]),m(i,{type:"code","font-code":"",sm:"",modelValue:r.value,"onUpdate:modelValue":o[1]||(o[1]=p=>r.value=p)},null,8,["modelValue"])]),m(l,{draw:{code:r.value,parameters:t.value}},null,8,["draw"])])],512))}});export{vo as default};
