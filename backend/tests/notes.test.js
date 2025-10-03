import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import { Note } from "../models/notes.model.js";
import { user } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  
  const hashedPassword = await bcrypt.hash("StrongPass1!", 10);

  const testUser = await user.create({
    name: "Test User",
    email: "test@example.com",
    password: hashedPassword,
  });
  userId = testUser._id.toString();

  
  token = jwt.sign(
    { userid: userId, email: "test@example.com" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Notes API", () => {
  let noteId;

  // CREATE
  it("should create a new note (positive)", async () => {
    const res = await request(app)
      .post("/notes/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "First Note",
        content: "This is a test note",
        tags: ["test", "note"],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Note Created");

    const note = await Note.findOne({ title: "First Note" });
    expect(note).not.toBeNull();
    noteId = note._id;
  });

  it("should fail to create note without content (negative)", async () => {
    const res = await request(app)
      .post("/notes/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "No Content" });

    expect(res.statusCode).toBe(500); 
  });

  it("should fail to create note without auth token (negative)", async () => {
    const res = await request(app).post("/notes/create").send({
      title: "Unauthorized",
      content: "Should fail",
    });

    expect(res.statusCode).toBe(401); 
  });

  // GET ALL
  it("should fetch all undeleted notes (positive)", async () => {
    const res = await request(app)
      .get("/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.requestedNotes.length).toBeGreaterThan(0);
  });

  it("should return message if no notes found (negative)", async () => {
    await Note.deleteMany({});
    const res = await request(app)
      .get("/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("You have no notes right now.");
  });

  // Recreate note for further tests
  beforeEach(async () => {
    if (!(await Note.findById(noteId))) {
      const note = await Note.create({
        title: "Temp Note",
        content: "This is recreated",
        creator: userId,
      });
      noteId = note._id;
    }
  });

  
  it("should fetch a note by ID (positive)", async () => {
    const res = await request(app)
      .get(`/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBeDefined();
  });

  it("should return 400 for invalid ID (negative)", async () => {
    const res = await request(app)
      .get("/notes/123")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 if note not found (negative)", async () => {
    const res = await request(app)
      .get(`/notes/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  // EDIT
  it("should edit a note (positive)", async () => {
    const res = await request(app)
      .patch(`/notes/edit/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Note",
        content: "Updated content",
        tags: ["updated"],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Note");
  });

  it("should return 404 if note to edit not found (negative)", async () => {
    const res = await request(app)
      .patch(`/notes/edit/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Not Found" });

    expect(res.statusCode).toBe(404);
  });

  // SOFT DELETE
  it("should move note to bin (positive)", async () => {
    const res = await request(app)
      .patch(`/notes/move-to-bin/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Note moved to bin.");
  });

  it("should return 404 if note to bin not found (negative)", async () => {
    const res = await request(app)
      .patch(`/notes/move-to-bin/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  // BIN LIST
  it("should fetch deleted notes from bin (positive)", async () => {
    const res = await request(app)
      .get("/notes/bin")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.requestedNotes.length).toBeGreaterThan(0);
  });

  // DELETE
  it("should permanently delete a note (positive)", async () => {
    const res = await request(app)
      .delete(`/notes/delete/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Note has been deleted");
  });

  it("should return 404 if note not found for delete (negative)", async () => {
    const res = await request(app)
      .delete(`/notes/delete/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});
