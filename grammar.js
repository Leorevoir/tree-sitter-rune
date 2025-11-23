/**
 * @file Rune tree-sitter syntax parser
 * @author Leorevoir
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  COMMENT: 0,
  ASSIGNMENT: 1,
  LOGICAL_OR: 2,
  LOGICAL_AND: 3,
  EQUAL: 4,
  RELATIONAL: 5,
  ADD: 6,
  MULTIPLY: 7,
  TRY: 8,
  CALL: 9,
  FIELD: 10,
  SUBSCRIPT: 11,
};

const PRIMITIVES = [
  "i8",
  "i16",
  "i32",
  "i64",
  "u8",
  "u16",
  "u32",
  "f32",
  "f64",
  "bool",
  "string",
  "any",
  "null",
];

const BINARY_OPERATORS = [
  ["+", PREC.ADD],
  ["-", PREC.ADD],
  ["*", PREC.MULTIPLY],
  ["/", PREC.MULTIPLY],
  ["==", PREC.EQUAL],
  ["!=", PREC.EQUAL],
  ["<", PREC.RELATIONAL],
  [">", PREC.RELATIONAL],
  ["<=", PREC.RELATIONAL],
  [">=", PREC.RELATIONAL],
];

const comma_sep = (rule) => {
  return optional(seq(rule, repeat(seq(",", rule))));
};

module.exports = grammar({
  name: "rune",

  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$.struct_expression, $.block],

    [$.type_identifier, $._expression],
    [$.type_identifier, $.identifier],
  ],

  rules: {
    source_file: ($) => repeat($._top_level_item),

    _top_level_item: ($) =>
      choice($.function_definition, $.struct_definition, $.statement),

    function_definition: ($) =>
      seq(
        optional("override"),
        "def",
        field("name", $.identifier),
        field("parameters", $.parameter_list),
        optional(
          seq(
            field("arrow", choice("->", "~>")),
            field("return_type", $._type),
          ),
        ),
        field("body", $.block),
      ),

    parameter_list: ($) =>
      seq("(", comma_sep(choice($.parameter, $.self_parameter)), ")"),

    parameter: ($) =>
      seq(field("name", $.identifier), ":", field("type", $._type)),

    self_parameter: ($) => "self",

    struct_definition: ($) =>
      seq(
        "struct",
        field("name", $.type_identifier),
        field("body", $.struct_body),
      ),

    struct_body: ($) =>
      seq("{", repeat(choice($.field_declaration, $.function_definition)), "}"),

    field_declaration: ($) =>
      seq(field("name", $.field_identifier), ":", field("type", $._type), ";"),

    _type: ($) => choice($.primitive_type, $.type_identifier),

    primitive_type: ($) => choice(...PRIMITIVES),

    type_identifier: ($) => alias($.identifier, "type_identifier"),

    statement: ($) =>
      choice(
        $.return_statement,
        $.if_statement,
        $.for_statement,
        $.variable_declaration,
        $.assignment_statement,
        $.expression_statement,
      ),

    block: ($) => seq("{", repeat($.statement), optional($._expression), "}"),

    return_statement: ($) => seq("return", optional($._expression), ";"),

    variable_declaration: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("type", $._type),
        "=",
        field("value", $._expression),
        ";",
      ),

    assignment_statement: ($) =>
      seq(
        field(
          "left",
          choice($.identifier, $.field_expression, $.subscript_expression),
        ),
        "=",
        field("right", $._expression),
        ";",
      ),

    expression_statement: ($) => seq($._expression, ";"),

    if_statement: ($) =>
      seq(
        "if",
        field("condition", $._expression),
        field("consequence", $.block),
        optional(
          seq("else", field("alternative", choice($.block, $.if_statement))),
        ),
      ),

    for_statement: ($) =>
      seq(
        "for",
        field("left", $.identifier),
        "in",
        field("right", $._expression),
        field("body", $.block),
      ),

    _expression: ($) =>
      choice(
        $.binary_expression,
        $.call_expression,
        $.field_expression,
        $.subscript_expression,
        $.struct_expression,
        $.try_expression,
        $.identifier,
        $.number_literal,
        $.string_literal,
        $.char_literal,
        $.boolean_literal,
        $.null_literal,
      ),

    binary_expression: ($) =>
      choice(
        ...BINARY_OPERATORS.map(([operator, precedence]) =>
          prec.left(
            precedence,
            seq(
              field("left", $._expression),
              field("operator", operator),
              field("right", $._expression),
            ),
          ),
        ),
      ),

    call_expression: ($) =>
      prec(
        PREC.CALL,
        seq(
          field("function", $._expression),
          field("arguments", $.argument_list),
        ),
      ),

    argument_list: ($) => seq("(", comma_sep($._expression), ")"),

    field_expression: ($) =>
      prec(
        PREC.FIELD,
        seq(
          field("object", $._expression),
          ".",
          field("field", $.field_identifier),
        ),
      ),

    subscript_expression: ($) =>
      prec(
        PREC.SUBSCRIPT,
        seq(
          field("object", $._expression),
          "[",
          field("index", $._expression),
          "]",
        ),
      ),

    try_expression: ($) =>
      prec(PREC.TRY, seq(field("expression", $._expression), "?")),

    struct_expression: ($) =>
      seq(
        field("type", $.type_identifier),
        "{",
        comma_sep($.field_initializer),
        optional(","),
        "}",
      ),

    field_initializer: ($) =>
      seq(
        field("name", $.field_identifier),
        ":",
        field("value", $._expression),
      ),

    identifier: ($) => /[a-zA-Z_]\w*/,
    field_identifier: ($) => alias($.identifier, "field_identifier"),

    number_literal: ($) => /\d[\d_]*(\.\d+)?/,
    string_literal: ($) => /"[^"]*"/,
    char_literal: ($) => /'[^']'/,
    boolean_literal: ($) => choice("true", "false"),
    null_literal: ($) => "null",

    comment: ($) =>
      token(
        choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
      ),
  },
});
