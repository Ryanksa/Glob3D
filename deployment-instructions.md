## Deployment Instructions
1. Install docker: https://docs.docker.com/get-docker/
2. Change the jwt secret in ./server/config.js to a randomly generated string. Here's a command to generate a random 128-characters string:
    ```
    cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 128 | head -n 1
    ```
3. Update environment variable REACT_APP_WS_URL in ./client/.env to 
    ```
    ws://domain.name/websocket
    ```
4. Run these following commands to build the docker images:
    ```
    docker build -t glob3d-client ./client/
    docker build -t glob3d-server ./server/
    ```
5. Update all domain.name placeholders in ./nginx/app.conf with the registered domain name(s)
6. Update all domain.name and example@mail.com placeholders in ./docker-compose.yml with the registered doamin name(s) and email.
7. To start the app:
    ```
    docker-compose up -d
    ```
    To stop the app:
    ```
    docker-compose down
    ```
8. An issue where /world does not load properly seems to occur when the docker containers run for 1-3 days.
    Update ./restart-containers.sh with the correct path to project root. Also, set execute permission:
    ```
    chmod +x ./restart-containers.sh
    ```
    Set up a cronjob to restart the containers every hour.
    ```
    0 * * * * /path/to/project/root/restart-containers.sh > /path/to/project/root/cronjob-restart.log 2>&1
    ```