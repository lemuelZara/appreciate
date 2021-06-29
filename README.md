<h1 align="center">
  <img src="./.github/appreciation.png" width="150" />
</h1>

<p align="center">
  <img alt="Node.js Logo" src="https://img.shields.io/badge/Node.js-latest-00a0c8?logo=node.js&labelColor=fff">&nbsp;&nbsp;
  <img alt="TypeScript Logo" src="https://img.shields.io/badge/TypeScript-latest-c80a50?logo=typescript&labelColor=fff">&nbsp;&nbsp;
  <img alt="Express Logo" src="https://img.shields.io/badge/Express-v4.17.1-00a0c8?logo=express&labelColor=fff&logoColor=000">&nbsp;&nbsp;
  <img alt="Prisma Logo" src="https://img.shields.io/badge/Prisma-v2.25.0-c80a50?logo=prisma&labelColor=fff&logoColor=000">&nbsp;&nbsp;
  <img alt="Docker Logo" src="https://img.shields.io/badge/Docker & Docker Compose-latest-00a0c8?logo=docker&labelColor=fff">
  &nbsp;&nbsp;
  <img alt="Coverage Report" src="https://coveralls.io/repos/github/lemuelZara/appreciate/badge.svg?branch=main">&nbsp;&nbsp;

<p align="center">Appreciating people for the good things they do.</p>

<br>

<p align="center">
  <a href="#open_book-about">About</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#construction_worker-installation">Installation</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#runner-getting-started">Getting Started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#closed_book-license">License</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
</p>

<br>

## :open_book: About

Development of a Node.js REST API to praise people through tags.

<br>

## :construction_worker: Installation

You need to install **[Node.js](https://nodejs.org/en/)** and **[Yarn](https://yarnpkg.com/)** first, then in order to clone the project via HTTPS, run this command:
```bash
git clone https://github.com/lemuelZara/appreciate.git
```

If you use a SSH key registered in your GitHub account, clone this repository following command:
```bash
git clone git@github.com:lemuelZara/appreciate.git
```

<br>

### Install dependencies

```bash
yarn install

# or

npm install
```

After installation, create your enviroment variables to use in this project (based on the example of `.env.example`):
```bash
cp .env.example .env
```

<br>

### Setup a database

The PostgreSQL database is being used in this project. If you have **[Docker](https://www.docker.com/)** installed on your machine, fill the environment values related to database configurations and then run the following commands in order to create a PostgreSQL container:

```bash
docker-compose up -d
```

<br>

## :runner: Getting Started

Run the command in order to configure the database schema:
```bash
yarn prisma migrate dev
```

Run the following command in order to start the application:
```bash
yarn start:dev
```

## Tests

This project are coverage by tests. If you make any changes to the code, run the commands to check if your code is passing:
```bash
yarn test

# or

yarn test:watch

# Coverage Report
yarn test:cov
```

<br>

## :closed_book: License

Released in 2021. This project is under the [MIT License](./LICENSE).

<br>

Made with love by [Lemuel](https://linkedin.com/in/lemuelZara) 💜🚀
