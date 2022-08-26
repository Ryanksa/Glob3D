## Deployment Instructions

### Preliminary Steps

1. Rent out a server: https://www.digitalocean.com, https://www.vultr.com, etc
2. Register a domain: https://www.namecheap.com, https://www.freenom.com, etc

### Deploy Steps

1. Install docker: https://docs.docker.com/engine/install/
2. Clone repo from github:
   ```
   git clone https://github.com/Ryanksa/Glob3D.git
   ```
3. Change the jwt secret in ./server/config.js to a randomly generated string. Here's a command to generate a random 128-characters string:
   ```
   cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 128 | head -n 1
   ```
4. Update environment variable REACT_APP_WS_URL in ./client/.env to
   ```
   wss://domain.name/websocket
   ```
5. Run these following commands to build the docker images:
   ```
   docker build -t glob3d-client ./client/
   docker build -t glob3d-server ./server/
   ```
   To see the all images:
   ```
   docker images
   ```
6. Update all domain.name placeholders in ./nginx/app.conf with the registered domain name(s).
7. Update all domain.name and example@mail.com placeholders in ./docker-compose.yml with the registered doamin name(s) and email.
8. To start the app:
   ```
   docker-compose up -d
   ```
   To stop the app:
   ```
   docker-compose down
   ```
   To see all containers:
   ```
   docker container ls --all
   ```
9. Setup firewall to only allow incoming ports 22, 80, 443
   ```
   ufw default deny incoming
   ufw default allow outgoing
   ufw allow 22
   ufw allow 80
   ufw allow 443
   ufw enable
   ```
   To check firewall status:
   ```
   ufw status
   ```
10. An issue where /world does not load properly seems to occur when the docker containers run for 1-3 days.
    Update ./restart-containers.sh with the correct path to project root. Also, set execute permission:

    ```
    chmod +x ./restart-containers.sh
    ```

    Set up a cronjob to restart the containers every hour.

    ```
    0 * * * * /path/to/project/root/restart-containers.sh > /path/to/project/root/cronjob-restart.log 2>&1
    ```
