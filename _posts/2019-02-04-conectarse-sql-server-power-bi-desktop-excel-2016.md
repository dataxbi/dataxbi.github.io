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

En una [entrada anterior](https://www.dataxbi.com/blog/2018/10/23/conectarse-origenes-datos-power-bi-desktop-excel-2016/) se estudiaron los distintos or�genes de datos a los que es posible conectarse desde Power Query y las categor�as en que se agrupaban: Archivo, Base de datos, Power BI, Azure, Servicios en l�nea y Otros. La categor�a Base de datos proporciona conexi�n a un amplio conjunto de bases de datos, entre las que se encuentran Oracle, MySQL, Access, SQL Server, etc. En esa misma entrada se vieron ejemplos de como conectarse a las bases de datos MySQL y Microsoft Access. En la entrada de hoy se analizar� como conectarse a SQL Server desde Power BI Desktop y Excel 2016.

<!--more-->

### Conectarse a SQL Server desde Power BI Desktop

Si en Power BI Desktop, se selecciona la opci�n Obtener datos|SQL Server de la pesta�a Inicio se muestra el cuadro de di�logo Base de datos SQL Server:

![dataXbi-Conectarse a SQL Server-Servidor](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Servidor.png)

Imagen 1. Cuadro de di�logo Base de datos SQL Server

donde adem�s de escribir el nombre del servidor y la base de datos, se deber� elegir el modo de conectarse al origen y configurar las opciones avanzadas para controlar la conexi�n.

A continuaci�n se analizan las opciones de esta ventana y se muestran algunos ejemplos de conexi�n.

#### Opci�n Servidor:

Es un campo obligatorio, de tipo texto, donde se escribir� el nombre de la instancia de SQL Server a la que se quiere conectar. Adem�s del nombre de la instancia, puede especificarse el n�mero del puerto por el que se acceder�.

Ejemplos:

- localhost (instancia local)
- . (instancia local)
- 192.168.1.3 (direcci�n ip del servidor)
- Servidor1 (nombre del servidor)
- Servidor1:1433 (nombre y puerto del servidor)

#### Opci�n Base de datos:

Es un campo opcional, de tipo texto, que almacenar� el nombre de la base de datos a la que se quiere conectar.

Ejemplos:

- [AdventureWorks2017](https://docs.microsoft.com/es-es/sql/samples/adventureworks-install-configure?view=sql-server-2017) (Base de datos de ejemplo de Microsoft)
- [AdventureWorksDW2017](https://docs.microsoft.com/es-es/sql/samples/adventureworks-install-configure?view=sql-server-2017) (Almac�n de datos de ejemplo de Microsoft)

#### Opci�n Modo conectividad de datos:

Son dos botones de opciones que permiten elegir el modo predeterminado de conectarse al origen. Por defecto, el bot�n seleccionado es Importar.

##### El modo Importar:

Si se elige esta opci�n se importa una copia de los datos seleccionados al modelo. Esto tiene como consecuencia que el modelo no est� actualizado y que requerir� actualizarlo cuando existan modificaciones de los datos subyacentes desde la �ltima carga realizada.

##### El modo DirectQuery:

AL elegir esta opci�n no se importan ni copian datos sino que se conecta directamente al origen de datos. Cuando se crea o se interactua con una visualizaci�n se consultar� el origen de datos subyacente, lo que significa que los datos siempre estar�n actualizados.

  

#### Ejemplos de conexi�n a SQL Server

##### Ejemplo 1: Conectarse a SQL Server especificando solamente el nombre del servidor y el modo Importar para la conexi�n.

![Conectar SQL Server Power BI Desktop-Servidor](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop2.png)

Imagen 2. Conectar SQL Server especificando el servidor y el modo de conexi�n

Si esta es la primera vez que va a conectarse a este servidor, al oprimir el bot�n Aceptar ver� la siguiente ventana para seleccionar el modo de autenticaci�n para conectarse a la base de datos y especificar sus credenciales.

![Conectar SQL Server-Credenciales](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Credenciales.png)

Imagen 3. Ventana para especificar las credenciales con las que se conectar� al servidor.

Al oprimir el bot�n Conectar, si no se usa una conexi�n cifrada con SQL Server, Power Query solicitar� establecer una conexi�n no cifrada.

![Conectar SQL Server--Compatibilidad de cifrado](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Compatibilidad-de-cifrado.png)

Imagen 4. Ventana Compatibilidad de cifrado.

Haga clic en Aceptar para conectarse utilizando una conexi�n no cifrada.

Si se pudo establecer la conexi�n se muestra la ventana Navegador con el listado de las bases de datos del servidor. Debe seleccionar una y desplegar su men� para escoger entre los objetos que contiene, tablas, vistas y funciones, aquellos a los que desea conectarse.

![Conectar SQL Server Power BI Desktop Tablas. Vistas y Funciones](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Tablas-Vistas-Funciones2.png)

Imagen 5. Ventana Navegador con la lista de bases de datos del servidor y sus tablas, vistas y funciones.

Se puede identificar f�cilmente a que tipo de objeto corresponde cada origen por el icono que lo representa. Primero se muestran las vistas, que en este caso es una, luego las tablas, que son cuatro y por �ltimo las funciones, que tambi�n es una. Por cada elemento seleccionado se crear� una nueva consulta en Power Query.

Si despu�s de seleccionar los or�genes de datos se oprime el bot�n Cargar, que es la opci�n por defecto, las tablas se importar�n directamente en el modelo sin realizar ninguna transformaci�n previamente.

En lugar de Cargar, lo aconsejable es oprimir el bot�n Editar para hacer todas las transformaciones necesarias en el Editor de consulta y luego cargar los datos seleccionados al modelo. Solamente en el caso de que est� seguro de que los datos est�n limpios, con el formato apropiado y que son necesarios en su totalidad har� la carga directamente, en otro caso siempre es mejor editar.

Si se cargan los datos en el modelo una vez transformados, se podr� ver una vista con los datos importados.

![Conectar SQL Server Power BI Desktop- Vista de Datos-Modo Importar](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Vista-Datos-Modo-Importar.png)

Imagen 6. Vista de los datos importados.

##### Ejemplo 2: Conectarse a SQL Server especificando el servidor, la base de datos y el modo DirectQuery.

![Conectar SQL Server Power BI Desktop- Conexi�n-Modo DirectQuery](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-DirectQuery.png)

Imagen 7. Conectar SQL Server especificando el servidor, la base de datos y el modo de conexi�n DirectQuery

En este caso se mostrar� directamente la lista de objetos de la base de datos especificada.

![Conectar SQL Server Power BI Desktop- Navegador](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Navegador-BD.png)

Imagen 8. Ventana Navegador con las tablas, vistas y funciones de la base de datos seleccionada.

Seleccione los objetos de la base de datos y realice las trasformaciones necesarias en el Editor de consultas. Oprima Cerrar y aplicar. En el modelo cambie a la vista de datos.

![Conectar SQL Server Power BI Desktop- Vista de datos-Modo DirectQuery](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Vista-Datos-Modo-DirectQuery.png)

Imagen 9. Vista de los datos.

Los datos no se muestran en el modelo. Esto se debe a que el modo de conexi�n elegido fue DirectQuery.

#### Opciones avanzadas

Para ver el resto de las opciones que puede configurar al conectarse a SQL Server se requiere desplegar el men� Opciones avanzadas:

![dataXbi-Conectarse a SQL Server-Power-BI-Desktop](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop.png)

Imagen 10. Opciones avanzadas de la ventana Base de datos SQL Server.

##### Opci�n tiempo de espera del comando en minutos:

Tiempo que demora ejecut�ndose la consulta sin generar un error de tiempo de expiraci�n. Es opcional y de tipo num�rico.

##### Opci�n instrucci�n SQL:

Consulta SQL nativa. Es opcional y de tipo texto. Requiere haber especificado la base de datos.

Ejemplo de instrucci�n SQL

![dataXbi-Conectarse a SQL Server-Consulta-Tabla-Combinada](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Tabla-Combinada.png)

Imagen 11. Opciones avanzadas: Instrucci�n SQL.

Power Query puede requierir su consentimiento para ejecutar este tipo de consulta, como se muestra en la siguiente imagen.

![Conectar SQL Server-Consulta-datos-nativa](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Consulta-datos-nativa.png)

Imagen 12. Solicitud de permiso para ejecutar consulta nativa.

Una vez ejecutada la instrucci�n SQL, se mostrar� el resultado en el Editor de consultas. No se mostrar� la ventana Navegador.

##### Opci�n incluir columnas de relaci�n:

Si la opci�n est� habilitada al seleccionar una tabla en el panel de navegaci�n se incluir�n columnas expandibles por cada tabla con la que est� relacionada en la base de datos. Se podr� expandir las columnas para a�adir nuevos campos a la consulta. Est� opci�n est� habilitada por defecto.

![dataXbi-Conectarse a SQL Server-Incluir-columnas-relacionadas](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Consulta-Incluir-columnas-relacionadas.png)

Imagen 13. Opci�n Incluir columnas de relaci�n.

##### Opci�n navegar usando la jerarqu�a completa:

Si la opci�n est� habilitada el resultado es una tabla con los esquemas disponibles. Para seleccionar un origen de datos primero hay que escoger el esquema al que pertenece.

![dataXbi-Conectarse a SQL Server-Hierarchical-Navigation](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Consulta-Hierarchical-Navigation.png)

Imagen 14. Opci�n Navegar usando la jerarqu�a completa habilitada.

Si est� deshabilitada el resultado es una tabla con todos los or�genes disponibles en la base de datos (tablas, vistas y funciones).

![dataXbi-Conectarse a SQL Server-Hierarchical-Navigation-False](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Funcion-SqlDatabase.png)

Imagen 15. Opci�n Navegar usando la jerarqu�a completa deshabilitada.

Por defecto est� deshabilitada.

##### Opci�n habilitar la compatibilidad con la conmutaci�n por error de SQL Server:

Determina el valor de la propiedad MultiSubnetFailover de la cadena de conexi�n. Si la opci�n est� habilitada y se est� tratando de conectar a un grupo de disponibilidad AlwaysOn (AG) en subredes diferentes le proporciona una detecci�n m�s r�pida de una conexi�n al servidor activo.

Por defecto est� deshabilitada.

A partir de aqu� solo queda oprimir Aceptar o Editar para que Power Query se conecte a los datos y muestre una vista previa de mil registros en el Editor de consulta donde se podr�n realizar todas las transformaciones requeridas.

#### Funciones M para conectarse a SQL Server

Todas las transformaciones que se realizan en el editor de consulta, incluido conectarse a los or�genes de datos, se traducen en f�rmulas del lenguaje M, como se vi� en la entrada [Transformar datos con Power Query](https://www.dataxbi.com/blog/2018/11/06/transformar-datos-power-query/). Para conectarse a los datos se utilizan las funciones de la categor�a “[Accessing data functions](https://docs.microsoft.com/es-es/powerquery-m/accessing-data-functions)”. Estas funciones se conectan a los datos y devuelven una tabla de valores que se llama tabla de navegaci�n. Una tabla de navegaci�n, generalmente, es una tabla de dos columnas. La primera columna contiene el nombre de cada elemento y la segunda columna contiene el valor correspondiente a cada elemento. Un ejemplo de tabla de navegaci�n es el que se muestra en las dos im�genes anteriores.

Dentro de la categor�a Accessing data functions existen dos funciones que puede utilizar para conectarse a SQL Server:

- Funci�n Sql.Database: Es la que se utiliza cuando se especifica el nombre de la base de datos y devuelve una tabla con las tablas, vistas y funciones de la base de datos del servidor SQL Server especificado. Corresponde con el ejemplo 2 de conexi�n a SQL Server.
![Conectar SQL Server-Editor avanzado SqlDatabase](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Editor-avanzado-SqlDatabase-1.png)

Imagen 16. Editor avanzado Ejemplo 2.

- Funci�n Sql.Databases: Es la que se utiliza cuando no se especifica la base de datos y devuelve una tabla con las bases de datos existentes en el servidor SQL Server especificado. Corresponde con el ejemplo 1 de conexi�n a SQL Server.
![Conectar SQL Server-Editor avanzado SqlDatabases](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Editor-avanzado-SqlDatabases-1.png)

Imagen 17. Editor avanzado Ejemplo 1.

##### Sintaxis de la funci�n Sql.Database

```
Sql.Database(**server** as text, **database** as text, optional **options** as nullable record) as table
```

##### Sintaxis de la funci�n Sql.Databases

```
Sql.Databases(**server** as text, optional **options** as nullable record) as table

```

donde:

###### server:

Valor de tipo texto que representa el nombre de la instancia de SQL Server. Esta opci�n es com�n a las dos funciones y en ambas es obligatorio asignarle un valor. Corresponde con la opci�n Servidor de la ventana Base de datos SQL Server.

###### database:

Valor de tipo texto que contiene el nombre de la base de datos en la instancia de SQL Server. Esta opci�n corresponde a la funci�n Sql.Database y es obligatorio asignarle un valor. Corresponde con la opci�n Base de datos de la ventana Base de datos SQL Server.

###### options:

Conjunto de opciones de configuraci�n. Todas son opcionales.

Sintaxis para especificar las opciones:

```
[opci�n1 = valor1, opci�n2 = valor2 ...]

```

Opci�n Query:

Una consulta SQL nativa utilizada para recuperar datos. Si la consulta produce m�ltiples conjuntos de resultados, solo se devolver� el primero. La opci�n corresponde a la funci�n SQL.Database. La funci�n SQL.Databases no admite la configuraci�n de una consulta SQL para que se ejecute en el servidor, en su lugar debe utilizarse la funci�n Sql.Database. Corresponde con la opci�n avanzada Instrucci�n SQL de la ventana Base de datos SQL Server.

Ejemplo:

```
Sql.Database(".", "AdventureWorksDW2017", [Query="SELECT * FROM DimCustomer"])
```

La consulta devuelve la tabla DimCustomer de la base de datos AdventureWorksDW2017 del servidor local.

Opci�n CreateNavigationProperties:

Valor l�gico (verdadero / falso) que establece si se a�adir�n o no las columnas de las tablas relacionadas. Corresponde con la opci�n Incluir columnas de relaci�n de la ventana Base de datos SQL Server. Por defecto su valor es verdadero.

Ejemplo:

```
Sql.Database(".", "AdventureWorksDW2017", [Query="SELECT * FROM VwCustomer", CreateNavigationProperties=false])
```

  
  
Opci�n NavigationPropertyNameGenerator:

funci�n que se utiliza para la creaci�n de nombres para las columnas de navegaci�n.

Ejemplo:

```
Sql.Database("localhost", "AdventureWorksDW2017", [NavigationPropertyNameGenerator=Funcion_Origen_Destino])
```

  
  
Opci�n MaxDegreeOfParallelism:

N�mero entero que establece el valor de la cl�usula de consulta "maxdop" en la consulta SQL generada. Permite indicar el n�mero de procesadores que utilizar�

Ejemplo:

```
Sql.Database("localhost", "AdventureWorksDW2017", [MaxDegreeOfParallelism=2])
```

  
  
Opci�n CommandTimeout:

Tiempo durante el cual se ejecuta la consulta en el servidor antes de que se cancele. El valor predeterminado es de diez minutos. Corresponde con la opci�n Tiempo de espera del servidor en minutos de la ventana Base de datos SQL Server.

Opci�n ConnectionTimeout:

Tiempo de espera para establecer una conexi�n con el servidor. El valor predeterminado es dependiente del conductor.

Opci�n HierarchicalNavigation:

Valor l�gico (verdadero / falso) que establece si ver las tablas agrupadas por sus nombres de esquema (el valor predeterminado es falso). Corresponde con la opci�n Navegar usando la jerarqu�a completa de la ventana Base de datos SQL Server.

Ejemplo:

```
Sql.Database("localhost", "AdventureWorksDW2017", [HierarchicalNavigation=true])
```

  
  
Opci�n MultiSubnetFailover:

Valor l�gico (verdadero / falso) que establece el valor de la propiedad "MultiSubnetFailover" en la cadena de conexi�n (el valor predeterminado es falso). Corresponde con la opci�n Habilitar la compatibilidad con la conmutaci�n por error de SQL Server de la ventana Base de datos SQL Server.

  
  

### Conectarse a SQL Server desde Excel 2016

Para conectarse a SQL Server desde Excel 2016, el cuadro de di�logo que se muestra y las opciones del mismo no var�an respecto a Power BI Desktop.

![dataXbi-Conectarse a SQL Server-Excel](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Excel2.png)

Imagen 18. Conectarse a SQL Server desde Excel 2016.

Todo lo que se ha visto hasta ahora para Power BI Desktop es v�lido tambi�n para Excel 2016.

  

#### Or�genes de datos de SQL Server

Al conectarse a una base de datos SQL Server los datos pueden provenir de tablas, vistas, funciones, consultas nativas incluyendo llamados a procedimientos almacenados. A continuaci�n, se analizar� como conectarse a cada uno de estos or�genes.

#### Conectarse a una tabla, vista o funci�n

Si los datos est�n en tablas, vistas o funciones se pueden seleccionar directamente en el navegador. Al cerrar el cuadro de di�logo Base de datos SQL Server, si no se ha escrito una consulta nativa en las opciones avanzadas, se abre el panel de navegaci�n para seleccionar las tablas, vistas y/o funciones a las que conectarse como se muestra en la Imagen 5.

Una vez que se ejecute la consulta se carga la muestra de datos en el Editor de consultas y dentro del panel de configuraci�n de la consulta se mostrar�n los pasos aplicados. Al hacer clic sobre el paso Navegaci�n, con el bot�n derecho del mouse, se muestra el men� correspondiente al paso y dentro de sus opciones Ver consulta nativa.

![Conectar SQL Server Power-BI-Desktop Consulta Nativa Menu](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Consulta-Nativa-Menu-1.png)

Imagen 19. Opci�n Consulta Nativa en men� Pasos aplicados.

Si la opci�n est� activa significa que es compatible con una consulta Transact SQL y es la consulta que ejecutar� Power Query contra la base de datos. Haciendo clic en la opci�n se muestra la consulta.

![Conectar SQL Server-Consulta Nativa](/assets/images/posts/2019-02-04-conectarse-sql-server-power-bi-desktop-excel-2016/dataXbi-Conectar-SQL-Server-Power-BI-Desktop-Consulta-Nativa-1.png)

Imagen 20. Consulta Nativa Transact SQL.

La consulta nativa es �til para el caso de consultas complejas en especial si ya existen en la base de datos y no se tienen que volver a generar en Power Query o si se necesita filtrar filas y/o columnas de un origen o combinar varios or�genes de la misma base de datos en una sola consulta. Tambi�n si lo que se necesita es ejecutar un procedimiento almacenado. Las consultas nativas se escriben en el lenguaje Transact SQL y se utiliza fundamentalmente la consulta SELECT y las cl�usulas FROM y WHERE.

#### Consultas a tablas, vistas o funciones

Se crear� una consulta de tabla, vista o funci�n cuando se requiera filtrar las filas y/o columnas de este origen o cuando se necesite crear nuevas columnas a partir de los valores de las columnas existentes.

##### Sintaxis:

```
SELECT <lista_campos> FROM <origen> WHERE <condici�n>
```

donde:

<lista\_campos> son las columnas que se quieren devolver

<origen> son las tablas, vistas y/o funciones que contienen las columnas

<condici�n> es el criterio que se aplicar� para filtrar las filas a devolver

Un ejemplo de consulta a una tabla ser�a:

```
SELECT *
FROM FactInternetSales
WHERE [OrderDate] BETWEEN '2012-01-01' AND '2012-12-31'

```

Esta consulta devuelve todas las columnas de la tabla FactInternetSales y filtra las filas por la columna OrdenDate devolviendo solo las filas que correspondan al a�o 2012.

#### Consulta a una tabla combinada

La consulta a una tabla combinada ser� necesaria cuando se quiera construir una consulta a partir de los datos de dos o m�s tablas, vistas y/o funciones que tengan al menos un elemento en com�n.

Por ejemplo:

```
SELECT S.*, P.EnglishProductName
FROM FactInternetSales S LEFT OUTER JOIN
      DimProduct P ON P.ProductKey = S.ProductKey

```

En este ejemplo se est�n combinando las tablas FactInternetSales y DimProduct utilizando el campo ProductKey y devolviendo todas las columnas de la tabla FactInternetSales y la columna EnglishProductName de DimProduct.

Las consultas a tablas combinadas se pueden filtrar por filas y columnas.

#### Conectarse utilizando un procedimiento almacenado

Los procedimientos almacenados que devuelvan como resultado una tabla podr�n usarse como or�genes de datos. El procedimiento almacenado puede tener par�metros de entrada. La consulta realizar� un llamado al procedimiento almacenado.

Sintaxis:

```
[EXEC] <nombre_procedimiento_almacenado>

```

La palabra clave EXEC (EXECUTE) es opcional.

Ejemplo:

```
EXEC Get_CustomerName

```

  
  

#### Uso de los par�metros de consulta

Los par�metros de consulta son una forma eficaz de interactuar din�micamente con los datos en Power BI.

En la consulta:

```
SELECT *
FROM FactInternetSales
WHERE [OrderDate] BETWEEN '2012-01-01' AND '2012-12-31'

```

las fechas por las que se filtra la tabla FactInternetSales son fijas. Para ver datos de otro per�odo de tiempo se necesitar� modificar la consulta lo cu�l resulta inconveniente.

En lugar de usar valores fijos se pueden definir dos par�metros, uno para la fecha de inicio y otro para la fecha final y usarlos en la consulta, lo que permitir� modificar din�micamente el intervalo de tiempo sin necesidad de modificar la consulta cambiando solamente el valor de los par�metros. Los par�metros podr�n ser de tipo texto o de tipo fecha, para cada tipo la consulta ser� diferente la expresi�n en la consulta.

##### Par�metros de tipo texto

Por ejemplo, si se definen los par�metros de tipo texto FI, para la fecha inicial y FF para la fecha final y se le asignan los valores

FI = '2012-01-01' y FF = '2012-12-31'

La consulta original podr� modificarse sustituyendo los valores de fecha por los par�metros FI y FF. La consulta quedar�a:

```
SELECT *
FROM FactInternetSales
WHERE [OrderDate] BETWEEN '"& FI & "' AND '"& FF& "'

```

##### Par�metros de tipo fecha

Si se definen los par�metros de tipo fecha FIni, para la fecha inicial y FFin para la fecha final y le asignamos los valores:

FIni = 01/01/2012 y FFin = 31/12/2012

La consulta original podr� modificarse sustituyendo los valores de fecha por los par�metros FIni y FFin. Se necesitar� convertir el valor de cada par�metro a texto y sustituir la barra "/" por un guion "-". La consulta quedar�a:

```
SELECT *
FROM FactInternetSales
WHERE [OrderDate] BETWEEN
	"&Date.ToText(FIni,"yyyy")&"-"&Date.ToText(FIni,"MM")&"-"&Date.ToText(FIni,"dd")&"'
	AND
	'"&Date.ToText(FFin,"yyyy")&"-"&Date.ToText(FFin,"MM")&"-"&Date.ToText(FFin,"dd")&"'

```

Usando cualquiera de las dos consultas resultantes y variando el valor de los par�metros elegidos, podr�n filtrarse los datos para distintos rangos de fecha sin necesidad de modificar la consulta.

### Conclusiones

Puede conectarse a SQL Server de forma sencilla especificando solamente el nombre del servidor, el nombre de la base de datos y el modo en que se almacenar�n los datos y luego elegir en el navegador los or�genes a los que conectarse (tablas, vistas y funciones) o escribir una consulta nativa a una tabla combinada o una llamada a un procedimiento almacenado que devuelva como resultado una tabla. Use par�metros para reducir el n�mero de filas devueltas a los que podr� modificarse su valor sin necesidad de modificar la consulta.

El archivo PIBX con los ejemplos est� disponible en [GitHub](https://github.com/dataxbi/power-query).
