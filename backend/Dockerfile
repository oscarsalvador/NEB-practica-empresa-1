FROM node:16

WORKDIR /usr/src/app

# ENV PATH /usr/src/app/node_modules/.bin:$PATH

# añado las fuentes en el mismo paso para reducir las capas de la imagen
# COPY package.json ./ \
#   package-lock.json ./
COPY package*.json ./

RUN npm install 

COPY . .

# RUN npm build
RUN npm install
# RUN npm ci --only=production
# CMD ["serve", "-s", "build"]

# CMD ["npm", "start"]
CMD ["node", "src/index.js"]
# docker build -t fullstacpoc-back:latest .