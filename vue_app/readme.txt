# resipe.
## Projekt do předmětu ITU, 2024

### Tomáš Bordák, xborda01
### Martin Jabůrek, xjabur02
### Ondřej Šatinský, xsatin03
### Tomáš Tomcsányi, xtomcs00


# Spuštění

## vue.js + vite app

Vite - dev. tools with HMR [Hot Module Replacement]

1. install node modules: **npm install**
2. run development server: **npm run serve**
3. open link that you got on output from serve command


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
├── readme.txt (xjabur02, )
├── shell.nix
├── src
│   ├── App.vue
│   ├── components !!! OBECNĚ POUŽÍVANÉ KOMPONENTY V APLIKACI
│   │   ├── addIngredient.vue (xtomcs00)
│   │   ├── addSteps.vue (xtomcs00)
│   │   ├── addUtencils.vue (xtomcs00)
│   │   ├── alert.vue
│   │   ├── basicPageHeader.vue
│   │   ├── ConvSelect.vue (xjabur02)
│   │   ├── Divider.vue (xjabur02, )
│   │   ├── EditTimer.vue (xsatin03)
│   │   ├── filters
│   │   │   ├── alergensPick.vue
│   │   │   ├── categoriesPick.vue
│   │   │   └── filtersHomepage.vue
│   │   ├── FriendRequest.vue (xjabur02)
│   │   ├── GroupchatComp.vue (xjabur02)
│   │   ├── ChatComp.vue (xjabur02)
│   │   ├── ChatLink.vue (xjabur02)
│   │   ├── loadingScreen.vue
│   │   ├── MessageComp.vue (xjabur02)
│   │   ├── myOnFloatLabel.vue (xtomcs00)
│   │   ├── navigation
│   │   │   ├── button.vue
│   │   │   └── navigation.vue
│   │   ├── NewTimer.vue (xsatin03)
│   │   ├── photoUploader.vue (xtomcs00)
│   │   ├── TimeInput.vue (xsatin03)
│   │   ├── timePicker.vue
│   │   ├── TimerView.vue (xsatin03)
│   │   └── UnblockEntry.vue (xjabur02)
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── stores !!! DATA PERZISTIVNÍ MEZI STRÁNKAMI APLIKACE
│   │   ├── filterStore.js
│   │   ├── recipeStore.js (xtomcs00)
│   │   └── userStore.js
│   ├── style.css
│   └── views !!! JEDNOTLIVÉ STRÁNKY APLIKACE
│       ├── AddGroupchatMember.vue (xjabur02)
│       ├── CookModeStep.vue (xsatin03)
│       ├── CookMode.vue (xsatin03)
│       ├── EditGroupchat.vue (xjabur02)
│       ├── filters
│       │   ├── CreateFilter.vue
│       │   ├── EditFilter.vue
│       │   └── Filters.vue
│       ├── ForeignUser.vue (xjabur02)
│       ├── Friends.vue (xjabur02)
│       ├── Groupchat.vue (xjabur02)
│       ├── Homepage.vue
│       ├── Chat.vue (xjabur02)
│       ├── MyRecipes.vue
│       ├── NotFound.vue
│       ├── ProfilePreview.vue (xjabur02)
│       ├── Profile.vue (xjabur02)
│       ├── PublicRecipe.vue
│       ├── RecipeFormView.vue (xtomcs00)
│       ├── Share.vue (xjabur02)
│       └── Users.vue (xjabur02, )
├── utils
│   ├── add_recipe_api.js (xtomcs00)
│   ├── api_cookmode.js (xsatin03)
│   ├── api.js (všichni)
│   ├── groupchat_api.js (xjabur02)
│   ├── likes_api.js (xjabur02)
│   ├── subscription_api.js (xjabur02)
│   ├── supabase.js
│   ├── update_recipe_api.js (xtomcs00)
│   └── users_api.js (xjabur02)
└── vite.config.js


TODO !!! důraz na umístění klíčových částí FE
TODO !!! důraz na autorství konkrétních částí

TODO KOMENTOVAT KÓD, HLAVIČKY
