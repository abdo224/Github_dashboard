sudo systemctl start docker 
docker-compose down 
docker rmi $(docker images)
docker system prune -y
docker-compose pull
docker-compose start db 
slepp 30
docker-compose up -d 
