import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useData } from '../providers/DataProvider';

export default function EventsScreen() {
  const [eventName, setEventName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { events, addEvent } = useData();

  const handleAddEvent = async () => {
    if (!eventName.trim()) {
      Alert.alert('Event name is required');
      return;
    }

    await addEvent({ name: eventName, image: imageUrl });
    setEventName('');
    setImageUrl('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={eventName}
        onChangeText={setEventName}
      />

      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddEvent}>
        <Text style={styles.buttonText}>Add Event</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>All Events</Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/event-detail', params: item })}
            style={styles.card}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1128',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1E2A47',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3D5AFE',
    padding: 14,
    borderRadius: 10,
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1E2A47',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

