/** PostCSS config: PurgeCSS in production to remove unused CSS from globals.css */
const isProd = process.env.NODE_ENV === 'production';

export default {
  plugins: isProd
    ? [
        [
          '@fullhuman/postcss-purgecss',
          {
            content: [
              './app/**/*.{js,jsx,ts,tsx}',
              './src/**/*.{js,jsx,ts,tsx}',
            ],
            defaultExtractor: (content) =>
              content.match(/[\w-/:()]+(?<!:)/g) || [],
            safelist: {
              standard: ['html', 'body', ':root'],
              deep: [/^dm_sans_/, /^__next/],
              greedy: [/^:root/, /^\[/],
            },
          },
        ],
      ]
    : [],
};
