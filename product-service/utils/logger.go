package utils

import (
	"io"
	"log"
	"os"
	"path/filepath"

	"github.com/sirupsen/logrus"
)

var file *os.File

func createLogFolder() {
	newpath := filepath.Join(".", "logs")
	err := os.MkdirAll(newpath, os.ModePerm)
	if err != nil {
		log.Fatalf("Error creating logs folder: %v", err)
		panic(err)
	}
}

func createLogsFile() {
	log := logrus.New()
	log.Out = os.Stdout

	var err error
	file, err = os.OpenFile("logs/all.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err == nil {
		log.Out = file
	} else {
		log.Fatal("Failed to log to file, using default Stdout")
	}
}

func CloseLogsFile() {
	file.Close()
}

func CreatePrefix(prefix string) string {
	return "[" + prefix + "]: "
}

func Logger() *logrus.Logger {
	createLogFolder()
	createLogsFile()

	logger := &logrus.Logger{
		Out:   os.Stdout,
		Level: logrus.DebugLevel,
		Formatter: &logrus.JSONFormatter{
			TimestampFormat: "2006-01-02 15:04:05",
		},
	}

	logger.SetOutput(io.MultiWriter(file, os.Stdout))

	return logger
}
