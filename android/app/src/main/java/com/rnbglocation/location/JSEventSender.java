package com.rnbglocation.location;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;

public interface JSEventSender {
    void sendEventToJS(ReactContext reactContext, String eventName, @Nullable WritableMap params);
}
