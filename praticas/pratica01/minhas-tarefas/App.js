import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { titulo } from './util';
import titulo_padrao from './util';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{titulo_padrao}</Text>
      <Text>{titulo}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
