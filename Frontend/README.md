# Digiwallet Frontend (React Native - Expo)

This is a minimal Expo-based React Native scaffold that connects to the existing Digiwallet backend.

Quick start

1. Install Expo CLI (if you don't have it):

```bash
npm install -g expo-cli
```

2. From `Frontend` install dependencies:

```bash
cd Frontend
npm install
```

3. Start the app:

```bash
npm run start
# then press a to run on Android emulator, i for iOS simulator, or scan QR with Expo Go
```

Backend notes

- By default `App.js` uses `http://10.0.2.2:3000` which works for Android emulator to reach a backend running on your host PC. If you use iOS simulator, `localhost` works. For a physical device, replace with your PC LAN IP (e.g., `http://192.168.1.12:3000`).
- Update endpoints in `App.js` to match your backend routes (e.g., `/api/auth`).

Files added

- `package.json` - minimal Expo deps and scripts
- `App.js` - example UI + `axios` ping to backend
- `README.md` - run instructions

If you want, I can run `npx create-expo-app Frontend` to generate a full Expo project now (will download packages). Say "please run" to proceed.
