import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function NotificationCard({ inputText, setInputText, onSend }) {
  return (
    <View style={styles.card}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Nội dung thông báo</Text>
        {inputText.length > 0 && (
          <TouchableOpacity onPress={() => setInputText('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.clearBtnText}>Xóa</Text>
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nhập nội dung cần thông báo..."
        placeholderTextColor="#94A3B8"
        value={inputText}
        onChangeText={setInputText}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity
        style={[
          styles.sendButton,
          !inputText.trim() && styles.sendButtonDisabled,
        ]}
        onPress={onSend}
        activeOpacity={0.8}
      >
        <Text style={styles.sendButtonText}>🚀 Bắn Thông Báo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  clearBtnText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  sendButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#A5B4FC',
    shadowOpacity: 0.05,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
