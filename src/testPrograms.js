const test = [
  {
    name: "Programa inicial",
    description: "El robot realiza un cuadrado pequeño",
    test: `programa Prueba1
    areas
      ciudad: AreaC(1,1,100,100)
    robots
    // y los comentarios andan
      robot robot1
      comenzar
        repetir (4){
          mover()
          derecha()
        }
      fin
    variables
      Rinfo: robot1
    comenzar
      AsignarArea(Rinfo,ciudad)
      Iniciar(Rinfo,1,1)
    fin`
  },
  {
    name: "Procesos sencillo",
    description: "Se realiza dos cuadrados, alejados segun su posicion de Calle inical mas tres",
    test: `programa Prueba2
    procesos
      proceso cuadrado()
      comenzar
        repetir (4)
          repetir (2)
            mover()
          derecha()
      fin
    areas
      ciudad: AreaC(1,1,100,100)
    robots
      robot robot1
      comenzar 
        cuadrado()
        // under line: Pos(1,PosCa()+3)
        Pos(1,3)
        cuadrado()      
      fin
    variables
      Rinfo: robot1
    comenzar
      AsignarArea(Rinfo,ciudad)
      Iniciar(Rinfo,1,1)
    fin`
  },
  {
    name: "Procesos complejos",
    description: "Se juntan flores y papeles en escalones de tamano incremental. Se calcula la cantidad de escalones con papeles mayor a flores en 1",
    test: `programa Prueba3
    procesos
      proceso juntarFlorPapel(ES papel: numero; ES flor: numero)
      variables
        florE: numero
        papelE: numero
      comenzar  
        florE:= 0
        papelE:= 0
        mientras (HayFlorEnLaEsquina){
          tomarFlor()
          florE:= florE + 1
        }
        repetir (florE)
          depositarFlor()
        mientras (HayPapelEnLaEsquina){
          tomarPapel()
          papelE:= papelE + 1
        }
        repetir (papelE)
          depositarPapel()
        flor:= flor + florE
        papel:= papel + papelE
      fin
      proceso escalon(E tamano: numero; ES cantE: numero)
      variables
        papel: numero
        flor: numero
      comenzar
        papel:= 0
        flor:= 0
        repetir (2){
          repetir (tamano){
            juntarFlorPapel(papel, flor)
            mover()
          }
          juntarFlorPapel(papel, flor)
          derecha()
        }
        repetir (2)
          derecha()
        // under 2 line: si ((papel - flor) = 1)
        papel:= papel - flor
        si (papel = 1)
          cantE:= cantE + 1
      fin
    areas
      ciudad : AreaC(1,1,100,100)
    robots 
      robot tipo1
      variables
        tamano: numero
        cantE: numero
      comenzar
        tamano:= 1
        cantE:= 0
        repetir (4){
          escalon(tamano, cantE)
          tamano:= tamano + 1
        }
        Informar(cantE)
      fin
    variables 
      robot1: tipo1
      robot2: tipo1
      robot3: tipo1
    comenzar 
      AsignarArea(robot1,ciudad)
      AsignarArea(robot2,ciudad)
      AsignarArea(robot3,ciudad)
      Iniciar(robot1, 12, 14)
      Iniciar(robot2, 17, 10)
      Iniciar(robot3, 22, 6)
    fin`
  },
  {
    name: "Mensajes",
    description: "Recorrido de avenidas y recoleccion de flores para luego el robot con mayor cantidad comunique la diferencia entre los robots",
    test: `programa Prueba4
    procesos
      proceso juntaFlores(ES flores: numero)
      comenzar
        mientras HayFlorEnLaEsquina
          tomarFlor
          flores:= flores + 1
      fin
      proceso realizarRecorrido(ES flores: numero)
      comenzar
        juntaFlores(flores)
        repetir 9
          mover
          juntaFlores(flores)
      fin
    areas
      ciudad1: AreaP(1,1,1,10)
      ciudad2: AreaP(2,11,2,20)
    robots
      robot tipo1
      variables
        flores: numero
        floresR: numero
      comenzar
        flores:= 0
        realizarRecorrido(flores)
        EnviarMensaje(flores,robot2)
        RecibirMensaje(floresR, robot2)
        si (flores>floresR)
          Informar('Diferencia',flores - floresR)
      fin
      robot tipo2
      variables
        flores: numero
        floresR: numero
      comenzar
        flores:= 0
        realizarRecorrido(flores)
        EnviarMensaje(flores,robot1)
        RecibirMensaje(floresR, robot1)
        si (flores>floresR)
          Informar('Diferencia',flores - floresR)
      fin
    variables
      robot1: tipo1
      robot2: tipo2
    comenzar
      AsignarArea(robot1, ciudad1)
      AsignarArea(robot2, ciudad2)
      Iniciar(robot1, 1, 1)
      Iniciar(robot2, 2, 11)
    fin`
  },
  {
    name: "IDs",
    description: "Un robot jefe comunica que trabajador a juntado la mayor cantidad de flores, y cuanto ha sido",
    test: `programa Prueba5
    procesos
      proceso juntaFlores(ES flores: numero)
      comenzar
        mientras HayFlorEnLaEsquina
          tomarFlor
          flores:= flores + 1
      fin
      proceso realizarRecorrido(ES flores: numero)
      comenzar
        juntaFlores(flores)
        repetir 9
          mover
          juntaFlores(flores)
      fin
    areas
      ciudad1: AreaP(1,1,1,10)
      ciudad2: AreaP(2,11,2,20)
      ciudad3: AreaP(3,21,3,30)
      ciudad4: AreaP(4,31,4,40)
      ciudad5: AreaP(5,41,5,50)
      ciudad6: AreaP(6,51,6,60)
      ciudad7: AreaP(2,1,2,1)
    robots
      robot tipo1
      variables
        flores: numero
        id: numero
      comenzar
        flores:= 0
        RecibirMensaje(id, robot7)
        realizarRecorrido(flores)
        EnviarMensaje(id,robot7)
        EnviarMensaje(flores,robot7)
      fin
      robot tipo2
      variables
        flores: numero
        fMax: numero
        idMax: numero
        id: numero
      comenzar
        fMax:= -1
        EnviarMensaje(1, robot1)
        EnviarMensaje(2, robot2)
        EnviarMensaje(3, robot3)
        EnviarMensaje(4, robot4)
        EnviarMensaje(5, robot5)
        EnviarMensaje(6, robot6)
        repetir 6
          RecibirMensaje(id, *)
          si (id = 1)
            RecibirMensaje(flores, robot1)
          sino 
            si (id = 2)
              RecibirMensaje(flores, robot2)
            sino
              si (id = 3)
                RecibirMensaje(flores, robot3)
              sino
                si (id = 4)
                  RecibirMensaje(flores, robot4)
                sino
                  si (id = 5)
                    RecibirMensaje(flores, robot5)
                  sino
                    RecibirMensaje(flores, robot6)
          si (flores>fMax) 
            fMax:= flores
            idMax:= id
        Informar('Robot', idMax)
        Informar('Maximo', fMax)
      fin
    variables
      robot1: tipo1
      robot2: tipo1
      robot3: tipo1
      robot4: tipo1
      robot5: tipo1
      robot6: tipo1
      robot7: tipo2
    comenzar
      AsignarArea(robot1, ciudad1)
      AsignarArea(robot2, ciudad2)
      AsignarArea(robot3, ciudad3)
      AsignarArea(robot4, ciudad4)
      AsignarArea(robot5, ciudad5)
      AsignarArea(robot6, ciudad6)
      AsignarArea(robot7, ciudad7)
      Iniciar(robot1, 1, 1)
      Iniciar(robot2, 2, 11)
      Iniciar(robot3, 3, 21)
      Iniciar(robot4, 4, 31)
      Iniciar(robot5, 5, 41)
      Iniciar(robot6, 6, 51)
      Iniciar(robot7, 2, 1)
    fin`
  },
  {
    name: "Bloquear y Liberar esquinas",
    description: "Se juntan flores y papeles en avenidas y calles aleatorias para luego ir a colocarlas en una esquina intencionada",
    test: `programa Prueba6
    procesos
      proceso juntarFlores(ES flores: numero)
      comenzar
        mientras HayFlorEnLaEsquina
          tomarFlor
          flores:= flores + 1
      fin
      proceso juntarPapeles(ES papeles: numero)
      comenzar
        mientras HayPapelEnLaEsquina
          tomarPapel
          papeles:= papeles + 1
      fin
      proceso juntarEnEsquinaFlores(ES flores: numero; E AvO: numero)
      variables
        Av, Ca: numero
      comenzar
        Random(Av, 1, 5)
        Random(Ca, 1, 10)
        BloquearEsquina(Av, Ca)
        Pos(Av, Ca)
        juntarFlores(flores)
        Pos(AvO, 10)
        LiberarEsquina(Av, Ca)
      fin
      proceso juntarEnEsquinaPapeles(ES papeles: numero; E AvO: numero)
      variables
        Av, Ca: numero
      comenzar
        Random(Av, 6, 10)
        Random(Ca, 1, 9)
        BloquearEsquina(Av, Ca)
        Pos(Av, Ca)
        juntarPapeles(papeles)
        Pos(AvO, 10)
        LiberarEsquina(Av, Ca)
      fin
    areas
      ciudad1: AreaPC(1,1,5,10)
      ciudad2: AreaPC(6,1,10,9)
      ciudad3: AreaP(6,10,6,10)
      ciudad4: AreaP(7,10,7,10)
      ciudad5: AreaP(8,10,8,10)
      ciudad6: AreaP(9,10,9,10)
      ciudad7: AreaP(10,10,10,10)
    robots
      robot florero
      variables
        flores: numero
        AvO: numero
      comenzar
        flores:= 0
        AvO:= PosAv
        repetir 5
          juntarEnEsquinaFlores(flores, AvO)
        BloquearEsquina(10, 10)
        Pos(10, 10)
        repetir flores
          depositarFlor
        Pos(AvO, 10)
        LiberarEsquina(10, 10)
      fin
      robot papelero
      variables
        papeles: numero
        AvO: numero
      comenzar
        papeles:= 0
        AvO:= PosAv
        repetir 3
          juntarEnEsquinaPapeles(papeles, AvO)
        BloquearEsquina(10, 10)
        Pos(10, 10)
        repetir papeles
          depositarPapel
        Pos(AvO, 10)
        LiberarEsquina(10, 10)
      fin
    variables
      robot1: florero
      robot2: florero
      robot3: papelero
      robot4: papelero
    comenzar
      AsignarArea(robot1, ciudad1)
      AsignarArea(robot2, ciudad1)
      AsignarArea(robot3, ciudad2)
      AsignarArea(robot4, ciudad2)
      AsignarArea(robot1, ciudad3)
      AsignarArea(robot2, ciudad4)
      AsignarArea(robot3, ciudad5)
      AsignarArea(robot4, ciudad6)
      AsignarArea(robot1, ciudad7)
      AsignarArea(robot2, ciudad7)
      AsignarArea(robot3, ciudad7)
      AsignarArea(robot4, ciudad7)
      Iniciar(robot1, 6, 10)
      Iniciar(robot2, 7, 10)
      Iniciar(robot3, 8, 10)
      Iniciar(robot4, 9, 10)
    fin`
  },
  {
    name: "Bloquear y Liberar esquinas/ Envio de Mensajes",
    description: "Mientras el robot trabajador pueda juntar una flor de la esquina 11/11, avanzara por su avenida. Luego se comunica quien ha avanzado la mayor longitud",
    test: `programa Prueba7
    procesos
      proceso chequearEsquina(ES termino: boolean; ES hayFlor: boolean)
      comenzar
        si HayFlorEnLaEsquina
          tomarFlor
          hayFlor:= V 
        termino:= HayFlorEnLaEsquina
      fin
      proceso movimientoA11(ES termino: boolean; E AvO: numero; ES hayFlor: boolean)
      variables
        Calle: numero
      comenzar
        hayFlor:= F
        Calle:= PosCa
        BloquearEsquina(11,11)
        Pos(11,11)
        chequearEsquina(termino, hayFlor)
        Pos(AvO,Calle)
        LiberarEsquina(11,11)
      fin
    areas
      ciudad1: AreaP(4,1,4,100)
      ciudad2: AreaP(6,1,6,100)
      ciudad3: AreaP(8,1,8,100)
      ciudad4: AreaP(10,1,10,100)
      ciudad5: AreaP(1,1,1,1)
      ciudad6: AreaPC(11,11,11,11)
    robots
      robot corredor
      variables
        termino: boolean
        hayFlor: boolean
        AvO: numero
        Ca: numero
        id: numero
      comenzar
        termino:= V
        AvO:= PosAv
        mientras (termino) & (PosCa<100)
          movimientoA11(termino, AvO, hayFlor)
          si hayFlor
            depositarFlor
            mover
        Ca:= PosCa
        RecibirMensaje(id, robot5)
        EnviarMensaje(id, robot5)
        EnviarMensaje(Ca, robot5)
      fin
      robot coordinador
      variables
        cantEsq: numero
        cantEsqMax: numero
        id: numero
        idMax: numero
      comenzar
        cantEsqMax:= -1
        EnviarMensaje(1, robot1)
        EnviarMensaje(2, robot2)
        EnviarMensaje(3, robot3)
        EnviarMensaje(4, robot4)
        repetir 4
          RecibirMensaje(id, *)
          si (id = 1)
            RecibirMensaje(cantEsq, robot1)
          sino
            si (id = 2)
              RecibirMensaje(cantEsq, robot2)
            sino
              si (id = 3)
                RecibirMensaje(cantEsq, robot3)
              sino
                RecibirMensaje(cantEsq, robot4)
          si (cantEsq>cantEsqMax)
            cantEsqMax:= cantEsq
            idMax:= id
        Informar(idMax)
      fin
    variables
      robot1: corredor
      robot2: corredor
      robot3: corredor
      robot4: corredor
      robot5: coordinador
    comenzar
      AsignarArea(robot1, ciudad1)
      AsignarArea(robot1, ciudad6)
      AsignarArea(robot2, ciudad2)
      AsignarArea(robot2, ciudad6)
      AsignarArea(robot3, ciudad3)
      AsignarArea(robot3, ciudad6)
      AsignarArea(robot4, ciudad4)
      AsignarArea(robot4, ciudad6)
      AsignarArea(robot5, ciudad5)
      AsignarArea(robot5, ciudad6)
      Iniciar(robot1, 4, 1)
      Iniciar(robot2, 6, 1)
      Iniciar(robot3, 8, 1)
      Iniciar(robot4, 10, 1)
      Iniciar(robot5, 1, 1)
    fin`
  },
];

module.exports = {
    test1: test
}
