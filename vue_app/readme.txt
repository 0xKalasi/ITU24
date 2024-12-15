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
    - public
        -- vite.svg
    - src
         -- component !!! OBECNĚ POUŽÍVANÉ KOMPONENTY
            --- filters
                ---- alergensPick.vue
                ---- categoriesPick.vue
                ---- filtersHomepage.vue
            --- navigation
                ---- button.vue
                ---- navigation.vue
            --- addIngredient.vue
            --- addSteps.vue
            --- addUtencils.vue
            --- alert.vue
            --- basicPageHeader.vue
            --- ConvSelect.vue (xjabur02)
            --- Divider.vue (xjabur02, )
            --- EditTimer.vue
            --- FriendRequest.vue (xjabur02)
            --- GroupchatComp.vue (xjabur02)
            --- ChatComp.vue (xjabur02)
            --- ChatLink.vue (xjabur02)
            --- loadingScreen.vue (xjabur02, )
            --- MessageComp.vue (xjabur02)
            --- myOnFloatLabel.vue
            --- NewTimer.vue
            --- photoUploader.vue
            --- TimeInput.vue
            --- timePicker.vue
            --- TimerView.vue
            --- UnblockEntry.vue (xjabur02)
        -- router !!! SMĚROVÁNÍ MEZI STRÁNKAMI API
            --- index.js (xjabur02, )
        -- stores !!! INFORMACE PERZISTIVNÍ MEZI STRÁNKAMI
            --- filterStore.vue
            --- recipeStore.vue
            --- userStore.vue (xjabur02, )
        -- views !!! SOUBORY S DEFINICEMI JEDNOTLIVÝCH STRÁNEK
            --- filters
                ---- CreateFilter.vue
                ---- EditFilter.vue
                ---- Filters.vue
            --- AddGroupchatMember.vue (xjabur02)
            --- CookMode.vue
            --- CookModeStep.vue
            --- EditGroupchat.vue (xjabur02)
            --- ForeignUser.vue (xjabur02)
            --- Friends.vue (xjabur02)
            --- Groupchat.vue (xjabur02)
            --- Homepage.vue
            --- Chat.vue (xjabur02)
            --- MyRecipes.vue
            --- NotFound.vue
            --- Profile.vue (xjabur02)
            --- ProfilePreview.vue (xjabur02)
            --- PublicRecipe.vue
            --- RecipeFormView.vue
            --- Share.vue (xjabur02)
            --- Users.vue (xjabur02, )
        -- App.vue
        -- main.js
        -- style.css
    - utils !!! DEFINICE API
        -- add_recipe_api.js
        -- api_cookmode.js
        -- api.js
        -- groupchat_api.js (xjabur02)
        -- likes_api.js (xjabur02)
        -- subscription_api.js (xjabur02)
        -- supabase.js
        -- update_recipe_api.js
        -- users_api.js (xjabur02, )
    - .env
    - index.html
    - package-lock.json
    - package.json
    - readme.txt (xjabur02, )
    - shell.nix
    - vite.config.js

TODO !!! důraz na umístění klíčových částí FE
TODO !!! důraz na autorství konkrétních částí

TODO KOMENTOVAT KÓD, HLAVIČKY
