## Exportar base de datos

### Sin datos (solo esquema)

```sh
mysqldump -d -u <dabatase_user> -p <database_name> > <database_name>_schema_dump.sql
```
Saldra un prompt para la contrasenna

### Con datos
```sh
mysqldump -u <dabatase_user> -p <database_name> > <database_name>_dump.sql
```

## Crear base de datos

Para esto hay que cargar el script del schema de la base de datos
1. Primero ingresar con las credenciales a mysql
```sh
mysql -u <dabatase_user> -p
```
2. Luego crear la base de datos manualmente
```sh
CREATE DATABASE <database_name>;
USE <database_name>;
```
3. Cargar el script para crear la base de datos
```sh
source <database_name>_schema_dump.sql
```
4. Cargar datos iniciales de la base
Esto se lo hizo en node para poder crear el usuario admin con una clave hasheada
Recordar tener los campos necesarios en el .env
```sh
npm run populateDB:dev # Para ambiente de desarrollo
npm run populateDB:production # Para ambiente de produccion
```