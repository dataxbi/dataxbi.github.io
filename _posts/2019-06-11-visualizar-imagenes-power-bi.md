---
layout: post
title: "Visualizar imágenes en Power BI"
date: 2019-06-11
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "dataviz"
  - "powerbi"
---

Podemos visualizar imágenes en Power BI de dos formas diferentes: teniendo una columna de una tabla que contenga o bien las URL de las imágenes o bien las imágenes en formato de texto.

En esta entrada veremos como importar las imágenes de las dos formas.

<!--more-->

### Visualizar imágenes en Power BI desde una URL

El primer paso será almacenar las imágenes en una tabla o consulta.

Si las imágenes que queremos mostrar se encuentran en un sitio público podemos conocer la dirección del enlace a la imagen y almacenarla en una tabla con el resto de la información que necesitemos como el nombre, descripción, etc.

Si las imágenes son pocas podemos crear la tabla en Power Query. Por el contrario, si son muchas, la podemos crear en Excel o cualquiera de los otros tipos de archivo que soporta Power BI Desktop y nos conectaremos a ella desde Power Query.

La tabla que utilizaremos en este ejemplo es como la que se muestra a continuación.

![Archivo Excel con URL de imágenes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-Excel-URLs-publicas.png)  
  

Una vez que hemos creado la tabla o nos hemos conectado a ella desde Power Query aplicaremos los cambios realizados y cargaremos los datos en el modelo.

El siguiente paso será asignar una categoría a la columna que contiene la URL de la imagen.

Para ello desde la vista de datos, seleccionamos la tabla Imagen y a continuación la columna URL. En la pestaña Modelado, dentro del grupo Propiedades escogemos la categoría de datos Dirección URL de la imagen.

![Asignar catagoria Direccion URL de la imagen a columna](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-asignar-catagoria-Direccion-URL-de-la-imagen-a-columna.png)  
  

Ya estamos listos para visualizar las imágenes. En este caso seleccionamos una tabla y los campos a visualizar, entre ellos la URL de la imagen.

![Visualizar imágenes en una tabla](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-visualizar-imagenes-en-una-tabla.png)  
  

Limitaciones de este método:

- Obtener la URL de cada imagen.
- Si no tenemos conexión a internet no podemos ver las imágenes en Power BI Desktop.
- Si eliminan las imágenes del servidor donde se encuentra también la perderemos en nuestros informes.

### Visualizar imágenes en Power BI desde OneDrive

Para este ejemplo, hemos descargado las imágenes desde el sitio web y las hemos almacenado en una Carpeta de OneDrive, como se muestra en la imagen.

![Imágenes en una carpeta de OneDrive](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-imagenes-en-una-carpeta-de-ONEDRIVE.png)  
  

Una opción en este caso es buscar la URL de la carpeta de OneDrive y asignarla a una columna de la tabla.

Para obtener la URL de la carpeta abriremos en el navegador el portal de Office y buscaremos la carpeta. Lo más sencillo para conocer la ubicación es guardar cualquier documento de office en la carpeta y abrirlo desde el ordenador.

Para el ejemplo he guardado un documento Excel. Seleccionamos el documento office, a continuación, oprimimos el menú de los tres puntos, escogemos Abrir y a continuación Abrir en Excel, como se muestra en la siguiente imagen.

![Carpeta de OneDrive en el portal de Office](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-carpeta-OneDrive.png)  
  

Se abre el documento Excel en el ordenador y a continuación seleccionamos la pestaña Archivo.

![URL de documento Excel en OneDrive](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-URL-documento-Excel.png)  
  

La URL copiada es la siguiente

![URL de archivo Excel en OneDrive](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-URL-de-archivo-Excel-OneDrive.png)  
  

Eliminaremos el nombre del archivo y todo lo que sigue a continuación.

![URL de la carpeta de imágenes de OneDrive](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-URL-carpeta-de-Imagenes.png)  
  

Nos queda la URL de la carpeta que contiene las imágenes, ahora nos falta añadirle el nombre del archivo.

Los archivos de imágenes siguen un patrón en el nombre que podemos observar en la imagen que sigue

![Nombre de los archivos de Imágenes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-nombre.de-los-archivos-de-Imagenes.pn
g)  
  

El nombre de la imagen esta formado por el nombre del equipo y a continuación -150x150.jpg. Como en nuestra tabla tenemos una columna con los nombres de los equipos será muy fácil construir la URL de cada imagen.

En el Editor de Power Query crearemos una columna personalizada a partir de la columna Nombre y añadiéndole un prefijo y un sufijo.

![Columna con URL de imágenes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-columna-URL-de-Imagenes.png)  
  

Cerramos y aplicamos los cambios.

Asignamos la categoría Dirección URL de la imagen a la columna URL igual que en el caso anterior y ya estamos listos para visualizar las imágenes.

Igual que en el caso anterior seleccionamos el objeto tabla y varios campos entre ellos la columna URL.

![Power BI Desktop URL de Imagenes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-PowerBI-Desktop-URL-de-Imagenes.png)  
  

Como puedes observar en la imagen anterior, en Power BI Desktop las imágenes no se cargan.

Cuando publicamos el modelo en Power BI Service, las imágenes se pueden ver como puedes apreciar en la siguiente imagen.

![Power BI Service URL de imágenes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-PowerBI-Service-URL-de-Imagenes.png)  
  

Limitaciones de este método:

- Obtener la URL de las imágenes de OneDrive es un poco más complicado que en el caso de la URL pública.
- Las imágenes no se visualizan en Power BI Desktop.
- No todos los navegadores soportan estas imágenes.

### Visualizar imágenes en Power BI contenidas en un campo de la consulta

Para utilizar este método las imágenes pueden estar almacenadas en una URL, en una carpeta local del ordenador o en un campo binario de SQL.

Estudiaremos cada uno de los casos.

#### Desde URL almacenada en una columna de una tabla.

Usaremos la tabla resultante del primer ejemplo (Imagen3).

El primer paso será añadir una columna calculada con la siguiente fórmula:

```
Web.Contents([URL])
```

Que convierte la URL en formato binario y lo almacena en un campo de la tabla.

![Contener imagen en columna](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-embeber-imagen-en-columna.png)  
  

Cuando oprimimos el botón Aceptar nos pide confirmar las credenciales del usuario, que en este caso es anónimo. La tabla resultante es la que se muestra a continuación.

![Columna embebbida](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-columna-embebbida.png)  
  

El siguiente paso es crear una nueva columna personalizada con el contenido de la columna Binary convertido a texto en Base64 y anteponiéndole el texto Â«data:image/jpeg;base64 para que Power BI pueda reconocerla como imagen como se muestra a continuación

![Columna personalizada añadida.](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-columna-personalizada-Escudo-añadida.png)  
  

Eliminamos las columnas URL e Imagen, cambiamos el tipo de datos de la columna Escudo a texto y aplicamos los cambios y cerramos el Editor de Power Query.

![Asignar categoría Dirección URL a la columna- scudo](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-asignar-catagoria-Direccion-URL-a-la-columna-Escudo.png)  
  

Asignamos la categoría Dirección URL de la imagen al campo Escudo y creamos una visualización usando la columna.

Limitaciones de este método:

- Las imágenes se almacenan en un campo de tipo texto, y la [longitud máxima de estos campos en Power BI Desktop](https://docs.microsoft.com/en-us/power-bi/desktop-data-types#text-type) es de 268.435.456 caracteres Unicode (256 mega caracteres) o 536.870.912 bytes por lo que no se puede emplear en imágenes muy grandes.

#### Desde una carpeta

Para este caso las imágenes están en una carpeta del ordenador, usaremos la carpeta local de OneDrive. Desde Power BI Desktop selecciono Obtener datos desde carpeta.

![Obtener datos de carpeta](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-Obtener-datos-de-carpeta.png)  
  

Escribo la ruta de la carpeta de imágenes en OneDrive y a continuación oprimo Aceptar.

En el navegador se muestra una tabla con las imágenes y algunas de sus características. Escojo Editar.

![Navegador con las imágenes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-navegador.png)  
  

En el Editor de Power Query selecciono las columnas Content y Name y elimino el resto de las columnas.

![Editor de Power Query](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-Editor-de-Power-Query.png)  
  

La columna Content contiene las imágenes en formato Binary. Ahora solo necesitamos agregar una columna personalizada que convierta el contenido binario de la columna Content a texto usando una codificación, como en el caso anterior.

![Columna personalizada añadida](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-columna-personalizada-añadida-1.png)  
  

Cambiamos el tipo de dato de la columna Imagen a texto, eliminamos la columna Content. A la columna Name le extraemos el texto antes del delimitador â€œ.â€ Para quedarnos con el nombre de la imagen.

Aplicamos los cambios y cerramos el editor de Power Query.

En la vista de datos seleccionamos la columna Imagen y le asignamos la categoría Dirección URL de la imagen.

Creamos una visualización.

![Visualizar imágenes en un segmentador](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-visualizar-imagenes-en-un-segmentador.png)  
  

En este caso utilizamos las imágenes como segmentador.

Limitaciones de este método:

Las mismas que en el caso anterior.

- Las imágenes se almacenan en un campo de tipo texto, y la [longitud máxima de estos campos en Power BI Desktop](https://docs.microsoft.com/en-us/power-bi/desktop-data-types#text-type) es de 268.435.456 caracteres Unicode (256 mega caracteres) o 536.870.912 bytes por lo que no se puede emplear en imágenes muy grandes.

### Visualizar imágenes en Power BI desde una base de datos SQL Server

SQL Server puede almacenar tanto la URL de la imagen como la propia imagen en formato Binary. Por lo tanto podemos aplicar el primer método, desde una URL, o el tercer método, desde imágenes contenidas en un campo de la consulta.

Puedes ver un ejemplo de columna Binary en la tabla DimProduct de la Base de datos Adventure Works DW.

### Conclusiones

Para visualizar imágenes en Power BI, si las imágenes no son grandes lo mejor es contenerlas en una columna de la tabla en formato binary y luego convertirla a texto en Base64 para que Power BI las reconozca y las pueda utilizar. En el caso de que las imágenes sean grandes lo mejor es utilizar la URL de la imagen.

En ambos casos a la columna hay que asignarle la categoría Dirección URL de la imagen.
