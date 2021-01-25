import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'

import styles from '../../styles/theme';

export default class Button extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    const theme = this.props.theme === 'call' ? [styles.call, styles.darkText] : [styles.chat, styles.darkText] 
    return <TouchableOpacity {...this.props} style={[styles.button, theme[0], {flex: 1}]}>
      <Text style={[styles.customFont, styles.buttonSize, theme[1]]}>
        {this.props.children}
      </Text>
    </TouchableOpacity>
  }
}