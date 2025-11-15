#!/usr/bin/env bash
cd /home/pedro/Documentos/Aulas/projetoPI-1.2

# carrega .env se existir
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

# inicializa DB (idempotente)
npm run db:init || true

# inicia a app
npm start