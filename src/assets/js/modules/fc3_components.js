import Vue from 'vue';

/**
 * TODO
 * - fc-modal: allow class to be dynamically passed.
 * - fc-modal and fc-login components could go in common assets module.
 * - workflow should be add component directly to project, then upon @steev's approval move to module
 * if it can be reused.
 * - pass swig data to component via prop
 */

Vue.component('fc-login', {
    template: `
        <form method="POST" id="loginForm" v-pre >
            <input type="hidden" name="crumb" value="{{ crumb }}"/>
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
                        Or <a href="/fb_login"><i class="fa fa-facebook"></i> Login via Facebook</a>.
                        <!-- TODO: the link should be a swig tag: {{ path.pages_fblogin }} but it's not working at the moment-->
                    </p>
                </div>
            </div>
        </form>
    `,
    data() {
        return {

        }
    }
});

Vue.component('fc-modal', {
    template: `
        <div id="fc-modal">
            <button class="btn btn-default" :data-open="getTarget">{{text}}</button>
            <div class="reveal" :id="getTarget" data-reveal>
                <fc-login v-if="this.type == 'login'"></fc-login>
                <div v-else-if="this.type == 'custom'" v-html="content"></div>
                <slot v-pre v-else></slot>
            </div>
        </div>
    `,
    props: {
        text: { default: 'Button' },
        content: { default: '' },
        type: { default: '' }
    },
    data() {
        return {

        };
    },
    computed: {
        getTarget() {
            return `modal-${this._uid}`;
        }
    }
});

Vue.component('fc-signup', {
    template: `
        <div id="signup-wrapper">
            <div class="row collapse">
                <div class="medium-3 columns">
                    <ul id="signup-tabs" data-tabs="" class="tabs vertical page-tabs-nav" role="tablist">
                        <li class="tabs-title is-active" role="presentation"><a href="#panel1v" aria-selected="true" role="tab" aria-controls="panel1v" id="panel1v-label" tabindex="0">Step 1: Registration</a></li>
                        <li class="tabs-title" role="presentation"><a href="#panel2v" role="tab" aria-controls="panel2v" aria-selected="false" id="panel2v-label" tabindex="-1">Step 2: Confirmation</a></li>
                        <li class="tabs-title" role="presentation"><a href="#panel3v" role="tab" aria-controls="panel3v" aria-selected="false" id="panel3v-label" tabindex="-2">Step 3: Connect</a></li>
                    </ul>
                </div>
                <div class="medium-8 columns last">
                    <div data-tabs-content="signup-tabs" class="tabs-content column  vertical page-tabs-panels">
                        <div id="panel1v" class="tabs-panel page-tabs-panel is-active" role="tabpanel" aria-labelledby="panel1v-label">
                            <form method="POST" id="signupForm" v-pre >
                                <input type="hidden" name="crumb" value="{{ crumb }}"/>
                                <div class="container">
                                    <div class="medium-6 columns float-left">
                                        <label>Username
                                            <input type="text" name="user" placeholder="username">
                                        </label>
                                    </div>
                                    <div class="medium-6 columns float-left">
                                        <label>Email
                                            <input type="email" name="email" placeholder="email">
                                        </label>
                                    </div>
                                    <div class="medium-6 cell columns float-left">
                                        <label>Password
                                            <input type="password" name="password" placeholder="password">
                                        </label>
                                    </div>
                                    <div class="medium-6 cell columns float-left">
                                        <label>Confirm Password
                                            <input type="password" name="confpassword" placeholder="confirm password">
                                        </label>
                                    </div>
                                    <!-- captcha here -->
                                    <div class="medium-12 columns align-center-middle ">
                                        <input class="btn btn-default" type="submit" value="Sign Up">
                                            Or <a href="/fb_login"><i class="fa fa-facebook"></i> Login via Facebook</a>.
                                        <!-- TODO: the link should be a swig tag: {{ path.pages_fblogin }} but it's not working at the moment-->
                                    </div>
                                </div>
                            </form>
                            <p>&nbsp;</p>
                        </div>
                        <div id="panel2v" class="tabs-panel page-tabs-panel" role="tabpanel" aria-labelledby="panel2v-label" aria-hidden="true">
                            <form method="POST" id="confirmationStep" v-pre>
                                <p>
                                    Thank you for registering. <br/>
                                    To complete the registration process please check your email for verification.
                                </p>
                                <div class="medium-6 columns float-left">
                                    <label>Additonal Info Stub 1
                                        <input type="text" name="adi1" placeholder="adi1">
                                    </label>
                                </div><div class="medium-6 columns float-left">
                                    <label>Additonal Info Stub 2
                                        <input type="text" name="adi2" placeholder="adi2">
                                    </label>
                                </div><div class="medium-6 columns float-left">
                                    <label>Additonal Info Stub 3
                                        <input type="text" name="adi2" placeholder="adi3">
                                    </label>
                                </div>
                            </form>
                            <p>&nbsp;</p>
                        </div>
                        <div id="panel3v" class="tabs-panel page-tabs-panel" role="tabpanel" aria-labelledby="panel3v-label" aria-hidden="true">
                            <p>
                                In Progress ...
                            </p>
                            <!--
                                TODO: 
                                - complete / test step 3
                                - add options to join group
                                - add options to find friends
                                - add options to fill out profile page.
                            -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {

    },
    data() {
        return {

        }
    }
});