---
layout: post
title: "Visualización Key Influencers de Power BI"
date: 2019-09-28
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "dataviz"
  - "powerbi"
---

La visualización Key Influencers de Power BI utiliza Machine Learning para encontrar co-relaciones entre varios campos del modelo de datos.

<!--more-->

Esta visualización fue introducida en preview en la actualización de Power BI Desktop de febrero de 2019 y está disponible desde agosto de 2019. La documentación se puede consultar en [https://docs.microsoft.com/es-es/power-bi/visuals/power-bi-visualization-influencers](https://docs.microsoft.com/es-es/power-bi/visuals/power-bi-visualization-influencers)

Para utilizarla, hay que configurar tres campos:

- _Analizar_: La columna o medida que se quiere analizar
- _Explicar por_: Una o varias columnas que se quiera determinar cómo influyen en el valor del campo analizado
- _Expandir por_: (Opcional) Una o varios columnas para definir la granularidad de los datos, pero que no participan en el análisis

![Configuración de la visualización Key Influencers](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-infuencers-configuracion.jpg)

Hay que tener en cuenta que para hacer el análisis se va a crear una tabla con las columnas indicadas en _Explicar por_ y en _Expandir por_, y que la muestra debe ser significativa, por lo que se deben escoger campos que tengan relación con la propiedad o medida a analizar, y es recomendable incluir en _Expandir por_ un campo llave.

Una vez configurado, se podrán ver los resultados en la visualización.  
Si la columna a analizar tiene valores discretos (categorías) hay que escoger un valor a comparar, pero si son valores continuos (por ejemplo, ventas de un producto) hay que escoger entre incremento o decremento.

Hay dos vistas

- Influenciadores claves (key influencers)
    - Muestra los campos con más influencia ordenados de más a menos, con una burbuja en el extremo
    - Al seleccionar la burbuja se puede ver un gráfico con los detalles de los valores del campo que más influyeron
    - El gráfico se adapta a los valores del campo, por ejemplo, un gráfico de barras para valores discretos o un gráfico de dispersión para valores continuos
    - ![Visualización Key Influencers](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-influencers-influenciadores-claves.jpg)
- Segmentos principales
    - Se identifican los segmentos de datos que tengan mayor influencia, agrupando varios campos y se muestran en burbujas
    - La posición de la burbuja indica la influencia y el diámetro indica la cantidad de datos del segmento
    - Si se selecciona una burbuja se pueden ver los campos y valores por los que se filtraron los datos del segmento
    - ![Vista Segmentos Principales en la visualizacion Key Influencers](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-influencers-segmentos-principales-1.jpg)
    - ![Vista Segmentos Principales en la visualizacion Key Influencers](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-influencers-segmentos-principales-2.jpg)

Esto ha sido un resumen muy breve y para profundizar más le recomendamos revisar la [documentación](https://docs.microsoft.com/es-es/power-bi/visuals/power-bi-visualization-influencers) que está muy completa.

Internamente esta visualización utiliza algoritmos de Machine Learning (ML) y en la documentación nos dicen que utiliza la biblioteca de código abierto [ML.NET](https://dotnet.microsoft.com/apps/machinelearning-ai/ml-dotnet). Por esta razón, para trabajar con ella en Power BI Desktop es un requisito tener instalado .NET Framework 4.6 o superior. Aquí le dejamos un [link](https://dotnet.microsoft.com/download/dotnet-framework) para descargarlo si no lo tuviera ya instalado.

Algo que nos parece muy interesante es la forma en que se utiliza la biblioteca ML.NET.  
Chriss Webb en [una entrada de su blog](https://blog.crossjoin.co.uk/2019/05/01/dax-machine-learning-functionality-used-by-the-key-influencers-visual-in-power-bi/) nos muestra que han extendido el motor de Power BI con expresiones DAX para ML, aunque no están documentadas, por lo que él no recomienda utilizarlas en producción.

Nuestra curiosidad nos ha llevado a mirar en la instalación de Power BI Desktop y hemos descubierto una carpeta con las DLLs de la biblioteca ML.NET y además una DLL con un nombre que nos ha llamado mucho la atención: Microsoft.AI.Dax.Extensions.dll

![DDLs de AI en instalación de Power BI Desktop](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-influencers-ai-dlls.jpg)

Hemos abierto esta DLL con el navegador de objetos de Visual Studio y hemos encontrado métodos con nombres muy similares a las fórmulas DAX descritas en el blog de Chriss Webb.  
  
![Extensiones AI para DAX en el explorador de objetos de Visual Studio](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-influencers-object-browser.jpg)

Esto nos sugiere que esta DLL es el vínculo entre las extensiones DAX para ML y la biblioteca ML.NET y es otra confirmación de que el motor de Power BI ha sido extendido con ML.
