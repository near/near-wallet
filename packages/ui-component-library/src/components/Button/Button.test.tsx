import React from 'react';

import { render } from '@testing-library/react';

import Button from '.';

test('renders button', () => {
  const { asFragment } = render(<Button>The future is NEAR</Button>);

  expect(asFragment()).toMatchSnapshot();
});
