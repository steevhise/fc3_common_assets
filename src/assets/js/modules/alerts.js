export class AlertItem {
  constructor(id) {
    this.$alertItem = $(`.alerts_existing[data-alert-id=${id}]`);
    this.$alertItem.on('click', ()=> this.logIt(id));
  }
  
  logIt = (id) => {
    console.log('alerts.js placeholder action', id);    
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