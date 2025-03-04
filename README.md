# ICC Wrapped Auth

The `icc-wrapped-auth` library provides a class, `ICCWrappedAuth`, that provides a set of utilities for managing ICC tokens and authentication for the icc wrapped application. It facilitates secure communication between the main ICC applications and the ICC Fan Passport application by handling user authentication tokens. It exposes methods to
encryption users access token, decrypt the access token, and revoke the users access token.

## Installation

To install the package, run the following command in your project directory:

```bash
npm i @insomnia-labs/icc-wrapped-auth
```

## Usage

### Initializing the Authentication Class

Import the `ICCWrappedAuth` class from the package and initialize it with the desired environment.

```javascript
import { ICCWrappedAuth } from "icc-wrapped-auth";

// Initialize with production environment
const auth = new ICCWrappedAuth("production");
```

### Encrypting a Token

Use the `encryptToken` method to encrypt a user's volt token. This token can then be included in URLs for redirecting users to the fan passport application.

```javascript
async function encryptUserToken() {
  const encryptedToken = await auth.encryptToken({
    token: "userVoltTokenHere",
    name: "Samuel Olamide",
    email: "samuel.olamide@domain.com",
  });

  console.log("Encrypted Token:", encryptedToken);
}
encryptUserToken();
```

### Validating an Encrypted Token

After encrypting a token, use `validateToken` to validate the encrypted token and optionally create a user instance on the application.

```javascript
async function validateUserToken(encryptedToken) {
  const accessToken = await auth.validateToken(encryptedToken);

  console.log("Access Token:", accessToken);
}
```

### Revoking an Access Token

To log a user out and invalidate their session, use the `revokeAccessToken` method.

```javascript
async function revokeUserAccessToken(token) {
  const response = await auth.revokeAccessToken(token);

  console.log("Revoke Response:", response); // { statusCode: 200, message: 'Logged out successfully.' }
}
```

## Support

For issues or feature requests, please reach out to the insomnia team.
