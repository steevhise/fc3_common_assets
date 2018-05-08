<template>
    <form method="POST" id="loginForm" action="/login" v-on:submit.prevent="onSubmit" ref="form">
            <div class="container">
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
                    <input class="btn btn-default" type="submit" value="Log in">
                    <p>
                        Or <a href="/fb_login"><i class="fa fa-facebook"></i> Sign up via Facebook</a>.
                        <!-- TODO: the link should be a swig tag: {{ path.pages_fblogin }} but it's not working at the moment-->
                    </p>
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
        },
        data() {

            return {
                extraValues: []
            };
        },
        methods: {
            onSubmit() {

                const extraForm = this.valuesFromForm && new FormData(document.querySelector(this.valuesFromForm));
                const entries = extraForm ? [...extraForm.entries()] : [];

                this.extraValues = entries.reduce((collect, [key, value]) => {

                    return Object.assign({}, collect, {
                        [key]: value
                    });
                }, {});

                this.$nextTick(() => {

                    this.$refs.form.submit();
                });
            }
        }
    }
</script>
