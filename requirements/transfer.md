# Transferencia

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **POST** na rota **/api/transfer**
2. ✅ Valida dados obrigatórios **cpf**, **password**, **beneficiaryCpf** e **value**
3. ✅ Valida que o campo **cpf** é um cpf válido
4. ✅ Valida que o campo **beneficiaryCpf** é um cpf válido
5. ✅ **Busca** o usuário com o cpf e senha fornecidos
6. ✅ **Busca** o beneficiário com o cpf fornecido
7. ✅ Valida que o campo **value** é um valor válido
8. ✅ Valida saldo na conta do cliente
9. ✅ **Atualiza** o valor contido na conta do usuário
10. ✅ **Atualiza** o valor contido na conta do beneficiário
11. ✅ **Salva** movimentação na conta
12. ✅ Retorna **200** com os dados da transação

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **400** se cpf, password, beneficiaryCpf ou value não forem fornecidos pelo client
3. ✅ Retorna erro **400** se o campo cpf for um cpf inválido
4. ✅ Retorna erro **400** se o campo beneficiaryCpf for um cpf inválido
5. ✅ Retorna erro **400** se o campo value for um valor inválido
6. ✅ Retorna erro **400** se não houver saldo suficiente
7. ✅ Retorna erro **400** se não encontrar um beneficiário com os dados fornecidos
8. ✅ Retorna erro **401** se não encontrar um usuário com os dados fornecidos
9. ✅ Retorna erro **500** se der erro ao tentar atualizar o usuário
