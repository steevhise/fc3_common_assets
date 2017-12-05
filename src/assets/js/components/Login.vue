<template>
    <form method="POST" id="loginForm" v-pre >
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
        </form>
</template>

<script>
    export default {
        name: 'fc-login',
        data() {
            return {
                
            }
        }
    }
</script>