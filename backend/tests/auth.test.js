import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import { user } from "../models/user.model.js";
import bcrypt from "bcrypt";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await user.deleteMany(); 
});

describe("POST /auth/signup", () => {
  it("should register a new user with valid data", async () => {
    const res = await request(app).post("/auth/signup").send({
      name: "Bilal",
      email: "bilal@example.com",
      password: "StrongPass1!"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Registeration is Successful.");
    const createdUser = await user.findOne({ email: "bilal@example.com" });
    expect(createdUser).not.toBeNull();
  });

  it("should fail if email is invalid", async () => {
    const res = await request(app).post("/auth/signup").send({
      name: "Bilal",
      email: "not-an-email",
      password: "StrongPass1!"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid Data");
  });

  it("should fail if password is weak", async () => {
    const res = await request(app).post("/auth/signup").send({
      name: "Bilal",
      email: "bilal@example.com",
      password: "weak"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid Data");
  });
});

describe("POST /auth/login", () => {
  beforeEach(async () => {
    // creating a user before login tests
    let plainPassword = 'StrongPass1!';
    const hashedPassword = await bcrypt.hash(plainPassword, 10)
    await user.create({
      name: "Bilal",
      email: "bilal@example.com",
      password: hashedPassword
    });
  });

  it("should login with correct credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "bilal@example.com",
      password: "StrongPass1!"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login is Successful.");
  });

  it("should fail with wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "bilal@example.com",
      password: "WrongPassword!5"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Incorrect Email or Password");
  });

  it("should fail if user does not exist", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "nouser@example.com",
      password: "StrongPass1!"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Incorrect Email or Password");
  });

  it("should fail with invalid email format", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "not-an-email",
      password: "StrongPass1!"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid Data");
  });
});
