import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Select } from '@rocketseat/unform';
import { Link } from 'react-router-dom';
import { schema } from './validationSchema';

import { signUpRequest } from '../../store/modules/auth/actions';

// import { Container } from './styles';

export default function SignUp() {
  const dispatch = useDispatch();
  // roles will come from database in useEffect.
  const roles = [
    { id: 'Frontend', title: 'Frontend' },
    { id: 'Backend', title: 'Backend' },
    { id: 'Fullstack', title: 'Fullstack' },
    { id: 'Management', title: 'Management' },
    { id: 'Busines', title: 'Busines' },
    { id: 'Marketing', title: 'Marketing' },
    { id: 'UX/UI', title: 'UX/UI' },
  ];

  function handleSubmit({ name, email, password, bio, skill }) {
    dispatch(signUpRequest(name, email, password, bio, skill));
  }

  return (
    <Form schema={schema} onSubmit={handleSubmit}>
      <Input name="name" label="Name: " />
      <Input name="email" type="email" label="Email: " err />
      <Input name="password" type="password" label="Password: " />
      <Input name="bio" maxLength="255" label="Bio: " multiline />

      <Select name="skill" options={roles} label="Skills 1: " />
      <Select name="skill" options={roles} label="Skills 2: " />
      <Select name="skill" options={roles} label="Skills 3: " />

      <button type="submit">Send</button>
      <Link to="/">Have an account? Make a login!</Link>
    </Form>
  );
}
