import {StyleSheet} from 'react-native';
import Input from '../../shared/components/Input';
import {useNavigate} from 'react-router-native';
import {useState} from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import {
  COLOR_FB_PRIMARY,
  COLOR_FB_SECONDARY,
  COLOR_WHITE,
} from '../../shared/constants/colors';

const RegisterScreen = () => {
  const navigate = useNavigate();

  // write useState for firstName, lastName, password, email
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerHandler = () => {
    // Write code for register user
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.facebookText}>facebook</Text>

        <Input
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        {/* Write like input aboe also for other variable from useState */}
        <Input
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secure={true}
        />
        <Button
          style={styles.registerButton}
          labelStyle={styles.registerButtonText}
          mode="contained"
          onPress={registerHandler}>
          Register
        </Button>
      </View>
      <Button
        labelStyle={styles.signUpText}
        mode="text"
        onPress={() => navigate('/login')}>
        Already have an account? Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLOR_FB_PRIMARY,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  facebookText: {
    fontSize: 56,
    fontWeight: '700',
    color: COLOR_WHITE,
    marginBottom: 32,
  },
  registerButtonContainer: {
    marginTop: 16,
    width: '100%',
  },
  registerButton: {
    backgroundColor: COLOR_FB_SECONDARY,
    height: 48,
    borderRadius: 0,
  },
  registerButtonText: {
    paddingTop: 8,
    fontSize: 24,
  },
  signUpText: {
    color: COLOR_WHITE,
    fontSize: 16,
  },
});

export default RegisterScreen;
