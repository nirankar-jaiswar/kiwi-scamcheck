build-FeedbackFunction:
	mkdir -p "$(ARTIFACTS_DIR)"
	cd ../.. && pnpm exec esbuild services/feedback-api/src/handler.ts \
		--bundle \
		--platform=node \
		--target=node22 \
		--format=cjs \
		--outfile="$(ARTIFACTS_DIR)/handler.cjs"