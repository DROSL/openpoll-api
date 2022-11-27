docker build -t osop-api .

docker run -p 8081:4000 --name osop-api --network osop-network osop-api


docker build -t osop-frontend .

docker run -p 8080:80 --name osop-frontend --network osop-network osop-frontend