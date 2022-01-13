const {programParser} = require('./astGenerator');

const myProgram = `  programa P1_1
variables
  flor: numero
  noFlor: numero
  noFlor: numero
areas
ciudad : AreaC(1,1,1,100)
ok : AreaP(1,1,1,100)
  pepe : AreaPC(55,76,7,7)
procesos
  proceso juntarFlor (ES flor: numero; ES noFlor: numero)
  comenzar
    si HayFlorEnLaEsquina
      mientras HayFlorEnLaEsquina
        tomarFlor
        flor:= flor + 1
    sino
      noFlor:= noFlor +1
  fin
robots 
  robot tipo1
  variables
    flor: numero
    noFlor: numero
  comenzar
    flor:= 0
    noFlor:= 0
    juntarFlor(flor, noFlor)
    repetir 99
      mover
      juntarFlor(flor, noFlor)
    repetir flor
      depositarFlor
    Informar(flor)
    Informar(noFlor)
  fin
variables 
  robot1: tipo1
comenzar 
  AsignarArea(robot1,ciudad)
  Iniciar(robot1, 1, 1)
fin`;

const result = programParser.run( myProgram ).result;
console.log(result);
console.log(
    JSON.stringify(result, null, '   ')
);
console.log(programParser)