import {Dispatch, SetStateAction} from 'react';
import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';
import {COLOR_FB_SECONDARY, COLOR_WHITE} from '../constants/colors';

type Props = {
  placeholder?: string;
  secure?: boolean;
  value: string;
  onChangeText: Dispatch<SetStateAction<string>>;
};

const Input = ({placeholder, secure, value, onChangeText}: Props) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      secureTextEntry={secure}
      onChangeText={onChangeText}
      placeholderTextColor={COLOR_FB_SECONDARY}
      accessibilityLabelledBy={undefined}
      accessibilityLanguage={undefined}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLOR_WHITE,
    width: '100%',
  },
});

export default Input;
