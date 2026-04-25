/* ============================================================================
   col-groups-data.js - Dados confirmados de grupos

   RESPONSABILIDADE:
     Carrega os grupos iniciais que o modulo GitHub regenera quando novos
     grupos pendentes sao confirmados.

   EXPOE (globais):
     Chama ColGroups.load([...]).

   DEPENDENCIAS:
     colecoes/col-groups.js.

   ORDEM DE CARREGAMENTO:
     Depois de col-groups.js.
============================================================================ */

ColGroups.load([
  { slug: 'ygor', name: 'Ygor', cor: '#1a9e52' },
  { slug: 'joel', name: 'Joel', cor: '#06b6d4' },
  { slug: 'pedro', name: 'pedro', cor: '#f59e0b' }
]);
