FROM node:11

RUN apt-get update
RUN apt-get install -y unzip xvfb libxi6 libgconf-2-4

RUN curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add
RUN echo "deb [arch=amd64]  http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
RUN apt-get -y update
RUN apt-get -y install google-chrome-stable


COPY package.json .
RUN npm i

COPY . .

ENV interos_port 3000

ENTRYPOINT node main.js