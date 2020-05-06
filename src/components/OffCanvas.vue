<template>
    <div id="offcanvas-nav" uk-offcanvas="mode: push; overlay: true">
        <div class="uk-offcanvas-bar uk-flex uk-flex-column">
            <button class="uk-offcanvas-close" type="button" uk-close></button>

            <ul class="uk-nav uk-nav-primary uk-nav-center uk-margin-auto-vertical">
                <li>
                    <router-link to="/">
                        <span class="uk-margin-small-right" uk-icon="icon: home"></span> Home
                    </router-link>
                </li>
                <li v-if="!isLoggedIn">
                    <router-link to="/login">
                        <span class="uk-margin-small-right" uk-icon="icon: sign-in"></span> Sign in
                    </router-link>
                </li>
                <li v-if="!isLoggedIn">
                    <router-link to="/register">
                        <span class="uk-margin-small-right" uk-icon="icon: user"></span> Sign up
                    </router-link>
                </li>
                <li v-if="isLoggedIn && isUtilizer">
                    <router-link to="/tariffs">
                        <span class="uk-margin-small-right" uk-icon="icon: list"></span> Tariffs
                    </router-link>
                </li>
                <li v-if="isLoggedIn">
                    <router-link to="/contracts">
                        <span class="uk-margin-small-right" uk-icon="icon: file-text"></span> Contracts
                    </router-link>
                </li>
                <li v-if="isLoggedIn">
                    <router-link to="/utilizations">
                        <span class="uk-margin-small-right" uk-icon="icon: trash"></span> Utilizations
                    </router-link>
                </li>
                <li v-if="isLoggedIn" class="uk-nav-divider"></li>
                <li v-if="isLoggedIn">
                    <a @click="logout">
                        <span class="uk-margin-small-right" uk-icon="icon: sign-out"></span>
                        Log out
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'OffCanvas',
        methods: {
            logout: function() {
                this.$store.dispatch("logout");
                this.$router.push("/login")
            }
        },
        computed: {
            isLoggedIn: function() {
                return this.$store.getters.isLoggedIn;
            },
            isUtilizer: function() {
                return this.$store.getters.isUtilizer;
            }
        }
    }
</script>

<style scoped>
 .uk-offcanvas-bar {
     background: rgba(85, 80, 90, 0.9)!important;
 }
</style>
