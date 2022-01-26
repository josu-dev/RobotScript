const rsProgram = {
    name : "prueba",
    procedures : [
        {
            id : "modulePrueba",
            parameters : [],
            variables : [],
            instructions : [],
        }
    ],
    areas : [
        {
            id : "ciudad",
            type : "AreaC",
            p1 : {
                x : 1,
                y : 1,
            },
            p2 : {
                x : 100,
                y : 100,
            },
        },
    ],
    robots : [
        {
            id : "tester",
            variables : [],
            instructions : [],
        }
    ],
    instances : [
        {
            id : "r1",
            type : "tester",
        },
        {
            id : "r2",
            type : "tester",
        }
    ],
    initialization : [
        {
            id : "r1",
            areas : [ "ciudad", ],
            x : 1,
            y : 1,
        },
        {
            id : "r2",
            areas : [ "ciudad", ],
            x : 10,
            y : 10,
        }
    ]
}