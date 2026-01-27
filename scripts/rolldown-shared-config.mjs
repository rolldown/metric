import { minify } from "rollup-plugin-swc3";

/**
 * Get rolldown config options based on environment variables.
 * 
 * Environment variables:
 * - ROLLDOWN_MINIFIER: 'oxc' | 'swc' - Which minifier to use (required)
 * - ROLLDOWN_STRICT_EXECUTION_ORDER: 'true' - Enable strict execution order
 * - ROLLDOWN_ONDEMAND_WRAPPING: 'true' - Enable on-demand wrapping
 * 
 * Build variants:
 * 1. oxc: output.minify: true (oxc minifier) → rolldown-dist
 * 2. swc: swc plugin (swc minifier) → rolldown-swc-dist
 * 3. strictExecutionOrder: output.strictExecutionOrder: true + output.minify: true (oxc minifier) → rolldown-strictExecutionOrder-dist
 * 4. onDemandWrapping: output.strictExecutionOrder: true + onDemandWrapping: true + output.minify: true (oxc minifier) → rolldown-onDemandWrapping-dist
 */
export function getSharedRolldownConfig() {
  const minifier = process.env.ROLLDOWN_MINIFIER;
  const strictExecutionOrder = process.env.ROLLDOWN_STRICT_EXECUTION_ORDER === 'true';
  const onDemandWrapping = process.env.ROLLDOWN_ONDEMAND_WRAPPING === 'true';

  if (!minifier) {
    throw new Error('ROLLDOWN_MINIFIER environment variable is required (oxc or swc)');
  }

  // Determine output directory based on variant
  let outputDir;
  if (strictExecutionOrder && onDemandWrapping) {
    outputDir = 'rolldown-onDemandWrapping-dist';
  } else if (strictExecutionOrder) {
    outputDir = 'rolldown-strictExecutionOrder-dist';
  } else if (minifier === 'swc') {
    outputDir = 'rolldown-swc-dist';
  } else {
    outputDir = 'rolldown-dist';
  }

  const config = {
    output: {
      dir: outputDir,
      minify: minifier === 'oxc',
    },
    plugins: [],
    experimental: {},
  };

  // Add swc minifier plugin if using swc
  if (minifier === 'swc') {
    config.plugins.push(
      minify({
        module: true,
        mangle: {
          toplevel: true,
        },
        compress: {},
      })
    );
  }

  // Add experimental options
  if (strictExecutionOrder) {
    config.output.strictExecutionOrder = true;
  }

  if (onDemandWrapping) {
    config.experimental.onDemandWrapping = true;
  }

  return config;
}
