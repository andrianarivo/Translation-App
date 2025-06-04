.PHONY: build-production
build: ## Build the production docker image.
	docker compose -f docker-compose.yml build

.PHONY: start-production
start: ## Start the production docker container.
	docker compose -f docker-compose.yml up -d

.PHONY: stop-production
stop: ## Stop the production docker container.
	docker compose -f docker-compose.yml down
