<template>
    <form method="POST" id="loginForm" ref="form">
            <div class="container">
                <div class="columns" v-if="maintenanceMode">
                    <p>
                        Site currently in temporary maintenance mode. If you're an admin, please log in. Otherwise, please try again later.
                    </p>
                </div>
                <div class="medium-6 columns float-left">
                    <label>Username/Email
                        <input type="text" name="user" placeholder="username or email address">
                    </label>
                </div>
                <div class="medium-6 cell columns float-left">
                    <label>Password
                        <input type="password" name="password" placeholder="password">
                    </label>
                </div>
                <div class="medium-12 columns align-center-middle ">
                    <input class="btn btn-default" type="submit" formaction="/login" value="Log in" v-on:click.prevent="onSubmit(null, $event)">
                    <div>
                        <button form="loginForm" class="btn-fb" type="submit" formaction="/fb-login" v-on:click.prevent="onSubmit(null, $event)"><i class="fa fa-facebook"></i>Login with Facebook</button>
                    </div>
                </div>
            </div>
            <input v-for="(value, key) in extraValues" type="hidden" v-bind:name="key" v-bind:value="value" />
        </form>
</template>

<script>
    export default {
        name: 'fc-login',
        props: {
            valuesFromForm: { default: "" },
            maintenanceMode: { default: window.FC_MAINTENANCE_MODE || false }
        },
        data() {

            return {
                extraValues: []
            };
        },
        methods: {
            onSubmit(_, event) {

                let { formAction } = event.target;
                const extraForm = this.valuesFromForm && new FormData(document.querySelector(this.valuesFromForm));
                const entries = extraForm ? [...extraForm.entries()] : [];

                this.extraValues = entries.reduce((collect, [key, value]) => {

                    return Object.assign({}, collect, {
                        [key]: value
                    });
                }, {});

                this.$nextTick(() => {

                    // if fb submit and step2, append step2 as query (needed to work with bell auth on fb-login)
                    if (this.extraValues.step2 && formAction.includes('/fb-login')) {
                        formAction = `${formAction}?step2=${this.extraValues.step2}`
                    }

                    this.$refs.form.action = formAction;
                    this.$refs.form.submit();
                });
            }
        }
    }
</script>
