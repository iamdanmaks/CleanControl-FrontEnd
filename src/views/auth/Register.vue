<template>
    <div>
        <div v-if="step == 1" class="uk-align-center uk-position-center uk-width-1-2">
            <h1>Choose account type</h1>
            <button v-on:click="choose_type(0)" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">
                <span uk-icon="icon: user"></span>
                Personal
            </button>
            <button v-on:click="choose_type(1)" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">
                <span uk-icon="icon: users"></span>
                Company
            </button>
            <button v-on:click="choose_type(2)" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">
                <span uk-icon="icon: cog"></span>
                Utilizer
            </button>
        </div>
        <div class="big-form" v-if="step == 2">
            <br><br><br>
            <form class="uk-form-stacked uk-align-center uk-vertical-align-medium uk-position-center" @submit.prevent="register">
                <br>
                <h1>Give us some information</h1>
                <div class="uk-margin-small uk-width-medium uk-align-center">
                    <label for="mail">Email</label>
                    <input v-validate="'required|email'" data-vv-as="mail" class="uk-input" name="mail" 
                    type="email" placeholder="Email..." v-model="email" />
                    <br><span class="uk-text-danger">{{ errors.first('mail') }}</span>
                </div>

                <div v-if="type == 0" class="uk-margin-small uk-width-medium uk-align-center">
                    <label for="name">Name</label>
                    <input v-validate="'required|min:1|alpha'" data-vv-as="name" class="uk-input" name="name" 
                    type="text" placeholder="Name..." v-model="name" />
                    <span class="uk-text-danger">{{ errors.first('name') }}</span>
                </div>

                <div v-if="type == 0" class="uk-margin-small uk-width-medium uk-align-center">
                    <label for="surname">Surname</label>
                    <input v-validate="'required|min:1|alpha'" data-vv-as="surname" class="uk-input" name="surname" 
                    type="text" placeholder="Surname..." v-model="surname" />
                    <br><span class="uk-text-danger">{{ errors.first('surname') }}</span>
                </div>
                
                <div v-if="type != 0" class="uk-margin-small uk-width-medium uk-align-center">
                    <label for="company">Company name</label>
                    <input v-validate="'required|min:3'" data-vv-as="company" class="uk-input" name="company" 
                    type="text" placeholder="Company name..." v-model="company" />
                    <br><span class="uk-text-danger">{{ errors.first('company') }}</span>
                </div>

                <div class="uk-margin-small uk-width-medium uk-align-center">
                    <label for="password">Password</label>
                    <input v-validate="'required|alpha_num|regex:(?=.*[0-9])|max:30|min:6'" data-vv-as="password" class="uk-input" name="password" 
                    type="password" placeholder="Password..." v-model="password" />
                    <br><span class="uk-text-danger">{{ errors.first('password') }}</span>
                </div>

                <div class="uk-margin-small uk-width-medium uk-align-center">
                    <label for="repeat">Repeat password</label>
                    <input v-validate="'required|'" data-vv-as="repeat" class="uk-input" name="repeat" 
                    type="password" placeholder="Repeat password..." v-model="repeat" />
                    <br><span class="uk-text-danger">{{ errors.first('repeat') }}</span>
                </div>

                <div class="uk-margin-small">
                    <div class="uk-form-controls">
                        <div class="uk-button-group">
                            <a v-on:click="comeback" class="uk-button uk-button-default">Back</a>
                            <button class="uk-button uk-button-default" type="submit">Sign up</button>  
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    export default {
        name: "Register",
        data() {
            return {
                step: 1,
                type: -1,
                email: "",
                company: "",
                name: "",
                surname: "",
                password: "",
                repeat: ""
            };
        },
        methods: {
            choose_type: function(type) {
                this.type = type;
                this.step = 2;
            },
            comeback: function() {
                this.type = -1;
                this.step = 1;
            },
            register: function() {
                var _this = this;
                this.$validator.validate().then(valid => {
                    if (valid) {
                        if (_this.type == 0) {
                            var data = {
                                name: _this.name,
                                surname: _this.surname,
                                email: _this.email,
                                password: _this.password,
                                password_repeat: _this.repeat,
                                type: _this.type
                            };
                        }
                        else {
                            var data = {
                                company_name: _this.company,
                                email: _this.email,
                                password: _this.password,
                                password_repeat: _this.repeat,
                                type: _this.type
                            };
                        }
                        _this.$store
                        .dispatch("register", data)
                        .then(resp => {
                            UIkit.notification({
                                message: resp.data.message,
                                status: 'success',
                                pos: 'top-right',
                                timeout: 5000
                            });
                            this.$router.push("/login");
                        })
                        .catch(err => UIkit.notification({
                                message: err.response.data.message,
                                status: 'danger',
                                pos: 'top-right',
                                timeout: 5000
                            }));
                    }
                });
        }
        }
    };
</script>

<style>
    .big-form {
        overflow-y: auto;
    }
</style>
