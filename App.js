import { Buffer } from 'buffer';
global.Buffer = Buffer;
import React, {Component} from 'react';
import {ScrollView, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import DataList from './DataList';
import {createBottomTabNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

class HomeScreen extends Component<Props> {
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <DataList navigation={this.props.navigation}/>
      </SafeAreaView>
    );
  }
}

class FavoritesScreen extends Component<Props> {
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Favorites!</Text>
      </SafeAreaView>
    );
  }
}

class DetailsScreen extends Component<Props> {
  
  checkAuthorListLength = (authors) =>{
    console.log(authors)
    var maxAuthors = 5
    if(authors.length > 5){
      var newAuthors = authors.slice(0,5)
      newAuthors.push('et al.')
      return newAuthors.join(', ')
    }
    else {
      return authors.join(', ')
    }
  }

  render() {
    const item = this.props.navigation.getParam('item','No abstract!')
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{flex: 0}}>
          <Text style={styles.title}> {item.title} </Text>
          <Text style={styles.authors}> {this.checkAuthorListLength(item.authorsList)} </Text>
          <Text style={styles.dateUpdated}> {item.dateUpdated} </Text>
        </View>

        <ScrollView alwaysBounceVertical={false}>
          <Text style={styles.summary}> {item.summary} </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen,
}, {headerMode:'none'});

const FavoritesStack = createStackNavigator({
  Favorites: FavoritesScreen,
}, {headerMode:'none'});

const TabNavigator = createBottomTabNavigator({
  Home: HomeStack,
  Favorites: FavoritesStack,
});

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  title: {
    padding: 2,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: '5%',
    marginRight: '5%',
  },
  authors: {
    padding: 2,
    fontSize: 12,
    textAlign: 'center',
    marginLeft: '5%',
    marginRight: '5%',
    color: '#4286f4'
  },
  dateUpdated: {
    padding: 2,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginLeft: '5%',
    marginRight: '5%',
    color: '#00af05'
  },
  summary: {
    padding: 2,
    fontSize: 15,
    marginLeft: '5%',
    marginRight: '5%',
  },
});
