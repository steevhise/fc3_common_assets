/**
* Note: this file is provided by the fc3_common_assets package
 */
export class AlertItem {
  constructor(id) {
    this.$deleteAlert = $(`.alerts_existing[data-alert-id=${id}] .alert_close`);
    this.$openAlert = $(`.alerts_existing[data-alert-id=${id}] .alert_result-count`);

    this.$deleteAlert.on('click', (e) => {
      this.deleteSelected(id);
    });

    this.$openAlert.on('click', (e) => {
      this.showResult(id);
    });
  }

  showResult = (id) => {
    $(`.alert_result[data-result-id=${id}]`).toggle();
    $(`.alerts_existing[data-alert-id=${id}] .message-arrow`).toggleClass('open');
  };

  deleteSelected = (id) => {
    // TODO: placeholder for delete functionality
  }
}

export class AlertItems {
  constructor(selector) {
    this.items = $(selector).map((idx, val) => {
      let item = $(val);
      return new AlertItem(item.attr('data-alert-id'))
    });
  }
}

document.addEventListener("DOMContentLoaded", ()=> {
  const alertItems = new AlertItems(".alerts_existing");

  $(".delete-alert-cancel").on('click', (e) => {

    const modalId = $(e.currentTarget).parents(".reveal").attr("id");
    $(`#${modalId}-close`).click();
  });
});
