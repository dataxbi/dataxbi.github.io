---
layout: post
title: "Aplicando RLS con Power BI Embedded"
date: 2021-01-29
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi-embedded"
  - "python"
---

Contin�o con la serie sobre Power BI Embedded y extendiendo la demo. Esta vez muestro c�mo utilizar la API REST de Power BI para enviar la informaci�n del usuario y los roles desde la aplicaci�n web hacia el servicio de Power BI, con el fin de aplicar RLS (seguridad de nivel de fila).

<!--more-->

## RLS en Power BI

En Power BI podemos restringir a qu� filas del conjunto de datos tiene acceso un usuario, lo que se conoce con el t�rmino de "seguridad a nivel de fila" o RLS (por las siglas en ingl�s). Para implementarlo, creamos roles en el modelo de datos, utilizando Power BI Desktop, y para cada rol indicamos c�mo filtrar las tablas del modelo, utilizando expresiones DAX. Estas expresiones pueden ser est�ticas, por ejemplo, el rol `Espa�a` filtra la tabla `Paises` con la expresi�n `[Codigo Pais] = "ES"`. O pueden ser din�micas, utilizando la funci�n `USERNAME()` que devuelve el email del usuario. Por ejemplo, el rol `Vendedor` filtra la tabla `Vendedores` con la expresi�n `[Email] = USERNAME()`.

La asignaci�n de qu� roles le corresponden a cada usuario se hace en el servicio de Power BI una vez que se ha publicado el modelo de datos.

## RLS en Power BI Embedded

Con Power BI Embedded el acceso de los usuarios lo controla nuestra aplicaci�n web y no el servicio de Power BI, por lo que es nuestra responsabilidad enviarle a Power BI la informaci�n del usuario y los roles. Para ello usamos la API REST de Power BI y en espec�fico la API para crear un "Embed Token", de la que ya habl� en [entradas anteriores](https://www.dataxbi.com/blog/tag/powerbi-embedded/).

Hab�amos visto que para crear el "Embed Token" se le env�a a la API el ID del informe y puede que tambi�n el ID del conjunto de datos. Para aplicar RLS hay que enviar adem�s la informaci�n de identidad, que consiste en el usuario, los roles y el ID del conjunto de datos donde se va aplicar dicha identidad.

En el diagrama siguiente muestro el proceso para dos usuarios, en tres pasos:

1. El usuario se identifica con la aplicaci�n web. Este usuario tiene unos roles asignados en la configuraci�n de la aplicaci�n web.
2. El backend de la aplicaci�n web llama a la API REST de Power BI para generar el "Embed Token" y le env�a el usuario y los roles.
3. El "Embed Token" generado se utiliza en la configuraci�n de la biblioteca JavaScript de Power BI, y esta se lo env�a a Power BI, quien filtrar� las filas del conjunto de datos acorde a las reglas de RLS.

![Aplicando RLS con Power BI Embedded](/assets/images/posts/2021-01-29-rls-powerbi-embedded/dataXbi-powerbi-embedded-rls.png)

El siguiente fragmento de c�digo Python, que extiende el ejemplo de una [entrada anterior](https://www.dataxbi.com/blog/2021/01/11/enlace-dinamico-conjunto-datos-powerbi-embedded/), muestra c�mo pasar la informaci�n de identidad a la API REST de Power BI.

![Aplicando RLS con Power BI Embedded - C�digo Python](/assets/images/posts/2021-01-29-rls-powerbi-embedded/dataXbi-powerbi-embedded-rls-code-python.png)

Las l�neas nuevas en este fragmento son de la 20 a la 27, donde se utilizan las siguientes variables:

- `rls_username`: Identificaci�n del usuario. Suele ser un email pero puede ser cualquier cadena de texto
- `rls_roles`: Un arreglo con la lista de roles
- `dataset_id`: El ID del conjunto de datos sobre el que se va aplicar RLS

## Demo

La demo consiste en un sitio web con Power BI Embedded y que utiliza una base de datos SQL para almacenar la configuraci�n. El sitio da acceso a un informe de ventas que comparten dos empresas, una con el nombre BICICLETAS y la otra con el nombre ORDENADORES. Cada empresa tiene un conjunto de datos separados, pero el modelo de datos es el mismo, por lo que se puede usar el mismo informe. En los [blogs anteriores](https://www.dataxbi.com/blog/tag/powerbi-embedded/) hay m�s detalles.

#### Credenciales

Estos son los datos de acceso:  
Sitio web: [https://dataxbi-powerbi.azurewebsites.net](https://dataxbi-powerbi.azurewebsites.net)

Empresa BICICLETAS  
Usuario: demo-bicicletas  
Contrase�a: dataXbi2021  
  

Empresa ORDENADORES  
Usuario: demo-ordenadores  
Contrase�a: dataXbi2021

He extendido el sitio web para que se pueda utilizar RLS, y como resultado se puede acceder con 4 usuarios nuevos:

Empresa BICICLETAS  
  
Usuario: demo-bicicletas-vendedor  
Contrase�a: dataXbi2021  
Este usuario pertenece a un vendedor y s�lo ve las ventas que �l hizo.  
  
Usuario: demo-bicicletas-ca  
Contrase�a: dataXbi2021  
Este usuario s�lo puede ver las ventas para las Comunidades Aut�nomas: Catalu�a, Islas Baleares y Comunidad Valenciana.  
  

Empresa ORDENADORES  
  
Usuario: demo-ordenadores-vendedor  
Contrase�a: dataXbi2021  
Este usuario pertenece a un vendedor y s�lo ve las ventas que �l hizo.  
  
Usuario: demo-ordenadores-ca  
Contrase�a: dataXbi2021  
Este usuario s�lo puede ver las ventas para las Comunidades Aut�nomas: Andaluc�a, Asturias y Arag�n.  

#### Modelo

El modelo de Power BI lo he extendido con dos tablas de dimensiones:

- `Vendedores`: Tabla con los vendedores de la empresa y que se enlaza con la tabla de hechos `Ventas`.
- `Comunidades Aut�nomas`: Tabla con las Comunidades Aut�nomas y que se enlaza con la tabla de dimensiones `Clientes`.

La siguiente imagen muestra el modelo y adem�s el contenido de las nuevas tablas en uno de los conjuntos de datos que utilizo en la demo. Los nombres de los vendedores son ficticios, por lo que cualquier semejanza con la realidad es pura coincidencia ;).

![Aplicando RLS con Power BI Embedded - Modelo de datos](/assets/images/posts/2021-01-29-rls-powerbi-embedded/dataXbi-powerbi-embedded-rls-model.png)

#### Roles

He creado roles est�ticos para cada Comunidad Aut�noma. Por ejemplo, el rol para Andaluc�a tiene el nombre `CA-AN` y aplica el filtro `[Codigo CA] = "ES-AN"` a la tabla `Comunidades Autonomas`.

Tambi�n he creado un rol din�mico con el nombre `Vendedor` que aplica el filtro `[Codigo Vendedor] = USERNAME()` a la tabla `Vendedores`.

Aprovecho para hacer notar que en este modelo no estoy almacenando el email de los vendedores y que en el filtro comparo USERNAME() con el c�digo del vendedor. Esto es porque al estar utilizando Power BI Embedded puedo pasar lo que desee como `username`, y en este caso pasar� el c�digo del vendedor, que estar� guardado en la configuraci�n de la aplicaci�n web.

#### Informe

Al informe le he a�adido dos gr�ficos de barras para mostrar las unidades vendidas por Comunidad Aut�noma y las unidades vendidas por Vendedor.

![Aplicando RLS con Power BI Embedded - Informe](/assets/images/posts/2021-01-29-rls-powerbi-embedded/dataXbi-powerbi-embedded-rls-informe.png)

#### Configuraci�n

La configuraci�n de los usuarios del sitio web la he extendido de la siguiente manera:

- Roles: Un usuario puede tener ning�n, uno o varios roles asociados.
- Usuario Power BI: A un usuario se le puede indicar, opcionalmente, el `username` que se enviar� a Power BI.

Cuando un usuario se identifica en la aplicaci�n web, y el backend va a llamar a la API REST de Power BI para crear el "Embed Token", si el usuario tiene alg�n rol asociado, se env�a la informaci�n de identificaci�n. Para el `username`, se utiliza el usuario de Power BI, si ha sido configurado, y sino se utiliza el nombre de usuario en la aplicaci�n web, por ejemplo, demo-bicicletas-ca.

Adem�s he creado los usuarios que mencion� antes, con la siguiente configuraci�n:

Empresa BICICLETAS

- Usuario: demo-bicicletas-vendedor
    - Roles: Vendedor
    - Usuario Power BI: A0-000 (c�digo de un vendedor)
- Usuario: demo-bicicletas-ca
    - Roles: CA-CT, CA-IB, CA-VC

Empresa ORDENADORES

- Usuario: demo-ordenadores-vendedor
    - Roles: Vendedor
    - Usuario Power BI: A0-000 (c�digo de un vendedor)
- Usuario: demo-ordenadores-ca
    - Roles: CA-AN, CA-AS, CA-AR

#### Resultado

El resultado ser�, como es de esperar, que el informe estar� filtrado acorde a los roles asignados al usuario. Por ejemplo, en las siguiente imagen muestro c�mo se ver�a el informe para un usuario que tenga roles de Comunidades Aut�nomas.

![Aplicando RLS con Power BI Embedded - Informe - Rol CA](/assets/images/posts/2021-01-29-rls-powerbi-embedded/dataXbi-powerbi-embedded-rls-informe-rol-ca.png)

Y en esta otra imagen se puede ver el informe para un usuario con un rol de Vendedor.

![Aplicando RLS con Power BI Embedded - Informe - Rol Vendedor](/assets/images/posts/2021-01-29-rls-powerbi-embedded/dataXbi-powerbi-embedded-rls-informe-rol-vendedor.png)

## Referencias

- [https://docs.microsoft.com/es-es/power-bi/admin/service-admin-rls](https://docs.microsoft.com/es-es/power-bi/admin/service-admin-rls)
- [https://docs.microsoft.com/en-us/power-bi/developer/embedded/embedded-row-level-security](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embedded-row-level-security)
- [https://docs.microsoft.com/es-es/rest/api/power-bi/embedtoken/generatetoken](https://docs.microsoft.com/es-es/rest/api/power-bi/embedtoken/generatetoken)
