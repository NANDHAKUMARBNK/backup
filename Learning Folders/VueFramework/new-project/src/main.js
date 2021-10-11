import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import dashboard from "./components/dashboard.vue";
import register from "./components/register.vue";
import Routes from "./routesNew";
Vue.use(VueRouter);
const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: register
    },
    {
      path: "/register",
      component: register
    },
    {
      path: "/dashboardscreen",
      component: dashboard
    }
  ]
});

new Vue({
  el: "#app",
  render: h => h(App),
  router: router
}).$mount("#app");
