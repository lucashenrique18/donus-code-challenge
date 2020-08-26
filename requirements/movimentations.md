# Movimentações

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **POST** na rota **/api/movimentations**
2. ✅ Valida dados obrigatórios **cpf**, **password**
3. ✅ Valida que o campo **cpf** é um cpf válido
4. ✅ **Busca** o usuário com o cpf e senha fornecidos
9. ✅ Retorna **200** com os dados das movimentações

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **400** se cpf, password não forem fornecidos pelo client
3. ✅ Retorna erro **400** se o campo cpf for um cpf inválido
7. ✅ Retorna erro **401** se não encontrar um usuário com os dados fornecidos
8. ✅ Retorna erro **500** se der erro ao tentar buscar as movimentações