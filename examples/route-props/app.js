import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from './HelloWorld.vue'

Vue.use(VueRouter)

function dynamicPropsFn(route) {
  const now = new Date()
  return {
    name: now.getFullYear() + parseInt(route.params.years) + '!',
  }
}

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: HelloWorld }, // No props, no nothing
    { path: '/hello/:name', component: HelloWorld, props: true }, // Pass route.params to props
    { path: '/static', component: HelloWorld, props: { name: 'world' } }, // static values
    { path: '/dynamic/:years', component: HelloWorld, props: dynamicPropsFn }, // custom logic for mapping between route and props
    { path: '/attrs', component: HelloWorld, props: { name: 'attrs' } },
  ],
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Route props</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/hello/you">/hello/you</router-link></li>
        <li><router-link to="/static">/static</router-link></li>
        <li><router-link to="/dynamic/1">/dynamic/1</router-link></li>
        <li><router-link to="/attrs">/attrs</router-link></li>
      </ul>
      <router-view class="view" foo="123"></router-view>
    </div>
  `,
}).$mount('#app')
