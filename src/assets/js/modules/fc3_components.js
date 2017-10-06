import Vue from 'vue';

/**
 * TODO
 * - fc-modal: allow class to be dynamically passed.
 * - fc-modal and fc-login components could go in common assets module.
 * - workflow should be add component directly to project, then upon @steev's approval move to module
 * if it can be reused.
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

