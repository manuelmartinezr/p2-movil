import { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useData } from '../providers/DataProvider';

export default function EventsScreen() {
  const { events, addEvent } = useData();
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addEvent({ 
      id: Math.random().toString(36).substring(7), // Genera un ID aleatorio
      name: newName,
    });
    setNewName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos</Text>
      <FlatList
        data={events}
        keyExtractor={ev => String(ev.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
      <View style={styles.form}>
        <TextInput
          placeholder="Nuevo evento"
          value={newName}
          onChangeText={setNewName}
          style={styles.input}
        />
        <Button title="Agregar" onPress={handleAdd} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  form: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, marginRight: 8, borderRadius: 4 },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
});