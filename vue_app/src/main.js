/* VUE MAIN IMPORTS */
import { createApp } from "vue";
import router from "./router/index";
import App from "./App.vue";

/* GLOBAL CSS CLASSES */
import "./style.css";

/* PINIA - STATE MANAGEMENT */
import { createPinia } from 'pinia'
const pinia = createPinia();

/* PRIMEVUE CONFIG, THEME, ICONS */
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'

/* CREATE APP AND USE THESE UTILITIES */
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

/* HERE IMPORT PRIMEVUE COMPONENTS */
import Button from "primevue/button";
import ButtonGroup from "primevue/buttongroup";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import SpeedDial from "primevue/speeddial";
import Message from "primevue/message";
import Alert from "../src/components/alert.vue";
import LoadingScreen from "../src/components/loadingScreen.vue";

/* HERE REGISTER EACH PRIMEVUE COMPONENT AS A GLOBAL COMPONENT */
/* app.component("html_tag_name", ImportedPrimeVueComponent); */
/* use like this in .vue files -> <html_tag_name></html_tag_name> */
app.component("Button", Button);
app.component("ButtonGroup", ButtonGroup);
app.component("IconField", IconField);
app.component("InputIcon", InputIcon);
app.component("InputText", InputText);
app.component('Tag', Tag);
app.component("SpeedDial", SpeedDial);
app.component("Message", Message);
app.component("Alert", Alert);
app.component("LoadingScreen", LoadingScreen);


/* AFTER EVERYTHING IS REGISTERED, MOUNT APP */
app.mount("#app");