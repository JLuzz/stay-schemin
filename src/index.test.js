import PropTypes from 'prop-types';

import { staySchemin } from './index'

const serialize = (object) => JSON.stringify(object, null, 2)

describe('staySchemin', () => {
  it('should convert a one property schema JSON schema to React PropTypes', () => {
    const simpleSchema = {
      type: 'object',
      properties: {
        value: { type: 'string' },
      },
      required: ['value'],
    };

    const propTypes = staySchemin(simpleSchema);

    expect(serialize(propTypes)).toEqual(serialize(PropTypes.shape({
      value: PropTypes.string.isRequired,
    })));
  });

  it('should convert a simple JSON schema to React PropTypes', () => {
    const sampleSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
        isActive: { type: 'boolean' },
        hobbies: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['name', 'age'],
    };

    const propTypes = staySchemin(sampleSchema);

    expect(serialize(propTypes)).toEqual(serialize(PropTypes.shape({
      name: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
      isActive: PropTypes.bool,
      hobbies: PropTypes.arrayOf(PropTypes.string),
    })));
  });

  it('should handle nested objects and arrays', () => {
    const nestedSchema = {
      type: 'object',
      properties: {
        person: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' },
          },
          required: ['name'],
        },
        hobbies: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['person'],
    };

    const propTypes = staySchemin(nestedSchema);

    expect(serialize(propTypes)).toEqual(serialize(PropTypes.shape({
      person: PropTypes.shape({
        name: PropTypes.string.isRequired,
        age: PropTypes.number,
      }).isRequired,
      hobbies: PropTypes.arrayOf(PropTypes.string),
    })));
  });
});
