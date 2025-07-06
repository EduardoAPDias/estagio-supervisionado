// index.js

import { createClient } from '@supabase/supabase-js';

// 1. CONFIGURAÇÃO DA CONEXÃO
const supabaseUrl = 'https://suvgkltnrrfeegyzffku.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dmdrbHRucnJmZWVneXpmZmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NjA2OTYsImV4cCI6MjA2NzMzNjY5Nn0.lsPEGPltEqEmSUUQeQR3yS2ZuzMLwYZktonEoaoZIF4';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Cliente Supabase inicializado!');

// ----------------------------------------------------
// 2. DEFINIÇÃO DAS FUNÇÕES CRUD
// ----------------------------------------------------

/**
 * CREATE: Insere um novo item no banco de dados.
 */
async function criarItem(item) {
  const { data, error } = await supabase
    .from('itens_supermercado')
    .insert([item])
    .select(); // Adicionamos .select() para retornar o item inserido

  if (error) {
    console.error('Erro ao inserir item:', error.message);
    return null;
  }
  console.log('Item inserido com sucesso!');
  return data[0]; // Retorna o primeiro (e único) item inserido
}

/**
 * READ: Lê todos os itens da tabela.
 */
async function lerTodosItens() {
  console.log('\n--- Lendo todos os itens ---');
  const { data, error } = await supabase
    .from('itens_supermercado')
    .select('*')
    .order('id', { ascending: true }); // Ordena por ID

  if (error) {
    console.error('Erro ao ler itens:', error.message);
    return;
  }

  if (data.length === 0) {
    console.log('Nenhum item encontrado.');
  } else {
    console.table(data);
  }
}

/**
 * UPDATE: Atualiza um item existente com base no seu ID.
 */
async function atualizarItem(id, novosDados) {
  console.log(`\n--- Atualizando item com ID: ${id} ---`);
  const { data, error } = await supabase
    .from('itens_supermercado')
    .update(novosDados)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Erro ao atualizar o item:', error.message);
    return null;
  }
  console.log('Item atualizado com sucesso!');
  console.table(data);
  return data;
}

/**
 * DELETE: Deleta um item com base no seu ID.
 */
async function deletarItem(id) {
  console.log(`\n--- Deletando item com ID: ${id} ---`);
  const { error } = await supabase
    .from('itens_supermercado')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar o item:', error.message);
    return;
  }
  console.log('Item deletado com sucesso!');
}


// ----------------------------------------------------
// 3. EXECUÇÃO DO FLUXO CRUD
// ----------------------------------------------------

async function main() {
  console.log('Iniciando demonstração do CRUD...');

  // Estado inicial: ler todos os itens (deve estar vazio no início)
  await lerTodosItens();

  // CREATE: Adicionando novos itens
  console.log('\n--- Criando novos itens ---');
  const itemLeite = await criarItem({ nome: 'Leite Integral', quantidade: 2, preco_unitario: 4.50, secao: 'Laticínios' });
  const itemPao = await criarItem({ nome: 'Pão Francês', quantidade: 5, preco_unitario: 0.80, secao: 'Padaria' });
  
  // Ler novamente para ver os itens adicionados
  await lerTodosItens();

  // UPDATE: Vamos supor que o preço do leite aumentou
  if (itemLeite) {
    await atualizarItem(itemLeite.id, { preco_unitario: 4.75, quantidade: 3 });
  }

  // Ler novamente para ver a atualização
  await lerTodosItens();

  // DELETE: Vamos remover o pão da lista
  if (itemPao) {
    await deletarItem(itemPao.id);
  }
  
  // Ler pela última vez para confirmar a deleção
  await lerTodosItens();

  console.log('\nDemonstração do CRUD finalizada.');
}

// Inicia a execução da função principal
main();