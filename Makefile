build:
	sudo docker build -t tgbot .

run:
	sudo docker run -d -p 3000:3000 --name tgbot --rm tgbot
	sudo docker run -d -p 3000:3000 tgbot
