import React from 'react';
import {Appbar} from 'react-native-paper';
import {StyleSheet, View, Text} from 'react-native';
import {useNavigate, useParams} from 'react-router-native';

const ChatScreen = () => {
  const {chatId} = useParams();
  const navigate = useNavigate();
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigate('/')} />
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
