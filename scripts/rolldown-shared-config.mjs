import { minify } from "rollup-plugin-swc3";

/**
 * Get rolldown config options based on environment variables.
 * 
 * Environment variables:
 * - ROLLDOWN_MINIFIER: 'oxc' | 'swc' - Which minifier to use
 * - ROLLDOWN_STRICT_EXECUTION_ORDER: 'true' - Enable strict execution order
 * - ROLLDOWN_ONDEMAND_WRAPPING: 'true' - Enable on-demand wrapping
 * 
 * Build variants:
 * 1. oxc: output.minify: true (oxc minifier)
 * 2. swc: swc plugin (swc minifier)
 * 3. strictExecutionOrder: strictExecutionOrder: true + output.minify: true (oxc minifier)
 * 4. ondemandWrapping: strictExecutionOrder: true + onDemandWrapping: true + output.minify: true (oxc minifier)
 */
export function getSharedRolldownConfig() {
  const minifier = process.env.ROLLDOWN_MINIFIER || 'swc';
  const strictExecutionOrder = process.env.ROLLDOWN_STRICT_EXECUTION_ORDER === 'true';
  const onDemandWrapping = process.env.ROLLDOWN_ONDEMAND_WRAPPING === 'true';

  // Determine output directory based on variant
  let outputDir = 'rolldown-dist';
  if (minifier === 'oxc' && !strictExecutionOrder && !onDemandWrapping) {
    outputDir = 'rolldown-oxc-dist';
  } else if (minifier === 'swc') {
    outputDir = 'rolldown-swc-dist';
  } else if (strictExecutionOrder && onDemandWrapping) {
    outputDir = 'rolldown-ondemandWrapping-dist';
  } else if (strictExecutionOrder) {
    outputDir = 'rolldown-strictExecutionOrder-dist';
  }

  const config = {
    outputDir,
    output: {
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
    config.experimental.strictExecutionOrder = true;
  }

  if (onDemandWrapping) {
    config.experimental.onDemandWrapping = true;
  }

  return config;
}
