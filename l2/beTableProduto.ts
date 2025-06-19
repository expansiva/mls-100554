/// <mls shortName="beTableProduto" project="100554" enhancement="_blank" groupName="other" />

import { BEIndexedDBBase } from "./_100554_beIndexedDBBase";
import { EntitiesState, EntityState, ActionRead, ActionAdd, 
ActionUpdate, ActionDelete, ActionRedo, ActionUndo, Actions } from "./_100554_beTableState"
import { IProviderBase } from "./_100554_beProviderBase";
import { TableDriverBase } from "./_100554_beTableBase";

// Row type for Produto
export interface ProdutoModel {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    imagem: string;
    categoria: string;
}

export type ProdutoState = EntityState<ProdutoModel>;
export type ProdutosState = EntitiesState<ProdutoModel>;

export const modelPrisma = `
  model Produto {
    id Int @id @default(autoincrement())
    nome String
    descricao String
    preco Float
    imagem String
    categoria String
  }
`;

class ProdutoDriver extends TableDriverBase<ProdutoModel, ProdutoState, Actions<ProdutoModel>> {
  protected entityKey = "produtos";
  protected dbName = "collab";
  protected tableName = "produtos";
  protected modelPrisma = modelPrisma;

}

export const factoryProdutoDriver = (provider: IProviderBase<ProdutoModel>): void => {
    const instance = new ProdutoDriver(provider);
    instance.subscribe();
}
