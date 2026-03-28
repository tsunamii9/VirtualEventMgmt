'use strict';

const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('organizer', 'attendee', 'admin').default('attendee'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const eventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required().messages({
    'string.min': 'Title must be at least 3 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().trim().max(2000).required().messages({
    'any.required': 'Description is required',
  }),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
    'string.pattern.base': 'Date must be in YYYY-MM-DD format',
    'any.required': 'Date is required',
  }),
  time: Joi.string().pattern(/^\d{2}:\d{2}$/).required().messages({
    'string.pattern.base': 'Time must be in HH:MM format',
    'any.required': 'Time is required',
  }),
});

function validate(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
  if (error) {
    const messages = error.details.map(d => d.message);
    return { errors: messages, value: null };
  }
  return { errors: null, value };
}

module.exports = { registerSchema, loginSchema, eventSchema, validate };
