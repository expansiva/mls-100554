/// <mls shortName="collabMessagesBase" project="100554" enhancement="_blank" />
				
export abstract class CollabMessagesBase {

  abstract collab_messages: ITranslations;
  abstract formatDate(date: Date): string
  abstract formatCurrency(amount: number): string

}

export interface ITranslations {
  formatDate: (date: Date) => string,
  formatCurrency: (amount: number) => string,
  todayIs: (date: Date) => string,
  itemsToSave: (tot: number) => string,
  updateChanges: string,
  comments: string,
  update: string,
  fileChanges:string
}