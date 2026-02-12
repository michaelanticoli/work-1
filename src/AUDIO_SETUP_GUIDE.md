# Audio Storage Setup Guide

## Overview
Your portfolio now uses Supabase Storage to manage MP3 files for your persona audio players.

## System Architecture

**Frontend** → **Supabase Edge Function** → **Supabase Storage**

- Audio files are stored securely in a private Supabase bucket
- The server generates signed URLs (valid for 1 hour) for playback
- Audio players automatically fetch URLs when needed

## How to Upload Audio Files

### Step 1: Access the Admin Panel
1. Navigate to your portfolio site
2. Scroll to the footer
3. Click the small **⚙️ Settings icon** (subtle, on the right side)
4. Or go directly to: `yoursite.com/admin/audio`

### Step 2: Upload Files
1. Click the upload zone
2. Select your MP3 file
3. Name it to match your persona code (e.g., `persona1.mp3`)
4. The file uploads to Supabase Storage
5. Repeat for all persona audio files

### Step 3: File Naming Convention
Match these filenames to your persona `audioSrc` values in your code:

Example:
- If your code has: `audioSrc: "/audio/persona1.mp3"`
- Upload file named: `persona1.mp3`

The AudioPlayer component automatically:
1. Extracts the filename from the path
2. Requests a signed URL from the server
3. Plays the audio from Supabase Storage

## What Files Exist Now

**Server Routes** (`/supabase/functions/server/index.tsx`):
- `POST /make-server-b5eacdbd/audio/upload` - Upload MP3 files
- `GET /make-server-b5eacdbd/audio/:fileName` - Get signed URL
- `GET /make-server-b5eacdbd/audio` - List all files
- `DELETE /make-server-b5eacdbd/audio/:fileName` - Delete files

**Frontend Components**:
- `/components/AudioUploadAdmin.tsx` - Upload interface
- `/components/AudioPlayer.tsx` - Updated to fetch from Supabase
- `/pages/AudioAdmin.tsx` - Admin page wrapper
- `/pages/Portfolio.tsx` - Your main portfolio

## Technical Details

### Bucket Configuration
- **Name**: `make-b5eacdbd-audio`
- **Privacy**: Private (requires signed URLs)
- **Max File Size**: 50MB
- **Allowed Types**: MP3, WAV, OGG

### URL Expiration
Signed URLs expire after 1 hour. The AudioPlayer automatically requests a new URL when the component loads, so users won't experience expired URLs.

### Error Handling
If a file doesn't exist:
- Console shows: `Audio file not found: {filename}. Upload it via the admin panel.`
- Audio player displays but won't play

## Next Steps

1. **Upload your audio files** via `/admin/audio`
2. Files should match the names in your PersonaModal data
3. Test each persona modal to confirm playback
4. Audio will persist across deployments

## Security Note

The admin panel is publicly accessible at `/admin/audio`. Consider adding authentication if you want to restrict access (not currently implemented).
