import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
      setNotes(parsedNotes);
    } catch (error) {
      console.error('Erro ao carregar as notas:', error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Adicionar Nota" onPress={() => router.push('/create-note')} color="#6200ee" />
      </View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/view-note?id=${item.id}`)}
            style={styles.noteItem}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma nota encontrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  buttonContainer: {
    marginBottom: 20, // Ajuste o valor para aumentar ou diminuir o espaço entre o botão e a lista
  },
  noteItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  noteTitle: {
    fontSize: 18,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
