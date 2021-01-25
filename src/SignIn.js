import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  StatusBar
} from 'react-native'
import colors from './styles/colors';
import InputField from './components/form/InputField';
import NextArrowButton from './components/buttons/NextArrowButton';
import Loader from './components/Loader';
import Notification from './components/Notification';
import onSignIn from './providers/auth';
import Backendless from 'backendless';

export default class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validEmail: false,
      validPassword: false,
      emailAddress: '',
      password: '',
      loadingVisible: false,
      formValid: true
    }

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
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
      this.setState({ validEmail: false });
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
    
    const { logIn, navigation } = this.props;
    const { navigate } = navigation;
    const { emailAddress, password } = this.state;

    Backendless.UserService.login(emailAddress, password).then((res) => {
      this.setState({ formValid: true, loadingVisible: false });
      navigate({routeName:'Offers'});
    }).catch((res) => {
      this.setState({ formValid: false, loadingVisible: false });
    });
  }

  toggleNextButtonState() {
    const { validEmail, validPassword } = this.state;
    if (validEmail && validPassword) {
      return false;
    }
    return true;
  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }

  render() {
    const {
      formValid, loadingVisible, validEmail, validPassword,
    } = this.state;

    const showNotification = !formValid;
    const notificationMarginTop = showNotification ? 10 : 0;

    return(
      <View style={{ flex:1, width: 100 + "%", height: 100 + "%" }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#900DA8"
        />
        <KeyboardAvoidingView style={[{ backgroundColor: "#900DA8" }, styles.wrapper]}
          behavior="padding">
          <View style={styles.scrollViewWrapper}>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.loginHeader}>Log In</Text>
              <InputField 
                labelText="ENDEREÇO DE EMAIL"
                placeholder="Insira seu email"
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
                placeholder="Insira sua senha"
                labelTextSize={14}
                labelColor={colors.white}
                textColor={colors.white}
                borderBottomColor={colors.white}
                onChangeText={this.handlePasswordChange}
                showCheckmark={false}
                inputType="password"
                customStyle={{marginBottom: 30}}
                />
            </ScrollView>
            <View style={styles.nextButton}>
              <NextArrowButton
                handleNextButton={this.handleNextButton}
                disabled={this.toggleNextButtonState()}
                color="#900DA8"
              />
            </View>
            <Loader
              modalVisible={loadingVisible}
              animationType="fade"
            />
          </View>
          <View style={[styles.notificationWrapper, { marginTop: notificationMarginTop }]}>
            <Notification
              showNotification={showNotification}
              handleCloseNotification={this.handleCloseNotification}
              type="Ops,"
              firstLine=" parece que as informaçoes estão incorretas. "
              secondLine="Por favor, tente novamente..."
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
};

SignIn.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
    backgroundColor: "#900DA8"
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
    fontFamily: 'Raleway-Regular',
    fontSize: 34,
    color: colors.white,
    // fontWeight: "300",
    marginBottom: 40
  },
  nextButton: {
    alignItems: 'flex-end',
    right: 20,
    bottom: 0
  },
  notificationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})