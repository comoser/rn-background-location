import React from 'react';
import {PermissionsAndroid} from 'react-native';

export const withLocationPermissions = Component => {
  class WithLocationPermissions extends React.Component {
    state = {
      locationPermissionGranted: false,
    };

    constructor(props) {
      super(props);
      this.checkLocationPermissions();
    }

    checkLocationPermissions = async () => {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted) {
        this.setState({
          locationPermissionGranted: true,
        });
      }
    };

    requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'RNbgLocation Permission',
            message:
              'RNbgLocation needs to access your location in order to work',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({locationPermissionGranted: true});
          return true;
        } else {
          this.setState({locationPermissionGranted: false});
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    };

    render() {
      return (
        <Component
          locationPermissionGranted={this.state.locationPermissionGranted}
          requestLocationPermission={this.requestLocationPermission}
        />
      );
    }
  }

  return WithLocationPermissions;
};
