import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList
} from 'react-native';
import Chat from './Chat';
import Backendless from 'backendless';
import firebase from 'firebase';

export default class Inbox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chats:[],
            objectId: ''
        }
    }

    componentDidMount() {
      if(!Backendless.UserService.loggedInUser()){
        this.props.navigation.navigate({routeName: 'LoggedOut'});
      } else {
        this.setState({objectId: Backendless.UserService.loggedInUser()});

        firebase.database().ref('messages').child(Backendless.UserService.loggedInUser())
            .on('value', (snapshot) => {
              for (var i = 0; i < snapshot.numChildren(); i++){
                Backendless.Data.of('Users').findById(Object.keys(snapshot.val())[i]).then((res) => {
                  this.setState((prevState) => {  
                    return {
                        chats: [...prevState.chats, res]
                    }
                  })
                })
              };
                // this.setState((prevState) => {  
                //     return {
                //         chats: [...prevState.chats, snapshot.val()]
                //     }
                // })
            })
      }
    }
    
    _onPressItem = (name) => {
      // alert(Backendless.UserService.loggedInUser())
      this.props.navigation.navigate('Chat', { "name": name, "objectId": 123 })
    };

    renderRow = ({item}) => {
      return(
        <TouchableOpacity 
            activeOpacity={0.9}
            // onPress={() => this._onPressItem(Notification.name) }
          >
          <View style={styles.container}>
              <TouchableOpacity activeOpacity={0.9}>
                  <Image style={styles.image} source={{uri: item.photo}}/>
              </TouchableOpacity>
              <View style={styles.content}>
                  <View style={styles.contentHeader}>
                      <Text  style={styles.name}>{item.username}</Text>
                      <Text style={styles.time}>
                          {/* 9:58 am */}
                      </Text>
                  </View>
                  {/* <Text rkType='primary3 mediumLine'>{Notification.comment}</Text> */}
              </View>
          </View>
        </TouchableOpacity>
      )
    }

    render() {
        return (
            <FlatList
              style={styles.root}
              data={this.state.chats}
              renderItem={this.renderRow}
              keyExtractor= {item => item.key}
              ItemSeparatorComponent={() => {
                  return (
                      <View style={styles.separator}/>
                  )
              }}
            />
        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: "#ffffff",
        marginTop:10,
      },
      container: {
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start'
      },
      content: {
        marginLeft: 16,
        flex: 1,
      },
      contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
      },
      separator: {
        height: 0.5,
        backgroundColor: "#CCCCCC"
      },
      image:{
        width:45,
        height:45,
        borderRadius:20,
        marginLeft:20
      },
      time:{
        fontSize:11,
        color:"#808080",
      },
      name:{
        fontSize:16,
        fontWeight:"bold",
      },
});