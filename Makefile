.PHONY: dev build test lint docker-build docker-push

IMAGE ?= world-clock

dev:
	npm run dev

build:
	npm run build

test:
	npm test

lint:
	npm run lint

docker-build:
	docker build -t $(IMAGE) .

docker-push:
	docker push $(IMAGE)
