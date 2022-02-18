"use strict";

/** @type LanguageFn */
export default function(hljs) {
    const IDENT_RE = '[a-zA-Z_ñÑ][a-zA-Z_0-9ñÑ]*';
    const MAIN_KEYWORDS = [
        'si',
        'sino',
        'mientras',
        'repetir' 
    ];

    const META = [
        'programa',
        'procesos',
        'variables',
        'areas',
        'robots',
        'comenzar',
        'fin'
    ]

    const BUILT_IN = [
        'HayFlorEnLaEsquina',
        'HayPapelEnLaEsquina',
        'HayFlorEnLaBolsa',
        'HayPapelEnLaBolsa',
        'PosCa',
        'PosAv',
        'Pos',
        'mover',
        'derecha',
        'tomarFlor',
        'tomarPapel',
        'depositarFlor',
        'depositarPapel',
        'AsignarArea',
        'Iniciar',
        'Informar',
        'Random',
        'EnviarMensaje',
        'RecibirMensaje',
        'BloquearEsquina',
        'LiberarEsquina'
    ];

    const LITERALS = [
        'verdad',
        'falso'
    ];

    const TYPES = [
    'numero',
    'boolean',
    'AreaPC',
    'AreaC',
    'AreaP',
    'ES',
    'E'
    ];

    const VARIABLE_LENGUAGE = [
        'proceso',
        'robot'
    ]

    const KEYWORDS = {
        keyword: MAIN_KEYWORDS,
        literal: LITERALS,
        type: TYPES,
        built_in: BUILT_IN,
        //   "title.class": CLASS_NAME,
        meta: META,
        'variable.lenguage': VARIABLE_LENGUAGE,
    };

    return {
        name: 'RobotScript',
        case_insensitive: false,
        aliases: [ 'rs', 'RS', 'rbs' ],
        keywords: KEYWORDS,
        illegal: /<\/|#/,
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.C_NUMBER_MODE,
        ]
    };
};