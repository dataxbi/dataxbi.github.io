---
layout: post
title: "Visualizar im�genes en Power BI"
date: 2019-06-11
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "dataviz"
  - "powerbi"
---

Podemos visualizar im�genes en Power BI de dos formas diferentes: teniendo una columna de una tabla que contenga o bien las URL de las im�genes o bien las im�genes en formato de texto.

En esta entrada veremos como importar las im�genes de las dos formas.

<!--more-->

### Visualizar im�genes en Power BI desde una URL

El primer paso ser� almacenar las im�genes en una tabla o consulta.

Si las im�genes que queremos mostrar se encuentran en un sitio p�blico podemos conocer la direcci�n del enlace a la imagen y almacenarla en una tabla con el resto de la informaci�n que necesitemos como el nombre, descripci�n, etc.

Si las im�genes son pocas podemos crear la tabla en Power Query. Por el contrario, si son muchas, la podemos crear en Excel o cualquiera de los otros tipos de archivo que soporta Power BI Desktop y nos conectaremos a ella desde Power Query.

La tabla que utilizaremos en este ejemplo es como la que se muestra a continuaci�n.

![Archivo Excel con URL de im�genes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-Excel-URLs-publicas.png)  
  

Una vez que hemos creado la tabla o nos hemos conectado a ella desde Power Query aplicaremos los cambios realizados y cargaremos los datos en el modelo.

El siguiente paso ser� asignar una categor�a a la columna que contiene la URL de la imagen.

Para ello desde la vista de datos, seleccionamos la tabla Imagen y a continuaci�n la columna URL. En la pesta�a Modelado, dentro del grupo Propiedades escogemos la categor�a de datos Direcci�n URL de la imagen.

![Asignar catagoria Direccion URL de la imagen a columna](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-asignar-catagoria-Direccion-URL-de-la-imagen-a-columna.png)  
  

Ya estamos listos para visualizar las im�genes. En este caso seleccionamos una tabla y los campos a visualizar, entre ellos la URL de la imagen.

![Visualizar im�genes en una tabla](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-visualizar-imagenes-en-una-tabla.png)  
  

Limitaciones de este m�todo:

- Obtener la URL de cada imagen.
- Si no tenemos conexi�n a internet no podemos ver las im�genes en Power BI Desktop.
- Si eliminan las im�genes del servidor donde se encuentra tambi�n la perderemos en nuestros informes.

### Visualizar im�genes en Power BI desde OneDrive

Para este ejemplo, hemos descargado las im�genes desde el sitio web y las hemos almacenado en una Carpeta de OneDrive, como se muestra en la imagen.

![Im�genes en una carpeta de OneDrive](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-imagenes-en-una-carpeta-de-ONEDRIVE.png)  
  

Una opci�n en este caso es buscar la URL de la carpeta de OneDrive y asignarla a una columna de la tabla.

Para obtener la URL de la carpeta abriremos en el navegador el portal de Office y buscaremos la carpeta. Lo m�s sencillo para conocer la ubicaci�n es guardar cualquier documento de office en la carpeta y abrirlo desde el ordenador.

Para el ejemplo he guardado un documento Excel. Seleccionamos el documento office, a continuaci�n, oprimimos el men� de los tres puntos, escogemos Abrir y a continuaci�n Abrir en Excel, como se muestra en la siguiente imagen.

![Carpeta de OneDrive en el portal de Office](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-carpeta-OneDrive.png)  
  

Se abre el documento Excel en el ordenador y a continuaci�n seleccionamos la pesta�a Archivo.

![URL de documento Excel en OneDrive](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-URL-documento-Excel.png)  
  

La URL copiada es la siguiente

![URL de archivo Excel en OneDrive](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-URL-de-archivo-Excel-OneDrive.png)  
  

Eliminaremos el nombre del archivo y todo lo que sigue a continuaci�n.

![URL de la carpeta de im�genes de OneDrive](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-URL-carpeta-de-Imagenes.png)  
  

Nos queda la URL de la carpeta que contiene las im�genes, ahora nos falta a�adirle el nombre del archivo.

Los archivos de im�genes siguen un patr�n en el nombre que podemos observar en la imagen que sigue

![Nombre de los archivos de Im�genes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-nombre.de-los-archivos-de-Imagenes.pn
g)  
  

El nombre de la imagen esta formado por el nombre del equipo y a continuaci�n -150x150.jpg. Como en nuestra tabla tenemos una columna con los nombres de los equipos ser� muy f�cil construir la URL de cada imagen.

En el Editor de Power Query crearemos una columna personalizada a partir de la columna Nombre y a�adi�ndole un prefijo y un sufijo.

![Columna con URL de im�genes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-columna-URL-de-Imagenes.png)  
  

Cerramos y aplicamos los cambios.

Asignamos la categor�a Direcci�n URL de la imagen a la columna URL igual que en el caso anterior y ya estamos listos para visualizar las im�genes.

Igual que en el caso anterior seleccionamos el objeto tabla y varios campos entre ellos la columna URL.

![Power BI Desktop URL de Imagenes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-PowerBI-Desktop-URL-de-Imagenes.png)  
  

Como puedes observar en la imagen anterior, en Power BI Desktop las im�genes no se cargan.

Cuando publicamos el modelo en Power BI Service, las im�genes se pueden ver como puedes apreciar en la siguiente imagen.

![Power BI Service URL de im�genes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-PowerBI-Service-URL-de-Imagenes.png)  
  

Limitaciones de este m�todo:

- Obtener la URL de las im�genes de OneDrive es un poco m�s complicado que en el caso de la URL p�blica.
- Las im�genes no se visualizan en Power BI Desktop.
- No todos los navegadores soportan estas im�genes.

### Visualizar im�genes en Power BI contenidas en un campo de la consulta

Para utilizar este m�todo las im�genes pueden estar almacenadas en una URL, en una carpeta local del ordenador o en un campo binario de SQL.

Estudiaremos cada uno de los casos.

#### Desde URL almacenada en una columna de una tabla.

Usaremos la tabla resultante del primer ejemplo (Imagen3).

El primer paso ser� a�adir una columna calculada con la siguiente f�rmula:

```
Web.Contents([URL])
```

Que convierte la URL en formato binario y lo almacena en un campo de la tabla.

![Contener imagen en columna](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-embeber-imagen-en-columna.png)  
  

Cuando oprimimos el bot�n Aceptar nos pide confirmar las credenciales del usuario, que en este caso es an�nimo. La tabla resultante es la que se muestra a continuaci�n.

![Columna embebbida](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-columna-embebbida.png)  
  

El siguiente paso es crear una nueva columna personalizada con el contenido de la columna Binary convertido a texto en Base64 y anteponi�ndole el texto «data:image/jpeg;base64 para que Power BI pueda reconocerla como imagen como se muestra a continuaci�n

![Columna personalizada a�adida.](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-columna-personalizada-Escudo-a�adida.png)  
  

Eliminamos las columnas URL e Imagen, cambiamos el tipo de datos de la columna Escudo a texto y aplicamos los cambios y cerramos el Editor de Power Query.

![Asignar categor�a Direcci�n URL a la columna- scudo](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-asignar-catagoria-Direccion-URL-a-la-columna-Escudo.png)  
  

Asignamos la categor�a Direcci�n URL de la imagen al campo Escudo y creamos una visualizaci�n usando la columna.

Limitaciones de este m�todo:

- Las im�genes se almacenan en un campo de tipo texto, y la [longitud m�xima de estos campos en Power BI Desktop](https://docs.microsoft.com/en-us/power-bi/desktop-data-types#text-type) es de 268.435.456 caracteres Unicode (256 mega caracteres) o 536.870.912 bytes por lo que no se puede emplear en im�genes muy grandes.

#### Desde una carpeta

Para este caso las im�genes est�n en una carpeta del ordenador, usaremos la carpeta local de OneDrive. Desde Power BI Desktop selecciono Obtener datos desde carpeta.

![Obtener datos de carpeta](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-Obtener-datos-de-carpeta.png)  
  

Escribo la ruta de la carpeta de im�genes en OneDrive y a continuaci�n oprimo Aceptar.

En el navegador se muestra una tabla con las im�genes y algunas de sus caracter�sticas. Escojo Editar.

![Navegador con las im�genes](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-navegador.png)  
  

En el Editor de Power Query selecciono las columnas Content y Name y elimino el resto de las columnas.

![Editor de Power Query](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-Editor-de-Power-Query.png)  
  

La columna Content contiene las im�genes en formato Binary. Ahora solo necesitamos agregar una columna personalizada que convierta el contenido binario de la columna Content a texto usando una codificaci�n, como en el caso anterior.

![Columna personalizada a�adida](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-columna-personalizada-a�adida-1.png)  
  

Cambiamos el tipo de dato de la columna Imagen a texto, eliminamos la columna Content. A la columna Name le extraemos el texto antes del delimitador “.” Para quedarnos con el nombre de la imagen.

Aplicamos los cambios y cerramos el editor de Power Query.

En la vista de datos seleccionamos la columna Imagen y le asignamos la categor�a Direcci�n URL de la imagen.

Creamos una visualizaci�n.

![Visualizar im�genes en un segmentador](/assets/images/posts/2019-06-11-visualizar-imagenes-power-bi/dataXbi-visualizar-imagenes-en-un-segmentador.png)  
  

En este caso utilizamos las im�genes como segmentador.

Limitaciones de este m�todo:

Las mismas que en el caso anterior.

- Las im�genes se almacenan en un campo de tipo texto, y la [longitud m�xima de estos campos en Power BI Desktop](https://docs.microsoft.com/en-us/power-bi/desktop-data-types#text-type) es de 268.435.456 caracteres Unicode (256 mega caracteres) o 536.870.912 bytes por lo que no se puede emplear en im�genes muy grandes.

### Visualizar im�genes en Power BI desde una base de datos SQL Server

SQL Server puede almacenar tanto la URL de la imagen como la propia imagen en formato Binary. Por lo tanto podemos aplicar el primer m�todo, desde una URL, o el tercer m�todo, desde im�genes contenidas en un campo de la consulta.

Puedes ver un ejemplo de columna Binary en la tabla DimProduct de la Base de datos Adventure Works DW.

### Conclusiones

Para visualizar im�genes en Power BI, si las im�genes no son grandes lo mejor es contenerlas en una columna de la tabla en formato binary y luego convertirla a texto en Base64 para que Power BI las reconozca y las pueda utilizar. En el caso de que las im�genes sean grandes lo mejor es utilizar la URL de la imagen.

En ambos casos a la columna hay que asignarle la categor�a Direcci�n URL de la imagen.
