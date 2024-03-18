<img src="./general/assets/svg/RobotScript-Icon.svg" alt="Icono de RobotScript" style="height: 16rem; width: 16rem;"/>

# RobotScript


## Introducción

RobotScript es una reversion del entorno de programación R-Info usada en la facultad UNLP Informatica para la enseñanza de contenido. El objetivo es llevar el concepto a tiempos modernos, aumentando las herramientas que brinda, mejorando la interfaz y el acceso a la misma, ya que ahora al ser una pagina web puede ser utilizada en cualquier navegador sin la necesidad de descargar ni instalar algo.


**Pagina web: [https://josu-dev.github.io/RobotScript/](https://josu-dev.github.io/RobotScript/)**

> En estado funcional pero desarrollo no terminado


## Importante

Existen algunas diferencias de sintaxis entre R-Info y RobotScript, estas son:

| R-Info | RobotScript |
| :-: | :-: |
| V | verdad |
| F | falso |
| { | /* |
| } | */ |

Las expresiones para las instrucciones si, repetir y mientras deben estar contenidas en parentesis:

- R-Info

    ```text
    si 16 < cantidad

    repetir 5

    mientras (56 > n) & estado
    ```

- RobotScript

    ```text
    si (16 < cantidad)

    repetir (5)

    mientras ((56 > n) & estado)
    ```


<br />


## Características

- Editor de codigo integrado
- Compilación con validación de errores
- Interpretador de codigo integrado
- Multiples instancias
- Documentacion
- Apto movil (funcional)
- Y mas


<br />


## Implementaciones futuras

- Hud de estado de instancias
- Selección de camara, libre o seguir una instancia
- Interfaz y funcionalidad para modificar el tiempo entre actualizaciones


<br />


## Librerias usadas

- Chevrotain - [repository](https://github.com/Chevrotain/chevrotain)
- Ace - [repository](https://github.com/ajaxorg/ace)


<br />


## Contribuir

Lea [CONTRIBUTING.md](./CONTRIBUTING.md) para mas detalles en los codigos de conducta del proyecto y del proceso de contribucion.


<br />


## Autores

- Josue Suarez - *Creador*


<br />


## Licencia

Este projecto esta licenciado bajo la Licencia MIT, lea [LICENSE](./LICENSE) para mas detalles.


<br />
<br />


> Desarrollado unicamente para aportar a la educación y ayudar al otro.
