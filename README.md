<p align="center" style="font-size: 30px;">@snackstack/mui</p>
<p align="center">A Material UI adapter for <a href="https://github.com/snackstack/core" alt="Link to @snackstack/core">@snackstack/core</a></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@snackstack/mui" alt="npm.js package link">
    <img src="https://img.shields.io/npm/v/@snackstack/mui?color=F50057" alt="Latest version published to npm.js" />
    <img src="https://img.shields.io/npm/dm/@snackstack/mui?color=1976D2" alt="npm downloads per month" />
    <img src="https://img.shields.io/npm/l/@snackstack/mui?color=00C853" alt="Project license" />
  </a>
</p>

## Installation

To install `@mui/material`, follow their [installation guide](https://mui.com/material-ui/getting-started/installation/).

> ⚠️ Note: Only `@mui/material` v5 or later is supported.

To install the latest stable version with [npm](https://www.npmjs.com/get-npm), run the following command:

```
npm install @snackstack/core @snackstack/mui
```

Or if you're using [yarn](https://classic.yarnpkg.com/docs/install/):

```
yarn add @snackstack/core @snackstack/mui
```

## Setup

Make sure you have setup the `SnackProvider` component as shown in the [Get started](https://snackstack.github.io/docs#setup) section of the documentation.

Now you just need to render the `MuiSnackbars` component below the `SnackProvider` component.

```diff
import React from "react";
import ReactDOM from "react-dom/client";
import { SnackProvider, SnackManager } from "@snackstack/core";
+ import { MuiSnackbars } from "@snackstack/mui";

const snackManager = new SnackManager({ maxSnacks: 7 });

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <SnackProvider manager={snackManager}>
      <App />

+     <MuiSnackbars />
    </SnackProvider>
  </React.StrictMode>
);
```

[Learn more about the Material UI adapter](https://snackstack.github.io/docs/adapters/mui)
