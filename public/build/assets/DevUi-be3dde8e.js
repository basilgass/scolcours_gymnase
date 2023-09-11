import{r as i,o as x,c as h,q as b,s as k,e as c,t as v,L as M,a as U,p as L,b as r,u as s,d as u,g as N,F as C}from"./app-8fa85098.js";import{_ as E}from"./_plugin-vue_export-helper-c27b6911.js";import{_ as g}from"./FormNumber-5b9badd0.js";import{_ as q}from"./FormTextarea-ee9df6ad.js";import{_ as D}from"./MarkdownIt-962551e4.js";import"./FormError-9854881a.js";import"./FormLabel-965a7141.js";import"./texmath-31130d3f.js";const I={class:"w-full"},O=["min","max"],S={class:"output"},F={__name:"UiSlider",props:{modelValue:{type:Number},min:{type:Number,required:!0},max:{type:Number,required:!0}},emits:["update:modelValue"],setup(m,{emit:e}){const a=i(m.min);return(d,l)=>(x(),h("div",I,[b(c("input",{"onUpdate:modelValue":l[0]||(l[0]=p=>a.value=p),type:"range",min:m.min,max:m.max,class:"slider",onInput:l[1]||(l[1]=p=>e("update:modelValue",+a.value))},null,40,O),[[k,a.value]]),c("div",S,v(a.value),1)]))}},R=E(F,[["__scopeId","data-v-486c38a8"]]);class B{get options(){return this._options}set options(e){this._options=e}get name(){return this._name}set name(e){this._name=e}get description(){return this._description}set description(e){this._description=e}constructor(e){this._options=e??[]}}class T extends B{constructor(e){super(e),this.name="HELLO WORLD",this.description="MY SUPER NICE DESCRIPTION"}check(e,o){return{message:"",result:!1}}format(){return""}}const P={class:"border"},$={class:"bg-white p-10"},J=M({__name:"DevUi",setup(m){let e=i(15),o=i(10),a=i(40),d=i(""),l=i(""),p=new T(["trois","quatre","cinq"]);console.log(p.name),console.log(p.description),console.log(p.format());function w(f){l.value=f}let y=i(`<div class="not-prose">
			<table class="border-r tos border-gray-400 mx-auto">
				<thead>
					<tr>
						<th class="border-r border-gray-400" /><th>
							<div class="flex flex-row items-center">
								<div class="text-xs pl-1 text-left w-12 katex-container">
									<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>−</mo><mi mathvariant="normal">∞</mi></mrow><annotation encoding="application/x-tex">-\\infty</annotation></semantics></math></span><span
										class="katex-html"
										aria-hidden="true"
									><span class="base"><span
										class="strut"
										style="height:0.6667em;vertical-align:-0.0833em;"
									/><span class="mord">−</span><span class="mord">∞</span></span></span></span>
								</div><div class="text-xs mr-1 text-right w-12 katex-container">
									<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>+</mo><mi mathvariant="normal">∞</mi></mrow><annotation encoding="application/x-tex">+\\infty</annotation></semantics></math></span><span
										class="katex-html"
										aria-hidden="true"
									><span class="base"><span
										class="strut"
										style="height:0.6667em;vertical-align:-0.0833em;"
									/><span class="mord">+</span><span class="mord">∞</span></span></span></span>
								</div>
							</div>
						</th>
					</tr>
				</thead><tbody /><tfoot class="border-t border-t-2 border-gray-400">
					<!--v-if--><!--v-if--><tr class="border-t border-t-2 border-gray-400">
						<td class="min-w-[100px] border-r text-center border-gray-400 katex-container">
							<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">f(x)</annotation></semantics></math></span><span
								class="katex-html"
								aria-hidden="true"
							><span class="base"><span
								class="strut"
								style="height:1em;vertical-align:-0.25em;"
							/><span
								class="mord mathnormal"
								style="margin-right:0.10764em;"
							>f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span></span></span></span>
						</td><td><div class="flex flex-row" /></td>
					</tr>
				</tfoot>
			</table><!--v-if-->
		</div>
		{.border .px-3 .py-1 .border-blue-600 bg-blue-100}`);return(f,n)=>{const _=U("FormKit"),V=L("theme");return x(),h(C,null,[r(D,{text:s(y)},null,8,["text"]),r(g,{modelValue:s(o),"onUpdate:modelValue":n[0]||(n[0]=t=>u(o)?o.value=t:o=t),name:"vmin"},null,8,["modelValue"]),r(g,{modelValue:s(a),"onUpdate:modelValue":n[1]||(n[1]=t=>u(a)?a.value=t:a=t),name:"vmin"},null,8,["modelValue"]),c("div",null,[r(R,{modelValue:s(e),"onUpdate:modelValue":n[2]||(n[2]=t=>u(e)?e.value=t:e=t),max:s(a),min:s(o)},null,8,["modelValue","max","min"])]),c("div",null,"FROM UI COMPONENT: "+v(s(e)),1),r(q,{modelValue:s(d),"onUpdate:modelValue":n[3]||(n[3]=t=>u(d)?d.value=t:d=t),label:"test avec ligne courant",name:"test",onCurrentLine:w},null,8,["modelValue"]),b((x(),h("div",P,[N(v(s(l)),1)])),[[V,"arithmetique",void 0,{border:!0}]]),c("div",$,[r(_,{label:"Hello world",placeholder:"why not ?",type:"text","suffix-icon":"avatarMan","suffix-icon-class":"!p-0"}),r(_,{label:"small text",placeholder:"why not ?",type:"text","input-class":"!py-1 text-xs w-full","prefix-icon":"avatarMan"})])],64)}}});export{J as default};
