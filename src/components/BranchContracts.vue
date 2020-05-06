<template>
    <div>
        <div v-if="$store.state.user.type == 2" style="overflow-y: auto;" class="uk-modal-body uk-height-medium">
            <dl class="uk-description-list uk-description-list-divider">
                <span v-for="(c, index) in $store.state.branchContracts">
                    <dt>
                        {{ c.employer_name }} ({{ c.empl_branch.street }} {{ c.empl_branch.house }}, {{ c.empl_branch.index }})
                        <sup uk-icon="check" uk-tooltip="Verified" v-if="c.verified"></sup>
                        <sup uk-icon="clock" uk-tooltip="Not yet verified" v-else></sup>
                    </dt>
                    <dd>
                        End date: {{ c.end_date }}
                        <div v-if="c.verified" class="uk-grid-small uk-child-width-auto uk-margin" uk-grid :uk-countdown="'date: ' + c.end_date">
                            <div>
                                Days left: <div class="uk-countdown-number uk-inline uk-countdown-days uk-text-small"></div>
                            </div>
                        </div>
                        <div v-if="c.verified" class="uk-button-group">
                            <button @click="check(index)" class="uk-button uk-button-default">Check</button>
                            <button @click="download(index)" class="uk-button uk-button-default">Get PDF</button>
                        </div><br><br>
                        <div v-if="!c.verified" class="uk-button-group">
                            <button @click="agree(index)" class="uk-button uk-button-default">Agree</button>
                            <button @click="disagree(index)" class="uk-button uk-button-default">Disagree</button>
                        </div>
                    </dd>
                </span>
            </dl>
        </div>
        <div v-else class="uk-modal-body">
            <dl class="uk-description-list uk-description-list-divider">
                <span v-for="(c, index) in $store.state.branchContracts">
                    <dt>
                        {{ c.utilizer_name }} ({{ c.util_branch.street }} {{ c.util_branch.house }}, {{ c.util_branch.index }})
                        <sup uk-icon="check" uk-tooltip="Verified" v-if="c.verified"></sup>
                        <sup uk-icon="clock" uk-tooltip="Not yet verified" v-else></sup>
                    </dt>
                    <dd v-if="c.verified">
                        End date: {{ c.end_date }}
                        <div class="uk-grid-small uk-child-width-auto uk-margin" uk-grid :uk-countdown="'date: ' + c.end_date">
                            <div>
                                Days left: <div class="uk-countdown-number uk-inline uk-countdown-days uk-text-small"></div>
                            </div>
                        </div>
                        <div class="uk-button-group">
                            <button @click="check(index)" class="uk-button uk-button-default">Check</button>
                            <button @click="download(index)" class="uk-button uk-button-default">Get PDF</button>
                        </div>
                    </dd>
                </span>
            </dl>
        </div>
    </div>
</template>
<script>
    export default {
        'name': 'BranchContracts',
        methods: {
            check: function (index) {
                this.$http
                .get('http://localhost:5000/api/contract/check?download=0&contract=' + this.$store.state.branchContracts[index].id)
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
                })
            },
            download: function (index) {
                this.$http({
                    url: 'http://localhost:5000/api/contract/check?download=1&contract=' + this.$store.state.branchContracts[index].id,
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
                })
            },
            agree: function (index) {
                var _this = this;

                this.$http
                .post('http://localhost:5000/api/contract/' + this.$store.state.branchContracts[index].id)
                .then(resp => {
                    UIkit.notification({
                        message: resp.data.message,
                        status: 'success',
                        pos: 'top-right',
                        timeout: 5000
                    });
                    _this.$parent.reload();
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
            disagree: function (index) {
                var _this = this;
                
                this.$http
                .delete('http://localhost:5000/api/contract/' + this.$store.state.branchContracts[index].id)
                .then(resp => {
                    UIkit.notification({
                        message: resp.data.message,
                        status: 'success',
                        pos: 'top-right',
                        timeout: 5000
                    });
                    _this.$parent.reload();
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
<style></style>