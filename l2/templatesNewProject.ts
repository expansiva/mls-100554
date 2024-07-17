/// <mls shortName="templatesNewProject" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export const template_tsconfig = {
    ext: '.json',
    template: `
    {
        "compilerOptions": {
            "target": "es2020",
            "module": "ES2020",
            "esModuleInterop": true,
            "outDir": "./preBuild/l2",
            "rootDir": "./prel2",
            "strict": true,
            "removeComments": false,
            "noUnusedParameters": false,
            "skipLibCheck": false,
            "forceConsistentCasingInFileNames": true,
            "sourceMap": false,
            "declaration": false,
            "experimentalDecorators": true,
            "emitDecoratorMetadata": false,
            "noImplicitAny": false,
            "strictNullChecks": false,
            "paths": [paths],
            "lib": [
                "dom",
                "ES2022"
            ]
        },
        "include": [
            "prel2/**/*",
            "monaco.d.ts",
            "mls.d.ts"
        ],
        "exclude": [
            "node_modules",
            "**/*.spec.ts",
            "l2/*.ts"
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