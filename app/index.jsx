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
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useData } from '../providers/DataProvider';

// 1️⃣ The form is its own memoized component, with internal state:
const EventForm = memo(function EventForm({ onAdd }) {
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [date, setDate] = React.useState('');
  const [maxParticipants, setMaxParticipants] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isFinished, setIsFinished] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [eventTrackId, setEventTrackId] = React.useState('');

  const handleAdd = () => {
    if (!name.trim() || !location.trim() || !date.trim() || !maxParticipants.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    onAdd({
      id: Math.floor(Math.random() * 1e6),
      name: name.trim(),
      location: location.trim(),
      date: date.trim(),
      maxParticipants: parseInt(maxParticipants, 10),
      description: description.trim() || undefined,
      currentParticipants: 0,
      isFinished,
      image: imageUrl.trim() || undefined,
      eventTrackId: eventTrackId.trim() ? parseInt(eventTrackId, 10) : undefined,
    });
    // reset
    setName(''); setLocation(''); setDate('');
    setMaxParticipants(''); setDescription('');
    setIsFinished(false); setImageUrl(''); setEventTrackId('');
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Create New Event</Text>
      <TextInput style={styles.input} placeholder="Name*"       value={name}           onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Location*"   value={location}       onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Date* (YYYY-MM-DD)" value={date}   onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="Max Participants*" value={maxParticipants} onChangeText={setMaxParticipants} keyboardType="number-pad" />
      <TextInput style={[styles.input, { height: 80 }]} placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <View style={styles.switchRow}>
        <Text>Finished?</Text>
        <Switch value={isFinished} onValueChange={setIsFinished} />
      </View>
      <TextInput style={styles.input} placeholder="Image URL" value={imageUrl} onChangeText={setImageUrl} />
      <TextInput style={styles.input} placeholder="Track ID" value={eventTrackId} onChangeText={setEventTrackId} keyboardType="number-pad" />
      <Button title="Add Event" onPress={handleAdd} />
      <View style={styles.separator} />
      <Text style={[styles.title, { marginTop: 0 }]}>All Events</Text>
    </View>
  );
});

export default function EventsScreen() {
  const { events, addEvent } = useData();

  // 2️⃣ Memoize the header so it's the *same* component reference every render:
  const HeaderComponent = useCallback(
    () => <EventForm onAdd={addEvent} />,
    [addEvent]
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
          data={events}
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
