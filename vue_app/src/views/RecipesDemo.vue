<script setup>
import { useRouter } from "vue-router";
import navigationButton from "../components/navigationButton.vue";

const router = useRouter();
const currentRoute = router.currentRoute.value;
const username = currentRoute.params.username;

const imageUrl = (path) => {
  return new URL(path, import.meta.url).href;
};

const recipes = [
  {
    name: "Fking svickova",
    ingredients: [
      "mkrvicka",
      "cibulka",
      "celer",
      "petrzlen",
      "koreni",
      "maso na svickovu",
    ],
    cook_steps: [
      {
        id: 1,
        body: "Očisti zeleninu a nakrajaj na kocky",
      },
      {
        id: 2,
        body: "Umy a opraž mäso so všetkých strán na rozpálenom oleji. Potom ho prelož na pekáč, okoreň podla chuti a vlož do predohriatej rúry na 180°C na 2 hodiny",
      },
      {
        id: 3,
        body: "Mäso daj bokom a na tej istej panvici opraž zeleninu dohneda",
      },
      {
        id: 4,
        body: "Po uprazeni zalej vodou, pridaj korenie (sul, pepř atd.)",
      },
    ],
    picture_path: "../assets/svickova.jpg",
  },
  {
    name: "Palacinky",
    ingredients: [
      "2 vajicka",
      "Muka 2 hrnky",
      "Cukr kolko chceš",
      "Skorica",
      "Vanilkovy cukr",
      "Mleko",
    ],
    cook_steps: [
      {
        id: 1,
        body: "Rozmixuj vajicka s cukrom a mliekom",
      },
      {
        id: 2,
        body: "Pridaj preosiatu muku cez sítko, ostatné ingrediencie na dochutenie",
      },
      {
        id: 3,
        body: "Na rozohriatu panvicu s trošičkou oleja nalej palacinkovu zmes a rozostri po celej panvici, po zhnednuti otoč",
      },
    ],
  },
  {
    name: "Boloňská omáčka",
    ingredients: [
      "olivový olej 1 PL",
      "máslo 4 PL",
      "cibula 2ks",
      "řapíkatý celer",
      "mrkev 2ks",
      "hovězí maso mleté 350g",
      "sůl",
      "pepř",
      "mléko 250ml",
      "konzerva krájaných rajčat 400g",
      "strouhaný parmazán",
      "uvarené špagety podle návodu na obalu",
    ],
    cook_steps: [
      {
        id: 1,
        body: "V hrnci na oleji a 3 lžících másla osmahněte najemno pokrájenou cibuli.",
      },
      {
        id: 2,
        body: "Přidejte pokrájený celer a nastrouhanou mrkev. Smažte dvě minuty.",
      },
      {
        id: 3,
        body: "Vsypte maso, vařečkou či vidličkou ho rozdělujte na kousky, osolte a opepřete. Zalijte mlékem a povařte, až se mléko odpaří.",
      },
      {
        id: 4,
        body: "Poprašte muškátovým oříškem, zalijte vínem, promíchejte a nechte víno odvařit.",
      },
      {
        id: 5,
        body: "Přilijte rajčata i s nálevem.",
      },
      {
        id: 6,
        body: "Jakmile směs začne vřít, promíchejte ji a na co nejmírnějším ohni vařte bez pokličky do zhoustnutí. Je-li třeba, trochu podlijte. Hotovou omáčku dochuťte solí a pepřem.",
      },
      {
        id: 7,
        body: "Promíchejte s těstovinami povařenými podle návodu na obalu al dente, přidejte zbývající lžíci másla a podávejte se strouhaným parmazánem.",
      },
    ],
  },
];
</script>

<template>
  <h2>{{ username }}'s recipes</h2>
  <navigationButton />

  <div class="recipes" v-for="(recipe, index) in recipes" :key="recipe.name">
    <!-- NAME -->
    <h3>{{ recipe.name }}</h3>

    <!-- INGREDIENTS -->
    <ul>
      <li v-for="ingredient in recipe.ingredients" :key="ingredient">
        {{ ingredient }}
      </li>
    </ul>

    <!-- PICTURE -->
    <img
      v-if="recipe.picture_path"
      :src="imageUrl(recipe.picture_path)"
      width="300px"
    />

    <!-- COOK STEPS -->
    <div v-for="step in recipe.cook_steps">
      <p>
        <b>{{ step.id }}. krok:</b>
      </p>
      <p>{{ step.body }}</p>
    </div>

    <!-- DEVIDER: dont render after last recipe -->
    <div v-if="index != recipes.length - 1" class="devider"></div>
  </div>
</template>

<style scoped>
.recipes {
  text-align: left;
}

.img {
  float: right;
}

.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>
