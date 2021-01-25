import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View, Text, TouchableHighlight, StatusBar } from 'react-native';
import colors from './styles/colors';

const transparentHeaderStyle = {
    borderBottomWidth: 0,
    elevation: 0,
};

export default class TurnOnNotifications extends Component {

    static navigationOptions = () => ({
        headerLeft: null,
        headerStyle: transparentHeaderStyle,
        headerTransparent: true,
        gesturesEnabled: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            pressNotifyBtn: false,
            pressSkipBtn: false,
        };

        this.handleNotifyBtnHideUnderlay = this.handleNotifyBtnHideUnderlay.bind(this);
        this.handleNotifyBtnShowUnderlay = this.handleNotifyBtnShowUnderlay.bind(this);
        this.handleSkipBtnHideUnderlay = this.handleSkipBtnHideUnderlay.bind(this);
        this.handleSkipBtnShowUnderlay = this.handleSkipBtnShowUnderlay.bind(this);
    }



    handleNotifyBtnHideUnderlay() {
        this.setState({ pressNotifyBtn: false });
    }
    
    handleNotifyBtnShowUnderlay() {
        this.setState({ pressNotifyBtn: true });
    }
    
    handleSkipBtnHideUnderlay() {
        this.setState({ pressSkipBtn: false });
    }
    
    handleSkipBtnShowUnderlay() {
        this.setState({ pressSkipBtn: true });
    }

    __registerDevice() {

    }

    render() {
        const { pressNotifyBtn, pressSkipBtn } = this.state;
        const { navigation } = this.props;
        const notifyBtnColor = pressNotifyBtn ? '#bb4d21' : '#DF744A';
        
        return(
            <View style={styles.wrapper}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#DF744A"
                />
                <View style={styles.content}>
                    <Icon
                        name="comments-o"
                        size={46}
                        style={styles.icon}
                    />
                    <Text style={styles.title}>
                        Ativar notificações?
                    </Text>
                    <Text style={styles.description}>
                        Podemos avisar quando alguém lhe enviar uma mensagem
                        ou notificá-lo sobre outras atividades importantes da conta.
                    </Text>
                    <TouchableHighlight
                        style={[
                        { backgroundColor: notifyBtnColor },
                        styles.notifyButton,
                        ]}
                        onPress={() => this.__registerDevice()}
                        onShowUnderlay={this.handleNotifyBtnShowUnderlay}
                        onHideUnderlay={this.handleNotifyBtnHideUnderlay}
                        underlayColor='#bb4d21'>
                        <Text style={[{ color: colors.white }, styles.buttonText]}>
                            Sim, notifique-me
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[{ backgroundColor: pressSkipBtn ? colors.gray01 : 'transparent' }, styles.skipButton]}
                        onPress={() => this.props.navigation.navigate({routeName: 'Offers'})}
                        onShowUnderlay={this.handleSkipBtnShowUnderlay}
                        onHideUnderlay={this.handleSkipBtnHideUnderlay}
                        underlayColor={colors.gray01}>
                        <Text style={[{ color: '#DF744A' }, styles.buttonText]}>
                            Pular
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

TurnOnNotifications.propTypes = {
    navigation: PropTypes.shape({
        dispatch: PropTypes.func,
    }).isRequired,
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        marginTop: 80,
        paddingLeft: 20,
        paddingRight: 20,
    },
    icon: {
        color: '#DF744A',
        marginBottom: 15,
    },
    title: {
        fontSize: 28,
        color: colors.black,
        fontWeight: '600',
    },
    description: {
        fontSize: 16,
        paddingRight: 30,
        marginTop: 15,
        lineHeight: 22,
    },
    notifyButton: {
        width: 160,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 3,
        marginTop: 40,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        alignSelf: 'center',
    },
    skipButton: {
        borderColor: '#DF744A',
        width: 100,
        borderWidth: 2,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 3,
        marginTop: 15,
    },
})

