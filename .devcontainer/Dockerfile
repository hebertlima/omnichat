ARG VARIANT=16-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}
RUN yarn global add @vue/cli /
	yarn add -D tailwindcss postcss autoprefixer
EXPOSE 8080