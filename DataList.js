import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import PaperEntry from './PaperEntry'


export default class DataList extends Component<Props> {

  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {data:[], refreshing: false};
  }

  renderHeader = () => {
    return (
      <View>
      <Text style={styles.title}>
        ArXiv Reader
      </Text>
      <Text style={styles.lastUpdated}>
        Last Updated on: 12/31/1999 12:00 AM
      </Text>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View style={{height: 1, backgroundColor: '#CED0CE'}} />
    );
  };

  refreshData = () => {
    this.setState({refreshing: true})
    queryUrl='https://export.arxiv.org/api/query?search_query=cat:astro-ph.CO&start=0&max_results=10&sortBy=lastUpdatedDate&sortOrder=descending'

    var XMLParser = require('react-xml-parser');
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        this.setState({ data:[] })
        var feed = new XMLParser().parseFromString(request.responseText);    // Assume xmlText contains the example XML

        entries = feed.getElementsByTagName('entry')

        var title;
        var key;
        var authors=[];
        for(var i=0;i<entries.length;i++){

          title = entries[i].getElementsByTagName('title')[0].value
          key = entries[i].getElementsByTagName('id')[0].value
          pdfURL = key.replace('/abs/','/pdf/')+'.pdf'
          var _authors = entries[i].getElementsByTagName('author')

          for (var j=0;j<_authors.length;j++){
            authors.push(_authors[j].getElementsByTagName('name')[0].value);
          }

          var maxAuthors=5
          if(authors.length>maxAuthors){
            authors = authors.slice(0,maxAuthors)
            authors.push("et al.")
          }

          this.setState({ data:[...this.state.data,{key:key, pdfURL:pdfURL, title:title, authors:authors.join(', ')}] })
          authors=[];
        }
      } else {
        console.warn('error');
      }

      this.setState({refreshing: false})
    };

    request.open('GET', queryUrl);
    request.send();
  };

  getMoreData= () => {
     if (!this.onEndReachedCalledDuringMomentum) {
    console.log('getting items',this.state.data.length,'to',this.state.data.length+10)
    queryUrl='https://export.arxiv.org/api/query?search_query=cat:astro-ph.CO&start=' + (this.state.data.length).toString() + '&max_results=10&sortBy=lastUpdatedDate&sortOrder=descending'

    var XMLParser = require('react-xml-parser');
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        var feed = new XMLParser().parseFromString(request.responseText);    // Assume xmlText contains the example XML

        entries = feed.getElementsByTagName('entry')

        var title;
        var key;
        var authors=[];
        for(var i=0;i<entries.length;i++){

          title = entries[i].getElementsByTagName('title')[0].value
          key = entries[i].getElementsByTagName('id')[0].value
          pdfURL = key.replace('/abs/','/pdf/')+'.pdf'
          var _authors = entries[i].getElementsByTagName('author')

          for (var j=0;j<_authors.length;j++){
            authors.push(_authors[j].getElementsByTagName('name')[0].value);
          }

          this.setState({ data:[...this.state.data,{key:key, pdfURL:pdfURL, title:title, authors:authors.join(', ')}] })
          authors=[];
        }
      } else {
        console.warn('error');
      }

    };

    request.open('GET', queryUrl);
    request.send();
    this.onEndReachedCalledDuringMomentum = true;
    }
  };

  render() {
    return (
      <FlatList
        ListHeaderComponent={this.renderHeader}
        data={this.state.data}
        renderItem={({item}) => (
          <PaperEntry item={item}/>
        )} 
        ItemSeparatorComponent={this.renderSeparator}
        onRefresh={this.refreshData}
        refreshing={this.state.refreshing}
        onEndReached={this.getMoreData}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
        getItemLayout={(data, index) => (
          {length: 70, offset: 70 * index, index}
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
