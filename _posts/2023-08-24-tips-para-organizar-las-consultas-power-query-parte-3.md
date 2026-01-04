---
layout: post
title: "Tips para organizar las consultas Power Query – Parte 3"
date: 2023-08-24
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "powerquery"
---

Esta es la tercera entrada del tema de buenas pr�cticas para la organizaci�n de las consultas en el editor de Power Query donde hablaremos de la t�cnica “Multi-Query Architecture” que explican Ken Puls y Miguel Escobar en su libro [Master Your Data Power Query in Excel and Power BI](https://skillwave.training/shop/master-your-data/).

<!--more-->

Los otros art�culos de la serie:

- [Parte 1](https://www.dataxbi.com/blog/2022/12/14/tips-organizar-consultas-power-query-parte1/)
- [Parte 2](https://www.dataxbi.com/blog/2023/04/04/tips-para-organizar-las-consultas-power-query-parte-2/)
- [Parte 4](https://www.dataxbi.com/blog/2023/08/29/tips-para-organizar-las-consultas-power-query-parte-4/)

Esta t�cnica consiste en dividir cada consulta en varias consultas, es decir, a�adir capas de consultas adicionales, que permitir�n controlar el crecimiento del tama�o y la complejidad de las consultas. La idea es que en lugar de tener una �nica consulta con todos los pasos del proceso de ETL tengas varias consultas, como m�nimo una por cada fase del proceso, es decir, una consulta para la extracci�n de datos, otra para las transformaciones y otra para el modelo. A estas capas las denominaron Raw Data, Staging y Data Model.

### Contenido de cada capa

#### Capa Raw Data

#### 

Esta capa se utiliza para extraer los datos del origen. Las consultas de esta capa requieren de unas pocas transformaciones: conexi�n a la fuente de datos y navegaci�n fundamentalmente. En algunos casos necesitaremos filtrar las filas y columnas que no sean necesarias. El objetivo de esta capa es tener una tabla con todos los registros del conjunto de datos.

En nuestro caso a esta capa la denominaremos **Originales** y contendr� los datos porque la conexi�n ya la hemos creado en una consulta separada utilizando la t�cnica de File Proxy que vimos en la segunda entrada sobre el tema [Tips para organizar las consultas Power Query – Parte 2](https://www.dataxbi.com/blog/2023/04/04/tips-para-organizar-las-consultas-power-query-parte-2/) y a la que hemos llamado Consulta Maestra. Nuestras consultas en esta capa tendr�n dos pasos: Origen que es una referencia a la Consulta Maestra y Navegaci�n donde se seleccionan los datos de esa consulta.

#### Capa Staging

En esta capa se llevar�n a cabo la mayor parte de las transformaciones del proceso de ETL, incluyendo la creaci�n de las llaves subrogadas. El paso Origen hace referencia a la consulta de la capa Raw Data correspondiente. Puede requerir la creaci�n de m�s de una consulta, es decir, si el proceso de transformaci�n es muy complejo o contiene demasiados pasos se puede dividir en varias consultas a su vez.

A esta capa la nombraremos **Trasnformadas**.

#### Capa Data Model

En esta capa est�n las consultas que se cargan en el modelo. El paso origen de la consulta hace referencia a la consulta correspondiente de la capa de Staging y realiza algunas transformaciones finales.

##### Transformaciones de la capa Data Model

###### Anexar y/o combinar con otras consultas:

En esta transformaci�n podemos combinar o anexar consultas de la capa staging. Por ejemplo, si hemos creado columnas de llaves subrogadas en la capa de transformaci�n, debemos combinar las tablas de hecho con esas consultas para obtener la nueva clave.

###### Eliminar columnas:

En las consultas de dimensiones y de hechos que se cargar�n en el modelo debemos eliminar las columnas con la clave original y en su lugar utilizaremos las claves sustitutas para relacionar las tablas en el modelo.

###### Renombrar columnas:

Las columnas claves sustitutas pueden renombrase utilizando el nombre que ten�a la clave original una vez que se hayan eliminado en un paso anterior. Este paso es opcional.

###### Asignar tipo de datos a las columnas:

Es importante que todas las columnas de las tablas que se carguen en el modelo tengan asignado correctamente el tipo de datos, sobre todo en el caso de las columnas que contiene los hechos y sobre las que se realizar�n operaciones que dependen del tipo de datos. Debemos evitar asignarle tipos de datos a las columnas antes este momento porque de hacerlo se podr�an generar errores si se modifica la estructura original de los datos o se cambia el origen inicial.

A esta capa la llamaremos **Modelo**.

### Agrupar consultas

Como vimos en la primera entrada de esta serie es buena pr�ctica agrupar las consultas en carpetas. En este caso crearemos una carpeta para cada una de las capas: Originales, Transformadas y Modelo. Debajo de la carpeta Modelo a�adiremos dos subcarpetas una para las tablas de hechos y otra para las de dimensiones.

En el caso que estemos realizando el ETL con flujos de datos y tengamos una licencia Premium podr�amos incluso separar cada capa de consultas en un flujo diferente, un flujo para cada etapa del proceso.

## Ejemplo del uso de la t�cnica

Para mostrar c�mo aplicar esta t�cnica utilizaremos el PBIX que se obtuvo como resultado en la entrada anterior del tema.

![dataXbi-Resultado Consultas Tips2](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Resultado-Consultas-Tips2.png)  
  

Comenzaremos por analizar la consulta Clientes. Podemos observar que en el paso Origen la consulta hace referencia a la consulta Ventas Maestra y muestra todos los datos de ese origen.

![dataXbi-Consulta Clientes resultado tips2](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consultas-Clientes-Tips2.png)  
  

En el paso navegaci�n de esta consulta es donde seleccionamos la tabla Clientes que contiene los datos de los clientes.

![dataXbi-Consultas Clientes Navegacion](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consultas-Clientes-Navegacion-Tips2.png)  
  

En el Paso 3 de la consulta se asigna el tipo de datos correspondiente a cada columna. En este punto podemos dividir la consulta en dos. La primera, Clientes Original que contendr� los dos primeros pasos y la segunda que contendr� el resto de los pasos. Para ello utilizaremos la opci�n **Extraer anteriores** del men� contextual del paso **Tipo cambiado**.

![dataXbi-Consulta Clientes Original](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consultas-Clientes-Original.png)  
  

En el cuadro de dialogo Extraer pasos especificamos el nombre de la nueva consulta, Clientes Original.

Como resultado nos quedan dos consultas con los datos de los clientes, Clientes Original, que contiene dos pasos: Origen, que hace referencia a la consulta Ventas Maestra y Navegaci�n donde escogemos la tabla Clientes y la consulta Clientes que en el paso Origen hace referencia a Clientes Original y contiene el resto de las transformaciones. A la consulta Cliente Original le deshabilitamos la carga y la guardamos en la carpeta Originales que agrupar� todas las consultas de esta capa.

![dataXbi-Consultas-Clientes-Transformada](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consultas-Clientes-Transformada.png)  
  

A continuaci�n realizaremos varias transformaciones sobre la consulta Clientes. Primero eliminaremos el paso Tipo cambiado, luego a�adiremos una columna �ndice y la llamaremos Cliente ID, esta columna ser� la clave sustituta de esta tabla. Cambiaremos el nombre de la consulta por Clientes Transformada y la guardaremos en la carpeta Transformadas, que agrupar� a las consultas de esta capa. Por �ltimo, deshabilitaremos la carga de esta consulta. El resultado lo puedes ver en la siguiente imagen.

![dataXbi-Consulta Cliente Transformada](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consulta-Cliente-Transformada.png)  
  

Crearemos ahora la consulta Clientes que se cargar� en el modelo. Esta consulta ser� una referencia a la consulta Clientes Transformada.

![dataXbi-Consulta Cliente Modelo](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consulta-Cliente-Modelo.png)  
  

Adem�s del paso Origen que ser� una referencia a la consulta Clientes Transformada a�adiremos tres nuevas transformaciones: Eliminar el campo Codigo Cliente, que es la clave del negocio, renombrar a la clave sustituta con el nombre de la clave del negocio (este paso es opcional) y asignar el tipo de dato correspondiente a cada columna.

![dataXbi-Consulta Clientes Modelo](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consulta-Clientes-Modelo-1.png)  
  

Esta consulta la guardaremos en la carpeta Modelo, correspondiente a la capa del modelo, dentro de la subcarpeta Dimensiones, que hab�amos creado previamente.

La siguiente imagen nos muestra el proceso de ETL de la consulta Clientes dividido en cada una de las consultas y la dependencia entre ellas.

![dataXbi-Dependencia Consulta Clientes](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-PBIX-Dependencia-Consultas-Clientes.png)  
  

Vamos a ver otro ejemplo en este caso escogeremos la tabla de hechos Ventas.

![dataXbi-Consulta Ventas](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consulta-Ventas.png)  
  

Los tres primeros pasos de la consulta se ven exactamente iguales a los de la consulta Cliente y vamos a extraer los dos primeros pasos en una nueva consulta como hicimos en Cliente.

La consulta Ventas Original contendr� solamente dos pasos Origen y Navegaci�n, igual que Clientes Original, se le deshabilitar� la carga y se guardar� en la carpeta Originales.

![dataXbi-Consulta Ventas Original](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consulta-Ventas-Original.png)  
  

La consulta Ventas contiene el grueso de las transformaciones. La seleccionamos y desplazamos el paso Tipo cambiado al final y de nuevo extraeremos los pasos anteriores a este en una nueva consulta a la que llamaremos Ventas transformada, le deshabilitamos la carga y la guardaremos en la carpeta Transformadas.

![dataXbi-Consulta Ventas Transformada](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consulta-Ventas-Transformada.png)  
  

La consulta Ventas contiene ahora solo dos pasos, el paso Origen que hace referencia a Ventas Transformada y el paso Tipo cambiado donde se le asigna el tipo de datos correspondiente a cada columna.

![dataXbi-Consulta Ventas Modelo](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consulta-Ventas-Modelo.png)  
  

A continuaci�n, realizaremos algunas transformaciones a la consulta Ventas. Lo primero ser� combinar con la consulta Clientes Transformada para traer la clave sustituta creada en esta consulta. Estas transformaciones debemos realizarla con todas las consultas de dimensiones a las que se le haya creado una clave sustituta. Una vez que combinadas con todas las tablas de dimensiones lo pr�ximo ser� eliminar las claves del negocio de cada dimensi�n. El siguiente paso, opcional, es renombrar las claves sustitutas con el nombre de su clave de negocio. Por �ltimo movemos el paso Tipo cambiado al final y comprobamos que se ha asignado el tipo correcto a cada columna. En este momento estaremos listos para cargar la tabla Ventas en el modelo.

![dataXbi-Consulta Ventas](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consulta-Ventas-Modelo-Acabada-1.png)  
  

La siguiente imagen nos muestra la dependencia entre las consultas de ventas en cada una de las capas y las transformaciones realizadas en cada capa.

![dataXbi-Dependencia Consultas de Ventas](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-PBIX-Dependencia-Consultas-Ventas.png)  
  

Debajo, en la imagen, podemos ver como han quedado organizadas las consultas en el Editor de Power Query.

![dataXbi-Consultas Power Query](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consultas-Power-Query.png)  
  

Como se puede ver el n�mero de consultas ha crecido pero podemos identificar claramente el contenido de cada consulta y donde realizar cada tipo de transformaci�n.

### Plegado de consultas

En el caso en que el origen de datos soporte plegado de consultas, al dividir la consulta en varias, el plegado se sigue manteniendo a menos que una transformaci�n lo rompa.

En el ejemplo que estamos estudiando uno de los or�genes es SQL Server. Si seleccionamos la consulta Ventas de la capa Modelo y nos paramos en el paso Navegaci�n podemos ver que el plegado de consultas no se ha roto y podemos ver la consulta TSQL que se genera:

![dataXbi-Plegado de consulta Ventas](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Plegado-Consulta-1.png)  
  

### Impacto en el rendimiento de las consultas

Mientras las consultas de las capas Originales y Transformadas no se carguen al modelo podemos garantizar que el rendimiento de las consultas no se afecta porque al final solo se estar� cargando una sola consulta con todas las transformaciones.

En el libro nos dicen que separar las consultas no ralentiza la actualizaci�n y nos explican que Power Query aprovecha una tecnolog�a llamada "Node caching", que almacena en cach� los resultados de la primera actualizaci�n en una secuencia y luego los reutiliza para otras consultas en la misma sesi�n de actualizaci�n.

Por ejemplo, supongamos que tenemos un origen �nico como el que se muestra en la imagen. Es un archivo CSV que contiene los datos de venta de una empresa.

![dataXbi Origen de datos �nico](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Origen-Unico.png)  
  

Y queremos crear a partir de esa fuente de datos un modelo como el que se muestra en la siguiente imagen:

![dataXbi-Modelo estrella origen �nico](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Modelo-Estrella-Origen-Unico-1.png)  
  

Aplicando esta t�cnica la arquitectura que nos queda ser�a como la de la siguiente imagen.

![dataXbi-Arquitectura Multi-Query](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Arquitectura-Multi-Query-2.png)  
  

Las consultas Ventas, Productos, Tiendas y Clientes, de la capa Modelo hacen referencia a la consulta Datos Transformada de la capa Transformadas. En la imagen podemos ver como quedan organizadas las consultas en Power Query.

![dataXbi-Organizacion consultas Power Query](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Organizacion-Consultas-Power-Query.png)  
  

Cuando se actualice la consulta Datos Transformada se generar� una vez y se almacenar� en cache. A continuaci�n la consulta Ventas har� referencia a la versi�n almacenada en cache de Datos Transformada, aplicar� sus propias transformaciones y luego cargar� la tabla en el destino. Lo mismo ocurrir� con el resto de consultas: Productos, Tiendas y Clientes.

Los resultados de la consulta de transformaci�n solo se generan una vez, y se utilizan en varias consultas de la capa Modelo. Si en lugar de aplicar esta t�cnica en este ejemplo hubi�ramos creado una �nica consulta para cada tabla del modelo, tendr�amos pasos duplicados en todas las consultas y esto si afectar�a al rendimiento.

![dataXbi-Consulta Ventas](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Consulta-Ventas-Modelo-Acabada.png)  
  

## Ventajas y desventajas del uso de esta t�cnica

### Ventajas de tener varias consultas

#### Facilita la exploraci�n de los datos de origen:

Seleccionando la consulta correspondiente de la capa Originales podremos ver y explorar los datos tal cu�l est�n en el origen de datos.

#### Se pueden reusar consultas de un nivel anterior, evitando duplicidades:

Se pueden crear nuevas consultas que hagan referencia a las consultas de las capas Originales y Transformadas sin necesidad de repetir todo el proceso de obtenerlas y duplicar los pasos.

#### Mejora el mantenimiento de la soluci�n cuando cambia un origen de datos:

Si cambia un origen de datos y tenemos una �nica consulta que contiene todos los pasos tendr�amos que modificar dicha consulta. En cambio, s� utilizamos la arquitectura Multi-Query basta con crear una consulta que conecte con el nuevo origen de datos y luego en la consulta correspondiente de la capa Transformadas cambiar la referencia a la nueva consulta, el resto permanece igual. Solo hay que tener en cuenta que las columnas en el nuevo origen deben tener los mismos nombres que la original.

#### Formula Firewall:

Si bien hay casos que requieren mantener sus fuentes de datos en una consulta para evitar el Firewall de f�rmula, tambi�n hay casos en los que debe separar sus consultas para evitarlo.

### Desventajas de tener varias consultas

Se incrementa el n�mero de consultas por lo que puede ser m�s dif�cil seguir el linaje.

![dataXbi-Dependencia de las consultas](/assets/images/posts/2023-08-24-tips-para-organizar-las-consultas-power-query-parte-3/dataXbi-Dependencia-Consultas.png)  
  

Cuando tenemos pocas consultas es muy r�pido encontrar la que se necesita. En cambio si son muchas puede costar m�s trabajo, sobre todo porque el navegador de Power Query no tiene un buscador que facilite la tarea. Una buena pr�ctica para solucionar este problema es agrupar las consultas por capas y nombrarlas de forma apropiada para que se pueda identificar f�cilmente cada consulta dentro de cada capa.

## Conclusiones

Esta claro que separar una consulta en m�ltiples consultas es m�s trabajoso que tener todos los pasos en una �nica consulta pero pienso que son m�s las ventajas que las desventajas de hacerlo, sobre todo para el mantenimiento y reutilizaci�n de los datos.

No todas las consultas necesitan dividirse en los mismos niveles, depende de la cantidad y complejidad de las transformaciones que se realicen y el objetivo de su proyecto.

En la medida que vayas desarrollando proyectos ir�s ajustando la opci�n que m�s te convenga a ti.
