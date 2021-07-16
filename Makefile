GITFLAGS ?= GIT_DIR=${SRCDIR}/.git GIT_WORK_TREE=${SRCDIR}
ifeq ($(NOGIT),1)
  GIT_SUMMARY ?= Unknown
  GIT_BRANCH ?= Unknown
  GIT_MERGE ?= Unknown
else
  GIT_SUMMARY ?= $(shell ${GITFLAGS} git describe --tags --dirty --always)
  GIT_BRANCH ?= $(shell ${GITFLAGS} git symbolic-ref -q --short HEAD)
  GIT_MERGE ?= $(shell ${GITFLAGS} git rev-list --count --merges main)
endif

LDFLAGS += -X main.GitBranch=${GIT_BRANCH} -X main.GitSummary=${GIT_SUMMARY} -X main.GitMerge=${GIT_MERGE}

default: help 

## e2e-up: up env for tests
.PHONY: e2e-up
e2e-up: 
	@docker compose -f \
			./deployments/docker/e2e/docker-compose.yml up \
			--build --force-recreate --abort-on-container-exit \
			--exit-code-from main \

## e2e-down: down e2e env
.PHONY: e2e-down
e2e-down: 
	@docker compose -f \
			./deployments/docker/e2e/docker-compose.yml down \
			--rmi local \

## e2e: e2e tests
.PHONY: e2e
e2e: e2e-up e2e-down

## unittest-up: up env for unit tests
.PHONY: unittest-up
unittest-up: 
	@docker compose \
			-f ./deployments/docker/test/docker-compose.yml up \
			--build --force-recreate --abort-on-container-exit \
			--exit-code-from main \

## unittest-down: down unit tests
.PHONY: unittest-down
unittest-down: 
	@docker compose \
			-f ./deployments/docker/test/docker-compose.yml down \
			--rmi local \

## e2e: unit tests tests
.PHONY: unittest
unittest: unittest-up unittest-down

## e2e: unit tests tests
.PHONY: build-docker
build-docker:
	@docker build -f ./deployments/docker/Dockerfile -t bookstore .
	

## help: show this help
.PHONY: help
help: Makefile
	@echo
	@echo " Choose a command run:"
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo
