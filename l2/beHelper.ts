/// <mls shortName="beHelper" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { DatabaseClient, ReadDriver, EntityReadAction, IFieldTable, ITypeFieldDB } from "./_100554_beDatabaseBase";

export function prismaToFieldTable(prisma: string): IFieldTable[] {
  const lines = prisma.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("model") && !l.startsWith("}"));
  return lines.map(line => {
    const [field, type, ...rest] = line.split(" ");
    const isPrimary = rest.includes("@id");
    const isAuto = rest.includes("@default(autoincrement())");
    const mapType = type === "Int" || type === "Float" ? "NUMBER" :
                    type === "String" ? "STRING" :
                    type === "DateTime" ? "DATE" : "OBJECT";
    return {
      field,
      tp: mapType as ITypeFieldDB,
      primaryKey: isPrimary,
      autoIncrement: isAuto
    };
  });
}