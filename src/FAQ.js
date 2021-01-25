import React, { Component } from 'react';
import { HeaderBackButton } from 'react-navigation';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

const SECTIONS = [
  {
    title: 'Registro',
    data0: {
        contentTitle: 'Como se registrar?',
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book....',
    },
    data1: {
        contentTitle: 'Como entrar com o Facebook?',
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book....',
    }
  },
  {
    title: 'Anúncios',
    data0: {
        contentTitle: 'Como inserir um anúncio?',
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book....',
    },
    data1: {
        contentTitle: 'Como remover um anúncio?',
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book....',
    }
  },
  {
    title: 'Contato',
    data0: {
        contentTitle: 'Como inserir um anúncio?',
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book....',
    },
    data1: {
        contentTitle: 'Como remover um anúncio?',
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book....',
    }
  },
];

export default class FAQ extends Component {
    state = {
        activeSections: [],
    };

    static navigationOptions = ({navigation}) => {
        return{
            headerLeft:(<HeaderBackButton onPress={()=>{navigation.navigate('Configs')}}/>),
            headerTintColor: 'gray'
        }
    }

    _renderHeader = section => {
        return (
        <View style={styles.header}>
            <Text style={styles.headerText}>{section.title}</Text>
        </View>
        );
    };

    _renderContent = section => {
        return (
            <View>
                <View style={styles.content}>
                    <Text style={{fontWeight: 'bold'}}>{section.data0.contentTitle}</Text>
                    <Text>{section.data0.content}</Text>
                </View>
            </View>
        );
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'center'}}>
                    <Text style={{ fontSize: 20, fontWeight: '700', paddingHorizontal: 10, paddingTop: 15 }}>
                        FAQ
                    </Text>
                </View>
                <ScrollView style={styles.tcContainer}>
                    <Accordion
                        sections={SECTIONS}
                        activeSections={this.state.activeSections}
                        renderHeader={this._renderHeader}
                        renderContent={this._renderContent}
                        onChange={this._updateSections}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tcContainer: {
        paddingTop: 10
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '300',
        marginBottom: 20,
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 15,
        padding: 10,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        padding: 20,
        fontWeight: 'bold',
        backgroundColor: '#F4F5F4',
    },
    contentText: {
        padding: 20,
        backgroundColor: '#F4F5F4',
    },
    active: {
        backgroundColor: 'blue',
    },
    inactive: {
        backgroundColor: 'rgba(245,252,255,1)',
    },
    selectors: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    selector: {
        backgroundColor: 'red',
        padding: 10,
    },
    activeSelector: {
        fontWeight: 'bold',
    },
    selectTitle: {
        fontSize: 14,
        fontWeight: '500',
        padding: 10,
    },
    multipleToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 30,
        alignItems: 'center',
    },
    multipleToggle__title: {
        fontSize: 16,
        marginRight: 8,
    },
  });