
## Software Requirements

-   Node.js **8+**
-   MongoDB **3.6+** (Recommended **4+**)

## How to install

```bash
cd myproject
npm install
```

Change the values of the file to your environment
```bash
cp .env.example .env
 ```

## Start Database

```
# start
docker run --name crypto-mongo -p 27017:27017 -d mongo:4.0

# stop and remove
stop crypto-mongo; docker container rm crypto-mongo

```

## How to run

```bash
npm run dev
```

**Note:**  `YOUR_DB_CONNECTION_STRING` will be your MongoDB connection string.

## Tests

```bash
npm test
```

## ESLint

```bash
npm run lint
```
You can set custom rules for eslint in `.eslintrc.json` file, Added at project root.

## POSTman

https://www.getpostman.com/collections/e3da35d0306821df44a9