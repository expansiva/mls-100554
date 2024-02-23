/// <mls shortName="collabMessagesEn" project="100554" enhancement="_blank" />

import { CollabMessagesBase, ITranslations } from './_100554_collabMessagesBase';

export function getInstance():CollabMessagesBase {
  return new CollabMessagesEn();
}

class CollabMessagesEn extends CollabMessagesBase {

  public collab_messages: ITranslations = {
    formatDate: (date: Date) => this.formatDate(date),
    formatCurrency: (amount: number) => this.formatCurrency(amount),
    todayIs: (date: Date) => `Today is ${this.formatDate(date)}`,
    updateChanges: 'Update Changes',
    comments: 'Comments',
    update: 'Update',
    fileChanges: 'File Changes',
    itemsToSave: (tot: number) => tot <= 0 ? 'No items to save' : `${tot} items to save`

  };

  public formatDate(date: Date): string {
    return date.toLocaleDateString("en-US");
  }

  public formatCurrency(amount: number): string {
    return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });;
  }

}




