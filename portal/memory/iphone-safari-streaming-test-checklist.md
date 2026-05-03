# iPhone Safari Streaming Test Checklist

**Date**: 2026-03-26
**Files Audited**:
- `js/admin/live-stream-admin.js` (broadcaster / admin studio)
- `js/live-streaming.js` (student viewer)
- `_headers` (CSP / security headers)

---

## 1. BROADCASTER ON IPHONE (Admin Studio)

### 1.1 Open Studio Modal -- Camera Preview

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 1.1.1 | Open "Transmitir desde Aqui" -- modal appears fullscreen | `adminGoLiveBrowser()` line ~1967 | Modal uses `position:fixed;inset:0` -- should cover full viewport. On iOS with notch, content might clip under status bar. | `[Studio] 100ms SDK initialized` |
| 1.1.2 | Camera preview loads in `<video>` element | `lsaSelectSource('camera')` line ~2203 | `getUserMedia({facingMode:'user'})` -- iOS Safari may show a permission dialog. If denied, `status.textContent = 'Error: Permiso denegado'`. Video element has `autoplay muted playsinline` attributes (CRITICAL for iOS autoplay). | `[Studio] Source error:` if fail |
| 1.1.3 | Video plays inline (not fullscreen) | `<video id="lsaPreviewVideo" autoplay muted playsinline>` line ~2008 | MUST have `playsinline` attribute. Without it, iOS Safari forces fullscreen video. Already present -- PASS. | N/A |
| 1.1.4 | Audio permissions granted alongside camera | `getUserMedia({ video: {...}, audio: true })` line ~2204 | iOS Safari asks for camera+mic in one prompt. If user denies mic but allows camera, stream has no audio tracks and `lsaToggleMic()` will silently fail. | Check `_lsaLocalStream.getAudioTracks().length` in console |

### 1.2 Camera Flip Button

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 1.2.1 | Floating flip button visible on mobile | `#lsaFloatingFlip` CSS line ~54-61 | `display:none` by default, `@media(max-width:900px)` sets `display:flex!important`. iPhone viewport is always <900px -- should show. | Check if button is visible on top-right of video |
| 1.2.2 | Tap flip -- switches front/back camera | `lsaFlipCamera()` line ~2447 | **Strategy 1 (deviceId)**: Enumerates devices, picks different camera by `deviceId`. On iOS, must STOP OLD TRACKS FIRST before requesting new ones (line ~2480: `_lsaCamStream.getTracks().forEach(t => t.stop())`). If this step is skipped, iOS returns the same camera. | `[Studio] Flipped via deviceId:` or `[Studio] Camera flipped to:` |
| 1.2.3 | Flip preserves mute state | Lines ~2537-2539 | After flip, if mic was muted (`_lsaMicMuted`), new stream audio tracks get `enabled=false`. Should work. | Check mic button icon stays correct |
| 1.2.4 | Single-camera device -- shows friendly message | Lines ~2493-2498 | If `cameras.length <= 1`, shows toast "Solo se detecto una camara". iPads have front+back; older iPods may have only front. | `[Studio] Only X camera(s) found` |
| 1.2.5 | Flip during live stream -- 100ms track does NOT auto-update | Comment at line ~2524: "100ms manages its own tracks via SDK" | **POTENTIAL ISSUE**: Local preview updates but 100ms HLS broadcast may NOT show the flipped camera to students. The code only updates `video.srcObject` locally. Need to verify if 100ms SDK auto-detects the track replacement or if `setLocalVideoEnabled`/track replacement is needed. | Watch student side -- does camera actually flip for viewers? |

### 1.3 Chat Toggle Button (Show/Hide Sidebar)

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 1.3.1 | Chat toggle button visible on mobile | `lsaBtnChatToggle` with class `lsa-chat-toggle`, CSS line ~82: `display:inline-flex!important` at `@media(max-width:900px)` | Should be visible in control bar. | Visually confirm button present |
| 1.3.2 | Tap toggle -- sidebar slides up from bottom | `lsaToggleChatMobile()` line ~2415 | On mobile (`window.innerWidth <= 900`), adds/removes class `lsa-sidebar-open`. CSS (lines ~68-75) makes sidebar `position:fixed;bottom:0;height:55vh;border-radius:16px 16px 0 0`. | Toggle open/close, check sidebar appears |
| 1.3.3 | Sidebar overlay does not block video controls | Sidebar `z-index:99990`, control bar is in normal flow below video | Control bar should remain accessible below the sidebar. However, if sidebar is 55vh, on small iPhones (SE) the control bar might be hidden behind it. | Test on iPhone SE (small screen) specifically |
| 1.3.4 | Chat input keyboard pushes layout correctly | Chat input in sidebar uses standard `<input>` | iOS Safari keyboard resize can push fixed elements off-screen. The sidebar uses `position:fixed;bottom:0` which should adapt. However, iOS 15+ uses `visual viewport` API which may cause the sidebar to float above keyboard. | Type in chat while sidebar is open |

### 1.4 "Iniciar Transmision" -- Starts HLS Stream

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 1.4.1 | Button click initiates 100ms connection | `lsaStartHmsStream()` line ~3409 | First checks `window.HMSReactiveStore` is loaded. If 100ms SDK script failed to load (CSP, network), shows alert. | `[Studio] 100ms SDK initialized` |
| 1.4.2 | 100ms join with Safari retry logic | Lines ~3460-3489 | **Up to 3 retries** with exponential backoff (2s, 4s, 6s). Safari sometimes fails on first join attempt. Between retries: leaves cleanly, gets fresh token. | `[Studio] join() attempt X/3 failed:` then `[Studio] Joined 100ms room (attempt X)` |
| 1.4.3 | HLS streaming starts | `_lsaHmsActions.startHLSStreaming({})` line ~3544 | Waits for HLS URL via store.subscribe + polling fallback (30 attempts, 1s each). Safety timeout at 35s. | `[Studio] HLS URL (reactive):` or `[Studio] HLS URL (poll):` |
| 1.4.4 | Playback URL saved to Supabase | `_lsaUpdatePlaybackUrl()` line ~3637 | Students can't watch without this. If HLS URL is null, tries `_lsaFetchHlsUrlFromApi()` as backup. | `[Studio] playback_url updated to:` |
| 1.4.5 | Stream status set to "live" in Supabase | Line ~3666 | Students see the stream card appear with "EN VIVO" badge. | Check Supabase `live_streams` table |
| 1.4.6 | Local recording auto-starts as backup | Lines ~3668-3681 | `setTimeout` 1500ms after going live. Uses `MediaRecorder` with `video/webm;codecs=vp9,opus` or fallback. **iOS Safari does NOT support MediaRecorder for video.** This will silently fail. | `[Studio] Auto-started local recording` or error |
| 1.4.7 | Visibility handler installed for backgrounding | Lines ~3683-3718 | If page hidden for 10 min, auto-ends stream. Uses `visibilitychange` event. | `[Studio] Page hidden for 10 min -- ending stream` |

### 1.5 Control Bar Buttons -- Accessibility

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 1.5.1 | All control buttons visible on screen | `#lsaControlBar` with `flex-wrap:wrap` | At `@media(max-width:900px)`: `padding:8px 10px`, buttons `32-36px`. With ~15 buttons + dividers, wrapping is expected. Verify nothing is clipped off-screen. | Visually count all buttons |
| 1.5.2 | Buttons have adequate tap targets | Buttons are `36-40px` circles (32px at <480px) | Apple HIG recommends 44px minimum. At 32px on very small phones, tapping adjacent buttons risks mis-taps. | Test tapping each button without accidentally hitting neighbors |
| 1.5.3 | Mic toggle works | `lsaToggleMic()` line ~2300 | Calls `_lsaHmsActions.setLocalAudioEnabled(!_lsaMicMuted)` for 100ms broadcast + sets local track `enabled`. | Button changes icon: microphone <-> muted |
| 1.5.4 | Camera ON/OFF toggle works | `lsaToggleCamOff()` line ~2323 | Calls `_lsaHmsActions.setLocalVideoEnabled(!_lsaCamOff)` for 100ms + local track. | Button changes icon: camera <-> blocked |

### 1.6 iOS Safe-Area (Notch / Home Indicator)

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 1.6.1 | Control bar respects safe-area-inset-bottom | CSS lines ~93-96: `@supports (padding-bottom: env(safe-area-inset-bottom)){ #lsaControlBar{padding-bottom:max(10px, env(safe-area-inset-bottom))!important;} }` | This ONLY covers the control bar. The top bar, source bar, and sidebar do NOT have safe-area insets. On iPhone with Dynamic Island / notch, the top bar title might be clipped. | Check corners and edges of every UI element |
| 1.6.2 | Video preview not clipped by notch in landscape | No landscape-specific safe-area CSS found | **POTENTIAL ISSUE**: If instructor rotates iPhone to landscape, the notch cuts into the left/right side of the video. No `safe-area-inset-left/right` padding is applied to the video container. | Rotate to landscape and check video edges |
| 1.6.3 | Home indicator doesn't overlap bottom controls | Covered by 1.6.1 for control bar only | Home indicator is ~34px on modern iPhones. `env(safe-area-inset-bottom)` should handle it. | Swipe up from bottom -- check if controls are tappable without triggering home gesture |

### 1.7 Break Timer, Waiting Room, Participants

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 1.7.1 | Break timer overlay appears over video | `#lsaBreakOverlay` (line ~2026) with `position:absolute;inset:0;z-index:15` | On mobile, overlay font-size is 72px for countdown -- might overflow on small screens. No `max-width` or `overflow` set. | Start a break and check timer display |
| 1.7.2 | Waiting room button accessible | `#lsaBtnWaitingRoom` in control bar | Part of the flex-wrap control bar. Badge counter overlay (`#lsaWrBadge`) uses `position:absolute;top:-4px;right:-4px` -- on mobile this might clip if button is at the edge. | Check badge number visibility |
| 1.7.3 | Participants panel opens in sidebar | `lsaToggleParticipantsPanel()` calls `lsaSidebarTab('participants')` | On mobile, sidebar is the slide-up panel. Switching tabs within the sidebar should work. If sidebar is closed when tapping participants button, it should open + switch tab. | Tap participants, verify list appears |

### 1.8 "Cambiar Dispositivo" -- Releases Stream

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 1.8.1 | Confirm dialog appears | `lsaReleaseForDeviceSwitch()` line ~3774 | Uses `confirm()` -- works on iOS Safari. | Tap "Cambiar Dispositivo", see confirm |
| 1.8.2 | Local streams stopped | Lines ~3782-3784 | All tracks stopped: `_lsaLocalStream`, `_lsaCamStream`, `_lsaWbStream`. Camera light should turn off on iPhone. | Camera indicator (green dot) disappears |
| 1.8.3 | 100ms room left WITHOUT stopping HLS | Line ~3789: `_lsaHmsActions.leave()` (no `stopHLSStreaming`) | HLS beam keeps running ~30-60s on 100ms servers. Students continue seeing last frame or "reconnecting". **CRITICAL**: If HLS beam times out before new device joins, students see ended overlay. | `[Studio] leave on device switch:` |
| 1.8.4 | Studio modal removed | Lines ~3836-3838 | Modal removed from DOM. Return to admin panel with "Retomar EN VIVO" button. | Check studio modal gone |
| 1.8.5 | Stream stays "live" in Supabase | Lines ~3819-3821 | `_lsaIsLive = false` locally but DB stays "live". Students don't see interruption. | Check Supabase `live_streams.status = 'live'` |

### 1.9 "Finalizar" -- Ends Stream

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 1.9.1 | Confirm dialog appears | `lsaStopHmsStream()` line ~3854 | Standard `confirm()`. | See confirm |
| 1.9.2 | Recording stopped | Lines ~3858-3861 | Watchdog cleared, MediaRecorder stopped. On iOS, if MediaRecorder was never started (not supported), this is a no-op. | Recording badge disappears |
| 1.9.3 | 100ms HLS stopped + room left | Lines ~3880-3884 | `stopHLSStreaming()` then `leave()`. Order matters. | `[Studio] stopHLS error:` or `[Studio] leave error:` if issues |
| 1.9.4 | Local streams released | Lines ~3887-3889 | All tracks stopped. Camera light off. | Green dot gone |
| 1.9.5 | DB updated to "ended" | Line ~3895 | `live_streams.status = 'ended'`. Triggers student-side "stream ended" detection. | Check Supabase |
| 1.9.6 | Auto-sync 100ms recordings | `_lsaAutoSync100msRecordings()` line ~3904 | Polls 100ms API at 30s, 60s, 120s, 240s, 420s intervals. Toast shows progress. | `[Studio] 100ms sync error:` if fail |
| 1.9.7 | Studio modal cleaned up | `lsaCloseBrowserStream()` line ~3975 | Removes modal, clears all state, removes beforeunload handler. | Check DOM is clean |

---

## 2. STUDENT ON IPHONE (Viewer)

### 2.1 Enter Live Stream -- Video Plays

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 2.1.1 | Auto-enter when single live stream exists | Lines ~412-416 in `loadLiveStreams()` | If exactly 1 live stream with `playback_url`, auto-calls `watchStream()`. On iOS, the student may not see the stream list at all -- goes straight to video. | `[LiveStream]` logs |
| 2.1.2 | Video element uses native HLS (Safari) | `_lsWatchStreamDirect()` lines ~721-770 | iOS Safari has native HLS support (`canPlayType('application/vnd.apple.mpegurl')`). Code correctly detects this (line ~743) and uses native `<video>` instead of hls.js. `Hls.isSupported()` returns `false` on iOS Safari, so the else branch runs. | `[LiveStream] Native HLS autoplay blocked:` if autoplay fails |
| 2.1.3 | Video starts muted (autoplay policy) | Line ~716: `videoEl.muted = true` | **REQUIRED** for iOS autoplay. Without `muted`, `play()` promise rejects and video never starts. Already handled correctly. | No error = working |
| 2.1.4 | Native HLS retry logic on error | Lines ~746-764 | 10 retries with exponential backoff (`2000 * retryCount` ms). Covers ~95s window for device-switch gap. Strategy: clear `src`, wait 500ms, re-set `src`, call `play()`. | `[LiveStream] Native HLS error, retry X/10` |
| 2.1.5 | Video plays inline (not fullscreen) | `<video id="lsPlayerVideo" autoplay playsinline muted>` line ~86 | `playsinline` attribute present. CRITICAL for iOS. Without it, Safari opens native fullscreen player which breaks the chat layout. | Video should play in the 16:9 container, not fullscreen |
| 2.1.6 | 16:9 aspect ratio container | `padding-bottom:56.25%` on `#lsPlayerContainer` line ~85 | Standard responsive video technique. Works on all screen sizes. | Check video isn't stretched or cropped |

### 2.2 Unmute Overlay

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 2.2.1 | Unmute overlay appears ~2s after video starts | `_lsShowUnmuteOverlay()` called via `setTimeout(2000)` at line ~772 | Overlay positioned at `bottom:16px;left:50%;transform:translateX(-50%)` with `z-index:50`. Should appear centered at bottom of video container. | See red "TOCA PARA ACTIVAR AUDIO" button |
| 2.2.2 | Tap unmute -- audio plays | Lines ~607-614 | Sets `videoEl.muted = false` then `videoEl.play()`. On iOS, this REQUIRES a user gesture (tap). The overlay click handler IS a user gesture, so it should work. | Audio should start playing |
| 2.2.3 | Overlay removed after tap | Line ~614: `overlay.remove()` | Single-use overlay. After tap, it's gone. | Overlay disappears |
| 2.2.4 | Pulse animation works | `@keyframes lsUnmutePulse` defined at line ~621 | CSS animation with `translateX(-50%) scale(1.05)`. Should create a gentle pulsing effect. | Visual check |
| 2.2.5 | `-webkit-tap-highlight-color:transparent` applied | Line ~605 | Prevents iOS blue/gray tap highlight on the overlay button. Good UX. | No flash on tap |

### 2.3 Chat Visible and Functional

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 2.3.1 | Chat section displays below video | `#lsChatSection` shown via `display:flex` at line ~775 | Chat is a flex column with fixed 220px height for messages. On small iPhones, this plus the video might require scrolling. | Check chat is visible without excessive scrolling |
| 2.3.2 | Chat messages load from history | `loadStreamChatHistory()` line ~989 | Loads last 100 messages, caps at 50. On slow networks, may take a moment. | `[LiveStreaming] Chat history error:` if fail |
| 2.3.3 | Realtime messages appear | `subscribeToStreamChat()` line ~1013 | Supabase realtime via `postgres_changes` on `stream_chat_messages`. New messages push to array and auto-scroll if near bottom. | Messages appear in real-time without refresh |
| 2.3.4 | Chat input -- keyboard doesn't obscure send button | Input uses `font-size:16px` (line ~138) | **IMPORTANT**: iOS Safari auto-zooms on inputs with `font-size < 16px`. This input is exactly 16px -- good. Keyboard should push the viewport up. | Type a message, verify send button is accessible |
| 2.3.5 | Send button works | `sendStreamChatMessage()` line ~1130 | Inserts to `stream_chat_messages` via Supabase. Enter key also sends (line ~1168). `enterkeyhint="send"` on input makes iOS keyboard show "Send" button. | Message appears in chat |
| 2.3.6 | Media file upload (image/video) | `lsChatFileSelected()` line ~1179 | `<input type="file" accept="image/*,video/*">` on iOS opens camera roll or camera. Max 5MB images, 20MB videos. Upload to Supabase Storage. | `[LiveStreaming] Media send error:` if fail |
| 2.3.7 | Chat toggle (hide/show) | `lsToggleChat()` line ~263 | When hidden: chat disappears, floating chat button appears (`#lsChatToggleBtn`), video expands to `100vh`/`100dvh`. When shown: restores 16:9 + chat. | Toggle and check both states |
| 2.3.8 | Expanded video uses `100dvh` | Lines ~274-275 | Uses `100dvh` (dynamic viewport height) which accounts for Safari's address bar. Falls back to `100vh` first. | Video should fill screen in hidden-chat mode |

### 2.4 Raise Hand

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 2.4.1 | Raise hand button visible during live stream | `#lsRaiseHandBtn` shown at line ~1498 | Button appears below video in the controls row. `display:none` initially, set to `display:''` when participation inits. | Check button is there |
| 2.4.2 | Tap raises hand -- sends broadcast signal | `lsToggleRaiseHand()` line ~1508 | Sends `{type:'raise_hand'}` via Supabase broadcast channel. Button changes to "Bajar la mano" (orange). Status shows "Esperando aprobacion...". | See button text change |
| 2.4.3 | Admin approves -- WebRTC starts | `lsStartParticipating()` line ~1543 | Requests `getUserMedia({video:true, audio:true})`. Creates `RTCPeerConnection` with STUN server. Sends SDP offer via broadcast. | `[LiveStreaming] Participation error:` if camera permission denied |
| 2.4.4 | Student sees self-preview | `#lsSelfVideo` shown in `#lsSelfPreview` | 120x90px preview with blue border. `autoplay muted playsinline` -- should work on iOS. | Small camera preview appears |

### 2.5 Stream Ended Overlay

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 2.5.1 | Stream ended overlay appears AFTER 90s grace period | `subscribeToLiveStreamStatus()` line ~2095 | On `UPDATE` to `live_streams` where `status = 'ended'`: starts 90s grace timer. Shows "Reconectando..." overlay during grace. After 90s, calls `_lsShowStreamEndedOverlay()`. | `[LiveStream] Stream status -> ended/offline -- starting 90s grace period` then `[LiveStream] Grace period expired -- showing stream ended` |
| 2.5.2 | "Volver" button returns to stream list | `_lsShowStreamEndedOverlay()` line ~816 | Overlay with "La transmision ha terminado" message + "Volver" button that calls `lsClosePlayer()`. | Tap "Volver", check return to list |
| 2.5.3 | HLS player destroyed on end | Lines ~817-823 | `_lsHlsPlayer.destroy()`, video paused, src cleared. On native HLS (iOS), error handler removed first (`videoEl._lsErrorHandler`). | No zombie playback |

### 2.6 Reconnecting Overlay During Device Switch

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 2.6.1 | Reconnecting overlay appears immediately | `_lsShowReconnectingOverlay()` line ~628 | Semi-transparent overlay with spinner: "Reconectando... El instructor esta cambiando de dispositivo". `z-index:55`, positioned over video. | See spinner overlay on video |
| 2.6.2 | Overlay does NOT destroy player | Comment at line ~627: "does NOT destroy player" | Player keeps buffering/retrying underneath. Native HLS retry logic (10 retries, ~95s) runs concurrently. | Video resumes when instructor reconnects |
| 2.6.3 | Grace timer cancelled if stream comes back to "live" | Lines ~2112-2121 | `subscribeToLiveStreamStatus` detects `status='live'`: clears grace timer, removes reconnecting overlay. If `playback_url` changed (new HLS beam), calls `_lsReloadWithNewUrl()`. | `[LiveStream] Stream back to live -- device switch successful` |
| 2.6.4 | Player reloads with new HLS URL if changed | `_lsReloadWithNewUrl()` line ~652 | Destroys old hls.js/native player, creates new one with updated URL. For native HLS (iOS): directly sets `videoEl.src = newUrl`. | `[LiveStream] Reloaded player with new URL:` |

### 2.7 VOD Playback

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 2.7.1 | "Grabaciones" tab shows VOD list | `lsSwitchTab('vod')` line ~289 | Loads from `stream_recordings` table. Filtered by student's groups. | VOD cards appear |
| 2.7.2 | Tap recording -- plays in video element | `watchRecording()` line ~838 | For `.m3u8` files: uses native HLS on iOS Safari (`canPlayType` check at line ~878). For other formats: direct `<video>` playback. VOD is NOT muted (`videoEl.muted = false` at line ~860). | Video plays with audio immediately (user initiated tap = gesture) |
| 2.7.3 | Chat hidden during VOD | Line ~895 | `chatSection.style.setProperty('display', 'none', 'important')` -- no live chat during VOD playback. | Chat section hidden |
| 2.7.4 | VOD attendance logged | Lines ~902-916 | Inserts to `stream_attendance` with `source: 'vod'`. | Check Supabase `stream_attendance` table |

---

## 3. CROSS-DEVICE FLOW

### 3.1 Desktop to iPhone Handoff

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 3.1.1 | Admin clicks "Cambiar Dispositivo" on desktop | `lsaReleaseForDeviceSwitch()` | Desktop leaves 100ms room, stream stays "live" in DB. | Desktop: studio closes, toast shows |
| 3.1.2 | Students see "Reconectando..." overlay | `_lsShowReconnectingOverlay()` triggered by status subscription | During the gap (admin left, hasn't rejoined), HLS beam may still serve cached segments for 30-60s. After that, native HLS errors trigger retry logic. | Students: spinner overlay appears |
| 3.1.3 | Admin opens app on iPhone, sees "Retomar EN VIVO" | `_lsaCheckReturnToLive()` line ~287 | Checks `sessionStorage.lsa_active_stream`. **PROBLEM**: sessionStorage is per-tab/per-browser -- it won't be set on iPhone Safari if admin was streaming on desktop. Instead, the admin panel renders the stream card with "Retomar EN VIVO" button (line ~232). | Admin: green pulsing button on stream card |
| 3.1.4 | Admin taps "Retomar EN VIVO" on iPhone | `adminGoLiveBrowser(streamId)` | Opens studio modal, admin selects camera source, taps "Iniciar Transmision". 100ms detects existing HLS beam and reuses it (lines ~3530-3538: `_hlsAlreadyRunning` check). | `[Studio] HLS already running (device switch takeover)` |
| 3.1.5 | Students see video resume | Status update: `live` with possibly new `playback_url` | If HLS URL changed, student player reloads (line ~2118-2121). Grace timer cancelled, reconnecting overlay removed. | `[LiveStream] Stream back to live` |
| 3.1.6 | **Time window**: Max gap before students see "ended" | Grace period: 90 seconds (line ~2136). Native HLS retry: 10 retries over ~95s. | Admin must rejoin within ~90s or students see "stream ended" overlay. If admin takes longer, students need to manually re-enter. | Count seconds from release to rejoin |

### 3.2 iPhone to Desktop Handoff

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 3.2.1 | Admin clicks "Cambiar Dispositivo" on iPhone | Same as 3.1.1 | All local streams stopped, camera light off. | Camera indicator turns off |
| 3.2.2 | Admin opens app on desktop, retakes stream | Same as 3.1.3-3.1.4 | Desktop has full studio experience (bigger controls, no mobile constraints). | Same logs as 3.1.4 |

### 3.3 Grace Period for Students During Switch

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 3.3.1 | Grace period is 90 seconds | `setTimeout(90000)` at line ~2131 | Starts when `live_streams.status` changes to `ended` or `offline`. During device switch, admin does NOT set status to ended (line ~3819), so this should NOT trigger. **BUT**: if HLS beam stops (100ms auto-stops after ~60s with no broadcaster), the HLS URL becomes stale. The native HLS error handler retries 10 times but the grace period timer may not start because status in DB stays "live". | Verify: does status change to ended during device switch? It should NOT. |
| 3.3.2 | **SUBTLE BUG RISK**: HLS beam stops but DB stays "live" | Device switch does NOT change DB status. But 100ms HLS beam stops ~60s after broadcaster leaves. Students get HLS errors but grace timer won't start (status is still "live"). | Students will see native HLS retry errors and eventually toast "Error de video. Toca Recargar para reintentar." after 10 retries (~95s). They won't see the friendly "Reconectando..." overlay because that only triggers on DB status change. | **This is a potential UX gap.** Test this specific scenario. |

---

## 4. EDGE CASES

### 4.1 Network Drop on iPhone

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 4.1.1 | **Broadcaster**: Network drop during stream | 100ms connection monitor (lines ~3496-3526) | Detects disconnect via `_lsaHmsStore.subscribe` on `room.isConnected`. After 3s delay, attempts reconnect: leave() -> fresh token -> join() -> startHLSStreaming(). | `[Studio] 100ms disconnected unexpectedly` then `[Studio] 100ms reconnected + HLS restarted` or `[Studio] Reconnect failed:` |
| 4.1.2 | **Broadcaster**: Recording during network drop | MediaRecorder watchdog (lines ~2808-2817) | Checks every 15s if no `ondataavailable` for >10s. Auto-restarts recorder. | `[Studio] Watchdog: no data for Xs -- restarting recorder` |
| 4.1.3 | **Student**: Network drop while watching | Native HLS retry logic (lines ~748-763) | 10 retries with exponential backoff. After max retries, shows toast "Error de video. Toca Recargar para reintentar." Manual `lsReloadPlayer()` button available. | `[LiveStream] Native HLS error, retry X/10` |
| 4.1.4 | **Student**: Supabase realtime reconnects | Supabase client handles reconnection internally | Chat channel error handler (line ~1052): logs warning "Chat channel error -- will retry". Status channel error (line ~2152): reconnects after 10s. | `[LS] Chat channel error` or `[LiveStream] Realtime status channel error` |

### 4.2 App Backgrounded Then Foregrounded

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 4.2.1 | **Broadcaster**: Visibility handler timer | Lines ~3683-3718 | On `visibilityState === 'hidden'`: starts 10-minute timer. On `visibilityState === 'visible'`: clears timer. If timer fires (10 min hidden), auto-ends stream via `fetch()` with `keepalive:true`. | `[Studio] Page hidden for 10 min -- ending stream` |
| 4.2.2 | **Broadcaster**: Brief background (< 10 min) | Same handler | Timer cleared on return to foreground. 100ms connection may need to reconnect (SDK handles this internally). **iOS Safari aggressively suspends JS in background tabs/apps**, so the 100ms WebSocket may disconnect. The connection monitor (4.1.1) should detect and reconnect. | Check if stream is still broadcasting after returning from background |
| 4.2.3 | **Broadcaster**: iOS kills background WebSocket | iOS Safari pauses WebSocket ~30s after backgrounding | 100ms SDK connection drops. On foregrounding, connection monitor triggers reconnect. **During this gap**, HLS beam may stop because broadcaster left the room. Students lose stream. | **HIGH RISK**: Test by backgrounding for 1-2 minutes, then returning. Does stream auto-resume? |
| 4.2.4 | **Student**: Background then foreground | Native HLS continues playing in background on iOS (audio continues). On return, video should resume. | If HLS session expired during background, native player shows error. Retry logic kicks in. | Check video resumes on foregrounding |
| 4.2.5 | **Student**: `AudioContext` suspension | Not explicitly handled in student viewer | iOS suspends `AudioContext` when backgrounded. On return, audio may be silent until user taps. The unmute overlay won't re-appear automatically. | Test: background during playback, return -- is audio still playing? |

### 4.3 Safari Tab Closed Without "Finalizar"

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 4.3.1 | `beforeunload` handler fires | Line ~3653: `window.addEventListener('beforeunload', ...)` | Shows browser confirmation dialog "Changes you made may not be saved". **However**, on iOS Safari, `beforeunload` is NOT reliably fired when closing tabs or swiping away apps. | Check if dialog appears |
| 4.3.2 | Stream stays "live" indefinitely (orphan stream) | `lsaCloseBrowserStream()` tries to set `status: 'ended'` (line ~3993) | If the tab is force-closed, this code never runs. Stream stays "live" in DB. Students see a dead stream with HLS errors. **MITIGATION NEEDED**: Server-side health check or TTL on live streams. | Check Supabase: is stream stuck on "live"? |
| 4.3.3 | 100ms room cleanup | 100ms SDK eventually times out disconnected peers (~2 min) | HLS beam stops automatically when all broadcasters leave. But DB status remains "live" until manually changed. | 100ms dashboard shows room empty |
| 4.3.4 | **Student tab closed**: Attendance not logged | `lsLeaveViewerPresence()` line ~1426 | Updates `left_at` in `stream_attendance`. On iOS Safari tab close, this fetch may not complete. `keepalive` not used. Supabase presence will auto-untrack after timeout. | `left_at` may be NULL in attendance |

### 4.4 Low Bandwidth Conditions

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 4.4.1 | **Broadcaster**: 100ms adaptive bitrate | Handled by 100ms SDK internally | 100ms adjusts quality based on bandwidth. Broadcaster may see degraded video quality. | 100ms SDK logs in console |
| 4.4.2 | **Student**: HLS adaptive bitrate | Handled by native iOS HLS player | Safari's native HLS player automatically selects lower quality variants. Student sees lower resolution but playback continues. | Safari developer tools: Network tab shows quality changes |
| 4.4.3 | **Student**: Chat messages delayed | Supabase realtime over WebSocket | Messages may arrive with delay. No local optimistic rendering (message only appears after server confirms via realtime). | Delayed message appearance |
| 4.4.4 | **Student**: Media upload slow/fails | `_lsSendMediaMessage()` line ~1228 | Upload to Supabase Storage. No progress indicator shown to user (just a toast "Subiendo archivo..."). On slow connection, user may tap send multiple times. Send button is disabled during upload (line ~1248). | `[LiveStreaming] Media send error:` |

### 4.5 iPhone Rotation (Portrait/Landscape)

| # | Test | Function/Code | What Could Go Wrong | Console to Watch |
|---|------|--------------|---------------------|-----------------|
| 4.5.1 | **Broadcaster studio**: Layout adapts to rotation | CSS uses `@media(max-width:900px)` for mobile | In landscape, iPhone width may exceed 900px on larger models (iPhone Pro Max landscape = ~932px). This would switch to desktop layout with sidebar inline instead of slide-up overlay. | Rotate to landscape: check if sidebar becomes inline or stays overlay |
| 4.5.2 | **Broadcaster**: Video preview fills space | `<video>` in flex container with `object-fit:contain` | In landscape, video gets more horizontal space. Should look good. | Visual check |
| 4.5.3 | **Student viewer**: Video expands nicely | `padding-bottom:56.25%` responsive container | In landscape, 16:9 video fills width naturally. When chat is hidden, uses `100dvh`. | Rotate to landscape: video should be bigger |
| 4.5.4 | **Student**: Chat toggle works in landscape | `lsToggleChat()` | In landscape with chat hidden, video fills `100dvh`. In landscape with chat shown, 16:9 video + chat scroll. | Toggle chat in both orientations |
| 4.5.5 | **Broadcaster**: Control bar wrapping in landscape | `flex-wrap:wrap` on control bar | Landscape = more width = less wrapping. Buttons should fit in fewer rows. | Check button layout in landscape |

---

## 5. CSP / SECURITY HEADER ISSUES

### 5.1 Content-Security-Policy Analysis

| Directive | Value | Impact on iPhone Streaming |
|-----------|-------|---------------------------|
| `connect-src` | Includes `https://*.100ms.live`, `wss://*.100ms.live`, `https://*.cloudflarestream.com`, `https://rtc.live.cloudflare.com` | **OK** -- 100ms SDK connections, Cloudflare Stream HLS, and WebRTC all whitelisted. |
| `media-src` | Includes `blob:`, `https://*.cloudflarestream.com`, `https://*.100ms.live` | **OK** -- HLS playback from Cloudflare Stream and 100ms both allowed. `blob:` needed for local recording. |
| `frame-src` | Includes `https://*.cloudflarestream.com`, `https://*.100ms.live` | **OK** -- Cloudflare Stream player iframe and 100ms embed allowed. |
| `worker-src` | `'self' blob:` | **OK** -- hls.js web worker (`enableWorker: true`) creates a blob worker. However, on iOS Safari, `Hls.isSupported()` returns `false` so hls.js is not used. |
| `script-src` | Includes `https://cdn.jsdelivr.net` | **OK** -- 100ms SDK loaded from CDN. |
| `img-src` | Includes `blob:`, `https://*.supabase.co` | **OK** -- Chat media images from Supabase Storage. |
| `Permissions-Policy` | `camera=(self), microphone=(self)` | **OK** -- Camera and microphone allowed for same-origin. If using iframes from different origins, they would be blocked. |

### 5.2 Potential CSP Issue

| # | Issue | Details |
|---|-------|---------|
| 5.2.1 | `style-src 'unsafe-inline'` | Used extensively (all styles are inline). Required but increases XSS surface. Not a Safari-specific issue. |
| 5.2.2 | No `*.100ms.live` in `img-src` | If 100ms SDK tries to load images (avatars, thumbnails), it would be blocked. Low risk for streaming. |
| 5.2.3 | STUN server `stun.l.google.com:19302` in WebRTC | Line ~1558 in student viewer. CSP `connect-src` does not list this explicitly, but STUN/TURN connections via WebRTC are NOT governed by CSP -- they use the ICE framework. **No issue.** |

---

## 6. KNOWN RISKS & RECOMMENDATIONS

### Critical Risks

1. **MediaRecorder not supported on iOS Safari** (broadcaster auto-record, line ~3670): Local recording backup will silently fail on iPhone. The 100ms server-side recording is the primary recording mechanism, so this is acceptable but should be logged.

2. **Camera flip may not propagate to 100ms HLS** (line ~2524 comment): The flip only updates the local preview video element. The 100ms SDK manages its own video track via WebRTC. If the SDK doesn't pick up the new camera stream from `getUserMedia`, students won't see the flip. **Must verify on a real device.**

3. **Orphan "live" stream on tab close** (4.3.2): iOS Safari does not reliably fire `beforeunload` or `pagehide`. Need server-side TTL or heartbeat to detect dead streams.

4. **Device switch HLS gap** (3.3.2): During device switch, DB stays "live" but HLS beam dies after ~60s. Students see HLS errors, not the friendly "Reconectando" overlay. The reconnecting overlay only triggers on DB status change.

5. **iOS background kills WebSocket** (4.2.3): When broadcaster backgrounds the app for >30s, iOS suspends the WebSocket. On return, 100ms connection is dead and must reconnect. During the gap, HLS beam may stop.

### Recommendations

1. Add a server-side cron job or Supabase function to check for "live" streams with no broadcaster heartbeat for >5 minutes and auto-set to "ended".

2. For camera flip during live broadcast, investigate calling `_lsaHmsActions.setLocalVideoEnabled(false)` then `setLocalVideoEnabled(true)` after flipping, or replacing the video track via the 100ms SDK API.

3. Add a periodic heartbeat from the broadcaster to Supabase (e.g., update `last_heartbeat` column every 30s). Students can use this to show "Reconectando..." even when DB status stays "live".

4. Consider adding `pagehide` event listener as backup for `beforeunload` on iOS Safari.

5. Test `showSaveFilePicker` (File System Access API) availability on iOS Safari -- it is NOT supported. The fallback to in-memory recording works, but MediaRecorder itself is not supported for video on iOS Safari.
