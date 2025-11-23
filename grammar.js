/**
 * @file Rune tree-sitter syntax parser
 * @author Leorevoir <leo.quinzler@epitech.eu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "rune",

  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) => repeat(choice($._keyword, $.identifier, $.symbol)),

    _keyword: ($) =>
      choice(
        $.kw_def,
        $.kw_return,
        $.kw_struct,
        $.kw_if,
        $.kw_else,
        $.kw_for,
        $.kw_to,
        $.kw_override,
        $.kw_in,
      ),

    kw_def: ($) => "def",
    kw_return: ($) => "return",
    kw_struct: ($) => "struct",
    kw_if: ($) => "if",
    kw_else: ($) => "else",
    kw_for: ($) => "for",
    kw_to: ($) => "to",
    kw_override: ($) => "override",
    kw_in: ($) => "in",

    identifier: ($) => /[a-zA-Z_]\w*/,
    symbol: ($) => /[^\s\w]/,

    comment: (_) =>
      token(
        choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
      ),
  },
});
