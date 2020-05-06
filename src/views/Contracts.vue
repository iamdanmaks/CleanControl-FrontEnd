<template>
    <div>
        <ul class="uk-subnav uk-subnav-pill uk-align-center" uk-switcher>
            <li @click="verified = true"><a href="#">Verified</a></li>
            <li @click="verified = false"><a href="#">Unverified</a></li>
        </ul>
        <ul class="uk-list uk-list-striped">
            <li class="uk-text-center" v-for="(c, i) in list">
                <div class="uk-text-bold">
                    {{ c.employer_name }} employs {{ c.utilizer_name }}
                </div>
                <div class="uk-text-meta">
                    {{ c.end_date }}
                </div>
                <div>
                    {{ c.util_branch.code }}, {{ c.util_branch.state }}<br>
                    {{ c.util_branch.city }}
                </div>
                <div>
                    Utilizer address: {{ c.util_branch.street }} {{ c.util_branch.house }}, {{ c.util_branch.index }}<br>
                    Employer address: {{ c.empl_branch.street }} {{ c.empl_branch.house }}, {{ c.empl_branch.index }}<br>
                </div>
                <div v-if="verified" class="uk-button-group uk-align-center">
                    <button @click="check(c.id, 0)" class="uk-button uk-button-default">Check</button>
                    <button @click="check(c.id, 1)" class="uk-button uk-button-default">Download</button>
                </div>
                <div v-if="!verified && $store.state.user.type == 2" class="uk-button-group uk-align-center">
                    <button @click="agree(c.id)" class="uk-button uk-button-default">Agree</button>
                    <button @click="disagree(c.id)" class="uk-button uk-button-default">Disagree</button>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
var countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/uk.json"));

    export default {
        name: 'Contracts',
        data: function () {
            return {
                verified: true
            }
        },
        computed: {
            list: function () {
                var result;
                if (this.verified) {
                    result = this.$store.state.verified_contracts;
                }
                else {
                    result = this.$store.state.unverified_contracts;
                }
                for (let i = 0; i < result.length; ++i) {
                    result[i].util_branch.code = countries.getName(result[i].util_branch.code, "en");
                }
                return result;
            }
        },
        methods: {
            agree: function (id) {
                var _this = this;

                this.$http
                .post('http://localhost:5000/api/contract/' + id)
                .then(resp => {
                    UIkit.notification({
                        message: resp.data.message,
                        status: 'success',
                        pos: 'top-right',
                        timeout: 5000
                    });
                    _this.$store
                    .dispatch('getVerifiedContracts');
                    _this.$store
                    .dispatch('getUnverifiedContracts');
                })
                .catch(err => {
                    UIkit.notification({
                        message: err.response.data.message,
                        status: 'danger',
                        pos: 'top-right',
                        timeout: 5000
                    });
                })
            },
            disagree: function (id) {
                var _this = this;
                
                this.$http
                .delete('http://localhost:5000/api/contract/' + id)
                .then(resp => {
                    UIkit.notification({
                        message: resp.data.message,
                        status: 'success',
                        pos: 'top-right',
                        timeout: 5000
                    });
                    _this.$store
                    .dispatch('getUnverifiedContracts');
                })
                .catch(err => {
                    UIkit.notification({
                        message: err.response.data.message,
                        status: 'danger',
                        pos: 'top-right',
                        timeout: 5000
                    });
                })
            },
            check: function (id, mode) {
                if (mode == 1) {
                    this.$http({
                        url: 'http://localhost:5000/api/contract/check?download=' + mode + '&contract=' + id,
                        method: 'GET',
                        responseType: 'blob',
                    })
                    .then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'Contract.pdf');
                        document.body.appendChild(link);
                        link.click();
                    })
                    .catch(err => {
                        UIkit.notification({
                            message: err.response.data.message,
                            status: 'danger',
                            pos: 'top-right',
                            timeout: 5000
                        });
                        _this.$store
                        .dispatch('getVerifiedContracts');
                    })
                }
                else {
                    this.$http
                    .get('http://localhost:5000/api/contract/check?download=' + mode + '&contract=' + id)
                    .then(resp => {
                        UIkit.notification({
                            message: resp.data.message,
                            status: 'success',
                            pos: 'top-right',
                            timeout: 5000
                        });
                    })
                    .catch(err => {
                        UIkit.notification({
                            message: err.response.data.message,
                            status: 'danger',
                            pos: 'top-right',
                            timeout: 5000
                        });
                        _this.$store
                        .dispatch('getVerifiedContracts');
                    })
                }
            }
        },
        mounted: function () {
            this.$store
            .dispatch('getVerifiedContracts');
            this.$store
            .dispatch('getUnverifiedContracts');
        }
    }
</script>
<style></style>