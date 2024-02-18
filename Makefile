run:
	@docker compose up -d
dev:
	@docker compose down -v && docker compose up --build
test:
	./executar-teste-local.sh