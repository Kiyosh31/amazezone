# Introduction

This project is to migreate the original amazeone-app from `docker-compose` to `kubernetes` to have an actual taste of real life microservices architecture

This project was made entirely on ubuntu which could make not work in other platforms without modification

# Pre-requisites

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. [Node v18.16.1](https://nodejs.org/en/blog/release/v18.16.1)

- I recommend using [FNM](https://github.com/Schniz/fnm) this is a node version manager very useful and wasy to install

3. [Go v1.18.1](https://tip.golang.org/doc/go1.18)

# Instructions

0. Start docker desktop
1. Download and install minikube with other necessary tools

   ```console
   make setup-linux
   ```

2. Setup minikube and enable all necessary tools to communicate

   ```console
   make config-linux
   ```

3. Install dependencies

   ```console
   make dependencies
   ```

4. Run te project

   ```console
   make dev
   ```

5. Open a new terminal and run

   ```console
   minikube tunnel
   ```

> Important! since minikube don't have a way to create a tunnel in background the last command must keep up and running in order to develop correctly otherwise you will not be able to access kubernetes cluster

# Usage

This project counts with hot reload thanks to `skaffold` every time you make a change you will need to wait until the new build is complete and deployed before testing
