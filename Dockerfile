# this Dockerfile is based on
# https://betterprogramming.pub/how-to-create-an-angular-dockerfile-75c059e7f8e8
# there are also instructions there for including the angular build process
# itself in these Dockerfile instructions, maybe I'll add that later.
FROM nginx:alpine

COPY /dist/text-editor /usr/share/nginx/html

EXPOSE 80