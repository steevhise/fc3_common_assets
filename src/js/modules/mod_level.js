/**
 * Note: this file is provided by the fc3_common_assets package
 */
import $ from "jquery";
import ItemList from './item_list';

class ModLevel {

  constructor( container ) {
    //get a reference to our main container
    this.$container = $(container);
    if (!this.$container || !this.$container.length) {
      ;
    }

  }

  displayError(message) {
    const errorBlock = document.createElement('p');
    const errormsg = document.createTextNode(message);
    const error = window.$(errorBlock).append(errormsg).addClass('callout alert');
    window.$(`.post-${layout}-item:eq(${self.index})`).find(`.post-${layout}-item-content`).prepend(error);
  };

  manageModLevel() {

    $.post(`/api/posts/group/modlevel`, { level: self.level.value, group: self.group.value })
      .done((data, status) => {
        self.$emit('post-marked', { type: data, post: self.post });
      })
      .fail(() => this.displayError(self.t("We couldn't change your moderator level at this time. Sorry!")));

  }

}




// setup
document.addEventListener("DOMContentLoaded", ()=> {
  const list = new ItemList(".item-list");
});


// export the list
export default ItemList;