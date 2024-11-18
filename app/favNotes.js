import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Favoritas = () => {
  const [favoriteNotes, setFavoriteNotes] = useState([]);
  const router = useRouter();

  // Carregar notas favoritas
  const loadFavoriteNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];
      const favorites = parsedNotes.filter((note) => note.isFavorite);
      setFavoriteNotes(favorites);
    } catch (error) {
      console.error('Erro ao carregar notas favoritas:', error);
    }
  };

  useEffect(() => {
    loadFavoriteNotes();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/nota/${item.id}`)}>
            <View style={styles.noteItem}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent}>{item.content.substring(0, 40)}...</Text>
            </View>
          </TouchableOpacity>
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
  noteItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteContent: {
    color: '#666',
    marginTop: 5,
  },
});

export default Favoritas;
