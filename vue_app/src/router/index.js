import { createWebHistory, createRouter } from "vue-router";

import Search from "../views/Search.vue";
import Users from "../views/Users.vue";
import Homepage from "../views/Homepage.vue";
import NotFound from "../views/NotFound.vue";
import Profile from "../views/Profile.vue";
import Recipes from "../views/Recipes.vue";

const routes = [
  { path: "/", component: Homepage },
  { path: "/search", component: Search },
  { path: "/users", component: Users },
  { path: "/profile", component: Profile },
  { path: "/profile/recipes", component: Recipes },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
