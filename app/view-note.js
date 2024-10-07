import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewNote() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const loadNote = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        const notes = storedNotes ? JSON.parse(storedNotes) : [];
        const foundNote = notes.find((n) => n.id === id);
        setNote(foundNote);
        if (foundNote) {
          setTitle(foundNote.title);
          setContent(foundNote.content);
        }
      } catch (error) {
        console.error('Erro ao carregar a nota:', error);
      }
    };

    loadNote();
  }, [id]);

  const handleSaveEdit = async () => {
    if (title.trim() === '' || content.trim() === '') {
      Alert.alert('Erro', 'Título e conteúdo são obrigatórios.');
      return;
    }

    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? JSON.parse(storedNotes) : [];

      const updatedNotes = notes.map((n) => {
        if (n.id === id) {
          return { ...n, title, content };
        }
        return n;
      });

      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      Alert.alert('Sucesso', 'Nota atualizada com sucesso!');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a nota.');
      console.error('Erro ao atualizar a nota:', error);
    }
  };

  if (!note) {
    return <Text style={styles.loadingText}>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título da Nota"
            style={styles.input}
          />
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Conteúdo da Nota"
            style={[styles.input, styles.contentInput]}
            multiline
          />
          <Button title="Salvar Alterações" onPress={handleSaveEdit} color="#6200ee" />
          <Button title="Cancelar" onPress={() => setIsEditing(false)} color="#888" />
        </>
      ) : (
        <>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
          <Button title="Editar Nota" onPress={() => setIsEditing(true)} color="#6200ee" />
          <Button
            title="Excluir Nota"
            onPress={() => router.push(`/delete-confirmation?id=${note.id}`)}
            color="#e53935"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'justify',
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
