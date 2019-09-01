// @flow
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  NativeModules,
  Text,
  DeviceEventEmitter,
} from 'react-native';
import {withLocationPermissions} from './hocs/withLocationPermissions';

type LocationCoordinates = {
  latitude: number,
  longitude: number,
  timestamp: number,
};

class MainPageClass extends Component {
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(
      NativeModules.LocationManager.JS_LOCATION_EVENT_NAME,
      (e: LocationCoordinates) => {
        console.log(
          `Received Coordinates from native side at ${new Date(
            e.timestamp,
          ).toTimeString()}: `,
          e.latitude,
          e.longitude,
        );
      },
    );
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  onEnableLocationPress = async () => {
    const {locationPermissionGranted, requestLocationPermission} = this.props;
    if (!locationPermissionGranted) {
      const granted = await requestLocationPermission();
      if (granted) {
        return NativeModules.LocationManager.startBackgroundLocation();
      }
    }
    NativeModules.LocationManager.startBackgroundLocation();
  };

  onCancelLocationPress = () => {
    NativeModules.LocationManager.stopBackgroundLocation();
  };

  render() {
    const {container, button, text} = styles;

    return (
      <View style={container}>
        <TouchableHighlight style={button} onPress={this.onEnableLocationPress}>
          <Text style={text}>Enable Location</Text>
        </TouchableHighlight>
        <TouchableHighlight style={button} onPress={this.onCancelLocationPress}>
          <Text style={text}>Cancel Location</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export const MainPage = withLocationPermissions(MainPageClass);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 50,
  },
  button: {
    marginVertical: 40,
    backgroundColor: '#2b5082',
    padding: 20,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
});
