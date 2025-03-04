import { ICC_API_BASE_URL_STAGING } from "./constants";
import { ICCPassportAuth } from "./index";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("ICCPassportAuth", () => {
  const mockToken = "mockToken";
  const userInfo = {
    token: mockToken,
    name: "John Doe",
    email: "john@example.com",
  };

  describe("encryptToken", () => {
    it("should call the correct URL and return token", async () => {
      const api = new ICCPassportAuth("staging");
      const expectedToken = `encrypted-${mockToken}`;

      fetchMock.mockResponseOnce(JSON.stringify({ token: expectedToken }));

      const result = await api.encryptToken(userInfo);

      expect(fetch).toHaveBeenCalledWith(
        `${ICC_API_BASE_URL_STAGING}/auth/encode`,
        {
          method: "POST",
          body: JSON.stringify({
            authToken: mockToken,
            name: "John Doe",
            email: "john@example.com",
            username: "tenant123",
          }),
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      expect(result).toBe(expectedToken);
    });
  });

  describe("validateToken", () => {
    it("should validate token and return access token", async () => {
      const api = new ICCPassportAuth("staging");
      const accessToken = "access-token-123";

      fetchMock.mockResponseOnce(JSON.stringify({ accessToken }));

      const result = await api.validateToken(mockToken);

      expect(fetch).toHaveBeenCalledWith(
        `${ICC_API_BASE_URL_STAGING}/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({ token: mockToken }),
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log(result, accessToken);
      expect(result).toBe(accessToken);
    });
  });

  describe("revokeAccessToken", () => {
    it("should revoke the access token", async () => {
      const api = new ICCPassportAuth("staging");

      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

      const result = await api.revokeAccessToken(mockToken);

      expect(fetch).toHaveBeenCalledWith(
        `${ICC_API_BASE_URL_STAGING}/auth/logout`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual({ success: true });
    });
  });
});
