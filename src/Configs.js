import React, { Component } from 'react';
import { ScrollView, Switch, StyleSheet, Text, View } from 'react-native';
import { Avatar, ListItem, Icon } from 'react-native-elements';
import Loader from './components/Loader';
import Backendless from 'backendless';

import { colors, fonts } from './styles';

class Configs extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            photo: '',
            isLogged: false,
            pushNotifications: true,
            modalVisible: false,
            loadingVisible: false
        }

        this.onChangePushNotifications = this.onChangePushNotifications.bind(this);
    }

    componentDidMount() {
        if(Backendless.UserService.loggedInUser()){
            Backendless.UserService.getCurrentUser().then((res) => {
                this.setState({ 
                    username: res.username,
                    email: res.email,
                    photo: res["photo"],
                    isLogged: true
                });
            }).catch((err) => {
                alert(err);
            })
        } else {
            this.setState({isLogged: false, 
                            photo: 'http://www.thecellartrust.org/wp-content/uploads/2017/04/Trustees.jpg'});
        }
    }

    onPressOptions = () => {
        // this.props.navigation.navigate('options')
    }

    onPressOptions = () => {
        this.setState({
            modalVisible: true
        });
    };

    onChangePushNotifications() {
        this.setState({pushNotifications: !this.state.pushNotifications})
    }

    logOut() {
        this.setState({ loadingVisible: true });

        Backendless.UserService.logout().then((res) => {
            this.setState({ isLogged: false, 
                            loadingVisible: false, 
                            photo: 'http://www.thecellartrust.org/wp-content/uploads/2017/04/Trustees.jpg' });
        }).catch((err) => {
            this.setState({ loadingVisible: false });
        })
    }

    renderNotifications() {
        if (this.state.isLogged) {
            return(
                <View>
                    <View style={styles.container}>
                        <Text style={styles.infoText}>Ajustes</Text>
                    </View>
                    
                    <View>
                        <ListItem
                            hideChevron
                            title="Ativar notificações"
                            containerStyle={styles.listItemContainer}
                            titleStyle={{fontSize:14, fontFamily:'Raleway-Regular'}}
                            rightElement={
                            <Switch
                                onValueChange={this.onChangePushNotifications}
                                value={this.state.pushNotifications}
                            />
                            }
                            leftIcon={
                                <Icon
                                    size={16}
                                    reverse
                                    name='ios-notifications'
                                    type='ionicon'
                                    color='#517fa4'
                                    />
                            }
                        />
                    </View>
                </View>)
        } else {
            return null;
        }
    }

    renderFeedbackAndLogout() {
        if (this.state.isLogged) {
            return(
                <View>
                    <ListItem
                        title="Envie seu feedback"
                        onPress={() => this.onPressOptions()}
                        containerStyle={styles.listItemContainer}
                        titleStyle={{fontSize:14, fontFamily:'Raleway-Regular'}}
                        leftIcon={
                            <Icon
                                size={16}
                                reverse
                                name='ios-book'
                                type='ionicon'
                                color='#fa7f72'
                            />
                        }
                    />
                    <ListItem
                        title="Log-Out"
                        onPress={() => this.logOut()}
                        containerStyle={styles.listItemContainer}
                        titleStyle={{fontSize:14, fontFamily:'Raleway-Regular'}}
                        leftIcon={
                            <Icon
                                size={16}
                                reverse
                                name='ios-log-out'
                                type='ionicon'
                                color='gray'
                            />
                        }
                    />
                </View>
            )
        } else {
            return null;
        }
    }

    render() {
        const { username, email, photo, isLogged, loadingVisible } = this.state;

        return (
        <ScrollView style={styles.scroll}>
            <View style={styles.userRow}>
                <View style={styles.userImage}>
                    <Avatar
                    rounded
                    size="large"
                    source={{
                        uri: photo,
                    }}
                    />
                </View>
                { isLogged ? 
                    <View>
                        <Text style={{ fontSize: 18, fontFamily:'Raleway-Medium' }}>{username}</Text>
                        <Text
                            style={{
                                color: '#a4a4a4',
                                fontFamily:'Raleway-Light',
                                fontSize: 16,
                            }}>
                            {email}
                        </Text>
                    </View> : 
                    <View style={{justifyContent: 'center'}}>
                        <Text style={{ fontSize: 18, fontFamily:'Raleway-Medium' }}>
                            Cadastre-se ou entre
                        </Text>
                    </View> 
                }
            </View>

            { this.renderNotifications() }

            <View style={styles.container}>
                <Text style={styles.infoText}>Informações</Text>
            </View>
            <View>
                <ListItem
                    title="Dúvidas frequentes"
                    rightTitleStyle={{ fontSize: 15 }}
                    onPress={() => this.props.navigation.navigate({routeName: 'FAQ'})}
                    containerStyle={styles.listItemContainer}
                    titleStyle={{fontSize:14, fontFamily:'Raleway-Regular'}}
                    leftIcon={
                        <Icon
                            size={16}
                            reverse
                            name='md-help'
                            type='ionicon'
                            color='#a4517f'
                        />
                    }
                />
                <ListItem
                    title="Termos de uso"
                    rightTitleStyle={{ fontSize: 15 }}
                    onPress={() => this.props.navigation.navigate({routeName: 'TermsAndConditions'})}
                    containerStyle={styles.listItemContainer}
                    titleStyle={{fontSize:14, fontFamily:'Raleway-Regular'}}
                    leftIcon={
                        <Icon
                            size={16}
                            reverse
                            name='ios-paper'
                            type='ionicon'
                            color='#51a476'
                        />
                    }
                />
                <ListItem
                    title="Dicas de segurança"
                    rightTitleStyle={{ fontSize: 15 }}
                    onPress={() => this.props.navigation.navigate({routeName: 'Seller'})}
                    containerStyle={styles.listItemContainer}
                    titleStyle={{fontSize:14, fontFamily:'Raleway-Regular'}}
                    leftIcon={
                        <Icon
                            size={16}
                            reverse
                            name='ios-lock'
                            type='ionicon'
                            color='#409bb5'
                        />
                    }
                />
            </View>

            <View style={styles.container}>
                <Text style={styles.infoText}>Mais</Text>
            </View>
            <View>
            <ListItem
                title="Sobre nós"
                onPress={() => this.onPressOptions()}
                containerStyle={styles.listItemContainer}
                titleStyle={{fontSize:14, fontFamily:'Raleway-Regular'}}
                leftIcon={
                    <Icon
                        size={16}
                        reverse
                        name='ios-information-circle'
                        type='ionicon'
                        color='#a4517f'
                    />
                }
            />
            <ListItem
                title="Compartilhe este App"
                onPress={() => this.onPressOptions()}
                containerStyle={styles.listItemContainer}
                titleStyle={{fontSize:14, fontFamily:'Raleway-Regular'}}
                leftIcon={
                    <Icon
                        size={16}
                        reverse
                        name='md-share'
                        type='ionicon'
                        color='#4682b4'
                    />
                }
            />
            <ListItem
                title="Avalie na Google/App Store"
                onPress={() => this.onPressOptions()}
                containerStyle={styles.listItemContainer}
                titleStyle={{fontSize:14, fontFamily:'Raleway-Regular'}}
                leftIcon={
                    <Icon
                        size={16}
                        reverse
                        name='ios-star'
                        type='ionicon'
                        color='#fbec5d'
                    />
                }
            />

            { this.renderFeedbackAndLogout() }
            
            </View>
            <Loader
                modalVisible={loadingVisible}
                animationType="fade"
            />
        </ScrollView>
        )
    }
}

export default Configs


const styles = StyleSheet.create({
    scroll: {
      backgroundColor: '#F4F5F4',
    },
    userRow: {
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 6,
    },
    userImage: {
        marginRight: 12,
    },
    listItemContainer: {
        height: 55,
        borderWidth: 0.5,
        borderColor: '#ECECEC'
    },
    container: {
        paddingTop: 20,
        paddingBottom: 12,
        backgroundColor: '#F4F5F4',
    },
    infoText: {
        fontFamily:'Raleway-SemiBold',
        fontSize: 14,
        marginLeft: 20,
        color: '#5F5F5F'
    },
    iconContainer: {
        alignItems: 'flex-start',
        backgroundColor: 'white',
        borderColor: 'transparent',
        borderRadius: 10,
        borderWidth: 1,
        height: 34,
        justifyContent: 'center',
        width: 34,
    },
  })