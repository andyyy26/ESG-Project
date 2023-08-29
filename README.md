# ESG-Project
### Installing & config

1. Clone repo and run `npm i` to install all packages

### Running the project

1. Add a `.env` flie to the root directory when first cloning this project for storing environment variables

2. Add a `JWT_SECRET` to the `.env` file

3. Start the server with nodemon: `npm run start`. Currently the default port for the server is `3000` and this can be set in the `.env`. This is to prevent clashes when running the server and clients in dev locally.

4. Restart running server by typing: `rs`

## Available Scripts

- `start` - starts the server
- `reset` - deletes the node_modules
- `reinstall` - deletes and then reinstalls the node_modules

## Current Routes

### Auth Routes

#### `/api/v1/auth/sign_up`

```javascript
  POST:
  {
    "first_name": "",
    "last_name": "",
    "email": "",
    "password": "" (at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.)
  }
```

#### `/api/v1/auth/sign_in`

```javascript
  POST:
  {
    "email": "",
    "password": "" (at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.)
    "remember": ""
  }
```

#### `/api/v1/auth/password-reset/get-code`

Allows a user to get a password reset code emailed to them.

```javascript
  POST:
  {
    "email": "",
    "password": "",
    "code": "" (this will have been emailed to the user)
  }
```

#### `/api/v1/auth/password-reset/verify-code

Allows a user to get a password reset code emailed to them.

```javascript
  POST:
  {
    "email": ""
  }
```
