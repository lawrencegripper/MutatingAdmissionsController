build:
	npm install
	npm run build-server
	npm run test

docker:
	docker build --no-cache -t mutatingcontroller . 

docker-test:
	docker run --rm -d -p 3000:3000 mutatingcontroller
	sleep 10
	@echo '> Hitting health endpoint'
	curl --fail localhost:3000/healthz 
	@echo '> Cleaning up'
	docker ps | grep mutatingcontroller | awk '{print $$1}' | xargs docker kill

.PHONY: build