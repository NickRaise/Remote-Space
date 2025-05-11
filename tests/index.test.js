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

// describe("User metadata endpoints", () => {
//   let token = "";
//   let avatarId = "";

//   beforeAll(async () => {
//     const username = "user" + Math.random();
//     const password = "12345678899";

//     await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
//       username,
//       password,
//       type: "admin",
//     });

//     const signinResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/user/signin`,
//       {
//         username,
//         password,
//       }
//     );

//     token = signinResponse.data.token;

//     const avatarResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Timmy",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     avatarId = avatarResponse.data.avatarId;
//   });

//   test("User can't update their metadata with wrong avatar id", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/user/metadata`,
//       {
//         avatarId: "121213245",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     expect(response.status).toBe(400);
//   });

//   test("User can update their metadata using avatar id", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/user/metadata`,
//       {
//         avatarId,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     expect(response.status).toBe(200);
//   });

//   test("User is not able to update their meta data if the auth header is not present", async () => {
//     const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
//       avatarId,
//     });
//     expect(response.status).toBe(403);
//   });
// });

// describe()
