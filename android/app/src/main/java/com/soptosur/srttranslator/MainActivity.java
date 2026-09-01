package com.soptosur.srttranslator;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private PowerManager.WakeLock wakeLock;
    private boolean isWebViewConfigured = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 1. Install SplashScreen compat before super.onCreate to cleanly transition to postSplashScreenTheme
        SplashScreen.installSplashScreen(this);

        registerPlugin(NativeGoogleAuthPlugin.class);
        registerPlugin(NativeStoragePlugin.class);
        super.onCreate(savedInstanceState);
        
        // 2. Keep screen on while interacting and allow high-performance execution
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        
        // 3. Match decor view exactly to app theme
        getWindow().getDecorView().setBackgroundColor(Color.parseColor("#07090e"));

        // 4. Acquire CPU Partial WakeLock for 100% uninterrupted background translation & network
        acquireCpuWakeLock();
    }

    private void acquireCpuWakeLock() {
        try {
            if (wakeLock == null) {
                PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
                if (powerManager != null) {
                    wakeLock = powerManager.newWakeLock(
                        PowerManager.PARTIAL_WAKE_LOCK,
                        "SRTtranslator:BackgroundTranslationLock"
                    );
                    wakeLock.setReferenceCounted(false);
                }
            }
            if (wakeLock != null && !wakeLock.isHeld()) {
                wakeLock.acquire();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void requestIgnoreBatteryOptimizations() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
                String packageName = getPackageName();
                if (pm != null && !pm.isIgnoringBatteryOptimizations(packageName)) {
                    Intent intent = new Intent();
                    intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                    intent.setData(Uri.parse("package:" + packageName));
                    startActivity(intent);
                }
            }
        } catch (Exception e) {
            // Ignored if user has strict ROM restrictions
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        ensureWebViewConfiguredOnce();
    }

    @Override
    public void onResume() {
        super.onResume();
        acquireCpuWakeLock();
        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                WebView webView = getBridge().getWebView();
                webView.resumeTimers();
                webView.invalidate();
            }
        } catch (Exception e) {}
    }

    @Override
    public void onPause() {
        super.onPause();
        // Crucial: keep JS timers & web workers running at full speed in background
        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().resumeTimers();
            }
        } catch (Exception e) {}
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            if (wakeLock != null && wakeLock.isHeld()) {
                wakeLock.release();
            }
        } catch (Exception e) {}
    }

    private void ensureWebViewConfiguredOnce() {
        if (isWebViewConfigured) return;
        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                WebView webView = getBridge().getWebView();
                
                // Transparent background so Android compositor does not paint a solid layer on resume
                webView.setBackgroundColor(Color.TRANSPARENT);

                CookieManager cookieManager = CookieManager.getInstance();
                cookieManager.setAcceptCookie(true);
                cookieManager.setAcceptThirdPartyCookies(webView, true);

                WebSettings settings = webView.getSettings();
                settings.setAllowFileAccess(true);
                settings.setAllowContentAccess(true);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                
                // Maintain pre-rendered textures in background to avoid black/white reload flash on resume
                settings.setOffscreenPreRaster(true);
                settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

                // Auto-forward any download trigger directly to the external browser (Chrome / Android Default)
                webView.setDownloadListener(new DownloadListener() {
                    @Override
                    public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                        try {
                            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                });

                isWebViewConfigured = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
