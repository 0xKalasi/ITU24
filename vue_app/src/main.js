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

/* HERE IMPORT PRIMEVUE COMPONENTS */
import Button from "primevue/button";

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

/* HERE REGISTER EACH PRIMEVUE COMPONENT AS A GLOBAL COMPONENT */
/* app.component("html_tag_name", ImportedPrimeVueComponent); */
/* use like this in .vue files -> <html_tag_name></html_tag_name> */
app.component("Button", Button);

/* AFTER EVERYTHING IS REGISTERED, MOUNT APP */
app.mount("#app");