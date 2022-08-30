sudo systemctl start docker 
docker-compose down 
docker rmi $(docker images)
docker system prune -y
docker-compose pull
docker-compose up -d
 
