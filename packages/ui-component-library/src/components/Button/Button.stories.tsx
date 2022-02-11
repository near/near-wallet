import React from 'react';

import Button, { ButtonVariant } from './Button';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Button',
  component: Button,
  argTypes: {},
  args: {
    children: (
      <span>
        The future is NEAR{' '}
        <span role='img' aria-label='emoji'>
          😄
        </span>
      </span>
    ),
    onClick: () => {
      alert('Button click successful');
    }
  }
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = ({ children, ...args }) => {
  return (
    <Button {...args}>
      {children}
    </Button>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  theme: ButtonVariant.Primary
};

export const Secondary = Template.bind({});
Secondary.args = {
  theme: ButtonVariant.Secondary
};
