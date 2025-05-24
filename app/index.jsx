import React, { memo, useCallback } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useData } from '../providers/DataProvider';

// 1️⃣ The form is its own memoized component, with internal state:
const EventForm = memo(function EventForm({ onAdd }) {
  const [name, setName] = React.useState('');

  const [imageUrl, setImageUrl] = React.useState('');
  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    onAdd({
      id: Math.floor(Math.random() * 1e6),
      name: name.trim(),
      image: imageUrl.trim() || undefined,
    });
    // reset
    setName(''); setImageUrl('');
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Create New Event</Text>
      <TextInput style={styles.input} placeholder="Name*"       value={name}           onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Image URL" value={imageUrl} onChangeText={setImageUrl} />
      <Button title="Add Event Track" onPress={handleAdd} />
      <View style={styles.separator} />
      <Text style={[styles.title, { marginTop: 0 }]}>All Event Tracks</Text>
    </View>
  );
});

export default function EventTrackScreen() {
  const { tracks, addEventTrack } = useData();

  // 2️⃣ Memoize the header so it's the *same* component reference every render:
  const HeaderComponent = useCallback(
    () => <EventForm onAdd={addEventTrack} />,
    [addEventTrack]
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {item.image && <Image source={{ uri: item.image }} style={styles.thumbnail} />}
      <View style={styles.info}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text>{item.location} — {item.date}</Text>
        <Text>
          {item.currentParticipants}/{item.maxParticipants} participants
        </Text>
        {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
        <Text>Status: {item.isFinished ? 'Finished' : 'Ongoing'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={tracks}
          keyExtractor={ev => String(ev.id)}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={HeaderComponent}
          contentContainerStyle={styles.listContainer}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  formContainer: { padding: 20, backgroundColor: '#fff' },
  listContainer: { paddingBottom: 40, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 12, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 8, marginBottom: 12, borderRadius: 4,
  },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  separator: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  item: { flexDirection: 'row', alignItems: 'flex-start', padding: 20 },
  thumbnail: { width: 60, height: 60, borderRadius: 4, marginRight: 12 },
  info: { flex: 1 },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  desc: { fontStyle: 'italic', marginTop: 4 },
});