<template>
    <div style="overflow: hidden;">
        <div style="overflow: hidden;" id="branch" class="uk-flex-top" uk-modal>
            <div v-if="branch_index != -1" class="uk-modal-dialog uk-margin-auto-vertical uk-modal-body">
                <button class="uk-modal-close-outside" type="button" uk-close></button>
                <div style="background: transparent" class="uk-card-badge uk-label">
                    <button class="uk-button uk-button-text" type="button" uk-icon="more-vertical"></button>
                    <div uk-dropdown>
                        <ul class="uk-nav uk-dropdown-nav">
                            <li>
                                <a @click="startEdit" v-if="!edit">Edit</a>
                                <a @click="stopEdit" v-if="edit">Cancel editing</a>
                            </li>
                            <li>
                                <a @click="tax = true" v-if="!tax">Count tax</a>
                                <a @click="tax = false" v-if="tax">Cancel taxes</a>
                            </li>
                            <li><a>Delete</a></li>
                        </ul>
                    </div>
                </div>
                <div v-if="!edit" class="uk-align-center uk-modal-title">
                    {{ $store.state.branches[branch_index].code }}
                    <div class="uk-text-meta">
                        {{ $store.state.branches[branch_index].state }},
                        {{ $store.state.branches[branch_index].city }}<br>
                        {{ $store.state.branches[branch_index].street }},
                        {{ $store.state.branches[branch_index].house }}<br>
                        {{ $store.state.branches[branch_index].index }}
                    </div>
                </div>
                <span v-if="!tax">
                    <BranchContracts v-if="!edit && $store.state.branchContracts.length != 0" />
                    <div v-if="!edit && $store.state.branchContracts.length == 0 && $store.state.user.type != 2">
                        <input v-if="utilizers.length != 0" class="uk-input uk-width-1-1" v-model="util_name" placeholder="Enter utilizer name..." />
                        <ul v-if="utilizers.length != 0" class="uk-height-medium" style="overflow-y: auto;" uk-accordion="multiple: true">
                            <li v-for="(u, i) in utilizers">
                                <a class="uk-accordion-title" href="#">{{ u.company_name }}</a>
                                <div class="uk-accordion-content">
                                    <div class="uk-text-bold">
                                        Tarrifs
                                    </div>
                                    <div v-for="t in tarrifs[i]">
                                        {{ t.type }}: {{ t.price }}$ for {{ t.weight }} tonns
                                    </div>
                                    <dl class="uk-description-list uk-description-list-divider">
                                        <span v-for="(b, index) in u.branches">
                                            <dt>
                                                {{ b.code }}<br> 
                                                {{ b.state }}, {{ b.city }}
                                                <div class="uk-text-meta">
                                                    {{ b.street }} {{ b.house }}, {{ b.index }}
                                                </div>
                                            </dt>
                                            <dd>
                                                <br>
                                                <div class="uk-inline">
                                                    <button class="uk-button uk-button-default" type="button">
                                                        Make a contract
                                                    </button>
                                                    <div uk-dropdown>
                                                        <ul class="uk-nav uk-dropdown-nav">
                                                            <li><a @click="makeContract(u.public_id, b.id, 6)" href="#">
                                                                For 6 months
                                                            </a></li>
                                                            <li><a @click="makeContract(u.public_id, b.id, 12)" href="#">
                                                                For 12 months
                                                            </a></li>
                                                            <li><a @click="makeContract(u.public_id, b.id, 18)" href="#">
                                                                For 18 months
                                                            </a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </dd>
                                        </span>
                                    </dl>
                                </div>
                            </li>
                        </ul>
                        <div v-if="utilizers.length == 0 && $store.state.user.type != 2" class="uk-text-bold uk-text-center">
                            There no utilizers in your area<br>
                        </div>
                    </div>
                </span>
                <span v-else>
                    <div>
                        <label for="date">Choose month to count taxes</label>
                        <input id="month" class="uk-input" :min="new Date().toISOString().split('T')[0]" name="date" type="month" />
                        <br>
                        <button @click="countTax" class="uk-button uk-button-default uk-align-center">
                            Count
                        </button>
                        <div class="uk-margin uk-text-center">
                            <div v-for="(v, k) in tax_value">
                                {{ k.charAt(0).toUpperCase() + k.slice(1) }}: {{ v }}$
                            </div>
                        </div>
                    </div>
                </span>
                <div v-if="edit">
                    <label for="old_pass">Street</label>
                    <div class="uk-margin-small">
                        <input name="street" v-model="street" class="uk-input" type="text" >
                    </div>
                    <label for="new_pass">House</label>
                    <div class="uk-margin-small">
                        <input name="house" v-model="house" class="uk-input" type="text" placeholder="New password...">
                    </div>
                    <label for="company_name">Postal Index</label>
                    <div class="uk-margin-small">
                        <input name="postal" v-model="postal" class="uk-input" type="text" placeholder="Repeat new password...">
                    </div>
                    <button @click="editSubmit" class="uk-button uk-button-default uk-align-center">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BranchContracts from "./BranchContracts.vue";
var countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/uk.json"));

    export default {
        name: 'Branch',
        components: {
            BranchContracts
        },
        props: {
            branch_index: Number
        },
        data: function () {
            return {
                edit: false,
                tax: false,
                tax_value: '',
                street: '',
                house: '',
                index: '',
                postal: '',
                util_name: '',
                utilizers: [],
                tarrifs: []
            }
        },
        mounted: function () {
            this.edit = false;
            this.street = '';
            this.house = '';
            this.index = '';
            this.postal = '';
            this.util_name = '';
            this.utilizers = [];
            this.tarrifs = [];
        },
        watch: {
            branch_index: function (val) {
                this.edit = false;
                this.street = '';
                this.house = '';
                this.index = '';
                this.postal = '';
                this.util_name = '';
                
                var _this = this;

                if (this.$store.state.user.type != 2) {
                    this.$http
                    .post('http://localhost:5000/api/user/utilizer/', {
                        name: '',
                        state: _this.$store.state.branches[_this.branch_index].state,
                        city: _this.$store.state.branches[_this.branch_index].city,
                        state: _this.$store.state.branches[_this.branch_index].state,
                        code: countries.getAlpha2Code(_this.$store.state.branches[_this.branch_index].code, 'en')
                    })
                    .then(resp => {
                        _this.utilizers = resp.data.utilizers;
                        for (let i = 0; i < _this.utilizers.length; ++i) {
                            _this.$http
                            .get('http://localhost:5000/api/user/utilizer/' + _this.utilizers[i].public_id + '/settings')
                            .then(resp => {
                                _this.tarrifs.push(resp.data);

                                for (let j = 0; j < _this.tarrifs.length; ++j) {
                                    for (let k = 0; k < _this.tarrifs[j].length; ++k) {
                                        _this.tarrifs[j][k].type = _this.codeToWaste(_this.tarrifs[j][k].type);
                                    }
                                }
                            })

                            for (let j = 0; j < _this.utilizers[i].branches.length; ++j) {
                                _this.utilizers[i].branches[j].code = countries.getName(_this.utilizers[i].branches[j].code, "en");
                            }
                        }
                    })
                    .catch(err => {})
                }
            },
            util_name: function (val) {
                var _this = this;

                this.$http
                .post('http://localhost:5000/api/user/utilizer/', {
                    name: val,
                    state: _this.$store.state.branches[this.branch_index].state,
                    city: _this.$store.state.branches[this.branch_index].city,
                    state: _this.$store.state.branches[this.branch_index].state,
                    code: countries.getAlpha2Code(_this.$store.state.branches[this.branch_index].code, 'en')
                })
                .then(resp => {
                    _this.utilizers = resp.data.utilizers;
                    for (let i = 0; i < _this.utilizers.length; ++i) {
                        _this.$http
                        .get('http://localhost:5000/api/user/utilizer/' + _this.utilizers[i].public_id + '/settings')
                        .then(resp => {
                            _this.tarrifs.push(resp.data);

                            for (let j = 0; j < _this.tarrifs.length; ++j) {
                                for (let k = 0; k < _this.tarrifs[j].length; ++k) {
                                    _this.tarrifs[j][k].type = _this.codeToWaste(_this.tarrifs[j][k].type);
                                }
                            }
                        })
                        
                        for (let j = 0; j < _this.utilizers[i].branches.length; ++j) {
                            _this.utilizers[i].branches[j].code = countries.getName(_this.utilizers[i].branches[j].code, "en");
                        }
                    }
                })
                .catch(err => {})
            }
        },
        methods: {
            codeToWaste: function (c) {
                var code = {
                    0: 'General weight',
                    1: 'Metal',
                    2: 'Glass',
                    3: 'Plastic'
                }
                
                return code[c];
            },
            startEdit: function () {
                this.street = this.$store.state.branches[this.branch_index].street;
                this.house = this.$store.state.branches[this.branch_index].house;
                this.postal = this.$store.state.branches[this.branch_index].index;
                this.edit = true;
            },
            stopEdit: function () {
                this.edit = false;
            },
            editSubmit: function () {
                var _this = this;
                this.$http
                .put('http://localhost:5000/api/user/branch/' + _this.$store.state.branches[_this.branch_index].id, {
                    index: _this.postal,
                    street: _this.street,
                    house: _this.house
                })
                .then(resp => {
                    _this.$store
                        .dispatch("getBranches")
                    UIkit.notification({
                        message: resp.data.message,
                        status: 'success',
                        pos: 'top-right',
                        timeout: 5000
                    });
                    _this.edit = false;
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
            countTax: function () {
                var _this = this;
                var date = document.getElementById('month').value;

                this.$http
                .get('http://localhost:5000/api/transaction/tax?branch=' + _this.$store.state.branches[_this.branch_index].id + '&date=' + date)
                .then(resp => {
                    _this.tax_value = resp.data.tax
                })
            },
            makeContract: function (util_id, branch_id, months) {
                var today = new Date();
                var newDate = new Date(today.setMonth(today.getMonth() + months));
                var _this = this;

                this.$http
                .post('http://localhost:5000/api/contract/', {
                    empl_branch_id: _this.$store.state.branches[_this.branch_index].id,
                    util_branch_id: branch_id,
                    utilizer_id: util_id,
                    end_date: newDate.getFullYear() + '-' + String(newDate.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
                })
                .then(resp => {
                    UIkit.notification({
                        message: resp.data.message,
                        status: 'success',
                        pos: 'top-right',
                        timeout: 5000
                    });
                    setTimeout(() => {
                        _this.$store
                        .dispatch('getBranchContract', this.$store.state.branches[_this.branch_index].id);
                    }, 1500);
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
            reload: function() {
                this.$store
                .dispatch('getBranchContract', this.$store.state.branches[this.branch_index].id);
            }
        }
    }
</script>
<style></style>