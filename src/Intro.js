import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StyleSheet, View, Text, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 210,
    height: 210,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20 + "%"
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingTop: 10 + "%"
  }
});

const slides = [
    {
      key: 'somethun',
      title: 'BEM VINDO! JÁ CONHECE O FOURMEGA?',
      text: 'Com ele você pode publicar os seus pedidos, ou encontrar o que você precisa. Muito fácil né?',
      image: require('../assets/img/communications.png'),
      backgroundColor: '#DF744A',
    },
    {
      key: 'somethun-dos',
      title: 'SEGUNDA ETAPA',
      text: 'Registre-se. Faça seu cadastro diretamente conosco, ou se preferir, entre com o Facebook ou com sua conta Google',
      image: require('../assets/img/social-media.png'),
      backgroundColor: '#3AE472',
    },
    {
      key: 'somethun1',
      title: 'TERCEIRA ETAPA',
      text: 'Anúncie! E pronto, agora você já pode publicar seus anúncios!',
      image: require('../assets/img/promotion.png'),
      backgroundColor: '#900DA8',
    }
  ];

export default class Intro extends Component {
  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  }
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  }
  _renderItem = (item) => {
    return (
      <View style={[styles.mainContent, {backgroundColor: item.backgroundColor}]}>
        <Text style={styles.title}>{item.title}</Text>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }
  _onDone = () => {
    this.props.navigation.navigate({routeName:'Offers'});
  }
  render() {
    return (
      <AppIntroSlider
        renderItem={this._renderItem}
        slides={slides}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        onDone={this._onDone}
      />
    );
  }
}