#!/usr/bin/env bash
cd /home/pedro/Documentos/Aulas/projetoPI-1.2

# carrega .env (se existir)
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# inicializa o banco (idempotente; se já existir, apenas verifica/cria tabelas)
npm run db:init || true

# inicia o servidor (usa package.json start)
npm start