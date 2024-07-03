(function(t){function e(e){for(var i,s,r=e[0],c=e[1],o=e[2],p=0,u=[];p<r.length;p++)s=r[p],Object.prototype.hasOwnProperty.call(l,s)&&l[s]&&u.push(l[s][0]),l[s]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(t[i]=c[i]);h&&h(e);while(u.length)u.shift()();return n.push.apply(n,o||[]),a()}function a(){for(var t,e=0;e<n.length;e++){for(var a=n[e],i=!0,r=1;r<a.length;r++){var c=a[r];0!==l[c]&&(i=!1)}i&&(n.splice(e--,1),t=s(s.s=a[0]))}return t}var i={},l={app:0},n=[];function s(e){if(i[e])return i[e].exports;var a=i[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,s),a.l=!0,a.exports}s.m=t,s.c=i,s.d=function(t,e,a){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(s.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)s.d(a,i,function(e){return t[e]}.bind(null,i));return a},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/html/calibrate/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],c=r.push.bind(r);r.push=e,r=r.slice();for(var o=0;o<r.length;o++)e(r[o]);var h=c;n.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){a("bbea"),t.exports=a("56d7")},"034f":function(t,e,a){"use strict";var i=a("85ec"),l=a.n(i);l.a},"1a46":function(t,e,a){"use strict";var i=a("1d3f"),l=a.n(i);l.a},"1d3f":function(t,e,a){},"56d7":function(t,e,a){"use strict";a.r(e);a("e260"),a("e6cf"),a("cca6"),a("a79d");var i=a("2b0e"),l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("div",{staticClass:"container"},[a("h1",{staticClass:"title"},[t._v("相机畸变校正参数计算器")]),a("div",[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("常用参数选择")]),a("a-select",{staticStyle:{width:"100%"},on:{change:t.cameraSelected}},t._l(t.cameras,(function(e,i){return a("a-select-opt-group",{key:"g"+i},[a("span",{attrs:{slot:"label"},slot:"label"},[t._v(t._s(e.groupName))]),t._l(e.cameras,(function(e,l){return a("a-select-option",{key:"g"+i+"i"+l,attrs:{value:i+"-"+l}},[t._v(" "+t._s(e.name)+" ")])}))],2)})),1)],1),a("div",{staticClass:"separate"}),a("div",{staticClass:"camera-parameter"},[a("h1",{staticStyle:{"font-size":"1.4rem"}},[t._v("相机参数")]),a("div",{staticClass:"sensor"},[a("h1",{staticStyle:{"font-size":"1rem"}},[t._v("传感器尺寸(mm)")]),a("a-row",[a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("宽")])]),a("a-col",{attrs:{span:8}},[a("a-input-number",{staticStyle:{width:"100%"},model:{value:t.camera.sensor.width,callback:function(e){t.$set(t.camera.sensor,"width",e)},expression:"camera.sensor.width"}})],1),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("高")])]),a("a-col",{attrs:{span:8}},[a("a-input-number",{staticStyle:{width:"100%"},model:{value:t.camera.sensor.height,callback:function(e){t.$set(t.camera.sensor,"height",e)},expression:"camera.sensor.height"}})],1)],1)],1),a("div",{staticClass:"resolution"},[a("h1",{staticStyle:{"font-size":"1rem"}},[t._v("全尺寸分辨率")]),a("a-row",[a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("宽")])]),a("a-col",{attrs:{span:8}},[a("a-input-number",{staticStyle:{width:"100%"},model:{value:t.camera.resolution.width,callback:function(e){t.$set(t.camera.resolution,"width",e)},expression:"camera.resolution.width"}})],1),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("高")])]),a("a-col",{attrs:{span:8}},[a("a-input-number",{staticStyle:{width:"100%"},model:{value:t.camera.resolution.height,callback:function(e){t.$set(t.camera.resolution,"height",e)},expression:"camera.resolution.height"}})],1)],1)],1),a("div",{staticClass:"pix-size"},[a("a-row",[a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:12}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("像元大小(μm)")])]),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"start"},attrs:{span:12}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v(t._s(t.pixelSize))])])],1)],1),a("div",{staticClass:"use-resolution"},[a("h1",{staticStyle:{"font-size":"1rem"}},[t._v("使用分辨率")]),a("a-row",[a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("照片比例")])]),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"start"},attrs:{span:20}},[a("a-radio-group",{attrs:{"button-style":"solid"},on:{change:t.aspectRatioChange},model:{value:t.aspectRatioSelectedIndex,callback:function(e){t.aspectRatioSelectedIndex=e},expression:"aspectRatioSelectedIndex"}},[t._l(t.aspectRatios,(function(e,i){return a("a-radio-button",{key:i,attrs:{value:i}},[t._v(" "+t._s(e.name)+" ")])})),a("a-radio-button",{attrs:{value:-1e3}},[t._v(" 自定义 ")]),-1e3===t.aspectRatioSelectedIndex?a("a-input",{staticStyle:{width:"76px",height:"36px","margin-left":"10px"},model:{value:t.userInputAspectRatio,callback:function(e){t.userInputAspectRatio=e},expression:"userInputAspectRatio"}}):t._e()],2)],1)],1),a("a-row",[a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("宽")])]),a("a-col",{attrs:{span:8}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v(" "+t._s(t.useResolutionWidthHeight[0]))])]),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("高")])]),a("a-col",{attrs:{span:8}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v(" "+t._s(t.useResolutionWidthHeight[1]))])])],1)],1)]),a("div",{staticClass:"separate"}),a("div",{staticClass:"calibrate-parameter"},[a("div",[a("h1",{staticStyle:{"font-size":"1.4rem"}},[t._v("校正参数")]),a("div",{staticClass:"open"},[a("a-button",{attrs:{type:"primary"},on:{click:t.showDJICalibrateInputModal}},[t._v(" 大疆畸变参数自动解析填入 ")]),a("a-modal",{attrs:{title:"大疆畸变参数自动解析填入",cancelText:"取消",okText:"确定"},on:{ok:t.djiCalibrateInputModalOK},model:{value:t.djiCalibrateInputModalVisible,callback:function(e){t.djiCalibrateInputModalVisible=e},expression:"djiCalibrateInputModalVisible"}},[a("p",[t._v("任意一张照片右键以记事本方式打开，搜索「DewarpData」")]),a("p",[t._v("复制后面的值填入，复制引号中的内容，类似这样的")]),a("p",{staticStyle:{"word-break":"break-all"}},[t._v(" 2020-05-13;3714.07,3707.07,-8.28,-17.52,-0.279234,0.125598,0.00118779,-0.000255019,-0.0410782 ")]),a("a-input",{model:{value:t.djiCalibrateValue,callback:function(e){t.djiCalibrateValue=e},expression:"djiCalibrateValue"}})],1)],1)]),a("div",{staticClass:"focal-length-in-pix"},[a("h1",{staticStyle:{"font-size":"1rem"}},[t._v("焦距")]),a("a-row",[a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("fx(pixel)")])]),a("a-col",{attrs:{span:8}},[a("a-input-number",{staticStyle:{width:"100%"},model:{value:t.calibrate.focal.focalLenInPix_X,callback:function(e){t.$set(t.calibrate.focal,"focalLenInPix_X",e)},expression:"calibrate.focal.focalLenInPix_X"}})],1),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("fy(pixel)")])]),a("a-col",{attrs:{span:8}},[a("a-input-number",{staticStyle:{width:"100%"},model:{value:t.calibrate.focal.focalLenInPix_Y,callback:function(e){t.$set(t.calibrate.focal,"focalLenInPix_Y",e)},expression:"calibrate.focal.focalLenInPix_Y"}})],1)],1),a("a-row",[a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("焦距(pixel)")])]),a("a-col",{attrs:{span:8}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v(t._s(t.focalLenInPix))])]),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("焦距（mm）")])]),a("a-col",{attrs:{span:8}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v(t._s(t.focalLenInMillimeter))])])],1)],1),a("div",{staticClass:"image-main-point-in-pix"},[a("h1",{staticStyle:{"font-size":"1rem"}},[t._v("像主点坐标")]),a("a-row",[a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("cx(中心)")])]),a("a-col",{attrs:{span:8}},[a("a-input-number",{model:{value:t.calibrate.mainPoint.centerCX,callback:function(e){t.$set(t.calibrate.mainPoint,"centerCX",e)},expression:"calibrate.mainPoint.centerCX"}})],1),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("cy(中心)")])]),a("a-col",{attrs:{span:8}},[a("a-input-number",{model:{value:t.calibrate.mainPoint.centerCY,callback:function(e){t.$set(t.calibrate.mainPoint,"centerCY",e)},expression:"calibrate.mainPoint.centerCY"}})],1)],1),a("a-row",[a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("cx(左上角)")])]),a("a-col",{attrs:{span:8}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v(t._s(t.leftTopCX))])]),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:4}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("cy(左上角)")])]),a("a-col",{attrs:{span:8}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v(t._s(t.leftTopCY))])])],1)],1),a("div",{staticClass:"radial-direction-calibrate"},[a("h1",{staticStyle:{"font-size":"1rem"}},[t._v("径向畸变校正参数")]),a("a-row",[a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:2}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("k1")])]),a("a-col",{attrs:{span:6}},[a("a-input",{model:{value:t.calibrate.radialDirection.k1,callback:function(e){t.$set(t.calibrate.radialDirection,"k1",e)},expression:"calibrate.radialDirection.k1"}})],1),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:2}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("k2")])]),a("a-col",{attrs:{span:6}},[a("a-input",{model:{value:t.calibrate.radialDirection.k2,callback:function(e){t.$set(t.calibrate.radialDirection,"k2",e)},expression:"calibrate.radialDirection.k2"}})],1),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:2}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("k3")])]),a("a-col",{attrs:{span:6}},[a("a-input",{model:{value:t.calibrate.radialDirection.k3,callback:function(e){t.$set(t.calibrate.radialDirection,"k3",e)},expression:"calibrate.radialDirection.k3"}})],1)],1)],1),a("div",{staticClass:"tangential-direction-calibrate"},[a("h1",{staticStyle:{"font-size":"1rem"}},[t._v("切向畸变校正参数")]),a("a-row",[a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:6}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("p1")])]),a("a-col",{attrs:{span:6}},[a("a-input",{model:{value:t.calibrate.tangentialDirection.p1,callback:function(e){t.$set(t.calibrate.tangentialDirection,"p1",e)},expression:"calibrate.tangentialDirection.p1"}})],1),a("a-col",{staticClass:"label-after",staticStyle:{"text-align":"end"},attrs:{span:6}},[a("label",{staticStyle:{height:"36px","line-height":"36px"}},[t._v("p2")])]),a("a-col",{attrs:{span:6}},[a("a-input",{model:{value:t.calibrate.tangentialDirection.p2,callback:function(e){t.$set(t.calibrate.tangentialDirection,"p2",e)},expression:"calibrate.tangentialDirection.p2"}})],1)],1)],1)]),a("div",{staticClass:"separate"}),a("a-button",{staticStyle:{display:"none"},attrs:{type:"primary"},on:{click:t.ok}},[t._v(" 确定 ")])],1)])},n=[],s=(a("c975"),a("a9e3"),a("ac1f"),a("5319"),a("1276"),a("4bbf"),a("59a5")),r=(a("02cf"),a("9839")),c=(a("a106"),a("09d9")),o=(a("a71a"),a("b558")),h=(a("1815"),a("e32c")),p=(a("50ac"),a("9a63")),u=(a("e1f5"),a("5efb")),d=(a("04f3"),a("ed3b"));i["a"].use(d["a"]);var b={name:"App",data:function(){return{camera:{sensor:{width:0,height:0},resolution:{width:0,height:0}},calibrate:{focal:{focalLenInPix_X:0,focalLenInPix_Y:0},mainPoint:{centerCX:0,centerCY:0},radialDirection:{k1:0,k2:0,k3:0},tangentialDirection:{p1:0,p2:0}},aspectRatioSelectedIndex:0,userInputAspectRatio:"",djiCalibrateInputModalVisible:!1,djiCalibrateValue:"",cameras:[{groupName:"大疆",cameras:[{sensor:{width:13.2,height:8.8},resolution:{width:5472,height:3648},name:"大疆精灵4RTK（FC6310R）"},{sensor:{width:7.4,height:5.6},resolution:{width:5184,height:3888},name:"大疆禅思ZenmuseH20主相机（变焦相机）"}]},{groupName:"赛尔",cameras:[{sensor:{width:23.5,height:15.6},resolution:{width:6e3,height:4e3},name:"赛尔102S(定焦)"},{sensor:{width:35.9,height:24},resolution:{width:7952,height:5304},name:"赛尔202S下视"},{sensor:{width:35.7,height:23.8},resolution:{width:9504,height:6336},name:"赛尔6100(40/56mm定焦)"}]}],aspectRatios:[{aspectRatio:1.3333333333333333,name:"4:3"},{aspectRatio:1.5,name:"3:2"},{aspectRatio:1,name:"1:1"},{aspectRatio:1.777777777777778,name:"16:9"}]}},components:{AButton:u["a"],ARow:p["a"],ACol:h["a"],AInput:o["a"],AInputNumber:c["a"],ASelect:r["a"],ASelectOption:r["a"].Option,ASelectOptGroup:r["a"].OptGroup,ARadioGroup:s["a"].Group,ARadioButton:s["a"].Button,AModal:d["a"]},computed:{focalLenInPix:function(){return(this.calibrate.focal.focalLenInPix_X+this.calibrate.focal.focalLenInPix_Y)/2},focalLenInMillimeter:function(){return this.pixelSize*this.focalLenInPix/1e3},pixelSize:function(){var t=this.camera.sensor.width/this.camera.resolution.width,e=this.camera.sensor.height/this.camera.resolution.height;return 1e3*(t<e?t:e)},leftTopCX:function(){var t=this.useResolutionWidthHeight[0];return t/2+this.calibrate.mainPoint.centerCX},leftTopCY:function(){var t=this.useResolutionWidthHeight[1];return t/2+this.calibrate.mainPoint.centerCY},userInputAspectRatioValue:function(){var t=0,e=this.userInputAspectRatio;if(e.indexOf(":")>0){var a=e.split(":");t=a[0]/a[1]}else if(e.indexOf("：")>0){var i=e.split("：");t=i[0]/i[1]}return(isNaN(t)||null===t||void 0===t)&&(t=0),t},useResolutionWidthHeight:function(){var t=this.camera.resolution.width/this.camera.resolution.height;if(isNaN(t)||null===t||void 0===t||0===t)return[0,0];var e=0;return e=-1e3===this.aspectRatioSelectedIndex?this.userInputAspectRatioValue:this.aspectRatios[this.aspectRatioSelectedIndex].aspectRatio,isNaN(e)||null===e||void 0===e||0===e?[0,0]:e>=t?[this.camera.resolution.width,this.camera.resolution.width/e]:[this.camera.resolution.height*e,this.camera.resolution.height]}},methods:{cameraSelected:function(t){var e=t.split("-"),a=this.cameras[e[0]].cameras[e[1]];this.camera.sensor.width=a.sensor.width,this.camera.sensor.height=a.sensor.height,this.camera.resolution.width=a.resolution.width,this.camera.resolution.height=a.resolution.height},aspectRatioChange:function(t){this.aspectRatioSelectedIndex=t.target.value},showDJICalibrateInputModal:function(){this.djiCalibrateInputModalVisible=!0},djiCalibrateInputModalOK:function(){var t=this.djiCalibrateValue;t=t.replace(/"/g,"");var e=t.split(";"),a=e[1],i=a.split(","),l=i[0],n=i[1],s=i[2],r=i[3],c=i[4],o=i[5],h=i[6],p=i[7],u=i[8];this.calibrate.focal.focalLenInPix_X=Number(l),this.calibrate.focal.focalLenInPix_Y=Number(n),this.calibrate.mainPoint.centerCX=Number(s),this.calibrate.mainPoint.centerCY=Number(r),this.calibrate.radialDirection.k1=Number(c),this.calibrate.radialDirection.k2=Number(o),this.calibrate.radialDirection.k3=Number(u),this.calibrate.tangentialDirection.p1=Number(h),this.calibrate.tangentialDirection.p2=Number(p),this.djiCalibrateInputModalVisible=!1},ok:function(){console.log("fly height",this.flyingHeight),console.log("camera",this.camera),console.log("aspectRatio",this.aspectRatio)}}},f=b,g=(a("034f"),a("1a46"),a("2877")),x=Object(g["a"])(f,l,n,!1,null,"1a1a8f11",null),m=x.exports;i["a"].config.productionTip=!1,new i["a"]({render:function(t){return t(m)}}).$mount("#app")},"85ec":function(t,e,a){},b75f:function(t,e,a){"use strict";a.r(e);var i=a("a877"),l=a.n(i);a.d(e,"DownOutline",(function(){return l.a}));var n=a("1de7"),s=a.n(n);a.d(e,"UpOutline",(function(){return s.a}))}});