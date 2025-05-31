import { useState } from 'react';
import {
    Alert,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useData } from '../providers/DataProvider';

export default function TracksScreen() {
  const [trackName, setTrackName] = useState('');
  const { addEventTrack } = useData();

  const handleAddTrack = async () => {
    if (!trackName.trim()) {
      Alert.alert('Track name is required');
      return;
    }

    await addEventTrack({ name: trackName });
    Alert.alert('Track added!');
    setTrackName('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1128" />
      <Text style={styles.title}>Add Event Track</Text>

      <TextInput
        style={styles.input}
        placeholder="Track Name"
        placeholderTextColor="#aaa"
        value={trackName}
        onChangeText={setTrackName}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddTrack}>
        <Text style={styles.buttonText}>Add Track</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1128',
    padding: 24,
    paddingTop: 60,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1E2A47',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3D5AFE',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
