<template>
    <div id="user-info" class="uk-flex-top" uk-modal>
        <div class="uk-modal-dialog uk-margin-auto-vertical uk-modal-body">
            <button class="uk-modal-close-outside" type="button" uk-close></button>
            <div style="background: transparent" class="uk-card-badge uk-label">
                <button class="uk-button uk-button-text" type="button" uk-icon="more-vertical"></button>
                <div uk-dropdown>
                    <ul class="uk-nav uk-dropdown-nav">
                        <li>
                            <a @click="startEdit" v-if="!edit">Edit</a>
                            <a @click="stopEdit" v-if="edit">Cancel editing</a>
                        </li>
                        <li><a @click="card">Change card</a></li>
                        <li><a @click="facsimile">Change facsimile</a></li>
                        <li><a @click="logout">Logout</a></li>
                    </ul>
                </div>
            </div>
            <div v-if="$store.state.user.type == 0 && !edit" class="title uk-align-center uk-modal-title">
                {{$store.state.user.name}}&nbsp;{{$store.state.user.surname}}
            </div>
            <div v-if="$store.state.user.type != 0 && !edit" class="title uk-align-center uk-modal-title">
                {{$store.state.user.company_name}}
            </div>
            <div v-if="!edit" class="uk-margin-top-small">
                <span class="uk-text-bold">Type:</span> {{type}}
            </div>
            <div v-if="!edit" class="uk-margin-top-small">
                <span class="uk-text-bold">Number of branches:</span> {{$store.state.branches.length}}
            </div>
            <div v-if="edit && $store.state.user.type == 0">
                <label for="name">Name</label>
                <div class="uk-margin-small">
                    <input name="name" class="uk-input" type="text" v-model="name" placeholder="Name...">
                </div>
                <label for="surname">Surname</label>
                <div class="uk-margin-small">
                    <input name="surname" class="uk-input" type="text" v-model="surname" placeholder="Surname...">
                </div>
            </div>
            <div v-if="edit && $store.state.user.type != 0">
                <label for="company_name">Company name</label>
                <div class="uk-margin-small">
                    <input name="company_name" class="uk-input" type="text" v-model="company_name" placeholder="Company name...">
                </div>
            </div>
            <div v-if="edit">
                <br>Change the password<br><br>
                <label for="old_pass">Old password</label>
                <div class="uk-margin-small">
                    <input name="old_pass" v-model="old_pass" class="uk-input" type="password" placeholder="Old password...">
                </div>
                <label for="new_pass">New password</label>
                <div class="uk-margin-small">
                    <input name="new_pass" v-model="new_pass" class="uk-input" type="password" placeholder="New password...">
                </div>
                <label for="company_name">Repeat new password</label>
                <div class="uk-margin-small">
                    <input name="repeat" v-model="repeat" class="uk-input" type="password" placeholder="Repeat new password...">
                </div>
                <button @click="editSubmit" class="uk-button uk-button-default uk-align-center">Submit</button>
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        name: 'UserModal',
        data: function () {
            return {
                edit: false,
                name: null,
                surname: null,
                company_name: null,
                old_pass: null,
                new_pass: null,
                repeat: null
            }
        },
        computed: {
            type: function () {
                if (this.$store.state.user.type == 0)
                    return "Personal account";
                else if (this.$store.state.user.type == 1)
                    return "Business account";
                else if (this.$store.state.user.type == 2)
                    return "Utilizer account";
            }
        },
        methods: {
            logout: function () {
                UIkit.modal('#user-info').hide();
                this.$store.dispatch("logout");
                this.$router.push("/login");
            },
            card: function () {
                UIkit.modal('#user-info').hide();
                this.$router.push("/card");
            },
            facsimile: function () {
                UIkit.modal('#user-info').hide();
                this.$router.push("/facsimile");
            },
            stopEdit: function () {
                this.edit = false;
            },
            startEdit: function () {
                this.edit = true;
                this.name = this.$store.state.user.name;
                this.surname = this.$store.state.user.surname;
                this.company_name = this.$store.state.user.company_name;
            },
            editSubmit: function () {
                var _this = this;

                this.$http
                .put('http://localhost:5000/api/user/', {
                    name: _this.name,
                    surname: _this.surname,
                    company_name: _this.company_name,
                    old_password: _this.old_pass,
                    new_password: _this.new_pass,
                    password_repeat: _this.repeat
                })
                .then(resp => {
                    _this.$store
                        .dispatch('getUser')
                    _this.edit = false;
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
                })
            }
        }
    }
</script>
<style>
    #user-info {
        overflow: hidden;
    }
</style>