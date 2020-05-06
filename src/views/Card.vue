<template>
    <div>
        <div class="uk-position-center">
            <h1>Insert your card</h1>
            <br>
            <div id="card-form">
            </div>
            <span v-if="!rendered" uk-spinner="ratio: 3.5"></span>
            <br><button v-if="rendered" v-on:click="getCardToken"
            class="uk-button uk-button-default">Submit</button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Card',
        data: function () {
            return {
                stripe: new Stripe('pk_test_gpmWaDrMw3A2d2q8T4AGxYYm00P28mEIyX'),
                elements: undefined,
                card: undefined,
                style: {
                    base: {
                        color: '#32325d',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#aab7c4'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                },
                rendered: false
            }
        },
        mounted: function () {
            if (Object.keys(this.$store.getters.userInfo).length === 0 && 
            this.$store.getters.userInfo.constructor === Object) {
                this.$store
                    .dispatch("getUser")
            }
            
            this.elements = this.stripe.elements();
            this.card = this.elements.create('card', {
                hidePostalCode: true, 
                style: this.style
            });
            this.card.mount('#card-form');
            this.rendered = true;
        },
        methods: {
            getCardToken: function () {
                var _this = this;
                this.stripe
                .createToken(this.card)
                .then(result => {
                    if (result.token != undefined) {
                        _this.send(result.token.id);
                    }
                    else {
                        _this.card_error = result.error.message;
                    }
                });
            },
            send: function (token) {
                this.$http
                .post('http://localhost:5000/api/user/card', {
                    card_id: token
                })
                .then(resp => {
                    UIkit.notification({
                        message: resp.data.message,
                        status: 'success',
                        pos: 'top-right',
                        timeout: 5000
                    });
                    this.$router.push('/')
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
        }
    }

</script>
<style>
</style>
