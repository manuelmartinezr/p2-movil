import { useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function EventDetailScreen() {
  const { name, image } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.noImage}>No image provided</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  image: { width: '100%', height: 200, borderRadius: 10 },
  noImage: { fontSize: 16, color: '#888' },
});
