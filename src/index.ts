import { EncryptTokenArg, Environment } from "./types";
import {
  DEVELOPMENT,
  ICC_API_BASE_URL_DEV,
  ICC_API_BASE_URL_PROD,
  ICC_API_BASE_URL_STAGING,
  STAGING,
} from "./constants";

/**
 * This class provides methods to authenticate users with the ICC application.
 * It provides methods to encrypt the volt token, validate the encrypted token,
 * and revoke the access token.
 * The class is initialized with the environment (development, staging, or production).
 * The default environment is development.
 */
export class ICCWrappedAuth {
  private apiBaseURL: string;
  private environment: Environment;
  private defaultHeaders: {
    accept: string;
    "Content-Type": string;
  };

  constructor(environment: Environment = "development") {
    switch (environment) {
      case "production":
        this.apiBaseURL = ICC_API_BASE_URL_PROD;
        break;
      case "staging":
        this.apiBaseURL = ICC_API_BASE_URL_STAGING;
        break;
      case "development":
        this.apiBaseURL = ICC_API_BASE_URL_DEV;
        break;
      default:
        this.apiBaseURL = ICC_API_BASE_URL_STAGING;
    }

    this.environment = environment;
    this.defaultHeaders = {
      accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  /**
   * This function encrypts the volt token and returns it.
   * This encrypted token will  be included in a URL when redirecting users to the
   * fan passport application.
   *
   * @param param0.token - The volt token to encrypt.
   * @param param0.name - The name of the user (firstName lastName).
   * @param param0.email - The email of the user.
   *
   * @returns - The encrypted jwt token, set to expire in one hour OR null if there is an error.
   */
  async encryptToken({
    token,
    name,
    email,
  }: EncryptTokenArg): Promise<string | null> {
    try {
      const payload = {
        authToken: token,
        name,
        email,
      };

      const response = await fetch(`${this.apiBaseURL}/auth/encode`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          ...this.defaultHeaders,
        },
      });

      const responseJson = await response.json();
      const encodedToken = responseJson.data.token;

      return encodedToken;
    } catch (error) {
      if ([DEVELOPMENT, STAGING].includes(this.environment)) {
        console.log("Error encrypting token: ", error);
      }
      return null;
    }
  }

  /**
   * This function validates the encrypted token,
   * and creates a user instance on the fan passport application if necessary.
   *
   * @param token - The encrypted token to validate.
   * @returns - The access token for the user OR null if anything failed.
   */
  async validateToken(token: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiBaseURL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
          ...this.defaultHeaders,
        },
      });

      const responseJson = await response.json();
      const accessToken = responseJson.data.accessToken;

      return accessToken;
    } catch (error) {
      if ([DEVELOPMENT, STAGING].includes(this.environment)) {
        console.log("Error encrypting token: ", error);
      }
      return null;
    }
  }

  /**
   * This function revokes the access token.
   * It should be called when the user logs out of the ICC application.
   * @param token - The ICC access token of the user.
   * @returns
   */
  async revokeAccessToken(token: string) {
    const response = await fetch(`${this.apiBaseURL}/auth/logout`, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  }
}
