# Cadastro

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **POST** na rota **/api/signup**
2. ✅ Valida dados obrigatórios **name**, **cpf**, **password** e **passwordConfirmation**
3. ✅ Valida que **password** e **passwordConfirmation** são iguais
4. ✅ Valida que o campo **cpf** é um cpf válido
5. ✅ **Valida** se já existe um usuário com o cpf fornecido
6. ✅ Gera uma senha **criptografada** (essa senha não pode ser descriptografada)
7. ✅ **Cria** uma conta para o usuário com os dados informados, **substituindo** a senha pela senha criptorafada
8. ✅ Retorna **200** com os dados do usuario

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **400** se name, cpf, password ou passwordConfirmation não forem fornecidos pelo client
3. ✅ Retorna erro **400** se password e passwordConfirmation não forem iguais
4. ✅ Retorna erro **400** se o campo cpf for um cpf inválido
5. ✅ Retorna erro **422** se o cpf fornecido já estiver em uso
6. ✅ Retorna erro **500** se der erro ao tentar gerar uma senha criptografada
7. ✅ Retorna erro **500** se der erro ao tentar criar a conta do usuário
