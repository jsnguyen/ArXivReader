import React, {Component} from 'react';
import {Linking, TouchableHighlight, StyleSheet, Text, View} from 'react-native';


export default class PaperEntry extends Component<Props> {

  onPressEntry = () => {
    Linking.openURL(this.props.item.pdfURL)
  };

  render() {
    return (
      <TouchableHighlight activeOpacity={0.85} underlayColor={'#ededed'} onPress={ this.onPressEntry }>
        <View>
          <View style={{flex: 1, flexWrap: 'wrap', height:50}}>
            <Text style={styles.title} numberOfLines={2}>{this.props.item.title}</Text>
          </View>
          <View style={{flex: 1, height:20}}>
            <Text style={styles.author} numberOfLines={1}>{this.props.item.authors}</Text>
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
});
