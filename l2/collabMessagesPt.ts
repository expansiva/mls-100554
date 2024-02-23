/// <mls shortName="collabMessagesPt" project="100554" enhancement="_blank" />
				
import { CollabMessagesBase, ITranslations } from './_100554_collabMessagesBase';

export function getInstance():CollabMessagesBase {
  return new CollabMessagesPt();
}

class CollabMessagesPt extends CollabMessagesBase {

  public collab_messages: ITranslations = {
    formatDate: (date: Date) => this.formatDate(date),
    formatCurrency: (amount: number) => this.formatCurrency(amount),
    todayIs: (date: Date) => `Hoje é ${this.formatDate(date)}`,
    updateChanges: 'Atualizar alterações',
    comments: 'Comentário',
    update: 'Atualizar',
    fileChanges: 'Aquivos alterados',
    itemsToSave: (tot: number) => tot <= 0 ? 'Não há itens para salvar' : `${tot} itens para salvar`

  };

  public formatDate(date: Date): string {
    return date.toLocaleDateString("pt-BR");
  }

  public formatCurrency(amount: number): string {
    return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });;
  }

}
