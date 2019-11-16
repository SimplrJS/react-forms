import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.ts[x]
configure(require.context('../src/__stories__', true, /\.stories\.tsx?$/), module);
