# DNA server

## Prerequisites

## Development
Prerequisites:
* node v18.8.0
* yarn v1.22.19
* docker v20.10.17

To run server in development mode:
```
yarn start
```

To build server:
```
yarn build
```

## Testing
Run all tests:
```
yarn test
```

Unit tests:
```
yarn test:unit
```

Functional/integration tests:
```
yarn test:func
```

## Env variables

|Variable          |Information                           |
|------------------|--------------------------------------|
|PORT              |Port that application will listen on. |
|CONNECTION_STRING |Database connection string.           |
