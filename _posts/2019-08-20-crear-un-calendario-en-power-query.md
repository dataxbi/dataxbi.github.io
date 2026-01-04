---
layout: post
title: "Crear un calendario en Power Query"
date: 2019-08-20
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

En esta entrada de blog mostraremos como crear un calendario en Power Query para distintos casos de uso, donde las fechas inicial y final pueden ser valores fijos o depender de la fecha actual, o de una o varias columnas de fechas.

<!--more-->

En Power BI Desktop podemos crear calendarios en Power Query o usando funciones DAX. Podemos escoger cualquiera de las dos opciones para hacerlo y el resultado es muy similar. Cuando creamos un calendario en Power Query, podemos conectarnos a p�ginas web que contengan los calendarios festivos de nuestro pa�s o regi�n e incorporarlos a nuestro calendario, esta es la principal ventaja de crear un calendario en Power Query y no con DAX.

#### Los pasos para crear un calendario en Power Query son siempre los mismos, independientemente del caso de uso:

1. Especificar las fechas de inicio y fin del calendario
2. Crear una lista con las fechas
3. Convertir la lista en una tabla
4. Adicionar a la tabla las columnas de a�o, n�mero de mes y nombre de mes.
5. A�adir las columnas trimestre, semana, d�a de la semana y AAMM
6. Agregar columna con Fechas fiscales: mes, a�o y AAMM
7. A�adir columna con festivos

Podemos a�adir otras columnas dependiendo de nuestras necesidades.

Mostraremos 5 casos de uso para crear un calendario que solo difieren en como se tomen los valores de fecha inicial y final para crearlo, el resto de columnas que se creen ser�n las mismas en todos los casos.

#### Los valores de fecha que utilizaremos son:

- Dos valores de fechas fijos: fecha inicial y fecha final.
- Los 3 �ltimos a�os hasta la fecha actual, desde la misma fecha hace tres a�os hasta la fecha actual.
- Los 3 �ltimos a�os completos, desde el primer d�a del a�o de hace tres a�os hasta el �ltimo d�a del a�o actual.
- Los valores m�nimo y m�ximo de una columna de fechas, donde el menor valor ser� la fecha inicial y el mayor valor la fecha final.
- Los valores m�nimo y m�ximo de varias columnas de fechas. Seleccionaremos el menor valor entre todas las columnas como valor inicial y el mayor valor como valor final del calendario.

Desarrollaremos el primer caso de uso completo, es decir, crearemos un calendario con todas las columnas descritas. A continuaci�n, convertiremos el calendario en una funci�n con todas las transformaciones que hemos realizado en este caso de uso. Finalmente crearemos cinco consultas para crear los calendarios correspondientes a cada caso de uso y que utilizar�n esta funci�n.

### Crear un calendario a partir de dos valores de fechas fijos, fecha inicial y fecha final.

Pasos:

1. Declaramos dos par�metros, uno para la fecha inicial, que nombraremos FI y le asignamos el valor 01/01/2019,
  
![Par�metro FI](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-parametro-FI-Power-Query.png)  
  

y otro para la fecha final, que nombraremos FF y al que le asignamos el valor 31/12/2020.

![Par�metro FF](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-parametro-FF-Power-Query.png)  
  

Si quieres conocer m�s acerca de los par�metros puedes visitar [una entrada anterior](https://www.dataxbi.com/blog/2019/07/11/parametros-de-consulta/) donde hablamos de su uso y c�mo crearlos.

12. Crearemos una consulta en blanco y la nombramos fCalendario.
13. Abrimos el Editor avanzado y sustituimos el paso Origen por la f�rmula:

```
Duracion = Duration.TotalDays (FF-FI) + 1
```

La expresi�n calcula la diferencia en d�as entre las dos fechas.

4. A�adimos un nuevo paso usando la transformaci�n:

```
ListaFechas = List.Dates(FI,Duracion,#duration(1,0,0,0))
```

Este paso genera una lista de fechas desde la fecha inicial hasta la fecha final.

5. A continuaci�n, transformamos la lista en una tabla mediante la f�rmula:

```
TablaFechas = Table.FromList(ListaFechas, Splitter.SplitByNothing(), type table [Fecha = date], null, ExtraValues.Error)
```

La funci�n [Table.FromList](https://docs.microsoft.com/en-us/powerquery-m/table-fromlist) convierte una lista en una tabla.

```
Table.FromList(list as list, optional splitter as nullable function, optional columns as any, optional default as any, optional extraValues as nullable number)
```

##### par�metros de la funci�n:

list: la lista que queremos convertir en tabla.

splitter: Es opcional, aplica una funci�n de divisi�n a cada elemento de la lista. En este caso no se requiere dividir los elementos de la lista y usamos la funci�n _Splitter.SplitByNothing()._

_columns:_ Es opcional, puede contener el n�mero de columnas, una lista de las columnas o un tipo table. En este caso hemos pasado una declaraci�n del tipo table donde el nombre de la columna es **Fecha** y el tipo de dato que contiene es **date**.

_defaut:_ Es opcional, valor predeterminado. En este caso no se ha pasado valor por defecto.

extraValues: Es opcional, valores adicionales en caso de error. Si la funci�n de divisi�n devuelve m�s columnas de las que la tabla espera, se puede:

- generar un error (_Error)_
- ignorar el error (_Ignore_)
- recopilar en una lista (_List_)

En el ejemplo se generar� un error.

6. Agregamos una columna de a�o a la tabla usando la f�rmula:

```
ColumnaA�o = Table.AddColumn(TablaFechas,"A�o", each Date.Year([Fecha]), Int64.Type)
```

10. A�adimos una columna con el n�mero del mes a la tabla usando la f�rmula:

```
ColumnaNroMes = Table.AddColumn(ColumnaA�o,"Nro. Mes", each Date.Month([Fecha]), Int64.Type)
```

14. Adicionamos una columna con el nombre del mes usando la f�rmula:

```
ColumnaMes = Table.AddColumn(ColumnaNroMes,"Mes", each Date.MonthName([Fecha]), type text)
```

18. A�adimos la columna trimestre mediante la expresi�n:

```
ColumnaTrimestre = Table.AddColumn(ColumnaMes,"Trimestre", each Text.From(Date.QuarterOfYear([Fecha])) & "T", type text)
```

22. Agregamos columna con el numero de la semana del a�o utilizando la f�rmula:

```
ColumnaSemana = Table.AddColumn(ColumnaTrimestre,"Semana", each Date.WeekOfYear([Fecha],Day.Monday), Int64.Type)
```

26. Adicionamos columna con el d�a de la semana usando la expresi�n:

```
ColumnaDiaSemana = Table.AddColumn(ColumnaSemana,"D�a Semana", each Date.DayOfWeek([Fecha],Day.Monday),Int64.Type)
```

30. A�adimos columna con YYMM seg�n la f�rmula:

```
ColumnaYYMM = Table.AddColumn(ColumnaDiaSemana, "YYMM", each [A�o]*100 + [Nro. Mes], Int64.Type)
```

34. Creamos un par�metro para almacenar el n�mero del mes fiscal.
  

![Pr�metro NroMesFiscal](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-parametro-NroMesFiscal-Power-Query.png)  

40. Agregamos una columna con el n�mero de mes fiscal:

```
ColumnaNroMesFiscal = Table.AddColumn(ColumnaYYMM, "Nro. Mes Fiscal", each if [Nro. Mes] > NroMesFiscal then [Nro. Mes] - NroMesFiscal else [Nro. Mes] + NroMesFiscal, Int64.Type)
```

44. A�adimos una columna con el a�o fiscal

```
ColumnaA�oFiscal = Table.AddColumn(ColumnaNroMesFiscal,"A�o Fiscal", each if [Nro. Mes Fiscal] <= NroMesFiscal then [A�o] + 1 else [A�o], Int64.Type)
```

48. Adicionamos la columna FYYMM con el a�o y mes fiscal.

```
ColumnaFYYMM = Table.AddColumn(ColumnaA�oFiscal,"FYYMM", each [A�o Fiscal]*100 + [Nro. Mes Fiscal], Int64.Type)
```

### Crear calendario de d�as festivos

Para los d�as festivos usaremos la URL de una p�gina que contiene los festivos de Espa�a para los a�os 2018, 2019 y 2020. Tendremos que realizar algunas transformaciones hasta obtener una tabla con el formato requerido.

1. Creamos una nueva consulta usando el conector Web. La URL del origen es [https://www.diafestivo.es/](https://www.diafestivo.es/). Extraemos la tabla que contiene los festivos de Espa�a.
2. Renombramos la consulta como Festivos Espa�a.
3. Utilizar la primera fila como encabezado ser� nuestra primera transformaci�n.
4. Eliminamos el paso Tipo cambiado.
5. A continuaci�n, seleccionamos la columna Espa�a y la transformaci�n Anular la dinamizaci�n de otras columnas.
6. Filtramos las filas que contengan “-“ en la columna Valor.
7. Seleccionamos la columna Valor y luego la columna Atributo, en la pesta�a Transformar, dentro del grupo Columnas de texto, seleccionamos la opci�n Combinar columnas. Como separador escogemos Espacio y como nombre de columna escribimos Fecha.
8. Cambiamos el tipo de datos de la columna Fecha al tipo Fecha.
9. Seleccionamos la columna fecha y eliminamos duplicados.
10. Cambiamos el nombre a la columna Espa�a por Fiesta.
11. Y ya est� el calendario de festivos de Espa�a.  
       
     ![Crear Calendario de festivos en Power Query](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Calendario-festivos-Espa�a-Power-Query-5.png)

### A�adir festivos a la consulta fCalendario

17. Seleccionamos la consulta fCalendario.
18. En el Editor avanzado, a�adimos un nuevo paso donde combinamos las dos consultas utilizando la f�rmula:

```
Consultascombinadas = Table.NestedJoin(ColumnaFYYMM, {"Fecha"}, #"Festivos Espa�a", {"Fecha"}, "D�as festivos", JoinKind.LeftOuter)
```

22. A�adimos un nuevo paso donde expandimos la columna D�as festivos:

```
Diasfestivos = Table.ExpandTableColumn(Consultascombinadas, "D�as festivos", {"Fiesta"}, {"Fiesta"})
```

26. A�adimos una columna que devuelva para cada d�a si es festivo o no teniendo en cuenta si es fin de semana o d�a de fiesta nacional.

```
ColumnaLaborable = Table.AddColumn(Diasfestivos, "Festivo", each if [Fiesta] <> null or  [D�a Semana] = 6 or [D�a Semana]=7 then 1 else 0, Int64.Type)
```

30. Ya est� listo nuestro calendario.

### Crear funci�n a partir de la consulta anterior.

1. Seleccionamos la consulta fCalendario y a continuaci�n abrimos el Editor avanzado.
2. En la primera l�nea del editor, despu�s de la expresi�n let realizamos un cambio de l�nea.
3. En la l�nea 2 del editor declaramos la funci�n mediante la siguiente expresi�n:

```
Origen = (FI as date, FF as date)=>
```

4. Realizamos otro cambio de l�nea y en la l�nea 3 del editor escribimos la expresi�n let para indicar el comienzo del cuerpo de la funci�n.
5. Despu�s del �ltimo paso a�adimos otra l�nea donde escribimos la expresi�n in y a continuaci�n un nuevo cambio de l�nea.
6. Escribimos Origen y a continuaci�n oprimimos el bot�n Listo.
7. Habremos convertido la consulta en una funci�n.

![Crear funcion fCalendario en Power Query](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-funcion-fCalendario-Power-Query.png)  
  

### Crear las cinco consultas correspondientes a cada caso de uso.

#### Calendario 1: crear un calendario a partir de dos valores de fechas fijos, fecha inicial y fecha final.

- Crear consulta en blanco.
- En la primera l�nea de la consulta escribir la expresi�n

```
= fCalendario(FI,FF)
```

Hemos llamado a la funci�n que acabamos de crear pas�ndole como valores los par�metros definidos previamente.

![Crear un calendario en Power Query](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Crear-Calendario-Power-Query-1.png)  
  

Como resultado se ha obtenido un calendario que va desde el valor de una fecha fija hasta el valor de otra fecha fija.

![Crear un calendario en Power Query 1](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Calendario1-Power-Query.png)  
  

#### Calendario 2: crear un calendario con los X �ltimos a�os hasta la fecha actual.

- Crear consulta en blanco.
- Asignar el valor de la fecha actual a la variable fecha\_final usando la funci�n DateTime.LocalNow()

```
fecha_final = Date.From(DateTime.LocalNow())
```

- Crear par�metro con el n�mero de a�os del calendario.

![Par�metro A�os](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-parametro-A�os-Power-Query.png)

- Restar a la fecha actual el n�mero de a�os deseados para encontrar el valor inicial:

```
fecha_inicial = Date.AddYears(fecha_final,-1*A�os),
```

- Llamar la funci�n fCalendario pasando las dos variables como par�metros.

```
calendario = fCalendario(fecha_inicial, fecha_final)
```

- Devolver el calendario

![Crear un Calendario en Power Query 2](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Crear-Calendario-Power-Query-2.png)  
  

#### Calendario 3: crear un calendario con los X �ltimos a�os desde el primer d�a del primer a�o hasta el �ltimo d�a del a�o actual.

- Crear consulta en blanco.
- Asignar el valor de la fecha actual a la variable fecha\_final usando la funci�n DateTime.LocalNow()

```
fecha_final = Date.From(DateTime.LocalNow())
```

- A�o de la fecha final en la variable a�o\_final.

```
a�o_final = Date.Year(fecha_final)
```

- Último d�a del a�o final:

```
ff = Date.From("31/12/" & Text.From(a�o_final))
```

- Restar a la fecha actual el n�mero de a�os deseados para encontrar el valor de fecha\_inicial:

```
fecha_inicial = Date.AddYears(fecha_final,-1*A�os),
```

- A�o de la fecha inicial en la variable a�o\_inicial.

```
a�o_inicial = Date.Year(fecha_inicial)
```

- Primer d�a del a�o inicial:

```
fi = Date.From("01/01/" & Text.From(a�o_inicial))
```

- Llamar la funci�n fCalendario pasando las dos variables como par�metros.

```
calendario = fCalendario(fi,ff)
```

- Devolver el calendario

![Crear un Calendario en Power Query 3](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Crear-Calendario-Power-Query-3.png)  
  

#### Calendario 4: crear un calendario din�mico a partir de una columna de fechas, donde el menor valor ser� la fecha inicial y el mayor valor la fecha final.

- Crear consulta en blanco.
- Asignar el menor valor de una columna de fechas a la variable fecha\_inicial usando la expresi�n:

```
fecha_inicial = List.Min(Ventas[OrderDate])
```

- Asignar el mayor valor de una columna de fechas a la variable fecha\_final usando la expresi�n:

```
fecha_final = List.Max(Ventas[OrderDate])
```

- Llamar la funci�n fCalendario pasando las dos variables como par�metros.

```
calendario = fCalendario(fecha_inicial, fecha_final)
```

- Devolver el calendario

![Crear un Calendario en Power Query 4](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Crear-Calendario-Power-Query-4.png)  
  

#### Calendario 5: crear un calendario din�mico a partir de varias columnas de fechas. Seleccionaremos el menor valor entre todas las columnas como valor inicial y el mayor como valor final del calendario.

Primero crearemos una funci�n que devuelva una lista de valores con el mayor y el menor valor de una columna de fechas y luego crearemos el calendario usando la funci�n.

##### Pasos para crear la funci�n:

- Crear una consulta en blanco.
- En el paso Origen asignar la siguiente expresi�n para la declaraci�n de la funci�n:

```
Origen = (tabla as table, columna as text) =>
```

La funci�n contiene dos par�metros una para la tabla y otro para la columna de tipo fecha.

- A continuaci�n, en la l�nea 3 del editor escribir la expresi�n let para indicar que comienza el cuerpo de la funci�n.
- En la l�nea 4 escribir la siguiente expresi�n:

```
FI = Record.Field (Table.Min(tabla,columna),columna),
```

Esta expresi�n devuelve la primera fecha de la columna especificada.

- En la l�nea 5 escribir la siguiente expresi�n:

```
FF = Record.Field(Table.Max(tabla,columna),columna),
```

Esta expresi�n devuelve la �ltima fecha de la columna especificada.

- Combinamos los valores FI y FF en una lista en la l�nea 6 mediante la expresi�n:

```
{% raw %}Lista = List.Combine({{FI},{FF}}){% endraw %}
```

Esta expresi�n devuelve una lista que contiene el primer y el ultimo valor de la columna fecha pasada como par�metro a la funci�n.

- Escribimos la instrucci�n in en la l�nea 7 para indicar el resultado de la funci�n.
- Devolvemos la variable del �ltimo paso de la funci�n en la l�nea 8, en este caso la variable Lista.
- Oprimir el bot�n Listo y a continuaci�n cambiar el nombre de la funci�n por MinMaxDate.
- Ya est� lista la funci�n.

![Funci�n MinMaxDate](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-funcion-MinMaxDate-Power-Query.png)

  
  

##### Pasos para crear el calendario.

Para la tabla que contiene varias columnas de fechas usaremos la tabla FactInternetSales de AdventureWorksDW2017 a la que hemos llamado Ventas. Esta tabla tiene tres columnas de fecha: OrderDate, DueDate y ShipDate. Usaremos la funci�n anterior para buscar el menor y el mayor valor de cada una de estas columnas, combinarlos en una lista y luego seleccionar el menor y el mayor entre estos valores para crear nuestro calendario siguiendo los pasos que se detallan a continuaci�n:

- Creamos una consulta en blanco y abrimos el Editor avanzado.
- Sustituimos el paso Origen por la expresi�n:

```
DatesOrder = MinMaxDate(Ventas,"OrderDate"),
```

- A�adimos dos nuevos pasos en la consulta usando las expresiones:

```
DatesDue = MinMaxDate(Ventas,"DueDate"),
```

y

```
DatesShip = MinMaxDate(Ventas,"ShipDate"),
```

- A continuaci�n, combinamos las listas resultantes en una nueva lista que nombramos ALLDates.

```
AllDates = List.Combine({DatesOrder,DatesDue,DatesShip}),
```

- Asignamos el menor valor de la lista ALLDates a la variable fecha\_inicial usando la expresi�n:

```
fecha_inicial = List.Min(AllDates)
```

- Asignamos el mayor valor de la lista ALLDates a la variable fecha\_final usando la expresi�n:

```
fecha_final = List.Max(AllDates),
```

- Llamamos la funci�n fCalendario pasando las dos variables como par�metros.

```
calendario = fCalendario(fecha_inicial, fecha_final)
```

- Devolvemos el calendario

![Crear un Calendario en Power Query 5](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Crear-Calendario-Power-Query-5.png)  
  

### Conclusiones:

- Podemos crear calendarios utilizando Power Query o funciones DAX. Las dos son muy similares a la hora de crear un calendario.
- En muchos escenarios, los d�as festivos juegan un papel importante en el an�lisis de datos. Con Power Query podemos obtener datos de las web en vivo. Esta funcionalidad permite buscar los d�as festivos en p�ginas web p�blicas en vivo y a�adirlos a nuestro calendario. Esta funcionalidad no la tiene DAX y es la ventaja fundamental de crear el calendario con M.

El archivo PIBX de este ejemplo est� disponible en [GitHub](https://github.com/dataxbi/power-query).
