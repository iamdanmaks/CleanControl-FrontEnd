<template>
    <div id="create-branch" class="uk-flex-top" uk-modal>
        <div class="uk-modal-dialog uk-margin-auto-vertical uk-modal-body">
            <button class="uk-modal-close-outside" type="button" uk-close></button>
            <div>
                <label for="query">Address</label><br />
                <input uk-tooltip="Insert address and we will finish it" 
                class="uk-input uk-width-1-1" type="text" v-model="query" />
            </div>
            <div>
                <label for="house">House Number</label><br />
                <input class="uk-input uk-width-1-1" type="text" v-model="houseNum" />
            </div>
            <div>
                <label for="street">Street</label><br />
                <input class="uk-input uk-width-1-1" type="text" v-model="street" />
            </div>
            <div>
                <label for="city">City</label><br />
                <input class="uk-input uk-width-1-1" type="text" v-model="city" />
            </div>
            <div>
                <label for="state">State</label><br />
                <input class="uk-input uk-width-1-1" type="text" v-model="state" />
            </div>
            <div>
                <label for="postcode">Postal Code</label><br />
                <input class="uk-input uk-width-1-1" type="text" v-model="postcode" />
            </div>
            <div>
                <label for="country">Country</label><br />
                <input class="uk-input uk-width-1-1" type="text" v-model="country" />
            </div>
            <button @click="createBranch" class="uk-button uk-button-default uk-margin uk-align-center" type="button">Create</button>
        </div>
    </div>
</template>
<script>

    export default {
        name: 'CreateBranch',
        data() {
            return {
                query: "",
                here: new H.service.Platform({
                'apikey': 'a2PZZSaHwlumWmaKNDnHzHpErMG6ESa_HZCkhBsa8jY'
                }).getSearchService(),
                street: "",
                city: "",
                state: "",
                postcode: "",
                country: "",
                houseNum: "",
                code: ""
            };
        },
        watch: { 
            query: function(value) {
                var _this = this;

                this.here.geocode({
                    q: value
                }, (result) => {
                    if (result.items.length > 0) {
                        _this.street = result.items[0].address.street;
                        _this.city = result.items[0].address.city;
                        _this.state = result.items[0].address.county;
                        _this.country = result.items[0].address.countryName;
                        _this.postcode = result.items[0].address.postalCode;
                        _this.houseNum = result.items[0].address.houseNumber;
                        _this.code = result.items[0].address.countryCode;
                    }
                });
            }
        },
        methods: {
            createBranch () {
                var _this = this;
                
                this.here.geocode({
                    q: _this.country + _this.state + _this.city + _this.street + _this.houseNum
                }, (result) => {
                    if (result.items.length > 0) {
                        _this.country = result.items[0].address.countryName;
                        _this.code = result.items[0].address.countryCode;
                        
                        const getCountryISO2 = require("country-iso-3-to-2");
                        _this.code = getCountryISO2(_this.code);

                        _this.$http
                        .post('http://localhost:5000/api/user/branch/', {
                            code: _this.code,
                            state: _this.state,
                            city: _this.city,
                            index: _this.postcode,
                            street: _this.street,
                            house: _this.houseNum
                        })
                        .then(resp => {
                            UIkit.modal('#create-branch').hide();
                            this.$store
                                .dispatch("getBranches")
                            UIkit.notification({
                                message: resp.data.message,
                                status: 'success',
                                pos: 'top-right',
                                timeout: 5000
                            });
                            _this.code = "";
                            _this.state = "";
                            _this.city = "";
                            _this.postcode = "";
                            _this.street = "";
                            _this.houseNum = "";
                            _this.query = "";
                        })
                        .catch(err => {
                            UIkit.notification({
                                message: err.response.data.message,
                                status: 'danger',
                                pos: 'top-right',
                                timeout: 5000
                            });
                        })
                    }
                })
            }
        }
    }
</script>
<style>
    #create-branch {
        overflow: hidden;
    }
</style>