/// <mls shortName="beStatesBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { DatabaseClient, ReadDriver, EntityReadAction, IFieldTable, ITypeFieldDB } from "./_100554_beDatabaseBase";
import { BEProdutoDriver } from "./_100554_beProdutoDriver";
import { getCollabStateInstance } from "./_100554_collabState";

export abstract class EntityWithReadAction<TFilter, TItem> {
  private state = getCollabStateInstance(); // use singleton
  entityKey: string;
  readDriver: ReadDriver<TItem>;

  constructor(entityKey: string, readDriver: ReadDriver<TItem>) {
    this.entityKey = entityKey;
    this.readDriver = readDriver;
    this.state.subscribe(this.actionKey, this.onAction);
  }

  get actionKey() {
    return `db.${this.entityKey}.action`;
  }

  get dataKey() {
    return `db.${this.entityKey}`;
  }

  onAction = async () => {
    const action = this.state.getState(this.actionKey) as EntityReadAction<TFilter>;
    console.log('on Action', this.actionKey, action)
    if (!action || action.command !== "read") return;

    const result = await this.readDriver.read(action);
    this.state.setState(this.dataKey, result);
  };
}