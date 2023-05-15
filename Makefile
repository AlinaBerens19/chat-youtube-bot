build:
	sudo docker build -t tgbot .
	sudo docker build -t bot .

run:
	sudo docker run -d -p 3000:3000 --name bot --rm bot
	sudo docker run -d -p 3000:3000 --name bot bot
	sudo docker run -d -p 3000:3000 tgbot
