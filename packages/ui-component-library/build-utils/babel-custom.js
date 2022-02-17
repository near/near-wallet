import { createBabelInputPluginFactory } from '@rollup/plugin-babel';

export default createBabelInputPluginFactory(() => {
  return {
    // Passed the plugin options.
    options({ custom: customOptions, ...pluginOptions }) {
      return {
        // Pull out any custom options that the plugin might have.
        customOptions,

        // Pass the options back with the two custom options removed.
        pluginOptions
      };
    },

    config(config) {
      const babelOptions = {
        ...config.options,
        generatorOpts: {
          minified: true,
          compact: true,
          shouldPrintComment: comment => /[@#]__[A-Z]+__/.test(comment)
        }
      };
      return babelOptions;
    }
  };
});
