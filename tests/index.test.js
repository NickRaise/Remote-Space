const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000";

const axios = {
  post: async (...args) => {
    try {
      const res = await axios2.post(...args);
      return res;
    } catch (err) {
      return err.response;
    }
  },
  get: async (...args) => {
    try {
      const res = await axios2.get(...args);
      return res;
    } catch (err) {
      return err.response;
    }
  },
  put: async (...args) => {
    try {
      const res = await axios2.put(...args);
      return res;
    } catch (err) {
      return err.response;
    }
  },
  delete: async (...args) => {
    try {
      const res = await axios2.delete(...args);
      return res;
    } catch (err) {
      return err.response;
    }
  },
};

describe("Authentication", () => {
  test("User can only signup only once", async () => {
    const username = "user" + Math.random();
    const password = "12345678899";
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(response.status).toBe(200);
    expect(response.data.userId).toBeDefined();

    const updatedResponse = await axios.post(
      `${BACKEND_URL}/api/v1/auth/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );
    expect(updatedResponse.status).toBe(400);
  });

  test("signup request failed if the username is empty", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
      password: "1212121212",
      type: "admin",
    });
    expect(response.status).toBe(400);
  });

  test("Sign in succeeds is the username and password is correct", async () => {
    const username = "user" + Math.random();
    const password = "12345678899";

    await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
      username,
      password,
      type: "admin",
    });

    const signinResponse = await axios.post(
      `${BACKEND_URL}/api/v1/auth/signin`,
      {
        username,
        password,
      }
    );

    expect(signinResponse.status).toBe(200);
    expect(signinResponse.data.token).toBeDefined();
  });

  test("Sign in failed if the password is incorrect", async () => {
    const username = "user" + Math.random();
    const password = "12345678899";

    await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
      username,
      password,
      type: "admin",
    });

    const signinResponse = await axios.post(
      `${BACKEND_URL}/api/v1/auth/signin`,
      {
        username,
        password: "wrong password",
      }
    );

    expect(signinResponse.status).toBe(403);
  });
});

describe("User metadata endpoints", () => {
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const username = "user" + Math.random();
    const password = "12345678899";

    await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
      username,
      password,
      type: "admin",
    });

    const signinResponse = await axios.post(
      `${BACKEND_URL}/api/v1/auth/signin`,
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
    expect(response.status).toBe(400);
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
    expect(response.status).toBe(200);
  });

  test("User is not able to update their meta data if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.status).toBe(401);
  });
});

describe("User avatar information", () => {
  let token = "";
  let avatarId = "";
  let userId = "";

  beforeAll(async () => {
    const username = "user" + Math.random();
    const password = "12345678899";

    const signupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/auth/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );

    userId = signupResponse.data.userId;

    const signinResponse = await axios.post(
      `${BACKEND_URL}/api/v1/auth/signin`,
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

  test("Get back other users avatar information", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
    );

    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("Get all available information for a user", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);

    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

describe("Space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminId;
  let adminToken;
  let userId;
  let userToken;

  beforeAll(async () => {
    const username = "user" + Math.random();
    const username2 = "user" + Math.random();
    const password = "12345678899";

    const signupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/auth/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );

    adminId = signupResponse.data.userId;

    const signinResponse = await axios.post(
      `${BACKEND_URL}/api/v1/auth/signin`,
      {
        username,
        password,
      }
    );

    adminToken = signinResponse.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/auth/signup`,
      {
        username: username2,
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/auth/signin`,
      {
        username: username2,
        password,
      }
    );

    userToken = userSigninResponse.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1Id = element1.data.id;
    element2Id = element2.data.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    mapId = map.data.id;
  });

  test("User is able to create a space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.data.spaceId).toBeDefined();
  });

  test("User is able to create a space without mapId", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.data.spaceId).toBeDefined();
  });

  test("User is not able to create a space without mapId and dimensions", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.status).toBe(400);
  });

  test("User is not able to delete a space that doesn't exists", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomId`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.status).toBe(400);
  });

  test("User is able to delete a space that does exists", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.data.spaceId).toBeDefined();

    const spaceId = response.data.spaceId;

    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(deleteResponse.status).toBe(200);
  });

  test("User should not able to delete the space created by another user", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.data.spaceId).toBeDefined();

    const spaceId = response.data.spaceId;

    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(deleteResponse.status).toBe(403);
  });

  test("Get all admin spaces - Admin has no spaces initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.data.spaces.length).toBe(0);
  });

  test("Get all admin spaces - after creating a space", async () => {
    const createSpaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const getSpacesResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/all`,
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const filteredSpace = getSpacesResponse.data.spaces.find(
      (x) => x.id === createSpaceResponse.data.spaceId
    );

    expect(getSpacesResponse.data.spaces.length).toBe(1);
    expect(filteredSpace).toBeDefined();
  });
});
