import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useData } from '../providers/DataProvider';

export default function EventsScreen() {
  const {
    events,
    tracks,
    addEvent,
    updateEvent,
    deleteEvent,
    getEvents,
    getEventParticipants,
    getEventTracks,
  } = useData();

  const [eventName, setEventName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [currentParticipantsMap, setCurrentParticipantsMap] = useState({});

  const [open, setOpen] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [trackItems, setTrackItems] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await getEvents();
    await getEventTracks();
  };

  useEffect(() => {
    setTrackItems(
      tracks
        .filter((track) => track?.id && track?.name)
        .map((track) => ({
          label: track.name,
          value: track.id,
        }))
    );
  }, [tracks]);

  useEffect(() => {
    const loadCapacities = async () => {
      const map = {};
      for (const event of events) {
        const count = await getEventParticipants(event.id);
        map[event.id] = count || 0;
      }
      setCurrentParticipantsMap(map);
    };
    if (events.length > 0) loadCapacities();
  }, [events]);

  const formatDateTime = (date: Date, time: Date) => {
    const d = date.toISOString().split('T')[0];
    const t = time.toTimeString().split(' ')[0].slice(0, 5);
    return `${d} ${t}`;
  };

  const handleSubmit = async () => {
    if (!eventName.trim() || !maxParticipants.trim()) {
      Alert.alert('Please fill all required fields');
      return;
    }

    const parsedCapacity = parseInt(maxParticipants);
    if (isNaN(parsedCapacity) || parsedCapacity < 1) {
      Alert.alert('Max participants must be a valid number');
      return;
    }

    const eventData = {
      name: eventName,
      image: imageUrl,
      location,
      maxParticipants: parsedCapacity,
      eventTrackId: selectedTrackId,
      startDateTime: formatDateTime(startDate, startTime),
    };

    if (editingId) {
      await updateEvent(editingId, { ...eventData, id: editingId });
      Alert.alert('Event updated!');
    } else {
      await addEvent(eventData);
      Alert.alert('Event created!');
    }

    resetForm();
  };

  const handleEdit = (event) => {
    setEventName(event.name);
    setImageUrl(event.image || '');
    setLocation(event.location || '');
    setMaxParticipants(event.maxParticipants?.toString() || '');
    setSelectedTrackId(event.eventTrackId ?? null);

    const [dateStr, timeStr] = (event.startDateTime || '').split(' ');
    if (dateStr) setStartDate(new Date(dateStr));
    if (timeStr) setStartTime(new Date(`1970-01-01T${timeStr}:00`));

    setEditingId(event.id);
  };

  const handleDelete = (eventId) => {
    Alert.alert('Delete Event', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEvent(eventId);
        },
      },
    ]);
  };

  const resetForm = () => {
    setEventName('');
    setImageUrl('');
    setLocation('');
    setMaxParticipants('');
    setSelectedTrackId(null);
    setEditingId(null);
    setStartDate(new Date());
    setStartTime(new Date());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A1128" />
      <Text style={styles.title}>{editingId ? 'Edit Event' : 'Create New Event'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Event Name"
        placeholderTextColor="#aaa"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        placeholderTextColor="#aaa"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        placeholderTextColor="#aaa"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Max Participants"
        placeholderTextColor="#aaa"
        value={maxParticipants}
        onChangeText={setMaxParticipants}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Event Date</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: '#fff' }}>{startDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Event Time</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
        <Text style={{ color: '#fff' }}>{startTime.toTimeString().slice(0, 5)}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(_, time) => {
            setShowTimePicker(false);
            if (time) setStartTime(time);
          }}
        />
      )}

      <Text style={styles.label}>Select Track</Text>
      <DropDownPicker
        open={open}
        value={selectedTrackId}
        items={trackItems}
        setOpen={setOpen}
        setValue={setSelectedTrackId}
        setItems={setTrackItems}
        placeholder="Choose a track"
        style={[styles.dropdown, { color: 'white' }]}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={{ color: 'white' }}
        listItemLabelStyle={{ color: 'white' }}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{editingId ? 'Update Event' : 'Add Event'}</Text>
      </TouchableOpacity>

      {editingId && (
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={resetForm}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>All Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item, index) => item?.id?.toString() ?? `event-${index}`}
        contentContainerStyle={{ paddingBottom: 150 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/event-detail', params: item })}
            style={styles.card}
          >
            <Text style={styles.cardText}>{item.name}</Text>
            <Text style={styles.cardSubtext}>
              {currentParticipantsMap[item.id] ?? 0} / {item.maxParticipants || 'N/A'} participants
            </Text>
            <Text style={styles.cardSubtext}>When: {item.startDateTime}</Text>
            {item.eventTrackId && (
              <Text style={styles.trackInfo}>
                Track: {tracks.find((t) => t.id === item.eventTrackId)?.name || 'Unknown'}
              </Text>
            )}
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1128',
    padding: 20,
    zIndex: 10,
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
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
    paddingLeft: 4,
  },
  dropdown: {
    backgroundColor: '#1E2A47',
    borderColor: '#3D5AFE',
    marginBottom: 16,
    zIndex: 1000,
  },
  dropdownContainer: {
    backgroundColor: '#1E2A47',
    borderColor: '#3D5AFE',
    zIndex: 999,
  },
  button: {
    backgroundColor: '#3D5AFE',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#777',
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
    marginBottom: 4,
  },
  cardSubtext: {
    color: '#B0BEC5',
    marginBottom: 4,
  },
  trackInfo: {
    color: '#90CAF9',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  edit: {
    color: '#3D5AFE',
    fontWeight: '600',
    marginRight: 16,
  },
  delete: {
    color: '#FF5252',
    fontWeight: '600',
  },
});
