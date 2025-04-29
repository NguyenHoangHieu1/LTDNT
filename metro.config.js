// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

// Thêm hỗ trợ cho file .svg
config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'), // Sử dụng transformer cho .svg
};

config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'), // Loại svg khỏi assetExts
    sourceExts: [...config.resolver.sourceExts, 'svg'], // Thêm svg vào sourceExts
};

module.exports = withNativeWind(config, { input: './global.css' });