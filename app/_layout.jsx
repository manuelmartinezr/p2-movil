import { Stack } from 'expo-router';
import { DataProvider } from '../providers/DataProvider';

export default function RootLayout() {
  return (
    <DataProvider>
      <Stack />
    </DataProvider>
  );
}
