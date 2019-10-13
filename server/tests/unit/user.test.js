const UserService = require("../../modules/usuarios/user-service");
const databases = require("../../../db");

const usersData = require("../data/users");
const errors = require("../../utils/errors");

beforeAll(async () => {
  const mysqlDB = await databases.Mysql.connect();
  console.log("DB connected...")
});

describe("User creation", () => {
  let userMock = {};

  beforeEach(() => {
    userMock = usersData.user();
  });

  test("1) Successful scenario", async () => {
    expect.assertions(7);
    const user = await UserService.createUser(userMock);
    expect(user.dataValues).toBeDefined();
    expect(user.dataValues.id).toBe(1);
    expect(user.dataValues.nombres).toBe(userMock.nombres);
    expect(user.dataValues.apellidos).toBe(userMock.apellidos);
    expect(user.dataValues.email).toBe(userMock.email);
    expect(user.dataValues.clave).toBe(userMock.clave);
    expect(user.dataValues.matricula).toBe(userMock.matricula);
  });
  test("2) No name", async () => {
    expect.assertions(4);
    try {
      userMock.nombres = null;
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Name is missing");
    }
  });
  test("3) Empty name", async () => {
    expect.assertions(4);
    try {
      userMock.nombres = "";
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Name must not be empty");
    }
  });
  test("4) Invalid name", async () => {
    expect.assertions(4);
    try {
      userMock.nombres = "123";
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Name must only contain letters");
    }
  });
  test("5) No last name", async () => {
    expect.assertions(4);
    try {
      userMock.apellidos = null;
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Last name is missing");
    }
  });
  test("6) Empty last name", async () => {
    expect.assertions(4);
    try {
      userMock.apellidos = "";
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Last name must not be empty");
    }
  });
  test("7) Invalid last name", async () => {
    expect.assertions(4);
    try {
      userMock.apellidos = "123";
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Last name must only contain letters");
    }
  });
  test("8) No email", async () => {
    expect.assertions(4);
    try {
      userMock.email = null;
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Email is missing");
    }
  });
  test("9) Empty email", async () => {
    expect.assertions(4);
    try {
      userMock.email = "";
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Email must not be empty");
    }
  });
  test("10) Invalid email", async () => {
    expect.assertions(4);
    try {
      userMock.email = "123";
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Email not valid");
    }
  });
  test("11) No password", async () => {
    expect.assertions(4);
    try {
      userMock.clave = null;
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Password is missing");
    }
  });
  test("12) Empty password", async () => {
    expect.assertions(4);
    try {
      userMock.clave = "";
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Password must not be empty");
    }
  });
  test("13) No identification", async () => {
    expect.assertions(4);
    try {
      userMock.matricula = null;
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Identification is missing");
    }
  });
  test("14) Empty identification", async () => {
    expect.assertions(4);
    try {
      userMock.matricula = "";
      const user = await UserService.createUser(userMock);
    } catch (error) {
      expect(error.name).toBe(errors.SequelizeValidationError);
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toBeDefined();
      expect(error.errors[0].message).toBe("Identification must not be empty");
    }
  });
});

describe("Find user by email", () => {
  beforeAll(async () => {
    const user = usersData.user();
    await UserService.createUser(user);
  });
  test("1) User exists", async () => {
    const email = "edison_andre_9@hotmail.com";
    const user = await UserService.getUserByEmail(email);
    expect(user).toBeDefined();
    expect(user.dataValues).toBeDefined();
    expect(user.dataValues.email).toBe(email);
  });
  test("2) User doesn't exist", async () => {
    const email = "correo@falso.com";
    const user = await UserService.getUserByEmail(email);
    expect(user).toBe(null);
  });
  test("3) Email not passed", async () => {
    const user = await UserService.getUserByEmail(null);
    expect(user).toBe(null);
  });
});
