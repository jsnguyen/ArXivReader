import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import PaperEntry from './PaperEntry'
import {createBottomTabNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

export default class DataList extends Component<Props> {

  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {data:[], refreshing: false, feedUpdatedDate:''};
  }

  renderHeader = () => {
    return (
      <View>
      <Text style={styles.title}>
        ArXiv Reader
      </Text>
      <Text style={styles.lastUpdated}>
        {this.state.feedUpdatedDate}
      </Text>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View style={{height: 1, backgroundColor: '#CED0CE'}} />
    );
  };

  dataQuery = (queryUrl) => {
    var XMLParser = require('react-xml-parser');
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        var feed = new XMLParser().parseFromString(request.responseText);    // Assume xmlText contains the example XML

        var d = new Date (Date.parse(feed.getElementsByTagName('updated')[0].value))
        var dt = [d.getMonth()+1,d.getDate(),d.getFullYear()]
        var feedUpdatedDateStr = dt.map( x => (x<10) ? '0'+x.toString() : x.toString() ).join('/')
        var entries = feed.getElementsByTagName('entry')

        for(var i=0;i<entries.length;i++){
          var authors=[];
          var title = entries[i].getElementsByTagName('title')[0].value
          var key = entries[i].getElementsByTagName('id')[0].value

          var d = new Date (Date.parse(entries[i].getElementsByTagName('updated')[0].value))
          var dt = [d.getMonth()+1,d.getDate(),d.getFullYear()]
          var dateUpdated = dt.map( x => (x<10) ? '0'+x.toString() : x.toString() ).join('/')

          var d = new Date (Date.parse(entries[i].getElementsByTagName('published')[0].value))
          var dt = [d.getMonth()+1,d.getDate(),d.getFullYear()]
          var datePublished = dt.map( x => (x<10) ? '0'+x.toString() : x.toString() ).join('/')

          var pdfURL = key.replace('/abs/','/pdf/')+'.pdf'
          var _authors = entries[i].getElementsByTagName('author')

          for (var j=0;j<_authors.length;j++){
            authors.push(_authors[j].getElementsByTagName('name')[0].value);
          }

          this.setState({
            feedUpdatedDate: feedUpdatedDateStr,
            data: [ ...this.state.data ,{key: key, datePublished: datePublished, dateUpdated: dateUpdated, pdfURL: pdfURL, title: title, authors: authors.join(', ')} ]
          })
        }
      } else {
        console.warn('error');
      }
      this.setState({refreshing: false})
    };

    request.open('GET', queryUrl);
    request.send();
    this.onEndReachedCalledDuringMomentum = true;
  };

  refreshData = () => {
    this.setState({ refreshing: true, data: [] })
    queryUrl='https://export.arxiv.org/api/query?search_query=cat:astro-ph.CO&start=0&max_results=20&sortBy=lastUpdatedDate&sortOrder=descending'
    this.dataQuery(queryUrl)
  };

  getMoreData = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      queryUrl='https://export.arxiv.org/api/query?search_query=cat:astro-ph.CO&start=' + (this.state.data.length).toString() + '&max_results=10&sortBy=lastUpdatedDate&sortOrder=descending'
      this.dataQuery(queryUrl)
    }
  };

  render() {
    return (
      <FlatList
        ListHeaderComponent={this.renderHeader}
        data={this.state.data}
        renderItem={({item}) => (
          <PaperEntry
            navigation={this.props.navigation}
            item={item}
          />
        )} 
        ItemSeparatorComponent={this.renderSeparator}
        onRefresh={this.refreshData}
        refreshing={this.state.refreshing}
        onEndReached={this.getMoreData}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
        getItemLayout={(data, index) => (
          {length: 90, offset: 90 * index, index}
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  lastUpdated: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
