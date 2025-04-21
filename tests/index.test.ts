const axios = require("axios");

const BACKEND_URL = "localhost:3000";

describe("Authentication", () => {
  test("User can only sign in only once", async () => {
    const username = "user" + Math.random();
    const password = "12345678899";
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(response.statusCode).toBe(200);
    expect(response.data.userId).toBeDefined;

    const updatedResponse = await axios.post(
      `${BACKEND_URL}/api/v1/user/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );
    expect(updatedResponse.statusCode).toBe(400);
  });

  test("signup request failed if the username is empty", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      password: "1212121212",
      type: "admin",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Sign in succeeds is the username and password is correct", async () => {
    const username = "user" + Math.random();
    const password = "12345678899";

    await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      username,
      password,
      type: "admin",
    });

    const signinResponse = await axios.post(
      `${BACKEND_URL}/api/v1/user/signin`,
      {
        username,
        password,
      }
    );

    expect(signinResponse.statusCode).toBe(200);
    expect(signinResponse.body.token).toBeDefined();
  });

  test("Sign in failed if the password is incorrect", async () => {
    const username = "user" + Math.random();
    const password = "12345678899";

    await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      username,
      password,
      type: "admin",
    });

    const signinResponse = await axios.post(
      `${BACKEND_URL}/api/v1/user/signin`,
      {
        username,
        password: "wrong password",
      }
    );

    expect(signinResponse.statusCode).toBe(200);
  });
});

describe("User metadata endpoints", () => {
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const username = "user" + Math.random();
    const password = "12345678899";

    await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      username,
      password,
      type: "admin",
    });

    const signinResponse = await axios.post(
      `${BACKEND_URL}/api/v1/user/signin`,
      {
        username,
        password,
      }
    );

    token = signinResponse.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    avatarId = avatarResponse.data.avatarId;
  });

  test("User can't update their metadata with wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "121213245",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User can update their metadata using avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(200);
  });

  test("User is not able to update their meta data if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.statusCode).toBe(403);
  });
});

// describe()
