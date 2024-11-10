import { createWebHistory, createRouter } from "vue-router";

import Users from "../views/Users.vue";
import Homepage from "../views/Homepage.vue";
import NotFound from "../views/NotFound.vue";
import Profile from "../views/Profile.vue";
import EditProfile from "../views/EditProfile.vue";
import CookMode from "../views/CookMode.vue";
import CookModeStep from "../views/CookModeStep.vue";
import PublicRecipe from "../views/PublicRecipe.vue";
import Friends from "../views/Friends.vue";
import Chat from "../views/Chat.vue";
import Filters from "../views/Filters.vue";
import AddNewRecipe from "../views/AddNewRecipe.vue";
import Recipes from "../views/MyRecipes.vue";

const routes = [
  { path: "/", component: Homepage },
  { path: "/recipes", component: Recipes},
  { path: "/chats", component: Friends},
  { path: "/chats/:user_id", component: Chat }, // chat with myself and "user_id" user
  { path: "/filters", component: Filters},
  { path: "/recipe/public/:recipe_id", component: PublicRecipe},
  { path: "/users", component: Users },
  { path: "/profile", component: Profile },
  { path: "/profile/edit", component: EditProfile },
  { path: "/cookmode/:recipe_id", component: CookMode },
  { path: "/cookmode/:recipe_id/:step_number", component: CookModeStep },
  { path: "/addnewrecipe", component: AddNewRecipe },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
