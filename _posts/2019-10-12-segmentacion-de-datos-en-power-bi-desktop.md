---
layout: post
title: "Segmentaci�n de datos en Power BI Desktop"
date: 2019-10-12
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "dataviz"
  - "powerbi"
---

Dentro de un informe podemos querer filtrar los datos por diferentes criterios. Una segmentaci�n de datos es una forma alternativa de filtro que limita la parte del conjunto de datos que se muestra en otras visualizaciones de un informe. Para cada criterio necesitaremos a�adir una segmentaci�n de datos. En esta entrada veremos la segmentaci�n de datos en Power BI Desktop.

<!--more-->

A continuaci�n se muestran dos im�genes de un informe. El informe contiene una segmentaci�n de datos con el campo Categor�a.

![Ejemplo segmentaci�n de datos en Power BI Desktop filtrado](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Ejemplo-segmentacion-de-datos-filtrado.png)

![ Ejemplo segmentaci�n de datos en Power BI Desktop sin filtrar](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Ejemplo-segmentacion-de-datos-sin-filtrar.png)

En la primera imagen la segmentaci�n de datos tiene seleccionado el valor “Accesories” y en la segunda no se han seleccionado valores. Se puede observar como var�an los valores del resto de las visualizaciones del informe en una y otra imagen, en dependencia de si la categor�a est� filtrada o no.

Las segmentaciones de datos se pueden aplicar a distintos tipos de datos (num�ricos, textos y de fecha) y pueden tener distinta forma como botones, listas, listas desplegables, control deslizante. Esta apariencia viene determinada por el tipo de dato seleccionado y por el formato aplicado. En la siguiente imagen se puede ver algunos ejemplos.

![Ejemplos de formas de visualizaci�n de la segmentaci�n de datos en Power BI Desktop ](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Ejemplos-formas-visualizaci�n-segmentacion-de-datos.png)

### Uso de las segmentaciones de datos

- Facilitan el acceso a filtros que se usan com�nmente mostr�ndolos en el lienzo de informes.
- Facilitan la visualizaci�n del estado filtrado actual sin tener que abrir una lista desplegable.
- Permite usar columnas ocultas en las tablas de datos para filtrar las visualizaciones.
- Sit�an los filtros junto a los objetos visuales importantes.

### Limitaciones de las segmentaciones de datos

- No admiten campos de entrada.
- No se anclan en los paneles del Servicio Power BI
- No admiten los filtros de nivel de objetos visuales.

### Crear una segmentaci�n de datos en Power BI Desktop

1. En Power BI Desktop, en la vista de informes, sin seleccionar ning�n objeto visual, seleccione el icono Segmentaci�n de datos en el panel de visualizaciones.
  
![Panel Visualizaciones-Segmentador de datos en Power BI Desktop ](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Panel-Visualizaciones-Segmentador-de-datos.png)  
  
6. Con la nueva segmentaci�n seleccionada, en el panel campos, a�ada una columna de una de las tablas del modelo. En el ejemplo usamos el campo Categor�a de la tabla Productos. La nueva segmentaci�n es una lista con los nombres de las categor�as precedidos de un cuadro de selecci�n.
  
![Segmentador de datos Categor�a](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Segmentador-de-datos-Categor�a.png)  
  
11. Cambie el tama�o de la segmentaci�n
  
\[video width="1920" height="1080" mp4="https://www.dataxbi.com/wp-content/uploads/2019/10/Segmentaci�n-de-datos.mp4"\]\[/video\]  
14. Cambie la ubicaci�n de la segmentaci�n en el lienzo.
  
\[video width="1920" height="1080" mp4="https://www.dataxbi.com/wp-content/uploads/2019/10/Segmentaci�n-de-datos-Mover.mp4"\]\[/video\]  
17. Para anular la selecci�n puede usar la goma de borrar que aparece a la derecha del nombre del campo.  
     ![Borrar selecciones de la segmentaci�n de datos en Power BI Desktop ](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Anular-segmentacion-de-datos.png)
18. Ordene alfanum�ricamente de forma ascendente o descendente.  
     ![Ordenar selecci�n de la segmentaci�n](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Segmentador-de-datos-Orden.png)
19. Se puede a�adir un buscador cuando el campo es de tipo texto.  
     ![A�adir buscador a la lista](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-A�adir-buscador-al-segmentador.png)
20. La lista de valores se puede convertir en un men� desplegable.  
     ![Convertir lista en men� desplegable](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Convertir-lista-en-menu-desplegable.png)

### Opciones de formato a la segmentaci�n de datos

En el panel de visualizaciones, debajo de las visualizaciones, si seleccionamos la brocha de pintar podemos modificar el formato de los controles visuales. Estas opciones se agrupan en categor�as que iremos viendo a continuaci�n.

  
![Dar formato a la segmentaci�n de datos en Power BI Desktop ](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Dar-formato-a-la-segmentaci�n-de-datos.png)  
  

#### Opciones generales

Se puede establecer el color y el grosor del esquema o subrayados de los encabezados y elementos, en el caso de que est�n habilitados.

Permite definir la orientaci�n de la segmentaci�n: Horizontal o Vertical. La orientaci�n Vertical es el valor predeterminado y muestra una lista de nombres con una casilla de selecci�n delante. La orientaci�n Horizontal muestra los valores en botones o iconos organizados horizontalmente. Si los elementos no caben en el �rea del control muestra flechas de desplazamiento para tener acceso a los elementos no visibles.

#### Opciones de controles de selecci�n

##### Opci�n Selecci�n �nica

Si la opci�n est� desactivada se pueden seleccionar m�ltiples elementos en la segmentaci�n. En caso de estar activada solo se puede seleccionar un elemento. Por defecto est� desactivada.

##### Opci�n Selecci�n m�ltiple con control

Est� activada por defecto. Permite seleccionar varios elementos al mismo tiempo si mantenemos la tecla **Ctrl** oprimida.

##### Opci�n Seleccionar todo

Est� desactivada por defecto. Act�vela para agregar el elemento Seleccionar todo a la segmentaci�n. Cuando escogemos Seleccionar todo, se seleccionan todos los elementos y al hacer clic sobre alguno, este se desactiva.

##### Opciones de encabezado

Esta activo de forma predeterminada. Muestra el nombre del campo de datos en la parte superior de la segmentaci�n. Podemos darle formato al texto del encabezado como color de fuente, tama�o del texto, familia de fuentes.

Podemos especificar un Esquema con el tama�o y el color que establecimos en opciones generales. Por defecto no tiene ning�n esquema seleccionado.

##### Opciones de elemento (solo segmentaciones de lista)

Permite asignar un formato al texto y al fondo de los elementos, as� como seleccionar un esquema para los elementos.

##### Entradas num�ricas y de fecha, y opciones de control deslizante (solo segmentaciones de controles deslizantes de intervalo)

Tiene las mismas opciones de Elemento de las segmentaciones de lista, pero no hay ning�n esquema ni subrayado.

##### Otras opciones de formato

**T�tulo:** agrega un t�tulo y le da formato (de forma adicional e independiente del encabezado) en la parte superior de la segmentaci�n. Por defecto est� desactivado.

**Fondo:** agrega un color de fondo a la segmentaci�n general y establece su transparencia. Por defecto est� activado.

**Bloquear relaci�n de aspecto:** conserva la forma de la segmentaci�n si se cambia su tama�o. Por defecto est� desactivado.

**Borde:** agrega un borde de 1 p�xel alrededor de la segmentaci�n y establece su color. (este borde de la segmentaci�n es independiente y no se ve afectado por la configuraci�n general de Esquema). Por defecto est� desactivado.

**Encabezado de objeto visual:** agrega un color de fondo al encabezado del objeto visual y establece su transparencia. Por defecto est� activado.

### Seleccionar los valores a filtrar por las segmentaciones

1. Seleccione los nombres en la segmentaci�n y observe como se filtran los valores de las otras visualizaciones de la p�gina.
2. Para anular la selecci�n seleccione los nombres de nuevo o utilice la goma de borrar.
3. No seleccionar ning�n nombre es equivalente a seleccionar todos los nombres.

### Controlar las visualizaciones afectadas por las segmentaciones

De forma predeterminada, las segmentaciones de las p�ginas del informe afectan a todas las visualizaciones de la p�gina. Cuando elija los valores de la lista puede observar c�mo la selecci�n afecta a las visualizaciones.

Edite las interacciones de objetos visuales para controlar las visualizaciones que se ver�n afectadas por la segmentaci�n.

#### Editar interacciones entre los objetos visuales

1. Seleccione la segmentaci�n de datos a la que quiere modificar el comportamiento.
2. En la cinta de opciones seleccione la pesta�a Formato y dentro del grupo Interacciones, la opci�n Editar interacciones.
![Editar interacciones de las segmentaciones de datos](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Editar-interacciones.png)4. En el borde de cada visualizaci�n que no est� seleccionada se muestran los controles Filtro y Ninguno. Por defecto, el icono Filtro est� activo (color negro), por lo que todas las visualizaciones ser�n filtradas por la segmentaci�n.
  
![Editar interacciones entre visualizaciones](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Editar-interacciones-entre-visualizaciones.png)  
8. Si selecciona el icono Ninguno en la matriz, la segmentaci�n de datos dejar� de filtrar a esta visualizaci�n. Puede comprobarlo seleccionado distintos a�os en la segmentaci�n y viendo que no causa ning�n efecto en la matriz.
  
![Segmentaci�n de datos  en Power BI Desktop dejar de filtrar visualizaci�n](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Dejar-de-filtrar-Visualizacion.png)

### Sincronizaci�n y uso de las segmentaciones

La sincronizaci�n de las segmentaciones permite que una segmentaci�n pueda ser usada en varias o en todas las p�ginas de un informe.

Cuando copiamos una segmentaci�n de una pesta�a del informe a otra podemos elegir si la sincronizamos o no con la segmentaci�n original.

![Copiar una segmentaci�n de datos en otra p�gina](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Copiar-una-segmentacion-en-otra-pagina.png)

Si elegimos sincronizarlas, cuando en la p�gina original o en la nueva p�gina seleccionemos un valor de la segmentaci�n, autom�ticamente se cambia en todas las p�ginas sincronizadas. Si elegimos que no se sincronicen, cada p�gina podr� tener seleccionados valores diferentes. Dependiendo de que nos convenga en cada caso elegiremos sincronizar o no.

Si sincronizamos las segmentaciones de datos podemos elegir si queremos mostrar la segmentaci�n en cada p�gina o solo en una. Si la dejamos visible solo en una p�gina cuando necesitemos modificar los valores seleccionados debemos hacerlo siempre en la p�gina donde esta visible. En caso contrario podemos modificar la selecci�n en cualquier p�gina que contenga la segmentaci�n y el resultado afectar� al resto de p�ginas que la contenga.

Para agregar u ocultar y sincronizar las segmentaciones haremos uso del panel Segmentaciones de sincronizaci�n

#### Panel de Sincronizaci�n de segmentaciones de datos

El panel de Sincronizaci�n de segmentaciones de datos se incluy� en la [actualizaci�n de Power BI Desktop de febrero de 2018](https://powerbi.microsoft.com/en-us/blog/power-bi-desktop-february-2018-feature-summary/#syncSlicers). Para acceder al panel Sincronizaci�n de segmentaciones, debe marcar la opci�n Segmentaciones de sincronizaci�n, dentro del grupo Mostrar, en la pesta�a Vista.

  
![Habilitar Panel Sincronizaci�n Segmentaciones](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Habilitar-Panel-Sincronizacion-Segmentaciones.png)  
  

El panel se abrir� a la izquierda del panel de visualizaciones y nos mostrar� para cada p�gina del informe, si la segmentaci�n seleccionada tiene una copia en esa p�gina y si est� sincronizada.

  
![Panel de segmentaciones de datos en Power BI Desktop](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Panel-de-segmentaciones-de-datos.png)  
  

Desde este panel podemos administrar las segmentaciones, a�adirlas o eliminarlas de las p�ginas, as� como hacerlas visibles u ocultarlas.

Por defecto, cuando a�adimos una segmentaci�n existente a una nueva p�gina esta se muestra del mismo tama�o y en la misma posici�n que en la p�gina original, pero podemos cambiarla de lugar, modificar su tama�o y formato de forma independiente al resto de segmentaciones con las que est� sincronizada en las dem�s p�ginas.

Si sincronizamos una segmentaci�n con una p�gina, pero no la hacemos visible en la p�gina, las selecciones de segmentaci�n realizadas en las dem�s p�ginas seguir�n filtrando los datos en la p�gina.

### Limitaciones de la sincronizaci�n de segmentaciones con jerarqu�a

En el Marketplace podemos seleccionar otras segmentaciones de datos e importarlas a nuestro modelo. La visualizaci�n HierarchySlicer es una de las segmentaciones de datos m�s utilizadas porque permite a los usuarios mostrar una jerarqu�a de campos dentro de su lista de nombres para una navegaci�n optimizada.

  
![Segmentaci�n HierarchySlicer](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Segmentaci�n-HierarchySlicer.png)  

Hasta [la actualizaci�n de Power BI Desktop de junio de 2019](https://powerbi.microsoft.com/en-us/blog/power-bi-desktop-june-2019-feature-summary/#syncSlicer), la caracter�stica Segmentaciones de sincronizaci�n no admit�a m�s de un campo (jerarqu�a de campos). Si su segmentaci�n ten�a m�s de un campo (Categor�a o Medida), la caracter�stica se deshabilitada. A partir de junio ya es posible sincronizar esta visualizaci�n, pero a�n tiene algunas limitaciones como son:

- No puede sincronizar dos segmentaciones de datos de jerarqu�a que tienen columnas diferentes de su modelo.
- Si elimina las columnas de una segmentaci�n de datos, la columna no se eliminar� de las otras segmentaciones de datos sincronizadas.

### Conclusiones

- Las segmentaciones de datos son una alternativa a los filtros para limitar el conjunto de datos que muestran el resto de visualizaciones de una p�gina de informe. Utilizan los valores de las columnas y en dependencia del tipo de dato que contengan y el formato que se les aplique pueden variar su apariencia.
- Se puede modificar la forma en que interact�an las segmentaciones con el resto de visualizaciones de una p�gina.
- Las segmentaciones de un informe se pueden sincronizar de manera que afecten a varias p�ginas de un informe.
- Podemos elegir si queremos mostrar u ocultar las segmentaciones sincronizadas en cada p�gina o solo en una.

Si te interesa este tema puedes visitar la segunda parte de esta entrada, [Segmentaci�n de datos en Power BI Desktop (parte 2)](https://www.dataxbi.com/blog/2021/12/23/segmentacion-datos-power-bi-desktop-parte-2/), donde hablamos del uso de las segmentaciones de datos con intervalos de tiempo y filtros de objeto visual.
