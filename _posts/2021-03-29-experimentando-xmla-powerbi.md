---
layout: post
title: "Experimentando con XMLA en Power BI"
date: 2021-03-29
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "python"
  - "xmla"
---

En esta entrada resumo algunos experimentos que he hecho accediendo al punto XMLA de Power BI, ya sea para explorar o modificar la estructura del modelo de datos, o para ejecutar consultas DAX. Primero hablo de c�mo he utilizado la biblioteca TOM desde Python y despu�s de c�mo he utilizado la biblioteca ADOMD.NET desde .NET. En ambos casos el c�digo est� disponible en GitHub.

<!--more-->

## ¿Qu� es XMLA?

XMLA es un protocolo de comunicaci�n que permite la conexi�n de aplicaciones al motor de Analysis Services, que es el mismo que utiliza Power BI. En la [documentaci�n de Microsoft](https://docs.microsoft.com/es-es/power-bi/admin/service-premium-connect-tools) est� todo muy bien explicado, por lo que ser� breve.

La conexi�n con XMLA esta disponible en:

- Power BI Premium por capacidad
- Power BI Premium por Usuario (PPU)
- Power BI Desktop

Hay varias herramientas que utilizan XMLA, como por ejemplo, SQL Server Management Studio, DAX Studio, Tabular Editor. Pero en esta entrada hablar� de c�mo conectarte desde tu propia herramienta.

Hay dos bibliotecas .NET que se pueden utilizar para implementar una aplicaci�n o un script que se conecte a Power BI con XMLA:

- [TOM (Tabular Object Model)](https://docs.microsoft.com/es-es/analysis-services/tom/introduction-to-the-tabular-object-model-tom-in-analysis-services-amo) con la que podemos leer o modificar la estructura del modelo tabular de Power BI, por ejemplo, tablas, columnas y medidas.
- [ADOMD.NET](https://docs.microsoft.com/es-es/analysis-services/adomd/multidimensional-models-adomd-net-client/retrieving-data-from-an-analytical-data-source) con la que podemos ejecutar consultas DAX para extraer los datos del modelo de Power BI.

Tambi�n hay unos [cmdlets de PowerShell](https://docs.microsoft.com/es-es/analysis-services/powershell/analysis-services-powershell-reference) que se pueden utilizar para hacer scripts.

## Experimentando con TOM y Python

Mi inspiraci�n para estos experimentos es una [serie de blogs](https://dataveld.com/2020/07/21/python-as-an-external-tool-in-power-bi-desktop-part-2-create-a-pbitool-json-file/) de David Eldersveld sobre el uso de Python como una [herramienta externa](https://www.dataxbi.com/blog/2020/09/15/herramientas-externas-powerbi-desktop/) de Power BI. La clave est� en utilizar la biblioteca Python [pythonnet](https://github.com/pythonnet/pythonnet) que permite importar una biblioteca .NET y acceder a sus objetos desde Python.

Me he concentrado en usar la biblioteca TOM para explorar o modificar el modelo de datos de Power BI.

Utilizo la distribuci�n est�ndar de Python (CPython) y Visual Studio Code, en lugar de Anaconda. He creado un entorno virtual en Python donde he instalado pythonnet, pandas y otras bibliotecas. Tambi�n he creado un archivo JSON para configurar VS Code como una herramienta externa de Power BI. Y he creado un notebook Jupyter para hacer los experimentos.

He compartido el c�digo en [GitHub](https://github.com/dataxbi/tom-python) y hay un [v�deo](https://youtu.be/Yc18TTs2y1w) de una charla donde hago toda la demostraci�n. A continuaci�n hago un res�men.

### Conexi�n desde Python

En el archivo JSON para configurar VS Code como una herramienta externa, llamo a un script PowerShell que guarda en variables del entorno el servidor/puerto y el nombre de la base de datos para conectarse al modelo de Power BI Desktop. En el c�digo Python se utilizan estas variables para formar la cadena de conexi�n, como se muestra a continuaci�n:

![Cadena de conexi�n a Power BI desde Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-cadena-conexion.jpg)

Si en lugar de conectarnos a Power BI Desktop, quisi�ramos conectarnos a un �rea de trabajo de Power BI Premium, a esta cadena de conexi�n le tendr�amos que a�adir la informaci�n de autenticaci�n, por ejemplo, usuario y contrase�a. Y adem�s en la direcci�n del servidor tendr�amos que usar algo como `powerbi://api.powerbi.com/v1.0/myorg/<nombre_area_trabajo>`.

En el siguiente bloque de c�digo se hace la carga de la biblioteca TOM en Python, con pythonnet, y en la �ltima l�nea es donde se importa y se le da el nombre de `tom`.

![Importar TOM a Python usando pythonet](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-pythonet.jpg)

Ya estamos listos para usar TOM para establecer la conexi�n con el modelo, con las dos l�neas de c�digo que se muestran abajo.

![Conexi�n al modelo de Power BI con TOM desde Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-conexion-modelo.jpg)

### Explorando el modelo

Una vez establecida la conexi�n, podemos recorrer la estructura del modelo para sacar informaci�n, siguiendo la jerarqu�a de clases de TOM. Lo primero es acceder a una base de datos y desde all� a sus tablas, columnas, etc. Al conectarnos a Power BI Desktop s�lo habr� disponible una base de datos, pero si nos conect�ramos a un �rea de trabajo de Power BI Premium, pueden existir varias bases de datos.

Por ejemplo, el siguiente fragmento de c�digo muestra un bucle donde se listan las bases de datos, las tablas y las columnas.

![Listando base de datos, tablas y columnas con TOM desde Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-tom-listar-base-datos-tablas-columnas.jpg)

Al combinar TOM con otras bibliotecas de Python podemos lograr cosas interesantes, y en el notebook que comparto en GitHub he hecho estos ejemplos:

- Utilizar la biblioteca [Rich](https://github.com/willmcgugan/rich) para mostrar la estructura del modelo en un texto formateado como un �rbol con tablas.
    
    ![Combinando TOM con Rich en Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-tom-rich.jpg)
    
- Almacenar la informaci�n de las tablas, columnas, medidas y relaciones en DataFrames pandas y crear un archivo Excel a partir de los DataFrames.
    
    ![Almacenando la estructura de un modelo Power BI en pandas DataFrame y guardando en Excel](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-tom-pandas-dataframe.jpg)
    
- Utilizar las bibliotecas [ReportLab](https://www.reportlab.com/dev/install/open_source_installation/) y [ERAlchemy](https://github.com/Alexis-benoist/eralchemy) para generar un archivo PDF con un diagrama del modelo y un listado de las tablas, las columnas y las medidas.
    
    ![Generando un archivo PDF con la estructura del modelo Power BI desde Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-tom-pdf.jpg)
    

### Modificando el modelo

Adem�s de explorar el modelo podemos hacer cambios, por ejemplo, modificar el nombre una columna. TOM lleva registro de esos cambios y cuando estemos listos para guardarlos en el modelo de Power BI, debemos ejecutar el m�todo `SaveChanges()`.

En el notebook que comparto he hecho dos ejemplos de modificaciones, inspir�ndome en lo que se puede hacer con Tabular Editor:

- Crear medidas YTD para todas las medidas que existan en el modelo
- Crear un Grupo Calculado

El siguiente fragmento de c�digo muestra la creaci�n de las medidas YTD.

![Creando medidas Power BI desde Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-tom-crear-medidas.jpg)

En la primera l�nea se actualiza la informaci�n del modelo que est� en la memoria con la del modelo de Power BI. A continuaci�n se recorren las tablas y las medidas y se van creando las nuevas medidas aplicando la funci�n DAX `TOTALYTD()` sobre la medida original.

Adem�s a la nueva medida se le a�aden dos anotaciones, una para indicar que la herramienta con la que se est� creando es Python, y la otra para indicar el nombre del autor. Esto lo hago con el fin de tener documentados los cambios dentro del propio modelo.

Cuando se termina de recorrer todas las medidas, se guardan los cambios en el modelo Power BI con `SaveChanges()`.

## Experimentando con ADOMD.NET y .NET

Para los experimentos con consultas DAX he utilizado .NET en lugar de Python, aunque si mantengo Visual Studio Code como editor. He hecho 3 demostraciones:

- Usando la extensi�n de [.Net Interactive](https://github.com/dotnet/interactive) para Visual Studio Code, con la cual he creado una notebook Jupyter con varios ejemplos en C# de como conectarse al modelo de datos y ejecutar consultas DAX.
    
    Para abrir el notebook desde Power BI Desktop, he preparado otra configuraci�n de herramienta externa, similar a la que he usado para Python.
    
- Una prueba de concepto de una aplicaci�n web que hace consultas DAX para presentar los datos dentro de una p�gina web de la aplicaci�n.
    
- Una Funci�n Azure que se conecta a un modelo de datos en una capacidad Premium (licencia PPU) para contar la cantidad de productos vendidos en un d�a.
    

El c�digo tambi�n est� disponible en [GitHub](https://github.com/dataxbi/adomd-dotnet) y tambi�n hay un [v�deo](https://youtu.be/2RsyiSTOKwA) con toda la demostraci�n.

### Ejecutando una consulta DAX

En el siguiente fragmento de c�digo C# muestro c�mo ejecutar una consulta DAX que devuelva un s�lo valor. No est� la parte donde se construye la cadena de conexi�n, pero se hace igual que con Python, lo que usando el m�todo `Environment.GetEnvironmentVariable()` para leer las variables del entorno.

![Ejecutando una consulta DAX en .NET Interactive](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-dax.jpg)

En este fragmento de c�digo se utiliza un par�metro para filtra la consulta DAX, para obtener las unidades vendidas en un a�o.

![Ejecutando una consulta DAX con par�metros en .NET Interactive](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-dax-parametros.jpg)

Y en este otro fragmento de c�digo ejecutamos una consulta DAX que devuelve una tabla, por lo que hacemos un bucle para ir obteniendo cada fila, y en la primera fila accedemos al encabezado de la tabla para traer el nombre de las columnas.

![Ejecutando una consulta DAX que devuelve una tabla en .NET Interactive](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-dax-tabla.jpg)

### Aplicaci�n web

Para la aplicaci�n web he partido de la plantilla MVC de .NET, que se genera usando el comando `dotnet new mvc`, y he modificado el controlador y la vista Home para mostrar 3 valores extra�dos del modelo de Power BI: cantidad de unidades vendidas, importe total y % de beneficio.

![Aplicaci�n web MVC con .NET que ejecuta una consulta DAX sobre un modelo de datos de Power BI](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-web.jpg)

Para ejecutar las consultas DAX he definido una interfaz con el nombre `IDaxService` que he implementado en la clase `DaxService` y tambi�n he implementado la clase `PowerBIOptions` para configurar los par�metros de conexi�n y generar la cadena de conexi�n. En la siguiente imagen est� el c�digo de la clase `DaxService`.

![Implementaci�n de una clase para ejecutar c�digo DAX desde .NET](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-class-daxservice.jpg)

Y en el siguiente fragmento de c�digo se ve como se inyecta la clase `DaxService`en la aplicaci�n web.

![Inyectando la clase DAXService en la aplicaci�n web](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-web-class-daxservice-di.jpg)

Quise ir un poco m�s all� con la aplicaci�n web, implementando una nueva p�gina con un peque�o informe interactivo con gr�ficos de barras y de l�neas que muestra los datos de ventas para un a�o, y donde se puede cambiar el a�o con un combo box y los gr�ficos se actualizan mediante AJAX. Para los gr�ficos he utilizado la biblioteca JavaScript [AG Grid](https://www.ag-grid.com/javascript-charts/overview/).

![Informe interactivo usando .NET MVC con AG Grid y ADOMD.NET para ejecutar consultas DAX](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-web-dax-aggrid.jpg)

La demostraci�n est� hecha conect�ndose localmente a Power BI Desktop, pero cambiando la cadena de conexi�n se pudiera conectar a un conjunto de datos que est� en una capacidad Premium, que pudiera ser una licencia Premium Por Usuario (PPU).

Esto no es lo mismo que Power BI Embedded, porque no estamos incrustando visualizaciones desde el servicio de Power BI, sino que estamos accediendo directamente a los datos y us�ndolos con nuestras propias visualizaciones. Son casos de uso diferentes.

### Funci�n Azure

Y por �ltimo, implement� una Funci�n Azure muy simple, a partir de modificar el ejemplo para una Funci�n Azure con desencadenador HTTP, que acepta un par�metro con una fecha y devuelve la cantidad de bicicletas vendidas para ese d�a. La implementaci�n la hice con C# en Visual Studio Code y luego la publiqu� en Azure, donde configur� los par�metros de entorno para que se conecte a un �rea de trabajo de Power BI con capacidad Premium Por Usuario (PPU).

En la siguiente imagen muestro un fragmento de la Funci�n Azure.

![Funci�n Azure que ejecuta una consulta DAX contra un conjunto de datos Power BI](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-azure-function-dax.jpg)

Y en esta �ltima imagen se ve una prueba de ejecuci�n en Azure, donde a la funci�n se le pasa como par�metro la fecha 2020-01-04 y devuelve que para ese d�a se vendieron 24 bicicletas.

![Ejecutando una Funci�n Azure que ejecuta una consulta DAX contra un conjunto de datos Power BI](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-azure-function-dax-azure-portal.jpg)

## Conclusi�n

En esta entrada he hecho un resumen de dos charlas que tuve la oportunidad de presentar, una en la Global Power Platform Bootcamp 2021 Madrid y otra en la Netcoreconf 2021, y donde el factor com�n es la interacci�n con el modelo tabular de Power BI mediante XMLA, pero en una utilizo la biblioteca TOM con Python y en la otra utilizo la biblioteca ADOMD.NET con C#.

Tengo la intensi�n de seguir experimentando con estos temas y en particular con:

- Visual Studio Code como herramienta externa de Power BI
- Automatizar tareas de Power BI con Python
- Hacer pruebas con XMLA en la licencia Premium Por Usuario (PPU)

## Referencias

- [https://docs.microsoft.com/es-es/power-bi/admin/service-premium-connect-tools](https://docs.microsoft.com/es-es/power-bi/admin/service-premium-connect-tools)
- [https://docs.microsoft.com/es-es/analysis-services/tom/introduction-to-the-tabular-object-model-tom-in-analysis-services-amo](https://docs.microsoft.com/es-es/analysis-services/tom/introduction-to-the-tabular-object-model-tom-in-analysis-services-amo)
- [https://docs.microsoft.com/es-es/analysis-services/adomd/multidimensional-models-adomd-net-client/retrieving-data-from-an-analytical-data-source](https://docs.microsoft.com/es-es/analysis-services/adomd/multidimensional-models-adomd-net-client/retrieving-data-from-an-analytical-data-source)
- [https://docs.microsoft.com/es-es/analysis-services/powershell/analysis-services-powershell-reference](https://docs.microsoft.com/es-es/analysis-services/powershell/analysis-services-powershell-reference)
- [https://dataveld.com/2020/07/21/python-as-an-external-tool-in-power-bi-desktop-part-2-create-a-pbitool-json-file/](https://dataveld.com/2020/07/21/python-as-an-external-tool-in-power-bi-desktop-part-2-create-a-pbitool-json-file/)
- [V�deo de la charla Jugando con TOM desde Python](https://youtu.be/Yc18TTs2y1w)
- [Repositorio en GitHub con el c�digo Python que usa TOM](https://github.com/dataxbi/tom-python)
- [V�deo de la charla Ejecutando consultas DAX sobre Power BI desde NET 5](https://youtu.be/2RsyiSTOKwA)
- [Repositorio en GitHub del c�digo C# que usa ADOMD.NET](https://github.com/dataxbi/adomd-dotnet)
