import API from "../api";

describe("API instance", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should use correct default baseURL", () => {
    expect(API.defaults.baseURL).toBe(
      process.env.REACT_APP_API_URL || "http://localhost:8080/api"
    );
  });

  test("should attach Authorization header when token exists", async () => {
    localStorage.setItem("token", "fake-token-123");

    const interceptor = API.interceptors.request.handlers[0].fulfilled;

    const config = await interceptor({ headers: {} });

    expect(config.headers.Authorization).toBe("Bearer fake-token-123");
  });

  test("should not attach Authorization header when token does not exist", async () => {
    const interceptor = API.interceptors.request.handlers[0].fulfilled;

    const config = await interceptor({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });
});
``