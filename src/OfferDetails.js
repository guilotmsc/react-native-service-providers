import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  Modal
} from 'react-native'
import { HeaderBackButton } from 'react-navigation';
import { Icon, Button} from 'react-native-elements';
import theme, { sizes } from './styles/theme';
import { colors, fonts } from './styles';
import Swiper from 'react-native-swiper';
import Nav from './components';
import NavBarButton from './components/buttons/NavBarButton';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Backendless from 'backendless';
import moment from 'moment';


let termsTextSize = 13;
let headingTextSize = 22;
const transparentHeaderStyle = {
    borderBottomWidth: 0,
    elevation: 0,
};
const HERO_HEIGHT = 440
const HERO_IMAGE_CONTAINER_HEIGHT = HERO_HEIGHT - 130

const { width } = Dimensions.get('window');
const height = width * 0.8;

const WATER_IMAGE = require('../assets/img/tarcisiostar.png')

const Slide = props => ( <View>
  <Image style={styles.image} source={{uri: props.uri}} />
</View>
)

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default class OfferDetails extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      scrollY: new Animated.Value(0),
      imgs: [
        'https://firebasestorage.googleapis.com/v0/b/mega-1ac5a.appspot.com/o/offerImages%2F036fd6d5fb240faded07c35fe5805a2a%2Fproduto1.jpg?alt=media&token=131d20d4-9525-4f13-a632-08fe214e4a00',
        'https://firebasestorage.googleapis.com/v0/b/mega-1ac5a.appspot.com/o/offerImages%2F036fd6d5fb240faded07c35fe5805a2a%2Fproduto2.jpg?alt=media&token=6a65d659-4ad9-418b-8541-4e1c95b8c470'
      ],
      objectId: this.props.navigation.state.params.item.objectId,
      title: this.props.navigation.state.params.item.title,
      description: this.props.navigation.state.params.item.description,
      category: this.props.navigation.state.params.item.category,
      price: this.props.navigation.state.params.item.price,
      imagesPath: this.props.navigation.state.params.item.imagesPath,
      like: false,
      spinValue: new Animated.Value(0),
      seller: {
        objectId: '',
        username: '',
        created: '',
        photo: '',
        gender: '',
        bio: '',
      },
      rate: 0
    }

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  // static navigationOptions = ({navigation}) => {
	// 	return{
	// 		headerLeft:(<HeaderBackButton color="gray" onPress={()=>{navigation.navigate('Offers')}}/>),
	// 		headerTintColor: 'gray'
	// 	}
  // }
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavBarButton location="right" handleButtonPress={this.rotateSpring} color={colors.white} icon={<Icon
      size={28}
      type="ionicon"
      name="ios-heart"
      underlayColor="transparent"
      color='#e0421b'
      underlineColorAndroid="transparent"
    />} />,
      headerLeft: <NavBarButton handleButtonPress={() => navigation.navigate({routeName:'Offers'})} location="left" color={colors.white} icon={
        <Icon
          size={28}
          type="ionicon"
          name="ios-arrow-back"
          underlayColor="transparent"
          color='white'
          underlineColorAndroid="transparent"
        />  
      } />,
      headerStyle: transparentHeaderStyle,
      headerTransparent: true,
      headerTintColor: colors.white,
    }
  };

  componentDidMount() {
    if (this.props.navigation.state.params.item.imagesPath != '') {
      this.state.imgs = [];

      Backendless.Files.listing(this.props.navigation.state.params.item.imagesPath, "*.jpg", true).then((files) => {
        let sourceFiles = [];

        for(let i = 0; i < files.length; i++) {
          sourceFiles.push(files[i].publicUrl);
        }

        this.setState({imgs: sourceFiles});
      });
    }

    Backendless.Data.of('Users').findById(this.props.navigation.state.params.item.ownerId).then((res) => {
      this.setState({
        seller: {
          objectId: res['objectId'],
          username: res['username'],
          created: res['created'],
          photo: res['photo'],
          bio: res['bio'],
          gender: res['gender']
        }
      });

      let dataQueryBuilder = Backendless.DataQueryBuilder.create().setProperties("Avg(rate)");
      dataQueryBuilder.setWhereClause("sellerId = '" + res['objectId'] + "'");
      Backendless.Data.of("Ratings").find(dataQueryBuilder).then((result) => {
        this.setState({ rate: result[0].avg });
      })
    }).catch((err) => {
      alert('falha ao buscar vendedor');
    });
  }

  // componentWillMount() {
  //   BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  // }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  // }

  // handleBackButtonClick() {
  //   this.props.navigation.goBack(null);
  //   return true;
  // }

  rotateSpring() {
    alert('pressed');
    // Animated.spring(
    //     this.state.spinValue,
    //     {
    //         toValue: 1,
    //         friction: 1,
    //     }
    // ).start(()=> this.setState({ spinValue: new Animated.Value(0) }));

    // this.props.navigation.setParams({ like: true });
  };

  render() {
    let imgCount = this.state.imgs.length;
    let labelCount = " " + this.state.imgs.length + " fotos";
    var spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const seller = this.state.seller;
    const { rate } = this.state;

    return(
        <View style={styles.mainviewStyle}>
          <ScrollView style={styles.scroll}>
            <View style={{flex: 1}}>
              <Swiper autoplay showsButtons={false} showsPagination={false} style={styles.heroImageContainer}>
                {
                  this.state.imgs.map((item, i) => <Slide
                    uri={item}
                    key={i}
                  />)
                }
              </Swiper>
            </View>
            <View style={styles.coverMetaContainer}>
              <Button
                color="white"
                title={labelCount}
                icon={<Icon size={20} color="white" type="ionicon" name="ios-photos" />}
                // iconContainerStyle={{ marginLeft: 10 }}
                textStyle={{
                  fontSize: 14,
                  fontFamily: 'Raleway-Regular',
                  // paddingBottom: 8,
                  // paddingRight: 10,
                  // paddingTop: 8,
                }}
                buttonStyle={{
                  borderWidth: 0,
                  borderRadius: 5,
                  paddingLeft: 10,
                  // borderColor: 'transparent',
                  backgroundColor: 'rgba(128,128,128, 0.7)',
                  elevation: 0,
                }}
                containerStyle={{
                  marginBottom: 5,
                  marginRight: 15,
                  padding: 0,
                }}
              />
            </View>
            <View style={styles.productRow}>
              <View>
                <Text style={styles.detailText}>{this.props.navigation.state.params.item.title}</Text>
                <Text style={styles.priceText}>{this.state.price}</Text>
                {this.renderSeparator()}
              </View>
            </View>
            <View style={styles.productRow}>
              <View>
                <Text style={{ fontFamily: 'Raleway-Bold', color: '#5F5F5F', fontSize: 14, marginBottom: 10, marginTop: 15}}>Detalhes do produto</Text>
                <Text style={styles.subDetailText}>Categoria: {this.state.category}</Text>
                <Text style={styles.subDetailText}>Código: {this.state.objectId}</Text>
                <Text style={styles.subDetailText}>Descrição: {this.state.description}</Text>
                {this.renderSeparator()}
              </View>
            </View>
            <View style={styles.productRow}>
              <View>
              <Text style={{ fontFamily: 'Raleway-Bold', color: '#5F5F5F', fontSize: 14, marginBottom: 10, marginTop: 15}}>Sobre o vendedor</Text>
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={() => this.props.navigation.navigate('Seller', {seller, rate})}>
                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      <View style={styles.box}>
                        <Image style={styles.imageSeller} source={{uri: this.state.seller.photo}} />
                        <View style={styles.boxContent}>
                          <Text style={styles.title}>{this.state.seller.username}</Text>
                          <Text style={styles.subtitle}>Membro desde: {moment(new Date(this.state.seller.created)).format('DD/MM/YYYY')}</Text>
                          <Rating
                              imageSize={18}
                              ratingCount={5}
                              readonly
                              startingValue={this.state.rate}
                              style={{ paddingVertical: 10 }}
                            />
                          <View style={styles.buttons}>
                      
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          {this._renderProductFooter()}
        </View>);
  }

  renderSeparator() {
    return(<View style={styles.containerSeparator}>
              <View style={styles.separator} />
            </View>);
  }

  goBack() {
    this.props.navigator.pop()
  }

  _renderProductFooter() {
    if(Backendless.UserService.loggedInUser() && Backendless.UserService.loggedInUser() != this.props.navigation.state.params.item.ownerId){
      return <View style={[theme.groupButton, styles.footer]}>
              <TouchableOpacity style={{height: 44,
                                        alignItems: 'center',
                                        justifyContent: 'center', 
                                        backgroundColor: '#900DA8',
                                        flex: 1}}>
                <Text style={{ fontFamily: 'Raleway-Regular', fontSize: 14, color: 'white' }}>
                  LIGAR
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{height: 44,
                                        alignItems: 'center',
                                        justifyContent: 'center', 
                                        backgroundColor: '#3AE472',
                                        flex: 1}}
                                onPress={() => this.props.navigation.navigate('Chat', { 
                                  "name": this.state.seller.username, 
                                  "objectId": this.props.navigation.state.params.item.ownerId })}
              >
                <Text style={{ fontFamily: 'Raleway-Regular', fontSize: 14, color: 'white' }}>
                  MENSAGEM
                </Text>
              </TouchableOpacity>
            </View>
    }
  }
}

const styles = StyleSheet.create({
  itemThreeBrand: {
    fontFamily: fonts.primaryRegular,
    fontSize: 20,
    color: '#900DA8',
    fontWeight: '400',
    marginBottom: 4,
  },
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  price: {
    fontSize: 20,
    color: 'green'
  },
  navigationBarAction: {
    width: sizes.placeholderSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: sizes.placeholderSize,
  },

  productDetailsContainer: {
    paddingTop: 40
  },
  image: {
    width,
    height
  },
  navbar: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    paddingTop: 60,
    alignItems: 'center',
    paddingHorizontal: sizes.defaultSpacing,
    borderBottomColor: '#ddd'
  },
  navigationDetails: {
    height: 40,
    position: 'relative'
  },
  
  // Hero
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  colorPicker: {
    padding: sizes.defaultSpacing / 2,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderBottomRightRadius: 8,
    borderLeftWidth: 0,
    borderColor: '#eee',
  },
  heroImageContainer: {
    height: HERO_IMAGE_CONTAINER_HEIGHT
  },
  colorPickerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: HERO_IMAGE_CONTAINER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },

  footer: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0,
      width: 0
    },
  },

  containerSeparator: {
    flexDirection: 'row',
  },
  
  separator: {
      flex: 1,
      marginTop: 10,
      marginBottom: 5,
      flexDirection: 'row',
      borderColor: '#EDEDED',
      borderWidth: StyleSheet.hairlineWidth,
  },

  /******** card **************/
  card:{
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    // shadowOpacity: 0.37,
    // shadowRadius: 7.49,
    // elevation: 5,
    marginVertical: 5,
    backgroundColor:"white",
    marginHorizontal: 5,
  },
  cardContent: {
    paddingVertical: 12.5,
    fontSize: 16
  },
  cardHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardTitle:{
    color:'#900DA8'
  },


  imageSeller: {
    width: 90,
    height:90,
    borderRadius: 45
  },
  box: {
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  boxContent: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft:10,
  },
  title:{
    fontFamily: 'Raleway-Bold',
    fontSize:14,
    // fontWeight: '500',
    color:"#5F5F5F",
  },
  description:{
    fontSize:15,
    color: "#646464",
  },





  centerRow: {
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  containerModal: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    elevation: 0,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    left: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 22,
    position: 'absolute',
    right: 0,
    zIndex: 100,
  },
  icon: {
    justifyContent: 'flex-start',
    // marginTop: 2.8,
  },
  iconContainer: {
    alignSelf: 'center',
  },
  leftRow: {
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightRow: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 4,
  },
  titleText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  subTitleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
  },







  cardContainer: {
    flex: 1,
  },
  containerIntern: {
    flex: 1,
    flexDirection: 'column',
  },
  coverContainer: {
    position: 'relative',
  },
  coverImage: {
    height: Dimensions.get('window').width * (3 / 4),
    width: Dimensions.get('window').width,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  scroll: {
    backgroundColor: '#FFF',
    flex: 1
  },
  productRow: {
    paddingHorizontal: 15,
  },
  mainviewStyle: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
  },
  coverMetaContainer: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',
    // marginBottom: 15,
    // marginRight: 15,
  },
  buttonFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navigatorButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
  navigatorText: {
    color: 'green',
    fontWeight: 'bold',
    alignItems: 'flex-start',
    justifyContent: 'center',

    fontSize: 16,
  },
  borderCenter: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#FFA890',
  },
  textFooter: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 18,
  },
  priceText: {
    fontFamily: 'Raleway-Regular',
    fontSize: 36,
    letterSpacing: 1,
    color: colors.money,
    textAlign: 'right',
    fontWeight: '400',
    marginBottom: 5,
  },
  detailText: {
    fontFamily: 'Raleway-Bold',
    marginBottom: 4,
    color: '#5F5F5F',
    fontSize: 22,
  },
  subDetailText: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    paddingTop: 5 + "%",
    color: '#5F5F5F',
  },
  subtitle: {
    fontFamily: 'Raleway-Regular',
    fontSize: 12,
    color: '#5F5F5F',
  },
  subDetailTextSeller: {
    fontFamily: 'Raleway-Regular',
    fontSize: 13,
    color: '#900DA8',
  },
})