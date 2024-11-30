import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const App = () => {
  const [nomeTarefa, setNomeTarefa] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState(null);  // Guarda a categoria selecionada
  const [contatos, setContatos] = useState([]);
  const [ordenarAsc, setOrdenarAsc] = useState(true); // Controla a ordem de ordenação (ascendente ou descendente)

  const handleAddTarefa = () => {
    if (!nomeTarefa || !descricao) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (!categoria) {
      alert('Selecione uma categoria.');
      return;
    }

    const novaTarefa = {
      id: Math.random().toString(),
      nomeTarefa,
      descricao,
      categoria,
    };

    setContatos([novaTarefa, ...contatos]);
    setNomeTarefa('');
    setDescricao('');
    setCategoria(null);  // Limpar a seleção após o envio
  };

  const renderItem = ({ item }) => {
    // Função para retornar o ícone baseado na prioridade
    const getIconName = () => {
      switch (item.categoria) {
        case 'Alta':
          return 'priority-high';  // Ícone para alta prioridade
        case 'Média':
          return 'alert';  // Ícone de alerta para média prioridade
        case 'Baixa':
          return 'priority-low';  // Ícone para baixa prioridade
        default:
          return 'circle';  // Ícone padrão para prioridade desconhecida
      }
    };

    return (
      <View style={styles.contatoItem}>
        <MaterialCommunityIcons name={getIconName()} size={30} color="#000" style={styles.icon} />
        <View style={styles.contatoInfo}>
          <Text style={styles.nome}>{item.nomeTarefa}</Text>
          <Text style={styles.telefone}>{item.descricao}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.id)}>
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Função para editar um item
  const handleEdit = (item) => {
    setNomeTarefa(item.nomeTarefa);
    setDescricao(item.descricao);
    setCategoria(item.categoria);
    setContatos(contatos.filter((contato) => contato.id !== item.id)); // Remove o item da lista antes de editar
  };

  // Função para remover um item
  const handleRemove = (id) => {
    setContatos(contatos.filter((contato) => contato.id !== id));  // Filtra o item a ser removido
  };

  // Função para ordenar contatos por categoria
  const sortContatos = (contatos) => {
    const priorityOrder = ['Alta', 'Média', 'Baixa'];
    const sortedContatos = contatos.sort((a, b) => priorityOrder.indexOf(a.categoria) - priorityOrder.indexOf(b.categoria));
    
    return ordenarAsc ? sortedContatos : sortedContatos.reverse(); // Ordena de acordo com o estado de ordenação
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da Tarefa"
        value={nomeTarefa}
        onChangeText={setNomeTarefa}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <View style={styles.radioContainer}>
        <View style={styles.radioWrapper}>
          <RadioButton
            value="Alta"
            status={categoria === 'Alta' ? 'checked' : 'unchecked'}
            onPress={() => setCategoria('Alta')}
          />
          <Text>Alta</Text>
        </View>
        <View style={styles.radioWrapper}>
          <RadioButton
            value="Média"
            status={categoria === 'Média' ? 'checked' : 'unchecked'}
            onPress={() => setCategoria('Média')}
          />
          <Text>Média</Text>
        </View>
        <View style={styles.radioWrapper}>
          <RadioButton
            value="Baixa"
            status={categoria === 'Baixa' ? 'checked' : 'unchecked'}
            onPress={() => setCategoria('Baixa')}
          />
          <Text>Baixa</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddTarefa}>
        <Text style={styles.addButtonText}>Adicionar Tarefa</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.sortButton} 
        onPress={() => setOrdenarAsc(!ordenarAsc)}
      >
        <Text style={styles.sortButtonText}>
          Ordenar {ordenarAsc ? 'Decrescente' : 'Crescente'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={sortContatos(contatos)}  // Ordena os contatos pelas prioridades
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  flatList: {
    marginTop: 16,
  },
  contatoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  contatoInfo: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  telefone: {
    fontSize: 16,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 5,
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sortButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 12,
    borderRadius: 5,
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
