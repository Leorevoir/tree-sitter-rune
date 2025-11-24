(comment) @comment

;----------------------------------
; keywords
;---------------------------------

"def" @keyword.function
"struct" @keyword.type
"if" @keyword.conditional
"else" @keyword.conditional
"for" @keyword.repeat
"in" @keyword.operator
"return" @keyword.return
"override" @keyword.modifier
(self_parameter) @variable.builtin

;----------------------------------
; types
;---------------------------------

(primitive_type) @type.builtin
(type_identifier) @type
(struct_definition name: (type_identifier) @type)

;----------------------------------
; literals
;---------------------------------

(string_literal) @string
(char_literal) @character
(number_literal) @number
(boolean_literal) @boolean
(null_literal) @constant.builtin

;----------------------------------
; symbols
;---------------------------------

(binary_expression operator: _ @operator)
"?" @operator
"=" @operator

"->" @operator
"~>" @operator

":" @punctuation.delimiter
";" @punctuation.delimiter
"." @punctuation.delimiter
"," @punctuation.delimiter

"{" @punctuation.bracket
"}" @punctuation.bracket
"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket

;----------------------------------
; variables
;---------------------------------

; INFO: parameter in function definition fn foo(x: i32, y: i32)
(parameter name: (identifier) @variable.parameter)

; INFO: field declaration struct Vec { x: i32, y: i32 }
(field_declaration name: (field_identifier) @property)

; INFO: field initialization {x: 10, y: 20}
(field_initializer name: (field_identifier) @property)

; INFO: field access vec.x; vec.y
(field_expression field: (field_identifier) @property)

(variable_declaration name: (identifier) @variable)
(assignment_statement left: (identifier) @variable)

((identifier) @variable.builtin
 (#eq? @variable.builtin "self"))

(identifier) @variable

;----------------------------------
; functions
;---------------------------------

; INFO: overrides @variable for function definitions
(function_definition name: (identifier) @function)

(call_expression
  function: (identifier) @function.call)

; INFO: overrides @property for method calls
(call_expression
  function: (field_expression
    field: (field_identifier) @function.call))
