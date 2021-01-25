import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  FlatList,
  Button
} from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import firebase from 'firebase';
import Backendless from 'backendless';
import moment from 'moment';

export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            messageList: [],
            textMessage: ''
        };
    }

    componentWillMount() {
        firebase.database().ref('messages').child(Backendless.UserService.loggedInUser()).child(this.props.navigation.getParam('objectId'))
            .on('child_added', (value) => {
                this.setState((prevState) => {
                    return {
                        messageList: [...prevState.messageList, value.val()]
                    }
                })
            })
    }

    static navigationOptions = ({navigation}) => {
        return{
            headerLeft:(<HeaderBackButton onPress={()=>{navigation.navigate('Inbox')}}/>),
            headerTintColor: 'gray'
        }
    }

    renderDate = (date) => {
        return(
            <Text style={styles.time}>
                {moment(date).format('h:mm:ss a')}
            </Text>
        );
    }

    handleChange = key => val => {
        this.setState({[key] : val})
    }

    sendMessage = async () => {
        if(this.state.textMessage.length > 0) {
            let msgId = firebase.database().ref('messages').child(this.props.navigation.getParam('objectId')).child(Backendless.UserService.loggedInUser()).push().key;
            let updates = {};
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: Backendless.UserService.loggedInUser()
            }
            updates['messages/' + Backendless.UserService.loggedInUser() + '/' + this.props.navigation.getParam('objectId') + '/' + msgId] = message;
            updates['messages/' + this.props.navigation.getParam('objectId') + '/' + Backendless.UserService.loggedInUser() + '/' + msgId] = message;

            firebase.database().ref().update(updates);
            this.setState({textMessage: ''});
        }
    }

    renderRow = ({item}) => {
        return (
            <View>
                { item.from == Backendless.UserService.loggedInUser() ?
                    <View style={[styles.item, styles.itemOut]}>
                        {this.renderDate(item.time)}
                        <View style={[styles.balloon]}>
                        <Text>{item.message}</Text>
                        </View>
                    </View>
                : <View style={[styles.item, styles.itemIn]}>
                    {this.renderDate(item.time)}
                    <View style={[styles.balloon]}>
                    <Text>{item.message}</Text>
                    </View>
                </View>}
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'center'}}>
                    <Text style={{ fontSize: 20, fontWeight: '700', paddingHorizontal: 10, paddingTop: 15 }}>
                        { this.props.navigation.getParam('name', null) }
                    </Text>
                </View>
                <FlatList style={styles.list}
                    data={this.state.messageList}
                    renderItem={this.renderRow}
                    keyExtractor= {(item, index) => index.toString}
                />
                <View style={styles.footer}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Escreva uma mensagem..."
                        underlineColorAndroid='transparent'
                        value={this.state.textMessage}
                        onChangeText={this.handleChange('textMessage')}/>
                </View>
                <TouchableOpacity style={styles.btnSend}
                    onPress={this.sendMessage}>
                    <Image source={{uri:"https://png.icons8.com/small/75/ffffff/filled-sent.png"}} style={styles.iconSend}  />
                </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 22,
        alignSelf: 'center'
    },
    list:{
        paddingHorizontal: 17,
    },
    footer:{
        flexDirection: 'row',
        height:60,
        backgroundColor: '#eeeeee',
        paddingHorizontal:10,
        padding:5,
    },
    btnSend:{
        backgroundColor:"#00BFFF",
        width:40,
        height:40,
        borderRadius:360,
        alignItems:'center',
        justifyContent:'center',
    },
    iconSend:{
        width:30,
        height:30,
        alignSelf:'center',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        height:40,
        flexDirection: 'row',
        alignItems:'center',
        flex:1,
        marginRight:10,
    },
    inputs:{
        height:40,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    balloon: {
        maxWidth: 250,
        padding: 10,
        borderRadius: 20,
    },
    itemIn: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffeaea'
    },
    itemOut: {
        alignSelf: 'flex-end',
        backgroundColor: '#f2f2f2'
    },
    time: {
        alignSelf: 'flex-end',
        margin: 15,
        fontSize:12,
        color:"#808080",
    },
    item: {
        marginVertical: 5,
        flex: 1,
        flexDirection: 'row',
        // backgroundColor:"#eeeeee",
        borderRadius:300,
        padding:5,
    },
});  