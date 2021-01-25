import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  StatusBar,
  Modal
} from 'react-native'
import colors from './styles/colors';
import InputField from './components/form/InputField';
import NextArrowButton from './components/buttons/NextArrowButton';
import Loader from './components/Loader';
import onSignIn from './providers/auth';
import Backendless from 'backendless';

export default class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validEmail: false,
      validPassword: false,
      validUsername: true,
      username: '',
      emailAddress: '',
      password: '',
      loadingVisible: false,
      modalSignUp: props.modalSignUp
    }

    this.handleNextButton = this.handleNextButton.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUsernameChange(username) {
    this.setState({ username: username });  
    this.setState({ validUsername: true });
  }

  handleEmailChange(email) {
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validEmail } = this.state;
    this.setState({ emailAddress: email });

    if (!validEmail) {
      if (emailCheckRegex.test(email)) {
        this.setState({ validEmail: true });
      }
    } else if (!emailCheckRegex.test(email)) {
      this.setState({ validEmail: true });
    }
  }

  handlePasswordChange(password) {
    const { validPassword } = this.state;

    this.setState({ password });

    if (!validPassword) {
      if (password.length > 4) {
        this.setState({ validPassword: true });
      }
    } else if (password <= 4) {
      this.setState({ validPassword: false });
    }
  }

  handleNextButton() {
    this.setState({ loadingVisible: true });
    
    const { username, emailAddress, password } = this.state;

    let user = new Backendless.User();
    user.username = username;
    user.email = emailAddress;
    user.password = password;
    user["photo"] = "data:image/png;base64,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"

    Backendless.UserService.register(user).then((res) => {
        Backendless.UserService.login(emailAddress, password).then((res) => {
            this.setState({ formValid: true, loadingVisible: false });
            this.props.navigation.navigate({routeName: 'TurnOnNotifications'});
        }).catch((res) => {
            this.setState({ formValid: false, loadingVisible: false });
        });
    }).catch((res) => {
        this.setState({ formValid: false, loadingVisible: false });
    });
  }

  toggleNextButtonState() {
    const { validUsername, validEmail, validPassword } = this.state;
    if (validUsername && validEmail && validPassword) {
      return false;
    }
    return true;
  }

  render() {
    const {
      formValid, loadingVisible, validUsername, validEmail, validPassword, modalSignUp
    } = this.state;

    return(
        <View style={{ flex:1, width: 100 + "%", height: 100 + "%" }}>
            <StatusBar
            barStyle="light-content"
            backgroundColor={colors.green01}
            />
            <KeyboardAvoidingView style={[{ backgroundColor: colors.green01 }, styles.wrapper]}
                behavior="padding">
                <View style={styles.scrollViewWrapper}>
                    <ScrollView style={styles.scrollView}>
                    <Text style={styles.loginHeader}>Novo usuário</Text>
                    <InputField 
                        labelText="NOME DE USUÁRIO"
                        placeholder="Escolha um nickname"
                        labelTextSize={14}
                        labelColor={colors.white}
                        textColor={colors.white}
                        borderBottomColor={colors.white}
                        inputType="text"
                        customStyle={{marginBottom: 30}}
                        onChangeText={this.handleUsernameChange}
                        showCheckmark={false}
                        />
                    <InputField 
                        labelText="ENDEREÇO DE EMAIL"
                        placeholder="Informe seu email"
                        labelTextSize={14}
                        labelColor={colors.white}
                        textColor={colors.white}
                        borderBottomColor={colors.white}
                        inputType="email"
                        customStyle={{marginBottom: 30}}
                        onChangeText={this.handleEmailChange}
                        showCheckmark={validEmail}
                        />
                    <InputField 
                        labelText="SENHA"
                        placeholder="Escolha uma senha"
                        labelTextSize={14}
                        labelColor={colors.white}
                        textColor={colors.white}
                        borderBottomColor={colors.white}
                        showCheckmark={false}
                        inputType="password"
                        customStyle={{marginBottom: 30}}
                        onChangeText={this.handlePasswordChange}
                        />
                    </ScrollView>
                    <View style={styles.nextButton}>
                    <NextArrowButton
                        handleNextButton={this.handleNextButton}
                        disabled={this.toggleNextButtonState()}
                        color={colors.green01}
                    />
                    </View>
                    <Loader
                        modalVisible={loadingVisible}
                        animationType="fade"
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
  }
};

SignUp.propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      goBack: PropTypes.func,
    }).isRequired,
  };

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
    backgroundColor: colors.green01
  },
  scrollViewWrapper: {
    marginTop: 70,
    flex: 1,
    padding: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex: 1
  },
  loginHeader: {
    fontFamily: 'Poppins-Regular',
    fontSize: 34,
    color: colors.white,
    // fontWeight: "300",
    marginBottom: 40
  },
  nextButton: {
    alignItems: 'flex-end',
    right: 20,
    bottom: 0
  }
})