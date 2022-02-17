# @near-wallet/ui-component-library
> The official component library for the NEAR Wallet

[![NPM](https://img.shields.io/npm/v/ui-component-library.svg)](https://www.npmjs.com/package/ui-component-library) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @near-wallet/ui-component-library
```

## Usage

```tsx
import React, { Component } from 'react'

import { Button } from '@near-wallet/ui-component-library'

class Example extends Component {
  render() {
    return <Button />
  }
}
```


## 🤔 Why

- This folder acts as an independent library, with its own dependencies and bundler. Code within `frontend` and other packages can reference components from this package by importing from it using the package name `@near-wallet/ui-component-library`.

- This is why you'll notice the following syntax in our frontend `package.json`:
```json
{
  "@near-wallet/ui-component-library": "*"
}
```

## 📁 Structure
When adding a new component, use the following file pattern
```
./components
|
├─ Badge
│  ├─ Badge.stories.tsx
│  ├─ Badge.test.tsx
│  ├─ Badge.tsx
│  ├─ index.ts

```
> Make sure to write stories and tests for every new component added

## 💭 Architecture
- The primary goal of this package is maximum compatability / reuse with other projects. Any third-party dependencies should be kept to an absolute minimum.

## 🥂 References
- [Microbundle](https://github.com/developit/microbundle)
- [Create React Library](https://github.com/transitive-bullshit/create-react-library)