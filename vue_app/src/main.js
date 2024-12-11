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

/* HERE IMPORT OUR CUSTOM COMPONENTS */
import Alert from "../src/components/alert.vue";
import LoadingScreen from "../src/components/loadingScreen.vue";
import BasicPageHeader from "../src/components/basicPageHeader.vue";
import Divider from "./components/Divider.vue";
import ConvSelect from "./components/ConvSelect.vue";

/* HERE IMPORT PRIMEVUE COMPONENTS */
import Button from "primevue/button";
import ButtonGroup from "primevue/buttongroup";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Tag from "primevue/tag";
import SpeedDial from "primevue/speeddial";
import Message from "primevue/message";
import FloatLabel from "primevue/floatlabel";
import Listbox from "primevue/listbox";
import Image from "primevue/image";
import DatePicker from "primevue/datepicker";


/* HERE REGISTER COMPONENTS AS A GLOBAL COMPONENTS */
/* app.component("html_tag_name", ImportedComponent); */
/* use like this in .vue files -> <html_tag_name></html_tag_name> */
app.component("Button", Button);
app.component("ButtonGroup", ButtonGroup);
app.component("IconField", IconField);
app.component("InputIcon", InputIcon);
app.component("InputText", InputText);
app.component("Textarea", Textarea);
app.component('Tag', Tag);
app.component("SpeedDial", SpeedDial);
app.component("Message", Message);
app.component("FloatLabel", FloatLabel);
app.component("ListBox", Listbox);
app.component("Image", Image);
app.component("Alert", Alert);
app.component("LoadingScreen", LoadingScreen);
app.component("BasicPageHeader", BasicPageHeader);
app.component("DatePicker", DatePicker);
app.component("Divider", Divider);
app.component("ConvSelect", ConvSelect);


/* AFTER EVERYTHING IS REGISTERED, MOUNT APP */
app.mount("#app");