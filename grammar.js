/**
 * @file Rune tree-sitter syntax parser
 * @author Leorevoir
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 * constants
 */

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

/**
 * grammar
 */

module.exports = grammar({
  name: "rune",

  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) =>
      repeat(choice($._keyword, $.primitive_type, $.identifier, $.symbol)),

    _keyword: ($) => choice(...KEYWORDS.map((kw) => $[`kw_${kw}`])),

    ...Object.fromEntries(KEYWORDS.map((kw) => [`kw_${kw}`, () => kw])),

    primitive_type: ($) => choice(...PRIMITIVES),

    identifier: ($) => /[a-zA-Z_]\w*/,
    symbol: ($) => /[^\s\w]/,

    comment: (_) =>
      token(
        choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
      ),
  },
});
