FROM node:16

WORKDIR /usr/src

# ENV PATH /app/node_modules/.bin:$PATH 1
 
# añado las fuentes en el mismo paso para reducir las capas de la imagen

RUN pwd 
RUN ls -lah

COPY package.json tsconfig.json ./ 
COPY src ./src
COPY public ./public
# COPY miimg.png .

# COPY package.json ./ \ 1
#   package-lock.json ./ 1

RUN npm install

RUN npm install react-scripts

RUN ls -lah

RUN npm install -g serve

EXPOSE 3000
EXPOSE 80

# ENV REACT_APP_API_URL=http://20.61.129.14:4000/
# ENV REACT_APP_CORS_ORIGIN_TO_ALLOW=http://20.61.129.14:4000/

RUN npm run build

# CMD ["serve", "-d", "-s", "build"] 
CMD ["sh", "-c", "npm run build && serve -d -s build"] 
# CMD ["cd", "/usr/src", "&&", "npm", "install", "&&", "npm", "run", "build", "&&", "npm", "install", "-g", "serve", "&&", "serve", "-d", "-s", "build"]