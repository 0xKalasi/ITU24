import { createWebHistory, createRouter } from "vue-router";

import Search from "../views/Search.vue";
import Users from "../views/Users.vue";
import Homepage from "../views/Homepage.vue";
import NotFound from "../views/NotFound.vue";
import Profile from "../views/Profile.vue";
import EditProfile from "../views/EditProfile.vue";
import Recipes from "../views/Recipes.vue";
import CookMode from "../views/CookMode.vue";
import CookModeStep from "../views/CookModeStep.vue";
import Recipes from "../views/RecipesDemo.vue";
import PublicRecipe from "../views/PublicRecipe.vue";
import UserRecipes from "../views/Recipes.vue";
import UserChats from "../views/Chats.vue";
import Filters from "../views/Filters.vue";

const routes = [
  { path: "/", component: Homepage },
  { path: "/recipes", component: UserRecipes},
  { path: "/chats", component: UserChats},
  { path: "/filters", component: Filters},
  { path: "/recipe/public/:recipe_id", component: PublicRecipe},
  { path: "/search", component: Search },
  { path: "/users", component: Users },
  { path: "/profile", component: Profile },
  { path: "/profile/recipes", component: Recipes },
  { path: "/profile/edit", component: EditProfile },
  { path: "/cookmode/:recipe_id", component: CookMode },
  { path: "/cookmode/:recipe_id/:step_number", component: CookModeStep },
  { path: "/users/:username/recipes", component: Recipes },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
