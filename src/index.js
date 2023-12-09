import PropTypes from 'prop-types'

export function staySchemin(schema) {
  if (schema.type === 'object') {
    const propTypes = {};
    Object.keys(schema.properties).forEach((key) => {
      propTypes[key] = staySchemin(schema.properties[key]);
    });

    const requiredFields = schema.required || [];
    const propTypeShape = PropTypes.shape(propTypes);

    return requiredFields.length > 0 ? propTypeShape.isRequired : propTypeShape;
  } else if (schema.type === 'array') {
    if (schema.items) {
      const propTypeArray = PropTypes.arrayOf(staySchemin(schema.items));
      return schema.required ? propTypeArray.isRequired : propTypeArray;
    } else {
      return schema.required ? PropTypes.array.isRequired : PropTypes.array;
    }
  } else {
    switch (schema.type) {
      case 'string':
        return schema.required ? PropTypes.string.isRequired : PropTypes.string;
      case 'number':
        return schema.required ? PropTypes.number.isRequired : PropTypes.number;
      case 'integer':
        return schema.required ? PropTypes.number.isRequired : PropTypes.number;
      case 'boolean':
        return schema.required ? PropTypes.bool.isRequired : PropTypes.bool;
      default:
        return schema.required ? PropTypes.any.isRequired : PropTypes.any;
    }
  }
}
