import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableHighlight
} from "react-native";
import { Rating, AirbnbRating } from 'react-native-ratings';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import InputField from './components/form/InputField';
import RoundedButton from './components/buttons/RoundedButton';
import colors from './styles/colors';

import Backendless from 'backendless';
const RatingsStore = Backendless.Data.of('Ratings');

class Ratings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ownerUsername: '',
            ownerAvatar: '',
            objectId: '',
            review: '',
            rate: 2.5,
            modalVisible: props.modalVisible,
            loadingVisible: false
        }

        this.handleSaveRating = this.handleSaveRating.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            modalVisible: nextProps.modalVisible,
            objectId: nextProps.objectId
        });
    }

    componentDidMount() {
        Backendless.UserService.getCurrentUser().then((res) => {
            this.setState({
                ownerUsername: res.username,
                ownerAvatar: res["photo"]
            });
        }).catch((err) => {
            alert(err);
        });
    }

    handleSaveRating() {
        const { objectId, ownerUsername, ownerAvatar, review, rate } = this.state;
        const rating = new Object();

        this.setState({ loadingVisible: true });
      
        rating.sellerId = objectId;
        rating.username = ownerUsername;
        rating.avatar = ownerAvatar;
        rating.review = review;
        rating.rate = rate;

        RatingsStore.save(rating).then((res) => {
            this.setState({ loadingVisible: false })

            let dataQueryBuilder = Backendless.DataQueryBuilder.create().setProperties( "Avg(rate)");
            dataQueryBuilder.setWhereClause("sellerId = '" + objectId + "'");
            RatingsStore.find(dataQueryBuilder).then((result) => {
                result.avg;
            })

            this.props.setModalVisible(false);
        }).catch((err) => {
            alert(err);
            this.setState({ loadingVisible: false })
        })
    }

    toggleRatingButtonState() {
        const { review } = this.state;

        if (review.length > 0) {
            return false;
        }
        return true;
    }

    render() {

        const { loadingVisible, modalVisible } = this.state;

        return (
            <Modal transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        this.props.setModalVisible(false);
                    }}>
                <View style={{
                        flex: 1,
                        backgroundColor: '#00000080',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'}}>
                    <View style={{
                            backgroundColor: '#fff', padding: 20,
                            width: 90 + "%",
                            height: 65 + "%"}}>
                        <TouchableHighlight onPress={() => this.props.setModalVisible(false)}>
                            <Text style={{ fontFamily: 'Raleway-Regular', textAlign: 'center', fontSize: 22 }}>
                                Avaliação
                            </Text>
                        </TouchableHighlight>    
                        <TouchableHighlight>                
                            <Text style={{ fontFamily: 'Raleway-Regular', fontSize: 14, marginTop: 5 + "%", color: "#a4a4a4" }}>
                                Diga algo sobre este vendedor e dê uma nota
                            </Text>
                        </TouchableHighlight>
                        <View style={{ flex:1, width: 100 + "%", height: 100 + "%" }}>
                            <InputField 
                                labelText=""
                                placeholder="Escreva aqui uma avaliação"
                                labelTextSize={14}
                                labelColor={colors.lightBlack}
                                textColor={colors.lightBlack}
                                borderBottomColor="#a4a4a4"
                                showCheckmark={false}
                                inputType="text"
                                customStyle={{marginBottom: 30}}
                                onChangeText={(text) => this.setState({ review: text })}
                                multiline={true}
                            />
                            <AirbnbRating
                                count={5}
                                reviews={["Péssimo", "Ruim", "Regular", "Bom", "Ótimo"]}
                                defaultRating={this.state.rate}
                                size={32}
                                onFinishRating={(rate) => {
                                    this.setState({rate: rate});
                                }}
                            />
                        </View>
                        <View style={styles.createButton}>
                            <RoundedButton
                                text="Enviar"
                                textColor={colors.white}
                                textAlign="left"
                                background="#900DA8"
                                borderColor="transparent"
                                iconPosition="left"
                                disabled={this.toggleRatingButtonState()}
                                loading={loadingVisible}
                                icon={(
                                <View style={styles.buttonIcon}>
                                    <FontAwesomeIcon name="angle-right" color={colors.white} size={30} />
                                </View>
                                )}
                                handleOnPress={this.handleSaveRating}
                            />
                        </View>
                    </View>

                </View>
            </Modal>
        );
    }
}
export default Ratings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    createButton: {
        position: 'absolute',
        bottom: 0,
        right: 10,
        width: 110,
    },
    buttonIcon: {
        position: 'absolute',
        right: 0,
        top: '50%',
        marginTop: -16,
    }
});