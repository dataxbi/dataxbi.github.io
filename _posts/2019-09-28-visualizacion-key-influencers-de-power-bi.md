---
layout: post
title: "Visualizaci�n Key Influencers de Power BI"
date: 2019-09-28
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "dataviz"
  - "powerbi"
---

La visualizaci�n Key Influencers de Power BI utiliza Machine Learning para encontrar co-relaciones entre varios campos del modelo de datos.

<!--more-->

Esta visualizaci�n fue introducida en preview en la actualizaci�n de Power BI Desktop de febrero de 2019 y est� disponible desde agosto de 2019. La documentaci�n se puede consultar en [https://docs.microsoft.com/es-es/power-bi/visuals/power-bi-visualization-influencers](https://docs.microsoft.com/es-es/power-bi/visuals/power-bi-visualization-influencers)

Para utilizarla, hay que configurar tres campos:

- _Analizar_: La columna o medida que se quiere analizar
- _Explicar por_: Una o varias columnas que se quiera determinar c�mo influyen en el valor del campo analizado
- _Expandir por_: (Opcional) Una o varios columnas para definir la granularidad de los datos, pero que no participan en el an�lisis

![Configuraci�n de la visualizaci�n Key Influencers](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-infuencers-configuracion.jpg)

Hay que tener en cuenta que para hacer el an�lisis se va a crear una tabla con las columnas indicadas en _Explicar por_ y en _Expandir por_, y que la muestra debe ser significativa, por lo que se deben escoger campos que tengan relaci�n con la propiedad o medida a analizar, y es recomendable incluir en _Expandir por_ un campo llave.

Una vez configurado, se podr�n ver los resultados en la visualizaci�n.  
Si la columna a analizar tiene valores discretos (categor�as) hay que escoger un valor a comparar, pero si son valores continuos (por ejemplo, ventas de un producto) hay que escoger entre incremento o decremento.

Hay dos vistas

- Influenciadores claves (key influencers)
    - Muestra los campos con m�s influencia ordenados de m�s a menos, con una burbuja en el extremo
    - Al seleccionar la burbuja se puede ver un gr�fico con los detalles de los valores del campo que m�s influyeron
    - El gr�fico se adapta a los valores del campo, por ejemplo, un gr�fico de barras para valores discretos o un gr�fico de dispersi�n para valores continuos
    - ![Visualizaci�n Key Influencers](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-influencers-influenciadores-claves.jpg)
- Segmentos principales
    - Se identifican los segmentos de datos que tengan mayor influencia, agrupando varios campos y se muestran en burbujas
    - La posici�n de la burbuja indica la influencia y el di�metro indica la cantidad de datos del segmento
    - Si se selecciona una burbuja se pueden ver los campos y valores por los que se filtraron los datos del segmento
    - ![Vista Segmentos Principales en la visualizacion Key Influencers](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-influencers-segmentos-principales-1.jpg)
    - ![Vista Segmentos Principales en la visualizacion Key Influencers](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-influencers-segmentos-principales-2.jpg)

Esto ha sido un resumen muy breve y para profundizar m�s le recomendamos revisar la [documentaci�n](https://docs.microsoft.com/es-es/power-bi/visuals/power-bi-visualization-influencers) que est� muy completa.

Internamente esta visualizaci�n utiliza algoritmos de Machine Learning (ML) y en la documentaci�n nos dicen que utiliza la biblioteca de c�digo abierto [ML.NET](https://dotnet.microsoft.com/apps/machinelearning-ai/ml-dotnet). Por esta raz�n, para trabajar con ella en Power BI Desktop es un requisito tener instalado .NET Framework 4.6 o superior. Aqu� le dejamos un [link](https://dotnet.microsoft.com/download/dotnet-framework) para descargarlo si no lo tuviera ya instalado.

Algo que nos parece muy interesante es la forma en que se utiliza la biblioteca ML.NET.  
Chriss Webb en [una entrada de su blog](https://blog.crossjoin.co.uk/2019/05/01/dax-machine-learning-functionality-used-by-the-key-influencers-visual-in-power-bi/) nos muestra que han extendido el motor de Power BI con expresiones DAX para ML, aunque no est�n documentadas, por lo que �l no recomienda utilizarlas en producci�n.

Nuestra curiosidad nos ha llevado a mirar en la instalaci�n de Power BI Desktop y hemos descubierto una carpeta con las DLLs de la biblioteca ML.NET y adem�s una DLL con un nombre que nos ha llamado mucho la atenci�n: Microsoft.AI.Dax.Extensions.dll

![DDLs de AI en instalaci�n de Power BI Desktop](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-influencers-ai-dlls.jpg)

Hemos abierto esta DLL con el navegador de objetos de Visual Studio y hemos encontrado m�todos con nombres muy similares a las f�rmulas DAX descritas en el blog de Chriss Webb.  
  
![Extensiones AI para DAX en el explorador de objetos de Visual Studio](/assets/images/posts/2019-09-28-visualizacion-key-influencers-de-power-bi/dataxbi-blog-key-influencers-object-browser.jpg)

Esto nos sugiere que esta DLL es el v�nculo entre las extensiones DAX para ML y la biblioteca ML.NET y es otra confirmaci�n de que el motor de Power BI ha sido extendido con ML.
