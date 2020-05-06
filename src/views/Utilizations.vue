<template>
    <div>
        <ul class="uk-subnav uk-subnav-pill uk-align-center" uk-switcher>
            <li @click="verified = true"><a href="#">Verified</a></li>
            <li @click="verified = false"><a href="#">Unverified</a></li>
        </ul>
        <ul class="uk-list uk-list-striped">
            <li class="uk-text-center" v-for="(u, i) in list">
                <div class="uk-text-bold">
                    Utilization sum: {{ u.utilization_sum.toFixed(2) }}$
                </div>
                <div class="uk-text-meta">
                    {{ new Date(u.timestamp * 1000).getFullYear() + '-' + (new Date(u.timestamp * 1000).getMonth() + 1) + '-' + new Date(u.timestamp * 1000).getDate() }}
                </div>
                <div>
                    {{ u.employer.company_name }}
                    {{ u.employer.name + ' ' + u.employer.surname }} emloyed {{ u.utilizer.company_name }}<br><br>
                    {{ u.util_branch.code }}, {{ u.util_branch.state }}<br>
                    {{ u.util_branch.city }}<br><br>
                    Utilizer address: {{ u.util_branch.street }} {{ u.util_branch.house }}, {{ u.util_branch.index }}<br>
                    Employer address: {{ u.empl_branch.street }} {{ u.empl_branch.house }}, {{ u.empl_branch.index }}
                    <br><br>
                    <ul uk-accordion>
                        <li class="uk-open">
                            <a class="uk-accordion-title" href="#">Utilized</a>
                            <div class="uk-accordion-content">
                                <div v-for="(v, k) in u.utilized">
                                    {{ convert[k] }}: {{ v.util_price.toFixed(2) }}$ for {{ v.weight }} gramms<br>
                                    Utilizer tarrif: {{ v.util_tarrif.split(':')[0] }}$ for {{ v.util_tarrif.split(':')[1] }} tonns
                                    <span v-if="v.waste_tax != '0:1'">
                                        <br>Tax: {{ v.waste_tax.split(':')[0] }}$ for {{ v.waste_tax.split(':')[1] }} tonns
                                    </span>
                                    <br><br>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <button @click="confirm([u.id])" v-if="$store.state.user.type == 2" class="uk-button uk-button-default">
                        Confirm
                    </button>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'Utilizations',
        data: function () {
            return {
                convert: {
                    1: "Metal",
                    2: "Glass",
                    3: "Plastic"
                },
                verified: true
            }
        },
        computed: {
            list: function () {
                var result;
                if (this.verified) {
                    result = this.$store.state.confirmed_utilizations;
                }
                else {
                    result = this.$store.state.unconfirmed_utilizations;
                }
                return result;
            }
        },
        methods: {
            confirm: function (arr) {
                var _this = this;

                this.$http
                .post('http://localhost:5000/api/transaction/confirmed', {
                    transactions: arr
                })
                .then(resp => {
                    UIkit.notification({
                        message: resp.data.message,
                        status: 'success',
                        pos: 'top-right',
                        timeout: 5000
                    });
                    _this.$store
                    .dispatch('getVerifiedUtilizations');
                    _this.$store
                    .dispatch('getUnverifiedUtilizations');
                })            
            }
        },
        mounted: function () {
            this.$store
            .dispatch('getVerifiedUtilizations');
            this.$store
            .dispatch('getUnverifiedUtilizations');
        }
    }
</script>
<style></style>