import React from 'react';

import { render } from '@testing-library/react';

import Button from '.';

test('renders button', () => {
  const { asFragment } = render(<Button title='The future is NEAR' />);

  expect(asFragment()).toMatchSnapshot();
});
