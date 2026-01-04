---
layout: post
title: "Modelos Compuestos Gen2"
date: 2020-12-20
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
---

Desde la [actualización de Power BI de diciembre de 2020](https://powerbi.microsoft.com/en-us/blog/power-bi-december-2020-feature-summary/), cuando conecté a dos conjuntos de datos desde un mismo modelo me surgió una curiosidad, Â¿Cómo relacionar los conjuntos para poder mostrar en un mismo objeto visual medidas de los dos?

<!--more-->

En realidad tengo una idea de como hacerlo y quiero probar que funciona. Para ello seguiré los pasos siguientes:

1. Crearé dos modelos y los publicaré en el servicio de Power BI, en la misma área de trabajo.
2. Crearé un tercer modelo de datos en Power BI Desktop y desde aquí voy a conectar con los dos conjuntos de datos publicados.
3. Enlazaré ambos conjuntos de datos en el modelo usando las tablas de los dos modelos.
4. Añadiré en la vista de informe una matriz que combine medidas de los dos conjuntos de datos y veré que tal va el nuevo modelo.
5. Finalmente comprobaré la consulta que se envía y los tiempos de demora en ejecutarse.

### Crear los dos modelos y publicarlos

El primer modelo es de ventas y contiene las tablas Productos, Clientes, Ventas y Calendario. Debajo tienen una imagen del modelo.

![dataXbi - Modelo de Ventas](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/dataXbi-Modelo-de-Ventas.png)

  
  

Siguiendo las prácticas de un buen diseño he añadido una tabla de calendario en ambos modelos, he añadido medidas explicitas. También he ocultado todas las columnas que no son necesarias para los informes, como por ejemplo, las columnas que solo se utilizan para relacionar las tablas.

El segundo modelo es de marketing y contiene las tablas Campañas, Productos, Marketing y Calendario, debajo tienen una imagen:

![dataXbi - Modelo de Marketing](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/dataXbi-Modelo-de-Marketing.png)  
  

Este modelo también sigue las buenas prácticas de diseño por lo que tendrá su propia tabla de calendario.

Por lo tanto, los dos modelos tienen dos tablas en común: Productos y Calendario. Las dos tablas de Calendario contienen los mismos datos. En el caso de Productos, la tabla del modelo de marketing contiene solo los productos que están asociados a alguna campaña.

El siguiente paso es crear el tercer modelo que combine ambos conjuntos de datos.

### Crear un modelo de datos en Power BI Desktop que conecte con los dos conjuntos de datos publicados.

He creado un tercer modelo y añadido primero el conjunto de datos de las ventas. Debajo tenemos una imagen del nuevo modelo con el conjunto de datos añadido.

![dataXbi - Modelo Compuesto con Ventas](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/dataXbi-Modelo-Compuesto.con-Ventas.png)  
  

Podemos observar que excepto por el borde superior negro en cada tabla, el modelo es igual al original. Este borde negro indica que las tablas vienen del servicio de Power BI, como en este caso, o de Azure Analysis Services.

A continuación, seleccionamos el segundo conjunto de datos de Power BI, el de marketing, y nos muestra el siguiente mensaje:

![dataXbi - Mensaje de advertencia](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/Mensaje-advertencia.png)  
  

Que nos indica que para combinar un conjunto de datos con otro origen en un modelo es necesario cambiar el modo de conexión a DirectQuery. Esto también ocurriría no solo con otro conjunto de datos sino con cualquier otra fuente de datos, aunque sea un archivo local.

A continuación, nos muestra otro mensaje de advertencia acerca del riesgo potencial de seguridad que puede implicar crear un modelo compuesto.

![dataXbi - Mensaje advertencia al agregar segundo origen](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/Mensaje-advertencia-al-agregar-segundo-origen.png)  
  

Una vez aceptado el mensaje y configurada la privacidad se añade el segundo conjunto de datos al modelo como se muestra en la figura.

![dataXbi Vista de relacionesde Modelo Compuesto](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/Vista-de-relaciones-sin-relacionar.png)  
  

Podemos ver la primera diferencia en la vista del modelo, para cada conjunto de datos los encabezados de las tablas tienen un color diferente. El color azul identifica el primer conjunto de datos que conectamos y rojo el segundo.

Las tablas Calendario y Producto se repiten en los dos modelos, dejando en el primero los nombres originales y añadiendo en el nombre del segundo un 2.

Ahora toca relacionar las tablas de los dos modelos, pero Â¿Cómo lo haremos?

### Relacionar los dos conjuntos de datos en el modelo

No podemos pensar en modificar los modelos de Ventas y Marketing eliminando las tablas Calendario y Productos de uno de los dos porque ese modelo quedaría incompleto. Esto no permitiría hacer análisis por categoría de producto ni de inteligencia de tiempo. No sería una buena idea.

Podemos relacionar la tabla Producto del primer modelo con la tabla Campaña del segundo modelo. También podemos relacionar la tabla Calendario del primer modelo con la tabla Marketing del segundo modelo. Luego habría que hacer lo mismo pero en sentido inverso, relacionar las tablas Calendario 2 y Productos 2 con la tabla de Ventas del primer modelo. Pero eso crearía muchas más relaciones entre ambos modelos.

En mi opinión la solución es relacionar ambos modelos por las tablas comunes como se muestra en la imagen:

![dataXbi - Vista de relaciones- Modelo Compuesto Relacionado](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/Vista-de-relaciones-relacionados.png)  
  

Las relaciones que se crean tienen una cardinalidad 1 : 1 y sentido bidireccional. Esto nos permite utilizar cualquiera de los dos calendarios en los informes, ambos contienen los mismos datos. En el caso de la tabla Productos utilizaremos la tabla del modelo de ventas que es la que contiene todos los productos.

Ocultamos las tablas Calendario 2 y Productos 2 en la vista de informe ya que no serán necesarias.

En la vista de informe crearemos una visualización que combine datos de ambos modelos.

### Crear vista de informe

Representamos en una matriz el campo Codigo Producto de la tabla Productos, las medidas Unidades e Ingresos de la tabla Ventas y Nro. Ventas e Importe Ventas de la tabla Marqueting.

Añadimos dos segmentaciones Año y Semana de la tabla Calendario y el informe queda como se muestra debajo.

![dataXbi - Vista de informe](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/Vista-de-informe.png)  
  

Podemos observar que los datos se filtran bien y la visualización es bastante rápida.

Uno de los efectos negativos del cambio del modelo a DirectQuery es que las medidas perdieron el formato que tenían.

### Medir el rendimiento del modelo

Para analizar el rendimiento del modelo utilizaré la herramienta externa [DAX Studio](https://daxstudio.org/).

Desde el Analizador de rendimiento de Power BI Desktop copié la consulta que se genera para cargar la matriz, y la importé a DAX Studio. Esto me permitió ver que se generaba una consulta con el código de todos los productos y todas las fechas de calendario comprendidas en el período seleccionado. En el ejemplo el Año es 2020 y la Semana es la 27.

![dataXbi - DAX Studio - Vista consulta matrix](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/DAX-Studio.png)  
  

El tiempo de demora no ha sido muy significativo. Debajo tienen una captura de los tiempos en DAX Studio:

![dataXbi - DAX Studio - Tiempos de ejecucion](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/DAX-Studio-2.png)  
  

También probé mostrar los mismos datos filtrando por un año del Calendario y se enviaban todas las fechas de ese año del calendario.

![dataXbi - DAX Studio - Vista de un año](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/DAX-Studio-5.png)

  
  
Esta es una imagen del tiempo de ejecución para un año.

![dataXbi - DAX Studio - Tiempos para un año](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/DAX-Studio-4.png)  
  

No ocurre lo mismo si las dimensiones y medidas corresponden a un mismo modelo. Por ejemplo, eliminemos de la matriz los valores de la tabla Marketing y solo dejamos los de la tabla Ventas. La consulta resultante solo se pasa el valor del año que está filtrado y no se pasan los códigos de los productos:

![dataXbi - DAX Studio - Consultapara un solo conjunto](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/DAX-Studio-6.png)  
  

Además, el tiempo de demora es mucho menor:

![dataXbi - DAX Studio - Tiempos para un solo conjunto](/assets/images/posts/2020-12-20-modelos-compuestos-gen2/DAX-Studio-7.png)  
  

En los dos modelos de ejemplo los cálculos eran muy simples y solo utilizamos las funciones SUM() y SUMX(). Habría que estudiar que ocurre si los modelos son más complejos y contienen muchas más medidas y más complicadas.
