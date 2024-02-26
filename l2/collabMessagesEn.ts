/// <mls shortName="collabMessagesEn" project="100554" enhancement="_blank" />

const defaultMessages = {
  formatDate: (date: Date) => formatDate(date),
  formatCurrency: (amount: number) => formatCurrency(amount),
  todayIs: (date: Date) => `Today is ${formatDate(date)}`,
  updateChanges: 'Update Changes',
  comments: 'Comments',
  update: 'Update',
  fileChanges: 'File Changes',
  itemsToSave: (tot: number) => tot <= 0 ? 'No items to save' : `${tot} items to save`
};

// Verifica se window.messages já existe; se não, define-o com defaultMessages.
if (!(window as any).messages) {
  (window as any).messages = defaultMessages;
}

// Exportamos window.messages, permitindo que ele seja de um tipo flexível.
export const messages: typeof defaultMessages = (window as any).messages;

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US");
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}





