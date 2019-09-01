package com.rnbglocation.location;

import android.annotation.SuppressLint;
import android.app.IntentService;
import android.content.Intent;
import android.location.Location;
import android.os.Handler;

import androidx.annotation.Nullable;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;

import java.util.Date;

public class LocationBackgroundService extends IntentService {
    private FusedLocationProviderClient mFusedLocationClient;
    private LocationCallback mLocationCallback;
    private Gson mGson;

    public LocationBackgroundService() {
        super(LocationForegroundService.class.getName());
        mGson = new Gson();
    }

    @SuppressLint("MissingPermission")
    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(getApplicationContext());
        mLocationCallback = createLocationRequestCallback();

        LocationRequest locationRequest = LocationRequest.create()
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(0)
                .setFastestInterval(0);

        new Handler(getMainLooper()).post(() -> mFusedLocationClient.requestLocationUpdates(locationRequest, mLocationCallback, null));
    }

    private LocationCallback createLocationRequestCallback() {
        return new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                for (Location location : locationResult.getLocations()) {
                    LocationCoordinates locationCoordinates = createCoordinates(location.getLatitude(), location.getLongitude());
                    broadcastLocationReceived(locationCoordinates);
                    mFusedLocationClient.removeLocationUpdates(mLocationCallback);
                }
            }
        };
    }

    private LocationCoordinates createCoordinates(double latitude, double longitude) {
        return new LocationCoordinates()
                .setLatitude(latitude)
                .setLongitude(longitude)
                .setTimestamp(new Date().getTime());
    }

    private void broadcastLocationReceived(LocationCoordinates locationCoordinates) {
        Intent eventIntent = new Intent(LocationForegroundService.LOCATION_EVENT_NAME);
        eventIntent.putExtra(LocationForegroundService.LOCATION_EVENT_DATA_NAME, mGson.toJson(locationCoordinates));
        getApplicationContext().sendBroadcast(eventIntent);
    }
}
