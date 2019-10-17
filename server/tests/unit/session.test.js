const databases = require("../../../db");

const SessionService = require("../../modules/session/session-service");
const sessionData = require("../data/session");

const errors = require("../../utils/errors");

beforeAll(async () => {
  const mysqlDB = await databases.Mysql.connect();
  console.log("DB connected...")
});

describe("Session creation", () => {

  let sessionMock = {};

  beforeEach(() => {
    sessionMock = sessionData.session();
  });

  test("1) Successful scenario", async () => {
    const session = await SessionService.createSession(sessionMock);
    expect(session).toBeDefined();
    expect(session.dataValues).toBeDefined();
    expect(session.dataValues.nombre).toBe(sessionMock.nombre);
  });
  test("2) Session without name", async () => {
    try {
      sessionMock.nombre = null;
      await SessionService.createSession(sessionMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Name is missing");
    }
  });
  test("3) Empty session name", async () => {
    try {
      sessionMock.nombre = "";
      await SessionService.createSession(sessionMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Name must not be empty");
    }
  });
  test("4) Invalid name", async () => {
    try {
      sessionMock.nombre = "<>";
      await SessionService.createSession(sessionMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Name cannot contain special characters");
    }
  });
});
