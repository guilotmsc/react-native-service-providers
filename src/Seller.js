import React, { Component } from 'react';
import { View, Text, ScrollView, Image, ImageBackground, StyleSheet, Platform, TouchableOpacity, FlatList } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Card } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import Ratings from './Ratings';

import Backendless from 'backendless';
const RatingsStore = Backendless.Data.of('Ratings');
const dataQuery = new Backendless.DataQueryBuilder();

export default class Seller extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            modalVisible: false,
            seller: {
                objectId: this.props.navigation.state.params.seller.objectId,
                username: this.props.navigation.state.params.seller.username,
                created: this.props.navigation.state.params.seller.created,
                photo: this.props.navigation.state.params.seller.photo,
                bio: this.props.navigation.state.params.seller.bio,
                gender: this.props.navigation.state.params.seller.gender,
                rate: this.props.navigation.state.params.rate
            },
            ratings: []
        }
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    componentDidMount() {
        dataQuery.setWhereClause("sellerId = '" + this.props.navigation.state.params.seller.objectId + "'");

        RatingsStore.find(dataQuery).then((res) => {
            this.setState({ ratings: res });
        }).catch((err) => {
            alert('Erro ao buscar avaliações');
        })
    }

    renderHeader = () => {
        const { username, created, photo } = this.state.seller;

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
                    <TouchableOpacity onPress={() => {
                            this.setState({
                                modalVisible: true,
                            })
                        }}>
                        <Image
                            style={styles.userImage}
                            source={{
                                uri: photo,
                            }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.userNameText}>{username}</Text>
                    <View style={styles.usernameOutRow}>
                        <View style={styles.usernameRow}>
                            <Text style={styles.usernameText}>
                                Membro desde: {moment(new Date(created)).format('DD/MM/YYYY')}
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>)
    }

    renderRating = () => {
        return (<View style={{backgroundColor: '#FFF', flex: 1, paddingTop: 5 + "%"}}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => this.setState({ modalVisible: true })}>
                        <View style={[styles.containerTel, styles.cardContainer]}>
                            <View style={styles.iconRow}>
                                <Icon
                                    size={16}
                                    name="ios-analytics"
                                    reverse
                                    type='ionicon'
                                    color="#4682b4"
                                    onPress={() => onPressBio()}
                                />
                            </View>
                            <View style={styles.emailRow}>
                                <View style={styles.emailColumn}>
                                    <Rating        
                                        imageSize={22}
                                        readonly
                                        startingValue={this.state.seller.rate}
                                    />
                                </View>
                                <View style={styles.emailNameColumn}>
                                    <Text style={styles.emailNameText}>Avaliações</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
        )
    }

    renderBio = () => {
        return (<View style={styles.telContainer}>
                    <TouchableOpacity activeOpacity={0.9}>
                        <View style={[styles.containerTel, styles.cardContainer]}>
                            <View style={styles.iconRow}>
                                <Icon
                                    size={16}
                                    name="ios-book"
                                    reverse
                                    type='ionicon'
                                    color="#4682b4"
                                    onPress={() => onPressBio()}
                                />
                            </View>
                            <View style={styles.emailRow}>
                                <View style={styles.emailColumn}>
                                    <Text style={styles.emailText}>{this.state.seller.bio == null ? 'Nenhuma descrição adicionada' : this.state.seller.bio}</Text>
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

    renderGender = () => {
        const { gender } = this.state.seller;
        
        return (<View style={styles.telContainer}>
                    <TouchableOpacity activeOpacity={0.9}>
                        <View style={[styles.containerTel, styles.cardContainer]}>
                            <View style={styles.iconRow}>
                                {   gender == 'Masculino' ? 
                                        <Icon
                                            size={16}
                                            name="ios-male"
                                            reverse
                                            type='ionicon'
                                            color='#4682b4'
                                         /> : 
                                    gender == 'Feminino' ? 
                                        <Icon
                                            size={16}
                                            name="ios-female"
                                            reverse
                                            type='ionicon'
                                            color='#4682b4' /> : 
                                        <Icon
                                            size={16}
                                            name="ios-help"
                                            reverse
                                            type='ionicon'
                                            color="#4682b4" />
                                }
                        </View>
                        <View style={styles.emailRow}>
                            <View style={styles.emailColumn}>
                                <Text style={styles.emailText}>{gender}</Text>
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

    _getRenderItemFunction = () =>
        this.renderRowRating;

    renderRowRating = ({ item }) => (
        <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => this._onPressItem()}
        >
            <View style={styles.ratingsContainer}>
                <TouchableOpacity activeOpacity={0.9}>
                    <Image style={styles.image} source={{uri: item.avatar}}/>
                </TouchableOpacity>
                <View style={styles.ratingsContent}>
                    <View style={styles.contentHeader}>
                        <Text  style={styles.name}>{item.username}</Text>
                        <Text style={styles.time}>
                            {moment(new Date(item.created)).format('DD/MM/YYYY')}
                        </Text>
                    </View>
                    <Rating
                        imageSize={12}
                        style={{alignItems: 'flex-start'}}
                        readonly
                        startingValue={item.rate}
                    />
                    <Text style={styles.review}>{item.review}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    renderRatings() {
        const groupedData = this.state.ratings;

        return (
            <FlatList
                style={{ backgroundColor: 'white' }}
                data={groupedData}
                renderItem={this._getRenderItemFunction()}
                keyExtractor={item => item.objectId}
                onEndReachedThreshold={0.1}
            />
        );
    }

    renderSeparator() {
        return(<View style={styles.containerSeparator}>
                    <View style={styles.separatorOffset} />
                    <View style={styles.separator} />
                </View>);
    }

    render() {
        return(
            <ScrollView style={styles.scroll}>
                <View style={styles.container}>
                    <Card containerStyle={styles.cardContainer}>
                        {this.renderHeader()}
                        <Text style={{ paddingHorizontal: 15, fontFamily: 'Raleway-Bold', color: '#5F5F5F', fontSize: 14, marginBottom: 10, marginTop: 15}}>Informações</Text>
                        {this.renderRating()}
                        {this.renderSeparator()}
                        {this.renderBio()}
                        {this.renderSeparator()}
                        {this.renderGender()}
                        {this.renderSeparator()}
                        <Text style={{ paddingHorizontal: 15, fontFamily: 'Raleway-Bold', color: '#5F5F5F', fontSize: 14, marginBottom: 10, marginTop: 20}}>Avaliações</Text>
                        {this.renderRatings()}
                    </Card>
                </View>
                <Ratings 
                    modalVisible={this.state.modalVisible}
                    setModalVisible={vis => {
                      this.setState({ modalVisible: vis });
                    }}
                    objectId={this.state.seller.objectId}
                />
            </ScrollView>)
    }
}

const styles = StyleSheet.create({
    // main container
    scroll: {
        backgroundColor: '#FFF',
    },
    container: {
        flex: 1,
    },
    cardContainer: {
        backgroundColor: '#FFF',
        borderWidth: 0,
        flex: 1,
        margin: 0,
        padding: 0,
    },

    // header
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
    headerBackgroundImage: {
        paddingBottom: 20,
        paddingTop: 35,
    },
    userImage: {
        // borderColor: "#DF744A",
        borderColor: "transparent",
        borderRadius: 85,
        borderWidth: 3,
        height: 170,
        marginBottom: 15,
        width: 170,
    },
    usernameOutRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    userOutRow: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    usernameRow: {
        backgroundColor: 'transparent',
        marginLeft: 5
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

    // infos container
    telContainer: {
        backgroundColor: '#FFF',
        flex: 1,
        paddingTop: 10
    },
    containerTel: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    iconRow: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emailColumn: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    emailNameColumn: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    emailNameText: {
        fontFamily: 'Raleway-Regular',
        color: '#a4a4a4',
        fontSize: 12,
        // fontWeight: '200',
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

    // ratings
    root: {
        backgroundColor: "#ffffff",
        marginTop:10,
    },
    ratingsContainer: {
        // paddingLeft: 19,
        marginRight:20,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    ratingsContent: {
        marginLeft: 16,
        flex: 1,
      },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
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
        borderWidth: StyleSheet.hairlineWidth
    },
    image:{
        width:50,
        height:50,
        borderRadius:25,
        marginLeft:20
    },
    time:{
        fontFamily: 'Raleway-Light',
        fontSize:11,
        color:"#808080",
    },
    name:{
        fontSize:16,
        fontFamily: 'Raleway-Medium',
        // fontWeight:"bold",
    },
    review:{
        fontSize:14,
        fontFamily: 'Raleway-Light',
        paddingTop: 1 + "%"
        // fontWeight:"bold",
    },
})