package utils

import "os"

func GetEnvVar(envVar string) string {
	var log = Logger()

	value := os.Getenv(envVar)
	if value == "" {
		log.Fatal("You must provide " + envVar + " in env variables")
	}

	return value
}
