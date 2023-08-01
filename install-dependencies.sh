#!/bin/bash

# Node dependencies
cd user-service
npm i

# Go dependencies
cd ../product-service
go mod download