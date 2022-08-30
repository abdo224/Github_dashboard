sudo systemctl start docker 
docker-compose down 
docker rmi $(docker images)
docker system prune -y
docker pull mysql
docker pull djawed22/repo:latest
docker-compose start db 
sleep 30
docker-compose up -d 
