import { createWebHistory, createRouter } from "vue-router";
import { profilePreviewStore } from "../stores/userStore";
import { useUserStore } from "../stores/userStore";

import Users from "../views/Users.vue";
import Homepage from "../views/Homepage.vue";
import NotFound from "../views/NotFound.vue";
import Profile from "../views/Profile.vue";
import ForeignUser from "../views/ForeignUser.vue";
import CookMode from "../views/CookMode.vue";
import CookModeStep from "../views/CookModeStep.vue";
import PublicRecipe from "../views/PublicRecipe.vue";
import Friends from "../views/Friends.vue";
import Chat from "../views/Chat.vue";
import Filters from "../views/Filters.vue";
import Recipes from "../views/MyRecipes.vue";
import CreateFilter from "../views/CreateFilter.vue"
import Share from "../views/Share.vue";
import ProfilePreview from "../views/ProfilePreview.vue";
import Groupchat from "../views/Groupchat.vue";
import EditGroupchat from "../views/EditGroupchat.vue";
import AddGroupchatmember from "../views/AddGroupchatmember.vue";
import RecipeView from "../views/RecipeFormView.vue";

const routes = [
  { path: "/", component: Homepage, meta: { public: true } },
  { path: "/recipes", component: Recipes},
  { path: "/chats", component: Friends},
  { path: "/chats/:user_id", component: Chat }, // Chat with currently logged in and "user_id" user
  { path: "/filters", component: Filters},
  { path: "/filters/create", component: CreateFilter },
  { path: "/recipe/public/:recipe_id", component: PublicRecipe, meta: { public: true }  },
  { path: "/edit-recipe/:recipe_id", component: RecipeView },   //, props:{editMode:true}
  { path: "/users", component: Users, meta: { public: true } },
  { path: "/profile", component: Profile,
    // The changes from editing need to persist after preview, and only the preview, is closed
    beforeEnter: (to, from) => {
      const previewData = profilePreviewStore();
      if (from.name == "PREVIEW") {
        previewData.editMode = true;
      } else {
        previewData.editMode = false;
      }
    }
  },
  { path: "/profile/:user_id", component: ForeignUser },
  { path: "/cookmode/:recipe_id", component: CookMode },
  { path: "/cookmode/:recipe_id/steps", component: CookModeStep },
  { path: "/addnewrecipe", component: RecipeView},    //, props:{editMode:false}
  { path: "/share/:recipe_id", component: Share },
  { path: "/profile/preview", component: ProfilePreview,
    name: "PREVIEW",
  },
  { path: "/groupchats/:groupchat_id", component: Groupchat },
  { path: "/groupchats/edit/:groupchat_id", component: EditGroupchat},
  { path: "/groupchats/add/:groupchat_id", component: AddGroupchatmember },

  { path: "/:pathMatch(.*)*", component: NotFound },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

// NAVIGATION GUARDS 
router.beforeEach(async (to, from) => {
  const user = useUserStore();
  if(user.id == null){
    await user.tryLoginFromLocSt();
  }

  //console.log(user.id);

  // if user is not signed he can only go to public routes
  // to.path !== '/users' is there to avoid infinite redirect 
  if(!user.id && !to.meta.public && to.path !== '/users'){
    return '/users'
  }
}) 

export default router;
