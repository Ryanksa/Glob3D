## Deployment Instructions
1. Install docker: https://docs.docker.com/get-docker/
2. Change the jwt secret in ./server/config.js to a randomly generated string. Here's a command to generate a random 128-characters string:
    ```
    cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 128 | head -n 1
    ```
3. Change all instances of domain.name in data/nginx/app.conf to a registered domain name
4. Update email and domain.name in init-letsencrypt.sh
5. Run these following commands to build the docker images:
    ```
    docker build -t glob3d-client ./client/
    docker build -t glob3d-server ./server/
    ```
6. Run init-letsencrypt.sh to set up SSL certificates:
    ```
    chmod +x init-letsencrypt.sh
    sudo ./init-letsencrypt.sh
    ```
7. To start the app:
    ```
    docker-compose up -d
    ```
    To stop the app:
    ```
    docker-compose down
    ```