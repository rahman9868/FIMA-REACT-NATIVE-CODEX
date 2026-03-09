# FIMA - React Native (Codex)

Mobile attendance app starter using **Clean Architecture** with a login flow.

## Implemented feature
- Login screen with username and password.
- Calls API `POST oauth/token` with:
  - Header `Authorization: Basic ZmlyYS1hcGktY2xpZW50OnBsZWFzZS1jaGFuZ2UtdGhpcw`
  - Body `username`, `password`, `grant_type=password`
- Maps API response:
  - `access_token`
  - `refresh_token`
- Saves token payload into local storage (`AsyncStorage`).

## Structure

```text
src/
  core/config
  domain/
    entities
    repositories
    usecases
  data/repositories
  infra/
    network
    storage
  presentation/
    screens
    viewmodels
```

## Run

```bash
npm install
npm run start
npm run android   # or npm run ios
```
