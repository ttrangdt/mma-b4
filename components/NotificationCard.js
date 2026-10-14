import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const QUICK_SUGGESTIONS = [
  '🔥 Nhắc nhở uống nước',
  '🚀 Hoàn thành bài tập MMA301',
  '🎉 Họp nhóm lúc 15:00',
  '⚡ Deadline nộp bài tập lớn',
];

export default function NotificationCard({ inputText, setInputText, onSend }) {
  return (
    <View style={styles.card}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Nội dung thông báo</Text>
        {inputText.length > 0 && (
          <TouchableOpacity onPress={() => setInputText('')}>
            <Text style={styles.clearBtnText}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nhập thông điệp bạn muốn gửi..."
        placeholderTextColor="#94A3B8"
        value={inputText}
        onChangeText={setInputText}
        multiline
        numberOfLines={3}
      />

      {/* Quick Suggestion Chips */}
      <Text style={styles.chipHeader}>Gợi ý nhanh:</Text>
      <View style={styles.chipsContainer}>
        {QUICK_SUGGESTIONS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chip}
            onPress={() => setInputText(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[
          styles.sendButton,
          !inputText.trim() && styles.sendButtonDisabled,
        ]}
        onPress={onSend}
        activeOpacity={0.8}
      >
        <Text style={styles.sendButtonText}>🚀 Bắn Thông Báo Ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 20,
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
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sendButtonDisabled: {
    backgroundColor: '#A5B4FC',
    shadowOpacity: 0.1,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
