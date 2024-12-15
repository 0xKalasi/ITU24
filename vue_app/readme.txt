# resipe.
## Projekt do předmětu ITU, 2024

### Tomáš Bordák, xborda01
### Martin Jabůrek, xjabur02
### Ondřej Šatinský, xsatin03
### Tomáš Tomcsányi, xtomcs00


# Spuštění

## vue.js app (+ vite dev. tools)

Vite - dev. tools with HMR [Hot Module Replacement]

1. install node modules: **npm install**
2. run development server: **npm run serve**
3. open link that you've got on output from step 2


# Adresářová struktura projektu

Společně s umístěním souboru v hierarchii je za ním v závorce uvedeno, kdo se na něm podílel.
Pokud ne, byl tento soubor automatizovaně vygenerován.

Řádky s významými částmi jsou označeny "!!!".

vue_app
├── index.html
├── package.json
├── package-lock.json
├── public
│   └── vite.svg
├── readme.txt (všichni)
├── shell.nix
├── src
│   ├── App.vue (xborda01)
│   ├── components !!! OBECNĚ POUŽÍVANÉ KOMPONENTY V APLIKACI
│   │   ├── addIngredient.vue (xtomcs00)
│   │   ├── addSteps.vue (xtomcs00)
│   │   ├── addUtencils.vue (xtomcs00)
│   │   ├── alert.vue (xborda01)
│   │   ├── basicPageHeader.vue (xborda01)
│   │   ├── ConvSelect.vue (xjabur02)
│   │   ├── Divider.vue (xjabur02)
│   │   ├── EditTimer.vue (xsatin03)
│   │   ├── filters
│   │   │   ├── alergensPick.vue (xborda01)
│   │   │   ├── categoriesPick.vue (xborda01)
│   │   │   └── filtersHomepage.vue (xborda01)
│   │   ├── FriendRequest.vue (xjabur02)
│   │   ├── GroupchatComp.vue (xjabur02)
│   │   ├── ChatComp.vue (xjabur02)
│   │   ├── ChatLink.vue (xjabur02)
│   │   ├── loadingScreen.vue (xborda01)
│   │   ├── MessageComp.vue (xjabur02)
│   │   ├── myOnFloatLabel.vue (xtomcs00)
│   │   ├── navigation
│   │   │   ├── button.vue (xborda01)
│   │   │   └── navigation.vue (xborda01)
│   │   ├── NewTimer.vue (xsatin03)
│   │   ├── photoUploader.vue (xtomcs00)
│   │   ├── TimeInput.vue (xsatin03)
│   │   ├── timePicker.vue (xtomcs00)
│   │   ├── TimerView.vue (xsatin03)
│   │   └── UnblockEntry.vue (xjabur02)
│   ├── router 
│   │   └── index.js (xborda01, xtomcs00)
│   ├── stores !!! DATA PERZISTIVNÍ MEZI STRÁNKAMI APLIKACE
│   │   ├── filterStore.js (xborda01)
│   │   ├── recipeStore.js (xtomcs00)
│   │   └── userStore.js (xborda01, xjabur02)
│   ├── main.js (xborda01)
│   ├── style.css (všichni)
│   └── views !!! JEDNOTLIVÉ STRÁNKY APLIKACE
│       ├── AddGroupchatMember.vue (xjabur02)
│       ├── CookModeStep.vue (xsatin03)
│       ├── CookMode.vue (xsatin03)
│       ├── EditGroupchat.vue (xjabur02)
│       ├── filters
│       │   ├── CreateFilter.vue (xborda01)
│       │   ├── EditFilter.vue (xborda01)
│       │   └── Filters.vue (xborda01)
│       ├── ForeignUser.vue (xjabur02)
│       ├── Friends.vue (xjabur02)
│       ├── Groupchat.vue (xjabur02)
│       ├── Homepage.vue (xborda01)
│       ├── Chat.vue (xjabur02)
│       ├── MyRecipes.vue
│       ├── NotFound.vue (xborda01)
│       ├── ProfilePreview.vue (xjabur02)
│       ├── Profile.vue (xjabur02)
│       ├── PublicRecipe.vue (xborda01, xtomcs00)
│       ├── RecipeFormView.vue (xtomcs00)
│       ├── Share.vue (xjabur02)
│       └── Users.vue (xjabur02, xborda01)
├── utils
│   ├── add_recipe_api.js (xtomcs00)
│   ├── api_cookmode.js (xsatin03)
│   ├── api.js (všichni)
│   ├── groupchat_api.js (xjabur02)
│   ├── likes_api.js (xjabur02)
│   ├── subscription_api.js (xjabur02)
│   ├── supabase.js (xborda01)
│   ├── update_recipe_api.js (xtomcs00)
│   └── users_api.js (xjabur02)
└── vite.config.js
