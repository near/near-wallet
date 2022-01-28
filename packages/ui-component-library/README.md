# @near/ui-component-library
> The official component library for the NEAR Wallet

[![NPM](https://img.shields.io/npm/v/ui-component-library.svg)](https://www.npmjs.com/package/ui-component-library) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @near/ui-component-library
```

## Usage

```tsx
import React, { Component } from 'react'

import { Button } from '@near/ui-component-library'
import '@near/ui-component-library/dist/index.css'

class Example extends Component {
  render() {
    return <Button />
  }
}
```


## 🤔 Why

- This folder acts as an indepdent library with its own dependencies and bundler. Code within `frontend` and other packages can reference it as a relative folder, but it can also be published as an NPM package for other repositories.

- This is why you'll notice the following syntax in our frontend `package.json`:
```json
{
  "@near/ui-component-library": "*"
}
```

## 📁 Structure
When adding a new component, use the following file pattern
```
./components
|
├─ Badge
│  ├─ Badge.module.scss
│  ├─ Badge.stories.tsx
│  ├─ Badge.tsx
│  ├─ index.ts

```

## 💭 Architecture
- The primary goal of this package is maximum compatability / reuse with other projects. Any imports and dependencies should be kept to an absolute minimum.

## 🥂 References
- [Microbundle](https://github.com/developit/microbundle)
- [Create React Library](https://github.com/transitive-bullshit/create-react-library)

