import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeleteConfirmation() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleDelete = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? JSON.parse(storedNotes) : [];
      const updatedNotes = notes.filter((note) => note.id !== id);

      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      Alert.alert('Sucesso', 'Nota excluída com sucesso!');
      router.push('/');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a nota.');
      console.error('Erro ao excluir a nota:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Tem certeza que deseja excluir a nota?</Text>
      <Button title="Sim, excluir" onPress={handleDelete} />
      <Button title="Cancelar" onPress={() => router.back()} />
    </View>
  );
}
