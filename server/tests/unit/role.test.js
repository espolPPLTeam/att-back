const databases = require("../../../db");

const RoleService = require("../../modules/roles/role-service");

const errors = require("../../utils/errors");

beforeAll(async () => {
  const mysqlDB = await databases.Mysql.connect();
  console.log("DB connected...")
});

describe("Role creation", () => {
  test("1) Successful scenario", async () => {
    const role = await RoleService.createRole("admin");
    expect(role).toBeDefined();
    expect(role.dataValues).toBeDefined();
    expect(role.dataValues.nombre).toBe("admin");
  });
  test("2) Role without name", async () => {
    try {
      await RoleService.createRole(null);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Name is missing");
    }
  });
  test("3) Empty name", async () => {
    try {
      await RoleService.createRole("");
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Name must not be empty");
    }
  });
  test("4) Invalid name", async () => {
    try {
      await RoleService.createRole("asd");
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Name is not allowed");
    }
  });
});

describe("Find role by name", () => {
  beforeAll(async () => {
    await RoleService.createRole("admin");
  });
  test("1) Role exists", async () => {
    const role = await RoleService.getRoleByName("admin");
    expect(role).toBeDefined();
    expect(role.dataValues).toBeDefined();
    expect(role.dataValues.nombre).toBe("admin");
  });
  test("2) Role doesn't exist", async () => {
    const role = await RoleService.getRoleByName("admin2");
    expect(role).toBe(null);
  });
  test("3) Role not passed", async () => {
    const role = await RoleService.getRoleByName(null);
    expect(role).toBe(null);
  });
});
