#!/bin/bash

# Define as branches
BRANCHES=("refactor/general" "refactor/structure")
INTEGRATION_BRANCH="integration"
MAIN_BRANCH="main"

# Função para sincronizar uma branch com a branch de integração
sync_with_integration() {
  local branch_name=$1
  echo "Sincronizando branch $branch_name com a branch $INTEGRATION_BRANCH..."

  git checkout $branch_name || exit 1
  git merge $INTEGRATION_BRANCH || exit 1

  echo "Branch $branch_name sincronizada com sucesso!"
}

# 1. Atualizar a branch integration com a branch atual
echo "Atualizando branch $INTEGRATION_BRANCH com mudanças da branch atual..."

# Salva a branch atual para poder retornar a ela depois
CURRENT_BRANCH=$(git branch --show-current)

# Troca para a branch integration
git checkout $INTEGRATION_BRANCH || exit 1

# Faz o merge da branch atual na branch integration
git merge $CURRENT_BRANCH || exit 1

echo "Branch $INTEGRATION_BRANCH atualizada com sucesso!"

# 2. Sincronizar todas as branches (exceto a main) com a integration
for branch in "${BRANCHES[@]}"; do
  sync_with_integration $branch
done

# Voltar para a branch original
git checkout $CURRENT_BRANCH || exit 1

echo "Processo concluído com sucesso!"
