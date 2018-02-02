<template>
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
                            <div class="container">
                                <form method="POST" id="signupForm" v-pre >
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
                            </div>
                            
                        </div>
                        <div id="panel2v" class="tabs-panel page-tabs-panel" role="tabpanel" aria-labelledby="panel2v-label" aria-hidden="true">
                            <div class="container">
                                <form method="POST" id="confirmationStep" v-pre>
                                    <p>
                                        Thank you for registering. <br/>
                                        To complete the registration process please check your email for verification.
                                    </p>
                                    <div class="medium-6 columns float-left">
                                        <label>Additonal Info Stub 1
                                            <input type="text" name="adi1" placeholder="adi1">
                                        </label>
                                    </div>
                                    <div class="medium-6 columns float-left">
                                        <label>Additonal Info Stub 2
                                            <input type="text" name="adi2" placeholder="adi2">
                                        </label>
                                    </div>
                                    <div class="medium-6 columns float-left">
                                        <label>Additonal Info Stub 3
                                            <input type="text" name="adi2" placeholder="adi3">
                                        </label>
                                    </div>
                                </form>
                            </div>
                            
                        </div>
                        <div id="panel3v" class="tabs-panel page-tabs-panel" role="tabpanel" aria-labelledby="panel3v-label" aria-hidden="true">
                            <div class="container">
                                <p>
                                    What next? Click on button below to connect with friends, join a town, or update your profile.
                                </p>
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
		name: 'fc-signup',
		data() {
			return {

			}
		}
	}
</script>