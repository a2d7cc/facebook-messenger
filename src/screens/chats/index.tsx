import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Avatar} from 'react-native-paper';

export const ChatsScreen = () => {
  const friends = [{id: 1, name: 'John'}];

  return (
    <View style={styles.container}>
      {friends.map(friend => (
        <Pressable key={friend.id} onPress={() => {}}>
          <View style={styles.friend}>
            <Avatar.Image
              size={72}
              style={styles.profilePicture}
              source={{
                uri: `https://randomuser.me/api/portraits/men/${friend.id}.jpg`,
              }}
            />
            <View>
              <Text>{friend.name}</Text>
              <Text>This was a last message | Sun</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  friend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  profilePicture: {
    marginRight: 8,
  },
});
