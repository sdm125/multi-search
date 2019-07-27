class InputGroup{constructor(e,t,n=this.createInputGroupElm()){this._elm=n,this._searchInput=this._elm.querySelector(".search"),this._combineListContainer=this._elm.querySelector(".combine-list-container"),this._combineListElm=this._combineListContainer.querySelector("ul"),this._name=e||this._searchInput.name,this._value=t||this._searchInput.value,Search.addSearchValue({name:this._name,value:this._value}),InputGroup.inputGroups.push(this),this.checkForSingleInputGroup(),this.addEventListeners()}get elm(){return this._elm}get value(){return this._searchInput.value}set value(e){this._value=e}setValue(e){this._searchInput.value=e,Search.updateSearchValue({name:this._searchInput.name,value:this.value})}setName(e){this._searchInput.name=e}getName(){return this._searchInput.name}combine(e){e.target.classList.contains("combine-item")&&(this._searchInput.value=`${this.value} ${e.target.getAttribute("data-search-term")}`,Search.updateSearchValue({name:this._searchInput.name,value:this.value}),Search.updateCombineDropDown(),this.toggleCombineDropDown())}remove(){Search.removeSearchValue(this._searchInput.name),InputGroup.inputGroups=InputGroup.inputGroups.filter(e=>e!==this),this._elm.remove()}toggleCombineDropDown(){"none"===this._combineListElm.style.display?this.showCombineDropDown():this.hideCombineDropDown()}showCombineDropDown(){InputGroup.inputGroups.forEach(e=>e.hideCombineDropDown()),this._combineListElm.style.display="block"}hideCombineDropDown(){this._combineListElm.style.display="none"}updateCombineDropDown(e){const t=this;this._combineListElm&&this._combineListElm.remove(),this._combineListElm=e,this._combineListContainer.appendChild(this._combineListElm),this._combineListElm.addEventListener("click",function(e){t.combine(e)})}static generateID(){return Math.random().toString(16).substring(2)}createInputGroupElm(){let e=document.createElement("div"),t=document.createElement("div"),n=document.createElement("input"),r=document.createElement("button"),a=document.createElement("div"),o=document.createElement("ul"),i=document.createElement("button"),s=document.createElement("button"),l=InputGroup.generateID();return e.classList+="input-group mb-3",e.setAttribute("data-remove",l),t.classList.add("input-group-append"),InputGroup.inputGroups.length<1?(n.classList.add("single-search"),t.classList.add("hide")):n.classList.add("multi-search"),n.type="text",n.setAttribute("placeholder","Search"),n.name=l,n.classList+=" form-control input-group-lg search",i.type="button",i.classList+="btn btn-outline-secondary js-combine combine-btn",i.innerHTML='<img src="/icons/plus-circle.svg">',o=Search.getCombineDropDown(),a.classList.add("combine-list-container"),a.appendChild(i),a.appendChild(o),r.type="button",r.classList+="btn btn-outline-secondary js-remove-from-search remove-from-search-btn",r.innerHTML='<img src="/icons/trash-2.svg">',s.type="button",s.classList+="btn btn-outline-secondary move-search",s.innerHTML='<img class="js-move" src="/icons/move.svg">',e.appendChild(n),t.appendChild(a),t.appendChild(r),t.appendChild(s),e.appendChild(t),e}showMultiSearchControls(){this.elm.querySelector(".input-group-append").classList.remove("hide"),this._searchInput.classList.remove("single-search"),this._searchInput.classList.add("multi-search")}hideMultiSearchControls(){this.elm.querySelector(".input-group-append").classList.add("hide"),this._searchInput.classList.remove("multi-search"),this._searchInput.classList.add("single-search")}checkForSingleInputGroup(){1===InputGroup.inputGroups.length?(InputGroup.inputGroups[0].hideMultiSearchControls(),document.querySelector(".multi-search-controls").classList.add("hide")):(InputGroup.inputGroups[0].showMultiSearchControls(),document.querySelector(".multi-search-controls").classList.remove("hide"))}addEventListeners(){const e=this;this._elm.querySelector(".js-remove-from-search").addEventListener("click",()=>{this.remove(),this.checkForSingleInputGroup()}),this._elm.querySelector(".js-combine").addEventListener("click",function(t){t.stopPropagation(),e.toggleCombineDropDown()}),this._searchInput.addEventListener("keyup",()=>{Search.getSearchValue(this._searchInput.name).length?Search.updateSearchValue({name:this._searchInput.name,value:this.value}):Search.addSearchValue({name:this._searchInput.name,value:this.value}),Search.updateCombineDropDown()}),this._combineListElm.addEventListener("click",function(t){e.combine(t)})}}InputGroup.inputGroups=[];class ModalControls{static showModal(e){this.hideAllModals();let t=document.querySelector(`.${e}-search-modal`);document.querySelector(".modal-container").classList.remove("hide"),document.querySelectorAll(".modal-dialog-window").forEach(e=>{e!==t&&e.classList.add("hide")}),t.classList.contains("hide")&&t.classList.remove("hide")}static closeModal(){document.querySelector(".modal-container").classList.add("hide"),document.querySelector(".save-search-modal .validation-msg").innerText="",document.querySelector('.save-search-modal input[name="currentSearchName"]').value="",Array.from(document.querySelector(".update-search-modal .saved-searches").children).forEach(e=>{e.remove()}),Array.from(document.querySelector(".load-search-modal .saved-searches").children).forEach(e=>{e.remove()}),this.hideAllModals()}static hideAllModals(){document.querySelectorAll(".modal-dialog-window").forEach(e=>{e.classList.contains("hide")||e.classList.add("hide")})}static init(){document.querySelector(".modal-container").addEventListener("click",function(e){e.target.classList.contains("modal-container")&&ModalControls.closeModal()}),document.getElementById("open-save-modal").addEventListener("click",()=>{this.showModal("save")}),document.getElementById("save-current-search").addEventListener("click",function(){let e=this.previousElementSibling.previousElementSibling.value;StorageHelper.validateSaveCurrentSearch(e)?(StorageHelper.saveCurrentSearches(e),ModalControls.closeModal()):document.querySelector(".save-search-modal .validation-msg").innerText=`There is already a search saved as "${e}". Please try a different name.`}),document.getElementById("open-update-modal").addEventListener("click",()=>{this.showModal("update"),localStorage.length>0?(document.querySelector(".update-search-modal .saved-searches").classList.remove("hide"),document.querySelector(".update-search-modal .no-saved-searches").classList.add("hide"),document.querySelector(".update-search-modal .saved-searches").appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.updateSavedSearch,"Update Saved Search",!1))):(document.querySelector(".update-search-modal .saved-searches").classList.add("hide"),document.querySelector(".update-search-modal .no-saved-searches").classList.remove("hide"))}),document.getElementById("open-load-modal").addEventListener("click",function(e){ModalControls.showModal("load"),localStorage.length>0?(document.querySelector(".load-search-modal .saved-searches").classList.remove("hide"),document.querySelector(".load-search-modal .no-saved-searches").classList.add("hide"),document.querySelector(".load-search-modal .saved-searches").appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.loadSavedSearch,"Load Saved Search",!0))):(document.querySelector(".load-search-modal .saved-searches").classList.add("hide"),document.querySelector(".load-search-modal .no-saved-searches").classList.remove("hide"))}),document.getElementById("open-settings-modal").addEventListener("click",function(){ModalControls.showModal("settings");let e=Settings.get();for(let t in e)document.querySelectorAll(`img[data-setting="${t}"]`).forEach(n=>{n.getAttribute("data-value")!==e[t]?n.classList.contains("hide")&&n.classList.remove("hide"):n.classList.contains("hide")||n.classList.add("hide")})}),document.querySelectorAll(".js-settings-btn").forEach(e=>{let t={};e.addEventListener("click",()=>{e.nextElementSibling?(t[e.getAttribute("data-setting")]=e.getAttribute("data-value"),Settings.update(t),e.nextElementSibling.classList.remove("hide"),e.classList.add("hide")):e.previousElementSibling&&(t[e.getAttribute("data-setting")]=e.getAttribute("data-value"),Settings.update(t),e.previousElementSibling.classList.remove("hide"),e.classList.add("hide"))})}),document.querySelector(".js-delete-all-searches").addEventListener("click",()=>{ModalControls.showModal("delete"),document.querySelector(".delete-search-modal h5").innerText="Are you sure you want to delete all saved searches?",document.querySelector("#delete-saved-search").addEventListener("click",()=>{StorageHelper.deleteAllSavedSearches(),this.closeModal()})}),document.querySelectorAll(".cancel-modal").forEach(e=>{e.addEventListener("click",()=>{this.closeModal()})})}}class ResultList{constructor(e){this._elm=e,this._toggleSearchResultsBtn=this._elm.querySelector(".js-toggle-search-results"),this._toggleDescriptionsBtn=this._elm.querySelector(".js-toggle-descriptions"),this._removeBtn=this._elm.querySelector(".js-remove-from-list"),this.addEventListeners(),this.checkSettings()}toggleSearchResults(){"show"===this._toggleSearchResultsBtn.getAttribute("data-collapse")?this.hideSearchResults():this.showSearchResults()}showSearchResults(){this._toggleSearchResultsBtn.setAttribute("data-collapse","show"),this._toggleSearchResultsBtn.innerHTML='<img src="/icons/chevron-down.svg">',this._elm.querySelectorAll(".result-item").forEach(e=>{e.style.display="block"})}hideSearchResults(){this._toggleSearchResultsBtn.setAttribute("data-collapse","hide"),this._toggleSearchResultsBtn.innerHTML='<img src="/icons/chevron-up.svg">',this._elm.querySelectorAll(".result-item").forEach(e=>{e.style.display="none"})}toggleDescriptions(){"hide"===this._toggleDescriptionsBtn.getAttribute("data-descriptions")?this.showDescriptions():this.hideDescriptions()}showDescriptions(){this._toggleDescriptionsBtn.setAttribute("data-descriptions","show"),this._toggleDescriptionsBtn.innerHTML='<img src="/icons/toggle-right.svg">',this._elm.querySelectorAll(".description").forEach(function(e){e.style.display="block"})}hideDescriptions(){this._toggleDescriptionsBtn.setAttribute("data-descriptions","hide"),this._toggleDescriptionsBtn.innerHTML='<img src="/icons/toggle-left.svg">',this._elm.querySelectorAll(".description").forEach(function(e){e.style.display="none"})}remove(){this._elm.parentNode.removeChild(this._elm)}checkSettings(){let e=Settings.get();for(let t in e)"showDescriptions"===t?1===parseInt(e[t])?this.showDescriptions():this.hideDescriptions():"collapseResults"===t&&(1===parseInt(e[t])?this.showSearchResults():this.hideSearchResults())}addEventListeners(){this._toggleSearchResultsBtn.addEventListener("click",()=>this.toggleSearchResults()),this._toggleDescriptionsBtn.addEventListener("click",()=>this.toggleDescriptions()),this._removeBtn.addEventListener("click",()=>this.remove())}}class Search{static initSearchControls(){const e=document.querySelector(".result-lists");document.getElementById("add-input-group").addEventListener("click",()=>{this.addInputGroup()}),document.getElementById("reset").addEventListener("click",()=>{InputGroup.inputGroups.forEach(e=>e.remove()),Search.searchValues.length=0,this.addInputGroup()}),document.querySelectorAll(".toggle-list-orientation").forEach(t=>{t.addEventListener("click",function(){1===parseInt(this.getAttribute("data-value"))?(document.querySelector('input[name="orientation"]').value="column",e.classList.add("flex-row"),e.classList.remove("ml-auto"),e.classList.remove("mr-auto"),e.classList.remove("col-lg-8"),e.classList.remove("flex-column")):0===parseInt(this.getAttribute("data-value"))&&(document.querySelector('input[name="orientation"]').value="row",e.classList.add("flex-column"),e.classList.add("col-lg-8"),e.classList.add("ml-auto"),e.classList.add("mr-auto"),e.classList.remove("flex-row"))})})}static addInputGroup(e,t){let n=new InputGroup(e,t);e&&n.setName(e),t&&n.setValue(t),document.querySelector(".input-groups").appendChild(n.elm),InputGroup.inputGroups.length>1&&document.querySelector(".single-search")&&document.querySelector(".single-search").classList.remove("single-search")}static getSearchValue(e){return this.searchValues.filter(t=>t.name===e)}static addSearchValue(e){Search.searchValues.push(e),5===Search.searchValues.length&&(document.querySelector("#add-input-group").style.display="none")}static updateSearchValue(e){Search.searchValues.forEach(t=>{t.name===e.name&&(t.value=e.value)})}static removeSearchValue(e){Search.searchValues=Search.searchValues.filter(t=>t.name!==e),Search.searchValues.length<6&&"none"===document.querySelector("#add-input-group").style.display&&(document.querySelector("#add-input-group").style.display="inline"),Search.updateCombineDropDown()}static updateCombineDropDown(){InputGroup.inputGroups.forEach(e=>{e.updateCombineDropDown(Search.getCombineDropDown())})}static getCombineDropDown(){let e,t=document.createElement("ul");return t.classList.add("combine-list"),t.style.display="none",Search.searchValues.forEach(n=>{n.value&&((e=document.createElement("li")).classList.add("combine-item"),e.innerText=n.value,e.setAttribute("data-search-term",n.value),t.appendChild(e))}),t}}Search.searchValues=[];class Settings{static update(e){let t=Object.keys(e)[0],n=Object.values(e)[0],r=JSON.parse(localStorage.getItem("settings"));r[t]=n,localStorage.setItem("settings",JSON.stringify(r))}static init(){localStorage.getItem("settings")||localStorage.setItem("settings",JSON.stringify({showDescriptions:0,collapseResults:0,resultsDisplay:0}))}static get(){return JSON.parse(localStorage.getItem("settings"))}}class StorageHelper{static saveCurrentSearches(e){let t=Search.searchValues.filter(e=>""!==e.value);localStorage.setItem(e,JSON.stringify(t)),"/"===window.location.pathname&&(document.querySelector(".saved-search-list-main-wrapper").classList.contains("hide")&&document.querySelector(".saved-search-list-main-wrapper").classList.remove("hide"),document.querySelector(".saved-search-list-main ul")&&document.querySelector(".saved-search-list-main ul").remove(),document.querySelector(".saved-search-list-main").appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.loadSavedSearch,"Saved Searches",!1)))}static updateSavedSearch(e){document.querySelector(".update-search-modal").classList.add("hide"),document.querySelector(".update-search-validate-modal h5").innerText=`Update ${e} with current search?`,document.querySelector(".update-search-validate-modal").classList.remove("hide"),document.getElementById("update-saved-search").addEventListener("click",()=>{ModalControls.closeModal(),StorageHelper.saveCurrentSearches(e)}),"/"===window.location.pathname&&(document.querySelector(".saved-search-list-main ul").remove(),document.querySelector(".saved-search-list-main").appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.loadSavedSearch,"Saved Searches",!1)))}static validateSaveCurrentSearch(e){return null===localStorage.getItem(e)}static getAllSavedSearches(){return Object.keys(localStorage).filter(e=>"settings"!==e).map(e=>({name:e,values:localStorage.getItem(e)}))}static getAllSavedSearchesListElm(e,t,n){let r,a,o,i,s,l=this.getAllSavedSearches(),c=document.createElement("ul"),u=document.createElement("h5"),d=document.createElement("li");return u.innerText=t,u.classList.add("mb-0"),d.appendChild(u),d.classList+="list-group-item text-center",c.appendChild(d),l.forEach(t=>{(a=document.createElement("ul")).classList.add("list-group"),(i=document.createElement("img")).src="icons/plus.svg",i.classList.add("expand-saved-search"),(s=document.createElement("img")).src="icons/trash-2.svg",s.classList+="float-right open-delete-modal",s.setAttribute("data-search-name",t.name),(d=document.createElement("li")).classList.add("list-group-item"),d.classList.add("clearfix"),d.appendChild(i),r=document.createTextNode(t.name),d.appendChild(r),d.appendChild(s),a.classList.add("hide"),i.addEventListener("click",function(){this.nextElementSibling.nextElementSibling.classList.contains("hide")?this.nextElementSibling.nextElementSibling.classList.remove("hide"):this.nextElementSibling.nextElementSibling.classList.add("hide")}),s.addEventListener("click",function(){ModalControls.showModal("delete"),document.querySelector(".delete-search-modal h5").innerText=`Are you sure you want to delete ${t.name}?`,document.querySelector("#delete-saved-search").addEventListener("click",()=>{StorageHelper.deleteSavedSearch(t.name),ModalControls.closeModal(),this.closest("li").remove(),document.querySelector(".saved-search-list-main")&&("/"===window.location.pathname&&(document.querySelector(".saved-search-list-main ul").remove(),document.querySelector(".saved-search-list-main").appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.loadSavedSearch,"Saved Searches",!1))),0===StorageHelper.getAllSavedSearches().length&&document.querySelector(".saved-search-list-main-wrapper").classList.add("hide"))})}),JSON.parse(t.values).forEach(e=>{(o=document.createElement("li")).classList.add("list-group-item"),o.innerText=e.value,a.appendChild(o)}),d.addEventListener("click",function(r){r.target.classList.contains("expand-saved-search")||r.target.classList.contains("open-delete-modal")||(e(t.name),n&&ModalControls.closeModal())}),d.appendChild(a),c.appendChild(d)}),c}static loadSavedSearch(e){let t=JSON.parse(localStorage.getItem(e));InputGroup.inputGroups.forEach(e=>e.remove()),t.forEach(e=>{Search.addInputGroup(e.name,e.value)}),Search.updateCombineDropDown()}static deleteSavedSearch(e){localStorage.removeItem(e)}static getStoredSearchDropDown(){let e,t=document.createElement("ul");for(let n in localStorage)localStorage.hasOwnProperty(n)&&"settings"!=n&&((e=document.createElement("li")).setAttribute("data-search-id",n),e.classList.add("saved-search-item"),e.classList.add("js-load-search"),e.innerText=n,e.setAttribute("data-saved-search-id",n),t.appendChild(e));return t}static deleteAllSavedSearches(){for(let e in localStorage)localStorage.hasOwnProperty(e)&&"settings"!=e&&localStorage.removeItem(e)}}!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).dragula=e()}}(function(){return function e(t,n,r){function a(i,s){if(!n[i]){if(!t[i]){var l="function"==typeof require&&require;if(!s&&l)return l(i,!0);if(o)return o(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var u=n[i]={exports:{}};t[i][0].call(u.exports,function(e){var n=t[i][1][e];return a(n||e)},u,u.exports,e,t,n,r)}return n[i].exports}for(var o="function"==typeof require&&require,i=0;i<r.length;i++)a(r[i]);return a}({1:[function(e,t,n){"use strict";function r(e){var t=a[e];return t?t.lastIndex=0:a[e]=t=new RegExp(o+e+i,"g"),t}var a={},o="(?:^|\\s)",i="(?:\\s|$)";t.exports={add:function(e,t){var n=e.className;n.length?r(t).test(n)||(e.className+=" "+t):e.className=t},rm:function(e,t){e.className=e.className.replace(r(t)," ").trim()}}},{}],2:[function(e,t,n){(function(n){"use strict";function r(e,t,r,a){n.navigator.pointerEnabled?f[t](e,{mouseup:"pointerup",mousedown:"pointerdown",mousemove:"pointermove"}[r],a):n.navigator.msPointerEnabled?f[t](e,{mouseup:"MSPointerUp",mousedown:"MSPointerDown",mousemove:"MSPointerMove"}[r],a):(f[t](e,{mouseup:"touchend",mousedown:"touchstart",mousemove:"touchmove"}[r],a),f[t](e,r,a))}function a(e){if(void 0!==e.touches)return e.touches.length;if(void 0!==e.which&&0!==e.which)return e.which;if(void 0!==e.buttons)return e.buttons;var t=e.button;return void 0!==t?1&t?1:2&t?3:4&t?2:0:void 0}function o(e){var t=e.getBoundingClientRect();return{left:t.left+i("scrollLeft","pageXOffset"),top:t.top+i("scrollTop","pageYOffset")}}function i(e,t){return void 0!==n[t]?n[t]:E.clientHeight?E[e]:y.body[e]}function s(e,t,n){var r,a=e||{},o=a.className;return a.className+=" gu-hide",r=y.elementFromPoint(t,n),a.className=o,r}function l(){return!1}function c(){return!0}function u(e){return e.width||e.right-e.left}function d(e){return e.height||e.bottom-e.top}function h(e){return e.parentNode===y?null:e.parentNode}function m(e){return"INPUT"===e.tagName||"TEXTAREA"===e.tagName||"SELECT"===e.tagName||function e(t){return!!t&&("false"!==t.contentEditable&&("true"===t.contentEditable||e(h(t))))}(e)}function p(e){return e.nextElementSibling||function(){var t=e;do{t=t.nextSibling}while(t&&1!==t.nodeType);return t}()}function v(e,t){var n=function(e){return e.targetTouches&&e.targetTouches.length?e.targetTouches[0]:e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:e}(t),r={pageX:"clientX",pageY:"clientY"};return e in r&&!(e in n)&&r[e]in n&&(e=r[e]),n[e]}var g=e("contra/emitter"),f=e("crossvent"),S=e("./classes"),y=document,E=y.documentElement;t.exports=function(e,t){function n(e){return-1!==te.containers.indexOf(e)||ee.isContainer(e)}function i(e){var t=e?"remove":"add";r(E,t,"mousedown",C),r(E,t,"mouseup",x)}function b(e){r(E,e?"remove":"add","mousemove",q)}function L(e){var t=e?"remove":"add";f[t](E,"selectstart",w),f[t](E,"click",w)}function w(e){W&&e.preventDefault()}function C(e){if(J=e.clientX,F=e.clientY,1===a(e)&&!e.metaKey&&!e.ctrlKey){var t=e.target,n=I(t);n&&(W=n,b(),"mousedown"===e.type&&(m(t)?t.focus():e.preventDefault()))}}function q(e){if(W){if(0===a(e))return void x({});if(void 0===e.clientX||e.clientX!==J||void 0===e.clientY||e.clientY!==F){if(ee.ignoreInputTextSelection){var t=v("clientX",e),n=v("clientY",e);if(m(y.elementFromPoint(t,n)))return}var r=W;b(!0),L(),D(),_(r);var i=o(X);Y=v("pageX",e)-i.left,$=v("pageY",e)-i.top,S.add(z||X,"gu-transit"),H(),N(e)}}}function I(e){if(!(te.dragging&&j||n(e))){for(var t=e;h(e)&&!1===n(h(e));){if(ee.invalid(e,t))return;if(!(e=h(e)))return}var r=h(e);if(r&&!ee.invalid(e,t)&&ee.moves(e,r,t,p(e)))return{item:e,source:r}}}function _(e){(function(e,t){return"boolean"==typeof ee.copy?ee.copy:ee.copy(e,t)})(e.item,e.source)&&(z=e.item.cloneNode(!0),te.emit("cloned",z,e.item,"copy")),P=e.source,X=e.item,U=K=p(e.item),te.dragging=!0,te.emit("drag",X,P)}function D(){if(te.dragging){var e=z||X;M(e,h(e))}}function A(){W=!1,b(!0),L(!0)}function x(e){if(A(),te.dragging){var t=z||X,n=v("clientX",e),r=v("clientY",e),a=O(s(j,n,r),n,r);a&&(z&&ee.copySortSource||!z||a!==P)?M(t,a):ee.removeOnSpill?k():G()}}function M(e,t){var n=h(e);z&&ee.copySortSource&&t===P&&n.removeChild(X),B(t)?te.emit("cancel",e,P,P):te.emit("drop",e,t,P,K),T()}function k(){if(te.dragging){var e=z||X,t=h(e);t&&t.removeChild(e),te.emit(z?"cancel":"remove",e,t,P),T()}}function G(e){if(te.dragging){var t=arguments.length>0?e:ee.revertOnSpill,n=z||X,r=h(n),a=B(r);!1===a&&t&&(z?r&&r.removeChild(z):P.insertBefore(n,U)),a||t?te.emit("cancel",n,P,P):te.emit("drop",n,r,P,K),T()}}function T(){var e=z||X;A(),j&&(S.rm(ee.mirrorContainer,"gu-unselectable"),r(E,"remove","mousemove",N),h(j).removeChild(j),j=null),e&&S.rm(e,"gu-transit"),Q&&clearTimeout(Q),te.dragging=!1,Z&&te.emit("out",e,Z,P),te.emit("dragend",e),P=X=z=U=K=Q=Z=null}function B(e,t){var n;return n=void 0!==t?t:j?K:p(z||X),e===P&&n===U}function O(e,t,r){function a(){if(!1===n(o))return!1;var a=R(o,e),i=V(o,a,t,r);return!!B(o,i)||ee.accepts(X,o,P,i)}for(var o=e;o&&!a();)o=h(o);return o}function N(e){function t(e){te.emit(e,i,Z,P)}if(j){e.preventDefault();var n=v("clientX",e),r=v("clientY",e),a=n-Y,o=r-$;j.style.left=a+"px",j.style.top=o+"px";var i=z||X,l=s(j,n,r),c=O(l,n,r),u=null!==c&&c!==Z;(u||null===c)&&(Z&&t("out"),Z=c,u&&t("over"));var d=h(i);if(c===P&&z&&!ee.copySortSource)return void(d&&d.removeChild(i));var m,g=R(c,l);if(null!==g)m=V(c,g,n,r);else{if(!0!==ee.revertOnSpill||z)return void(z&&d&&d.removeChild(i));m=U,c=P}(null===m&&u||m!==i&&m!==p(i))&&(K=m,c.insertBefore(i,m),te.emit("shadow",i,c,P))}}function H(){if(!j){var e=X.getBoundingClientRect();(j=X.cloneNode(!0)).style.width=u(e)+"px",j.style.height=d(e)+"px",S.rm(j,"gu-transit"),S.add(j,"gu-mirror"),ee.mirrorContainer.appendChild(j),r(E,"add","mousemove",N),S.add(ee.mirrorContainer,"gu-unselectable"),te.emit("cloned",j,X,"mirror")}}function R(e,t){for(var n=t;n!==e&&h(n)!==e;)n=h(n);return n===E?null:n}function V(e,t,n,r){var a="horizontal"===ee.direction;return t!==e?function(){var e=t.getBoundingClientRect();return function(e){return e?p(t):t}(a?n>e.left+u(e)/2:r>e.top+d(e)/2)}():function(){var t,o,i,s=e.children.length;for(t=0;s>t;t++){if(i=(o=e.children[t]).getBoundingClientRect(),a&&i.left+i.width/2>n)return o;if(!a&&i.top+i.height/2>r)return o}return null}()}1===arguments.length&&!1===Array.isArray(e)&&(t=e,e=[]);var j,P,X,Y,$,J,F,U,K,z,Q,W,Z=null,ee=t||{};void 0===ee.moves&&(ee.moves=c),void 0===ee.accepts&&(ee.accepts=c),void 0===ee.invalid&&(ee.invalid=function(){return!1}),void 0===ee.containers&&(ee.containers=e||[]),void 0===ee.isContainer&&(ee.isContainer=l),void 0===ee.copy&&(ee.copy=!1),void 0===ee.copySortSource&&(ee.copySortSource=!1),void 0===ee.revertOnSpill&&(ee.revertOnSpill=!1),void 0===ee.removeOnSpill&&(ee.removeOnSpill=!1),void 0===ee.direction&&(ee.direction="vertical"),void 0===ee.ignoreInputTextSelection&&(ee.ignoreInputTextSelection=!0),void 0===ee.mirrorContainer&&(ee.mirrorContainer=y.body);var te=g({containers:ee.containers,start:function(e){var t=I(e);t&&_(t)},end:D,cancel:G,remove:k,destroy:function(){i(!0),x({})},canMove:function(e){return!!I(e)},dragging:!1});return!0===ee.removeOnSpill&&te.on("over",function(e){S.rm(e,"gu-hide")}).on("out",function(e){te.dragging&&S.add(e,"gu-hide")}),i(),te}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./classes":1,"contra/emitter":5,crossvent:6}],3:[function(e,t,n){t.exports=function(e,t){return Array.prototype.slice.call(e,t)}},{}],4:[function(e,t,n){"use strict";var r=e("ticky");t.exports=function(e,t,n){e&&r(function(){e.apply(n||null,t||[])})}},{ticky:9}],5:[function(e,t,n){"use strict";var r=e("atoa"),a=e("./debounce");t.exports=function(e,t){var n=t||{},o={};return void 0===e&&(e={}),e.on=function(t,n){return o[t]?o[t].push(n):o[t]=[n],e},e.once=function(t,n){return n._once=!0,e.on(t,n),e},e.off=function(t,n){var r=arguments.length;if(1===r)delete o[t];else if(0===r)o={};else{var a=o[t];if(!a)return e;a.splice(a.indexOf(n),1)}return e},e.emit=function(){var t=r(arguments);return e.emitterSnapshot(t.shift()).apply(this,t)},e.emitterSnapshot=function(t){var i=(o[t]||[]).slice(0);return function(){var o=r(arguments),s=this||e;if("error"===t&&!1!==n.throws&&!i.length)throw 1===o.length?o[0]:o;return i.forEach(function(r){n.async?a(r,o,s):r.apply(s,o),r._once&&e.off(t,r)}),e}},e}},{"./debounce":4,atoa:3}],6:[function(e,t,n){(function(n){"use strict";function r(e,t,r){return function(t){var a=t||n.event;a.target=a.target||a.srcElement,a.preventDefault=a.preventDefault||function(){a.returnValue=!1},a.stopPropagation=a.stopPropagation||function(){a.cancelBubble=!0},a.which=a.which||a.keyCode,r.call(e,a)}}function a(e,t,n){var r=function(e,t,n){var r,a;for(r=0;r<u.length;r++)if((a=u[r]).element===e&&a.type===t&&a.fn===n)return r}(e,t,n);if(r){var a=u[r].wrapper;return u.splice(r,1),a}}var o=e("custom-event"),i=e("./eventmap"),s=n.document,l=function(e,t,n,r){return e.addEventListener(t,n,r)},c=function(e,t,n,r){return e.removeEventListener(t,n,r)},u=[];n.addEventListener||(l=function(e,t,n){return e.attachEvent("on"+t,function(e,t,n){var o=a(e,t,n)||r(e,0,n);return u.push({wrapper:o,element:e,type:t,fn:n}),o}(e,t,n))},c=function(e,t,n){var r=a(e,t,n);return r?e.detachEvent("on"+t,r):void 0}),t.exports={add:l,remove:c,fabricate:function(e,t,n){var r=-1===i.indexOf(t)?new o(t,{detail:n}):function(){var e;return s.createEvent?(e=s.createEvent("Event")).initEvent(t,!0,!0):s.createEventObject&&(e=s.createEventObject()),e}();e.dispatchEvent?e.dispatchEvent(r):e.fireEvent("on"+t,r)}}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./eventmap":7,"custom-event":8}],7:[function(e,t,n){(function(e){"use strict";var n=[],r="",a=/^on/;for(r in e)a.test(r)&&n.push(r.slice(2));t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],8:[function(e,t,n){(function(e){var n=e.CustomEvent;t.exports=function(){try{var e=new n("cat",{detail:{foo:"bar"}});return"cat"===e.type&&"bar"===e.detail.foo}catch(e){}return!1}()?n:"function"==typeof document.createEvent?function(e,t){var n=document.createEvent("CustomEvent");return t?n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail):n.initCustomEvent(e,!1,!1,void 0),n}:function(e,t){var n=document.createEventObject();return n.type=e,t?(n.bubbles=Boolean(t.bubbles),n.cancelable=Boolean(t.cancelable),n.detail=t.detail):(n.bubbles=!1,n.cancelable=!1,n.detail=void 0),n}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],9:[function(e,t,n){var r;r="function"==typeof setImmediate?function(e){setImmediate(e)}:function(e){setTimeout(e,0)},t.exports=r},{}]},{},[2])(2)}),document.addEventListener("DOMContentLoaded",()=>{Search.initSearchControls(),ModalControls.init(),Settings.init(),document.querySelectorAll(".list-container").forEach(e=>{new ResultList(e)}),document.querySelectorAll(".input-group").forEach(e=>{new InputGroup(e.name,e.value,e)}),"/"===window.location.pathname&&StorageHelper.getAllSavedSearches().length>0&&(document.querySelector(".saved-search-list-main-wrapper").classList.remove("hide"),document.querySelector(".saved-search-list-main").appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.loadSavedSearch,"Saved Searches",!1))),document.addEventListener("click",()=>{InputGroup.inputGroups.forEach(e=>{e.hideCombineDropDown()})}),document.getElementById("search-form").addEventListener("submit",function(e){let t=document.querySelectorAll(".search");1===t.length&&""===t[0].value&&e.preventDefault()}),dragula([document.querySelector(".result-lists")],{moves:function(e,t,n){return n.classList.contains("js-move")}}),dragula([document.querySelector(".input-groups")],{moves:function(e,t,n){return n.classList.contains("js-move")}})});