/**
 * @file Rune tree-sitter syntax parser
 * @author Leorevoir
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const KEYWORDS = [
  "def",
  "return",
  "struct",
  "if",
  "else",
  "for",
  "to",
  "override",
  "in",
  "self",
];

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

const OPERATORS = [
  "+",
  "-",
  "*",
  "/",
  "=",
  "==",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "->",
  "~>",
];

const PUNCTUATION = ["(", ")", "{", "}", "[", "]", ",", ".", ":", ";", "?"];

module.exports = grammar({
  name: "rune",

  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) =>
      repeat(
        choice(
          $._keyword,
          $.primitive_type,
          $.identifier,
          $.char_literal,
          $.string_literal,
          $.number_literal,
          $.operator,
          $.punctuation,
        ),
      ),

    _keyword: ($) => choice(...KEYWORDS.map((kw) => $[`kw_${kw}`])),

    ...Object.fromEntries(KEYWORDS.map((kw) => [`kw_${kw}`, () => kw])),

    primitive_type: ($) => choice(...PRIMITIVES),

    identifier: ($) => /[a-zA-Z_]\w*/,

    char_literal: ($) => token(seq("'", choice(/[^'\\]/, seq("\\", /./)), "'")),

    string_literal: ($) => token(/"([^"\\]|\\.)*"/),

    number_literal: ($) => token(/\d[\d_]*(\.\d+)?/),

    operator: ($) => choice(...OPERATORS),
    punctuation: ($) => choice(...PUNCTUATION),

    comment: (_) =>
      token(
        choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
      ),
  },
});
