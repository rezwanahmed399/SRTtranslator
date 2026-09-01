package com.soptosur.srttranslator;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "NativeStorage")
public class NativeStoragePlugin extends Plugin {

    private static final String SUB_FOLDER = "SRTtranslator";
    private static final String RELATIVE_DOWNLOAD_PATH = Environment.DIRECTORY_DOWNLOADS + "/" + SUB_FOLDER + "/";

    @PluginMethod
    public void saveSubtitleToStorage(PluginCall call) {
        String rawFileName = call.getString("fileName", "subtitle.srt");
        String content = call.getString("content", "");

        if (content == null) {
            content = "";
        }

        if (rawFileName == null || rawFileName.trim().isEmpty()) {
            rawFileName = "subtitle.srt";
        }
        if (!rawFileName.toLowerCase().endsWith(".srt")) {
            rawFileName = rawFileName + ".srt";
        }

        // Sanitize filename for Android filesystem
        String sanitizedName = rawFileName.replaceAll("[\\\\/:*?\"<>|]", "_");
        String baseName = sanitizedName.substring(0, sanitizedName.length() - 4);
        String ext = ".srt";

        Context context = getContext();
        ContentResolver resolver = context.getContentResolver();

        try {
            String resolvedFileName = sanitizedName;

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Android 10+ (API 29+) MediaStore Scoped Storage
                resolvedFileName = getUniqueMediaStoreFileName(resolver, baseName, ext);

                ContentValues values = new ContentValues();
                values.put(MediaStore.Downloads.DISPLAY_NAME, resolvedFileName);
                values.put(MediaStore.Downloads.MIME_TYPE, "application/x-subrip");
                values.put(MediaStore.Downloads.RELATIVE_PATH, RELATIVE_DOWNLOAD_PATH);
                values.put(MediaStore.Downloads.IS_PENDING, 1);

                Uri uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                if (uri == null) {
                    call.reject("Could not create entry in MediaStore Downloads");
                    return;
                }

                try (OutputStream os = resolver.openOutputStream(uri)) {
                    if (os != null) {
                        os.write(content.getBytes(StandardCharsets.UTF_8));
                        os.flush();
                    }
                }

                values.clear();
                values.put(MediaStore.Downloads.IS_PENDING, 0);
                resolver.update(uri, values, null, null);

                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("fileName", resolvedFileName);
                ret.put("relativePath", "/Download/" + SUB_FOLDER + "/" + resolvedFileName);
                ret.put("uri", uri.toString());
                call.resolve(ret);

            } else {
                // Legacy Android 9 & below
                File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                File targetFolder = new File(downloadsDir, SUB_FOLDER);
                if (!targetFolder.exists()) {
                    targetFolder.mkdirs();
                }

                File targetFile = new File(targetFolder, sanitizedName);
                int counter = 1;
                while (targetFile.exists()) {
                    resolvedFileName = baseName + " (" + counter + ")" + ext;
                    targetFile = new File(targetFolder, resolvedFileName);
                    counter++;
                }

                try (FileOutputStream fos = new FileOutputStream(targetFile)) {
                    fos.write(content.getBytes(StandardCharsets.UTF_8));
                    fos.flush();
                }

                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("fileName", resolvedFileName);
                ret.put("relativePath", "/Download/" + SUB_FOLDER + "/" + resolvedFileName);
                ret.put("absolutePath", targetFile.getAbsolutePath());
                call.resolve(ret);
            }

        } catch (Exception e) {
            call.reject("Failed to save subtitle file: " + e.getMessage(), e);
        }
    }

    private String getUniqueMediaStoreFileName(ContentResolver resolver, String baseName, String ext) {
        String targetName = baseName + ext;
        int counter = 1;

        while (isFileNameInMediaStore(resolver, targetName)) {
            targetName = baseName + " (" + counter + ")" + ext;
            counter++;
        }

        return targetName;
    }

    private boolean isFileNameInMediaStore(ContentResolver resolver, String fileName) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) return false;

        String[] projection = new String[]{MediaStore.Downloads._ID, MediaStore.Downloads.DISPLAY_NAME};
        String selection = MediaStore.Downloads.DISPLAY_NAME + " = ? AND " + MediaStore.Downloads.RELATIVE_PATH + " LIKE ?";
        String[] selectionArgs = new String[]{fileName, "%" + SUB_FOLDER + "%"};

        try (Cursor cursor = resolver.query(
                MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                projection,
                selection,
                selectionArgs,
                null)) {
            return cursor != null && cursor.moveToFirst();
        } catch (Exception e) {
            return false;
        }
    }

    @PluginMethod
    public void shareSubtitle(PluginCall call) {
        String fileName = call.getString("fileName", "subtitle.srt");
        String content = call.getString("content", "");

        if (fileName == null || fileName.trim().isEmpty()) {
            fileName = "subtitle.srt";
        }
        if (!fileName.toLowerCase().endsWith(".srt")) {
            fileName = fileName + ".srt";
        }

        Context context = getContext();
        try {
            File cacheDir = new File(context.getCacheDir(), "shared_subtitles");
            if (!cacheDir.exists()) {
                cacheDir.mkdirs();
            }

            File shareFile = new File(cacheDir, fileName);
            try (FileOutputStream fos = new FileOutputStream(shareFile)) {
                fos.write(content.getBytes(StandardCharsets.UTF_8));
                fos.flush();
            }

            Uri fileUri = FileProvider.getUriForFile(
                    context,
                    context.getPackageName() + ".fileprovider",
                    shareFile
            );

            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("application/x-subrip");
            shareIntent.putExtra(Intent.EXTRA_STREAM, fileUri);
            shareIntent.putExtra(Intent.EXTRA_SUBJECT, fileName);
            shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            Intent chooser = Intent.createChooser(shareIntent, "Share Subtitle via");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(chooser);

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to share subtitle: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void verifyFilesExist(PluginCall call) {
        JSArray namesArray = call.getArray("fileNames");
        if (namesArray == null) {
            JSObject ret = new JSObject();
            ret.put("existingMap", new JSObject());
            call.resolve(ret);
            return;
        }

        Context context = getContext();
        ContentResolver resolver = context.getContentResolver();
        JSObject existingMap = new JSObject();

        File legacyDownloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        File legacyTargetFolder = new File(legacyDownloadsDir, SUB_FOLDER);

        try {
            for (int i = 0; i < namesArray.length(); i++) {
                String fileName = namesArray.getString(i);
                if (fileName == null || fileName.trim().isEmpty()) continue;

                boolean exists = false;

                // 1. Direct file existence check in /Download/SRTtranslator/
                File directFile = new File(legacyTargetFolder, fileName);
                if (directFile.exists() && directFile.length() > 0) {
                    exists = true;
                }

                // 2. MediaStore check for Android 10+ (API 29+)
                if (!exists && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    exists = isFileNameInMediaStore(resolver, fileName);
                }

                existingMap.put(fileName, exists);
            }

            JSObject ret = new JSObject();
            ret.put("existingMap", existingMap);
            call.resolve(ret);

        } catch (Exception e) {
            call.reject("Failed to verify files: " + e.getMessage(), e);
        }
    }
}
