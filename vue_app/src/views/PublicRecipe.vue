<!-- Tomáš Bordák, xborda01 -->
 
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { readPublicRecipe, saveRecipe, getRecipeImage } from '../../utils/api';
import { useUserStore } from '../stores/userStore'
import { deleteRecipe } from '../../utils/add_recipe_api'
import { likeRecipe, unLikeRecipe, getRecipeLikeCount } from '../../utils/likes_api';

const router = useRouter();
const recipeId = router.currentRoute.value.params.recipe_id;

const user = useUserStore();

let recipe = '';
const isLoading = ref(true); 

readPublicRecipe(recipeId).then(async (result) => {
    recipe = result;
    isLoading.value = false;
    console.log(recipe);
})

const showAlert = ref(false);
const alertKey = ref(0);
const alertType = ref("");
const alertText = ref("");

function showAlertMessage(type, text) {
    alertType.value = type;
    alertText.value = text;
    showAlert.value = true;
    alertKey.value++;
    }

const path = await getRecipeImage(1);

const actionButtons = ref([
    {
        label: '',
        icon: 'pi pi-user',
        command: () => {
            router.push(`/profile/${recipe.creator}`);
        },
    },
    {
        label: 'Save',
        icon: 'pi pi-bookmark',
        command: () => {
            saveRecipe(null, user.id, recipe.id)
            .then(async (result) => {
                if (result) {
                    alertType.value = "success";
                    alertText.value = "Uloženo";
                } else {
                    alertType.value = "error";
                    alertText.value = "Nepodařilo se uložiť";
                }
                showAlert.value = true;
                alertKey.value++;
            })
        }
    },
    {
        label: 'Send',
        icon: 'pi pi-send',
        command: () => {
            router.push(`/share/${recipe.id}`);
        }
    },
])

var delete_recipe = false;
async function deleteRecipeLocal(){
    if (!delete_recipe){
        showAlertMessage("warn","Naozaj chcete smazat recept?")
        delete_recipe = true;
    } else {
        await deleteRecipe(recipe);
        router.replace(`/recipes`)
    }
}
</script>

<template>
    <Alert v-if="showAlert" :type="alertType" :text="alertText" :key="alertKey"></Alert>

    <LoadingScreen v-if="isLoading"/>
    
    <div v-else>
        <div style="position: relative; display: flex; align-items: center; min-width: 320px">
            <Button @click="router.back" icon="pi pi-chevron-left" style="height: 35px; width: 35px; background-color: transparent; color: white; border: 0px;"/>
            <h2 style="max-width: 240px;">{{ recipe.name }}</h2>
            <SpeedDial v-if="user.id" :model="actionButtons" direction="down" style="position: absolute; top: 50%; right: 0; transform: translate(0, -8%);">
            </SpeedDial>
        </div> 

        <div style="display: inline">
            <Tag style="margin-right: 4px;" v-for="category in recipe.RecipeCategories" >{{ category.category.name }}</Tag>
        </div>
    
        <div style="margin: 8px 0px;">
            <Tag severity="warn" icon="pi pi-clock" style="margin-right: 4px">{{ recipe.time_to_cook / 60 }} minut</Tag>
            <Tag severity="warn"> {{ recipe.portions }} 
                <span v-if="recipe.portions < 5">porce</span>
                <span v-else>porcí</span> 
            </Tag> 
        </div>


        <h3>Alergeny</h3>
        <Tag severity="danger" style="margin-right: 4px" v-for="(alergen, index) in recipe.RecipeAlergens" :key="alergen.alergen.id">
            {{ alergen.alergen.name }} ({{ alergen.alergen.id }})
        </Tag>
    

        
        <h3>Nutné náčiní</h3>
        <Tag severity="info" style="margin-right: 4px;" v-for="utencil in recipe.Utencils">{{ utencil.name }}</Tag>
       

        <h3>Ingredience</h3>
        <ul>
            <li v-for="ingredient in recipe.Ingredients">
                {{ ingredient.name }} {{ ingredient.quantity }} {{ ingredient.unit }}
                <Tag v-if="ingredient.notes" style="padding: 0.5px 4px">{{ ingredient.notes }}</Tag>
            </li>
        </ul>

        <h3>Postup</h3>
        <div v-for="step in recipe.Step">
            <b>{{ step.name }}</b>
            <div class="stepText">{{ step.text }}</div>
        </div>

        <!-- TODO: move this functionality to /recipes -->
       <!--  <div v-if="user.id == recipe.creator">
            <Button class="p-button-danger" @click="deleteRecipeLocal">Zmaž recept</Button>
            <Button class="p-button-warn" @click="router.push(`/edit-recipe/${recipe.id}`)">Uprav recept</Button>
        </div> -->

        <div style="text-align: center; margin-top: 16px;">
            <Button label="Spustit režim vaření" icon="pi pi-play" @click="router.push(`/cookmode/${recipe.id}`)" />
        </div>
    </div>
</template>

<style scoped>
.stepText {
    margin-left: 20px;
    margin-bottom: 10px;
}

h3 {
    margin-bottom: 12px;
    font-size: 20px;
}
</style>
