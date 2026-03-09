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
- Loads `assignment/by-schedule`, stores all assignments, resolves today assignment, then calls:
  - `att/schedule/employee` for `Schedule`
  - `att/schedule-flexible/employee` for `Flexi`
  - `att/schedule-flexible-temp/employee` for `FlexiTemp`
- Saves assignment list, today's assignment, and today's schedule detail to local storage.
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
