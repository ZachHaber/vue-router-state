(window.webpackJsonp=window.webpackJsonp||[]).push([[16,27],{278:function(s){s.exports=JSON.parse('{"platinum":[],"gold":[],"silver":[{"href":"https://www.vuemastery.com/","alt":"VueMastery","imgSrcLight":"https://posva-sponsors.pages.dev/logos/vuemastery-light.svg","imgSrcDark":"https://posva-sponsors.pages.dev/logos/vuemastery-dark.png"},{"href":"https://www.prefect.io/","imgSrcLight":"https://posva-sponsors.pages.dev/logos/prefectlogo-light.svg","imgSrcDark":"https://posva-sponsors.pages.dev/logos/prefectlogo-dark.svg","alt":"Prefect"}],"bronze":[{"alt":"Stanislas Ormières","href":"https://stormier.ninja","imgSrcDark":"https://avatars.githubusercontent.com/u/2486424?u=7b0c73ae5d090ce53bf59473094e9606fe082c59&v=4","imgSrcLight":"https://avatars.githubusercontent.com/u/2486424?u=7b0c73ae5d090ce53bf59473094e9606fe082c59&v=4"},{"alt":"Antony Konstantinidis","href":"https://www.vuejs.de","imgSrcDark":"https://avatars.githubusercontent.com/u/4183726?u=6b50a8ea16de29d2982f43c5640b1db9299ebcd1&v=4","imgSrcLight":"https://avatars.githubusercontent.com/u/4183726?u=6b50a8ea16de29d2982f43c5640b1db9299ebcd1&v=4"},{"href":"https://storyblok.com","imgSrcLight":"https://posva-sponsors.pages.dev/logos/storyblok.png","imgSrcDark":"https://posva-sponsors.pages.dev/logos/storyblok.png","alt":"Storyblok"},{"href":"https://nuxtjs.org","imgSrcLight":"https://posva-sponsors.pages.dev/logos/nuxt-light.svg","imgSrcDark":"https://posva-sponsors.pages.dev/logos/nuxt-dark.svg","alt":"Nuxt Labs"}]}')},291:function(s,t,e){},296:function(s,t,e){"use strict";e.r(t);var o=e(278),r={name:"HomeSponsorsGroup",props:{name:{type:String,required:!0},size:{type:[Number,String],default:140}},computed:{list(){return o[this.name.toLowerCase()]}}},a=e(17),n=Object(a.a)(r,(function(){var s=this,t=s._self._c;return s.list&&s.list.length?t("div",[t("h3",[s._v(s._s(s.name)+" Sponsors")]),s._v(" "),s._l(s.list,(function(e){return t("a",{key:e.href,style:{width:s.size+"px"},attrs:{href:e.href,target:"_blank",rel:"sponsored noopener"}},[t("img",{style:{width:s.size+"px"},attrs:{src:e.imgSrcLight}})])})),s._v(" "),t("br"),s._v(" "),t("br")],2):s._e()}),[],!1,null,null,null);t.default=n.exports},314:function(s,t,e){"use strict";e(291)},449:function(s,t,e){"use strict";e.r(t);var o={name:"HomeSponsors",components:{HomeSponsorsGroup:e(296).default}},r=(e(314),e(17)),a=Object(r.a)(o,(function(){var s=this,t=s._self._c;return t("div",{attrs:{id:"sponsors"}},[t("div",{staticClass:"inner"},[t("HomeSponsorsGroup",{attrs:{name:"Platinum",size:"160"}}),s._v(" "),t("HomeSponsorsGroup",{attrs:{name:"Gold",size:"140"}}),s._v(" "),t("HomeSponsorsGroup",{attrs:{name:"Silver",size:"120"}}),s._v(" "),t("a",{staticClass:"become-sponsor button white",attrs:{href:"https://github.com/sponsors/posva"}},[s._v("Become a Sponsor!")])],1)])}),[],!1,null,null,null);t.default=a.exports}}]);