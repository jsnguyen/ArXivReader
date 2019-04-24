import { Buffer } from 'buffer';
global.Buffer = Buffer;
import React, {Component} from 'react';
import {Linking, TouchableHighlight, StyleSheet, Text, View} from 'react-native';

export default class PaperEntry extends Component<Props> {

  onPressEntry = () => {
    //Linking.openURL(this.props.item.pdfURL)
    this.props.navigation.navigate('Details', {item: this.props.item})
  };

  render() {
    return (
      <TouchableHighlight style={{backgroundColor: '#ffffff'}} activeOpacity={0.85} underlayColor={'#ededed'} onPress={ this.onPressEntry }>
        <View>
          <View style={{flex: 1, height:50}}>
            <Text style={styles.title} numberOfLines={2}>{this.props.item.title}</Text>
          </View>
          <View style={{flex: 1, height:20}}>
            <Text style={styles.authors} numberOfLines={1}>{this.props.item.authors}</Text>
          </View>
          <View style={{flex: 1, height:20}}>
            <Text style={styles.dateUpdated} numberOfLines={1}>{this.props.item.dateUpdated}</Text>
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
  authors: {
    padding: 2,
    fontSize: 12,
    marginLeft: '5%',
    marginRight: '5%',
    color: '#4286f4'
  },
  dateUpdated: {
    padding: 2,
    fontSize: 12,
    fontStyle: 'italic',
    marginLeft: '5%',
    marginRight: '5%',
    color: '#00af05'
  },
});
