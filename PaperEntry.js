import React, {Component} from 'react';
import {Linking, TouchableHighlight, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

export default class PaperEntry extends Component<Props> {

  onPressEntry = () => {
    //Linking.openURL(this.props.item.pdfURL)
    this.props.navigation.navigate('Details')
    //this.props.navigation.navigate('Details')
  };

  render() {
    return (
      <TouchableHighlight activeOpacity={0.85} underlayColor={'#ededed'} onPress={ this.onPressEntry }>
        <View>
          <View style={{flex: 1, height:50}}>
            <Text style={styles.title} numberOfLines={2}>{this.props.item.title}</Text>
          </View>
          <View style={{flex: 1, height:20}}>
            <Text style={styles.author} numberOfLines={1}>{this.props.item.authors}</Text>
          </View>
          <View style={{flex: 1, height:20}}>
            <Text style={styles.date} numberOfLines={1}>{this.props.item.dateUpdated}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    padding: 2,
    fontSize: 18,
    marginLeft: '5%',
    marginRight: '5%',
  },
  author: {
    padding: 2,
    fontSize: 12,
    marginLeft: '5%',
    marginRight: '5%',
    color: '#4286f4'
  },
  date: {
    padding: 2,
    fontSize: 12,
    fontStyle: 'italic',
    marginLeft: '5%',
    marginRight: '5%',
    color: '#00af05'
  },
});
