const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs', 'mjs');
// Bundle .wasm (WebAssembly) and .task (MediaPipe model) files as assets
if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}
if (!config.resolver.assetExts.includes('task')) {
  config.resolver.assetExts.push('task');
}

module.exports = config;

