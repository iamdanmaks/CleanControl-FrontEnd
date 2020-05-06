<template>
    <div>
        <div class="uk-width-1-1 uk-height-1-2 uk-position-center">
            <h1>
                Set the signature by using the pad below
            </h1>
            <canvas width="540px" height="240px" style="border: 1px solid black"></canvas>
            <br><br>
            <div class="uk-button-group">
                <button v-on:click="clear" class="uk-button uk-button-default">Clear</button>
                <button v-on:click="undo" class="uk-button uk-button-default">Undo</button>
                <button v-on:click="save" class="uk-button uk-button-default">Save</button>
            </div>
        </div>
    </div>
</template>
<script>
import SignaturePad from 'signature_pad'

    export default {
        name: 'Facsimile',
        data: function () {
            return {
                signaturePad: undefined
            }
        },
        mounted: function () {
            if (Object.keys(this.$store.getters.userInfo).length === 0 && 
            this.$store.getters.userInfo.constructor === Object) {
                this.$store
                    .dispatch("getUser")
            }
            
            var canvas = document.querySelector("canvas");
            this.signaturePad = new SignaturePad(canvas);
            var _this = this;

            function resizeCanvas() {
                var ratio =  Math.max(window.devicePixelRatio || 1, 1);
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext("2d").scale(ratio, ratio);
                _this.signaturePad.clear();
            }

            window.addEventListener("resize", resizeCanvas);
        },
        methods: {
            clear: function () {
                this.signaturePad.clear();
            },
            undo: function () {
                var data = this.signaturePad.toData();
                if (data) {
                    data.pop();
                    this.signaturePad.fromData(data);
                }
            },
            save: function () {
                var data = this.signaturePad.toDataURL('image/png');
                this.$http
                .post('http://localhost:5000/api/user/facsimile', {
                    facsimile: data
                })
                .then(resp => {
                    UIkit.notification({
                        message: resp.data.message,
                        status: 'success',
                        pos: 'top-right',
                        timeout: 5000
                    });
                    this.$router.push('/');
                })
                .catch(err => {
                    UIkit.notification({
                        message: err.response.data.message,
                        status: 'danger',
                        pos: 'top-right',
                        timeout: 5000
                    }) 
                })
            }
        }
    }
</script>
<style></style>