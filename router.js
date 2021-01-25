import React, {Component} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { createBottomTabNavigator, createSwitchNavigator, StackNavigator } from 'react-navigation';

import { Icon } from 'react-native-elements';
import Explore from './src/Explore';
import Offers from './src/Offers';
import Inbox from './src/Inbox';
import Announce from './src/Announce';
import Profile from './src/Profile';
import ProfileEdit from './src/ProfileEdit';
import Configs from './src/Configs';

import SignIn from './src/SignIn';
import SignUp from './src/SignUp';
import LoggedOut from './src/LoggedOut';
import TermsAndConditions from './src/TermsAndConditions';
import OfferDetails from './src/OfferDetails';
import FAQ from './src/FAQ';
import Seller from './src/Seller';
import TurnOnNotifications from './src/TurnOnNotifications';
import Intro from './src/Intro';
import Chat from './src/Chat';


export const SignedOut = StackNavigator({
  Intro: {
    screen: Intro,
    navigationOptions: {
      headerTransparent: true
    }
  },
  LoggedOut: {
    screen: LoggedOut,
    navigationOptions: {
      headerTransparent: true
    }
  },
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      headerTransparent: true,
      headerTintColor: 'white'
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      headerTransparent: true,
      headerTintColor: 'white'
    }
  },
  TurnOnNotifications: {
    screen: TurnOnNotifications,
    navigationOptions: {
      headerTransparent: true,
      headerTintColor: 'white'
    }
  },
  ProfileEdit: {
    screen: ProfileEdit,
    navigationOptions: {
      headerTransparent: true
    }
  },
  TermsAndConditions: {
    screen: TermsAndConditions,
    navigationOptions: {
      headerTransparent: true
    }
  },
  FAQ: {
    screen: FAQ,
    navigationOptions: {
      headerTransparent: true
    }
  },
  Seller: {
    screen: Seller,
    navigationOptions: {
      headerTransparent: true
    }
  },
  OfferDetails: {
    screen: OfferDetails,
    navigationOptions: {
      headerTransparent: true
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      headerTransparent: true
    }
  },
})

export const SignedIn = createBottomTabNavigator({
  Offers: {
    screen: Offers,
    navigationOptions: {
      tabBarLabel: '4mega',
      tabBarIcon: ({ tintColor }) => (
        <Icon type='ionicon' name="ios-search" color={tintColor} size={24} />
      )
    }
  },
  Inbox: {
    screen: Inbox,
    navigationOptions: {
      tabBarLabel: 'Chats',
      tabBarStyle: { fontFamily: 'Raleway-Thin' },
      tabBarIcon: ({ tintColor }) => (
        <Icon type='ionicon' name="ios-chatbubbles" color={tintColor} size={24} />
      )
    }
  },
  Announce: {
    screen: Announce,
    navigationOptions: {
      tabBarLabel: 'Anunciar',
      tabBarIcon: ({ tintColor }) => (
        <Icon type='ionicon' name="ios-megaphone" color={tintColor} size={24} />
      )
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: 'Perfil',
      tabBarIcon: ({ tintColor }) => (
        <Icon type='ionicon' name="ios-contact" color={tintColor} size={24} />
      )
    }
  },
  Configs: {
    screen: Configs,
    navigationOptions: {
      tabBarLabel: 'Mais',
      tabBarIcon: ({ tintColor }) => (
        <Icon type='ionicon' name="ios-cog" color={tintColor} size={24} />
      ),
      headerVisible: true
    }
  }
}, {
  tabBarOptions: {
    activeTintColor: 'white',
    inactiveTintColor: '#c1bcbc',
    labelStyle: {
      fontFamily: 'Raleway-Light',
    },
    style: {
      backgroundColor: '#DF744A',
      borderTopWidth: 0,
      shadowOffset: { width: 5, height: 3 },
      shadowColor: 'white',
      shadowOpacity: 0.5,
      elevation: 5
    }
  }
})


export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false,
          header: null
        }
      }, 
      SignedOut: {
        screen: SignedOut
      }
    }, 
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  )
}