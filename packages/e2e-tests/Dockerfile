FROM mcr.microsoft.com/playwright:bionic

RUN mkdir -p /packages/e2e-tests
RUN mkdir -p /packages/frontend
WORKDIR /packages

COPY e2e-tests e2e-tests/
COPY frontend frontend/

RUN cd frontend && yarn && yarn build
RUN cd e2e-tests && yarn

# CMD cd e2e-tests && yarn run e2e