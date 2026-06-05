# Gestão Financeira (Money)

## O que é

É um aplicativo de gestão financeira, com registro de transações e categorias para elas.

## Como rodar

1. Instale o Node (v25), além do NPM, e o MySQL.
2. No MySQL, crie o banco de dados com o seguinte comando

```sql
CREATE DATABASE IF NOT EXISTS gestao_financeira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
```

3. Vá para a [pasta do frontend](./praticas/gestao-financeira/gestao-financeira/) e rode

```bash
npm install
node env.js
npx expo start
```

Isso instalará as dependências necessárias para o frontend do aplicativo e iniciará um servidor Expo para que possa ser acessado pelo Expo Go no celular (caso queira rodar no emulador de Android, rode `npx expo run android`). **Mantenha o terminal aberto.**

4. Abra outro terminal, vá para a [pasta do backend](./praticas/gestao-financeira/gestao-financeira-api/) e rode

```bash
npm install
node setup.js
npm run dev
```

Isso instalará as dependências para o backend e iniciará o servidor, necessário para criar um usuário, fazer login, e ter acesso às funções do app. **Mantenha o terminal aberto**

7. Crie um usuário, e utilize as funções do app.

## Observações

- Se certifique que o MySQL esteja rodando. Sem ele, nada pode ser feito no app
    - (No Windows, pesquise por "services.msc", dê Ctrl + Shift + Enter para abrir como administrador, pesquise por MySQL, clique com o botão direito no serviço, e depois em iniciar). 
- Para testar as rotas e ver a documentação da API REST pelo Postman, importe o arquivo `api.postman_collection.json`, e realize os testes conforme descrito na coleção.
