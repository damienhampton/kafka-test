# Kafka test

Uses docker compose to spin up kafka, zookeeper, mongo, an API server (nodejs), an backoffice server (nodejs) and a frontend (react).

# Run
`docker compose up`

Open: `http://localhost:3000`

# Develop

Run kafka, zookeeper and mongo in docker and then just run the individual apps.

`docker compose -f docker-compose-dev/yaml up`

```
cd puchase-api
yarn
yarn start
```

```
cd puchase-automation
yarn
yarn start
```

```
cd frontend
npm i
npm start
```