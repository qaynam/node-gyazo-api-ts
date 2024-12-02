import { defineConfig} from 'tsup'

export default defineConfig({
  minify: true,
  clean: true,
  entry: [ "src/index.ts" ]
})
