---
layout: post
title: "Experimentando con XMLA en Power BI"
date: 2021-03-29
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "python"
  - "xmla"
---

En esta entrada resumo algunos experimentos que he hecho accediendo al punto XMLA de Power BI, ya sea para explorar o modificar la estructura del modelo de datos, o para ejecutar consultas DAX. Primero hablo de cómo he utilizado la biblioteca TOM desde Python y después de cómo he utilizado la biblioteca ADOMD.NET desde .NET. En ambos casos el código está disponible en GitHub.

<!--more-->

## Â¿Qué es XMLA?

XMLA es un protocolo de comunicación que permite la conexión de aplicaciones al motor de Analysis Services, que es el mismo que utiliza Power BI. En la [documentación de Microsoft](https://docs.microsoft.com/es-es/power-bi/admin/service-premium-connect-tools) está todo muy bien explicado, por lo que seré breve.

La conexión con XMLA esta disponible en:

- Power BI Premium por capacidad
- Power BI Premium por Usuario (PPU)
- Power BI Desktop

Hay varias herramientas que utilizan XMLA, como por ejemplo, SQL Server Management Studio, DAX Studio, Tabular Editor. Pero en esta entrada hablaré de cómo conectarte desde tu propia herramienta.

Hay dos bibliotecas .NET que se pueden utilizar para implementar una aplicación o un script que se conecte a Power BI con XMLA:

- [TOM (Tabular Object Model)](https://docs.microsoft.com/es-es/analysis-services/tom/introduction-to-the-tabular-object-model-tom-in-analysis-services-amo) con la que podemos leer o modificar la estructura del modelo tabular de Power BI, por ejemplo, tablas, columnas y medidas.
- [ADOMD.NET](https://docs.microsoft.com/es-es/analysis-services/adomd/multidimensional-models-adomd-net-client/retrieving-data-from-an-analytical-data-source) con la que podemos ejecutar consultas DAX para extraer los datos del modelo de Power BI.

También hay unos [cmdlets de PowerShell](https://docs.microsoft.com/es-es/analysis-services/powershell/analysis-services-powershell-reference) que se pueden utilizar para hacer scripts.

## Experimentando con TOM y Python

Mi inspiración para estos experimentos es una [serie de blogs](https://dataveld.com/2020/07/21/python-as-an-external-tool-in-power-bi-desktop-part-2-create-a-pbitool-json-file/) de David Eldersveld sobre el uso de Python como una [herramienta externa](https://www.dataxbi.com/blog/2020/09/15/herramientas-externas-powerbi-desktop/) de Power BI. La clave está en utilizar la biblioteca Python [pythonnet](https://github.com/pythonnet/pythonnet) que permite importar una biblioteca .NET y acceder a sus objetos desde Python.

Me he concentrado en usar la biblioteca TOM para explorar o modificar el modelo de datos de Power BI.

Utilizo la distribución estándar de Python (CPython) y Visual Studio Code, en lugar de Anaconda. He creado un entorno virtual en Python donde he instalado pythonnet, pandas y otras bibliotecas. También he creado un archivo JSON para configurar VS Code como una herramienta externa de Power BI. Y he creado un notebook Jupyter para hacer los experimentos.

He compartido el código en [GitHub](https://github.com/dataxbi/tom-python) y hay un [vídeo](https://youtu.be/Yc18TTs2y1w) de una charla donde hago toda la demostración. A continuación hago un resúmen.

### Conexión desde Python

En el archivo JSON para configurar VS Code como una herramienta externa, llamo a un script PowerShell que guarda en variables del entorno el servidor/puerto y el nombre de la base de datos para conectarse al modelo de Power BI Desktop. En el código Python se utilizan estas variables para formar la cadena de conexión, como se muestra a continuación:

![Cadena de conexión a Power BI desde Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-cadena-conexion.jpg)

Si en lugar de conectarnos a Power BI Desktop, quisiéramos conectarnos a un área de trabajo de Power BI Premium, a esta cadena de conexión le tendríamos que añadir la información de autenticación, por ejemplo, usuario y contraseña. Y además en la dirección del servidor tendríamos que usar algo como `powerbi://api.powerbi.com/v1.0/myorg/<nombre_area_trabajo>`.

En el siguiente bloque de código se hace la carga de la biblioteca TOM en Python, con pythonnet, y en la última línea es donde se importa y se le da el nombre de `tom`.

![Importar TOM a Python usando pythonet](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-pythonet.jpg)

Ya estamos listos para usar TOM para establecer la conexión con el modelo, con las dos líneas de código que se muestran abajo.

![Conexión al modelo de Power BI con TOM desde Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-conexion-modelo.jpg)

### Explorando el modelo

Una vez establecida la conexión, podemos recorrer la estructura del modelo para sacar información, siguiendo la jerarquía de clases de TOM. Lo primero es acceder a una base de datos y desde allí a sus tablas, columnas, etc. Al conectarnos a Power BI Desktop sólo habrá disponible una base de datos, pero si nos conectáramos a un área de trabajo de Power BI Premium, pueden existir varias bases de datos.

Por ejemplo, el siguiente fragmento de código muestra un bucle donde se listan las bases de datos, las tablas y las columnas.

![Listando base de datos, tablas y columnas con TOM desde Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-tom-listar-base-datos-tablas-columnas.jpg)

Al combinar TOM con otras bibliotecas de Python podemos lograr cosas interesantes, y en el notebook que comparto en GitHub he hecho estos ejemplos:

- Utilizar la biblioteca [Rich](https://github.com/willmcgugan/rich) para mostrar la estructura del modelo en un texto formateado como un árbol con tablas.
    
    ![Combinando TOM con Rich en Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-tom-rich.jpg)
    
- Almacenar la información de las tablas, columnas, medidas y relaciones en DataFrames pandas y crear un archivo Excel a partir de los DataFrames.
    
    ![Almacenando la estructura de un modelo Power BI en pandas DataFrame y guardando en Excel](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-tom-pandas-dataframe.jpg)
    
- Utilizar las bibliotecas [ReportLab](https://www.reportlab.com/dev/install/open_source_installation/) y [ERAlchemy](https://github.com/Alexis-benoist/eralchemy) para generar un archivo PDF con un diagrama del modelo y un listado de las tablas, las columnas y las medidas.
    
    ![Generando un archivo PDF con la estructura del modelo Power BI desde Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-tom-pdf.jpg)
    

### Modificando el modelo

Además de explorar el modelo podemos hacer cambios, por ejemplo, modificar el nombre una columna. TOM lleva registro de esos cambios y cuando estemos listos para guardarlos en el modelo de Power BI, debemos ejecutar el método `SaveChanges()`.

En el notebook que comparto he hecho dos ejemplos de modificaciones, inspirándome en lo que se puede hacer con Tabular Editor:

- Crear medidas YTD para todas las medidas que existan en el modelo
- Crear un Grupo Calculado

El siguiente fragmento de código muestra la creación de las medidas YTD.

![Creando medidas Power BI desde Python](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-python-tom-crear-medidas.jpg)

En la primera línea se actualiza la información del modelo que está en la memoria con la del modelo de Power BI. A continuación se recorren las tablas y las medidas y se van creando las nuevas medidas aplicando la función DAX `TOTALYTD()` sobre la medida original.

Además a la nueva medida se le añaden dos anotaciones, una para indicar que la herramienta con la que se está creando es Python, y la otra para indicar el nombre del autor. Esto lo hago con el fin de tener documentados los cambios dentro del propio modelo.

Cuando se termina de recorrer todas las medidas, se guardan los cambios en el modelo Power BI con `SaveChanges()`.

## Experimentando con ADOMD.NET y .NET

Para los experimentos con consultas DAX he utilizado .NET en lugar de Python, aunque si mantengo Visual Studio Code como editor. He hecho 3 demostraciones:

- Usando la extensión de [.Net Interactive](https://github.com/dotnet/interactive) para Visual Studio Code, con la cual he creado una notebook Jupyter con varios ejemplos en C# de como conectarse al modelo de datos y ejecutar consultas DAX.
    
    Para abrir el notebook desde Power BI Desktop, he preparado otra configuración de herramienta externa, similar a la que he usado para Python.
    
- Una prueba de concepto de una aplicación web que hace consultas DAX para presentar los datos dentro de una página web de la aplicación.
    
- Una Función Azure que se conecta a un modelo de datos en una capacidad Premium (licencia PPU) para contar la cantidad de productos vendidos en un día.
    

El código también está disponible en [GitHub](https://github.com/dataxbi/adomd-dotnet) y también hay un [vídeo](https://youtu.be/2RsyiSTOKwA) con toda la demostración.

### Ejecutando una consulta DAX

En el siguiente fragmento de código C# muestro cómo ejecutar una consulta DAX que devuelva un sólo valor. No está la parte donde se construye la cadena de conexión, pero se hace igual que con Python, lo que usando el método `Environment.GetEnvironmentVariable()` para leer las variables del entorno.

![Ejecutando una consulta DAX en .NET Interactive](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-dax.jpg)

En este fragmento de código se utiliza un parámetro para filtra la consulta DAX, para obtener las unidades vendidas en un año.

![Ejecutando una consulta DAX con parámetros en .NET Interactive](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-dax-parametros.jpg)

Y en este otro fragmento de código ejecutamos una consulta DAX que devuelve una tabla, por lo que hacemos un bucle para ir obteniendo cada fila, y en la primera fila accedemos al encabezado de la tabla para traer el nombre de las columnas.

![Ejecutando una consulta DAX que devuelve una tabla en .NET Interactive](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-dax-tabla.jpg)

### Aplicación web

Para la aplicación web he partido de la plantilla MVC de .NET, que se genera usando el comando `dotnet new mvc`, y he modificado el controlador y la vista Home para mostrar 3 valores extraídos del modelo de Power BI: cantidad de unidades vendidas, importe total y % de beneficio.

![Aplicación web MVC con .NET que ejecuta una consulta DAX sobre un modelo de datos de Power BI](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-web.jpg)

Para ejecutar las consultas DAX he definido una interfaz con el nombre `IDaxService` que he implementado en la clase `DaxService` y también he implementado la clase `PowerBIOptions` para configurar los parámetros de conexión y generar la cadena de conexión. En la siguiente imagen está el código de la clase `DaxService`.

![Implementación de una clase para ejecutar código DAX desde .NET](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-class-daxservice.jpg)

Y en el siguiente fragmento de código se ve como se inyecta la clase `DaxService`en la aplicación web.

![Inyectando la clase DAXService en la aplicación web](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-web-class-daxservice-di.jpg)

Quise ir un poco más allá con la aplicación web, implementando una nueva página con un pequeño informe interactivo con gráficos de barras y de líneas que muestra los datos de ventas para un año, y donde se puede cambiar el año con un combo box y los gráficos se actualizan mediante AJAX. Para los gráficos he utilizado la biblioteca JavaScript [AG Grid](https://www.ag-grid.com/javascript-charts/overview/).

![Informe interactivo usando .NET MVC con AG Grid y ADOMD.NET para ejecutar consultas DAX](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-web-dax-aggrid.jpg)

La demostración está hecha conectándose localmente a Power BI Desktop, pero cambiando la cadena de conexión se pudiera conectar a un conjunto de datos que esté en una capacidad Premium, que pudiera ser una licencia Premium Por Usuario (PPU).

Esto no es lo mismo que Power BI Embedded, porque no estamos incrustando visualizaciones desde el servicio de Power BI, sino que estamos accediendo directamente a los datos y usándolos con nuestras propias visualizaciones. Son casos de uso diferentes.

### Función Azure

Y por último, implementé una Función Azure muy simple, a partir de modificar el ejemplo para una Función Azure con desencadenador HTTP, que acepta un parámetro con una fecha y devuelve la cantidad de bicicletas vendidas para ese día. La implementación la hice con C# en Visual Studio Code y luego la publiqué en Azure, donde configuré los parámetros de entorno para que se conecte a un área de trabajo de Power BI con capacidad Premium Por Usuario (PPU).

En la siguiente imagen muestro un fragmento de la Función Azure.

![Función Azure que ejecuta una consulta DAX contra un conjunto de datos Power BI](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-azure-function-dax.jpg)

Y en esta última imagen se ve una prueba de ejecución en Azure, donde a la función se le pasa como parámetro la fecha 2020-01-04 y devuelve que para ese día se vendieron 24 bicicletas.

![Ejecutando una Función Azure que ejecuta una consulta DAX contra un conjunto de datos Power BI](/assets/images/posts/2021-03-29-experimentando-xmla-powerbi/daxXbi-experimentando-xmla-powerbi-dotnet-azure-function-dax-azure-portal.jpg)

## Conclusión

En esta entrada he hecho un resumen de dos charlas que tuve la oportunidad de presentar, una en la Global Power Platform Bootcamp 2021 Madrid y otra en la Netcoreconf 2021, y donde el factor común es la interacción con el modelo tabular de Power BI mediante XMLA, pero en una utilizo la biblioteca TOM con Python y en la otra utilizo la biblioteca ADOMD.NET con C#.

Tengo la intensión de seguir experimentando con estos temas y en particular con:

- Visual Studio Code como herramienta externa de Power BI
- Automatizar tareas de Power BI con Python
- Hacer pruebas con XMLA en la licencia Premium Por Usuario (PPU)

## Referencias

- [https://docs.microsoft.com/es-es/power-bi/admin/service-premium-connect-tools](https://docs.microsoft.com/es-es/power-bi/admin/service-premium-connect-tools)
- [https://docs.microsoft.com/es-es/analysis-services/tom/introduction-to-the-tabular-object-model-tom-in-analysis-services-amo](https://docs.microsoft.com/es-es/analysis-services/tom/introduction-to-the-tabular-object-model-tom-in-analysis-services-amo)
- [https://docs.microsoft.com/es-es/analysis-services/adomd/multidimensional-models-adomd-net-client/retrieving-data-from-an-analytical-data-source](https://docs.microsoft.com/es-es/analysis-services/adomd/multidimensional-models-adomd-net-client/retrieving-data-from-an-analytical-data-source)
- [https://docs.microsoft.com/es-es/analysis-services/powershell/analysis-services-powershell-reference](https://docs.microsoft.com/es-es/analysis-services/powershell/analysis-services-powershell-reference)
- [https://dataveld.com/2020/07/21/python-as-an-external-tool-in-power-bi-desktop-part-2-create-a-pbitool-json-file/](https://dataveld.com/2020/07/21/python-as-an-external-tool-in-power-bi-desktop-part-2-create-a-pbitool-json-file/)
- [Vídeo de la charla Jugando con TOM desde Python](https://youtu.be/Yc18TTs2y1w)
- [Repositorio en GitHub con el código Python que usa TOM](https://github.com/dataxbi/tom-python)
- [Vídeo de la charla Ejecutando consultas DAX sobre Power BI desde NET 5](https://youtu.be/2RsyiSTOKwA)
- [Repositorio en GitHub del código C# que usa ADOMD.NET](https://github.com/dataxbi/adomd-dotnet)
