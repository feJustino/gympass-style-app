# App

Gympass Style App.

## RFs (Requisitos Funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser posível se autenticar;
- [x] Deve ser posível obter o perfil de um usuário logado;
- [x] Deve ser posível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser posível o usuário obter seu histórico de check-ins;
- [x] Deve ser posível o usuário buscar academias próximas;
- [x] Deve ser posível o usuário buscar academias pelo nome;
- [x] Deve ser posível o usuário realizar check-in em uma academia (até 10 KM);
- [x] Deve ser posível validar o check-in do usuário;
- [x] Deve ser posível cadastrar uma academia;


## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usaŕio não pode fazer check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após criado;
- [x] O check-in só pode ser validado por administradores;
- [x] a academia só pode ser criado por administradores;

## RNFs (Requisitos não funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da apliação precisam estar persisitido em um banco PostgreSQL
- [x] Todas listas de dados precisam estar paginadas em 20 itens por página
- [x] O usuário deve ser identificados por um JWT (Json Web Token)