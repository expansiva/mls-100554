/// <mls shortName="collabMessagesPt" project="100554" enhancement="_blank" />

const defaultMessages = {
  languageLabel: 'Linguagens',
  alterarLabel: 'Alterar',
  formatDate: (date: Date) => formatDate(date),
  formatCurrency: (amount: number) => formatCurrency(amount),
  todayIs: (date: Date) => `Hoje é ${formatDate(date)}`,
  updateChanges: 'Atualizar alterações',
  comments: 'Comentário',
  update: 'Atualizar',
  fileChanges: 'Aquivos alterados',
  itemsToSave: (tot: number) => tot <= 0 ? 'Não há itens para salvar' : `${tot} itens para salvar`,
};

// Verifica se window.messages já existe; se não, define-o com defaultMessages.
if (!(window as any).messages) {
  (window as any).messages = defaultMessages;
}

export function setLanguage() {
  (window as any).messages = defaultMessages;
}

export const messages = (): typeof defaultMessages => { return (window as any).messages; }

// Exportamos window.messages, permitindo que ele seja de um tipo flexível.
//export const messages: typeof defaultMessages = (window as any).messages;

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });;
}

