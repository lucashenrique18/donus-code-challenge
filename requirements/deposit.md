# Depositar

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **POST** na rota **/api/deposit**
2. ✅ Valida dados obrigatórios **cpf**, **password** e **depositValue**
3. ✅ Valida que o campo **cpf** é um cpf válido
4. ✅ **Busca** o usuário com o cpf e senha fornecidos
5. ✅ Valida que o campo **depositValue** é um valor válido
6. ✅ **Atualiza** o valor contido na conta do usuario com bonus
7. ✅ **Salva** movimentação na conta
8. ✅ Retorna **200** com os dados da transação

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **400** se cpf, password ou depositValue não forem fornecidos pelo client
3. ✅ Retorna erro **400** se o campo cpf for um cpf inválido
3. ✅ Retorna erro **400** se o campo depositValue for um valor inválido
4. ✅ Retorna erro **401** se não encontrar um usuário com os dados fornecidos
6. ✅ Retorna erro **500** se der erro ao tentar atualizar o usuário
