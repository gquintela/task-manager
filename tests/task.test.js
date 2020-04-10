const request = require("supertest")
const Task = require("../src/models/task")
const app = require("../src/app");
const {
    preVerifiedUserId,
    preVerifiedUser,
    setupDataBase,
    sleep,
    taskTwo
} = require("./fixtures/db")

beforeEach(setupDataBase)

test("should create task for user", async () => {
    const response = await request(app).post("/tasks")
        .set("Authorization", `Bearer ${preVerifiedUser.tokens[0].token}`)
        .send({
            description: "for my test"
        }).expect(201)
    const taskInDb = await Task.findById(response.body._id)
    expect(taskInDb).not.toEqual(null)
    expect(taskInDb.completed).toBe(false)
})

test("should get all task from a user", async () => {
    const response = await request(app).get("/tasks")
        .set("Authorization", `Bearer ${preVerifiedUser.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(1)
})

test("user should not delete other tasks", async () => {
    const response = await request(app)
        .delete(`/tasks/${taskTwo._id}`)
        .set("Authorization", `Bearer ${preVerifiedUser.tokens[0].token}`)
        .expect(404)
    const taskTwoInDb = await Task.findById(taskTwo._id)
    expect(taskTwoInDb).not.toEqual(null)

})