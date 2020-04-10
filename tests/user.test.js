const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const {
  preVerifiedUserId,
  preVerifiedUser,
  setupDataBase,
  sleep
} = require("./fixtures/db")

beforeEach(setupDataBase)

test("should sign up a user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "john doe",
      email: "johndoe@falsgmail.com",
      password: "1234aA",
    })
    .expect(201);

  ///user is stored in db, found by id
  const userInDb = await User.findById(response.body.user._id);
  expect(userInDb).not.toBeNull();

  ///user name is stored correctly
  expect(response.body.user).toMatchObject({
    name: "john doe",
  });
});

test("should log in using preVerifiedUser", async () => {
  await sleep(1000); ///avoid instant token duplicate

  const response = await request(app)
    .post("/users/login")
    .send({
      email: "preVerifiedUser@falsgmail.com",
      password: "1234aA",
    })
    .expect(200);

  /// check preVerifiedUserToken is saved
  const userInDb = await User.findById(preVerifiedUser._id);
  expect(response.body.token).toEqual(userInDb.tokens[1].token);
  expect(response.body.token).not.toEqual(userInDb.tokens[0].token);
});

test("should NOT log with a non existent user", async () => {
  debugger;

  await request(app)
    .post("/users/login")
    .send({
      email: "dontexists@falsgmail.com",
      password: "1234aA",
    })
    .expect(400);
});

test("should NOT log with an invalid password", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "preVerifiedUser@falsgmail.com",
      password: "1234daA",
    })
    .expect(400);
});

test("should get a profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${preVerifiedUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should NOT get a profile for unauthenticated user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `abcd`)
    .send()
    .expect(401);
});

test("should delete account if user authenticated", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${preVerifiedUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should NOT delete account if user unauthenticated", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer $avb`)
    .send()
    .expect(401);
});

test("should upload avatar", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${preVerifiedUser.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const userInDb = await User.findById(preVerifiedUserId);
  expect(userInDb.avatar).toEqual(expect.any(Buffer));
});

test("should update valid fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${preVerifiedUser.tokens[0].token}`)
    .send({
      name: "jorge",
    })
    .expect(200);

  const userInDb = await User.findById(preVerifiedUserId);
  expect(userInDb.name).toEqual("jorge");
});