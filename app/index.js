import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const VisualizarNotas = () => {
  const [notes, setNotes] = useState([]); // Todas as notas
  const [filteredNotes, setFilteredNotes] = useState([]); // Notas filtradas para pesquisa
  const [searchQuery, setSearchQuery] = useState(''); // Pesquisa do usuário
  const router = useRouter();

  // Carregar notas do AsyncStorage
  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];
      setNotes(parsedNotes);
      setFilteredNotes(parsedNotes);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Filtrar notas com base na pesquisa
  const filterNotes = (query) => {
    if (query === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  // Função para marcar/desmarcar uma nota como favorita
  const toggleFavorite = async (noteId) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note
    );
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes); // Atualiza as notas filtradas também
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes)); // Salva as notas no AsyncStorage
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterNotes(text);
  };

  // Função de navegação ao clicar na nota
  const navigateToNote = (id) => {
    router.push(`/view-note?id=${id}`); // Roteia para a página de visualização/edição
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquise suas notas"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <TouchableOpacity onPress={() => navigateToNote(item.id)} style={styles.noteContentWrapper}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              {/* Exibe a prévia do conteúdo da nota */}
              <Text style={styles.notePreview}>
                {item.content.substring(0, 60)}...
              </Text> {/* Exibe os primeiros 60 caracteres da nota */}
            </TouchableOpacity>

            {/* Botão de favoritar com símbolo de estrela */}
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Text style={styles.favoriteButton}>
                {item.isFavorite ? '🌟 Favoritado' : '⭐ Favoritar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  noteItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', // Alinha a estrela à direita
    alignItems: 'flex-start',
  },
  noteContentWrapper: {
    flex: 1, // Garante que o título e a prévia ocupem o espaço disponível
    justifyContent: 'flex-start', // Alinha o conteúdo à esquerda
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notePreview: {
    color: '#888', // Cor para a prévia do conteúdo
    marginTop: 5,
    fontSize: 14,
  },
  favoriteButton: {
    color: '#007bff',
    marginTop: 10,
    alignSelf: 'flex-end', // Garante que a estrela fique à direita
  },
});

export default VisualizarNotas;
