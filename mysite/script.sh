sudo systemctl start docker 
docker-compose down 
docker rmi $(docker images)
docker system prune
docker-compose pull 
docker-compose up -d 
docker-compose restart app
 