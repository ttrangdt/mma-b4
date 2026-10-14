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
        title: '🔔 Thông báo mới',
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
              <View style={styles.iconCircle}>
                <Text style={styles.headerEmoji}>🔔</Text>
              </View>
              <Text style={styles.title}>Notification Hub</Text>
              <Text style={styles.subtitle}>
                Gửi thông báo cục bộ và tự động điền lại khi chạm
              </Text>
            </View>

            {/* Notification Input & Action Card Component */}
            <NotificationCard
              inputText={inputText}
              setInputText={setInputText}
              onSend={sendNotification}
            />

            {/* Status & Response Feedback */}
            {lastReceivedText ? (
              <View style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                  <Text style={styles.feedbackDot}>🟢</Text>
                  <Text style={styles.feedbackTitle}>Đã nhận từ click thông báo:</Text>
                </View>
                <Text style={styles.feedbackContent}>"{lastReceivedText}"</Text>
              </View>
            ) : null}

            {/* Guide */}
            <View style={styles.guideCard}>
              <Text style={styles.guideTitle}>💡 Hướng dẫn kiểm tra:</Text>
              <Text style={styles.guideStep}>
                1. Nhập chữ hoặc bấm chọn gợi ý ở trên.
              </Text>
              <Text style={styles.guideStep}>
                2. Nhấn nút <Text style={styles.boldText}>Bắn Thông Báo Ngay</Text>.
              </Text>
              <Text style={styles.guideStep}>
                3. Chạm vào thông báo xuất hiện trên màn hình để tự động đổ lại nội dung vào ô nhập.
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF2F6',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  headerEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  feedbackCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  feedbackDot: {
    fontSize: 10,
    marginRight: 6,
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
  guideCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  guideStep: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '700',
    color: '#4F46E5',
  },
});
