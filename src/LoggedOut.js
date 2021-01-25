import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    Text,
    View,
    Image,
    TouchableHighlight,
    ScrollView,
    StyleSheet,
    StatusBar,
    Modal
} from 'react-native'
import RoundedButton from './components/buttons/RoundedButton';
import NavBarButton from './components/buttons/NavBarButton';
import Loader from './components/Loader';
import colors from './styles/colors';

// Facebook signin
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
// Google signin
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

import Backendless from 'backendless';

let termsTextSize = 13;
let headingTextSize = 22;
const transparentHeaderStyle = {
    borderBottomWidth: 0,
    elevation: 0,
};

export default class LoggedOut extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loadingVisible: false
        }

        this.onCreateAccountPress = this.onCreateAccountPress.bind(this);
        this.onFacebookPress = this.onFacebookPress.bind(this);
    }

    static navigationOptions = ({ navigation }) => ({
        headerRight: <NavBarButton handleButtonPress={() => navigation.navigate({routeName:'SignIn'})} location="right" color={colors.white} text="Log In" />,
        headerLeft: <NavBarButton handleButtonPress={() => navigation.navigate({routeName:'Offers'})} location="left" color={colors.white} text="Voltar" />,
        headerStyle: transparentHeaderStyle,
        headerTransparent: true,
        headerTintColor: colors.white,
    });

    // facebook signin
    async onFacebookPress() {
        try { 
            let result = await LoginManager.logInWithReadPermissions(['public_profile', 'user_gender', 'user_birthday'])

            if (result.isCancelled) {
                alert('login is cancelled')
            } else {
                AccessToken.getCurrentAccessToken().then((data) => {
                    let accessToken = data.accessToken;
        
                    // // Start the graph request.
                    let facebookFieldsMapping = {
                        "first_name":"username", "email":"email", "gender":"gender", "birthday": "birthdate", "picture.width(100).height(100)": "photo"
                    }
                    
                    Backendless.UserService.loginWithFacebookSdk(accessToken.toString(), facebookFieldsMapping, true).then((res) => {
                        this.props.navigation.navigate({routeName:'Offers'});
                    }).catch((err) => {
                        alert('Error fetching data: ' + err.toString());
                    });
                })
            }
        } catch(err) {
            alert(err);
        }
    }

    // google signin
    async onGooglePress() {
        try {
            await GoogleSignin.hasPlayServices();
            
            const userInfo = await GoogleSignin.signIn();
            alert('Success: ' + userInfo.toString())
            
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    }

    onCreateAccountPress() {
        this.props.navigation.navigate({routeName:'SignUp'})
    }

    render() {
        const { loadingVisible } = this.state;

        return(
            <ScrollView style={styles.wrapper}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#DF744A"
                />
                <View style={styles.welcomeWrapper}>
                    <Image
                        source={require('../assets/img/4mega-logo.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.welcomeText}>
                        Bem vindo ao 4MEGA.
                    </Text>
                    <RoundedButton
                        text="Continuar com o Facebook"
                        textColor='white'
                        background="#3c5a99"
                        icon={<Icon name="facebook" size={20} style={styles.facebookButtonIcon} />}
                        handleOnPress={this.onFacebookPress}
                    />
                    <RoundedButton
                        text="Continuar com o Google"
                        textColor='white'
                        background="#D44638"
                        icon={<Icon name="google" size={20} style={styles.googleButtonIcon} />}
                        handleOnPress={this.onGooglePress}
                    />
                    <RoundedButton
                        text="Crie sua conta"
                        textColor={colors.white}
                        handleOnPress={this.onCreateAccountPress}
                    />
                    <TouchableHighlight
                        style={styles.moreOptionsButton}
                        onPress={this.onMoreOptionsPress}
                    >
                        <Text style={styles.moreOptionsButtonText}>
                        {/* Mais opções */}
                        </Text>
                    </TouchableHighlight>
                    <View style={styles.termsAndConditions}>
                        <Text style={styles.termsText}>
                            Ao continuar com alguma das 
                        </Text>
                        <Text style={styles.termsText}>
                            {' etapas,'}
                        </Text>
                        <Text style={styles.termsText}>
                            {"Eu concordo com os "}
                        </Text>
                        <TouchableHighlight style={styles.linkButton}>
                            <Text style={styles.termsText}>
                                Termos de Serviço
                            </Text>
                        </TouchableHighlight>
                        <Text style={styles.termsText}>
                            {" e "}
                        </Text>
                        <TouchableHighlight style={styles.linkButton}>
                            <Text style={styles.termsText}>
                                Política de Privacidade
                            </Text>
                        </TouchableHighlight>
                        <Text style={styles.termsText}>
                            {" do 4MEGA. "}
                        </Text>
                    </View>
                </View>
                <Loader
                    modalVisible={loadingVisible}
                    animationType="fade"
                />
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        display: 'flex',
        backgroundColor: '#DF744A',
    },
    welcomeWrapper: {
        flex: 1,
        display: 'flex',
        marginTop: 30,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 80,
        marginTop: 50,
        marginBottom: 40,
    },
    welcomeText: {
        fontSize: headingTextSize,
        color: colors.white,
        fontWeight: '300',
        marginBottom: 40,
        fontFamily: 'Raleway-Medium',
    },
    facebookButtonIcon: {
        color: 'white',
        position: 'relative',
        left: 20,
        zIndex: 8,
    },
    googleButtonIcon: {
        color: 'white',
        position: 'relative',
        left: 20,
        zIndex: 8,
    },
    moreOptionsButton: {
        marginTop: 10,
    },
    moreOptionsButtonText: {
        color: colors.white,
        fontSize: 16,
    },
    termsAndConditions: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginTop: 30,
    },
    termsText: {
        fontFamily: 'Raleway-Medium',
        color: colors.white,
        fontSize: 12,
        // fontWeight: '600',
    },
    linkButton: {
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
    },
})