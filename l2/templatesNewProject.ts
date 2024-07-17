/// <mls shortName="templatesNewProject" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export const template_tsconfig = {
    ext: '.json',
    template: `
    {
        "compilerOptions": {
            "target": "es2020", // Define a versão do ECMAScript de saída
            "module": "ES2020",
            "esModuleInterop": true, // Habilita a interoperabilidade com módulos ES
            "outDir": "./preBuild/l2", // Define o diretório de saída para os arquivos compilados
            "rootDir": "./prel2", // Define o diretório raiz dos arquivos de entrada
            "strict": true, // Ativa todas as verificações de tipo estritas
            "removeComments": false,
            "noUnusedParameters": false,
            "skipLibCheck": false, // Ignora a verificação de tipo de arquivos de declaração
            "forceConsistentCasingInFileNames": true, // Impede diferenças de maiúsculas/minúsculas nos nomes dos arquivos
            "sourceMap": false, // Gera arquivos de mapeamento de origem (.map)
            "declaration": false, // Desabilita a geração de arquivos .d.ts
            "experimentalDecorators": true, // Habilita suporte a decoradores
            "emitDecoratorMetadata": false, // Emite metadados de decorador (opcional, mas útil para alguns frameworks)
            "noImplicitAny": false,
            "strictNullChecks": false,
            "paths": [paths],
            "lib": [
                "dom",
                "ES2022"
            ]
        },
        "include": [
            "prel2/**/*", // Inclui todos os arquivos TypeScript no diretório l2
            "monaco.d.ts",
            "mls.d.ts"
        ],
        "exclude": [
            "node_modules", // Exclui a pasta node_modules
            "**/*.spec.ts", // Exclui arquivos de teste
            "l2/*.ts" // Exclui arquivos de teste
        ]
    }
    `
}

export const template_package = {
    ext: '.json',
    template: `
    {
        "name": "[project]",
        "version": "1.0.0",
        "description": "",
        "scripts": {
            "test": "echo \\"Error: no test specified\\" && exit 1",
            "buildCI": "node -e \\"require('mls-ci').runCI()\\""
        },
        "author": "",
        "license": "ISC",
        "dependencies": {
            "adm-zip": "^0.5.14",
            "mls-ci": "git+https://github.com/expansiva/mls-ci.git",
            "node-fetch": "^2.7.0",
            "typescript": "^5.5.3"
        }
    }
    `
}


export const template_build = {
    ext: '.yml',
    template: `
    name: Build TypeScript

    on:
    push:
        branches:
        - main  # ou a branch que você deseja monitorar
    pull_request:
        branches:
        - main  # ou a branch que você deseja monitorar

    jobs:
    build:
        runs-on: ubuntu-latest

        steps:
        - name: Checkout repository
        uses: actions/checkout@v4

        - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
            node-version: '14'  # ou a versão do Node.js que você está usando

        - name: Install dependencies
        run: npm install

        - name: Compile CI
        run: npm run buildCI

        - name: Commit compiled files
        run: |
            git config --global user.name 'github-actions[bot]'
            git config --global user.email 'github-actions[bot]@users.noreply.github.com'
            git add obj
            git commit -m "Compile TypeScript files"
        env:
            GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

        - name: Push changes
        run: git push
        env:
            GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

    `
}