import{_ as m}from"./PiThreeParser.vue_vue_type_script_setup_true_lang-Bnm9K_gt.js";import{F as p}from"./FormCodearea-BOuJzd4C.js";import{_ as d}from"./FormInput.vue_vue_type_script_setup_true_lang-CHY2UeJA.js";import{d as n,G as i,H as c,I as t,R as l,a as s}from"./@vue-BFXnVNxh.js";import"./pithree-BKfgrZQ2.js";import"./katex-DXZsJPfN.js";import"./@vueuse-dZHvWa0j.js";import"./useTextEditor-D0ulQq3n.js";import"./useFormMaker-BpKqxUME.js";import"./prismjs-CjA_WeCj.js";import"./es-errors-DRNByn_O.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./FormMakerWrapper.vue_vue_type_script_setup_true_lang-DJsywGH6.js";const u={ref:"root"},v={class:"grid grid-cols-1 md:grid-cols-2 gap-3"},f={class:"flex flex-col gap-2"},h=n({__name:"DevThreeComponent",setup(_){const a=s("grid,axis"),o=s(`A(6,2,2)
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
z=plane v,C->color=green/0.4`,(B,e)=>(i(),c("div",u,[e[2]||(e[2]=t("h1",{class:"text-2xl"}," Test de Three.js avec composant ",-1)),t("div",v,[t("div",f,[l(d,{"font-code":"",sm:"",modelValue:a.value,"onUpdate:modelValue":e[0]||(e[0]=r=>a.value=r)},null,8,["modelValue"]),l(p,{"font-code":"",sm:"",modelValue:o.value,"onUpdate:modelValue":e[1]||(e[1]=r=>o.value=r)},null,8,["modelValue"])]),l(m,{draw:{code:o.value,parameters:a.value}},null,8,["draw"])])],512))}});export{h as default};
