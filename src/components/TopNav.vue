<template>
    <div id="topnav" uk-sticky="sel-target: .uk-navbar-container; show-on-up: true; cls-active: uk-navbar-sticky">
    
        <nav class="uk-navbar-container" uk-navbar>

            <div class="uk-navbar-left">
                <a class="uk-navbar-toggle" uk-navbar-toggle-icon uk-toggle="target: #offcanvas-nav" href=""></a>    
            </div>

            <div class="uk-navbar-center">
                <router-link to="/" class="uk-navbar-item uk-logo">
                    <img class="uk-width-1-2 uk-height-1-1" src="../../public/img/logo.png" />
                </router-link>
            </div>

            <div class="uk-navbar-right">
                <router-link v-if="!isLoggedIn" to="/login">
                    <span class="uk-margin-small-right" uk-icon="icon: sign-in"></span>
                </router-link>
                &nbsp;&nbsp;&nbsp;
                <router-link v-if="!isLoggedIn" to="/register">
                    <span class="uk-margin-small-right" uk-icon="icon: user"></span>
                    &nbsp;&nbsp;&nbsp;
                </router-link>
                <a class="uk-margin-small-right" v-if="isLoggedIn" uk-tooltip="New Branch" 
                uk-icon="plus" href="#create-branch" uk-toggle>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </a>
                <a class="uk-margin-small-right" v-if="isLoggedIn" href="#user-info" uk-toggle>
                    <avatar v-if="$store.state.user.type == 0" 
                    :username="$store.state.user.name + ' ' + $store.state.user.surname"></avatar>
                    <avatar v-if="$store.state.user.type == 1 || $store.state.user.type == 2"
                    :username="$store.state.user.company_name"></avatar>
                    &nbsp;&nbsp;&nbsp;
                </a>
            </div>

        </nav>

    </div>
</template>

<script>
import Avatar from 'vue-avatar'

    export default {
        name: 'TopNav',
        components: {
            Avatar
        },
        mounted: function () {
            if (this.$store.getters.isLoggedIn) {
                if (Object.keys(this.$store.getters.userInfo).length === 0 && 
                this.$store.getters.userInfo.constructor === Object) {
                    this.$store
                        .dispatch("getUser")
                }
            }
        },
        computed: {
            isLoggedIn: function() {
                return this.$store.getters.isLoggedIn;
            },
            userName: function() {
                if (this.$store.getters.isLoggedIn) {
                    return this.$store.getters.userName;
                }
            }
        }
    }
</script>

<style scoped>
    #topnav {
        overflow: hidden;
    }

    .uk-navbar-container {
        background: rgba(185, 180, 190, 0.8)!important;
    }

    a {
        color: black;
    }
</style>
