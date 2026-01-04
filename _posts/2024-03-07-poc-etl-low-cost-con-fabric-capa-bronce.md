---
layout: post
title: "PoC ETL low cost con Fabric - Capa bronce"
date: 2024-03-07
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "etl-low-cost-fabric"
  - "fabric"
---

Continuando la serie, hoy hablaremos de la **primera capa** de la arquitectura **Medallion** que dise�amos para nuestra prueba de concepto en la [primera entrada](https://www.dataxbi.com/blog/2024/02/11/poc-etl-low-cost-fabric-arquitectura/). A esta capa se conoce como **Bronce** y su caracter�stica fundamental es que los datos se almacenan **tal y como est�n en el origen**. La implementaci�n t�pica requiere que los datos tengan **la misma estructura y est�n en el mismo formato que en el origen**. <!--more-->

En nuestro caso de uso hemos llamado a esta capa **Datos Origen** y no sigue la implementaci�n t�pica al pie de la letra, ya ir�s descubriendo por qu�. Los datos los almacenaremos en un Lakehouse y para importarlos utilizaremos los componentes de ingenier�a de datos de Fabric: los flujos de datos GEN 2, las canalizaciones y los cuadernos de notas de Spark.

![dataXbi - PoC de ETL con Fabric - Propuesta Arquitectura Medallion capa bronce](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-PoC-ETL-Fabric-Propuesta-Arquitectura-Medallion.png)

Antes de continuar con la lectura ser�a bueno que revisaras la primera entrada de la serie donde hablamos de los or�genes de datos con los que trabajamos y que son del tipo: carpeta de SharePoint, bases de datos MySQL (On Premise) y API REST. Tambi�n es bueno recordar que nuestro objetivo es mejorar el proceso de ETL de un modelo sem�ntico que tenemos y que es un poco lento.

### Comenzamos

Partimos de que tenemos un �rea de trabajo con capacidad Fabric donde realizaremos la ETL de los datos. Uno de los objetos que podemos crear en un �rea de trabajo con capacidad Fabric es un **Lakehouse**, para almacenar los datos en archivos y tablas. Tambi�n podemos tener accesos directos a datos de otro Lakehouse dentro de nuestro OneLake o externos al OneLake como pudieran ser datos de Azure Data Lake GEN 2. Los accesos directos evitan tener copias de los datos en diferentes lugares.

#### Lakehouse

Lo primero que haremos ser� crear el Lakehouse que almacenar� los datos de la capa bronce, al que llamaremos **datos\_origen**.

Cuando creamos un Lakehouse se crean autom�ticamente un **punto de conexi�n SQL**, de solo lectura, que podemos utilizar para explorar los datos y un **modelo sem�ntico** predeterminado. Si no vamos a utilizar el modelo sem�ntico de esta capa podemos desactivar la sincronizaci�n. En la siguiente imagen podemos ver el Lakehouse **datos\_origen** con el punto de conexi�n SQL y el modelo sem�ntico predeterminado.

![dataXbi - ETLcreaci�n de un Lakehouse](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-Lakehouse-nuevo.png)  
  

### Copia de datos

Una vez que hemos creado el destino de los datos comenzamos el proceso de carga.

#### Carpeta de SharePoint

Los primeros datos que "aterrizaremos" en el Lakehouse son los de SharePoint.

En SharePoint todos los datos est�n en formato CSV, en una carpeta llamada Datos que contiene:

- 5 archivos: clientes, tiendas, productos, vendedores y municipios
- y dos subcarpetas: presupuestos y tickets

El volumen de datos de presupuestos y tickets es alto. En el caso de los presupuestos se genera un archivo mensual y en el caso de los tickets un archivo diario. Es por esta raz�n que implementaremos la actualizaci�n incremental para estos or�genes de datos.

Lo ideal para copiar datos de los or�genes al Lakehouse es utilizar una actividad de copia de una canalizaci�n. La copia es muy r�pida y permite guardar los datos en archivos igual que como est�n en el origen pero nos encontramos con una dificultad y es que las canalizaciones **no admiten**, de momento, como or�genes de datos archivos de SharePoint. En este [art�culo](https://pivotalbi.com/copy-files-from-sharepoint-online-using-azure-data-factory-and-the-microsoft-graph-api/) hemos visto que se puede llegar a implementar pero es un poco complicado y tendr�amos que utilizar componentes externos a Fabric.

Decidimos entonces utilizar los flujos de datos GEN 2 para importar los datos de SharePoint y creamos un flujo al que llamamos **copiar\_datos\_sharepoint**.

#### Flujos de datos GEN 2

Los flujos de datos GEN 2 tienen ventajas sobre los flujos de datos GEN 1, la m�s importante es que separan el almacenamiento de los datos del motor de procesamiento. Las consultas que se crean utilizando los flujos de datos GEN 2 pueden tener destinos diferentes e incluso no tener destino. En la siguiente imagen se muestran los destinos disponibles hasta la fecha para los flujos de datos GEN 2: Base de datos Azure SQL, Lakehouse, Azure Data Explorer (Kusto) y Almac�n (Warehouse).

![dataXbi - ETL con Flujo de datos elegir destino](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-Flujo-datos-destino-Lakehouse.png)  
  

Los flujos de datos internamente utilizan un almacenamiento provisional para los datos, un Lakehouse, donde se preparan los datos que se ingieren, y un Warehouse, utilizado como motor de c�lculo y medio para escribir los resultados en los destinos de salida admitidos. La siguiente imagen muestra los componentes del flujo de datos y fue tomada de la entrada [Data Factory Spotlight: Dataflow Gen2](https://blog.fabric.microsoft.com/en-us/blog/data-factory-spotlight-dataflows-gen2?ft=All) de Miguel Escobar en el blog de Fabric donde podr�s encontrar m�s informaci�n acerca del tema.

![dataXbi - ETL con flujos de datos GEN 2 - almacenamiento](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-DF-almacenamiento.png)

Cuando no se va a utilizar la computaci�n del Warehouse, o cuando la preparaci�n provisional est� deshabilitada para una consulta, el motor de mashup extraer�, transformar� o cargar� los datos en la preparaci�n provisional o en el destino. A cada consulta se le puede deshabilitar el _staging_ y es lo recomendado en el caso de que se vayan a almacenar los datos en un destino y no necesite realizar grandes procesamientos de datos.

Para deshabilitar el almacenamiento provisional de una consulta la seleccionamos y en el men� contextual podemos habilitar o deshabilitar la opci�n como se muestra en la siguiente imagen.

![dataXbi - ETL- con flujos de datos GEN 2 - deshabilitar el staging](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-DF-deshabilitar-staging.png)  
  

Los flujos de datos tienen una dificultad para su uso en esta capa y es que el destino Lakehouse almacena los datos en tablas en lugar de archivos por lo que no ser�a exactamente igual que el origen. Para compensar esta dificultad decidimos que las columnas de cada tabla ser�an de tipo texto y de esta forma mantener los datos lo m�s parecido a como estaban en el origen.

En el caso de los 5 archivos, se cre� una consulta para cada uno tal y como estaban en el archivo original y se les asign� a todas las columnas el tipo texto de esta forma tratamos de garantizar que fueran lo m�s fiel al original.

En el caso de las carpetas presupuestos y tickets se crearon dos consultas presupuestos y tickets\_soporte. A cada consulta se le a�adieron 2 columnas: **archivo\_origen** con el nombre del archivo original y **fecha\_actualizacion** con la fecha y hora de actualizaci�n. La columna archivo\_origen se utilizar� para configurar la actualizaci�n incremental. La columna fecha\_actualizacion servir� para mantener el registro hist�rico de los datos, utilizando esta columna podremos ver el estado de los datos en un momento concreto.

En esta capa no necesitamos realizar transformaciones sobre los datos por lo que deshabilitaremos el almacenamiento provisional a cada consulta.

La siguiente imagen muestra el flujo de datos **copiar\_datos\_sharepoint** donde se pueden ver todas las consultas creadas a partir de SharePoint. En la imagen est� seleccionada la consulta tickets\_soporte y podemos observar que todas las columnas son de tipo texto. Tambi�n podemos ver las columnas a�adidas _archivo\_origen_ y _fecha\_actualizacion_ que no estaban en los archivos de origen y que hemos a�adido en el proceso de extracci�n. La columna fecha\_actualizacion es la �nica que no es de tipo texto.

  
![dataXbi - copiar datos desde SharePoint a la capa de bronce utilizando un flujo de datos](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-copiar_datos_sharepoint_DF.png)  
  

Para cada consulta que necesitamos cargar en el Lakehouse debemos configurar su destino. En la imagen se muestra el destino de la consulta tickets\_soporte, en la parte inferior derecha, se puede observar que el destino seleccionado es Lakehouse.

  
  

#### Base de datos MySQL

En el caso del origen MySQL, como son 2 bases de datos en un servidor On Premise, necesitamos utilizar una puerta de enlace para conectarnos a los datos. Por este motivo no podemos utilizar una actividad de copia de una canalizaci�n para importar los datos que hubiera sido lo ideal. Las canalizaciones, en el momento de escribir el art�culo, todav�a no soportan las puertas de enlace y es por esto que tambi�n utilizamos un flujo de datos GEN 2 para importar los datos, al que llamamos **copia\_datos\_mysql**.

El flujo de datos contiene dos consultas una por cada base de datos. La estructura de los datos es la misma en las dos consultas, solo cambia la moneda en la que se almacenan los datos.

![dataXbi - copiar datos MySQL utilizando flujos de datos](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-copiar_datos_MySQL_DF.png)  
  

Al igual que en el caso de las consultas presupuestos y tickets\_soporte a�adimos 2 columnas, **fecha\_actualizacion** con la fecha y hora de actualizaci�n y **fecha\_act\_inc** de tipo texto con la fecha de actualizaci�n solamente. Estas columnas se utilizar�n igual que en el caso anterior, la primera para mantener un hist�rico de los datos y la segunda para implementar la actualizaci�n incremental.

#### Configurar destino de las consultas

Una vez que terminamos de transformar los datos debemos especificar el destino de las consultas. Como ya hemos dicho utilizaremos las tablas del Lakehouse.

Cuando seleccionamos el destino Lakehouse se muestra un asistente que nos ayudar� a configurarlo. Lo primero es seleccionar la conexi�n al Lakehouse.

![dataXbi - ETL con Flujo de datos seleccionar Lakehouse](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-Flujo-datos-destino-Lakehouse-seleccionar.png)

  
  
A continuaci�n, seleccionamos el �rea de trabajo y el Lakehouse donde se almacenar� la tabla. Debemos especificar si la tabla es nueva o ya existe y el nombre.

![dataXbi - ETL con Flujo de datos elegir Lakehouse](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-Flujo-datos-publicar-Lakehouse-elegir-destino.png)

  
  

A continuaci�n configuramos el m�todo de actualizaci�n de la tabla destino de los datos. Debemos elegir si queremos reemplazar o anexar los datos en la tabla. En nuestro caso de uso las tablas clientes, tiendas, productos y vendedores reemplazar�n los datos de la tabla por los nuevos valores, no hemos considerado mantener un hist�rico de los datos y tampoco creemos que es necesario una actualizaci�n incremental de los mismos porque su volumen no es alto. En el caso de las tablas presupuestos, tickets\_soporte, ventas\_usd y ventas\_eur hemos utilizado la opci�n Anexar porque configuraremos actualizaci�n incremental al ser alto el volumen de datos de esta forma la actualizaci�n de los datos consumir� menos tiempo.

![dataXbi - ETL con Flujo de datos Lakehouse configurar destino](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-Flujo-datos-publicar-Lakehouse-configurar-destino.png)  
  

Tambi�n debemos configurar la asignaci�n de columnas del destino. Debemos mapear los nombres de las columnas y el tipo de datos correspondiente. Los nombres de las columnas no deben contener espacios en blanco. En el caso de que los nombres del origen contengan espacios nos muestra el error como se ve en la imagen anterior y nos propone corregirlo autom�ticamente. Lo que har� ser� reemplazar los espacios por el caracter subrayado o guion bajo "\_".

Las opciones de esquema al publicar solo se aplican cuando el m�todo de actualizaci�n sea reemplazar. Al anexar datos, no es posible realizar cambios en el esquema.

Elegir un esquema din�mico, permite realizar cambios de esquema en el destino de los datos cuando se vuelva a publicar el flujo de datos. Debido a que no est� utilizando la asignaci�n administrada, a�n debe actualizar la asignaci�n de columnas en el flujo de destino del flujo de datos cuando realice cambios en su consulta. Cuando se actualice el flujo de datos, su tabla se eliminar� y se volver� a crear. La actualizaci�n del flujo de datos fallar� si agrega alguna relaci�n o medida a su tabla.

Al elegir un esquema fijo, no es posible realizar cambios en el esquema. Cuando se actualiza el flujo de datos, solo las filas de la tabla se eliminar�n y se reemplazar�n con los datos de salida del flujo de datos. Cualquier relaci�n o medida sobre la tabla permanecer� intacta. Si realiza alg�n cambio en su consulta en el flujo de datos, la publicaci�n del flujo de datos fallar� si detecta que el esquema de la consulta no coincide con el esquema de destino de los datos. Utilice esta configuraci�n cuando no planee cambiar el esquema y agregar relaciones o medidas a su tabla de destino. Al cargar datos en un Warehouse, solo se admite el esquema fijo.

Puedes ampliar la informaci�n de los destinos que admiten un esquema din�mico en el [blog de Microsoft Fabric](https://blog.fabric.microsoft.com/en-us/blog/dataflows-gen-2-data-destinations-and-managed-settings/).

#### API REST

El �ltimo origen es la API REST de donde necesitamos descargar cada d�a un archivo JSON con la tasa de cambio de ese d�a. La idea es almacenar en una carpeta los archivos JSON en lugar de sobrescribirlos y para eso hemos a�adido un sufijo al nombre del archivo con la fecha de descarga. Para este origen si pudimos utilizar una canalizaci�n con una actividad de copia a la que llamamos **descargar\_conversion\_divisas** y que puedes ver en la siguiente imagen.

![Canalizacion cargar_conversion_divisas](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-Canalizacion-descargar-conversion-divisas-1.png)

En la canalizaci�n hemos definido las propiedades necesarias para la actividad de copia: Origen y Destino. En el origen hemos especificado la conexi�n a la API REST y en destino hemos elegido como Lakehouse de destino **datos\_origen**, el de nuestra capa de bronce. Los datos se almacenar�n en archivos para mantener el formato de origen y esto se especifica en la propiedad Carpeta raiz. El nombre de la carpeta es la primera parte de la ruta de acceso al archivo y se le llam� **conversion\_divisas**. La segunda parte de la ruta es el nombre del archivo, en este caso **conversion\_eur\_**. Al nombre del archivo se le ha a�adido un sufijo con la fecha de actualizaci�n para no sobrescribir el del d�a anterior. Por �ltimo se especific� el formato del archivo, en este caso JSON.

![dataXbi - ETL con Canalizacion cargar_conversion_divisas configurar destino](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-Canalizacion-descargar-conversion-divisas-destino.png)

La canalizaci�n ya est� lista, no requiere ninguna otra configuraci�n.

### Desactivar la sincronizaci�n del modelo sem�ntico predeterminado

El modelo sem�ntico predeterminado de este Lakehouse no lo vamos a necesitar y podemos deshabilitar la sincronizaci�n desde el punto de conexi�n SQL.

![dataXbi-ETL - Lakehouse - punto de conexion SQL](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-Lakehouse-punto-conexion-sql.png)  
  

Desde el punto de conexi�n de SQL seleccionamos la opci�n Configuraci�n del men� y a continuaci�n la opci�n Modelo sem�ntico de Power BI predeterminado y aqu� deshabilitamos la sincronizaci�n del modelo sem�ntico.

![dataXbi-ETL - Lakehouse - deshabilitar modelo sem�ntico predeterminado](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-Lakehouse-modelo-semantico-deshabilitar-sincronizaci�n.png)  
  

### Orquestar el proceso completo de carga de datos

Ya tenemos implementados los procesos de carga para cada uno de los or�genes de datos ahora necesitamos organizar en que orden se ejecutar� cada proceso y que debemos hacer en caso de que falle alguno. La mejor opci�n para ello es crear una canalizaci�n que orqueste todo el proceso de carga y es lo que hemos hecho, una canalizaci�n a la que hemos llamado **copiar\_datos\_origen** y de la cu�l puedes ver una imagen.

![dataXbi-ETL low cost canalizacion capa bronce](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-ETL-Canalizacion-capa-bronce.png)  
  

Esta canalizaci�n se encarga de coordinar todos los procesos de ETL en el orden en que aparecen. En la imagen puedes ver que adem�s de los flujos de datos copiar\_datos\_sharepoint y copiar\_datos\_mysql y la canalizaci�n descargar\_conversion\_divisas hay un flujo de datos **Copiar Datos Config** y un cuaderno de notas **Registrar Actualizaci�n**. Estas dos actividades se utilizan para implementar la actualizaci�n incremental que ser� el contenido de la pr�xima entrada del blog.

Una vez ejecutada la canalizaci�n **copiar\_datos\_origen** podemos ver las tablas y archivos creados en el Lakehouse como se muestra en la siguiente imagen.

![dataXbi - Lakehouse con datos cargados](/assets/images/posts/2024-03-07-poc-etl-low-cost-con-fabric-capa-bronce/dataXbi-Lakehouse-con-datos.png)

Adem�s de las tablas y archivos que se crearon a partir de cada origen de datos hay otras dos **config\_actualizacion\_in** y **meta\_actualizacion\_inc** que se han creado y utilizado en la actualizaci�n incremental de las tablas presupuestos, tickets\_soporte, ventas\_eur y ventas\_usd.

En la pr�xima entrada te mostraremos c�mo se implement� la actualizaci�n de las tablas a pesar de que los flujos de datos GEN 2 no tiene esta caracter�stica que si la tienen los flujos GEN 1 y que es una desventaja respecto a estos.

##### Todas las entradas de esta serie **ETL "low cost" con Fabric**

1. [Arquitectura](https://www.dataxbi.com/blog/2024/02/11/poc-etl-low-cost-fabric-arquitectura/)
2. [Capacidad](https://www.dataxbi.com/blog/2024/02/22/poc-etl-low-cost-fabric-capacidad/)
3. [Capa bronce](https://www.dataxbi.com/blog/2024/03/07/poc-etl-low-cost-con-fabric-capa-bronce/)
4. [Carga incremental](https://www.dataxbi.com/blog/2024/03/26/poc-etl-low-cost-fabric-carga-incremental/)
5. [Capas plata y oro](https://www.dataxbi.com/blog/2024/04/27/poc-etl-low-cost-fabric-capas-plata-oro/)
6. [Costes](https://www.dataxbi.com/blog/2024/05/08/poc-etl-low-cost-fabric-costes/)
