import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
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
      console.log('Nota salva com sucesso:', newNote);
      console.log('Todas as notas:', notes);

      Alert.alert('Sucesso', 'Nota salva com sucesso!');
      router.push('/'); // Volta para a tela inicial
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a nota.');
      console.error('Erro ao salvar nota:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Título da Nota"
        value={title}
        onChangeText={setTitle}
        style={{ fontSize: 18, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Conteúdo da Nota"
        value={content}
        onChangeText={setContent}
        style={{ fontSize: 16, marginBottom: 20 }}
        multiline
      />
      <Button title="Salvar Nota" onPress={handleSave} />
    </View>
  );
}
