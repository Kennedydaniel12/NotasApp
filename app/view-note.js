import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewNote() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        const notes = storedNotes ? JSON.parse(storedNotes) : [];
        const foundNote = notes.find((n) => n.id === id);
        setNote(foundNote);
      } catch (error) {
        console.error('Erro ao carregar a nota:', error);
      }
    };

    loadNote();
  }, [id]);

  if (!note) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{note.title}</Text>
      <Text style={{ fontSize: 16, marginVertical: 10 }}>{note.content}</Text>
      <Button
        title="Excluir Nota"
        onPress={() => router.push(`/delete-confirmation?id=${note.id}`)}
      />
    </View>
  );
}
  