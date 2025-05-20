const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "http://localhost:3001";

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

// describe("Authentication", () => {
//   test("User can only signup only once", async () => {
//     const username = "user" + Math.random();
//     const password = "12345678899";
//     const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
//       username,
//       password,
//       type: "admin",
//     });
//     expect(response.status).toBe(200);
//     expect(response.data.userId).toBeDefined();

//     const updatedResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signup`,
//       {
//         username,
//         password,
//         type: "admin",
//       }
//     );
//     expect(updatedResponse.status).toBe(400);
//   });

//   test("signup request failed if the username is empty", async () => {
//     const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
//       password: "1212121212",
//       type: "admin",
//     });
//     expect(response.status).toBe(400);
//   });

//   test("Sign in succeeds is the username and password is correct", async () => {
//     const username = "user" + Math.random();
//     const password = "12345678899";

//     await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
//       username,
//       password,
//       type: "admin",
//     });

//     const signinResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signin`,
//       {
//         username,
//         password,
//       }
//     );

//     expect(signinResponse.status).toBe(200);
//     expect(signinResponse.data.token).toBeDefined();
//   });

//   test("Sign in failed if the password is incorrect", async () => {
//     const username = "user" + Math.random();
//     const password = "12345678899";

//     await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
//       username,
//       password,
//       type: "admin",
//     });

//     const signinResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signin`,
//       {
//         username,
//         password: "wrong password",
//       }
//     );

//     expect(signinResponse.status).toBe(403);
//   });
// });

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
//       `${BACKEND_URL}/api/v1/auth/signin`,
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
//     expect(response.status).toBe(401);
//   });
// });

// describe("User avatar information", () => {
//   let token = "";
//   let avatarId = "";
//   let userId = "";

//   beforeAll(async () => {
//     const username = "user" + Math.random();
//     const password = "12345678899";

//     const signupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signup`,
//       {
//         username,
//         password,
//         type: "admin",
//       }
//     );

//     userId = signupResponse.data.userId;

//     const signinResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signin`,
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

//   test("Get back other users avatar information", async () => {
//     const response = await axios.get(
//       `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
//     );

//     expect(response.data.avatars.length).toBe(1);
//     expect(response.data.avatars[0].userId).toBe(userId);
//   });

//   test("Get all available information for a user", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);

//     expect(response.data.avatars.length).not.toBe(0);
//     const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
//     expect(currentAvatar).toBeDefined();
//   });
// });

// describe("Space information", () => {
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let adminId;
//   let adminToken;
//   let userId;
//   let userToken;

//   beforeAll(async () => {
//     const username = "user" + Math.random();
//     const username2 = "user" + Math.random();
//     const password = "12345678899";

//     const signupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signup`,
//       {
//         username,
//         password,
//         type: "admin",
//       }
//     );

//     adminId = signupResponse.data.userId;

//     const signinResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signin`,
//       {
//         username,
//         password,
//       }
//     );

//     adminToken = signinResponse.data.token;

//     const userSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signup`,
//       {
//         username: username2,
//         password,
//         type: "user",
//       }
//     );

//     userId = userSignupResponse.data.userId;

//     const userSigninResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signin`,
//       {
//         username: username2,
//         password,
//       }
//     );

//     userToken = userSigninResponse.data.token;

//     const element1 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const element2 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     element1Id = element1.data.id;
//     element2Id = element2.data.id;

//     const map = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "100 person interview room",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: element1Id,
//             x: 18,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 19,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 19,
//             y: 20,
//           },
//         ],
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     mapId = map.data.id;
//   });

//   test("User is able to create a space", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//         mapId: mapId,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(response.data.spaceId).toBeDefined();
//   });

//   test("User is able to create a space without mapId", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(response.data.spaceId).toBeDefined();
//   });

//   test("User is not able to create a space without mapId and dimensions", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(response.status).toBe(400);
//   });

//   test("User is not able to delete a space that doesn't exists", async () => {
//     const response = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/randomId`,
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(response.status).toBe(400);
//   });

//   test("User is able to delete a space that does exists", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(response.data.spaceId).toBeDefined();

//     const spaceId = response.data.spaceId;

//     const deleteResponse = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/${spaceId}`,
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(deleteResponse.status).toBe(200);
//   });

//   test("User should not able to delete the space created by another user", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(response.data.spaceId).toBeDefined();

//     const spaceId = response.data.spaceId;

//     const deleteResponse = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/${spaceId}`,
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     expect(deleteResponse.status).toBe(403);
//   });

//   test("Get all admin spaces - Admin has no spaces initially", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
//       headers: {
//         authorization: `Bearer ${adminToken}`,
//       },
//     });

//     expect(response.data.spaces.length).toBe(0);
//   });

//   test("Get all admin spaces - after creating a space", async () => {
//     const createSpaceResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const getSpacesResponse = await axios.get(
//       `${BACKEND_URL}/api/v1/space/all`,
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const filteredSpace = getSpacesResponse.data.spaces.find(
//       (x) => x.id === createSpaceResponse.data.spaceId
//     );

//     expect(getSpacesResponse.data.spaces.length).toBe(1);
//     expect(filteredSpace).toBeDefined();
//   });
// });

// describe("Arena endpoints", () => {
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let adminId;
//   let adminToken;
//   let userId;
//   let userToken;
//   let spaceId;

//   beforeAll(async () => {
//     const username = "user" + Math.random();
//     const username2 = "user" + Math.random();
//     const password = "12345678899";

//     const signupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signup`,
//       {
//         username,
//         password,
//         type: "admin",
//       }
//     );

//     adminId = signupResponse.data.userId;

//     const signinResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signin`,
//       {
//         username,
//         password,
//       }
//     );

//     adminToken = signinResponse.data.token;

//     const userSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signup`,
//       {
//         username: username2,
//         password,
//         type: "user",
//       }
//     );

//     userId = userSignupResponse.data.userId;

//     const userSigninResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signin`,
//       {
//         username: username2,
//         password,
//       }
//     );

//     userToken = userSigninResponse.data.token;

//     const element1 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const element2 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     element1Id = element1.data.id;
//     element2Id = element2.data.id;

//     const map = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "100 person interview room",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: element1Id,
//             x: 18,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 19,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 19,
//             y: 20,
//           },
//         ],
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     mapId = map.data.id;

//     const space = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//         mapId,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     spaceId = space.data.spaceId;
//   });

//   test("Incorrect space id while fetching a space returns 400 status code", async () => {
//     const response = await axios.get(
//       `${BACKEND_URL}/api/v1/space/randomSpaceId`,
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(response.status).toBe(400);
//   });

//   test("Correct space id return the all the elements data along with space information", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
//       headers: {
//         authorization: `Bearer ${userToken}`,
//       },
//     });

//     expect(response.status).toBe(200);
//     const space = response.data;
//     expect(space.dimensions).toBe("100x200");
//     expect(space.spaceElements.length).toBe(4);
//   });

//   test("Delete endpoint is able to delete an element", async () => {
//     const spaceResponse = await axios.get(
//       `${BACKEND_URL}/api/v1/space/${spaceId}`,
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
//       headers: {
//         authorization: `Bearer ${userToken}`,
//       },
//       data: {
//         id: spaceResponse.data.spaceElements[0].id,
//       },
//     });

//     const newSpaceResponse = await axios.get(
//       `${BACKEND_URL}/api/v1/space/${spaceId}`,
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const deleteElementId = spaceResponse.data.spaceElements[0].id;

//     expect(
//       newSpaceResponse.data.spaceElements.some((e) => e.id === deleteElementId)
//     ).toBe(false);

//     expect(newSpaceResponse.data.spaceElements.length).toBe(3);
//   });

//   test("Adding an element is working as expected", async () => {
//     await axios.post(
//       `${BACKEND_URL}/api/v1/space/element`,
//       {
//         elementId: element1Id,
//         spaceId,
//         x: 50,
//         y: 20,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
//       headers: {
//         authorization: `Bearer ${userToken}`,
//       },
//     });
//     expect(response.data.spaceElements.length).toBe(4);
//   });

//   test("Adding an element fails if it exists outside the dimensions", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space/element`,
//       {
//         elementId: element1Id,
//         spaceId,
//         x: 50000,
//         y: 20000,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(response.status).toBe(400);
//   });
// });

// describe("Admin endpoints", () => {
//   let adminId;
//   let adminToken;
//   let userId;
//   let userToken;

//   beforeAll(async () => {
//     const username = "user" + Math.random();
//     const username2 = "user" + Math.random();
//     const password = "12345678899";

//     const signupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signup`,
//       {
//         username,
//         password,
//         type: "admin",
//       }
//     );

//     adminId = signupResponse.data.userId;

//     const signinResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signin`,
//       {
//         username,
//         password,
//       }
//     );

//     adminToken = signinResponse.data.token;

//     const userSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signup`,
//       {
//         username: username2,
//         password,
//         type: "user",
//       }
//     );

//     userId = userSignupResponse.data.userId;

//     const userSigninResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/auth/signin`,
//       {
//         username: username2,
//         password,
//       }
//     );

//     userToken = userSigninResponse.data.token;
//   });

//   test("User is not able to hit admin endpoints", async () => {
//     const r1 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const r2 = await axios.put(
//       `${BACKEND_URL}/api/v1/admin/element/:randomElementId`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const r3 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "100 person interview room",
//         defaultElements: [
//           {
//             elementId: "chair1",
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: "chair2",
//             x: 18,
//             y: 20,
//           },
//           {
//             elementId: "table1",
//             x: 19,
//             y: 20,
//           },
//           {
//             elementId: "table2",
//             x: 19,
//             y: 20,
//           },
//         ],
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const r4 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Timmy",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(r1.status).toBe(403);
//     expect(r2.status).toBe(403);
//     expect(r3.status).toBe(403);
//     expect(r4.status).toBe(403);
//   });

//   test("Admin is able to hit admin endpoints", async () => {
//     const r1 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const r2 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "100 person interview room",
//         defaultElements: [],
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const r3 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Timmy",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     expect(r1.status).toBe(200);
//     expect(r2.status).toBe(200);
//     expect(r3.status).toBe(200);
//   });

//   test("Admin is able to update the element image", async () => {
//     const elementResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const updateElementResponse = await axios.put(
//       `${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     expect(updateElementResponse.status).toBe(200);
//   });
// });

describe("Websocket tests", () => {
  let adminId;
  let adminToken;
  let userId;
  let userToken;
  let mapId;
  let spaceId;
  let element1Id;
  let element2Id;
  let ws1;
  let ws2;
  let ws1Messages = [];
  let ws2Messages = [];
  let userX;
  let userY;
  let adminX;
  let adminY;

  async function setupHTTP() {
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

    const space = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    spaceId = space.data.spaceId;
  }

  async function setupWS() {
    ws1 = new WebSocket(WS_URL);

    await new Promise((resolve) => {
      ws1.onopen = resolve;
    });

    ws1.onmessage = (event) => {
      ws1Messages.push(JSON.parse(event.data));
    };

    ws2 = new WebSocket(WS_URL);

    await new Promise((resolve) => {
      ws2.onopen = resolve;
    });

    ws2.onmessage = (event) => {
      ws2Messages.push(JSON.parse(event.data));
    };
  }

  async function waitForAndPopulateLatestMessage(messageArray) {
    return new Promise((resolve) => {
      if (messageArray.length > 0) {
        resolve(messageArray.shift());
      } else {
        let interval = setInterval(() => {
          if (messageArray.length > 0) {
            resolve(messageArray.shift());
            clearInterval(interval);
          }
        }, 100);
      }
    });
  }

  beforeAll(async () => {
    await setupHTTP();
    await setupWS();
  });

  test("Get back the acknowledgement for joining the space", async () => {
    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: adminToken,
        },
      })
    );

    const message1 = await waitForAndPopulateLatestMessage(ws1Messages);

    ws2.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: userToken,
        },
      })
    );

    const message2 = await waitForAndPopulateLatestMessage(ws2Messages);
    const message3 = await waitForAndPopulateLatestMessage(ws1Messages);

    console.log(message1, message2, message3);

    expect(message1.type).toBe("space-joined");
    expect(message2.type).toBe("space-joined");

    expect(message1.payload.users.length).toBe(0);
    expect(message2.payload.users.length).toBe(1);

    adminX = message1.payload.spawn.x;
    adminY = message1.payload.spawn.y;

    userX = message2.payload.spawn.x;
    userY = message2.payload.spawn.y;

    expect(message3.type).toBe("user-joined");
    expect(message3.payload.x).toBe(message2.payload.spawn.x);
    expect(message3.payload.y).toBe(message2.payload.spawn.y);
    expect(message3.payload.userId).toBe(userId);

    expect(message3.payload.x).toBe(userX);
    expect(message3.payload.y).toBe(userY);
  });

  test("User should not be able to move across the boundary of the wall", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: 1000000,
          y: 10000,
        },
      })
    );

    const message = await waitForAndPopulateLatestMessage(ws1Messages);

    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("User should not be able to move two blacks at the same time", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: adminX + 2,
          y: adminY,
        },
      })
    );

    const message = await waitForAndPopulateLatestMessage(ws1Messages);

    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("Correct movement should be broadcasted to the other sockets in the room", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: adminX + 1,
          y: adminY,
        },
      })
    );

    const message = await waitForAndPopulateLatestMessage(ws2Messages);

    expect(message.type).toBe("movement");
    expect(message.payload.x).toBe(adminX + 1);
    expect(message.payload.y).toBe(adminY);
  });

  test("If a user leaves, the other user receives a leave event", async () => {
    ws1.close();

    const message = await waitForAndPopulateLatestMessage(ws2Messages);

    expect(message.type).toBe("user-left");
    expect(message.payload.userId).toBe(adminId);
  });

  afterAll(() => {
    if (ws1 && ws1.readyState === WebSocket.OPEN) {
      ws1.close();
    }

    if (ws2 && ws2.readyState === WebSocket.OPEN) {
      ws2.close();
    }
  });
});
