import React from 'react';

import Button, { ButtonVariant } from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {}
};
const Template: React.FC = ({ children, ...args }) => {
  return (
    <Button {...args} title='The future is NEAR'>
      {children}
    </Button>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  variant: ButtonVariant.Primary
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  variant: ButtonVariant.Primary,
  children: (
    <span>
      The future is NEAR{' '}
      <span role='img' aria-label='emoji'>
        😄
      </span>
    </span>
  )
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: ButtonVariant.Secondary
};
