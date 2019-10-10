<template>
    <div v-if="isVisible" :id="`form-results-${this.customAlertEl}`" data-closable="slide-out-right">
        <h5 v-if="header">{{header}}</h5>
        <div class="form-results friends-cards item-grid-view" v-masonry transition-duration="0.3s" item-selector=".friend-card" ref="post_gridview">
            <div class="friend-card" v-for="user in results" v-bind:key="user.id" :data-friend-id="user.id">
                <div class="friend-card-container">
                    <a :href="`/member/${user.username}`">
                        <div class="friend-card-inner">
                            <div class="friend-card-avatar">
                                <img :alt="t(`user image for ${user.username}`)" :src="user.image"/>
                            </div>
                            <div class="friend-card-name">
                                <h4 v-if="user.firstName && user.lastName" class="friend-card-real-name">{{ user.firstName }} {{ user.lastName }}</h4>
                                <h5 class="friend-card-user-name">{{ user.username }}</h5>
                                <h5 v-if="user.info">
                                    {{ user.info.about }}
                                </h5>

                                <div v-if="user.group_memberships && user.homeGroup" v-for="parentGroup in user.group_memberships" v-bind:key="parentGroup.group_id">
                                    <p v-if="parentGroup.group && parentGroup.group_id === user.homeGroup">
                                                {{ parentGroup.group.group_name }}, {{ parentGroup.group.region.region_name }}<br />
                                                {{ parentGroup.group.region.country.country_name }}
                                    </p>
                                </div>

                                <h5 v-if="user.info && user.info.signup_date" class="thumbsup">
                                    {{ t('Became Member') }} {{ user.info.signup_date | mreldate }}
                                </h5>

                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
  export default {
    name: "fc-user-search-results",
    props: {
      customAlertEl: {
        // takes the unique id of the element listening for form results; prevents multiple forms on same page reacting to each other's success events
        type: [Number,String]
      }
    },
    data() {
      return {
        isVisible: false,
        results: [],
        header: null
      }
    },
    created() {

      const self = this;

      if (self.customAlertEl) {
        // handle event for legacy bus events.
        this.$bus.$on(`formSuccess-${self.customAlertEl}`, (data) => {
          this.init(data.data.users);
        });
      }
    },
    methods: {
      init(data) {
        this.results = [];
        Object.assign(this.results, data);
        this.isVisible = true;
        this.header = this.$parent.t('Found:') + ' ' + this.results.length;    // t('Found:')   // dumb parser.

        // console.warn('form results initialized!', this.results);
      }
    }
  }
</script>

<style scoped>
    .form-results {
        font-size: 12pt;
        max-height: 20em;
        overflow: auto;

    }

    .friend-card {
        width: 100%;
    }
    @media screen and (min-width: 40em) {
        .friend-card { width: 33.333337%; }
    }
    @media screen and (min-width: 64em) {
        .friend-card { width: 20%; }
    }
</style>