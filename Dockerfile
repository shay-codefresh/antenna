FROM codefresh/buildpacks:all-5

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --silent
COPY ./node/cellphones /usr/src/app
