(comment) @comment

;----------------------------------
; keywords
;---------------------------------

(kw_def) @keyword.function
(kw_struct) @keyword.type

(kw_if) @keyword.conditional
(kw_else) @keyword.conditional
(kw_for) @keyword.repeat
(kw_return) @keyword.return

(kw_in) @keyword.operator
(kw_override) @keyword
(kw_to) @keyword
(kw_self) @variable.builtin

;----------------------------------
; types
;---------------------------------

(primitive_type) @type.builtin

;----------------------------------
; literals
;---------------------------------

(char_literal) @character
(string_literal) @string
(number_literal) @number

;----------------------------------
; identifiers
;---------------------------------

(identifier) @variable
