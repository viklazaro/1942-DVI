# 1942-DVI

Proyecto del juego 1942 realizado por:

- Jose Antonio Bernal
- Víctor García Rodríguez
- Milagros del Rocío Peña Quineche
- Víctor Reviejo Reviejo
  
1942 es un juego perteneciente al género shoot 'em up, del estilo de los clásicos mars invaders y similares. Fue lanzado por Capcom para 
recreativa en 1984. El juego se ambienta en la Guerra del Pacífico. El objetivo es llegar a Tokyo y destruir toda la flota aérea.

El juego incluía 8 mundos con 4 niveles cada uno. Los mundos son: Midway, Marshall, Attu, Rabaul, Leyte, Saipan, Iwojima, y el último, 
Okinawa. En dichos niveles el jugador tenía que llegar a un portaviones que se encontraba el final del recorrido. Durante su camino a dicho
portaviones se enfrenta a diferentes tipos de enemigos, incluido uno de mayor tamaño a modo de boss del nivel.

Su éxito fue tal que por entonces lo catapultó a todo tipo de plataformas como NES, Commodore 64, Game Boy e incluso más tarde a 
PlayStation2 y Xbox, aunque, actualmente existe una adaptación del videojuego para Android, la cual esta teniendo un rendimiento que se ve 
comprometido en ciertos momentos con lag y parones repentinos.

## DISEÑO DEL JUEGO

En principio, nosotros desarrollaremos un nivel de dicho juego que incluya todos los enemigos disponibles en el mundo de Midway y 
Marshall. Usaremos un gameplay de ejemplo, que se desarrolla en los dos primeros mundos, para sacar información acerca del juego como
animaciones, tipos de enemigos y aguante de los mismos (cuantos impactos necesitan para morir), etc.

**1.  Objetivos del juego**

   Como hemos descrito anteriormente, el objetivo del juego es llegar a Tokyo y destruir toda la flota aéra japonesa que nos encotremos en nuestro camino. Los niveles se inician en un portaaviones y terminan en otro, por lo tanto en el juego se consigue una victoria si 
consigues llegar al final del nivel con vida y por el contrario el jugador pierde cuando su personaje es destruido por los aviones
enemigos. El jugador consta de 3 vidas y para que sea destruido por los enemigos debe perderlas todas debido a impactos que recibe 
por balas enemigas, en cambio si el jugador impacta de lleno con el sprite de un avión enemigo es muerte instantánea y por consiguiente
el fin del juego.

**2.  Principales mecánicas**

   El jugador puede moverse por el escenario con las flechas de dirección del teclado y disparar con la barra espaciadora. El jugador tiene 3 vidas, pierde una vida cada vez que recibe un disparo enemigo. Cuando pierde todas sus vidas el jugador es destruido y vuelve al
comienzo del nivel, esto puede ocurrir hasta en tres ocasiones si mueres de nuevo aparece una pantalla de "Game Over".

   A lo largo del nivel van apareciendo diversas oleadas de los distintos tipos de enemigos. Cuando destruyes a algunos de estos enemigos sueltan un power ups. Hay dos tipos de power up, uno que destruye a todos los enemigos que hay en pantalla y otro que le cambia al jugador el tipo de munición.

   En cierto momento del nivel los enemigos normales dejan de aparecer y hace acto de presencia el boss final. El boss aparece por la parte izquierda de la pantalla y se mueve hasta que se coloca en el centro de la pantalla, durante este proceso el boss es inmune. Una vez se encuentra en el centro de la pantalla deja de moverse y comienza a disparar al jugador desde distintos puntos y no solo desde uno
como hacen los enemigos normales. Una vez 

**3.  Personajes**

   En nuestra versión del juego tenemos 3 tipos de personajes:

  * Enemigos normales: Estos enemigos mueren de un solo disparo del jugador o al impactar con este. De este tipo de enemigo se podría
  decir que hay varios "subtipos". Todos usan el mismo sprite pero se diferencian en como se mueven, algunos se mueven en línea recta
  ya sea de manera horizontal y vertical y otros realizan curvas y loopings.
  
  * Jugador: Consta de 3 vidas. Muere si impacta con un enemigo y pierde una vida cada vez que le golpea un disparo enemigo, si pierde
  todas las vidas muere. Además, puede esquivar y disparar.
  
  * Boss: Tiene un gran tamaño comparado con los enemigos normales y también tiene más vida. Cuando aparece en el nivel es inmune
  hasta que se coloca en el centro de la pantalla y comienza a disparar al jugador. El Boss tiene más vida por lo que debe recibir
  bastantes disparos por parte del jugador para ser destruido. También dispara múltiples ráfagas con diferentes direcciones al contrario
  que el resto de personajes del juego.

## DISEÑO DE LA IMPLEMENTACIÓN

El juego consta de 3 escenas principales para su correcto desarrollo:
* Background

  Esta escena esta dedicada exclusivamente para el fondo del juego, ya que tiene la peculiaridad de poder desplazarse sobre el eje Y     para dar la impresión de que, aunque, no se mueva al jugador, este sigue "volando".
  
* Level

  Escena con su propio método *step*, el cual actúa como *Spawner* de los enemigos, esto se produce gracias a un conjunto de datos tipo  JSON en el que se especifica el momento de inicio y fin de ese tipo de enemigo, la frecuencia con la que aparecerá y el tipo y las coordenadas del mapa donde aparecerá. 
  
  El level inicializa las siguientes clases:
  
    * Player
        * Clase que representa al protagonista.
        * Utiliza los componente **2d** y **animation**.
        * Controlado por el usuario gracias al módulo **Input**.
        * Depende de las clases **Bullet_Player, Simple_Bullet_Player y Explosion_P**.
    
    * Enemigos
        * Cada enemigo ha sido representado por una clase, **Enemy1, Enemy2, Enemy3 y Enemy7**.
        * Utilizan los componentes **animation** y **defaultEnemy**, esta segunda proporciona 2 métodos, uno encargado de controlar las colisiones y otro que se activa debido a que el jugador ha activo un tipo de Power Up.
        * Cada tipo de enemigo representa un movimiento diferente, ya sea horizontal, vertical, parabólico y circular.
        * Depende de las clases **Bullet_Enemy y Explosion**.
      
     * Boss
        * Clase que representa al jefe final del nivel.
        * Utiliza el componente **animation**.
        * La colisión la controlamos mediante "hit".
        * Depende de las clases **Bullet_Enemy y Explosion_P**.
        
     * Pow
        * Clase que representa los "Power Ups"
        * Utiliza el componente **animation**.
        * Solo puede colisionar con Player.
        * Existen 2 tipos que producen que Player pueda cambiar de munición a otra más potente o bien que explote a todos los enemigos, exceptuando al Boss, que se encuentren en ese momento en escena.
        * No consta de otras funciones aparte del "step" ya que la colisión la controla Player.
        * Aparece un determinado tiempo sino se destruye.
      
* HUD

   Escena encargada de almacenar la puntuación y las vidas, para ello existen los componentes de tipo text que son **Score** y **Lifes**, los cuales constan de un método para poder cambiar el valor actual, ya sean de la puntuación o de las vidas.

## REPARTO DE TAREAS

Durante el desarrollo del proyecto no hemos tenido un reparto de tareas como tal. Pero sí que teníamos una lista de tareas que teníamos
que realizar y tener completas para la entrega final del proyecto por lo que cada uno de los participantes cada vez que nos poníamos a
trabajar mirábamos que teníamos pendiente y nos poníamos con ello.

Además, de la lista de tareas que hay a continuación, todos los integrantes del grupo se han encargado de arreglar bugs y fallos que han
ido surgiendo durante el desarrollo así como aportar en la documentación y la presentación que hubo el día 30 de mayo.

Milagros:
* Json para los sprites.
* Movimientos de los enemigos.
* HUD.
* Componente default enemy.
* Animaciones.
* Power ups. 

Jose:
* Pantalla de game over.
* Boss.

Víctor Reviejo:
* Movimiento del background.
* Generador de enemigos.

Víctor García:
* Movimientos de los enemigos.
* Animaciones.
* Disparos de enemigos.
* Boss.

Destacar, que el protagonista del juego ha sido desarrollado por todos los miembros del grupo, ya sea para corregir errores, añadir mejoras o extensiones del propio jugador.


## FUENTES Y REFERENCIAS

De esta página hemos sacado los recursos gráficos del juego -> https://www.spriters-resource.com/arcade/1942/ 
Gameplay de ejemplo en el que nos hemos basado -> https://www.youtube.com/watch?v=AlXf77Hheeo
