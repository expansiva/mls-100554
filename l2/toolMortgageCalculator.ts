/// <mls shortName="toolMortgageCalculator" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { ITool, svg_tool } from '/_100554_/l2/aiAgentBase.js';

const toolName = "toolMortgageCalculator";

export function createTool(): ITool {
    return {
        toolName, 
        tool_url: svg_tool,
        description: "Calcula a parcela mensal de um financiamento imobiliário usando a Tabela Price com juros anuais fixos de 13%",
        argsSchema: {
            valorImovel: { type: "number", description: "Valor total do imóvel" },
            entrada: { type: "number", description: "Valor da entrada paga" },
            prazoMeses: { type: "number", description: "Número total de parcelas mensais" },
            taxaAdministrativa: { type: "number", description: "Taxa administrativa mensal (opcional)", optional: true },
            taxaAnual: { type: "number", description: "Taxa anual em porcentagem (opcional)", optional: true }
        },

        async execute(args: any): Promise<string> {
            const { valorImovel, entrada, prazoMeses, taxaAdministrativa = 0, taxaAnual = 13 } = args;

            if (typeof valorImovel !== 'number' || typeof entrada !== 'number' || typeof prazoMeses !== 'number') {
                throw new Error("Parâmetros inválidos.");
            }

            const valorFinanciado = valorImovel - entrada;
            if (valorFinanciado <= 0) {
                return ("Erro, O valor financiado deve ser maior que zero.");
            }

            const taxaJurosMensal = taxaAnual * 0.001 / 12; // defalt 13% ao ano
            const parcela = (valorFinanciado * taxaJurosMensal) / (1 - Math.pow(1 + taxaJurosMensal, -prazoMeses));
            const parcelaTotal = parcela + taxaAdministrativa;

            return `A parcela mensal é de R$ ${parcelaTotal.toFixed(2)}. `;
        }
    };
}