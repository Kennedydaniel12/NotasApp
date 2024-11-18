import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Substitui useNavigation pelo useRouter

const BottomMenu: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/')} // Navega para a página inicial
      >
        <Text style={styles.text}>Minhas Notas</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/create-note')} // Navega para a rota de criação de notas
      >
        <Text style={styles.text}>Criar Nota</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/favNotes')} 
      >
        <Text style={styles.text}>Notas Favoritas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
});

export default BottomMenu;

