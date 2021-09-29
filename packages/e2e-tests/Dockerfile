FROM mcr.microsoft.com/playwright:bionic

RUN mkdir -p /packages/e2e-tests
RUN mkdir -p /packages/frontend
WORKDIR /packages

COPY e2e-tests e2e-tests/
COPY frontend frontend/

# CMD cd e2e-tests && yarn && yarn run e2e