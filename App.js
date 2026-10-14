import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import NotificationCard from './components/NotificationCard';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [inputText, setInputText] = useState('');
  const [lastReceivedText, setLastReceivedText] = useState('');
  const responseListener = useRef();

  useEffect(() => {
    const setupNotifications = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366F1',
        });
      }

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    setupNotifications();

    // Lắng nghe khi người dùng bấm vào thông báo
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data && data.text) {
        setInputText(data.text);
        setLastReceivedText(data.text);
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
      alert('Vui lòng nhập nội dung thông báo!');
      return;
    }

    const message = inputText.trim();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: ' Thông báo',
        body: message,
        data: { text: message },
      },
      trigger: null,
    });

    setInputText('');
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerEmoji}>🔔</Text>
              <Text style={styles.title}>Notification App</Text>
            </View>

            {/* Notification Input & Action Card Component */}
            <NotificationCard
              inputText={inputText}
              setInputText={setInputText}
              onSend={sendNotification}
            />

            {/* Status & Response Feedback khi click vào thông báo */}
            {lastReceivedText ? (
              <View style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                  <Text style={styles.feedbackTitle}>Đã lấy từ thông báo vừa bấm:</Text>
                </View>
                <Text style={styles.feedbackContent}>"{lastReceivedText}"</Text>
              </View>
            ) : null}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  headerEmoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  feedbackCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  feedbackContent: {
    fontSize: 15,
    fontWeight: '600',
    color: '#047857',
    marginTop: 2,
  },
});
