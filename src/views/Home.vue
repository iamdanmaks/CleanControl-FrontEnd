<template>
    <div>
        <div v-if="isLoggedIn">
            <div uk-filter="target: .js-filter">

                <ul class="uk-subnav uk-subnav-pill">
                    <li class="uk-active" uk-filter-control><a href="#">All</a></li>
                    <li v-for="c in cnt" :uk-filter-control="'.tag-' + c.replace(/\s/g, '')">
                        <a href="#">{{ c }}</a>
                    </li>
                </ul>
                
                <div class="uk-grid-match uk-child-width-1-3@m uk-text-center js-filter" uk-grid>
                    <div v-for="(branch, index) in branches" :class="'tag-' + branch.code.replace(/\s/g, '')">
                        <div class="uk-card uk-card-default uk-card-body">
                            <h3 class="uk-card-title uk-text-bold">
                                {{ branch.code }}
                            </h3>
                            <div class="uk-text-meta">
                                {{ branch.state }}, {{ branch.city }}
                            </div>
                            <div class="uk-margin-small">
                                {{ branch.street }}, {{ branch.house }}
                                <br>Postal index: {{ branch.index }}
                            </div>
                            <a @click="setIndex(index)" class="uk-button uk-button-text">More...</a>
                        </div>
                    </div>
                </div>
            </div>
            <Branch :branch_index="ind" />
        </div>
        <div v-else>
            Logged out
        </div>
    </div>
</template>
<script>
import Branch from '../components/BranchModal'

    export default {
        name: 'Home',
        components: {
            Branch
        },
        data: function () {
            return {
                ind: -1
            }
        },
        mounted: function () {
            if (this.$store.getters.isLoggedIn) {
                if (Object.keys(this.$store.getters.userInfo).length === 0 && 
                this.$store.getters.userInfo.constructor === Object) {
                    this.$store
                        .dispatch("getUser")
                }
                if (this.$store.getters.branches.length == 0) {
                    this.$store
                        .dispatch("getBranches")
                        .catch(err => {
                            if (err.response.status == 401) {
                                this.$store.dispatch("logout");
                                this.$router.push("/login");
                            }

                            if (err.response.data.message == 'Card') {
                                UIkit.notification({
                                    message: 'Enter your card data to continue',
                                    status: 'warning',
                                    pos: 'top-right',
                                    timeout: 5000
                                });
                                this.$router.push('/card')
                            }
                            else if (err.response.data.message == 'Facsimile') {
                                UIkit.notification({
                                    message: 'Enter your facsimile to continue',
                                    status: 'warning',
                                    pos: 'top-right',
                                    timeout: 5000
                                });
                                this.$router.push('/facsimile')
                            }    
                        });
                }
            }
        },
        methods: {
            setIndex: function (index) {
                this.ind = index;
                this.$store
                    .dispatch('getBranchContract', this.$store.getters.branches[index].id)
                    .then(() => {
                        UIkit.modal('#branch').show();
                    })
            }
        },
        computed: {
            isLoggedIn: function() {
                return this.$store.getters.isLoggedIn;
            },
            branches: function() {
                return this.$store.getters.branches;
            },
            cnt: function() {
                var brnch = this.$store.state.branches;
                var cnt = new Array(brnch.length);
                
                for (let i = 0; i < brnch.length; ++i) {
                    cnt[i] = brnch[i].code;
                }
                
                return Array.from(new Set(cnt));
            },
            brIndex: function () {
                return { branch_index: this.ind }
            }
        }
    }
</script>
<style></style>
