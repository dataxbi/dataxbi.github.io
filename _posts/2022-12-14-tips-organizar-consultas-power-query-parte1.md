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

Esta es la primera de cuatro entradas que dedicaremos a las buenas prácticas para la organización de las consultas en el editor de Power Query. En esta ocasión estaremos hablando sobre cuatro recomendaciones que consideramos imprescindibles en cualquier modelo: parámetros, carpetas, renombrar pasos y añadir descripciones.

<!--more-->

Los otros artículos de la serie:

- [Parte 2](https://www.dataxbi.com/blog/2023/04/04/tips-para-organizar-las-consultas-power-query-parte-2/)
- [Parte 3](https://www.dataxbi.com/blog/2023/08/24/tips-para-organizar-las-consultas-power-query-parte-3/)
- [Parte 4](https://www.dataxbi.com/blog/2023/08/29/tips-para-organizar-las-consultas-power-query-parte-4/)

En nuestra presentación en los Power BI Days de Madrid, [Tips para la organización de consultas Power Query](https://www.linkedin.com/feed/update/urn:li:activity:7002248722969452544/), estuvimos hablando sobre este tema, pero el tiempo se hizo corto y quedaron muchos detalles por explicar y por esa razón hoy comenzamos esta serie.

Para que se comprendan mejor estas recomendaciones las iremos mostrando a través de un ejemplo. Para el ejemplo hemos creado una empresa ficticia, MediaMart, que se dedica a las ventas de ordenadores. La empresa tiene tiendas físicas en todo el país, los productos se agrupan en subcategorías y categorías y se tiene información de los clientes y los vendedores. Se tienen además los datos de los presupuestos por mes de cada tienda de los últimos 4 años.

Nuestro objetivo es crear un informe que analice las ventas por: ubicación geográfica, crecimiento respecto al año anterior, cumplimiento de los presupuestos, grupo de edad de clientes, tiendas y vendedores.

Después de analizar los requerimientos obtuvimos el siguiente modelo:

![dataXbi-Modelo-Datos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Modelo.png)  
  

Una vez diseñado el modelo, pasamos a conocer los orígenes de datos a los que nos conectaremos para crear las consultas.

## Orígenes de datos

- Un archivo Excel
- Una carpeta
- Tres enlaces a los datos abiertos del INE (Instituto Nacional de Estadísticas)

Tanto el archivo Excel como la carpeta están almacenados en el sitio de SharePoint de la empresa.

![dataXbi-Orígenes de datos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Origenes.png)

  
  
El archivo Excel se llama **ventas.xlsx**, la información que contiene fue extraída del CRM de la empresa y tiene siete hojas:

- Ventas
- Clientes
- Productos
- Tiendas
- Vendedores
- Categorias
- Subcategorias

En la siguiente imagen tienes una vista de la hoja Ventas:

![dataXbi-Origen Excel-Ventas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Excel.png)  
  

Como te habrás dado cuenta los datos no están almacenados en una tabla, sino que están en un rango de celdas de la hoja. Lo mismo ocurre con el resto de las hojas de este Excel, debajo te dejo una muestra de cada una para que te familiarices con los datos.

![dataXbi - Excel - Hoja Clientes](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Clientes.png)  
  
![dataXbi - Excel - Hoja Productos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Productos.png)  
  
![dataXbi - Excel - Hoja Tiendas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Tiendas.png)  
  
![dataXbi - Excel - Hoja Vendedores](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Vendedores.png)  
  
![dataXbi - Excel - Hoja Categoria](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Categorias.png)  
  
![dataXbi - Excel - Hoja Subcategoria](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-Excel-Subcategorias.png)  
  

El segundo origen, la carpeta, se llama presupuestos y contiene un archivo Excel por cada mes y año con los presupuestos de ese mes para cada tienda. Todos los archivos tienen la misma estructura, que puedes veren la siguiente imagen correspondiente al archivo **presupuestos 2018-01.xlsx**.

![dataXbi-presupuestos-origen-carpeta](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Carpeta-SharePoint-Ejemplo-Archivo.png)  
  

Los siguientes tres orígenes son enlaces a páginas del [INE](https://www.ine.es/) que contienen la información de las comunidades autónomas, las provincias y los municipios de España y son las siguientes:

[Relación de comunidades y ciudades autónomas con sus códigos](https://www.ine.es/daco/daco42/codmun/cod_ccaa.htm) (contiene una tabla con los códigos y nombres de las comunidades autónomas)

[Relación de provincias con sus códigos](https://www.ine.es/daco/daco42/codmun/cod_provincia.htm) (contiene tres tablas con los códigos y nombres de las provincias)

[Relación de municipios](http://www.ine.es/daco/daco42/codmun/codmun20/20codmun.xlsx) (un fichero Excel que contiene los códigos y los nombres de los municipios, así como el código de la provincia y la comunidad autónoma a la que pertenece)

Estos orígenes no los vamos a mostrar pero puedes descargarte el modelo final y podrás ver tanto la conexión como las transformaciones realizadas.

## Conexión a los orígenes de datos

Una vez analizados los orígenes de datos el siguiente paso es conectarnos a ellos utilizando el conector más apropiado en cada caso.

Como hemos mencionado anteriormente los datos del archivo ventas.xlsx han sido extraídos del CRM de la empresa, la ubicación del archivo es temporal ya sea porque cuando el informe este listo se conecte directamente a la base de datos SQL Server que contiene estos datos o porque el archivo se cambie de ubicación. Esto pasa con mucha frecuencia y la solución a este problema es nuestro primer tip:

## Primer tip: Crear parámetros de consulta para los orígenes de datos

Los parámetros nos ayudan a cambiar el origen de datos de una manera rápida y fácil.

Existen orígenes de datos que nos permiten conectarnos utilizando parámetros, incluso podemos crear el parámetro en el momento de la conexión. Ejemplos de estos conectores son precisamente las páginas Web y las carpetas, que son los que requerimos en nuestro ejemplo.

Otros conectores en cambio no lo permiten, entre ellos los archivos Excel, y en estos casos a pesar de que no podemos utilizar parámetros en el momento de conectarnos podemos hacerlo posteriormente, configurando el paso Origen de la consulta y sustituyendo los valores de la conexión por parámetros.

Supongamos que en este ejemplo para conectarnos al archivo Excel no utilizamos parámetros, cuando el informe este listo y haya que cambiar la ubicación del archivo o el origen necesitaremos modificar el paso Origen de cada una de las siete consultas. En cambio si hemos utilizado parámetros solo tendríamos que modificar el valor de los parámetros y automáticamente todas las consultas se actualizarían. Esta es una de las ventajas principales del uso de parámetros de consulta.

Si quieres conocer más acerca del uso de los parámetros de consulta te invitamos a que revises la entrada de este blog [Parámetros de consulta](https://www.dataxbi.com/blog/2019/07/11/parametros-de-consulta/) y el video [Mejorando la Productividad con Parámetros en Power BI](https://www.youtube.com/watch?v=8xvH5JxMbMQ) del canal de Power Platform España.

Para nuestro ejemplo crearemos tres parámetros:

- URL del sitio de SharePoint
- carpeta Documentos compartidos, donde están almacenados tanto el archivo ventas como la carpeta presupuestos
- carpeta presupuestos

Este paso lo haremos desde el Editor de Power Query, en el menú Inicio, dentro del grupo Parámetros, seleccionamos la opción Nuevo parámetro.

![dataXbi-Crear-parámetro](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Nuevo-Parametro.png)  
  

Se abre la ventana del Administrador de parámetros y debemos especificar el nombre, el tipo de dato, si es requerido o no y el valor que le asignaremos por defecto.

![dataXbi-Parámetro-URLSharePoint](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Nuevo-Parametro-Configuracion.png)  
  

Desde el Administrador de parámetros creamos dos nuevos parámetros, uno para la carpeta datos y otro para la carpeta presupuestos.

![dataXbi-Parámetros](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Nuevo-Parametro-Carpeta-Presupuestos.png)  
  

En la imagen que se muestra a continuación puedes ver los parámetros creados en el panel de consultas del Editor de Power Query:

![dataXbi - Parámetros sin agrupar](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Parametros-Sin-Agrupar.png)  
  

En este caso tenemos tres consultas pero imagina que tuviéramos un escenario como el siguiente:

![dataXbi - Consultas sin carpetas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-sin-carpetas.png)  
  

Y quisieras modificar un paso de la consulta Tiendas y cambiar la ubicación del archivo Excel ventas.xlsx. Aún con parámetros estos cambios podrían tomar más tiempo del necesario al no estar organizadas las consultas y en este ejemplo aún son pocas consultas, probablemente te habrás encontrado algún otro escenario mucho peor. Imagínate además que ha pasado un tiempo desde que creaste las consultas, pues será aún peor, probablemente no recordarás porque hiciste cada paso. De aquí nuestra segunda recomendación que debemos implementar desde el mismo momento en que creemos la primera consulta, aunque solo tengamos parámetros como en nuestro modelo de ejemplo.

## Segundo tip: Agrupar los objetos dentro del panel de consultas del editor de Power Query

Para agrupar los objetos usaremos carpetas, como mínimo una para cada tipo de objeto. Las carpetas permiten que las consultas estén organizadas y podamos encontrarlas fácilmente. Nuestro objetivo es que las consultas de nuestro ejemplo se muestren organizadas como en la siguiente imagen.

![dataXbi - Consultas en carpetas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-con-carpetas.png)  
  

Como puedes ver hemos creado la carpeta Parámetros que contiene los tres parámetros. Además hemos credo la carpeta Modelo con las consultas que irán al modelo y la hemos dividido en dos: Hechos y Dimensiones. De esta manera es muy fácil identificar cada tipo de consulta. También hemos creado una carpeta de consultas Intermedias que no irán al modelo pero que son necesarias para crear las del modelo. Esta carpeta la hemos subdividido en dos dependiendo de cada origen de datos, así tenemos una carpeta para las consultas que vienen del INE y otra para las que vienen del archivo Excel.

Te puedes dar cuenta que con esta organización es mucho más fácil identificar el parámetro que hay que actualizar y la consulta a modificar.

Después de creados los parámetros pasamos a conectarnos a cada uno de los orígenes de datos. El primer origen de datos al que nos conectaremos será el libro ventas.xlsx utilizando el conector Web.

![dataXbi - Conector Web](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Conector-Web.png)  
  

Una vez seleccionado el conector se abre el cuadro de diálogo **De web** donde debemos especificar la ruta del archivo. Como indica el menú delante de la caja de texto este conector soporta el uso de parámetros.

![dataXbi - Conector Web Configuración](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origenWeb.png)  
  

Seleccionamos la opción Uso avanzado y separamos la URL en tramos utilizando los parámetros **URL SharePoint** y **Carpeta SharePoint** y el nombre del archivo como se muestra en la siguiente imagen. También podríamos parametrizar el nombre del archivo, así si cambia el nombre solo sería reemplazarlo en el parámetro y actualizar las consultas.

![dataXbi - Conector Web - Configuración Avanzada](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Conector-Web-parametrizado.png)  
  

Una vez configurado cada tramo de la cadena de conexión oprimimos el botón Aceptar, la consulta se conecta al archivo y nos muestra el contenido en la ventana Navegador. Seleccionamos todas las consultas como se muestra en la imagen de abajo:

![dataXbi - Seleccionar orígenes de consultas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-origen-Web-Navegador.png)  
  

Como resultado se crean las siete consultas que puedes ver en la siguiente imagen.

![dataXbi - Consultas](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-creadas-1.png)  
  

## Transformar consultas

El siguiente paso es realizar transformaciones en cada una de las consultas que se obtuvieron de este origen hasta obtener los datos requeridos por el modelo con el formato adecuado. Cada transformación se convierte en un paso de consulta que podemos ver en el panel de Configuración de la consulta. Por lo general los nombres de los pasos nos dice que transformación se está aplicando pero no dan muchos detalles como se puede ver en la siguiente imagen.

![dataXbi - Pasos de una consulta](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-pasos.png)  
  

De aquí a un tiempo si volvemos a revisar la consulta no sabremos que columna se creó ni que columna se eliminó de aquí nuestra tercera recomendación.

## Tercer tip: Renombrar los pasos de las consultas

En este tip te recomendamos renombrar aquellos pasos cuyo nombre no indique claramente la transformación realizada ni las columnas involucradas. Veamos algunos ejemplos:

Consulta Clientes:

![dataXbi - Consulta Clientes](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes.png)  
  

En esta consulta queremos obtener la edad del cliente a partir de la fecha de nacimiento para ello realizaremos una serie de transformaciones sobre la columna Fecha Nacimiento.

Primera transformación: Utilizaremos la función AntigÃ¼edad para transformar la columna Fecha Nacimiento y obtener así la edad en días:

![dataXbi - Clientes - Calcular Edad en duración](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes-Calcular-Edad-en-dias-calculada.png)  
  

Segunda transformación: Utilizando la transformación Total Años del tipo Duración convertiremos los días en Años.

![dataXbi - Clientes - Edad en años](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes-Calcular-Edad-dias-a-años-calculada.png)

  
  
Tercera transformación: Devolveremos la edad como un número entero utilizando la función matemática Redondeo a la baja.

![dataXbi - Clientes - Edad redondeada](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes-Calcular-Edad-redondeo-calculado-1.png)  
  

Cuarta transformación: Cambiar el nombre de la columna por Edad que añade el paso Columnas con nombre cambiado.

![dataXbi - Clientes - Edad renombrar columna](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes-Calcular-Edad-renombrar-columna.png)  
  

Los últimos 4 pasos corresponden a transformaciones que hemos realizado para obtener la edad del cliente. Vamos a renombrar todos estos pasos para que quede claro que están relacionados y que tiene que ver con la misma columna. Primero escribiremos el nombre de la columna, en este caso Edad y luego escribiremos un guion y a continuación el nombre de la transformación.

En la imagen se muestra como se han renombrado cada uno de los pasos

![dataXbi - Clientes - Pasos renombrados](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consutas-Clientes-Calcular-Edad-renombrar-pasos.png)  
  

Ahora cada vez que tengamos que añadir pasos o modificar los que ya existen quedará claro que todas estas transformaciones están relacionadas y no tendremos dificultad en recordar lo que hicimos en cualquier momento.

Otro ejemplo en el que puede ayudar el renombrar los pasos es cuando combinamos consultas.

En este caso mostraremos la consulta Producto una vez que se ha combinado con las consultas Subcategorias y Categorias. Si se fijan en la siguiente imagen donde se muestra la consulta podrán ver que los nombres que corresponden a esos pasos no son lo suficientemente descriptivos para que de aquí a un tiempo nos acordemos con que consultas combinamos y que campos nos trajimos de esas consultas.

![dataXbi - Consulta Productos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consulta-Productos.png)  
  

Si sustituimos los nombres de los últimos cuatro pasos por los siguientes todo quedará mucho más claro.

![dataXbi - Productos - Renombrar pasos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-Productos-Expandir-Consultas.png)  
  

Aún con los pasos renombrados puede ser que no sea evidente el objetivo que perseguimos con esas transformaciones o que existan pasos que no estén lo suficientemente claros, para estos casos va la última recomendación de esta entrada.

## Cuarto tip: Añadir descripciones a los pasos de las consultas

Estas descripciones nos ayudarán cuando el nombre del paso no alcance a mostrarse completamente porque el número de caracteres visibles es menor que su longitud o no alcancen para describir todo lo que hemos hecho en el paso.

Para ilustrar este tip volveremos a la consulta Clientes y en el primer paso para el cálculo de la edad añadiremos una descripción del objetivo de las transformaciones. Para ello seleccionamos el paso Edad â€“ AntigÃ¼edad calculada y desplegamos el menú asociado seleccionando la opción propiedades.

![dataXbi - Clientes - Añadir comentario](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-Clientes-Calcular-Edad-añadir-comentario.png)  
  

Y en el cuadro de texto Descripción escribimos el comentario.

![dataXbi - Clientes - Añadir comentario](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-Clientes-Calcular-Edad-comentario.png)  
  

Ahora, a la derecha del paso, se muestra un icono de información y si nos acercamos con el ratón podemos ver la descripción que escribimos:

![dataXbi - Clientes - Añadir comentario](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consultas-Clientes-Calcular-Edad-visualizar-comentario.png)  
  

Para concluir queremos proponerte una última idea que entra dentro del tip Renombrar los pasos de las consultas y que consiste en añadir caracteres Unicode como parte del nombre del paso.

Aunque Power Query permite que utilicemos caracteres Unicode en los nombres de los pasos, y en los nombres de las variables en general, puede que otras herramientas que utilicemos en nuestro flujo de trabajo no lo soporten, por ejemplo, herramientas de documentación o de control de versiones o editores de texto. **Por lo que te recomendamos que seas cuidadoso al utilizar emoticones y demás en los nombres de los pasos**.

Si has trabajado alguna vez con flujos en el servicio de Power BI te habrás fijado que todos los pasos tienen un icono delante del nombre del paso que nos indica el tipo de transformación que se ha realizado. Debajo tienes una imagen de como se vería la consulta Productos si la hubiéramos realizado con un flujo de datos.

![dataXbi - Productos - Flujos de datos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consuttas-Productos-Flujos.png)  
  

Como no tenemos caracteres Unicode con las imágenes del flujo, hemos buscado dentro de los caracteres disponibles aquellos que nos parecen más adecuados para representar los pasos que consideramos dentro de los más usados y que te mostramos en la siguiente tabla.

| Paso | Unicode | Imagen |
| --- | --- | --- |
| Origen | #(221E) | âˆž |
| Encabezados promovidos | #(25Âª6) | â–¦ |
| Tipo cambiado | #(21E5) | â‡¥ |
| Elegir columnas | #(25A4) | â–¤ |
| Combinar consultas | #(27D5) | âŸ• |
| Expandir columnas | #(2194) | â†” |

Para añadir la imagen o el código Unicode a cada paso debes abrir el Editor Avanzado de Power Query y modificar los pasos como se muestra en la imagen:

![dataXbi - Productos -Iconos - Editor Avanzado](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consuttas-Productos-Iconos-Editor-Avanzado.png)  
  

Una vez hechos los cambios y cerrado el Editor Avanzado los pasos deberían quedarte como se muestran en la siguiente imagen.

![dataXbi - Productos Iconos](/assets/images/posts/2022-12-14-tips-organizar-consultas-power-query-parte1/dataXbi-configuracion-consuttas-Productos-Iconos.png)  
  

Mientras el Editor de Power Query no soporte esta característica puedes hacer uso de este mapeo o crear el tuyo propio para identificar rápidamente las transformaciones más frecuentes que realizas en tus consultas.

Y esto es todo por hoy, esperamos que puedas aplicar estos tips en tus consultas y que si tienes algún otro que utilices en tus informes nos lo escribas en los comentarios.
