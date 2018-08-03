<!--Note: this file is provided by the fc3_common_assets package */-->
<template>
    <form method="POST" action="/api/friend" @submit.prevent="handleSubmit($event)">
        <div class="columns">
            <div v-for="friend in friendsList" :key="friend.id" class="column large-5">
                <div class="column">
                    <input type="checkbox" name="ids" :value="friend.id"/>
                    <label v-if="friend.facebookUsername"><strong>Facebook username:</strong>{{ friend.facebookUsername }}</label>
                </div>
            <a class="friend-card columns" :data-friend-id="friend.id" :href="`/member/${ friend.username }`">
                <div class="friend-card-inner">
                    <div class="friend-card-avatar">
                        <img :src="friend.image"/>
                    </div>
                    <div class="friend-card-name">
                        <h4 class="friend-card-real-name">{{ friend.firstName }} {{ friend.lastName }}</h4>
                        <h5 class="friend-card-user-name">{{ friend.username }}</h5>
                        <h5 class="thumbsup">
                            <fc-icon name="like" />
                            {{ friend.info.reputation || 0 }} thumbs up
                            <span v-if="friend.info.verified">
                                <i class="icon fa fa-check" style="color: #34b233; font-size: 16px;" ></i>
                                Verified
                            </span>
                        </h5>
                    </div>
                </div>
            </a>
            </div>
        </div>
        <div class="row">
            <button class="btn btn-default" type="submit">Send Friend Requests</button>
        </div>
    </form>
</template>

<script>
    export default {
        name : 'fc-facebook-friends',
        props: {
            /*
            facebook friends — users who are Facebook friends with current user, Freecycle users who
            have connected Facebook to their FC accounts and granted the Facebook user_friends permission,
            and are NOT friends with current user on Freecycle
            */
            facebookFriends: Array
        },
        data() {
            return {
                friendsList: this.facebookFriends
            }
        },
        methods: {
            handleSubmit(event) {

                const self = this;
                const ids = new FormData(this.$el).getAll('ids');

                $.post(this.$el.action, $(this.$el).serialize()).done(function(data) {

                    self.$bus.$emit('alert', { level : 'success', message : data.message || data });
                    event.target.reset();
                    // Remove friended users from display
                    self.friendsList = self.friendsList.filter((f) => ids.includes(f.id));
                }).fail(function(error) {

                    self.$bus.$emit('alert', { level : 'alert', message : error.responseText ? `${error.responseText}` : `${error.status} \n ${error.statusText}` });
                })
            }
        }
    }
</script>
