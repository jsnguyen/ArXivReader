import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import DataList from './DataList';
import {createBottomTabNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

/*
type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <DataList/>
      </SafeAreaView>
    );
  }
}
*/

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
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text> Details! </Text>
      </SafeAreaView>
    );
  }
}

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen,
}, {headerMode: 'none'});

const FavoritesStack = createStackNavigator({
  Favorites: FavoritesScreen,
}, {headerMode: 'none'});

const TabNavigator = createBottomTabNavigator({
  Home: HomeStack,
  Favorites: FavoritesStack,
});

export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
