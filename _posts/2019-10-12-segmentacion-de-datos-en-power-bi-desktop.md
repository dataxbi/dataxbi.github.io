---
layout: post
title: "Segmentación de datos en Power BI Desktop"
date: 2019-10-12
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "dataviz"
  - "powerbi"
---

Dentro de un informe podemos querer filtrar los datos por diferentes criterios. Una segmentación de datos es una forma alternativa de filtro que limita la parte del conjunto de datos que se muestra en otras visualizaciones de un informe. Para cada criterio necesitaremos añadir una segmentación de datos. En esta entrada veremos la segmentación de datos en Power BI Desktop.

<!--more-->

A continuación se muestran dos imágenes de un informe. El informe contiene una segmentación de datos con el campo Categoría.

![Ejemplo segmentación de datos en Power BI Desktop filtrado](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Ejemplo-segmentacion-de-datos-filtrado.png)

![ Ejemplo segmentación de datos en Power BI Desktop sin filtrar](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Ejemplo-segmentacion-de-datos-sin-filtrar.png)

En la primera imagen la segmentación de datos tiene seleccionado el valor â€œAccesoriesâ€ y en la segunda no se han seleccionado valores. Se puede observar como varían los valores del resto de las visualizaciones del informe en una y otra imagen, en dependencia de si la categoría está filtrada o no.

Las segmentaciones de datos se pueden aplicar a distintos tipos de datos (numéricos, textos y de fecha) y pueden tener distinta forma como botones, listas, listas desplegables, control deslizante. Esta apariencia viene determinada por el tipo de dato seleccionado y por el formato aplicado. En la siguiente imagen se puede ver algunos ejemplos.

![Ejemplos de formas de visualización de la segmentación de datos en Power BI Desktop ](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Ejemplos-formas-visualización-segmentacion-de-datos.png)

### Uso de las segmentaciones de datos

- Facilitan el acceso a filtros que se usan comúnmente mostrándolos en el lienzo de informes.
- Facilitan la visualización del estado filtrado actual sin tener que abrir una lista desplegable.
- Permite usar columnas ocultas en las tablas de datos para filtrar las visualizaciones.
- Sitúan los filtros junto a los objetos visuales importantes.

### Limitaciones de las segmentaciones de datos

- No admiten campos de entrada.
- No se anclan en los paneles del Servicio Power BI
- No admiten los filtros de nivel de objetos visuales.

### Crear una segmentación de datos en Power BI Desktop

1. En Power BI Desktop, en la vista de informes, sin seleccionar ningún objeto visual, seleccione el icono Segmentación de datos en el panel de visualizaciones.
  
![Panel Visualizaciones-Segmentador de datos en Power BI Desktop ](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Panel-Visualizaciones-Segmentador-de-datos.png)  
  
6. Con la nueva segmentación seleccionada, en el panel campos, añada una columna de una de las tablas del modelo. En el ejemplo usamos el campo Categoría de la tabla Productos. La nueva segmentación es una lista con los nombres de las categorías precedidos de un cuadro de selección.
  
![Segmentador de datos Categoría](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Segmentador-de-datos-Categoría.png)  
  
11. Cambie el tamaño de la segmentación
  
\[video width="1920" height="1080" mp4="https://www.dataxbi.com/wp-content/uploads/2019/10/Segmentación-de-datos.mp4"\]\[/video\]  
14. Cambie la ubicación de la segmentación en el lienzo.
  
\[video width="1920" height="1080" mp4="https://www.dataxbi.com/wp-content/uploads/2019/10/Segmentación-de-datos-Mover.mp4"\]\[/video\]  
17. Para anular la selección puede usar la goma de borrar que aparece a la derecha del nombre del campo.  
     ![Borrar selecciones de la segmentación de datos en Power BI Desktop ](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Anular-segmentacion-de-datos.png)
18. Ordene alfanuméricamente de forma ascendente o descendente.  
     ![Ordenar selección de la segmentación](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Segmentador-de-datos-Orden.png)
19. Se puede añadir un buscador cuando el campo es de tipo texto.  
     ![Añadir buscador a la lista](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Añadir-buscador-al-segmentador.png)
20. La lista de valores se puede convertir en un menú desplegable.  
     ![Convertir lista en menú desplegable](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Convertir-lista-en-menu-desplegable.png)

### Opciones de formato a la segmentación de datos

En el panel de visualizaciones, debajo de las visualizaciones, si seleccionamos la brocha de pintar podemos modificar el formato de los controles visuales. Estas opciones se agrupan en categorías que iremos viendo a continuación.

  
![Dar formato a la segmentación de datos en Power BI Desktop ](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Dar-formato-a-la-segmentación-de-datos.png)  
  

#### Opciones generales

Se puede establecer el color y el grosor del esquema o subrayados de los encabezados y elementos, en el caso de que estén habilitados.

Permite definir la orientación de la segmentación: Horizontal o Vertical. La orientación Vertical es el valor predeterminado y muestra una lista de nombres con una casilla de selección delante. La orientación Horizontal muestra los valores en botones o iconos organizados horizontalmente. Si los elementos no caben en el área del control muestra flechas de desplazamiento para tener acceso a los elementos no visibles.

#### Opciones de controles de selección

##### Opción Selección única

Si la opción está desactivada se pueden seleccionar múltiples elementos en la segmentación. En caso de estar activada solo se puede seleccionar un elemento. Por defecto está desactivada.

##### Opción Selección múltiple con control

Está activada por defecto. Permite seleccionar varios elementos al mismo tiempo si mantenemos la tecla **Ctrl** oprimida.

##### Opción Seleccionar todo

Está desactivada por defecto. Actívela para agregar el elemento Seleccionar todo a la segmentación. Cuando escogemos Seleccionar todo, se seleccionan todos los elementos y al hacer clic sobre alguno, este se desactiva.

##### Opciones de encabezado

Esta activo de forma predeterminada. Muestra el nombre del campo de datos en la parte superior de la segmentación. Podemos darle formato al texto del encabezado como color de fuente, tamaño del texto, familia de fuentes.

Podemos especificar un Esquema con el tamaño y el color que establecimos en opciones generales. Por defecto no tiene ningún esquema seleccionado.

##### Opciones de elemento (solo segmentaciones de lista)

Permite asignar un formato al texto y al fondo de los elementos, así como seleccionar un esquema para los elementos.

##### Entradas numéricas y de fecha, y opciones de control deslizante (solo segmentaciones de controles deslizantes de intervalo)

Tiene las mismas opciones de Elemento de las segmentaciones de lista, pero no hay ningún esquema ni subrayado.

##### Otras opciones de formato

**Título:** agrega un título y le da formato (de forma adicional e independiente del encabezado) en la parte superior de la segmentación. Por defecto está desactivado.

**Fondo:** agrega un color de fondo a la segmentación general y establece su transparencia. Por defecto está activado.

**Bloquear relación de aspecto:** conserva la forma de la segmentación si se cambia su tamaño. Por defecto está desactivado.

**Borde:** agrega un borde de 1 píxel alrededor de la segmentación y establece su color. (este borde de la segmentación es independiente y no se ve afectado por la configuración general de Esquema). Por defecto está desactivado.

**Encabezado de objeto visual:** agrega un color de fondo al encabezado del objeto visual y establece su transparencia. Por defecto está activado.

### Seleccionar los valores a filtrar por las segmentaciones

1. Seleccione los nombres en la segmentación y observe como se filtran los valores de las otras visualizaciones de la página.
2. Para anular la selección seleccione los nombres de nuevo o utilice la goma de borrar.
3. No seleccionar ningún nombre es equivalente a seleccionar todos los nombres.

### Controlar las visualizaciones afectadas por las segmentaciones

De forma predeterminada, las segmentaciones de las páginas del informe afectan a todas las visualizaciones de la página. Cuando elija los valores de la lista puede observar cómo la selección afecta a las visualizaciones.

Edite las interacciones de objetos visuales para controlar las visualizaciones que se verán afectadas por la segmentación.

#### Editar interacciones entre los objetos visuales

1. Seleccione la segmentación de datos a la que quiere modificar el comportamiento.
2. En la cinta de opciones seleccione la pestaña Formato y dentro del grupo Interacciones, la opción Editar interacciones.
![Editar interacciones de las segmentaciones de datos](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Editar-interacciones.png)4. En el borde de cada visualización que no está seleccionada se muestran los controles Filtro y Ninguno. Por defecto, el icono Filtro está activo (color negro), por lo que todas las visualizaciones serán filtradas por la segmentación.
  
![Editar interacciones entre visualizaciones](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Editar-interacciones-entre-visualizaciones.png)  
8. Si selecciona el icono Ninguno en la matriz, la segmentación de datos dejará de filtrar a esta visualización. Puede comprobarlo seleccionado distintos años en la segmentación y viendo que no causa ningún efecto en la matriz.
  
![Segmentación de datos  en Power BI Desktop dejar de filtrar visualización](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Dejar-de-filtrar-Visualizacion.png)

### Sincronización y uso de las segmentaciones

La sincronización de las segmentaciones permite que una segmentación pueda ser usada en varias o en todas las páginas de un informe.

Cuando copiamos una segmentación de una pestaña del informe a otra podemos elegir si la sincronizamos o no con la segmentación original.

![Copiar una segmentación de datos en otra página](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Copiar-una-segmentacion-en-otra-pagina.png)

Si elegimos sincronizarlas, cuando en la página original o en la nueva página seleccionemos un valor de la segmentación, automáticamente se cambia en todas las páginas sincronizadas. Si elegimos que no se sincronicen, cada página podrá tener seleccionados valores diferentes. Dependiendo de que nos convenga en cada caso elegiremos sincronizar o no.

Si sincronizamos las segmentaciones de datos podemos elegir si queremos mostrar la segmentación en cada página o solo en una. Si la dejamos visible solo en una página cuando necesitemos modificar los valores seleccionados debemos hacerlo siempre en la página donde esta visible. En caso contrario podemos modificar la selección en cualquier página que contenga la segmentación y el resultado afectará al resto de páginas que la contenga.

Para agregar u ocultar y sincronizar las segmentaciones haremos uso del panel Segmentaciones de sincronización

#### Panel de Sincronización de segmentaciones de datos

El panel de Sincronización de segmentaciones de datos se incluyó en la [actualización de Power BI Desktop de febrero de 2018](https://powerbi.microsoft.com/en-us/blog/power-bi-desktop-february-2018-feature-summary/#syncSlicers). Para acceder al panel Sincronización de segmentaciones, debe marcar la opción Segmentaciones de sincronización, dentro del grupo Mostrar, en la pestaña Vista.

  
![Habilitar Panel Sincronización Segmentaciones](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Habilitar-Panel-Sincronizacion-Segmentaciones.png)  
  

El panel se abrirá a la izquierda del panel de visualizaciones y nos mostrará para cada página del informe, si la segmentación seleccionada tiene una copia en esa página y si está sincronizada.

  
![Panel de segmentaciones de datos en Power BI Desktop](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Panel-de-segmentaciones-de-datos.png)  
  

Desde este panel podemos administrar las segmentaciones, añadirlas o eliminarlas de las páginas, así como hacerlas visibles u ocultarlas.

Por defecto, cuando añadimos una segmentación existente a una nueva página esta se muestra del mismo tamaño y en la misma posición que en la página original, pero podemos cambiarla de lugar, modificar su tamaño y formato de forma independiente al resto de segmentaciones con las que está sincronizada en las demás páginas.

Si sincronizamos una segmentación con una página, pero no la hacemos visible en la página, las selecciones de segmentación realizadas en las demás páginas seguirán filtrando los datos en la página.

### Limitaciones de la sincronización de segmentaciones con jerarquía

En el Marketplace podemos seleccionar otras segmentaciones de datos e importarlas a nuestro modelo. La visualización HierarchySlicer es una de las segmentaciones de datos más utilizadas porque permite a los usuarios mostrar una jerarquía de campos dentro de su lista de nombres para una navegación optimizada.

  
![Segmentación HierarchySlicer](/assets/images/posts/2019-10-12-segmentacion-de-datos-en-power-bi-desktop/dataXbi-Segmentación-HierarchySlicer.png)  

Hasta [la actualización de Power BI Desktop de junio de 2019](https://powerbi.microsoft.com/en-us/blog/power-bi-desktop-june-2019-feature-summary/#syncSlicer), la característica Segmentaciones de sincronización no admitía más de un campo (jerarquía de campos). Si su segmentación tenía más de un campo (Categoría o Medida), la característica se deshabilitada. A partir de junio ya es posible sincronizar esta visualización, pero aún tiene algunas limitaciones como son:

- No puede sincronizar dos segmentaciones de datos de jerarquía que tienen columnas diferentes de su modelo.
- Si elimina las columnas de una segmentación de datos, la columna no se eliminará de las otras segmentaciones de datos sincronizadas.

### Conclusiones

- Las segmentaciones de datos son una alternativa a los filtros para limitar el conjunto de datos que muestran el resto de visualizaciones de una página de informe. Utilizan los valores de las columnas y en dependencia del tipo de dato que contengan y el formato que se les aplique pueden variar su apariencia.
- Se puede modificar la forma en que interactúan las segmentaciones con el resto de visualizaciones de una página.
- Las segmentaciones de un informe se pueden sincronizar de manera que afecten a varias páginas de un informe.
- Podemos elegir si queremos mostrar u ocultar las segmentaciones sincronizadas en cada página o solo en una.

Si te interesa este tema puedes visitar la segunda parte de esta entrada, [Segmentación de datos en Power BI Desktop (parte 2)](https://www.dataxbi.com/blog/2021/12/23/segmentacion-datos-power-bi-desktop-parte-2/), donde hablamos del uso de las segmentaciones de datos con intervalos de tiempo y filtros de objeto visual.
