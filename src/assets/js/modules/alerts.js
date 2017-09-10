export class AlertItem {
  constructor(id) {
    this.$openAlert = $(`.alerts_existing[data-alert-id=${id}] .alert_title .alert_result`);
    
    this.$openAlert.on('click', (event)=> {
      event.preventDefault();
      this.showResult(id);
    });
  }
  
  showResult = (id) => {
    $(`.alert_result[data-result-id=${id}]`).toggle();
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
});