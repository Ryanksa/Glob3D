## Deployment Instructions
1. Install docker: https://docs.docker.com/get-docker/
2. Change the jwt secret in ./server/config.js to a randomly generated string. Here's a command to generate a random 128-characters string:
    ```
    cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 128 | head -n 1
    ```
3. Run these following commands to build the docker images:
    ```
    docker build -t glob3d-client ./client/
    docker build -t glob3d-server ./server/
    ```
4. Update all domain.name placeholders in ./nginx/app.conf with the registered domain name(s)
5. Update all domain.name and example@mail.com placeholders in ./docker-compose.yml with the registered doamin name(s) and email.
6. To start the app:
    ```
    docker-compose up -d
    ```
    To stop the app:
    ```
    docker-compose down
    ```