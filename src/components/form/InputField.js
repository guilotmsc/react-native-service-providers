import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing
} from 'react-native';
import colors from '../../styles/colors';

export default class InputField extends Component {

  constructor(props) {
    super(props);
    this.state = {
      secureInput: !(props.inputType === 'text' || props.inputType === 'email'),
      scaleCheckmarkValue: new Animated.Value(0),
      inputValue: props.defaultValue,
      inputLength: 0
    };

    this.onChangeText = this.onChangeText.bind(this);
  }

  scaleCheckmark(value) {
    Animated.timing(
      this.state.scaleCheckmarkValue,
      {
        toValue: value,
        duration: 400,
        easing: Easing.easeOutBack,
      },
    ).start();
  }
  
  onChangeText(text) {
    this.props.onChangeText(text);
    this.setState({ inputValue: text, inputLength: text.length });
  }
  
  render() {
    const {labelText, labelTextSize, labelColor, textColor, borderBottomColor, inputType, customStyle, showCheckmark,
           placeholder, defaultValue, autoFocus, onChangeText, inputStyle, checkMarkColor, multiline} = this.props;
    const { secureInput, scaleCheckmarkValue, inputValue, inputLength } = this.state;
    const fontSize = labelTextSize || 14;
    const color = labelColor || colors.white;
    const inputColor = textColor || colors.white;
    const borderBottom = borderBottomColor || 'transparent';
    const multilineValue = multiline || false;
    const iconScale = scaleCheckmarkValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.01, 1.6, 1],
    });
    const checkColor = checkMarkColor || colors.white;

    let scaleValue = showCheckmark ? 1 : 0;
    let icon;

    if (inputLength > 5 && showCheckmark == false && inputType == 'email') {
      icon = 'exclamation';
      this.scaleCheckmark(1);
    } else {
      icon = 'check';
      this.scaleCheckmark(scaleValue);
    }
    
    return(
      <View style={[customStyle, styles.wrapper]}>
        <Text style={[{color, fontSize}, styles.label]}>{labelText}</Text>
        <Animated.View style={[{ transform: [{ scale: iconScale }] }, styles.checkmarkWrapper]}>
          <Icon
            name={icon}
            color={checkColor}
            size={20}
          />
        </Animated.View>
        <TextInput
          autoCorrect={false}
          style={[{color: inputColor, borderBottomColor: borderBottom}, inputStyle, styles.inputField]} 
          secureTextEntry={inputType === 'password' ? true : false}
          placeholder={placeholder}
          autoFocus={autoFocus}
          placeholderTextColor='#a4a4a4'
          underlineColorAndroid="transparent"
          onChangeText={this.onChangeText}
          defaultValue={inputValue}
          value={inputValue}
          multiline={multilineValue}
          />
      </View>
    );
  }
}

InputField.propTypes = {
  labelText: PropTypes.string,
  labelTextSize: PropTypes.number,
  labelColor: PropTypes.string,
  textColor: PropTypes.string,
  showCheckmark: PropTypes.bool.isRequired,
  checkMarkColor: PropTypes.string,
  borderBottomColor: PropTypes.string,
  inputType: PropTypes.string.isRequired,
  inputStyle: PropTypes.object,
  customStyle: PropTypes.object,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  autoFocus: PropTypes.bool,
  multiline: PropTypes.bool,
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
  },
  label: {
    fontFamily: 'Raleway-Regular',
    marginBottom: 20,
  },
  inputField: {
    fontFamily: 'Raleway-Regular',
    borderBottomWidth: 1,
    paddingTop: 5,
  },
  showButton: {
    position: 'absolute',
    right: 0,
  },
  showButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
  checkmarkWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 12,
  },
  rowImage: {
    height: 20,
    width: 20,
    marginLeft: 10,
  },
})