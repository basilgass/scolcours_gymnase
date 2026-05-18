import{D as e,H as t,k as n,mt as r,w as i,x as a}from"./@inertiajs-DcPzCMHT.js";import{t as o}from"./FormInput-BuloSurU.js";import{t as s}from"./FormCodearea-CD8lsIJR.js";import{t as c}from"./PiThreeParser-TT6F3VgA.js";var l={ref:`root`},u={class:`grid grid-cols-1 md:grid-cols-2 gap-3`},d={class:`flex flex-col gap-2`},f=n({__name:`DevThreeComponent`,setup(n){let f=r(`grid,axis`),p=r(`A(6,2,2)
B(3,8,3)
C(1,1,10)->*
p=plane A,B,C
O(0,0,6)->*
P=proj O,p
l=PA->w=2
v1=vPA,2->color=red,w=6
v2=vPB,3,1,0.5
a=arc A,P,B`);return p.value=`G(8,0,0)
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
z=plane v,C->color=green/0.4`,(n,r)=>(t(),i(`div`,l,[r[2]||=a(`h1`,{class:`text-2xl`},` Test de Three.js avec composant `,-1),a(`div`,u,[a(`div`,d,[e(o,{"font-code":``,sm:``,modelValue:f.value,"onUpdate:modelValue":r[0]||=e=>f.value=e},null,8,[`modelValue`]),e(s,{"font-code":``,sm:``,modelValue:p.value,"onUpdate:modelValue":r[1]||=e=>p.value=e},null,8,[`modelValue`])]),e(c,{draw:{code:p.value,parameters:f.value}},null,8,[`draw`])])],512))}});export{f as default};