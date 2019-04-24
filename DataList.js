import { Buffer } from 'buffer';
global.Buffer = Buffer;
import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import PaperEntry from './PaperEntry'
import { SwipeListView } from 'react-native-swipe-list-view';

export default class DataList extends Component<Props> {

  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {data:[], refreshing: false, feedUpdatedDate:''};
  }

  renderHeader = () => {
    return (
      <View>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View style={{height: 1, backgroundColor: '#CED0CE'}} />
    );
  };

  dataParse = (err,result) => {
    console.log(result);
    console.log(this.state);

    var d = new Date (Date.parse(result.feed.updated))
    var dt = [d.getMonth()+1,d.getDate(),d.getFullYear()]
    var feedUpdatedDateStr = dt.map( x => (x<10) ? '0'+x.toString() : x.toString() ).join('/')
    this.props.navigation.navigate('Home',{feedUpdatedDateStr: feedUpdatedDateStr})

    var entries = result.feed.entry

    for(var i=0;i<entries.length;i++){
      var authors=[];
      var title = entries[i].title[0].replace(/(\r\n|\n|\r)/gm, '')
      var key = entries[i].id[0]

      var d = new Date (Date.parse(entries[i].updated[0]))
      var dt = [d.getMonth()+1,d.getDate(),d.getFullYear()]
      var dateUpdated = dt.map( x => (x<10) ? '0'+x.toString() : x.toString() ).join('/')

      var d = new Date (Date.parse(entries[i].published[0]))
      var dt = [d.getMonth()+1,d.getDate(),d.getFullYear()]
      var datePublished = dt.map( x => (x<10) ? '0'+x.toString() : x.toString() ).join('/')

      var pdfURL = key.replace('/abs/','/pdf/')+'.pdf'
      var _authors = entries[i].author

      var summary = entries[i].summary[0].replace(/(\r\n|\n|\r)/gm, ' ');

      for (var j=0;j<_authors.length;j++){
        authors.push(_authors[j].name[0])
      }

      this.setState({
        feedUpdatedDate: feedUpdatedDateStr,
        data: [ ...this.state.data ,{key: key, datePublished: datePublished, dateUpdated: dateUpdated, pdfURL: pdfURL, title: title, authorsList: authors, authors: authors.join(', '), summary: summary} ]
      })
    }
  }

  dataQuery = (queryUrl) => {
    var parseString = require('react-native-xml2js').parseString;
    var request = new XMLHttpRequest();

    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        parseString(request.responseText, this.dataParse)
      }

      else {
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
      <SwipeListView
        useFlatList={true}
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
        renderHiddenItem={ (data, rowMap) => (
          <View style={styles.rowBack}>
              <Text>Left</Text>
              <Text>Right</Text>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
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
  rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
});
