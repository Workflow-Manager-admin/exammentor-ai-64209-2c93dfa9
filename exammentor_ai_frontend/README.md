# MapMyPrep-64209-2c93dfa9

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with MapMyPrep brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify
- **! NEW:** Account & API Integrations screen (Settings)
  - Users can manage/connect API keys for OpenAI and more (future)
  - Test connection and enable/disable advanced features (Q&A Helper, Goal Breakdown, and more)
  - All API keys are stored securely in-browser (never uploaded)

## Privacy/Security

- All API credentials are **never** sent to any external server, and are stored securely in the user’s browser localStorage.
- Connections to third-party APIs (e.g., OpenAI GPT-4) are performed directly from user’s browser only if user has enabled and supplied an API key.
- This architecture is future-proof for additional third-party APIs; see `AccountSettingsSection.js` and `integrationHelpers.js` for extensibility/documentation.

## Important Note: Babel Configuration

This project’s `package.json` includes a `babel` section with a plugin:

```json
"babel": {
"plugins": ["./.ve/babel-plugin-jsx-editor-id.js"]
}
```

This plugin enables **visual editing functionality** in supported tools.

**Warning for AI code agents and contributors:**
**DO NOT** remove or modify this section - it is ESSENTIAL for proper operation.
Removing it will break editor integration and visual editing features.

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors for MapMyPrep are defined as CSS variables in `src/App.css` and use a vibrant, colorful palette:

```css
:root {
  --base-light: #00B8D9;
  --base-dark: #FF7A59;
  --secondary: #FFD600;
  --kavia-violet: #A259FF;
  --mp-background: linear-gradient(135deg, #B2FEFA 0%, #E0C3FC 100%);
  --text-color: #232943;
  --text-secondary: #565994;
  --border-color: rgba(45, 35, 140, 0.08);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

>>>>>>> REPLACE
