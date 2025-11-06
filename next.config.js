/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Enable image optimization
    formats: ['image/avif', 'image/webp'],
    // Optimize images automatically
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Optimize for SSG/ISR by default
  // Pages are static by default in App Router
  // Use ISR when needed: export const revalidate = 3600 in page files
  // Force SSR only when needed: export const dynamic = 'force-dynamic'
  // Note: LESS support is configured but disabled due to Next.js loader conflicts
  // To enable LESS, uncomment the webpack config below and convert .css files to .less
  /*
  webpack: (config) => {
    const oneOfRule = config.module.rules.find((rule) => rule.oneOf);
    
    if (oneOfRule && Array.isArray(oneOfRule.oneOf)) {
      const lessRuleExists = oneOfRule.oneOf.some((rule) => {
        const testStr = rule.test?.toString() || '';
        return testStr.includes('less');
      });
      
      if (!lessRuleExists) {
        const cssModuleRule = oneOfRule.oneOf.find((rule) => {
          const testStr = rule.test?.toString() || '';
          return testStr.includes('module') && testStr.includes('css') && !testStr.includes('less');
        });
        
        if (cssModuleRule && Array.isArray(cssModuleRule.use)) {
          const lessLoaders = [];
          
          cssModuleRule.use.forEach((loader) => {
            if (typeof loader === 'object' && loader.loader) {
              const loaderPath = String(loader.loader);
              if (loaderPath.includes('css-loader')) {
                lessLoaders.push({
                  loader: require.resolve('less-loader'),
                  options: {
                    lessOptions: {
                      javascriptEnabled: true,
                    },
                  },
                });
                lessLoaders.push(loader);
              } else {
                lessLoaders.push(loader);
              }
            } else {
              lessLoaders.push(loader);
            }
          });
          
          const lessModuleRule = {
            test: /\.module\.less$/,
            use: lessLoaders,
          };
          
          const cssModuleIndex = oneOfRule.oneOf.indexOf(cssModuleRule);
          if (cssModuleIndex !== -1) {
            oneOfRule.oneOf.splice(cssModuleIndex, 0, lessModuleRule);
          }
        }
      }
    }

    return config;
  },
  */
}

module.exports = nextConfig
