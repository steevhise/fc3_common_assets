export class AlertItem {
  constructor(id) {
    this.$alertItem = $(`.alerts_existing[data-alert-id=${id}]`);
    
  }
}