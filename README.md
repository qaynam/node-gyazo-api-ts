# Gyazo-API

[Gyazo API](https://gyazo.com/api/docs) wrapper for Node.js

- https://github.com/qaynam/node-gyazo-api-ts
- https://www.npmjs.org/package/gyazo-api-ts

[![Circle CI](https://circleci.com/gh/shokai/node-gyazo-api.svg?style=svg)](https://circleci.com/gh/shokai/node-gyazo-api)

## Usage

Register new application and get [ACCESS TOKEN](https://gyazo.com/oauth/applications), then

### Upload Image 

```ts
import fs from 'node:fs';
import { Gyazo } from 'gyazo-api-ts';

const gyazo = new Gyazo('your-access-token');
const imageBuffer = fs.readFileSync('path/to/image.png');
const { success, error} = await gyazo.upload(imageBuffer, {
  filename: 'image.png',
  contentType: 'image/png',
  /** ...ohter options */
});

if(error) {
  console.error(error);
} else {
  console.log(success);
}
```

