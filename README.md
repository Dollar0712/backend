# Prerequisites

1. Docker is required. It is recommended to install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Make sure the following ports are not occupied on your machine:
   - `8000` for backend API service
   - `5432` for PostgreSQL database
   - `5050` for database GUI (e.g., pgAdmin)

# Getting Started

In the `backend` directory, run:

```sh
docker-compose up -d
```

This will start the backend services (API, database, and GUI) in detached mode.

## Seeding Demo Data

To generate demo (simulated) temperature data, run the following command inside the backend container:

```sh
npm run seed-data
```

This will execute the seeding script and populate the database with demo data.