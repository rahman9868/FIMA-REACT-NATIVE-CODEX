# FIMA - React Native (Codex)

Mobile attendance app starter using **Clean Architecture** with login + ACL sync flow.

## Implemented feature
- Login screen with username and password.
- Calls API `POST oauth/token` with:
  - Header `Authorization: Basic ZmlyYS1hcGktY2xpZW50OnBsZWFzZS1jaGFuZ2UtdGhpcw`
  - Body `username`, `password`, `grant_type=password`
- Maps API response:
  - `access_token`
  - `refresh_token`
- After login success, calls `GET att/employee/acl` using:
  - Header `Authorization: Bearer <access_token>`
- Saves token and employee ACL into local storage (`AsyncStorage`).
- Non-login API calls are set up to include Bearer token through `HttpClient` request options.

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
