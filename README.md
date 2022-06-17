<img src="./general/assets/svg/RobotScript-Icon.svg" alt="RobotScript icon" style="height: 16rem; width: 16rem;"/>

# RobotScript


## Introduccion

RobotScript es una reversion de el entorno de programacion R-Info usada en la facultad UNLP Informatica para la enseñanza de contenido. El objetivo es llevar el concepto a tiempos modernos, aumentando las herramientas que brinda, mejorando la interfaz y el acceso a la misma, ya que ahora al ser una pagina web puede ser utilizada en cualquier navegador sin la necesidad de descargar ni instalar algo.


#### Pagina web: **https://j-josu.github.io/RobotScript/**

> Se encuentra en desarrollo


### Importante

Existen algunas diferencias de sintaxis entre R-Info y RobotScript, estas son:

| R-Info | RobotScript |
| :-: | :-: |
| V | verdad |
| F | falso |
| { | /* |
| } | */ |

Las expresiones para las instrucciones si, repetir y mientras deben estar contenidas en parentesis:

- R-Info
    ```
    si 16 < cantidad

    repetir 5

    mientras (56 > n) & estado
    ```

- RobotScript
    ```
    si (16 < cantidad)

    repetir (5)

    mientras ((56 > n) & estado)
    ```


<br>


## Capacidades:

- Editor de codigo integrado
- Compilacion con validacion de errores
- Interpretador de codigo integrado
- Multiples instancias
- Documentacion
- Apto movil (en desarrollo)
- Y mas


<br>


## En desarrollo

- Hud de estado de instancias
- Seleccion de camara, libre o seguir una instancia
- Interfaz y funcionalidad para modificar el tiempo entre actualizaciones


<br>


## Librerias usadas:

- Chevrotain, https://github.com/Chevrotain/chevrotain
- Ace, https://github.com/ajaxorg/ace


<br>


## Contribuyendo

Lea [CONTRIBUTING.md](./CONTRIBUTING.md) para mas detalles en los codigos de conducta de la comunidad y del proceso de contribucion.


<br>


## Autores

- Josue Suarez - *Fundador*


<br>


## Licencia

Este projecto esta licenciado bajo la Licencia MIT, lea [LICENSE](./LICENSE) para mas detalles.


<br>
<br>


##

Esto no tiene ningun fin de lucro, solo aportar a la educacion y ayudar al otro.
