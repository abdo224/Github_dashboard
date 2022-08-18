sudo systemctl start docker 
docker-compose down 
docker rmi $(docker images)
docker system prune
docker-compose pull -y
docker-compose up -d 
docker-compose restart app
