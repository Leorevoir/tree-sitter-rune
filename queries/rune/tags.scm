(struct_definition
  name: (type_identifier) @name) @definition.class

(function_definition
  name: (identifier) @name) @definition.function

(field_declaration
  name: (field_identifier) @name) @definition.field

(call_expression
  function: (identifier) @name) @reference.call

(call_expression
  function: (field_expression
    field: (field_identifier) @name)) @reference.call
