# DNA server

## Development
Prerequisites:
* node v18.8.0
* yarn v1.22.19
* docker v20.10.17

Run postgres container with this command:
```
docker run -d --name enpicom-db --env POSTGRES_DB=enpicom --env POSTGRES_PASSWORD=password -p "5432:5432" postgres:14.5-alpine
```

Create `.env` file and copy content from `.env.example`.

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

|Name              |Description                           |
|------------------|--------------------------------------|
|PORT              |Port that application will listen on. |
|CONNECTION_STRING |Database connection string.           |

## Assumptions
1. DNA sequence is not longer 255 characters(this assumption allows to use postgreses `levenshtein` function).
If assumptions are not correct please contact me.
