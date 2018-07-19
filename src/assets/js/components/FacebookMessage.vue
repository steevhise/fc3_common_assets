<template>
    <div class="column">
        <!-- On desktop, send with https://developers.facebook.com/docs/sharing/reference/send-dialog (which doesn't work on mobile devices)-->
        <div v-if="!onMobile">
            <h4>Invite from Facebook</h4>
            <button class="btn-fb" @click="openDesktopMessenger()">Invite Facebook Friends to Freecycle</button>
        </div>
        <!-- On mobile devices, send with https://developers.facebook.com/docs/sharing/messenger/web -->
        <div v-else style="margin-top: 1rem;">
            <a class="btn-fb" @click.prevent="openMobileMessenger()" >Send in Messenger</a>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'fc-facebook-message',
        props: {
            facebookAppId: Number,
            shareLink: String
        },
        data() {

            return {};
        },
        created() {
            //https://developers.facebook.com/docs/javascript/quickstart/

            window.fbAsyncInit = () => {
                const { facebookAppId } = this;
                FB.init({
                  appId            : facebookAppId,
                  xfbml            : true,
                  version          : 'v3.0'
                });
            };

            (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

        },
        computed: {
            // Follows the Mobile OS detection recommendation here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
            // To toggle the FB messenger linking mechanism
            // WARNING Likely very fragile
            onMobile: () => RegExp('Mobi').test(navigator.userAgent)
        },
        methods: {
            openDesktopMessenger() {

                const { shareLink } = this;
                // WARNING send dialog fails in local dev b/c FB can't crawl localhost
                // To test, replace with a dummy, public HTML page using the same Open Graph tags as the page you want to share
                return FB.ui({ method: 'send', link: shareLink });
            },
            openMobileMessenger() {

                if (window.confirm('You must have the Facebook Messenger app installed to invite your Freecycle friends to Facebook. Otherwise, this link won\'t work')) {
                  window.location =  `fb-messenger://share/?link=${encodeURIComponent(this.shareLink)}&app_id=${this.facebookAppId}`;
                }
            }
        }
    }
</script>
