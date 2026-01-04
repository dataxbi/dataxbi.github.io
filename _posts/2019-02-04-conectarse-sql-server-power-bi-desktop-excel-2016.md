---
layout: post
title: "Conectarse a SQL Server desde Power BI Desktop y Excel 2016"
date: 2019-02-04
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

En una [entrada anterior](https://www.dataxbi.com/blog/2018/10/23/conectarse-origenes-datos-power-bi-desktop-excel-2016/) se estudiaron los distintos orígenes de datos a los que es posible conectarse desde Power Query y las categorías en que se agrupaban: Archivo, Base de datos, Power BI, Azure, Servicios en línea y Otros. La categoría Base de datos proporciona conexión a un amplio conjunto de bases de datos, entre las que se encuentran Oracle, MySQL, Access, SQL Server, etc. En esa misma entrada se vieron ejemplos de como conectarse a las bases de datos MySQL y Microsoft Access. En la entrada de hoy se analizará como conectarse a SQL Server desde Power BI Desktop y Excel 2016.

<!--more-->

### Conectarse a SQL Server desde Power BI Desktop

Si en Power BI Desktop, se selecciona la opción Obtener datos|SQL Server de la pestaña Inicio se muestra el cuadro de diálogo Base de datos SQL Server:

![dataXbi-Conectarse a SQL Server-Servidor](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Servidor.png)

Imagen 1. Cuadro de diálogo Base de datos SQL Server

donde además de escribir el nombre del servidor y la base de datos, se deberá elegir el modo de conectarse al origen y configurar las opciones avanzadas para controlar la conexión.

A continuación se analizan las opciones de esta ventana y se muestran algunos ejemplos de conexión.

#### Opción Servidor:

Es un campo obligatorio, de tipo texto, donde se escribirá el nombre de la instancia de SQL Server a la que se quiere conectar. Además del nombre de la instancia, puede especificarse el número del puerto por el que se accederá.

Ejemplos:

- localhost (instancia local)
- . (instancia local)
- 192.168.1.3 (dirección ip del servidor)
- Servidor1 (nombre del servidor)
- Servidor1:1433 (nombre y puerto del servidor)

#### Opción Base de datos:

Es un campo opcional, de tipo texto, que almacenará el nombre de la base de datos a la que se quiere conectar.

Ejemplos:

- [AdventureWorks2017](https://docs.microsoft.com/es-es/sql/samples/adventureworks-install-configure?view=sql-server-2017) (Base de datos de ejemplo de Microsoft)
- [AdventureWorksDW2017](https://docs.microsoft.com/es-es/sql/samples/adventureworks-install-configure?view=sql-server-2017) (Almacén de datos de ejemplo de Microsoft)

#### Opción Modo conectividad de datos:

Son dos botones de opciones que permiten elegir el modo predeterminado de conectarse al origen. Por defecto, el botón seleccionado es Importar.

##### El modo Importar:

Si se elige esta opción se importa una copia de los datos seleccionados al modelo. Esto tiene como consecuencia que el modelo no está actualizado y que requerirá actualizarlo cuando existan modificaciones de los datos subyacentes desde la última carga realizada.

##### El modo DirectQuery:

AL elegir esta opción no se importan ni copian datos sino que se conecta directamente al origen de datos. Cuando se crea o se interactua con una visualización se consultará el origen de datos subyacente, lo que significa que los datos siempre estarán actualizados.

  

#### Ejemplos de conexión a SQL Server

##### Ejemplo 1: Conectarse a SQL Server especificando solamente el nombre del servidor y el modo Importar para la conexión.

![Conectar SQL Server Power BI Desktop-Servidor](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop2.png)

Imagen 2. Conectar SQL Server especificando el servidor y el modo de conexión

Si esta es la primera vez que va a conectarse a este servidor, al oprimir el botón Aceptar verá la siguiente ventana para seleccionar el modo de autenticación para conectarse a la base de datos y especificar sus credenciales.

![Conectar SQL Server-Credenciales](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Credenciales.png)

Imagen 3. Ventana para especificar las credenciales con las que se conectará al servidor.

Al oprimir el botón Conectar, si no se usa una conexión cifrada con SQL Server, Power Query solicitará establecer una conexión no cifrada.

![Conectar SQL Server--Compatibilidad de cifrado](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Compatibilidad-de-cifrado.png)

Imagen 4. Ventana Compatibilidad de cifrado.

Haga clic en Aceptar para conectarse utilizando una conexión no cifrada.

Si se pudo establecer la conexión se muestra la ventana Navegador con el listado de las bases de datos del servidor. Debe seleccionar una y desplegar su menú para escoger entre los objetos que contiene, tablas, vistas y funciones, aquellos a los que desea conectarse.

![Conectar SQL Server Power BI Desktop Tablas. Vistas y Funciones](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Tablas-Vistas-Funciones2.png)

Imagen 5. Ventana Navegador con la lista de bases de datos del servidor y sus tablas, vistas y funciones.

Se puede identificar fácilmente a que tipo de objeto corresponde cada origen por el icono que lo representa. Primero se muestran las vistas, que en este caso es una, luego las tablas, que son cuatro y por último las funciones, que también es una. Por cada elemento seleccionado se creará una nueva consulta en Power Query.

Si después de seleccionar los orígenes de datos se oprime el botón Cargar, que es la opción por defecto, las tablas se importarán directamente en el modelo sin realizar ninguna transformación previamente.

En lugar de Cargar, lo aconsejable es oprimir el botón Editar para hacer todas las transformaciones necesarias en el Editor de consulta y luego cargar los datos seleccionados al modelo. Solamente en el caso de que esté seguro de que los datos están limpios, con el formato apropiado y que son necesarios en su totalidad hará la carga directamente, en otro caso siempre es mejor editar.

Si se cargan los datos en el modelo una vez transformados, se podrá ver una vista con los datos importados.

![Conectar SQL Server Power BI Desktop- Vista de Datos-Modo Importar](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Vista-Datos-Modo-Importar.png)

Imagen 6. Vista de los datos importados.

##### Ejemplo 2: Conectarse a SQL Server especificando el servidor, la base de datos y el modo DirectQuery.

![Conectar SQL Server Power BI Desktop- Conexión-Modo DirectQuery](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-DirectQuery.png)

Imagen 7. Conectar SQL Server especificando el servidor, la base de datos y el modo de conexión DirectQuery

En este caso se mostrará directamente la lista de objetos de la base de datos especificada.

![Conectar SQL Server Power BI Desktop- Navegador](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Navegador-BD.png)

Imagen 8. Ventana Navegador con las tablas, vistas y funciones de la base de datos seleccionada.

Seleccione los objetos de la base de datos y realice las trasformaciones necesarias en el Editor de consultas. Oprima Cerrar y aplicar. En el modelo cambie a la vista de datos.

![Conectar SQL Server Power BI Desktop- Vista de datos-Modo DirectQuery](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Vista-Datos-Modo-DirectQuery.png)

Imagen 9. Vista de los datos.

Los datos no se muestran en el modelo. Esto se debe a que el modo de conexión elegido fue DirectQuery.

#### Opciones avanzadas

Para ver el resto de las opciones que puede configurar al conectarse a SQL Server se requiere desplegar el menú Opciones avanzadas:

![dataXbi-Conectarse a SQL Server-Power-BI-Desktop](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop.png)

Imagen 10. Opciones avanzadas de la ventana Base de datos SQL Server.

##### Opción tiempo de espera del comando en minutos:

Tiempo que demora ejecutándose la consulta sin generar un error de tiempo de expiración. Es opcional y de tipo numérico.

##### Opción instrucción SQL:

Consulta SQL nativa. Es opcional y de tipo texto. Requiere haber especificado la base de datos.

Ejemplo de instrucción SQL

![dataXbi-Conectarse a SQL Server-Consulta-Tabla-Combinada](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Tabla-Combinada.png)

Imagen 11. Opciones avanzadas: Instrucción SQL.

Power Query puede requierir su consentimiento para ejecutar este tipo de consulta, como se muestra en la siguiente imagen.

![Conectar SQL Server-Consulta-datos-nativa](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Consulta-datos-nativa.png)

Imagen 12. Solicitud de permiso para ejecutar consulta nativa.

Una vez ejecutada la instrucción SQL, se mostrará el resultado en el Editor de consultas. No se mostrará la ventana Navegador.

##### Opción incluir columnas de relación:

Si la opción está habilitada al seleccionar una tabla en el panel de navegación se incluirán columnas expandibles por cada tabla con la que esté relacionada en la base de datos. Se podrá expandir las columnas para añadir nuevos campos a la consulta. Está opción está habilitada por defecto.

![dataXbi-Conectarse a SQL Server-Incluir-columnas-relacionadas](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Consulta-Incluir-columnas-relacionadas.png)

Imagen 13. Opción Incluir columnas de relación.

##### Opción navegar usando la jerarquía completa:

Si la opción está habilitada el resultado es una tabla con los esquemas disponibles. Para seleccionar un origen de datos primero hay que escoger el esquema al que pertenece.

![dataXbi-Conectarse a SQL Server-Hierarchical-Navigation](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Consulta-Hierarchical-Navigation.png)

Imagen 14. Opción Navegar usando la jerarquía completa habilitada.

Si está deshabilitada el resultado es una tabla con todos los orígenes disponibles en la base de datos (tablas, vistas y funciones).

![dataXbi-Conectarse a SQL Server-Hierarchical-Navigation-False](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Funcion-SqlDatabase.png)

Imagen 15. Opción Navegar usando la jerarquía completa deshabilitada.

Por defecto está deshabilitada.

##### Opción habilitar la compatibilidad con la conmutación por error de SQL Server:

Determina el valor de la propiedad MultiSubnetFailover de la cadena de conexión. Si la opción está habilitada y se está tratando de conectar a un grupo de disponibilidad AlwaysOn (AG) en subredes diferentes le proporciona una detección más rápida de una conexión al servidor activo.

Por defecto está deshabilitada.

A partir de aquí solo queda oprimir Aceptar o Editar para que Power Query se conecte a los datos y muestre una vista previa de mil registros en el Editor de consulta donde se podrán realizar todas las transformaciones requeridas.

#### Funciones M para conectarse a SQL Server

Todas las transformaciones que se realizan en el editor de consulta, incluido conectarse a los orígenes de datos, se traducen en fórmulas del lenguaje M, como se vió en la entrada [Transformar datos con Power Query](https://www.dataxbi.com/blog/2018/11/06/transformar-datos-power-query/). Para conectarse a los datos se utilizan las funciones de la categoría â€œ[Accessing data functions](https://docs.microsoft.com/es-es/powerquery-m/accessing-data-functions)â€. Estas funciones se conectan a los datos y devuelven una tabla de valores que se llama tabla de navegación. Una tabla de navegación, generalmente, es una tabla de dos columnas. La primera columna contiene el nombre de cada elemento y la segunda columna contiene el valor correspondiente a cada elemento. Un ejemplo de tabla de navegación es el que se muestra en las dos imágenes anteriores.

Dentro de la categoría Accessing data functions existen dos funciones que puede utilizar para conectarse a SQL Server:

- Función Sql.Database: Es la que se utiliza cuando se especifica el nombre de la base de datos y devuelve una tabla con las tablas, vistas y funciones de la base de datos del servidor SQL Server especificado. Corresponde con el ejemplo 2 de conexión a SQL Server.
![Conectar SQL Server-Editor avanzado SqlDatabase](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Editor-avanzado-SqlDatabase-1.png)

Imagen 16. Editor avanzado Ejemplo 2.

- Función Sql.Databases: Es la que se utiliza cuando no se especifica la base de datos y devuelve una tabla con las bases de datos existentes en el servidor SQL Server especificado. Corresponde con el ejemplo 1 de conexión a SQL Server.
![Conectar SQL Server-Editor avanzado SqlDatabases](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Editor-avanzado-SqlDatabases-1.png)

Imagen 17. Editor avanzado Ejemplo 1.

##### Sintaxis de la función Sql.Database

```
Sql.Database(**server** as text, **database** as text, optional **options** as nullable record) as table
```

##### Sintaxis de la función Sql.Databases

```
Sql.Databases(**server** as text, optional **options** as nullable record) as table

```

donde:

###### server:

Valor de tipo texto que representa el nombre de la instancia de SQL Server. Esta opción es común a las dos funciones y en ambas es obligatorio asignarle un valor. Corresponde con la opción Servidor de la ventana Base de datos SQL Server.

###### database:

Valor de tipo texto que contiene el nombre de la base de datos en la instancia de SQL Server. Esta opción corresponde a la función Sql.Database y es obligatorio asignarle un valor. Corresponde con la opción Base de datos de la ventana Base de datos SQL Server.

###### options:

Conjunto de opciones de configuración. Todas son opcionales.

Sintaxis para especificar las opciones:

```
[opción1 = valor1, opción2 = valor2 ...]

```

Opción Query:

Una consulta SQL nativa utilizada para recuperar datos. Si la consulta produce múltiples conjuntos de resultados, solo se devolverá el primero. La opción corresponde a la función SQL.Database. La función SQL.Databases no admite la configuración de una consulta SQL para que se ejecute en el servidor, en su lugar debe utilizarse la función Sql.Database. Corresponde con la opción avanzada Instrucción SQL de la ventana Base de datos SQL Server.

Ejemplo:

```
Sql.Database(".", "AdventureWorksDW2017", [Query="SELECT * FROM DimCustomer"])
```

La consulta devuelve la tabla DimCustomer de la base de datos AdventureWorksDW2017 del servidor local.

Opción CreateNavigationProperties:

Valor lógico (verdadero / falso) que establece si se añadirán o no las columnas de las tablas relacionadas. Corresponde con la opción Incluir columnas de relación de la ventana Base de datos SQL Server. Por defecto su valor es verdadero.

Ejemplo:

```
Sql.Database(".", "AdventureWorksDW2017", [Query="SELECT * FROM VwCustomer", CreateNavigationProperties=false])
```

  
  
Opción NavigationPropertyNameGenerator:

función que se utiliza para la creación de nombres para las columnas de navegación.

Ejemplo:

```
Sql.Database("localhost", "AdventureWorksDW2017", [NavigationPropertyNameGenerator=Funcion_Origen_Destino])
```

  
  
Opción MaxDegreeOfParallelism:

Número entero que establece el valor de la cláusula de consulta "maxdop" en la consulta SQL generada. Permite indicar el número de procesadores que utilizará

Ejemplo:

```
Sql.Database("localhost", "AdventureWorksDW2017", [MaxDegreeOfParallelism=2])
```

  
  
Opción CommandTimeout:

Tiempo durante el cual se ejecuta la consulta en el servidor antes de que se cancele. El valor predeterminado es de diez minutos. Corresponde con la opción Tiempo de espera del servidor en minutos de la ventana Base de datos SQL Server.

Opción ConnectionTimeout:

Tiempo de espera para establecer una conexión con el servidor. El valor predeterminado es dependiente del conductor.

Opción HierarchicalNavigation:

Valor lógico (verdadero / falso) que establece si ver las tablas agrupadas por sus nombres de esquema (el valor predeterminado es falso). Corresponde con la opción Navegar usando la jerarquía completa de la ventana Base de datos SQL Server.

Ejemplo:

```
Sql.Database("localhost", "AdventureWorksDW2017", [HierarchicalNavigation=true])
```

  
  
Opción MultiSubnetFailover:

Valor lógico (verdadero / falso) que establece el valor de la propiedad "MultiSubnetFailover" en la cadena de conexión (el valor predeterminado es falso). Corresponde con la opción Habilitar la compatibilidad con la conmutación por error de SQL Server de la ventana Base de datos SQL Server.

  
  

### Conectarse a SQL Server desde Excel 2016

Para conectarse a SQL Server desde Excel 2016, el cuadro de diálogo que se muestra y las opciones del mismo no varían respecto a Power BI Desktop.

![dataXbi-Conectarse a SQL Server-Excel](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Excel2.png)

Imagen 18. Conectarse a SQL Server desde Excel 2016.

Todo lo que se ha visto hasta ahora para Power BI Desktop es válido también para Excel 2016.

  

#### Orígenes de datos de SQL Server

Al conectarse a una base de datos SQL Server los datos pueden provenir de tablas, vistas, funciones, consultas nativas incluyendo llamados a procedimientos almacenados. A continuación, se analizará como conectarse a cada uno de estos orígenes.

#### Conectarse a una tabla, vista o función

Si los datos están en tablas, vistas o funciones se pueden seleccionar directamente en el navegador. Al cerrar el cuadro de diálogo Base de datos SQL Server, si no se ha escrito una consulta nativa en las opciones avanzadas, se abre el panel de navegación para seleccionar las tablas, vistas y/o funciones a las que conectarse como se muestra en la Imagen 5.

Una vez que se ejecute la consulta se carga la muestra de datos en el Editor de consultas y dentro del panel de configuración de la consulta se mostrarán los pasos aplicados. Al hacer clic sobre el paso Navegación, con el botón derecho del mouse, se muestra el menú correspondiente al paso y dentro de sus opciones Ver consulta nativa.

![Conectar SQL Server Power-BI-Desktop Consulta Nativa Menu](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Consulta-Nativa-Menu-1.png)

Imagen 19. Opción Consulta Nativa en menú Pasos aplicados.

Si la opción está activa significa que es compatible con una consulta Transact SQL y es la consulta que ejecutará Power Query contra la base de datos. Haciendo clic en la opción se muestra la consulta.

![Conectar SQL Server-Consulta Nativa](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Consulta-Nativa-1.png)

Imagen 20. Consulta Nativa Transact SQL.

La consulta nativa es útil para el caso de consultas complejas en especial si ya existen en la base de datos y no se tienen que volver a generar en Power Query o si se necesita filtrar filas y/o columnas de un origen o combinar varios orígenes de la misma base de datos en una sola consulta. También si lo que se necesita es ejecutar un procedimiento almacenado. Las consultas nativas se escriben en el lenguaje Transact SQL y se utiliza fundamentalmente la consulta SELECT y las cláusulas FROM y WHERE.

#### Consultas a tablas, vistas o funciones

Se creará una consulta de tabla, vista o función cuando se requiera filtrar las filas y/o columnas de este origen o cuando se necesite crear nuevas columnas a partir de los valores de las columnas existentes.

##### Sintaxis:

```
SELECT <lista_campos> FROM <origen> WHERE <condición>
```

donde:

<lista\_campos> son las columnas que se quieren devolver

<origen> son las tablas, vistas y/o funciones que contienen las columnas

<condición> es el criterio que se aplicará para filtrar las filas a devolver

Un ejemplo de consulta a una tabla sería:

```
SELECT *
FROM FactInternetSales
WHERE [OrderDate] BETWEEN '2012-01-01' AND '2012-12-31'

```

Esta consulta devuelve todas las columnas de la tabla FactInternetSales y filtra las filas por la columna OrdenDate devolviendo solo las filas que correspondan al año 2012.

#### Consulta a una tabla combinada

La consulta a una tabla combinada será necesaria cuando se quiera construir una consulta a partir de los datos de dos o más tablas, vistas y/o funciones que tengan al menos un elemento en común.

Por ejemplo:

```
SELECT S.*, P.EnglishProductName
FROM FactInternetSales S LEFT OUTER JOIN
      DimProduct P ON P.ProductKey = S.ProductKey

```

En este ejemplo se están combinando las tablas FactInternetSales y DimProduct utilizando el campo ProductKey y devolviendo todas las columnas de la tabla FactInternetSales y la columna EnglishProductName de DimProduct.

Las consultas a tablas combinadas se pueden filtrar por filas y columnas.

#### Conectarse utilizando un procedimiento almacenado

Los procedimientos almacenados que devuelvan como resultado una tabla podrán usarse como orígenes de datos. El procedimiento almacenado puede tener parámetros de entrada. La consulta realizará un llamado al procedimiento almacenado.

Sintaxis:

```
[EXEC] <nombre_procedimiento_almacenado>

```

La palabra clave EXEC (EXECUTE) es opcional.

Ejemplo:

```
EXEC Get_CustomerName

```

  
  

#### Uso de los parámetros de consulta

Los parámetros de consulta son una forma eficaz de interactuar dinámicamente con los datos en Power BI.

En la consulta:

```
SELECT *
FROM FactInternetSales
WHERE [OrderDate] BETWEEN '2012-01-01' AND '2012-12-31'

```

las fechas por las que se filtra la tabla FactInternetSales son fijas. Para ver datos de otro período de tiempo se necesitará modificar la consulta lo cuál resulta inconveniente.

En lugar de usar valores fijos se pueden definir dos parámetros, uno para la fecha de inicio y otro para la fecha final y usarlos en la consulta, lo que permitirá modificar dinámicamente el intervalo de tiempo sin necesidad de modificar la consulta cambiando solamente el valor de los parámetros. Los parámetros podrán ser de tipo texto o de tipo fecha, para cada tipo la consulta será diferente la expresión en la consulta.

##### Parámetros de tipo texto

Por ejemplo, si se definen los parámetros de tipo texto FI, para la fecha inicial y FF para la fecha final y se le asignan los valores

FI = '2012-01-01' y FF = '2012-12-31'

La consulta original podrá modificarse sustituyendo los valores de fecha por los parámetros FI y FF. La consulta quedaría:

```
SELECT *
FROM FactInternetSales
WHERE [OrderDate] BETWEEN '"& FI & "' AND '"& FF& "'

```

##### Parámetros de tipo fecha

Si se definen los parámetros de tipo fecha FIni, para la fecha inicial y FFin para la fecha final y le asignamos los valores:

FIni = 01/01/2012 y FFin = 31/12/2012

La consulta original podrá modificarse sustituyendo los valores de fecha por los parámetros FIni y FFin. Se necesitará convertir el valor de cada parámetro a texto y sustituir la barra "/" por un guion "-". La consulta quedaría:

```
SELECT *
FROM FactInternetSales
WHERE [OrderDate] BETWEEN
	"&Date.ToText(FIni,"yyyy")&"-"&Date.ToText(FIni,"MM")&"-"&Date.ToText(FIni,"dd")&"'
	AND
	'"&Date.ToText(FFin,"yyyy")&"-"&Date.ToText(FFin,"MM")&"-"&Date.ToText(FFin,"dd")&"'

```

Usando cualquiera de las dos consultas resultantes y variando el valor de los parámetros elegidos, podrán filtrarse los datos para distintos rangos de fecha sin necesidad de modificar la consulta.

### Conclusiones

Puede conectarse a SQL Server de forma sencilla especificando solamente el nombre del servidor, el nombre de la base de datos y el modo en que se almacenarán los datos y luego elegir en el navegador los orígenes a los que conectarse (tablas, vistas y funciones) o escribir una consulta nativa a una tabla combinada o una llamada a un procedimiento almacenado que devuelva como resultado una tabla. Use parámetros para reducir el número de filas devueltas a los que podrá modificarse su valor sin necesidad de modificar la consulta.

El archivo PIBX con los ejemplos está disponible en [GitHub](https://github.com/dataxbi/power-query).
