---
layout: post
title: "Herramientas externas en Power BI Desktop"
date: 2020-09-15
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "herramientas-externas"
  - "powerbi"
---

Una de las novedades de la actualización de Power BI Desktop de julio de 2020 que más interés despertó fue la barra de herramientas externas. Power BI Desktop es capaz de detectar si ya has instalado alguna de las tres herramientas que existían desde hacia buen tiempo: DAX Studio, Tabular Editor y ALM Toolkit, y mostrarlas en la barra y también permite que otras aplicaciones extiendan dicha barra, con sus sus propios íconos. Desde entonces han ido apareciendo varias aplicaciones y pruebas de concepto hechas por la comunidad que se integran como una herramienta externa.

En este blog comento cómo funcionan las herramientas externas, describo algunas de ellas y hago una demostración de cómo incluir tú propio ícono en la barra de herramientas externas.

<!--more-->

## Â¿Cómo funcionan las herramientas externas?

A partir de la actualización de julio 2020 Power BI Desktop tiene una nueva opción en el menú: Herramientas Externas, donde hay una barra con íconos de aplicaciones. Al hacer clic en un ícono, se abrirá la aplicación y Power BI Desktop le indicará a la herramienta externa cómo conectarse al modelo de datos, de forma que la aplicación queda lista para trabajar con dicho modelo, sin ninguna intervención nuestra.

Antes de que esta opción existiese, cuando queríamos trabajar con una herramienta, por ejemplo, con DAX Studio, la abríamos y teníamos que indicarle qué conexión utilizar.

![Herramientas externas Power BI Desktop](/assets/images/posts/2020-09-15-herramientas-externas-powerbi-desktop/dataxbi-powerbi-herramientas-externas-diagrama.png)

El diagrama muestra cómo Power BI Desktop al ejecutar la herramienta externa le pasa dos parámetros, uno con la dirección del servidor y que incluye el puerto, y otro parámetro con el nombre de la base de datos del modelo. Con dicha información, la herramienta externa puede crear la conexión al modelo y trabajar con él, ya sea para extraer información o también para modificarlo. En el diagrama se utiliza la biblioteca TOM (Tabular Object Model) para acceder al modelo.

Para incluir una aplicación en la barra de herramientas externas hay que crear un fichero JSON en la carpeta `C:\Program Files (x86)\Common Files\Microsoft Shared\Power BI Desktop\External Tools` que tenga un nombre como `<nombre de la herramienta>.pbitool.json` y que debe contener:

- Nombre de la herramienta
- Descripción de la herramienta
- Camino al fichero ejecutable de la herramienta
- Parámetros del ejecutable, donde se pueden incluir los marcadores `%server%` y `%database%`
- Ãcono de la herramienta

## Añadiendo un ícono a la barra de herramientas externas

Como demostración crearé una herramienta muy simple que lo único que hará es abrir una página web, y para ello sólo tendré que crear un fichero JSON. El resultado será que en la barra de herramientas externas aparecerá el logo de dataXbi y al hacer clic en él, se abrirá el sitio web www.dataxbi.com en el navegador Edge.

![El ícono de dataXbi en la barra de herramientas externas de Power BI Desktop](/assets/images/posts/2020-09-15-herramientas-externas-powerbi-desktop/dataxbi-powerbi-herramientas-externas-barra-dataxbi.jpg)

El fichero JSON tendrá el nombre `dataxbi.pbitool.json`, lo guardaré en la carpeta mencionada anteriormente `C:\Program Files (x86)\Common Files\Microsoft Shared\Power BI Desktop\External Tools` y tendrá el siguiente contenido:

<script src="https://gist.github.com/dataxbi/d4d6bc28efb58f735566e4c4ceb16776.js"></script>

Algunos comentarios del fichero JSON:

- El ejecutable de la herramienta es el navegador Edge, por lo que en `path` he puesto el camino en mi ordenador, puede que en el tuyo sea distinto o que quieras utilizar otro navegador
- En `arguments` indiqué la dirección del sitio web que se abrirá con Edge, en este caso no he utilizado los marcadores %server% y %database%
- El ícono tiene que estar codificado en base64 y para ello he utilizado el sitio web www.base64-image.de donde uno puede cargar una imagen y obtener la codificación base 64 y copiarla y pegarla en el JSON

## Listado de herramientas externas

**Actualización:** Para un listado más reciente, te invitamos a visitar [nuestra página de herramientas externas de Power BI](https://www.dataxbi.com/herramientas-externas-power-bi/).

La comunidad Power BI se ha volcado a buscar usos para las herramientas externas y ya se han implementado varias herramientas nuevas y se han hecho pruebas de concepto y cada día aparecen nuevas ideas. A continuación quisiera enumerar algunas de las que he encontrado, si sabes de alguna que no esté listada deja un comentario.

![Barra de herramientas externas Power BI Desktop](/assets/images/posts/2020-09-15-herramientas-externas-powerbi-desktop/dataxbi-powerbi-herramientas-externas-barra.jpg)

Comienzo con las tres grandes, que son muy conocidas y muy útiles y además gratuitas y de código abierto:

- **[Tabular Editor](https://tabulareditor.com/)**: Muestra todos los objetos del modelo tabular como las tablas, columnas, medidas, jerarquías y perspectivas, y permite modificarlos. Es particularmente útil para crear medidas en lotes utilizando scripts, lo que ahorra una cantidad considerable de tiempo cuando hay que crear muchas medidas similares. Entre sus muchos otros beneficios quiero destacar la posibilidad de crear grupos de medidas y definir perspectivas, y que se puede ejecutar desde la línea de comandos.
- **[DAX Studio](https://daxstudio.org/)**: Permite ejecutar consultas DAX en modelos tabulares y analizarlas para mejorar el rendimiento. Es muy útil para modificar las medidas del modelo de Power BI porque su editor DAX es mucho más potente que el de Power BI Desktop y además si tienes más de una pantalla puedes tener Power BI Desktop en una y DAX Studio en la otra lo que mejora mucho la productividad.
- **[ALM Toolkit](http://alm-toolkit.com/)**: Permite manejar el ciclo de vida de los modelos tabulares, por ejemplo, comparar el modelo de desarrollo con el de producción y actualizar los cambios en el de producción. O para copiar partes de un modelo hacia otro.

Y continúo con algunas de las herramientas que han ido apareciendo:

- **[Document Model](https://data-marc.com/2020/07/28/external-tools-document-your-power-bi-model/)**: Ayuda a documentar un modelo Power BI y sugiere mejoras basadas en las buenas prácticas. Lo que hace es conectarse al modelo y generar un nuevo PBIX con un reporte donde documenta las tablas, las columnas y las relaciones y ofrece las recomendaciones.
- **[Integración con Python](https://dataveld.com/2020/07/21/python-as-an-external-tool-in-power-bi-desktop-part-2-create-a-pbitool-json-file/)**: David Eldersveld ha publicado una serie de blogs sobre las posibilidades de Python como herramienta externa de Power BI y en la segunda entrada de la serie indica cómo crear el fichero JSON para Power BI y un script Python que tome los parámetros %server% y %database% y construya la cadena de conexión al modelo. Y en la tercera entrada de la serie muestra como utilizar TOM para conectarse al modelo desde Python.
- **[DAX Beautifier](https://github.com/DavisZHANG-BlogOnly/dax-beautifier)**: Y continuando con Python, esta es una herramienta muy interesante desarrollada con Python que formatea automáticamente las medidas de un modelo Power BI. Para hacerlo, se conecta al modelo y extrae las medidas y luego utiliza la API de www.daxformatter.com para formatear cada medida y finalmente actualiza las medidas en el modelo.
- **[Conectar Excel con Power BI Desktop](https://eriksvensen.wordpress.com/2020/07/27/powerbi-external-tool-to-connect-excel-to-the-current-pbix-file/)**: Erik Svensen explica en un blog cómo crear una herramienta externa que simplifique conectarse desde Excel al modelo con el que se esté trabajando en Power BI Desktop y de esta manera utilizar una tabla pivote para probar las medidas del modelo. En el blog muestra el fichero JSON y un script PowerShell que crea un fichero ODC con la cadena de conexión al modelo de Power BI Desktop y luego abre Excel y el fichero ODC creado.
- **[Conectar Tableu Desktop con Power BI Desktop](https://eriksvensen.wordpress.com/2020/08/20/connect-your-powerbi-desktop-model-to-tableau-desktop-via-external-tools-in-powerbi/)**: El propio Erik Svensen ha ido un poco más allá y ha conectado Tableu Desktop con Power BI Desktop y así hacer más fácil crear reportes en Tableu utilzando como fuente de datos el modelo local abierto en Power BI Desktop. Para ello utiliza el mismo método que para la conexión desde Excel, lo que en este caso el script PowerShell crea un fichero de conexión para Tableu.
- **[Hot Swap Connections](https://powerbi.tips/2020/08/hot-swap-report-connections-external-tools/)**: Esta herramienta es útil cuando tenemos el modelo separado de los reportes, o sea, que tenemos un PBIX donde está el modelo y los reportes los tenemos en otro(s) PBIX y estos últimos utilizan una conexión en vivo hacia el modelo publicado en el servicio de Power BI. Con esta herramienta podemos sustituir fácilmente la conexión para que utilice un modelo que tengamos abierto en Power BI Desktop y luego volver a cambiar a la conexión original. De esta forma podemos hacer cambios locales al PBIX del modelo en Power BI Desktop y abrir otro PBIX con los reportes y probarlos sin tener que publicar el modelo en el servicio Power BI.
- **[Analyze in Excel for Power BI Desktop](https://www.sqlbi.com/tools/analyze-in-excel-for-power-bi-desktop/)**: Esta es una herramienta implementada por Marco Russo que abre un documento Excel con una tabla pivote conectada al modelo en Power BI Desktop, de forma similar a como lo hace otra herramienta comentada antes. El código está disponible en GitHub donde también se puede ver el roadmap para futuras versiones.
- **[Business Ops](https://powerbi.tips/product/business-ops-beta/)**: Esta aplicación no es una herramienta externa como tal, sino que es un instalador de herramientas externas. Una vez descargada e instalada, te ofrece un listado de herramientas externas que puedes seleccionar para instalar. En el listado aparecen la mayoría de las que he mencionado y también otras que son enlaces a páginas web (de aquí saqué la idea para el ejemplo que hice antes) que son útiles en el trabajo día a día con Power BI, como daxformatter.com, dax.guide y otras con las herramientas ofrecidas en el sitio powerbi.tips, que son los creadores de esta aplicación.
- **[Power BI Helper](https://radacad.com/install-power-bi-helper-as-an-external-tool-for-power-bi)**: Esta es otra herramienta gratuita que existe desde hace algún tiempo, desarrollada por RADACAD, y que tiene usos diversos, por ejemplo, para encontrar las tablas y las columnas que no se utilizan en ninguna visualización. También puedes ver todo el código Power Query y guardarlo en un fichero, o listar las tablas, columnas y medidas del modelo y ver las dependencias entre ellas, y muchas opciones más. En la última actualización (1 septiembre 2020) se integra en la barra de herramientas externas, pero la conexión al modelo aún no es automática, sino que hay que escoger entre los modelos que tengas abiertos con Power BI Desktop. A diferencia de las otras herramientas, esta también extrae información directamente del fichero PBIX, por lo que hay que indicarle la ubicación a dicho fichero. Esto último me hace pensar: Â¿Sería útil que Power BI Desktop pasara otro parámetro a la herramienta externa con el camino al fichero PBIX?.

Hasta aquí el listado, recuerda dejar un comentario si conoces alguna otra herramienta.
