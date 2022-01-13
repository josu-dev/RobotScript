  const {
  str,
  letters,
  digits,
  sequenceOf,
  choice,
  many,
  many1,
  sepBy,
  sepBy1,
  between,
  lazy,
} = require('./parser');

const tag = type => value => ({ type, value });

const whitespace = many(str(' ')).map(tag('whitespace'));

const newLine = sequenceOf([
    whitespace,
    str('\n'),
]).map(result => ({
  type : 'newline',
  value : ' '
}));

const nameParser = many1(choice([
    digits,
    letters,
    str('-'),
    str('_'),
])).map(results => ( results.join('') ));

const variableType = choice([
    str('boolean'),
    str('numero')
]);

const startParser = sequenceOf ([
  whitespace,
  str ('programa'),
  whitespace,
  nameParser,
  newLine,
]).map(results => ({
  type : 'programName',
  value : results[3]
}));

const declarationValue = sequenceOf ([
  whitespace,
  nameParser,
  whitespace,
  str(':'),
  whitespace,
  variableType,
  newLine,
])
.map(results => ({
    type : results[5],
    reference : results[1]
}));

const variables = sequenceOf ([
  whitespace,
  str('variables'),
  newLine,
  many1(declarationValue),
]).map(results => ({
  type : 'variables',
  value : results[3]
}));

const betweenParentesis =  between(str('('), str(')'));

const numberParser = digits.map(result => ({
  type: 'number',
  value: Number(result)
}));

const point = sequenceOf([
    whitespace,
    numberParser,
    whitespace,
    str(','),
    whitespace,
    numberParser,
    whitespace,
]).map(results => ({
    type : 'point',
    x : results[1],
    y : results[5]
}));

const doublePoint = betweenParentesis(
  sequenceOf ([
    point,
    str(','),
    point,
  ]).map(results => ({
      type : 'doublePoint',
      p1 : results[0],
      p2 : results[2]
    }))
);

const areaType = sequenceOf ([
    choice([
      str('AreaPC'),
      str('AreaP'),
      str('AreaC'),
    ]),
    whitespace,
    doublePoint
]).map(results => ({
  type : results[0],
  value : results[2]
}));

const declarationArea = sequenceOf ([
  whitespace,
  nameParser,
  whitespace,
  str(':'),
  whitespace,
  areaType,
  newLine
])
.map(results => ({
    type : results[5].type,
    value : results[5].value,
    reference : results[1]
}));

const areasParser = sequenceOf ([
  whitespace,
  str('areas'),
  newLine,
  many1(declarationArea),
]).map(results => ({
  type : 'areas',
  value : results[3]
}));


const betweenBody = between (str('comenzar',str('fin')));

const booleanParser = choice([
  str('V'),
  str('F')
]).map(result => ( result == 'V' ? true : false));

const betweenDoubleQuotes = between(str('"'),str('"'));

const stringParser = choice([
  betweenDoubleQuotes(many1(choice([
    digits,
    letters,
    str(' '),
    str('-'),
    str('_'),
  ])))
]).map(results => ( results.join('') ));

const literalValue = choice([
  numberParser,
  booleanParser,
  stringParser,
]);

const expresion = sequenceOf

const asignation = sequenceOf([
  whitespace,
  nameParser,
  whitespace,
  str(':='),
  whitespace,
  choice ([
    expresion,
    literalValue,
  ]),
  newLine,
]).map(results => ({
  type : 'asignation',
  value : results[5]
}));
/*
const declarationBody = sequenceOf ([
  whitespace,
  betweenBody(many1(choice([
    asignation,
    ifStatement,
    whileStatement,
    forStatement,
    procedureCall,
    methodCall,
  ]))),
])

const declarationRobot = sequenceOf ([
  whitespace,
  str('robot'),
  whitespace,
  nameParser,
  newLine,
  many(variables),
  declarationBody,
]).map(results => ({
  type : 'robot',
  value : results[6],
  reference : results[3],
  variables: results[5]
}));

const robotsParser = sequenceOf ([
  whitespace,
  str('robots'),
  newLine,
  many1(declarationRobot),
]).map(results => ({
  type : 'robots',
  value : results[3]
}));
*/
/*const procedure = sequenceOf ([
])
const proceduresParser

const variablesParser
const mainParser*/

const programParser = sequenceOf([
  startParser,
  variables,
  areasParser,
  /*many(proceduresParser),
  robotsParser,
  variablesParser,
  mainParser*/
]);

module.exports = {
  programParser,
};