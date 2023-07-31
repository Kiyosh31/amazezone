dev:
	skaffold dev

setup-linux:
	chmod +x setup-linux.sh
	./setup-linux.sh

config-linux:
	minikube start
	eval $(minikube docker-env)
	minikube addons enable ingress
	minikube addons enable ingress-dns
	sudo chmod 666 /var/run/docker.sock

delete-minikube:
	minikube delete
	minikube delete --all

delete-images:
	skaffold delete
	kubectl delete service --all
	kubectl delete pod --all
	kubectl delete deployment --all
	docker system prune --all --force

dependencies:
	chmod +x install-dependencies.sh
	./install-dependencies.sh