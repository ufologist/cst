package com.github.ufologist.cst.activity;

import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;

import android.annotation.TargetApi;
import android.os.Bundle;

import com.github.ufologist.cst.R;

public class MainActivity extends DroidGap {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash);

        // XMLHttpRequest cannot load http://127.0.0.1:40582/[somerandomstring]. Origin null is not allowed by Access-Control-Allow-Origin. at null:1
        // http://stackoverflow.com/questions/12409440/phonegap-cordova-app-breaks-in-jelly-bean-access-control-allow-origin-and-seta
        super.init();
        if(android.os.Build.VERSION.SDK_INT > android.os.Build.VERSION_CODES.ICE_CREAM_SANDWICH_MR1) {
            fixJellyBeanIssues();
        }

        super.loadUrl(Config.getStartUrl(), 3000);
    }

    @TargetApi(16)
    protected void fixJellyBeanIssues() {
        System.out.println(super.appView.toString());
        try {
            super.appView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        } catch(NullPointerException e) {
            System.out.println(e.toString());
        }
    }
}