# Gyazo-API-TS

[Gyazo API](https://gyazo.com/api/docs) wrapper for Node.js written in TypeScript.

- https://github.com/qaynam/node-gyazo-api-ts
- https://www.npmjs.org/package/gyazo-api-ts


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

### Get Image

```ts
import { Gyazo } from 'gyazo-api-ts';

const gyazo = new Gyazo('your-access-token');
const { success, error} = await gyazo.get('image-id');

if(error) {
  console.error(error);
} else {
  console.log(success);
}
```

### Delete Image

```ts
import { Gyazo } from 'gyazo-api-ts';

const gyazo = new Gyazo('your-access-token');
const { success, error} = await gyazo.delete('image-id');

if(error) {
  console.error(error);
} else {
  console.log(success);
}
```


### List Images

```ts
import { Gyazo } from 'gyazo-api-ts';

const gyazo = new Gyazo('your-access-token');
const { success, error} = await gyazo.list();

if(error) {
  console.error(error);
} else {
  console.log(success);
}
```

