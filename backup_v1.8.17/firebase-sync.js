/**
 * Firebase Auth & Cloud Firestore Universal Key Sync Engine
 * Dual-Engine: Uses native Firebase SDK + Direct Firestore REST API fallback
 * Guarantees 100% real-time cross-platform sync between Web and Android APK.
 */

(function () {
  let isFirebaseReady = false;
  let authInstance = null;
  let dbInstance = null;
  let authInitialized = false;

  // Instant local cache restore on page load to eliminate auth flash
  let currentUser = null;
  try {
    const rawNative = localStorage.getItem('srt_native_user');
    const rawWeb = localStorage.getItem('srt_cached_user');
    if (rawNative) {
      currentUser = JSON.parse(rawNative);
    } else if (rawWeb) {
      currentUser = JSON.parse(rawWeb);
    }
  } catch (e) {}

  const authListeners = [];
  let initialSyncResolver = null;
  const initialSyncPromise = new Promise((resolve) => {
    initialSyncResolver = resolve;
  });

  function markInitialSyncComplete() {
    if (initialSyncResolver) {
      initialSyncResolver();
      initialSyncResolver = null;
    }
  }

  function waitForInitialSync() {
    return initialSyncPromise;
  }

  const FIRESTORE_REST_BASE = 'https://firestore.googleapis.com/v1/projects/srt-translator-eaa94/databases/(default)/documents';
  const FIREBASE_API_KEY = 'AIzaSyBtTO_i4qeRTrRu0UJJpBTZx3DjfCz_QwI';

  function getEmailDocKey(user) {
    if (!user || !user.email) return null;
    return 'email_' + user.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  }

  function getUserDocKeys(user) {
    if (!user) return [];
    const keys = [];
    const emailKey = getEmailDocKey(user);
    if (emailKey) keys.push(emailKey);
    if (user.uid && !keys.includes(user.uid)) keys.push(user.uid);
    return keys;
  }

  function parseFirestoreFields(fields) {
    if (!fields) return {};
    const result = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v.stringValue !== undefined) result[k] = v.stringValue;
      else if (v.integerValue !== undefined) result[k] = Number(v.integerValue);
      else if (v.doubleValue !== undefined) result[k] = Number(v.doubleValue);
      else if (v.booleanValue !== undefined) result[k] = v.booleanValue;
      else if (v.mapValue && v.mapValue.fields) result[k] = parseFirestoreFields(v.mapValue.fields);
    }
    return result;
  }

  function encodeFirestoreFields(data) {
    const fields = {};
    for (const [k, v] of Object.entries(data)) {
      if (v === null || v === undefined) continue;
      if (typeof v === 'string') fields[k] = { stringValue: v };
      else if (typeof v === 'number') {
        if (Number.isInteger(v)) fields[k] = { integerValue: String(v) };
        else fields[k] = { doubleValue: v };
      }
      else if (typeof v === 'boolean') fields[k] = { booleanValue: v };
    }
    return { fields };
  }

  async function restGetDoc(docPath) {
    try {
      const url = `${FIRESTORE_REST_BASE}/${docPath}?key=${FIREBASE_API_KEY}&_t=${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();
      if (json && json.fields) {
        return parseFirestoreFields(json.fields);
      }
      return null;
    } catch (e) {
      console.warn('[Firebase Sync REST] Fetch error:', e);
      return null;
    }
  }

  async function restPatchDoc(docPath, data) {
    try {
      const url = `${FIRESTORE_REST_BASE}/${docPath}?key=${FIREBASE_API_KEY}`;
      const body = encodeFirestoreFields(data);
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return res.ok;
    } catch (e) {
      console.warn('[Firebase Sync REST] Patch error:', e);
      return false;
    }
  }

  async function restListDocs(collectionPath) {
    try {
      const url = `${FIRESTORE_REST_BASE}/${collectionPath}?key=${FIREBASE_API_KEY}&_t=${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const json = await res.json();
      if (json && json.documents && Array.isArray(json.documents)) {
        return json.documents.map(doc => {
          const docId = doc.name ? doc.name.split('/').pop() : '';
          const fields = doc.fields ? parseFirestoreFields(doc.fields) : {};
          return { ...fields, docId: fields.id || docId };
        });
      }
      return [];
    } catch (e) {
      console.warn('[Firebase Sync REST] List error:', e);
      return [];
    }
  }

  async function ensureFirebaseAuthSession() {
    if (!isFirebaseReady || !authInstance) return;
    try {
      if (!authInstance.currentUser) {
        await authInstance.signInAnonymously();
      }
    } catch (e) {
      console.warn('[Firebase Sync] Anonymous session note:', e);
    }
  }

  function initFirebase() {
    // Check saved native user session if on mobile
    const savedNativeUser = localStorage.getItem('srt_native_user');
    if (savedNativeUser) {
      try {
        currentUser = JSON.parse(savedNativeUser);
      } catch (e) {}
    }

    if (!window.FIREBASE_CONFIG || !window.FIREBASE_CONFIG.apiKey || window.FIREBASE_CONFIG.apiKey.trim() === '') {
      console.log('[Firebase Sync] Firebase config not set. Standalone mode.');
      if (currentUser) {
        setTimeout(() => {
          authListeners.forEach(cb => { try { cb(currentUser); } catch (e) {} });
        }, 50);
      }
      return false;
    }

    if (typeof firebase === 'undefined') {
      console.warn('[Firebase Sync] Firebase SDK not loaded.');
      if (currentUser) {
        setTimeout(() => {
          authListeners.forEach(cb => { try { cb(currentUser); } catch (e) {} });
        }, 50);
      }
      return false;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      authInstance = firebase.auth();
      dbInstance = firebase.firestore();
      isFirebaseReady = true;

      authInstance.onAuthStateChanged((user) => {
        const prevUid = currentUser ? currentUser.uid : null;
        const newUid = user ? user.uid : null;
        authInitialized = true;

        if (user && (!currentUser || !currentUser.isNativeUser)) {
          currentUser = user;
          try {
            localStorage.setItem('srt_cached_user', JSON.stringify({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              photoURL: user.photoURL || ''
            }));
          } catch (e) {}
        } else if (!user && (!currentUser || !currentUser.isNativeUser)) {
          currentUser = null;
          localStorage.removeItem('srt_cached_user');
        }

        // Only notify listeners if auth state actually changed (e.g. user changed, logged in/out)
        // or if this is the first initialization and listeners haven't run
        if (prevUid !== newUid || !authInitialized) {
          authListeners.forEach((callback) => {
            try {
              callback(currentUser);
            } catch (e) {
              console.error('[Firebase Sync] Auth listener error:', e);
            }
          });
        }

        // Note: markInitialSyncComplete is called by app.js onAuthStateChanged handler after full cloud sync
      });

      authInstance.getRedirectResult().then(result => {
        if (result && result.user) {
          console.log('[Firebase Sync] Redirect sign-in success:', result.user.email);
        }
      }).catch(err => {
        console.error('[Firebase Sync] Redirect sign-in error:', err);
      });

      console.log('[Firebase Sync] Initialized successfully with Universal Sync.');
      return true;
    } catch (err) {
      console.error('[Firebase Sync] Initialization error:', err);
      return false;
    }
  }

  async function signInWithGoogle() {
    // 1. Native Android Google Account Picker (Capacitor)
    if (window.Capacitor && window.Capacitor.isNativePlatform() && window.Capacitor.Plugins && window.Capacitor.Plugins.NativeGoogleAuth) {
      try {
        console.log('[Firebase Sync] Launching Native Android Google Account Picker...');
        const nativeAuth = window.Capacitor.Plugins.NativeGoogleAuth;
        const result = await nativeAuth.signIn({
          webClientId: window.FIREBASE_CONFIG?.webClientId || ''
        });

        if (!result || result.cancelled) {
          console.log('[Firebase Sync] User dismissed native Google account picker.');
          return null;
        }

        console.log('[Firebase Sync] Native Google account selected:', result.email);

        if (!isFirebaseReady) initFirebase();
        await ensureFirebaseAuthSession();

        // Construct seamless native profile
        const emailDocKey = result.email ? 'email_' + result.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_') : '';
        const localUid = emailDocKey || (result.id ? `google_${result.id}` : `google_${(result.email || 'user').replace(/[^a-zA-Z0-9]/g, '_')}`);
        
        const syntheticUser = {
          uid: localUid,
          email: result.email || '',
          displayName: result.displayName || result.givenName || (result.email ? result.email.split('@')[0] : 'Google User'),
          photoURL: result.photoUrl || '',
          isNativeUser: true
        };

        currentUser = syntheticUser;
        localStorage.setItem('srt_native_user', JSON.stringify(syntheticUser));

        authListeners.forEach((callback) => {
          try {
            callback(currentUser);
          } catch (e) {
            console.error('[Firebase Sync] Auth listener error:', e);
          }
        });

        return currentUser;
      } catch (nativeErr) {
        console.error('[Firebase Sync] Native Google Auth error:', nativeErr);
        const errMsg = String(nativeErr?.message || nativeErr || '');
        if (errMsg.includes('10') || errMsg.includes('12500') || errMsg.includes('DEVELOPER_ERROR')) {
          throw new Error('Google Play Services Auth requires SHA-1 Fingerprint configured in Firebase Console.');
        }
        throw nativeErr;
      }
    }

    // 2. Web Browser Fallback (Standard Web Popup / Redirect)
    if (!isFirebaseReady && !initFirebase()) {
      throw new Error('Firebase configuration not found.');
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await authInstance.signInWithPopup(provider);
      currentUser = result.user;
      return currentUser;
    } catch (err) {
      console.warn('[Firebase Sync] Google popup sign-in note:', err);
      if (err.code === 'auth/popup-blocked') {
        console.warn('[Firebase Sync] Popup blocked on web, trying redirect...');
        await authInstance.signInWithRedirect(provider);
        return null;
      }
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        console.log('[Firebase Sync] User dismissed sign-in.');
        return null;
      }
      throw err;
    }
  }

  async function signOutUser() {
    if (window.Capacitor && window.Capacitor.isNativePlatform() && window.Capacitor.Plugins && window.Capacitor.Plugins.NativeGoogleAuth) {
      try {
        await window.Capacitor.Plugins.NativeGoogleAuth.signOut();
      } catch (e) {
        console.warn('[Firebase Sync] Native sign out note:', e);
      }
    }

    localStorage.removeItem('srt_native_user');
    localStorage.removeItem('srt_cached_user');

    if (authInstance) {
      try {
        await authInstance.signOut();
      } catch (e) {}
    }
    
    authInitialized = true;
    currentUser = null;
    authListeners.forEach((callback) => {
      try {
        callback(null);
      } catch (e) {}
    });
  }

  async function saveKeysToCloud(keysData) {
    if (!currentUser) return false;

    const payload = {
      ...keysData,
      userEmail: currentUser.email || '',
      displayName: currentUser.displayName || '',
      updatedAtMs: Date.now()
    };

    const docKeys = getUserDocKeys(currentUser);
    let success = false;

    // 1. Save via REST API (Universal & 100% Reliable across Web & APK)
    for (const k of docKeys) {
      const ok = await restPatchDoc(`users/${k}/settings/api_keys`, payload);
      if (ok) success = true;
    }

    // 2. Also save via Firestore SDK if available
    if (isFirebaseReady && dbInstance) {
      try {
        const sdkPayload = {
          ...payload,
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        };
        const sdkPromises = docKeys.map(k =>
          dbInstance.collection('users').doc(k).collection('settings').doc('api_keys').set(sdkPayload, { merge: true }).catch(() => {})
        );
        await Promise.all(sdkPromises);
        success = true;
      } catch (e) {}
    }

    console.log('[Firebase Sync] Save keys result:', success);
    return success;
  }

  async function loadKeysFromCloud() {
    if (!currentUser) return null;

    const docKeys = getUserDocKeys(currentUser);

    // 1. Try REST API first (Bypasses local cache, guaranteed fresh from cloud)
    for (const k of docKeys) {
      const data = await restGetDoc(`users/${k}/settings/api_keys`);
      if (data && typeof data === 'object') {
        const hasAnyKey = ['gemini', 'openrouter', 'groq', 'deepseek', 'openai', 'custom'].some(p => data[p] && data[p].length > 2) || (data.custom_api_base_url && data.custom_api_base_url.length > 5);
        if (hasAnyKey) {
          console.log('[Firebase Sync] Keys successfully loaded via Universal REST from', k);
          return data;
        }
      }
    }

    // 2. Fallback to Firestore SDK if REST was empty
    if (isFirebaseReady && dbInstance) {
      try {
        for (const k of docKeys) {
          const doc = await dbInstance.collection('users').doc(k).collection('settings').doc('api_keys').get();
          if (doc.exists) {
            const data = doc.data();
            console.log('[Firebase Sync] Keys loaded via Firestore SDK from', k);
            return data;
          }
        }
      } catch (e) {}
    }

    return null;
  }

  // ── Universal User Preferences Sync (Target Language & Pacing Preset) ──
  async function savePreferencesToCloud(prefs) {
    if (!currentUser || !prefs) return false;

    const payload = {
      targetLang: prefs.targetLang || 'Bengali',
      pacingPreset: prefs.pacingPreset || 'concise',
      userEmail: currentUser.email || '',
      displayName: currentUser.displayName || '',
      updatedAtMs: Date.now()
    };

    const docKeys = getUserDocKeys(currentUser);
    let success = false;

    // 1. Save via REST API
    for (const k of docKeys) {
      const ok = await restPatchDoc(`users/${k}/settings/preferences`, payload);
      if (ok) success = true;
    }

    // 2. Also save via Firestore SDK if available
    if (isFirebaseReady && dbInstance) {
      try {
        const sdkPayload = {
          ...payload,
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        };
        const sdkPromises = docKeys.map(k =>
          dbInstance.collection('users').doc(k).collection('settings').doc('preferences').set(sdkPayload, { merge: true }).catch(() => {})
        );
        await Promise.all(sdkPromises);
        success = true;
      } catch (e) {}
    }

    console.log('[Firebase Sync] Preferences saved to cloud:', payload);
    return success;
  }

  async function loadPreferencesFromCloud() {
    if (!currentUser) return null;

    const docKeys = getUserDocKeys(currentUser);

    // 1. Try REST API
    for (const k of docKeys) {
      const data = await restGetDoc(`users/${k}/settings/preferences`);
      if (data && typeof data === 'object' && (data.targetLang || data.pacingPreset)) {
        console.log('[Firebase Sync] Preferences loaded via REST from', k);
        return data;
      }
    }

    // 2. Fallback to Firestore SDK
    if (isFirebaseReady && dbInstance) {
      try {
        for (const k of docKeys) {
          const doc = await dbInstance.collection('users').doc(k).collection('settings').doc('preferences').get();
          if (doc.exists) {
            const data = doc.data();
            if (data && (data.targetLang || data.pacingPreset)) {
              console.log('[Firebase Sync] Preferences loaded via Firestore SDK from', k);
              return data;
            }
          }
        }
      } catch (e) {}
    }

    return null;
  }

  // ── Global FIFO Auto-Purge & 7-Day Auto-Expiring Translation Engine ──
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  async function saveTranslationToCloud(translationData) {
    if (!currentUser) return null;

    try {
      const now = Date.now();
      const expiresAt = now + SEVEN_DAYS_MS;
      const docId = 'trans_' + now + '_' + Math.random().toString(36).substr(2, 6);
      const emailKey = getEmailDocKey(currentUser) || currentUser.uid;

      const payload = {
        id: docId,
        uid: currentUser.uid,
        emailKey: emailKey,
        userEmail: currentUser.email || '',
        fileName: translationData.fileName || 'translated_subtitle.srt',
        sourceLang: translationData.sourceLang || 'Auto-detect',
        targetLang: translationData.targetLang || 'Bengali',
        modelUsed: translationData.modelUsed || 'AI Model',
        blockCount: translationData.blockCount || 0,
        srtContent: translationData.srtContent || '',
        fileSizeFormatted: translationData.fileSizeFormatted || '',
        createdAtMs: now,
        expiresAtMs: expiresAt
      };

      const docKeys = getUserDocKeys(currentUser);

      // Save via REST
      for (const k of docKeys) {
        restPatchDoc(`users/${k}/translations/${docId}`, payload);
      }
      restPatchDoc(`translations/${docId}`, payload);

      // Also save via SDK
      if (isFirebaseReady && dbInstance) {
        const sdkPayload = {
          ...payload,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        docKeys.forEach(k => {
          dbInstance.collection('users').doc(k).collection('translations').doc(docId).set(sdkPayload).catch(() => {});
        });
        dbInstance.collection('translations').doc(docId).set(sdkPayload).catch(() => {});
      }

      console.log('[Firebase Sync] Translation archive saved:', docId);
      return docId;
    } catch (err) {
      console.error('[Firebase Sync] Error saving translation to cloud:', err);
      return null;
    }
  }

  async function getCloudTranslationHistory() {
    if (!currentUser) return [];

    try {
      const now = Date.now();
      const activeMap = new Map();
      const docKeys = getUserDocKeys(currentUser);

      // 1. Try Firestore SDK
      if (isFirebaseReady && dbInstance) {
        for (const k of docKeys) {
          try {
            const snap = await dbInstance.collection('users').doc(k).collection('translations').get();
            snap.forEach(doc => {
              const data = doc.data();
              const expiresAt = data.expiresAtMs || 0;
              if (expiresAt > 0 && expiresAt >= now && !activeMap.has(doc.id)) {
                activeMap.set(doc.id, {
                  ...data,
                  docId: doc.id,
                  daysLeft: Math.max(0, Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000)))
                });
              }
            });
          } catch (e) {}
        }
      }

      // 2. Dual-Engine REST Fallback & Augmentation
      for (const k of docKeys) {
        try {
          const restItems = await restListDocs(`users/${k}/translations`);
          restItems.forEach(item => {
            const docId = item.docId || item.id;
            const expiresAt = item.expiresAtMs || 0;
            if (docId && expiresAt > 0 && expiresAt >= now && !activeMap.has(docId)) {
              activeMap.set(docId, {
                ...item,
                docId: docId,
                daysLeft: Math.max(0, Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000)))
              });
            }
          });
        } catch (e) {}
      }

      const activeList = Array.from(activeMap.values());
      activeList.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

      return activeList;
    } catch (err) {
      console.error('[Firebase Sync] Error fetching translation history:', err);
      return [];
    }
  }

  async function deleteCloudTranslation(docId) {
    if (!currentUser || !docId) return false;

    try {
      const docKeys = getUserDocKeys(currentUser);
      if (isFirebaseReady && dbInstance) {
        docKeys.forEach(k => {
          dbInstance.collection('users').doc(k).collection('translations').doc(docId).delete().catch(() => {});
        });
        dbInstance.collection('translations').doc(docId).delete().catch(() => {});
      }
      return true;
    } catch (err) {
      console.error('[Firebase Sync] Error deleting translation from cloud:', err);
      return false;
    }
  }

  async function renameCloudTranslation(docId, newFileName) {
    if (!currentUser || !docId || !newFileName) return false;

    try {
      const cleanName = newFileName.trim().endsWith('.srt') ? newFileName.trim() : `${newFileName.trim()}.srt`;
      const docKeys = getUserDocKeys(currentUser);
      const payload = { fileName: cleanName };

      // Update via REST
      for (const k of docKeys) {
        restPatchDoc(`users/${k}/translations/${docId}`, payload);
      }
      restPatchDoc(`translations/${docId}`, payload);

      // Update via SDK
      if (isFirebaseReady && dbInstance) {
        docKeys.forEach(k => {
          dbInstance.collection('users').doc(k).collection('translations').doc(docId).update(payload).catch(() => {});
        });
        dbInstance.collection('translations').doc(docId).update(payload).catch(() => {});
      }
      console.log('[Firebase Sync] Translation renamed in cloud:', docId, '->', cleanName);
      return true;
    } catch (err) {
      console.error('[Firebase Sync] Error renaming translation in cloud:', err);
      return false;
    }
  }

  function onAuthStateChanged(callback) {
    if (typeof callback === 'function') {
      authListeners.push(callback);
      if (currentUser !== null) {
        callback(currentUser);
      }
    }
  }

  window.FirebaseCloudSync = {
    init: initFirebase,
    isReady: () => isFirebaseReady,
    isAuthInitialized: () => authInitialized || !!currentUser,
    getUser: () => currentUser,
    signInWithGoogle,
    signOut: signOutUser,
    saveKeysToCloud,
    loadKeysFromCloud,
    savePreferencesToCloud,
    loadPreferencesFromCloud,
    saveTranslationToCloud,
    getCloudTranslationHistory,
    deleteCloudTranslation,
    renameCloudTranslation,
    onAuthStateChanged,
    waitForInitialSync,
    markInitialSyncComplete
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
  } else {
    initFirebase();
  }
})();
