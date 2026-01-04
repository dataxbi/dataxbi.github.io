---
layout: post
title: "Tips para organizar las consultas Power Query - Parte 1"
date: 2022-12-14
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

Esta es la primera de cuatro entradas que dedicaremos a las buenas pr�cticas para la organizaci�n de las consultas en el editor de Power Query. En esta ocasi�n estaremos hablando sobre cuatro recomendaciones que consideramos imprescindibles en cualquier modelo: par�metros, carpetas, renombrar pasos y a�adir descripciones.

<!--more-->

Los otros art�culos de la serie:

- [Parte 2](https://www.dataxbi.com/blog/2023/04/04/tips-para-organizar-las-consultas-power-query-parte-2/)
- [Parte 3](https://www.dataxbi.com/blog/2023/08/24/tips-para-organizar-las-consultas-power-query-parte-3/)
- [Parte 4](https://www.dataxbi.com/blog/2023/08/29/tips-para-organizar-las-consultas-power-query-parte-4/)

En nuestra presentaci�n en los Power BI Days de Madrid, [Tips para la organizaci�n de consultas Power Query](https://www.linkedin.com/feed/update/urn:li:activity:7002248722969452544/), estuvimos hablando sobre este tema, pero el tiempo se hizo corto y quedaron muchos detalles por explicar y por esa raz�n hoy comenzamos esta serie.

Para que se comprendan mejor estas recomendaciones las iremos mostrando a trav�s de un ejemplo. Para el ejemplo hemos creado una empresa ficticia, MediaMart, que se dedica a las ventas de ordenadores. La empresa tiene tiendas f�sicas en todo el pa�s, los productos se agrupan en subcategor�as y categor�as y se tiene informaci�n de los clientes y los vendedores. Se tienen adem�s los datos de los presupuestos por mes de cada tienda de los �ltimos 4 a�os.

Nuestro objetivo es crear un informe que analice las ventas por: ubicaci�n geogr�fica, crecimiento respecto al a�o anterior, cumplimiento de los presupuestos, grupo de edad de clientes, tiendas y vendedores.

Despu�s de analizar los requerimientos obtuvimos el siguiente modelo:

![dataXbi-Modelo-Datos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Modelo.png)  
  

Una vez dise�ado el modelo, pasamos a conocer los or�genes de datos a los que nos conectaremos para crear las consultas.

## Or�genes de datos

- Un archivo Excel
- Una carpeta
- Tres enlaces a los datos abiertos del INE (Instituto Nacional de Estad�sticas)

Tanto el archivo Excel como la carpeta est�n almacenados en el sitio de SharePoint de la empresa.

![dataXbi-Or�genes de datos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Origenes.png)

  
  
El archivo Excel se llama **ventas.xlsx**, la informaci�n que contiene fue extra�da del CRM de la empresa y tiene siete hojas:

- Ventas
- Clientes
- Productos
- Tiendas
- Vendedores
- Categorias
- Subcategorias

En la siguiente imagen tienes una vista de la hoja Ventas:

![dataXbi-Origen Excel-Ventas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Excel.png)  
  

Como te habr�s dado cuenta los datos no est�n almacenados en una tabla, sino que est�n en un rango de celdas de la hoja. Lo mismo ocurre con el resto de las hojas de este Excel, debajo te dejo una muestra de cada una para que te familiarices con los datos.

![dataXbi - Excel - Hoja Clientes](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Clientes.png)  
  
![dataXbi - Excel - Hoja Productos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Productos.png)  
  
![dataXbi - Excel - Hoja Tiendas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Tiendas.png)  
  
![dataXbi - Excel - Hoja Vendedores](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Vendedores.png)  
  
![dataXbi - Excel - Hoja Categoria](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Categorias.png)  
  
![dataXbi - Excel - Hoja Subcategoria](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Subcategorias.png)  
  

El segundo origen, la carpeta, se llama presupuestos y contiene un archivo Excel por cada mes y a�o con los presupuestos de ese mes para cada tienda. Todos los archivos tienen la misma estructura, que puedes veren la siguiente imagen correspondiente al archivo **presupuestos 2018-01.xlsx**.

![dataXbi-presupuestos-origen-carpeta](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Carpeta-SharePoint-Ejemplo-Archivo.png)  
  

Los siguientes tres or�genes son enlaces a p�ginas del [INE](https://www.ine.es/) que contienen la informaci�n de las comunidades aut�nomas, las provincias y los municipios de Espa�a y son las siguientes:

[Relaci�n de comunidades y ciudades aut�nomas con sus c�digos](https://www.ine.es/daco/daco42/codmun/cod_ccaa.htm) (contiene una tabla con los c�digos y nombres de las comunidades aut�nomas)

[Relaci�n de provincias con sus c�digos](https://www.ine.es/daco/daco42/codmun/cod_provincia.htm) (contiene tres tablas con los c�digos y nombres de las provincias)

[Relaci�n de municipios](http://www.ine.es/daco/daco42/codmun/codmun20/20codmun.xlsx) (un fichero Excel que contiene los c�digos y los nombres de los municipios, as� como el c�digo de la provincia y la comunidad aut�noma a la que pertenece)

Estos or�genes no los vamos a mostrar pero puedes descargarte el modelo final y podr�s ver tanto la conexi�n como las transformaciones realizadas.

## Conexi�n a los or�genes de datos

Una vez analizados los or�genes de datos el siguiente paso es conectarnos a ellos utilizando el conector m�s apropiado en cada caso.

Como hemos mencionado anteriormente los datos del archivo ventas.xlsx han sido extra�dos del CRM de la empresa, la ubicaci�n del archivo es temporal ya sea porque cuando el informe este listo se conecte directamente a la base de datos SQL Server que contiene estos datos o porque el archivo se cambie de ubicaci�n. Esto pasa con mucha frecuencia y la soluci�n a este problema es nuestro primer tip:

## Primer tip: Crear par�metros de consulta para los or�genes de datos

Los par�metros nos ayudan a cambiar el origen de datos de una manera r�pida y f�cil.

Existen or�genes de datos que nos permiten conectarnos utilizando par�metros, incluso podemos crear el par�metro en el momento de la conexi�n. Ejemplos de estos conectores son precisamente las p�ginas Web y las carpetas, que son los que requerimos en nuestro ejemplo.

Otros conectores en cambio no lo permiten, entre ellos los archivos Excel, y en estos casos a pesar de que no podemos utilizar par�metros en el momento de conectarnos podemos hacerlo posteriormente, configurando el paso Origen de la consulta y sustituyendo los valores de la conexi�n por par�metros.

Supongamos que en este ejemplo para conectarnos al archivo Excel no utilizamos par�metros, cuando el informe este listo y haya que cambiar la ubicaci�n del archivo o el origen necesitaremos modificar el paso Origen de cada una de las siete consultas. En cambio si hemos utilizado par�metros solo tendr�amos que modificar el valor de los par�metros y autom�ticamente todas las consultas se actualizar�an. Esta es una de las ventajas principales del uso de par�metros de consulta.

Si quieres conocer m�s acerca del uso de los par�metros de consulta te invitamos a que revises la entrada de este blog [Par�metros de consulta](https://www.dataxbi.com/blog/2019/07/11/parametros-de-consulta/) y el video [Mejorando la Productividad con Par�metros en Power BI](https://www.youtube.com/watch?v=8xvH5JxMbMQ) del canal de Power Platform Espa�a.

Para nuestro ejemplo crearemos tres par�metros:

- URL del sitio de SharePoint
- carpeta Documentos compartidos, donde est�n almacenados tanto el archivo ventas como la carpeta presupuestos
- carpeta presupuestos

Este paso lo haremos desde el Editor de Power Query, en el men� Inicio, dentro del grupo Par�metros, seleccionamos la opci�n Nuevo par�metro.

![dataXbi-Crear-par�metro](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Nuevo-Parametro.png)  
  

Se abre la ventana del Administrador de par�metros y debemos especificar el nombre, el tipo de dato, si es requerido o no y el valor que le asignaremos por defecto.

![dataXbi-Par�metro-URLSharePoint](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Nuevo-Parametro-Configuracion.png)  
  

Desde el Administrador de par�metros creamos dos nuevos par�metros, uno para la carpeta datos y otro para la carpeta presupuestos.

![dataXbi-Par�metros](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Nuevo-Parametro-Carpeta-Presupuestos.png)  
  

En la imagen que se muestra a continuaci�n puedes ver los par�metros creados en el panel de consultas del Editor de Power Query:

![dataXbi - Par�metros sin agrupar](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Parametros-Sin-Agrupar.png)  
  

En este caso tenemos tres consultas pero imagina que tuvi�ramos un escenario como el siguiente:

![dataXbi - Consultas sin carpetas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-sin-carpetas.png)  
  

Y quisieras modificar un paso de la consulta Tiendas y cambiar la ubicaci�n del archivo Excel ventas.xlsx. A�n con par�metros estos cambios podr�an tomar m�s tiempo del necesario al no estar organizadas las consultas y en este ejemplo a�n son pocas consultas, probablemente te habr�s encontrado alg�n otro escenario mucho peor. Imag�nate adem�s que ha pasado un tiempo desde que creaste las consultas, pues ser� a�n peor, probablemente no recordar�s porque hiciste cada paso. De aqu� nuestra segunda recomendaci�n que debemos implementar desde el mismo momento en que creemos la primera consulta, aunque solo tengamos par�metros como en nuestro modelo de ejemplo.

## Segundo tip: Agrupar los objetos dentro del panel de consultas del editor de Power Query

Para agrupar los objetos usaremos carpetas, como m�nimo una para cada tipo de objeto. Las carpetas permiten que las consultas est�n organizadas y podamos encontrarlas f�cilmente. Nuestro objetivo es que las consultas de nuestro ejemplo se muestren organizadas como en la siguiente imagen.

![dataXbi - Consultas en carpetas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-con-carpetas.png)  
  

Como puedes ver hemos creado la carpeta Par�metros que contiene los tres par�metros. Adem�s hemos credo la carpeta Modelo con las consultas que ir�n al modelo y la hemos dividido en dos: Hechos y Dimensiones. De esta manera es muy f�cil identificar cada tipo de consulta. Tambi�n hemos creado una carpeta de consultas Intermedias que no ir�n al modelo pero que son necesarias para crear las del modelo. Esta carpeta la hemos subdividido en dos dependiendo de cada origen de datos, as� tenemos una carpeta para las consultas que vienen del INE y otra para las que vienen del archivo Excel.

Te puedes dar cuenta que con esta organizaci�n es mucho m�s f�cil identificar el par�metro que hay que actualizar y la consulta a modificar.

Despu�s de creados los par�metros pasamos a conectarnos a cada uno de los or�genes de datos. El primer origen de datos al que nos conectaremos ser� el libro ventas.xlsx utilizando el conector Web.

![dataXbi - Conector Web](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Conector-Web.png)  
  

Una vez seleccionado el conector se abre el cuadro de di�logo **De web** donde debemos especificar la ruta del archivo. Como indica el men� delante de la caja de texto este conector soporta el uso de par�metros.

![dataXbi - Conector Web Configuraci�n](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origenWeb.png)  
  

Seleccionamos la opci�n Uso avanzado y separamos la URL en tramos utilizando los par�metros **URL SharePoint** y **Carpeta SharePoint** y el nombre del archivo como se muestra en la siguiente imagen. Tambi�n podr�amos parametrizar el nombre del archivo, as� si cambia el nombre solo ser�a reemplazarlo en el par�metro y actualizar las consultas.

![dataXbi - Conector Web - Configuraci�n Avanzada](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Conector-Web-parametrizado.png)  
  

Una vez configurado cada tramo de la cadena de conexi�n oprimimos el bot�n Aceptar, la consulta se conecta al archivo y nos muestra el contenido en la ventana Navegador. Seleccionamos todas las consultas como se muestra en la imagen de abajo:

![dataXbi - Seleccionar or�genes de consultas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Web-Navegador.png)  
  

Como resultado se crean las siete consultas que puedes ver en la siguiente imagen.

![dataXbi - Consultas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-creadas-1.png)  
  

## Transformar consultas

El siguiente paso es realizar transformaciones en cada una de las consultas que se obtuvieron de este origen hasta obtener los datos requeridos por el modelo con el formato adecuado. Cada transformaci�n se convierte en un paso de consulta que podemos ver en el panel de Configuraci�n de la consulta. Por lo general los nombres de los pasos nos dice que transformaci�n se est� aplicando pero no dan muchos detalles como se puede ver en la siguiente imagen.

![dataXbi - Pasos de una consulta](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-pasos.png)  
  

De aqu� a un tiempo si volvemos a revisar la consulta no sabremos que columna se cre� ni que columna se elimin� de aqu� nuestra tercera recomendaci�n.

## Tercer tip: Renombrar los pasos de las consultas

En este tip te recomendamos renombrar aquellos pasos cuyo nombre no indique claramente la transformaci�n realizada ni las columnas involucradas. Veamos algunos ejemplos:

Consulta Clientes:

![dataXbi - Consulta Clientes](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes.png)  
  

En esta consulta queremos obtener la edad del cliente a partir de la fecha de nacimiento para ello realizaremos una serie de transformaciones sobre la columna Fecha Nacimiento.

Primera transformaci�n: Utilizaremos la funci�n Antigüedad para transformar la columna Fecha Nacimiento y obtener as� la edad en d�as:

![dataXbi - Clientes - Calcular Edad en duraci�n](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes-Calcular-Edad-en-dias-calculada.png)  
  

Segunda transformaci�n: Utilizando la transformaci�n Total A�os del tipo Duraci�n convertiremos los d�as en A�os.

![dataXbi - Clientes - Edad en a�os](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes-Calcular-Edad-dias-a-a�os-calculada.png)

  
  
Tercera transformaci�n: Devolveremos la edad como un n�mero entero utilizando la funci�n matem�tica Redondeo a la baja.

![dataXbi - Clientes - Edad redondeada](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes-Calcular-Edad-redondeo-calculado-1.png)  
  

Cuarta transformaci�n: Cambiar el nombre de la columna por Edad que a�ade el paso Columnas con nombre cambiado.

![dataXbi - Clientes - Edad renombrar columna](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes-Calcular-Edad-renombrar-columna.png)  
  

Los �ltimos 4 pasos corresponden a transformaciones que hemos realizado para obtener la edad del cliente. Vamos a renombrar todos estos pasos para que quede claro que est�n relacionados y que tiene que ver con la misma columna. Primero escribiremos el nombre de la columna, en este caso Edad y luego escribiremos un guion y a continuaci�n el nombre de la transformaci�n.

En la imagen se muestra como se han renombrado cada uno de los pasos

![dataXbi - Clientes - Pasos renombrados](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes-Calcular-Edad-renombrar-pasos.png)  
  

Ahora cada vez que tengamos que a�adir pasos o modificar los que ya existen quedar� claro que todas estas transformaciones est�n relacionadas y no tendremos dificultad en recordar lo que hicimos en cualquier momento.

Otro ejemplo en el que puede ayudar el renombrar los pasos es cuando combinamos consultas.

En este caso mostraremos la consulta Producto una vez que se ha combinado con las consultas Subcategorias y Categorias. Si se fijan en la siguiente imagen donde se muestra la consulta podr�n ver que los nombres que corresponden a esos pasos no son lo suficientemente descriptivos para que de aqu� a un tiempo nos acordemos con que consultas combinamos y que campos nos trajimos de esas consultas.

![dataXbi - Consulta Productos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consulta-Productos.png)  
  

Si sustituimos los nombres de los �ltimos cuatro pasos por los siguientes todo quedar� mucho m�s claro.

![dataXbi - Productos - Renombrar pasos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-Productos-Expandir-Consultas.png)  
  

A�n con los pasos renombrados puede ser que no sea evidente el objetivo que perseguimos con esas transformaciones o que existan pasos que no est�n lo suficientemente claros, para estos casos va la �ltima recomendaci�n de esta entrada.

## Cuarto tip: A�adir descripciones a los pasos de las consultas

Estas descripciones nos ayudar�n cuando el nombre del paso no alcance a mostrarse completamente porque el n�mero de caracteres visibles es menor que su longitud o no alcancen para describir todo lo que hemos hecho en el paso.

Para ilustrar este tip volveremos a la consulta Clientes y en el primer paso para el c�lculo de la edad a�adiremos una descripci�n del objetivo de las transformaciones. Para ello seleccionamos el paso Edad – Antigüedad calculada y desplegamos el men� asociado seleccionando la opci�n propiedades.

![dataXbi - Clientes - A�adir comentario](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-Clientes-Calcular-Edad-a�adir-comentario.png)  
  

Y en el cuadro de texto Descripci�n escribimos el comentario.

![dataXbi - Clientes - A�adir comentario](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-Clientes-Calcular-Edad-comentario.png)  
  

Ahora, a la derecha del paso, se muestra un icono de informaci�n y si nos acercamos con el rat�n podemos ver la descripci�n que escribimos:

![dataXbi - Clientes - A�adir comentario](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-Clientes-Calcular-Edad-visualizar-comentario.png)  
  

Para concluir queremos proponerte una �ltima idea que entra dentro del tip Renombrar los pasos de las consultas y que consiste en a�adir caracteres Unicode como parte del nombre del paso.

Aunque Power Query permite que utilicemos caracteres Unicode en los nombres de los pasos, y en los nombres de las variables en general, puede que otras herramientas que utilicemos en nuestro flujo de trabajo no lo soporten, por ejemplo, herramientas de documentaci�n o de control de versiones o editores de texto. **Por lo que te recomendamos que seas cuidadoso al utilizar emoticones y dem�s en los nombres de los pasos**.

Si has trabajado alguna vez con flujos en el servicio de Power BI te habr�s fijado que todos los pasos tienen un icono delante del nombre del paso que nos indica el tipo de transformaci�n que se ha realizado. Debajo tienes una imagen de como se ver�a la consulta Productos si la hubi�ramos realizado con un flujo de datos.

![dataXbi - Productos - Flujos de datos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consuttas-Productos-Flujos.png)  
  

Como no tenemos caracteres Unicode con las im�genes del flujo, hemos buscado dentro de los caracteres disponibles aquellos que nos parecen m�s adecuados para representar los pasos que consideramos dentro de los m�s usados y que te mostramos en la siguiente tabla.

| Paso | Unicode | Imagen |
| --- | --- | --- |
| Origen | #(221E) | ∞ |
| Encabezados promovidos | #(25ª6) | ▦ |
| Tipo cambiado | #(21E5) | ⇥ |
| Elegir columnas | #(25A4) | ▤ |
| Combinar consultas | #(27D5) | ⟕ |
| Expandir columnas | #(2194) | ↔ |

Para a�adir la imagen o el c�digo Unicode a cada paso debes abrir el Editor Avanzado de Power Query y modificar los pasos como se muestra en la imagen:

![dataXbi - Productos -Iconos - Editor Avanzado](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consuttas-Productos-Iconos-Editor-Avanzado.png)  
  

Una vez hechos los cambios y cerrado el Editor Avanzado los pasos deber�an quedarte como se muestran en la siguiente imagen.

![dataXbi - Productos Iconos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consuttas-Productos-Iconos.png)  
  

Mientras el Editor de Power Query no soporte esta caracter�stica puedes hacer uso de este mapeo o crear el tuyo propio para identificar r�pidamente las transformaciones m�s frecuentes que realizas en tus consultas.

Y esto es todo por hoy, esperamos que puedas aplicar estos tips en tus consultas y que si tienes alg�n otro que utilices en tus informes nos lo escribas en los comentarios.
