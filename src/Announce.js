import React, { Component } from 'react';
import { View, Text, Image, Picker, ScrollView, TouchableHighlight, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { sha256 } from 'react-native-sha256';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { TextInputMask } from 'react-native-masked-text';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import InputField from './components/form/InputField';
import RoundedButton from './components/buttons/RoundedButton';
import colors from './styles/colors';

import Backendless from 'backendless';
const OffersStore = Backendless.Data.of('Offers');

export default class Announce extends Component {

    constructor(props) {
        super(props);

        this.state = {
            objectId: '',
            title: '',
            description: '',
            category: '',
            price: '',
            photo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAKAAoADASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAMEBQYBAgf/xAAzEAEAAgEBBAcHBQEBAQEAAAAAAQIDBBEhMVEFFTRBcpGxEhMUIlNhcTJCgZKhYlJDM//EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD9cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABLi0+XLG3HjmY5giFn4HUfSnzg+B1H0p84BWFn4HUfSnzg+B1H0p84BWFn4HUfSnzg+B1H0p84BWFn4HUfSnzg+B1H0p84BWFn4HUfSnzg+B1H0p84BWFn4HUfSnzg+B1H0p84BWEuXT5cUbcmOYjmiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABc6N08Z8s2vG2le7nLaiIiNyr0Zj93pazPG3zStgAAAAAAAAAAAA8mImN7F6S08YMsWpGylu7lLbVOksfvNLae+vzQDDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfeGk5c1KR+6dj4X+h8ftZrZJ4VjZ/Mg14jZERHCHoAAAAAAAAAAAAAPJiJiYnhL0Bzeak48t6T+2dj4X+l8fs565I4Wjf+YUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATafT5NRbZSN0cZnhAIRs4ejsVIicm28+ULEabDEbsVPIHPDovh8P0sf9YPh8P0sf9YBzo6L4fD9LH/WD4fD9LH/WAYGPHfLeK46za08m5osHw+GK8bTvmfumpStI2UrFY+0bH0AAAAAAAAAAAAAAAACvrcHxGGa8LRvifuw8mO+O01vWazHN0j5vSt42XrFo+8bQc0Oi+Hw/Sx/1g+Hw/Sx/1gHOjovh8P0sf9YPh8P0sf8AWAc6OhnTYJjfip5K+bo3DeJnHtpPnAMYTajT5NPbZeN3dMcJQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAm0uCdRmikbo4zPKG9ix1xUilI2VhU6JxRTT+3P6rz/AIvAAAAAAAAAAAA8mYrEzaYiI75B6KGfpLFTbGOJvPPhCll1+e/C3sRyqDbfM5KRxvWP5c7a97/qtafzL5B0kZKTwvWf5fTmX1W96fptaPxIOlGHi1+enG3txysvYOkcd9kZImk+cAvDyJi0RNZiYnvh6AAAAAAAAAAD4y465aTS8bYlg6rBOnzTSd8cYnnDoVHpbF7en9uONJ/wGMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADodHGzS4vDCZFpOy4fBHolAAAAAAAAABT1+rjBX2ab8k/4CTVaumnjfvv3VhjajU5M9vntu7qxwhFa02tNrTM2njMvAAAAAAAAATafU5MFvktu76zwls6XV01Ebt1++ssB7W01tFqzMWjhMA6YU9BrIz19m+7JH+rgAAAI9Rk91gvfviNsA+c+pxYd2S8RPLjLzDqsOadlL/NyncwLWm1ptadszvmXkTMTtjiDpxBoss5tNS9uPCU4CHWRt0uXwymRavsubwT6A50AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHRaTsuHwR6JUWk7Lh8EeiUAAAAAAAHk/cEOs1EafDNuNp3Vj7sC9pvabWnbad8yn12f3+eZifljdX8K4AAD2ImZ2REzM90LGj0l9Rbb+mkcbNjT6fHgrsx1398zxkGTi6Pz33zEUj/qVivRU/uyx/FWoAy7dFT+3LH81V8vR+em+Ii8f8y3AHMzExOyYmJjul46HUafHnrsyV390xxhj6zSX087f1UnhYFYAHtLTS0WrOy0b4lv6PURqMMW4WjdaPu59Y0Of3GeJn9E7rA3x5+HoD4zY4y4r0n90bH2A5rJjtivNLxstDylZvaK1iZtPCIdFlxUyxsyUrb8wYsOPF/+dK1nnEA+dJi9zp6UnjHH8pgARavsubwT6JUWr7Lm8E+gOdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0Wk7Lh8EeiVFpOy4fBHolAAAAAAAVOk8vutNMR+q/ywtsfpfJ7WorTurH+yCgAAsaLTTqMuzhSN9pV2/osPuNPWv7p32/IJqVrSsVpGyscIfQAAAAAPm9a3rNbxtrPGH0AwNbp50+XZxpO+sq7f12H3+ntX90b6/lgAAA3OjMvvdNETPzU+WVtj9EZPZ1Fqd1o/wBhsAAAAAAAItX2XN4J9EqLV9lzeCfQHOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6LSdlw+CPRKi0nZcPgj0SgAAAAAAOf1tva1eWf+tjoHN5t+a/ikHwACfRY/earHWeG3bP8OgYvRMbdXt5VltAAAAAAAAAOf1tPd6rJWOG3bH8ugYvS0bNXt51gFIAE+it7OrxT/wBbHQObw7s1PFDpAAAAAAAEWr7Lm8E+iVFq+y5vBPoDnQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdFpOy4fBHolRaTsuHwR6JQAAAAAAHOZ42Z8kcrT6ujYPSNfY1mT7ztBWABc6Kts1cRziYbbnNPk91npflO10UTtjbHCQegAAAAAAAMTpW23VzHKIhtTOyNsud1GT3ue9+cgjABJgjbnxxztHq6Ng9HV9vWY/tO1vAAAAAAAItX2XN4J9EqLV9lzeCfQHOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6LSdlw+CPRKi0nZcPgj0SgAAAAAAMrpnH82PJHf8stVDrMXvtPenfxj8g54JjZO8AbPReo95h93afmp/sMZ94clsWSL0nZaAdIINLqKajHtrutHGvJOAAAAACDVaimnx7bb7TwrzBB0pqPd4fd1n5r/wCQxn3lyWy5Jvedsy+AAIjbO4Gl0Nj+a+Se75YaqHR4vc6elO/jP5TAAAAAAAItX2XN4J9EqLV9lzeCfQHOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6LSdlw+CPRKi0nZcPgj0SgAAAAAAAAx+lNP7vJ7ysfJbj9pUHSZcdcuO1LxtrLB1WC2nyzW3DunnAIQAfWPJbHeLUtMWjvamm6SraIrnj2Z5xwZIDpaXreu2lotHOJfTma2tWdtZmJ+0pq6vPEbstvPaDoHze9aV23tFY5zLBtq88xvy289iG1rWnbaZmfvINXU9JUrE1wR7U/8AqeDLyZLZLza9pm0975AAAF/orT+8ye9tHy14feVbS4LajLFa8O+eUN7FjrixxSkbKwD7AAAAAAAARavsubwT6JUWr7Lm8E+gOdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0Wk7Lh8EeiVFpOy4fBHolAAAAAAAAARajDTPjmt4/E8koDntTpr6e+y++vdbulC6W9K5KzW8RNZ7pZeq6NtXbbBPtR/wCZ4gzh7as1tstExMd0vAAAAAAe1rNrbKxMzPdAPE2m019RfZTdXvt3Qt6bo21tls/yx/5ji1KUrjrFaViKx3QD40+GmDH7NI/M80oAAAAAAAAAItX2XN4J9EqLV9lzeCfQHOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6LSdlw+CPRKrdH3i+kxzyjYsgAAAAAAAAAAAAjy4ceWNmSkWUsvRlJ347zX7TvaIDFv0bmj9M1t/KOdDqI/wDnPnDeAYMaHUT/APOfOElOjc0/qmtf5bQDOxdGUjfkvNvtG5dxYceKNmOkVSAAAAAAAAAAAAACLV9lzeCfRKrdIXimkyTzjZ5gwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaHROf2LzitO62+Py13McGtotfW0RTPOy3dbukGiPI3vQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeTuB6yOls8XvGKs7q75/KbW6+tYmmCdtu+3dDJ4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmw6nLh3Y7zEcu5PHSWeI/ZP8KQC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC91nn5U8jrPPyp5KIC7PSWeY/ZH8IM2py5t2S8zHLuQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k=',
            loadingVisible: false,
            images: [],
            imagesUp: []
        }

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleCreateAnnounce = this.handleCreateAnnounce.bind(this);
    }

    componentDidMount() {
        if(!Backendless.UserService.loggedInUser()){
            this.props.navigation.navigate({routeName: 'LoggedOut'});
        } else {
            this.setState({
                objectId: Backendless.UserService.loggedInUser()
            });
        }
    }


    handleCreateAnnounce() {
        
        this.setState({ loadingVisible: true });

        let imgs = this.state.imagesUp;
        const { title, description, category, price, photo } = this.state;

        this.uploadFiles(imgs).then((imagesPath) => {
            const offer = new Object();
      
            offer.title = title;  
            offer.description = description;
            offer.category = category;
            offer.price = price;
            offer.base64 = photo
            offer.imagesPath = imagesPath;

            OffersStore.save(offer).then((res) => {
                this.setState({ loadingVisible: false })
                this.props.navigation.navigate({routeName: 'Offers'});
            }).catch((err) => {
                alert(err);
                this.setState({ loadingVisible: false })
            })
        }).catch((err) => {
            alert('Ocorreu um erro ao salvar as imagens');
        })
    }

    handleTitleChange(title) {
        this.setState({ title: title });
    }

    handleDescriptionChange(description) {
        this.setState({ description: description });
    }

    handlePriceChange(price) {
        this.setState({ price: price });
    }

    toggleAnnounceButtonState() {
        const { title, description, category, price } = this.state;

        if (title.length > 0 && description.length > 0 && price.length > 0 && category != '') {
          return false;
        }
        return true;
    }

    selectPhotoTapped() {
        const options = {
            title: 'Inserir imagem',
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
            },
            base64: true
        };
    
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
          
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = 'data:image/jpeg;base64,' + response.data;
                let joined = this.state.images.concat(source);

                const file = {
                    uri: response.uri,
                    name: response.fileName,
                    type: 'image/jpg'
                }
                
                let joinedUp = this.state.imagesUp.concat(file);
                this.setState({ images: joined, imagesUp: joinedUp}) 

                ImageResizer.createResizedImage(source, 300, 300, 'JPEG', 70).then((resizedImageUri) => {
                    RNFS.readFile(
                        resizedImageUri.path,
                        "base64"
                    ).then((base64Data) => {
                        this.setState({ photo: 'data:image/jpeg;base64,' + base64Data });
                    });
                }).catch((err) => {
                    alert(err);
                });
            }
        });
    }

    uploadFiles(imgs) {
        return new Promise((resolve, reject) => {
            sha256(this.state.objectId + new Date().toString()).then(hash => {
                for (let i = 0; i < imgs.length; i++) {
                    Backendless.Files.upload(imgs[i], hash, true, true).catch((err) => {
                        resolve(false);
                        console.log(err);
                    });
    
                    if (i == imgs.length - 1) {
                        resolve(hash);
                    }
                }
            })
        });
    }

    resizeImage(imageUri) {
        return new Promise((resolve, reject) => {
            ImageResizer.createResizedImage(imageUri, 300, 300, 'JPEG', 70).then((resizedImageUri) => {
                resolve(resizedImageUri);
            }).catch((err) => {
                alert('Error when resize image');
            });
        });
    }

    renderImages() {
        return this.state.images.map((item, index) => {
            return(
                <TouchableOpacity
                    activeOpacity={0.9}
                    key={index}
                    onPress={event => {
                        Alert.alert(
                            'Confirmar eliminação?',
                            'Essa alteração não poderá ser desfeita',
                            [
                                {
                                    text: 'Voltar',
                                    onPress: () => {
                                        console.log('Cancel pressed')
                                    },
                                    style: 'cancel',
                                },
                                {
                                    text: 'Apagar', 
                                    onPress: () => {
                                        this.setState({images: this.state.images.filter(function(it) { 
                                            return it !== item
                                        })});
                                    }
                                },
                            ],
                            {cancelable: true},
                        );
                    }}>
                    <View style={{ height: 130, width: 130, marginLeft: 20 }}>
                        <View style={{ flex: 2 }}>
                            <Image source={{uri: item}}
                                style={{ flex: 1, width: null, height: null, resizeMode: 'cover', borderRadius: 10 }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        });
    }

    render() {
        const { loadingVisible } = this.state;

        return(
            <View style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 30 }}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 24, paddingHorizontal: 20, paddingTop: 15 }}>
                            Novo anúncio
                        </Text>

                        <View style={{ height: 130, marginTop: 20 }}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                <TouchableHighlight
                                            underlayColor='transparent'
                                            onPress={this.selectPhotoTapped.bind(this)}>
                                    <View style={{ height: 130, width: 130, marginLeft: 20 }}>
                                        <View style={{ flex: 2 }}>
                                            
                                                <Image source={require('../assets/img/empty-photo.jpg')}
                                                    style={{ flex: 1, width: null, height: null, resizeMode: 'cover', borderRadius: 10 }}/>
                                            
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                {
                                    this.renderImages()
                                }
                            </ScrollView>
                        </View>
                    </View>                            
                    <View style={styles.inputWrapper}>
                        <Text style={[{color: 'black', fontSize: 18, fontWeight: 'bold'}, styles.label]}></Text>
                        <InputField
                            labelText="TÍTULO"
                            labelTextSize={16}
                            labelTextWeight="400"
                            labelColor={colors.lightBlack}
                            textColor={colors.lightBlack}
                            placeholder="Insira um título"
                            borderBottomColor={colors.gray06}
                            inputType="text"
                            customStyle={{marginBottom: 30}}
                            onChangeText={this.handleTitleChange}
                            showCheckmark={false}
                        />
                        <InputField
                            labelText="DESCRIÇÃO"
                            labelTextSize={16}
                            labelTextWeight="400"
                            labelColor={colors.lightBlack}
                            textColor={colors.lightBlack}
                            placeholder="Descriçao"
                            borderBottomColor={colors.gray06}
                            inputType="text"
                            customStyle={{marginBottom: 30}}
                            onChangeText={this.handleDescriptionChange}
                            showCheckmark={false}
                        />
                        <View style={{marginBottom: 30, display: 'flex'}}>
                            <Text style={{ fontFamily: 'Raleway-Regular', color: colors.lightBlack, fontSize: 16, marginBottom: 20}}>CATEGORIA</Text>
                            <Picker style={{
                                        fontFamily: 'Raleway-Regular',
                                        width: 100 + "%", 
                                        fontSize: 18,
                                        borderBottomWidth: 1,
                                        // fontWeight: '400',
                                        color: colors.lightBlack, 
                                        inputColor: colors.lightBlack}}
                                        selectedValue={this.state.category}
                                        onValueChange={(itemValue) =>
                                            this.setState({category: itemValue})
                            }>
                                <Picker.Item value='' style={{ fontFamily: 'Poppins-Regular', textColor: 'a4a4a4'}} label='Selecione uma categoria' />
                                <Picker.Item label="Classificados (Venda)" value="Classificados (Venda)" style={{ fontFamily: 'Poppins-Regular'}} />
                                <Picker.Item label="Classsificados (Compra)" value="Classsificados (Compra)" />
                                <Picker.Item label="Doação" value="Doação" />
                                <Picker.Item label="Alugo" value="Alugo" />
                                <Picker.Item label="Empregos" value="Empregos" />
                                <Picker.Item label="Serviços" value="Serviços" />
                            </Picker>
                        </View>
                        <View style={{marginBottom: 30, display: 'flex'}}>
                            <Text style={{ fontFamily: 'Raleway-Regular', color: colors.lightBlack, fontSize: 16, marginBottom: 20}}>PREÇO</Text>
                            <TextInputMask
                                style={{fontFamily: 'Raleway-Regular', fontSize: 16, color: colors.lightBlack, borderBottomWidth: 1,
                                        paddingTop: 5, borderBottomColor: colors.gray06}}
                                placeholder="Ex: 1000,00"
                                type={'money'}
                                options={{
                                    precision: 2,
                                    separator: ',',
                                    delimiter: '.',
                                    unit: 'R$',
                                    suffixUnit: ''
                                }}
                                value={this.state.price}
                                onChangeText={text => {
                                    this.setState({
                                        price: text
                                    })
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.createButton}>
                    <RoundedButton
                        text="Salvar"
                        textColor={colors.white}
                        textAlign="left"
                        background="#900DA8"
                        borderColor="transparent"
                        iconPosition="left"
                        disabled={this.toggleAnnounceButtonState()}
                        // disabled={false}
                        loading={loadingVisible}
                        icon={(
                        <View style={styles.buttonIcon}>
                            <FontAwesomeIcon name="angle-right" color={colors.white} size={30} />
                        </View>
                        )}
                        handleOnPress={this.handleCreateAnnounce}
                    />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.white,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        paddingTop: 50,
    },
    closeButton: {
        position: 'absolute',
        left: 20,
        zIndex: 9999,
    },
    headerStyle: {
        backgroundColor: colors.white,
        borderBottomWidth: 0,
    },
    heading: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.lightBlack,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 15,
    },
    label: {
        marginBottom: 20,
    },
    privacyOptions: {
        marginTop: 40,
    },
    privacyHeading: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.lightBlack,
        marginBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
    },
    privacyOptionItem: {
        flex: 1,
        padding: 20,
    },
    privacyOptionTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.lightBlack,
    },
    privacyOptionDescription: {
        fontSize: 14,
        fontWeight: '200',
        color: colors.lightBlack,
        marginTop: 10,
        paddingRight: 90,
    },
    privacyRadioInput: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    inputWrapper: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray06,
        height: 1,
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
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
    },
});