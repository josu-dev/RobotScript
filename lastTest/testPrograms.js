const testPrograms = [
    `programa P1_1`,
    `programa P1_1
    areas
      ciudad : AreaP(1,1,1,100)
    variables 
      robot1: tipo1
    comenzar 
      AsignarArea(robot1,ciudad)
      Iniciar(robot1, 1, 1)
    fin`,
    `programa P1_1
    procesos
      proceso juntarFlor (ES flor: numero; ES noFlor: numero)
      comenzar
        si (HayFlorEnLaEsquina) {
          mientras (HayFlorEnLaEsquina){
            tomarFlor()
            flor:= flor + 1
          }
        }
        sino {
          noFlor:= noFlor +1
        }
      fin
    areas
      ciudad : AreaP(1,1,1,100)
    robots 
      robot tipo1
      variables
        flor: numero
        noFlor: numero
      comenzar
        flor:= 0
        noFlor:= 0
        juntarFlor(flor, noFlor)
        repetir (99){
          mover()
          juntarFlor(flor, noFlor)}
        repetir (flor){
          depositarFlor()}
        Informar(flor)
        Informar(noFlor)
      fin
    variables 
      robot1: tipo1
    comenzar 
      AsignarArea(robot1,ciudad)
      Iniciar(robot1, 1, 1)
    fin`,
    ``
];
module.exports = {
    testPrograms
}