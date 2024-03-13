import{notEqual as t}from"./reactive-element.min.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s={INITIAL:0,PENDING:1,COMPLETE:2,ERROR:3},i=Symbol();class e{get taskComplete(){return this.t||(1===this.status?this.t=new Promise(((t,s)=>{this.i=t,this.o=s})):3===this.status?this.t=Promise.reject(this.h):this.t=Promise.resolve(this.l)),this.t}constructor(t,s,i){this.u=0,this.status=0,(this.p=t).addController(this);const e="object"==typeof s?s:{task:s,args:i};this._=e.task,this.v=e.args,this.j=e.argsEqual??r,this.m=e.onComplete,this.g=e.onError,this.autoRun=e.autoRun??!0,"initialValue"in e&&(this.l=e.initialValue,this.status=2,this.k=this.A?.())}hostUpdate(){!0===this.autoRun&&this.O()}hostUpdated(){"afterUpdate"===this.autoRun&&this.O()}A(){if(void 0===this.v)return;const t=this.v();if(!Array.isArray(t))throw Error("The args function must return an array");return t}async O(){const t=this.A(),s=this.k;this.k=t,t===s||void 0===t||void 0!==s&&this.j(s,t)||await this.run(t)}async run(t){let s,e;t??=this.A(),this.k=t,1===this.status?this.T?.abort():(this.t=void 0,this.i=void 0,this.o=void 0),this.status=1,"afterUpdate"===this.autoRun?queueMicrotask((()=>this.p.requestUpdate())):this.p.requestUpdate();const r=++this.u;this.T=new AbortController;let h=!1;try{s=await this._(t,{signal:this.T.signal})}catch(t){h=!0,e=t}if(this.u===r){if(s===i)this.status=0;else{if(!1===h){try{this.m?.(s)}catch{}this.status=2,this.i?.(s)}else{try{this.g?.(e)}catch{}this.status=3,this.o?.(e)}this.l=s,this.h=e}this.p.requestUpdate()}}abort(t){1===this.status&&this.T?.abort(t)}get value(){return this.l}get error(){return this.h}render(t){switch(this.status){case 0:return t.initial?.();case 1:return t.pending?.();case 2:return t.complete?.(this.value);case 3:return t.error?.(this.error);default:throw Error("Unexpected status: "+this.status)}}}const r=(s,i)=>s===i||s.length===i.length&&s.every(((s,e)=>!t(s,i[e])));export{e as Task,s as TaskStatus,i as initialState,r as shallowArrayEquals};export default null;