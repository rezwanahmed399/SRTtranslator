# SRTtranslator — Android App & Google Play Store Build Guide

This project is configured as a standalone native Android application powered by **Capacitor**. All web assets, translation engines, SRT parsers, and UI components are bundled directly inside the app for instant startup and offline readiness.

---

## 📁 Android Project Structure

- `android/` — Native Android Studio project folder with Gradle build configurations.
- `www/` — Bundled offline-first web assets (`index.html`, `style.css`, `app.js`).
- `capacitor.config.json` — Capacitor native bridge configuration.
- `build-app.js` — Automated packaging script.

---

## 🚀 How to Build the Android App

### 1. Rebuild & Sync Web Assets to Android
Whenever you modify `index.html`, `style.css`, or `app.js`, run:
```bash
npm run cap:sync
```
This updates the bundled assets inside `android/app/src/main/assets/public/`.

---

### 2. Open in Android Studio
To open the project directly in Android Studio:
```bash
npm run cap:open
```
*(Or open the `android` folder directly from Android Studio: File -> Open -> Select `subtitle-translator/android`)*

---

### 3. Generate Debug APK (For Testing on Physical Phone)
In Android Studio:
1. Click **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
2. Once the build finishes, click **locate** to get `app-debug.apk`.
3. Transfer and install `app-debug.apk` onto any Android phone.

*(Or from terminal if Gradle/Java is in PATH: `cd android && ./gradlew assembleDebug`)*

---

### 4. Generate Signed Release AAB (For Google Play Store)
Google Play Store requires an **Android App Bundle (`.aab`)**:

1. In Android Studio, go to **Build** -> **Generate Signed Bundle / APK...**
2. Select **Android App Bundle** and click **Next**.
3. Create or select your keystore file (`.jks` / `.keystore`), enter password, and select key alias.
4. Select **release** build variant and click **Finish**.
5. The signed `.aab` file will be generated in `android/app/release/app-release.aab`.
6. Upload `app-release.aab` directly to **Google Play Console** -> **Production** / **Internal Testing**.

---

## 🛡️ Play Store Compliance Highlights
- **Package ID:** `com.soptosur.srttranslator`
- **Permissions:** Only `android.permission.INTERNET` (no invasive permissions).
- **Target SDK:** Android 14 / 15 (API 34/35 compatible).
- **Offline First:** 100% compliant with Google Play's Standalone App Policy.
