import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function CreateNote() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (title.trim() === '' || content.trim() === '') {
      Alert.alert('Erro', 'Título e conteúdo são obrigatórios.');
      return;
    }

    try {
      const existingNotes = await AsyncStorage.getItem('notes');
      const notes = existingNotes ? JSON.parse(existingNotes) : [];

      const newNote = {
        id: Date.now().toString(),
        title,
        content,
      };

      notes.push(newNote);

      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      Alert.alert('Sucesso', 'Nota salva com sucesso!');
      router.push('/');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a nota.');
      console.error('Erro ao salvar nota:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título da Nota"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Conteúdo da Nota"
        value={content}
        onChangeText={setContent}
        style={[styles.input, styles.contentInput]}
        multiline
      />
      <View style={styles.buttonContainer}>
        <Button title="Salvar Nota" onPress={handleSave} color="#6200ee" />
      </View>
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
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
