import { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [inputText, setInputText] = useState('');
  const responseListener = useRef();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    
    requestPermissions();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data && data.text) {
        setInputText(data.text);
      }
    });

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const sendNotification = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Notification",
        body: inputText,
        data: { text: inputText },
      },
      trigger: null,
    });
    
    setInputText(''); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter notification text"
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
  },
});
