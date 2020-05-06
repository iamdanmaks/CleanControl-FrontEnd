<template>
    <div>
        <div class="uk-card uk-card-body uk-position-center">
            <label for="metal_price">
                Metal price ($)
            </label>
            <input class="uk-input uk-margin-left uk-width-1-3" name="metal_price" type="text" v-model="tarifs[1].price" placeholder="Price..." />
            <br><br>
            <label for="metal_weight">
                Metal weight (tonns)
            </label>
            <input class="uk-input uk-margin-left uk-width-1-3" name="metal_weight" type="text" v-model="tarifs[1].weight" placeholder="Weight..." />
            <br>
            <hr>
            <label for="glass_price">
                Glass price ($)
            </label>
            <input class="uk-input uk-margin-left uk-width-1-3" name="glass_price" type="text" v-model="tarifs[2].price" placeholder="Price..." />
            <br><br>
            <label for="glass_weight">
                Glass weight (tonns)
            </label>
            <input class="uk-input uk-margin-left uk-width-1-3" name="glass_weight" type="text" v-model="tarifs[2].weight" placeholder="Weight..." />
            <br>
            <hr>
            <label for="plastic_price">
                Plastic price ($)
            </label>
            <input class="uk-input uk-margin-left uk-width-1-3" name="plastic_price" type="text" v-model="tarifs[3].price" placeholder="Price..." />
            <br><br>
            <label for="plastic_weight">
                Plastic weight (tonns)
            </label>
            <input class="uk-input uk-margin-left uk-width-1-3" name="plastic_weight" type="text" v-model="tarifs[3].weight" placeholder="Weight..." />
            <br><br>
            <button @click="submit" class="uk-button uk-button-default">Submit</button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Tarif',
        data: function () {
            return {
                tarifs: {
                    1: {
                        price: 0,
                        weight: 0
                    },
                    2: {
                        price: 0,
                        weight: 0
                    },
                    3: {
                        price: 0,
                        weight: 0
                    }
                }
            }
        },
        methods: { 
            submit: function() {
                this.$http
                .post('http://localhost:5000/api/user/utilizer/settings', this.tarifs)
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
                        status: 'success',
                        pos: 'top-right',
                        timeout: 5000
                    });
                })
            }
        },
        mounted: function () {
            var _this = this;

            this.$http
            .get('http://localhost:5000/api/user/utilizer/settings')
            .then(resp => {
                for (let i = 0; i < resp.data.length; ++i) {
                    _this.tarifs[resp.data[i].type].weight = resp.data[i].weight;
                    _this.tarifs[resp.data[i].type].price = resp.data[i].price;
                }
            })
        }
    }
</script>
<style>
</style>