package com.soptosur.srttranslator;

import android.content.Intent;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

@CapacitorPlugin(name = "NativeGoogleAuth")
public class NativeGoogleAuthPlugin extends Plugin {
    private GoogleSignInClient googleSignInClient;

    @PluginMethod
    public void signIn(PluginCall call) {
        try {
            String webClientId = call.getString("webClientId", "");
            
            GoogleSignInOptions.Builder gsoBuilder = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestEmail()
                    .requestProfile();

            if (webClientId != null && !webClientId.trim().isEmpty()) {
                gsoBuilder.requestIdToken(webClientId.trim());
            }

            GoogleSignInOptions gso = gsoBuilder.build();
            googleSignInClient = GoogleSignIn.getClient(getActivity(), gso);

            // Sign out first so the native account picker always shows the accounts on the device
            googleSignInClient.signOut().addOnCompleteListener(task -> {
                Intent signInIntent = googleSignInClient.getSignInIntent();
                startActivityForResult(call, signInIntent, "handleSignInResult");
            });
        } catch (Exception e) {
            call.reject("Failed to launch Google Sign-In: " + e.getMessage(), e);
        }
    }

    @ActivityCallback
    private void handleSignInResult(PluginCall call, ActivityResult result) {
        if (call == null) {
            return;
        }

        Intent data = result.getData();
        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
        try {
            GoogleSignInAccount account = task.getResult(ApiException.class);
            if (account != null) {
                JSObject ret = new JSObject();
                ret.put("id", account.getId());
                ret.put("email", account.getEmail());
                ret.put("displayName", account.getDisplayName());
                ret.put("givenName", account.getGivenName());
                ret.put("familyName", account.getFamilyName());
                ret.put("photoUrl", account.getPhotoUrl() != null ? account.getPhotoUrl().toString() : "");
                ret.put("idToken", account.getIdToken() != null ? account.getIdToken() : "");
                ret.put("serverAuthCode", account.getServerAuthCode() != null ? account.getServerAuthCode() : "");
                call.resolve(ret);
            } else {
                call.reject("Google Sign-In returned null account");
            }
        } catch (ApiException e) {
            int statusCode = e.getStatusCode();
            if (statusCode == 12501 || statusCode == 12502) {
                JSObject ret = new JSObject();
                ret.put("cancelled", true);
                call.resolve(ret);
            } else {
                call.reject("Google Sign-In failed with status code " + statusCode + ": " + e.getMessage(), e);
            }
        } catch (Exception e) {
            call.reject("Google Sign-In failed: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void signOut(PluginCall call) {
        try {
            if (googleSignInClient == null) {
                GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                        .requestEmail()
                        .build();
                googleSignInClient = GoogleSignIn.getClient(getActivity(), gso);
            }
            googleSignInClient.signOut().addOnCompleteListener(task -> {
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            });
        } catch (Exception e) {
            call.reject("Sign out failed: " + e.getMessage(), e);
        }
    }
}
