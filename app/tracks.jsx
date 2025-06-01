import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useData } from '../providers/DataProvider';

export default function TracksScreen() {
  const {
    tracks,
    events,
    addEventTrack,
    updateEventTrack,
    deleteEventTrack,
    getEventTracks,
  } = useData();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getEventTracks(); // 🔁 asegura que los tracks estén cargados
  }, []);

  const handleAddOrUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Track name is required');
      return;
    }

    const duplicate = tracks.find(
      (t) => t.name.toLowerCase() === name.toLowerCase() && t.id !== editingId
    );
    if (duplicate) {
      Alert.alert('Track with this name already exists.');
      return;
    }

    if (editingId) {
      await updateEventTrack(editingId, { id: editingId, name, description });
      Alert.alert('Track updated!');
    } else {
      const newTrack = {
        id: Date.now(), // 🔧 ID único si backend no lo asigna
        name,
        description,
      };
      await addEventTrack(newTrack);
      Alert.alert('Track added!');
    }

    resetForm();
  };

  const handleDelete = async (trackId) => {
    Alert.alert('Delete Track', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEventTrack(trackId);
        },
      },
    ]);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingId(null);
  };

  const startEditing = (track) => {
    setName(track.name);
    setDescription(track.description || '');
    setEditingId(track.id);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1128" />
      <Text style={styles.title}>{editingId ? 'Edit Track' : 'Add Event Track'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Track Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Track Description"
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>{editingId ? 'Update' : 'Add Track'}</Text>
      </TouchableOpacity>

      {tracks.length > 0 && (
        <>
          <Text style={styles.subtitle}>Existing Tracks</Text>
          <FlatList
            data={tracks.filter((track) => track && track.id)}
            keyExtractor={(item, index) => item.id?.toString() ?? `track-${index}`}
            renderItem={({ item }) => {
              const eventsForTrack = events.filter((e) => e.trackId === item.id);
              return (
                <View style={styles.trackCard}>
                  <TouchableOpacity onPress={() => startEditing(item)}>
                    <Text style={styles.trackName}>{item.name}</Text>
                    {item.description ? (
                      <Text style={styles.trackDesc}>{item.description}</Text>
                    ) : null}
                  </TouchableOpacity>

                  {eventsForTrack.length > 0 ? (
                    <View style={styles.eventList}>
                      {eventsForTrack.map((ev) => (
                        <Text key={ev.id} style={styles.eventItem}>
                          • {ev.name} ({ev.currentParticipants ?? 0}/{ev.capacity ?? ev.maxParticipants ?? '-'})
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noEvents}>No events in this track.</Text>
                  )}

                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1128',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 30,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1E2A47',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3D5AFE',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  trackCard: {
    backgroundColor: '#1E2A47',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  trackName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  trackDesc: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  eventList: {
    marginTop: 10,
  },
  eventItem: {
    fontSize: 14,
    color: '#ccc',
  },
  noEvents: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: '#F44336',
    fontWeight: '600',
  },
});
