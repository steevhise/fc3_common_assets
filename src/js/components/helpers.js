const topicTitle = ({ topic }) => {

  const byType = {
    post: ({ post }) => post.subject,
    friend: ({ user }) => user.username,
    group: ({ group }) => group.name,
    system: () => 'Info', // TODO what is a proper title for system messages?
    default: () => ''
  };

  const makeTitle = byType[topic.type] || byType.default;

  return makeTitle(topic);
};

const postItemConfig = {
  props: ['item', 'path', 'index', 'viewer'],
  data() {
    return {
      post: this.item
    }
  },
  computed: {
    postType() {
      return this.post.type.name;
    },
    closedType() {

      switch (this.postType) {
        case 'OFFER':
          return 'TAKEN';
        case 'WANTED':
        case 'BORROW':
          return 'RECEIVED';
      }

      return null;//`${this.postType[0].toUpperCase()}${this.postType.slice(1)}`;
    },
    replyButton() {
      return `<button class="btn-${this.lowercase(this.postType)}">Reply</button>`;
    }
  },
  methods: {
    lowercase(string) {
      return string.toLowerCase();
    },
    manageOp: function (event) {

      const instance = this;
      const operation = event.currentTarget.value;
      const { protocol, host } = window.location;
      const layout = window.$(event.currentTarget).hasClass('post-grid-select') ? 'grid' : 'list';

      switch (operation) {
        case 'edit':
          const url = `${protocol}//${host}${instance.path.home_post_edit}${instance.post.id}`;
          window.location.assign(url);
          break;
        case 'delete':
          window.$.ajax({
            method: 'DELETE',
            url: `/api/posts/${instance.post.id}`
          })
          .done((data, status) => {
            instance.$emit('post-deleted');
          })
          .fail(() => {
            const errorBlock = document.createElement('p');
            const errormsg = document.createTextNode('We couldn\'t delete your post at this time. Sorry!');
            const error = window.$(errorBlock).append(errormsg).addClass('callout alert');
            window.$(`.post-${layout}-item:eq(${instance.index})`).find(`.post-${layout}-item-content`).prepend(error);
          });
          break;
        case 'replies':
          const myReplies = `${protocol}//${host}/home/my-replies?type=post&id=${this.post.id}`;
          window.location.assign(myReplies);
          break;
        case 'mark':
          window.$.post(`/api/posts/${instance.post.id}/mark`, { newType: instance.closedType })
          .done((data, status) => {
            instance.$emit('post-marked', { type: data, post: instance.post });
          })
          .fail(() => {
            const errorBlock = document.createElement('p');
            const errormsg = document.createTextNode('We couldn\'t mark your post at this time. Sorry!');
            const error = window.$(errorBlock).append(errormsg).addClass('callout alert');
            window.$(`.post-${layout}-item:eq(${instance.index})`).find(`.post-${layout}-item-content`).prepend(error);
          });
          break;
      }
    }
  }
};

export { topicTitle, postItemConfig };
