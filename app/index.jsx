import { useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useData } from '../providers/DataProvider';

export default function EventsScreen() {
  const { events, addEvent } = useData();

  // form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [description, setDescription] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [eventTrackId, setEventTrackId] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !location.trim() || !date.trim() || !maxParticipants.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    addEvent({
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

  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Create New Event</Text>
      {[
        { value: name,    setter: setName, placeholder: 'Name*' },
        { value: location, setter: setLocation, placeholder: 'Location*' },
        { value: date,    setter: setDate, placeholder: 'Date* (YYYY-MM-DD)' },
        { value: maxParticipants, setter: setMaxParticipants, placeholder: 'Max Participants*', keyboardType: 'number-pad' },
        { value: description, setter: setDescription, placeholder: 'Description', multiline: true },
        { value: imageUrl, setter: setImageUrl, placeholder: 'Image URL' },
        { value: eventTrackId, setter: setEventTrackId, placeholder: 'Track ID', keyboardType: 'number-pad' },
      ].map((fld, i) => (
        <TextInput
          key={i}
          style={styles.input}
          placeholder={fld.placeholder}
          value={fld.value}
          onChangeText={fld.setter}
          multiline={fld.multiline}
          keyboardType={fld.keyboardType}
        />
      ))}
      <View style={styles.switchRow}>
        <Text>Finished?</Text>
        <Switch value={isFinished} onValueChange={setIsFinished} />
      </View>
      <Button title="Add Event" onPress={handleAdd} />
      <View style={styles.separator} />
      <Text style={[styles.title, { marginTop: 0 }]}>All Events</Text>
    </View>
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
    <FlatList
      data={events}
      keyExtractor={ev => String(ev.id)}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={renderForm}
      contentContainerStyle={styles.container}
      // optional if you want pull-to-refresh, etc.
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  formContainer: { marginBottom: 20 },
  title: { fontSize: 22, marginBottom: 12, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 8, marginBottom: 12, borderRadius: 4,
  },
  switchRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12,
  },
  separator: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  item: { flexDirection: 'row', alignItems: 'flex-start' },
  thumbnail: { width: 60, height: 60, borderRadius: 4, marginRight: 12 },
  info: { flex: 1 },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  desc: { fontStyle: 'italic', marginTop: 4 },
});
