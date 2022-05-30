# Next js OpenJira App

Para correr localmente, se necesita la base de datos:

```
docker-compose up -d
```

* El -d significa __detached__
* MongoDB URL local:
```
mongodb://localhost:27017/entriesdb
```

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__ y agregar los valores requeridos.

## Llenar la base de datos con info de pruebas
```
http://localhost:3000/api/seed
```