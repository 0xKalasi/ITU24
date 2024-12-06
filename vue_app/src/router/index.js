import { createWebHistory, createRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";

import Users from "../views/Users.vue";
import Homepage from "../views/Homepage.vue";
import NotFound from "../views/NotFound.vue";
import Profile from "../views/Profile.vue";
import ForeignUser from "../views/ForeignUser.vue";
import EditProfile from "../views/EditProfile.vue";
import CookMode from "../views/CookMode.vue";
import CookModeStep from "../views/CookModeStep.vue";
import PublicRecipe from "../views/PublicRecipe.vue";
import Friends from "../views/Friends.vue";
import Chat from "../views/Chat.vue";
import Requests from "../views/Requests.vue";
import Blocked from "../views/Blocked.vue";
import Filters from "../views/Filters.vue";
import AddNewRecipe from "../views/AddNewRecipe.vue";
import Recipes from "../views/MyRecipes.vue";
import CreateFilter from "../views/CreateFilter.vue"
import Share from "../views/Share.vue";

const routes = [
  { path: "/", component: Homepage },
  { path: "/recipes", component: Recipes},
  { path: "/chats", component: Friends},
  { path: "/requests", component: Requests },
  { path: "/blocked", component: Blocked},
  { path: "/chats/:user_id", component: Chat }, // chat with currently logged in and "user_id" user
  { path: "/filters", component: Filters},
  { path: "/filters/create", component: CreateFilter },
  { path: "/recipe/public/:recipe_id", component: PublicRecipe},
  { path: "/users", component: Users},
  { path: "/profile", component: Profile },
  { path: "/profile/:user_id", component: ForeignUser },
  { path: "/profile/edit", component: EditProfile },
  { path: "/cookmode/:recipe_id", component: CookMode },
  { path: "/cookmode/:recipe_id/:step_number", component: CookModeStep },
  { path: "/addnewrecipe", component: AddNewRecipe },
  { path: "/share/:recipe_id", component: Share },

  { path: "/:pathMatch(.*)*", component: NotFound },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

///* NAVIGATION GUARDS */
//router.beforeEach((to, from) => {
//  const user = useUserStore();
//
//  /* if user is not signed in, go to /users to choose user */
//  /* to.path !== '/users' is there to avoid infinite redirect */
//  if(user.id == 0 && to.path !== '/users')
//    return '/users'
//}) 

export default router;
