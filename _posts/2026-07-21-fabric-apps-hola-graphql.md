---
layout: post
title: "Fabric Apps - Hola GraphQL"
date: 2026-07-21
author: "Nelson López Centeno"
image: /assets/images/posts/2026-07-21-fabric-apps-hola-graphql/dataXbi-fabric-apps-what-if.png
categories: 
  - "sin-categoria"
tags: 
  - "fabric-apps"
  - "fabric"
---
En esta tercera parte de la serie sobre Fabric Apps explico la integración con una base de datos SQL de Fabric. Cómo se gestionan la estructura y los permisos de la base de datos con Rayfin (*backend*), y cómo se utiliza GraphQL para acceder y modificar los datos desde el *frontend*. Desarrollo tres ejemplos, el primero con la plantilla *Basic Todo App* de Rayfin, el segundo parte de la misma plantilla para implementar la edición de una tabla de configuración de metadatos de una ETL, y el tercero combina la base de datos SQL con consultas DAX a un modelo semántico de Finanzas para hacer un análisis *what-if* de pérdidas y ganancias (PyG).

<!--more-->

Si aún no te has leído [las entradas anteriores de la serie](https://www.dataxbi.com/blog/tag/fabric-apps/?orden=asc), te animo a que lo hagas antes de continuar.

## Hola GraphQL

Vamos a comenzar creando una *Fabric App* a partir de la plantilla *Basic Todo App* de *Rayfin*.  Para ello, abro una terminal y ejecuto el comando:
```
npm create @microsoft/rayfin@latest "Hola GraphQL"
``` 

Una aplicación *Todo* nos permite gestionar una lista de tareas por hacer, y es un ejemplo clásico en los tutoriales de lenguajes de programación, porque es bastante sencilla de implementar. 

> Recuerda que debes cumplir con los requisitos indicados en la primera entrada de la serie.

![Creando la Fabric App en la línea de comando con la plantilla Basic Todo App de Rayfin](/assets/images/posts/2026-07-21-fabric-apps-hola-graphql/dataXbi-fabric-apps-hola-graphql-rayfin-basic-todo-app.png)

Si te fijas, verás que he escogido la opción 4, aunque la opción 3 también es una plantilla *Todo App*. La principal diferencia es que en la opción 3 el *frontend* está más elaborado que en la opción básica que he elegido, y utiliza la biblioteca de componentes [Radix UI](https://www.radix-ui.com/).

La ejecución de la plantilla crea la carpeta `hola-graphql` con el código de la *Fabric App*.

En la terminal, entra a la carpeta: `cd hola-graphql`.

Despliega la *Fabric App* con el comando  `npx rayfin up`. 

Ve al área de trabajo de Fabric y prueba la aplicación creando algunas tareas. También entra a la base de datos y mira las tablas que se han creado.

Detalles a tener en cuenta en este tipo de *Fabric App*, que accede a una base de datos SQL:
- **Si se puede abrir de manera independiente, sin estar dentro del portal de Fabric**, a diferencia de las *Fabric Apps* que acceden a modelos semánticos que, por ahora, sólo se pueden abrir dentro del portal de Fabric.
- Cada *Fabric App* tiene su propia base de datos SQL y, por ahora, no se puede conectar a otra.

El código lo he publicado en GitHub: [https://github.com/dataxbi/fabapp-hello-graphql](https://github.com/dataxbi/fabapp-hello-graphql)

Hice unos cambios mínimos en el frontend para agregarle el ícono y el logo de dataXbi. Los hice yo mismo, sin ningún agente de IA 😊.

<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/images/posts/2026-07-21-fabric-apps-hola-graphql/dataXbi-fabric-app-hola-graphql.mp4" type="video/mp4">
</video>

¿Te has preguntado por qué le he llamado "Hola GraphQL" a esta *Fabric App*? La respuesta te la doy al final de la siguiente sección.

## Revisando el código generado por la plantilla *Basic Todo App*

Aunque las *Fabric Apps* han sido concebidas para que el código no lo piquemos nosotros, sino que contemos con la ayuda de los agentes de IA, creo que vale la pena tener una idea general del funcionamiento interno. 

Por lo que vamos a revisar algunos aspectos del código generado por la plantilla.

> Puedes abrir Visual Studio Code desde la terminal con el comando `code .`.

Lo primero que te quiero mostrar del código son las instrucciones para los agentes de IA, que están en los ficheros [/AGENTS.md](https://github.com/dataxbi/fabapp-hello-graphql/blob/main/AGENTS.md) y /[.agents/skills/rayfin/SKILL.md](https://github.com/dataxbi/fabapp-hello-graphql/blob/main/.agents/skills/rayfin/SKILL.md) y que son prácticamente los mismos que los de la plantilla *Blank App* que mostré en el post inicial de la serie. De estas instrucciones, las secciones importantes para el trabajo con una base de datos son: [Security](https://github.com/dataxbi/fabapp-hello-graphql/blob/main/.agents/skills/rayfin/SKILL.md#security), [Data Modeling](https://github.com/dataxbi/fabapp-hello-graphql/blob/main/.agents/skills/rayfin/SKILL.md#data-modeling), [Querying](https://github.com/dataxbi/fabapp-hello-graphql/blob/main/.agents/skills/rayfin/SKILL.md#querying) y [Schema](https://github.com/dataxbi/fabapp-hello-graphql/blob/main/.agents/skills/rayfin/SKILL.md#schema).


Estas son las únicas instrucciones para agentes de IA incluidas con esta plantilla. No viene el conjunto de skills de la plantilla *Data App* que mostré en el segundo post de la serie.

### *Backend*

Otra parte interesante del código está en la carpeta [/rayfin](https://github.com/dataxbi/fabapp-hello-graphql/tree/main/rayfin) donde se configura el *backend*. Dentro de esta carpeta encontramos el fichero [rayfin.yml](https://github.com/dataxbi/fabapp-hello-graphql/blob/main/rayfin/rayfin.yml) que ya conocemos, y donde está habilitada la base de datos SQL de Fabric:

```
  data:
    enabled: true
    dialect: mssql
```

La estructura de esta base de datos se establece en la carpeta [/rayfin/data](https://github.com/dataxbi/fabapp-hello-graphql/tree/main/rayfin/data) a través del fichero [schema.ts](https://github.com/dataxbi/fabapp-hello-graphql/blob/main/rayfin/data/schema.ts) y de un fichero por tabla. 

Fichero `schema.ts`:
```
import { Todo } from './Todo.js';

export type TodoAppSchema = {
  Todo: Todo;
};

export const schema = [Todo];
```

En este caso solo hay una tabla con el nombre Todo cuya definición está en el fichero [Todo.ts](https://github.com/dataxbi/fabapp-hello-graphql/blob/main/rayfin/data/Todo.ts).


Fichero `Todo.ts`:

```
import {
  entity,
  role,
  text,
  boolean,
  date,
  uuid,
} from '@microsoft/rayfin-core';

@entity()
@role('authenticated', '*', {
  policy: (claims, item) => claims.sub.eq(item.user_id),
})
export class Todo {
  @uuid() id!: string;
  @text({ min: 1, max: 100 }) title!: string;
  @boolean() isCompleted!: boolean;
  @date() createdAt!: Date;
  @text() user_id!: string;
}
```

El nombre que tendrá la tabla en la base de datos se define en la instrucción `export class Todo`, y a dicho nombre se le agregará una **s**.

A partir de esta configuración, Rayfin crea la base de datos cuando desplegamos la *Fabric App* con el comando `npx rayfin up`.

Aunque la estructura de la base de datos se puede modificar directamente en Fabric, **es muy recomendable que todos los cambios se hagan aquí en esta configuración**. De esta manera se actualizarán cada vez que hagamos un despliegue. Podemos utilizar el comando `npx rayfin up db apply` si sólo queremos cambiar la base de datos sin actualizar el resto de la *Fabric App*.

Te invito a leer en la [documentación oficial](https://learn.microsoft.com/es-es/fabric/apps/data-models?wt.mc_id=MVP_367391) los detalles de la configuración de la base de datos (modelo de datos).

Si luego de desplegar la Fabric App, vas al área de trabajo y revisas la base de datos, podrás comprobar que se ha creado una tabla con el nombre Todo**s**. 

### Permisos de datos

Si revisas con atención `Todo.ts` encontrarás que, además de la estructura de la tabla, se incluye este fragmento de código:

```
@role('authenticated', '*', {
  policy: (claims, item) => claims.sub.eq(item.user_id),
})
```

Aquí se está indicando que solo pueden acceder a esta tabla los usuarios con el rol `authenticated` (que son todos porque recuerda que para acceder a cualquier *Fabric App* hay que autenticarse en Fabric), y que pueden realizar cualquier operación de creación, lectura, modificación o borrado. Si se crea o modifica una fila, el ID del usuario se guardará en la columna user_id. Y si se lee la tabla se filtrarán las filas donde el ID del usuario coincida con el valor en la columna user_id.

El ID del usuario proviene de *Microsoft Entra ID* que es el servicio de autenticación que utiliza Fabric.

Cuando revisaste la base de datos creada en Fabric habrás notado que además de la tabla Todos, también se había creado una tabla **Users**. Esta es una tabla de sistema, creada automáticamente por Rayfin.

Puedes profundizar sobre los permisos de datos en la [documentación oficial](https://learn.microsoft.com/es-es/fabric/apps/data-permissions?wt.mc_id=MVP_367391). 


### *Frontend*

Para finalizar este recorrido por el código, te voy a llevar a la carpeta [/src](https://github.com/dataxbi/fabapp-hello-graphql/tree/main/src) que forma parte del *frontend* de la *Fabric App*. Y dentro de esta carpeta voy a abrir el fichero [/src/services/todos.ts](https://github.com/dataxbi/fabapp-hello-graphql/blob/main/src/services/todos.ts) que contiene las operaciones de lectura, inserción, modificación y borrado que se hacen en la base de datos. Estas operaciones utilizan internamente el lenguaje de consultas para APIs [**GraphQL**](https://graphql.org/) y es la razón de que el nombre de esta *Fabric App* sea "Hola GraphQL".


A continuación muestro algunos fragmentos del código de `todo.ts`. 

Listar las filas de la tabla Todos:

```
  const client = getRayfinClient();
  const results = await client.data.Todo.select([
    'id',
    'title',
    'isCompleted',
    'createdAt',
  ])
    .orderBy({ createdAt: 'desc' })
    .execute();
```

Crear una fila en la tabla Todos:

```
  const client = getRayfinClient();
    const session = client.auth.getSession();
    if (!session.isAuthenticated || !session.user) {
      throw new Error('Cannot create todo: user is not authenticated.');
    }
    const todo = await client.data.Todo.create({
      title,
      isCompleted: false,
      createdAt: new Date(),
      user_id: session.user.id,
    });
```

Modificar una fila de la tabla Todos:

```
  const client = getRayfinClient();
  await client.data.Todo.update({ id }, updates);
  const todo = await client.data.Todo.findById(id);

```

Borrar una fila de la tabla Todos:

```
  const client = getRayfinClient();
  await client.data.Todo.delete({ id });
```

## ETL Config

En el segundo ejemplo he hecho una *Fabric App* para gestionar la configuración de la ingesta de datos hacia la capa bronce de una arquitectura Medallion. Cuando implemento una ETL me gusta que sea *metadata driven*, y una base de datos SQL es una buena opción para guardar los metadatos de configuración. Algunos de esos metadatos se pueden llenar de manera automática, pero es útil poder hacer modificaciones puntuales, y con una *Fabric App* se logra una solución muy elegante. 

He partido de la misma plantilla *Basic Todo App*, y he utilizado agentes de IA siguiendo el mismo proceso que ya he explicado en otros posts de esta serie: **plan** - **especificación** - **implementación** - **testing** - **despliegue**, en varias iteraciones.

> Recomiendo instalar el [MCP de Microsoft Learn](https://learn.microsoft.com/es-es/training/support/mcp?wt.mc_id=MVP_367391) para que los agentes tengan acceso a la documentación de la configuración del modelo de la base de datos SQL.

Lo primero que definí fue la estructura de la tabla de metadatos:

```sql
CREATE TABLE EtlConfigIngestions (
    ConfigId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),

    IsEnabled BIT NOT NULL DEFAULT 1,

    SourceConnectionName NVARCHAR(100) NOT NULL,
    SourceSchemaName NVARCHAR(128) NOT NULL,
    SourceTableName NVARCHAR(128) NOT NULL,

    LoadMode NVARCHAR(20) NOT NULL,
    IncrementalColumnName NVARCHAR(128) NULL,

    TargetWorkspaceName NVARCHAR(100) NOT NULL,
    TargetLakehouseName NVARCHAR(100) NOT NULL,
    TargetSchemaName NVARCHAR(128) NULL,
    TargetTableName NVARCHAR(128) NOT NULL,

    CreatedAt DATETIME2 NOT NULL
        DEFAULT SYSDATETIME(),

    UpdatedAt DATETIME2 NULL,
    UpdatedByUserId NVARCHAR(100) NULL,

    CONSTRAINT CK_EtlConfigIngestions_LoadMode
        CHECK (LoadMode IN ('Full', 'Incremental'))
);
```

En cuanto a la parte visual de la aplicación, le indiqué que se basara en el diseño de nuestro sitio web y que utilizara la biblioteca [TanStack Table](https://tanstack.com/table/latest). 


La especificación completa la puedes leer aquí: [https://github.com/dataxbi/fabapp-etl-config/blob/main/specs/00-especificacion-general.md](https://github.com/dataxbi/fabapp-etl-config/blob/main/specs/00-especificacion-general.md)


<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/images/posts/2026-07-21-fabric-apps-hola-graphql/dataXbi-fabric-app-etl-config.mp4" type="video/mp4">
</video>


Todo el código está disponible en GitHub: [https://github.com/dataxbi/fabapp-etl-config](https://github.com/dataxbi/fabapp-etl-config)

Si revisas [el historial de los commits](https://github.com/dataxbi/fabapp-etl-config/commits/main/) podrás ver cómo fui iterando hasta llegar a la versión final.


## Análisis What-If PyG

Para el último ejemplo de hoy voy a combinar en una *Fabric App* un modelo semántico de finanzas y una base de datos SQL, para implementar un análisis *what-if* de pérdidas y ganancias (PyG).

El modelo semántico es el mismo que utilicé en el segundo post de esta serie para implementar un informe de PyG. La base de datos SQL almacena posibles escenarios de aumento o disminución de los ingresos y los gastos, expresados en valores porcentuales. La *Fabric App* permite gestionar los escenarios (crear, modificar, borrar), y comprobar cómo influyen en el informe de PyG, calculando la variación con el estado actual. Esto ocurre de forma interactiva y con un tiempo de respuesta bajo, por lo que la experiencia del usuario es muy buena.

> Esta *Fabric App* solo se puede abrir dentro del portal de Fabric porque accede a un modelo semántico.

<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/images/posts/2026-07-21-fabric-apps-hola-graphql/dataXbi-fabric-app-what-if.mp4" type="video/mp4">
</video>


Lo que ocurre internamente es lo siguiente:
- La gestión de los escenarios se hace con GraphQL. Excepto el listado de cuentas al insertar un ajuste, que se obtiene con una consulta DAX al modelo semántico.
- Para construir la tabla PyG What-if, primero se hace una consulta GraphQL para obtener los valores del escenario. Estos datos se incluyen en una consulta DAX que se envía al modelo semántico, para obtener los valores actuales de ingresos, gastos y total, y calcular la variación con el escenario. 
 
En el modelo semántico no hay medidas para calcular la variación, porque los datos del escenario no están en el modelo. Hay expresiones DAX que solo están en la *Fabric App*.

En lugar de crear tablas desconectadas dentro del modelo, las estamos externalizamos a una base de datos SQL, y también externalizamos, en el *frontend* de la *Fabric App*, el código DAX que hace la conexión y los cálculos.

![Diagrama explicando como se combinan las consultas GraphQL y DAX en esta Fabric App](/assets/images/posts/2026-07-21-fabric-apps-hola-graphql/dataXbi-fabric-app-what-if-diagrama.png)

Al implementar este ejemplo, en lugar de crear una nueva aplicación con Rayfin, cloné el [repositorio con el informe de PyG](https://github.com/dataxbi/fabapp-dax-finance). Si hubiera empezado de cero, utilizaría la plantilla *Data App* porque  incluye todo lo necesario para hacer y probar las consultas DAX, que es lo más complicado.

A partir de aquí, fui iterando en mi proceso habitual de trabajo con agentes de IA: **plan** - **especificación** - **implementación** - **testing** - **despliegue**.

Todo el código está disponible en GitHub: [https://github.com/dataxbi/fabapp-what-if](https://github.com/dataxbi/fabapp-what-if)

Te invito a revisar:
- Las especificaciones: [https://github.com/dataxbi/fabapp-what-if/tree/main/docs](https://github.com/dataxbi/fabapp-what-if/tree/main/docs)
- El esquema de la base de datos: [https://github.com/dataxbi/fabapp-what-if/tree/main/rayfin/data](https://github.com/dataxbi/fabapp-what-if/tree/main/rayfin/data)
- Las consultas DAX: [https://github.com/dataxbi/fabapp-what-if/tree/main/src/queries/pl](https://github.com/dataxbi/fabapp-what-if/tree/main/src/queries/pl)


## Continuará...

Gracias por llegar hasta aquí. 😊

En la próxima entrega de la serie te mostraré una herramienta gratuita que te permite crear las *Fabric Apps* desde una aplicación de escritorio, nada de línea de comando.