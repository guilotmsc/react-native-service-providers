import React, { Component } from 'react'

import { HeaderBackButton } from 'react-navigation';
import { View, Text, Image, Picker, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import ImagePicker from 'react-native-image-picker';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Card } from 'react-native-elements';
import InputField from './components/form/InputField';
import RoundedButton from './components/buttons/RoundedButton';
import Loader from './components/Loader';
import colors from './styles/colors';

import Backendless from 'backendless';
const UsersStore = Backendless.Data.of('Users');

export default class ProfileEdit extends Component {
  
	constructor(props) {
		super(props);

		this.state = {
			objectId: this.props.navigation.state.params.user.objectId,
			username: this.props.navigation.state.params.user.username,
			validUsername: true,
			email: this.props.navigation.state.params.user.email,
			validEmail: true,
			bio: this.props.navigation.state.params.user.bio,
			birthdate: '',
			gender: this.props.navigation.state.params.user.gender,
			photo: this.props.navigation.state.params.user.photo,
			phone: this.props.navigation.state.params.user.phone,
			validPhone: true,
			loadingVisible: false,
			validForm: false
		}

		this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePhoneChange = this.handlePhoneChange.bind(this);
	}

	static navigationOptions = ({navigation}) => {
		return{
			headerLeft:(<HeaderBackButton color="gray" onPress={()=>{navigation.navigate('Profile')}}/>),
			headerTintColor: 'gray'
		}
	}

	componentDidMount() {
        if(!Backendless.UserService.loggedInUser()){
            this.props.navigation.navigate({routeName: 'LoggedOut'});
		}		
    }

	handleUpdateProfile() {

		this.setState({ loadingVisible: true });
    
		const { objectId, username, email, bio, photo, phone, gender } = this.state;
	
		let user = new Backendless.User();
		user.objectId = objectId;
		user.username = username;
		user.email = email;
		user["bio"] = bio;
		user["gender"] = gender;
		user["phone"] = phone;
		user["photo"] = photo;

		Backendless.UserService.update(user).then((updatedUser) => {
			this.setState({ loadingVisible: false });
			this.props.navigation.navigate('Profile', {updatedUser});
		}).catch((error) => {
			this.setState({ loadingVisible: false });
			alert(error);
		});
	}

	toggleProfileButtonState() {
        const { validEmail, validUsername, validPhone } = this.state;

        if (validEmail && validUsername && validPhone) {
          return false;
        }
        return true;
    }

	handleUsernameChange(username) {
		this.setState({ username: username });

		if (username != this.props.navigation.state.params.user.username) {
			let query = new Backendless.DataQueryBuilder();
			query.setWhereClause("username = '" + username + "'");
			
			UsersStore.getObjectCount(query).then((count) => {
				if(count > 0) {
					this.setState({ validUsername: false })
					// inserir sweet alert posteriormente
				} else {
					this.setState({ validUsername: true });
				}
			});
		} else {
			this.setState({ validUsername: true });
		}
	}

	handleEmailChange(email) {
		const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const { validEmail } = this.state;
		this.setState({ email: email });
	
		if (!validEmail) {
		  if (emailCheckRegex.test(email)) {
			this.setState({ validEmail: true });
		  }
		} else if (!emailCheckRegex.test(email)) {
		  this.setState({ validEmail: false });
		}
	}

	handlePhoneChange(phone) {
		const { validPhone } = this.state;
		this.setState({ phone: phone });

		if(phone.length == 0 || phone.length > 9) {
			this.setState({ validPhone: true });
		} else {
			this.setState({ validPhone: false });
		}
	}

	renderHeader = () => {
        const { photo } = this.state;

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
					<View style={styles.usernameOutRow}>
                        <View style={styles.usernameRow}>
                            <Text style={styles.usernameText} onPress={this.selectPhotoTapped.bind(this)}>
                                Alterar foto
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
		</View>)
	}

	selectPhotoTapped() {
        const options = {
            title: 'Inserir imagem',
            quality: 0.7,
            maxWidth: 300,
            maxHeight: 300,
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

				this.setState({ photo: source });
            }
        });
    }

	render() {
		const { validUsername, validEmail, loadingVisible } = this.state;

        return(
			<View style={styles.wrapper}>
				<ScrollView style={styles.scroll}>
					<View style={styles.container}>
						<Card containerStyle={styles.cardContainer}>
							{this.renderHeader()}
							<View style={{ flex: 1, backgroundColor: 'white', paddingTop: 15 }}>
								<Text style={{ fontFamily: 'Raleway-Regular', fontSize: 24, paddingHorizontal: 20, paddingTop: 5 + "%" }}>
									Editar perfil
								</Text>
							</View>
							<View style={styles.inputWrapper}>
								<Text style={[{color: 'black', fontSize: 18, fontWeight: 'bold'}, styles.label]}></Text>
								<InputField
									labelText="USERNAME"
									labelTextSize={16}
									labelTextWeight="400"
									labelColor={colors.lightBlack}
									textColor={colors.lightBlack}
									placeholder="Username"
									borderBottomColor={colors.gray06}
									inputType="text"
									customStyle={{marginBottom: 30}}
									onChangeText={this.handleUsernameChange}
									defaultValue={this.props.navigation.state.params.user.username}
									showCheckmark={validUsername}
									checkMarkColor="#900DA8"
								/>
								<InputField
									labelText="EMAIL"
									labelTextSize={16}
									labelTextWeight="400"
									labelColor={colors.lightBlack}
									textColor={colors.lightBlack}
									placeholder="Fale sobre você"
									borderBottomColor={colors.gray06}
									inputType="email"
									customStyle={{marginBottom: 30}}
									onChangeText={this.handleEmailChange}
									defaultValue={this.props.navigation.state.params.user.email}
									showCheckmark={validEmail}
									checkMarkColor="#900DA8"
								/>
								<InputField
									labelText="BIO"
									labelTextSize={16}
									labelTextWeight="400"
									labelColor={colors.lightBlack}
									textColor={colors.lightBlack}
									placeholder="Fale sobre você"
									borderBottomColor={colors.gray06}
									inputType="text"
									customStyle={{marginBottom: 30}}
									onChangeText={(text) =>
										this.setState({bio: text})
									}
									showCheckmark={false}
									defaultValue={this.props.navigation.state.params.user.bio}
								/>
								<View style={{marginBottom: 30, display: 'flex'}}>
									<Text style={{color: colors.lightBlack, fontSize: 16, marginBottom: 20}}>GÊNERO</Text>
									<Picker style={{
											width: 100 + "%", 
											fontSize: 18,
											borderBottomWidth: 1,
											fontWeight: '400',
											color: colors.lightBlack, 
											inputColor: colors.lightBlack}}
											mode='dialog'
											selectedValue={this.state.gender}
											onValueChange={(itemValue) =>
												this.setState({gender: itemValue})
											}>
										<Picker.Item value='' style={{textColor: 'gray'}} label='Selecione um gênero' />
										<Picker.Item label="Masculino" value="male" />
										<Picker.Item label="Feminino" value="female" />
										<Picker.Item label="Outro" value="Outro" />
									</Picker>
								</View>
								<View style={{marginBottom: 30, display: 'flex'}}>
									<Text style={{color: colors.lightBlack, fontSize: 16, marginBottom: 20}}>TELEFONE</Text>
									<TextInputMask
										placeholder="(99)-99999-9999"
										style={{fontSize: 16, color: colors.lightBlack, borderBottomWidth: 1,
												paddingTop: 5, borderBottomColor: colors.gray06}}
										type={'cel-phone'}
										options={{
											maskType: 'BRL',
											withDDD: true,
											dddMask: '(99) '
										}}
										value={this.state.phone}
										defaultValue={this.props.navigation.state.params.user.phone}
										onChangeText={this.handlePhoneChange}
									/>
								</View>
							</View>
							{/* {this.renderForm()} */}
							{/* <View style={styles.containerSeparator}>
								<View style={styles.separatorOffset} />
								<View style={styles.separator} />
							</View>
							{this.renderMail()}
							<View style={styles.containerSeparator}>
								<View style={styles.separatorOffset} />
								<View style={styles.separator} />
							</View>
							{this.renderPhone()} */}
						</Card>
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
						disabled={this.toggleProfileButtonState()}
						loading={loadingVisible}
						icon={(
							<View style={styles.buttonIcon}>
								<FontAwesomeIcon name="angle-right" color={colors.white} size={30} />
							</View>
						)}
						handleOnPress={this.handleUpdateProfile}
					/>
				</View>
				<Loader
					modalVisible={loadingVisible}
					animationType="fade"
				/>
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
    label: {
        marginBottom: 20,
    },
    inputWrapper: {
        paddingLeft: 20,
        paddingRight: 20,
    },
	usernameOutRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    usernameRow: {
        backgroundColor: 'transparent',
        marginLeft: 5
    },
    usernameText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '400',        
        textAlign: 'center',
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
    scroll: {
        backgroundColor: '#FFF',
    },
    userImage: {
        borderColor: "#DF744A",
        borderRadius: 85,
        borderWidth: 3,
        height: 170,
        marginBottom: 15,
        width: 170,
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
        borderWidth: 0.8,
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
	icon: {
        justifyContent: 'flex-start',
	},
})