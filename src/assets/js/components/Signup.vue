<template>
	<div id="signup-wrapper">
        <div class="row collapse">
            <div class="medium-3 columns">
                <ul id="signup-tabs" data-tabs="" class="tabs vertical page-tabs-nav" role="tablist">
                    <li class="tabs-title" v-bind:class="{ 'is-active': step1 }" role="presentation"><a>Registration</a></li>
                    <li class="tabs-title" v-bind:class="{ 'is-active': step2 }" role="presentation"><a>Connect</a></li>
                </ul>
            </div>
            <div class="medium-8 columns last">
                <div class="tabs-content column vertical page-tabs-panels">
                    <div class="tabs-panel page-tabs-panel" v-bind:class="{ 'is-active': step1 }">
                        <div class="container">
                            <form method="POST" id="signupForm">
                                <div class="container clearfix">
                                    <div class="medium-6 columns float-left">
                                        <label>Username
                                            <input type="text" :value="username" name="user" placeholder="Username" />
                                        </label>
                                    </div>
                                    <div class="medium-6 columns float-left">
                                        <label>Email
                                            <input type="email" :value="email" name="email" placeholder="Email" />
                                        </label>
                                    </div>
                                    <div class="medium-6 cell columns float-left">
                                        <label>Password
                                            <input type="password" name="password" placeholder="Password">
                                        </label>
                                    </div>
                                    <div class="medium-6 cell columns float-left">
                                        <label>Confirm Password
                                            <input type="password" name="confpassword" placeholder="Confirm Password">
                                        </label>
                                    </div>
                                    <!-- captcha here -->
                                    <div class="medium-12 columns align-center-middle ">
                                        <input type="checkbox" name="acceptedTerms" value="1" /> I agree to the <a href="">Terms of Service</a>
                                    </div>
                                    <div class="medium-12 columns align-center-middle ">

                                        <input class="btn btn-default" type="submit" value="Sign Up">
                                            Or <a href="/fb_login"><i class="fa fa-facebook"></i> Sign up via Facebook</a>.
                                        <!-- TODO: the link should be a swig tag: {{ path.pages_fblogin }} but it's not working at the moment-->
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="tabs-panel page-tabs-panel" v-bind:class="{ 'is-active': step2 }">
                        <div class="container">
                            <p>
                                What next? Click on button below to connect with friends, join a town, or update your profile.
                            </p>
                            <div class="clearfix">
                                <div class="medium-4 columns float-left">
                                    <a class="btn btn-lend" href="/home/my-towns/">Find A Town</a>
                                </div>
                                <div class="medium-4 columns float-left">
                                    <a class="btn btn-wanted" href="/home/my-friends/">Find A Friend</a>
                                </div>
                                <div class="medium-4 columns float-left">
                                    <a class="btn btn-borrow">Update Profile</a> <!-- TODO: pass current user to component in order to get to their profile. -->
                                </div>
                            </div>
                        </div>

                        <!--
                            TODO:
                            - complete / test step 3
                            - add options to join town
                            - add options to find friends
                            - add options to fill out profile page.
                        -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'fc-login',
        props: {
            username: { type: String, default: '' },
            email: { type: String, default: '' },
            step1: { type: Boolean, default: false },
            step2: { type: Boolean, default: false }
        }
    }
</script>
