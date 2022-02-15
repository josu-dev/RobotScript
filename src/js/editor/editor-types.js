/**
 * General types
 * 
 * @typedef {{type: string, operator?: string, lhs?: string, rhs?: string, identifier?: string, value?: number|boolean}} expression
 * 
 * @typedef {{type_value: string, identifier: string}} variable
 * 
 * @typedef {{type: string, identifier?: string, value?: expression, body?: statement[], condition?: expression, arg1?: {type:string, value: string}|expression, arg2?: expression, min?: expression, max?: expression, x?: expression, y?: expression, who?: string, mode?: string, parameters?: parameter[]}} statement
 * 
 * 
 * @typedef {{type: string, identifier: string}} name
 * 
 * @typedef {{type_parameter: string, identifier: string, type_value: string}} parameter
 * @typedef {{identifier: string, parameters: parameter[], local_variables: variable[], body: statement[]}} procedure
 * @typedef {{identifier: string, parameters: parameter[]}} validProcedure
 * 
 * @typedef {{x: number, y: number}} point
 * @typedef {{identifier: string, type: string, a: point, b: point}} area
 * 
 * @typedef {{identifier: string, local_variables: variable[], body: statement[]}} robot
 * 
 * @typedef {{identifier: string, type: string}} instance
 * 
 * @typedef {{identifier: string, type: string}} assign_area
 * @typedef {{identifier: string, type: string[], value: number}} assign_item
 * @typedef {{identifier: string, x: number, y:number}} assign_origin
 * @typedef {{assign_areas: assign_area[], assign_items: assign_item[], assign_origins: assign_origin[]}} init
 * 
 * @typedef {{NAME: name, PROCEDURES: procedure[], AREAS: area[], ROBOT_TYPES: robot[], INSTANCES: instance[], INITS: init[]}} RSast
 * 
 * @typedef {{type: string, value: RSast}} RSProgram
 * 
 * @typedef {{ast: RSProgram | null, error: string | null, errors: object[] | null}} transpalingResult
 */