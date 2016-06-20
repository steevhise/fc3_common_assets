export class ReplyItem {
  constructor(id) {
    this.$replyItem = $(`.message-reply-list-item[data-message-id=${id}]`);
    this.$replyItemDetails = $(`.message-list-item-details[data-message-id=${id}]`);

    this.state = {
      detailsOpen: false
    };

    //handlers
    this.$replyItem.on('click', this.onReplyItemClick);

    //reconcile the initial view state
    this.setState(this.state);
  }

  /**
   * Update the view with the new state
   * @param newState
   */
  setState(newState, cb) {
    requestAnimationFrame(()=> {
      this.state = Object.assign({}, this.state, newState);
      this.reconcileView();
      if (cb) {
        cb();
      }
    });
  }

  onReplyItemClick = () => {
    this.setState({ detailsOpen: !this.state.detailsOpen });
  };

  reconcileView = () => {
    const { $replyItem, $replyItemDetails } = this;
    const { detailsOpen } = this.state;

    // toggle the open class
    $replyItemDetails.toggleClass('open', detailsOpen);
    $replyItem.toggleClass('open', detailsOpen);
  }
}

export class ReplyItems {
  constructor(selector) {
    this.items = $(selector).map((idx, val) => {
      let item = $(val);
      return new ReplyItem(item.attr('data-message-id'))
    })
  }

}

// setup
document.addEventListener("DOMContentLoaded", ()=> {
  const replyItems = new ReplyItems(".message-reply-list-item");
});
