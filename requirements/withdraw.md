# Sacar

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **POST** na rota **/api/withdraw**
2. ✅ Valida dados obrigatórios **cpf**, **password**, **value**
3. ✅ Valida que o campo **cpf** é um cpf válido
4. ✅ **Busca** o usuário com o cpf e senha fornecidos
5. ✅ Valida que o campo **value** é um valor válido
6. ✅ Valida saldo na conta do cliente
7. ✅ **Atualiza** o valor contido na conta do usuário com taxa
8. ✅ Retorna **200** com os dados da transação

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **400** se cpf, password ou value não forem fornecidos pelo client
3. ✅ Retorna erro **400** se o campo cpf for um cpf inválido
4. ✅ Retorna erro **400** se o campo value for um valor inválido
5. ✅ Retorna erro **400** se não houver saldo suficiente
7. ✅ Retorna erro **401** se não encontrar um usuário com os dados fornecidos
8. ✅ Retorna erro **500** se der erro ao tentar atualizar o usuário
