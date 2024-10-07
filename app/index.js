import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
      console.log('Notas carregadas:', parsedNotes);
      setNotes(parsedNotes);
    } catch (error) {
      console.error('Erro ao carregar as notas:', error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Adicionar Nota" onPress={() => router.push('/create-note')} />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/view-note?id=${item.id}`)}>
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhuma nota encontrada.</Text>}
      />
    </View>
  );
}
