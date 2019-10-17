import Moment from "moment";

const topicTitle = ({ topic }) => {

  const byType = {
    post: ({ post }) => post.subject,
    friend: ({ user }) => user.username,
    group: ({ group }) => group.name,
    system: () => 'Info', // where does this show up, anyway? anywhere?
    default: () => ''
  };

  const makeTitle = byType[topic.type] || byType.default;

  return makeTitle(topic);
};

const postGroup = ({ topic }) => {
  const post = topic.post;
  const found = connections.groups.find( (group) => {
    return group.id === post.group_id;
  });
  return !!found ? found.name : ` group #${post.group_id}`;
};

const postItemConfig = {
  props: ['item', 'path', 'index', 'viewer', 'isMember', 'route', 'blockedUsers'],
  data() {
    return {
      post: this.item,
    }
  },
  computed: {
    postType() {
      return this.post.type.name;    // translate this? not here. up a level, i guess.
    },
    closedType() {

      switch (this.postType) {
        case 'OFFER':
          return 'Taken';
        case 'WANTED':
        case 'BORROW':
          return 'Received';
      }

      return null;
    },
    markMessage() {
      return 'Mark As ' + this.closedType;
    },
    replyButton() {

      const text = this.t('Reply');
      return `<button class="btn-${this.lowercase(this.postType)}">${text}</button>`;
    },
    lent() {

      return this.post.share && !this.post.share.returnDate
    },
    due() {

      return this.post.share.dueDate && Moment(this.post.share.dueDate).format('M-D-YYYY');
    },
    overdue() {

      const { dueDate } = this.post.share;

      if (!this.lent || !dueDate) {
        return false;
      }

      const normalize = (moment) => moment.utc().startOf('day').toDate().getTime();
      const due = normalize(Moment(dueDate, 'YYYY-MM-DD'));
      const now = normalize(Moment());

      return due < now;
    },
    timezone() {
      console.log(this.$root.userLocation);
      return this.$root.userLocation.timezone ? this.$root.userLocation.timezone : 'Australia/Sydney';
    }
  },
  methods: {
    lowercase(string) {
      return string.toLowerCase();
    },
    manageOp: function (event) {

      const self = this;
      const operation = event.currentTarget.value;
      const { protocol, host } = window.location;
      const layout = window.$(event.currentTarget).hasClass('post-grid-select') ? 'grid' : 'list';

      const displayError = (message) => {
        const errorBlock = document.createElement('p');
        const errormsg = document.createTextNode(message);
        const error = window.$(errorBlock).append(errormsg).addClass('callout alert');
        window.$(`.post-${layout}-item:eq(${self.index})`).find(`.post-${layout}-item-content`).prepend(error);
      };

      const clearErrors = () => {
          window.$(`.post-${layout}-item:eq(${self.index})`)
            .find(`.post-${layout}-item-content .alert`)
            .remove();
      }

      // Remove any error blocks when kicking off a new operation (prevents duplicate messages displayed)
      clearErrors();

      switch (operation) {
        case 'edit':
          const url = `${protocol}//${host}${self.path.home_post_edit}${self.post.id}`;
          window.location.assign(url);
          break;
        case 'delete':
          window.$.ajax({
            method: 'DELETE',
            url: `/api/posts/${self.post.id}`
          })
          .done((data, status) => {
            self.$emit('post-deleted');
          })
          .fail(() => displayError(self.t("We couldn't delete your post at this time. Sorry!")));   // TODO: will this work?
          break;
        case 'replies':
          window.$.get(`/api/messaging/topics/post/${this.post.id}`)
          .done((data, status) => {
            const myReplies = `${protocol}//${host}/home/my-replies?type=post&id=${this.post.id}`;
            window.location.assign(myReplies);
          })
          .fail(() => displayError(self.t('There are no replies for that post yet!')));
          break;
        case 'mark':
          window.$.post(`/api/posts/${self.post.id}/mark`, { newType: self.closedType })
          .done((data, status) => {
            self.$emit('post-marked', { type: data, post: self.post });
          })
          .fail(() => displayError(self.t("We couldn't mark your post at this time. Sorry!")));
          break;
        case 'lend':
          $(`#friend-select-trigger-${self.post.id}`).click(); // Open friend select form, fires onClickModalTrigger
          break;
        case 'return':
          $.post(`/api/posts/${self.post.id}/return`)
          .done((data, status) => {
            self.$emit('post-returned', { post: self.post });
          })
          .fail(() => displayError(self.t('Marking your post as returned failed at this time. We apologize for the inconvenience!')));
          break;
      }

      // Finally, reset the manage post dropdown
      event.currentTarget.selectedIndex = 0;
    },
    onClickModalTrigger() {
      this.$bus.$emit('friend-select:trigger', { post: this.post });
    }
  }
};

export { topicTitle, postGroup, postItemConfig };
