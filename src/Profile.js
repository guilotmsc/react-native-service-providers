import React, { Component } from "react";
import {
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Card } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import Backendless from 'backendless';
import moment from 'moment';

const transparentHeaderStyle = {
    borderBottomWidth: 0,
    elevation: 0,
};

export default class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {
                objectId: '',
                username: '',
                email: '',
                phone: '',
                photo: 'http://www.thecellartrust.org/wp-content/uploads/2017/04/Trustees.jpg',
                bio: '',
                gender: '',
                created: ''
            }
        }
    }

    componentDidMount() {
        if (!Backendless.UserService.loggedInUser()){
            this.props.navigation.navigate({routeName: 'LoggedOut'});
        } else {
            if (this.props.navigation.state.params) {
                this.setState({
                    user: {
                        objectId: this.props.navigation.state.params.updatedUser.objectId,
                        username: this.props.navigation.state.params.updatedUser.username,
                        email: this.props.navigation.state.params.updatedUser.email,
                        photo: this.props.navigation.state.params.updatedUser["photo"] != null ? this.props.navigation.state.params.updatedUser["photo"] : 'http://www.thecellartrust.org/wp-content/uploads/2017/04/Trustees.jpg',
                        bio: this.props.navigation.state.params.updatedUser["bio"],
                        phone: this.props.navigation.state.params.updatedUser["phone"],
                        created: this.props.navigation.state.params.updatedUser["created"],
                        gender: this.props.navigation.state.params.updatedUser["gender"]
                    }
                });
            } else {
                Backendless.UserService.getCurrentUser().then((res) => {
                    this.setState({
                        user: {
                            objectId: res.objectId,
                            username: res.username,
                            email: res.email,
                            photo: res["photo"] != null ? res["photo"] : 'http://www.thecellartrust.org/wp-content/uploads/2017/04/Trustees.jpg',
                            bio: res["bio"],
                            phone: res["phone"],
                            created: res["created"],
                            gender: res["gender"]
                        }
                    });
                }).catch((err) => {
                    alert(err);
                });
            }
        };    
    }

    renderHeader = () => {
        const { username, email, photo, created, gender } = this.state.user;
        const user = this.state.user;

        return (
            <View style={styles.headerContainer}>
                <ImageBackground
                    style={styles.headerBackgroundImage}
                    blurRadius={10}
                    source={{
                        uri: photo,
                    }}
                >
                <View style={styles.headerColumn}>
                    <Image
                    style={styles.userImage}
                    source={{
                        uri: photo,
                    }}
                    />
                    <Text style={styles.userNameText}>{username}</Text>
                    <View style={styles.usernameOutRow}>
                        <View style={styles.usernameRow}>
                            <Text style={styles.usernameText} onPress={() => this.props.navigation.navigate('ProfileEdit', {
                                    user
                                })}>
                                Editar perfil
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>)
    }

    renderBio = () => {
        return (<View style={styles.telContainer}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => alert('pressed')}>
                        <View style={[styles.containerTel, styles.cardContainer]}>
                            <View style={styles.iconRow}>
                                <Icon
                                    size={16}
                                    name="ios-book"
                                    reverse
                                    type='ionicon'
                                    color='#a4517f'
                                    onPress={() => onPressBio()}
                                />
                            </View>
                            <View style={styles.emailRow}>
                                <View style={styles.emailColumn}>
                                    <Text style={styles.emailText}>{this.state.user.bio == null ? 'Nenhuma descrição adicionada' : this.state.user.bio}</Text>
                                </View>
                                <View style={styles.emailNameColumn}>
                                    <Text style={styles.emailNameText}>Bio</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
        )
    }

    renderMail = () => {
        const { email } = this.state.user;
        
        return (<View style={styles.telContainer}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => alert('pressed')}>
                        <View style={[styles.containerTel, styles.cardContainer]}>
                            <View style={styles.iconRow}>
                                <Icon
                                    size={16}
                                    name="ios-mail"
                                    reverse
                                    type='ionicon'
                                    color='#a4517f'
                                    onPress={() => onPressEmail()}
                                />
                            </View>
                            <View style={styles.emailRow}>
                                <View style={styles.emailColumn}>
                                    <Text style={styles.emailText}>{email}</Text>
                                </View>
                                <View style={styles.emailNameColumn}>
                                    <Text style={styles.emailNameText}>Email</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
        )
    }

    renderGender = () => {
        const { gender } = this.state.user;
        
        return (<View style={styles.telContainer}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => alert('pressed')}>
                        <View style={[styles.containerTel, styles.cardContainer]}>
                            <View style={styles.iconRow}>
                                {   gender == 'male' ? 
                                        <Icon
                                            size={16}
                                            name="ios-male"
                                            reverse
                                            type='ionicon'
                                            color='#a4517f'
                                         /> : 
                                    gender == 'female' ? 
                                        <Icon
                                            size={16}
                                            name="ios-female"
                                            reverse
                                            type='ionicon'
                                            color='#a4517f' /> : 
                                        <Icon
                                            size={16}
                                            name="ios-help"
                                            reverse
                                            type='ionicon'
                                            color="#a4517f" />
                                }
                        </View>
                        <View style={styles.emailRow}>
                            <View style={styles.emailColumn}>
                                <Text style={styles.emailText}>{gender == 'male' ? 'Masculino' : gender == 'female' ? 'Feminino' : 'Outro'}</Text>
                            </View>
                            <View style={styles.emailNameColumn}>
                                <Text style={styles.emailNameText}>Gênero</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderPhone = () => {
        return (<View style={styles.telContainer}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => alert('pressed')}>
                        <View style={[styles.containerTel, styles.cardContainer]}>
                            <View style={styles.iconRow}>
                            <Icon
                                size={16}
                                name="ios-call"
                                reverse
                                type='ionicon'
                                color='#a4517f'
                                onPress={() => onPressTel(phone)}
                            />
                        </View>
                        <View style={styles.telRow}>
                            <View style={styles.telNumberColumn}>
                                <Text style={styles.telNumberText}>{this.state.user.phone == null ? 'Nenhum número adicionado' : this.state.user.phone}</Text>
                            </View>
                            <View style={styles.telNameColumn}>
                                <Text style={styles.telNameText}>Telefone</Text>
                            </View>
                        </View>
                        <View style={styles.smsRow}>
                            <Icon
                                size={16}
                                name="ios-chatboxes"
                                reverse
                                type='ionicon'
                                color='#a4517f'
                                onPress={() => onPressSms()}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    renderSeparator() {
        return(<View style={styles.containerSeparator}>
                    <View style={styles.separatorOffset} />
                    <View style={styles.separator} />
                </View>);
    }


    render() {
        return (
            <ScrollView style={styles.scroll}>
                <View style={styles.container}>
                <Card containerStyle={styles.cardContainer}>
                    {this.renderHeader()}
                    {this.renderBio()}
                    {this.renderSeparator()}
                    {this.renderMail()}
                    {this.renderSeparator()}
                    {this.renderGender()}
                    {this.renderSeparator()}
                    {this.renderPhone()}
                </Card>
                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFF',
        borderWidth: 0,
        flex: 1,
        margin: 0,
        padding: 0,
    },
    container: {
        flex: 1,
    },
    emailContainer: {
        backgroundColor: '#FFF',
        flex: 1,
        paddingTop: 30,
    },
    headerBackgroundImage: {
        paddingBottom: 20,
        paddingTop: 35,
    },
    headerContainer: {},
        headerColumn: {
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
            alignItems: 'center',
            elevation: 1,
            marginTop: -1,
            },
            android: {
            alignItems: 'center',
            },
        }),
    },
    placeIcon: {
        color: 'white',
        fontSize: 26,
    },
    scroll: {
        backgroundColor: '#FFF',
    },
    telContainer: {
        backgroundColor: '#FFF',
        flex: 1,
        paddingTop: 30,
    },
    usernameOutRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    usernameRow: {
        backgroundColor: 'transparent',
        marginLeft: 5
    },
    userImage: {
        borderColor: "#DF744A",
        borderRadius: 85,
        borderWidth: 3,
        height: 170,
        marginBottom: 15,
        width: 170,
    },
    userNameText: {
        fontFamily: 'Raleway-Bold',
        color: '#FFF',
        fontSize: 22,
        paddingBottom: 8,
        textAlign: 'center',
    },
    usernameText: {
        fontFamily: 'Raleway-Regular',
        color: '#e8e8e8',
        fontSize: 16,
        paddingBottom: 8,
        textAlign: 'center',
    },
    containerSeparator: {
        flexDirection: 'row',
    },
    separatorOffset: {
        flex: 2,
        flexDirection: 'row',
    },
    separator: {
        flex: 8,
        flexDirection: 'row',
        borderColor: '#EDEDED',
        borderWidth: StyleSheet.hairlineWidth,
    },
    containerTel: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 25,
    },
    iconRow: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoRow: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    smsIcon: {
        color: 'gray',
        fontSize: 30,
    },
    smsRow: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    telIcon: {
        color: "#DF744A",
        fontSize: 30,
    },
    telNameColumn: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    telNameText: {
        fontFamily: 'Raleway-Regular',
        color: '#a4a4a4',
        fontSize: 12
    },
    telNumberColumn: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    telNumberText: {
        fontFamily: 'Raleway-Regular',
        fontSize: 16,
    },
    telRow: {
        flex: 6,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    emailColumn: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    emailIcon: {
        color: "#DF744A",
        fontSize: 30,
    },
    emailNameColumn: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    emailNameText: {
        fontFamily: 'Raleway-Regular',
        color: '#a4a4a4',
        fontSize: 12
    },
    emailRow: {
        flex: 8,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    emailText: {
        fontFamily: 'Raleway-Regular',
        fontSize: 16,
    },
    icon: {
        justifyContent: 'flex-start',
        // marginTop: 2.8,
    }
});