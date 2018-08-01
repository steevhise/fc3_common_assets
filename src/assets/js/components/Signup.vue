<template>
	<div id="signup-wrapper">
        <div class="row collapse">
            <div>
                <div class="tabs-content vertical page-tabs-panels">
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
                                    <div class="medium-12 columns align-center-middle ">
                                        <p>By clicking "Sign Up" you agree to our <a href="/pages/tos">Terms of Service</a> and our <a href="/pages/about/privacy">Privacy Policy</a>.</p>
                                    </div>
                                    <div class="medium-12 columns align-center-middle ">

                                        <input class="btn btn-default" type="submit" value="Sign Up">
										<fc-modal type="custom" custom-trigger='<button type="button" class="btn-fb"><i class="fa fa-facebook"></i> Sign up via Facebook.</button>'>
                                            <form id="fb-tos" method="GET" action="/fb-signup">
                                                <div>
                                                    <label>Username</label>
                                                    <input type="text" name="username" placeholder="Username" required />
                                                </div>
                                                <div>
                                                    <p>By clicking "Sign Up" you agree to our <a href="/pages/tos">Terms of Service</a> and our <a href="/pages/about/privacy">Privacy Policy</a>.</p>
                                                </div>
                                                <div>
                                                    <button class="btn-fb" type="submit"><i class="fa fa-facebook"></i>Sign Up with Facebook</button>
                                                </div>
                                            </form>
                                        </fc-modal>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="tabs-panel page-tabs-panel" v-bind:class="{ 'is-active': step2 }">
                        <div class="container">
                            <p>
                                <strong>
                                    Congratulations! You're now a member of the largest re-use community on the planet!
                                    Now let's get started. To view items being gifted or post an item yourself, you will need
                                    to join a local Town group.
                                </strong>
                            </p>
                            <div style="margin: 2rem 0;">
                                <a class="btn btn-lend" href="/find-towns">Find A Town</a>
                            </div>
                            <div style="margin-top: 6rem; font-style: italic;">
                                Never mind, just take me to my
                                <a class="btn btn-subtle right" href="/home/dashboard"
                                    data-tooltip tabindex="1" title="Are you sure? You must join a town before you can reply to any posts">
                                    Dashboard
                                </a>
                            </div>
                        </div>
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
