import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1128" />
      <Text style={styles.title}>📊 Dashboard</Text>
      <Text style={styles.item}>• Event statistics</Text>
      <Text style={styles.item}>• User feedback</Text>
      <Text style={styles.item}>• Charts & graphs</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  item: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 6,
  },
});
