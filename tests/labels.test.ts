import { v4 as uuidv4 } from "uuid";
import { createTestApi } from "./setup/app";
import { makeTestHelpers } from "./setup/helpers";

describe("Labels Endpoints", () => {
  let api: any;
  let helpers: ReturnType<typeof makeTestHelpers>;
  let token: string;

  beforeEach(async () => {
    api = createTestApi();
    helpers = makeTestHelpers(api);
    token = await helpers.getAuthToken();
  });

  describe("POST /api/labels", () => {
    it("should create a new label with valid data", async () => {
      const labelData = {
        id: uuidv4(),
        name: "Important",
      };

      const response = await helpers.createLabel(token, labelData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });

    it("should create a label without color", async () => {
      const labelData = {
        id: uuidv4(),
        name: "Work",
      };

      const response = await api
        .post("/api/labels")
        .set("Authorization", `Bearer ${token}`)
        .send(labelData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });

    it("should return 401 when not authenticated", async () => {
      const response = await api.post("/api/labels").send({
        id: "test-label",
        name: "Test Label",
      });

      expect(response.status).toBe(401);
    });

    it("should return 400 when id is missing", async () => {
      const response = await api
        .post("/api/labels")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Label",
        });

      expect(response.status).toBe(400);
    });

    it("should return 400 when name is missing", async () => {
      const response = await api
        .post("/api/labels")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: "test-label",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/labels", () => {
    it("should return all labels for authenticated user", async () => {
      // Create a couple of labels
      const label1Id = uuidv4();
      const label2Id = uuidv4();
      await helpers.createLabel(token, {
        id: label1Id,
        name: "Label 1",
      });
      await helpers.createLabel(token, {
        id: label2Id,
        name: "Label 2",
      });

      const response = await api
        .get("/api/labels")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(typeof response.body).toBe("object");
      const labelIds = Object.keys(response.body);
      expect(labelIds.length).toBeGreaterThanOrEqual(2);
      expect(response.body[label1Id]).toBeDefined();
      expect(response.body[label2Id]).toBeDefined();
    });

    it("should return 401 when not authenticated", async () => {
      const response = await api.get("/api/labels");

      expect(response.status).toBe(401);
    });

    it("should not return labels from other users", async () => {
      // Create label with first user
      const labelId = uuidv4();
      await helpers.createLabel(token, {
        id: labelId,
        name: "User 1 Label",
      });

      // Create second user and get their labels
      const token2 = await helpers.getAuthToken();
      const response = await api
        .get("/api/labels")
        .set("Authorization", `Bearer ${token2}`);

      expect(response.status).toBe(200);
      expect(typeof response.body).toBe("object");
      // Second user should not see first user's labels
      expect(response.body[labelId]).toBeUndefined();
    });
  });

  describe("PUT /api/labels/:id", () => {
    it("should update a label with valid data", async () => {
      // Create a label first
      const labelId = uuidv4();
      await helpers.createLabel(token, {
        id: labelId,
        name: "Original Name",
      });

      // Update the label
      const response = await api
        .put(`/api/labels/${labelId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Updated Name",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", labelId);
    });

    it("should return 401 when not authenticated", async () => {
      const response = await api.put("/api/labels/some-id").send({
        name: "Updated Name",
      });

      expect(response.status).toBe(401);
    });

    it("should return 404 when label does not exist", async () => {
      const response = await api
        .put(`/api/labels/${uuidv4()}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Updated Name",
        });

      expect(response.status).toBe(404);
    });

    it("should not allow updating another user's label", async () => {
      // Create label with first user
      const labelId = uuidv4();
      await helpers.createLabel(token, {
        id: labelId,
        name: "User 1 Label",
      });

      // Try to update with second user
      const token2 = await helpers.getAuthToken();
      const response = await api
        .put(`/api/labels/${labelId}`)
        .set("Authorization", `Bearer ${token2}`)
        .send({
          name: "Hacked Label",
        });

      expect(response.status).toBe(404); // Should not find the label
    });
  });

  describe("DELETE /api/labels/:id", () => {
    it("should delete a label", async () => {
      // Create a label first
      const labelId = uuidv4();
      await helpers.createLabel(token, {
        id: labelId,
        name: "To Delete",
      });

      // Delete the label
      const response = await api
        .delete(`/api/labels/${labelId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      // Verify it's deleted
      const getResponse = await api
        .get("/api/labels")
        .set("Authorization", `Bearer ${token}`);
      expect(getResponse.body[labelId]).toBeUndefined();
    });

    it("should return 401 when not authenticated", async () => {
      const response = await api.delete("/api/labels/some-id");

      expect(response.status).toBe(401);
    });

    it("should return 404 when label does not exist", async () => {
      const response = await api
        .delete(`/api/labels/${uuidv4()}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("should not allow deleting another user's label", async () => {
      // Create label with first user
      const labelId = uuidv4();
      await helpers.createLabel(token, {
        id: labelId,
        name: "User 1 Label",
      });

      // Try to delete with second user
      const token2 = await helpers.getAuthToken();
      const response = await api
        .delete(`/api/labels/${labelId}`)
        .set("Authorization", `Bearer ${token2}`);

      expect(response.status).toBe(404); // Should not find the label
    });
  });
});

