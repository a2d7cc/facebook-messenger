import {Appbar} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.chatContainer}>
        <Text>Chat ID: {chatId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    padding: 16,
  },
});

export default ChatScreen;
