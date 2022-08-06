const express = require('express')
const cors = require('cors')

const app = express()
const server = require('http').Server(app)

const routes = express.Router()

routes.get('/', (request, response) => {
	return response.json({api: 'Express runing'})
})

const io = require('socket.io')(server, {
	cors: { origin: '*' }
})

app.use(cors())

const currentsUsers = {}

io.on('connection', socket => {
	const currentUsername = socket.handshake.auth.name

	socket.emit('connected', `Welcome to user ${currentUsername}`)

	socket.on('disconnect', () => {
		delete currentsUsers[socket.handshake.auth.number]
		console.log(`${currentUsername} discoonected`)
	})

	socket.on('PRIVATE_MESSAGE', ({content, to}) => {
		const toUser = socket.currentsUsers[to]
		if( toUser ) 
			socket.to(toUser.id).emit('PRIVATE_MESSAGE', content, currentUsername)
	})
})

io.use((socket, next) => {
	const { name } = socket.handshake.auth

	if(!name) return next(new Error('invalid name'))

	if(!currentsUsers[socket.handshake.auth.number])
		currentsUsers[socket.handshake.auth.number] = { name, id: socket.id }

	socket.currentsUsers = currentsUsers
	next()
})

app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.use(routes)
server.listen(3333)