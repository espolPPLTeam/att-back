USE `att_develop`;

INSERT INTO roles(id, nombre, created_at, updated_at)
	VALUES (1, 'admin', NOW(), NOW());

INSERT INTO roles(id, nombre, created_at, updated_at)
	VALUES (2, 'profesor', NOW(), NOW());

INSERT INTO roles(id, nombre, created_at, updated_at)
	VALUES (3, 'estudiante', NOW(), NOW());