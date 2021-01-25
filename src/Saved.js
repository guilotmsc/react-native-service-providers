import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
  Animated,
  StatusBar,
  Timestamp,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OfferDetails from './OfferDetails';
import Tag from './components/Explore/Tag'
import { colors, fonts } from './styles';
import Backendless from 'backendless';
import moment from 'moment';

const { height, width } = Dimensions.get('window');

const OffersStore = Backendless.Data.of('Offers');

var dataQuery = new Backendless.DataQueryBuilder();
dataQuery.setPageSize(11);
dataQuery.setSortBy("created");

export default class Saved extends Component {

  constructor(props) {
    
    super(props);

    this.onEndReachedCalledDuringMomentum = true;
    
    this.state = {
      offers: [],
      modalVisible: false,
      objectId: '',
      ownerId: '',
      title: '',
      description: '',
      category: '',
      price: 0,
      imagesPath: '',
      searchValue: '',
      loading: false,
      refreshing: false
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  componentDidMount() {
    this.__findAll();

    this.scrollY = new Animated.Value(0)

    this.startHeaderHeight = 30;
    this.endHeaderHeight = 10;

    if (Platform.OS == 'android') {
        this.startHeaderHeight = 90 + StatusBar.currentHeight;
        this.endHeaderHeight = 60 + StatusBar.currentHeight;
    }

    this.animatedHeaderHeight = this.scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [this.startHeaderHeight, this.endHeaderHeight],
        extrapolate: 'clamp'
    })

    this.animatedOpacity = this.animatedHeaderHeight.interpolate({
        inputRange: [this.endHeaderHeight, this.startHeaderHeight],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    })
    this.animatedTagTop = this.animatedHeaderHeight.interpolate({
        inputRange: [this.endHeaderHeight, this.startHeaderHeight],
        outputRange: [-30, 10],
        extrapolate: 'clamp'
    })
    this.animatedMarginTop = this.animatedHeaderHeight.interpolate({
        inputRange: [this.endHeaderHeight, this.startHeaderHeight],
        outputRange: [50, 30],
        extrapolate: 'clamp'
    })
  }
  
  _getRenderItemFunction = () =>
    this.renderRowThree;

  // _onPressItem = (item) => {
  //   this.setState({
  //     modalVisible: true,
  //     objectId: item.objectId,
  //     title: item.title,
  //     description: item.description,
  //     category: item.category,
  //     price: item.price,
  //     imagesPath: item.imagesPath
  //   });
  // };

  // Busca todas as categorias
  __findAll = () => {
    if(this.state.searchValue.length > 0) {
      dataQuery.setWhereClause("title like '%" + this.state.searchValue + "%'");
    }

    this.setState({ offers: [], loading: true });

    return new Promise((resolve, reject) => {
      const handleResult = result => {
        this.setState({
          offers: this.state.offers.concat(result), loading: false 
        });
        resolve(true);
      }

      OffersStore.find(dataQuery).then(handleResult, reject)
    })
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.__findAll().then(() => {
      this.setState({refreshing: false});
    });
  }

  // FlatList infinite scroll
  __loadMore = () => {

    alert('load more');
    
    dataQuery.prepareNextPage();
    dataQuery.setWhereClause("title like '%" + this.state.searchValue + "%'");

    this.setState({ loading: true });

    return new Promise((resolve, reject) => {
      const handleResult = result => {
        this.setState({
          offers: this.state.offers.concat(result), loading: false 
        });
        resolve(true);
      }

      OffersStore.find(dataQuery).then(handleResult, reject)
    })
  }

  // Busca elementos por termo
  onChangeHandler(searchValue) {
      this.setState({ offers: [], searchValue: searchValue, loading: true });

      var query = new Backendless.DataQueryBuilder();
      query.setSortBy("created");
      query.setPageSize(11);
      query.setWhereClause("title like '%" + searchValue + "%'");

      return new Promise((resolve, reject) => {
        const handleResult = result => {
          this.setState({
            offers: result, loading: false 
          });
          resolve(true);
        }

        OffersStore.find(query).then(handleResult, reject)
      })
  }

  renderRowThree = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.itemThreeContainer}
      onPress={() => this.props.navigation.navigate('OfferDetails', {
        item
    })}
      // onPress={() =>  this._onPressItem(item)}
    >
      <View style={styles.itemThreeSubContainer}>
        <Image source={{ uri: item.base64 }} style={styles.itemThreeImage} />
        <View style={styles.itemThreeContent}>
          <Text style={styles.itemThreeBrand}>{item.category}</Text>
          <View>
            <Text style={styles.itemThreeTitle}>{item.title}</Text>
            <Text style={styles.itemThreeSubtitle} numberOfLines={1}>
              {item.description}
            </Text>
          </View>
          <View style={styles.itemThreeMetaContainer}>
            
              {  moment(new Date()).subtract(2, 'day').format('DD/MM/YYYY') < moment(new Date(item.created)).format('DD/MM/YYYY') ? <View
              style={[
                styles.badge,
                { backgroundColor: colors.green },
              ]}
            ><Text
                style={{ fontFamily: 'Raleway-ExtraLight', fontSize: 10, color: colors.white }}
                styleName="bright"
              >
                NOVO
              </Text></View> : <View
              style={[
                styles.badgeDate,
                { backgroundColor: 'white' },
              ]}
            ><Text
                style={{ fontFamily: 'Raleway-Regular', fontSize: 10, color: '#900DA8' }}
                styleName="bright"
              >
                {moment(new Date(item.created)).format('DD/MM/YYYY')}
              </Text></View>}
            <Text style={styles.itemThreePrice}>{item.price}</Text>
          </View>
        </View>
      </View>
      <View style={styles.itemThreeHr} />
    </TouchableOpacity>
  );

  renderFooter = () => {
    if (!this.state.loading) return null;
    return(
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  };

  render(){
    const groupedData = this.state.offers;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Animated.View style={{ height: this.animatedHeaderHeight, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#dddddd' }}>
            <View style={{
                flexDirection: 'row', padding: 5,
                backgroundColor: 'white', marginHorizontal: 20,
                shadowOffset: { width: 0, height: 0 },
                shadowColor: 'black',
                justifyContent: 'flex-start',
                alignItems: 'center',
                shadowOpacity: 0.2,
                elevation: 1,
                marginTop: Platform.OS == 'android' ? 10 : null
            }}>
                <Icon name="ios-search" size={20} style={{ marginRight: 10 }} />
                <TextInput
                    placeholder="Buscar"
                    placeholderTextColor="gray"
                    onChangeText={this.onChangeHandler}
                    multiline={false}
                    style={{ width: 100 + "%", fontFamily: 'Raleway-Regular', height: 40, textAlignVertical: 'top'}}
                />
            </View>
            <Animated.View
                style={{ flexDirection: 'row', marginHorizontal: 20, position: 'relative', top: this.animatedTagTop, opacity: this.animatedOpacity }}
            >
                <Tag name="Categorias" />
            </Animated.View>
            </Animated.View>
            <ScrollView refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                  [
                      { nativeEvent: { contentOffset: { y: this.scrollY } } }
                  ]
              )}
            >  
            <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 5}}>
              <FlatList
                style={{ backgroundColor: colors.white, paddingHorizontal: 15 }}
                data={groupedData}
                renderItem={this._getRenderItemFunction()}
                keyExtractor={item => item.objectId}
                onEndReached={() => {
                  if (this.state.offers.length > 10) {
                    this.__loadMore()
                  }
                }}
                onEndReachedThreshold={0.1}
                ListFooterComponent={this.renderFooter}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  loading: {
    paddingBottom: 20,
    paddingTop: 20
  },
  tempNav: {
      width: 100 + "%",
      height: 56,
      backgroundColor: "rgb(250, 250, 250)",
      borderBottomColor: "rgb(233, 233, 233)",
      borderBottomWidth: StyleSheet.hairlineWidth
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabsContainer: {
    alignSelf: 'stretch',
    marginTop: 30,
  },
  
  itemThreeContainer: {
    backgroundColor: 'white',
    padding: 3
  },
  itemThreeSubContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  itemThreeImage: {
    height: 120,
    width: 120,
  },
  itemThreeContent: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  itemThreeBrand: {
    fontFamily: 'Raleway-Light',
    fontSize: 12,
    color: '#900DA8',
  },
  itemThreeTitle: {
    fontFamily: 'Raleway-Regular',
    fontSize: 17,
    color: '#5F5F5F',
  },
  itemThreeSubtitle: {
    fontFamily: 'Raleway-Regular',
    fontSize: 12,
    color: '#a4a4a4',
  },
  itemThreeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemThreePrice: {
    fontFamily: 'Raleway-Regular',
    fontSize: 18,
    color: colors.money,
    textAlign: 'right',
  },
  itemThreeHr: {
    flex: 1,
    height: 1,
    backgroundColor: '#e3e3e3',
    marginRight: -15,
  },
  badge: {
    backgroundColor: '#900DA8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeDate: {
    backgroundColor: '#900DA8',
    borderRadius: 10,
    paddingVertical: 5,
  },
});