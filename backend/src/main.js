// socket.io
import { io } from 'socket.io-client'

const URL = 'http://localhost:3333'

const socket = io(URL, {
	autoConnect: false
})

socket.auth = {
	name: 'External Site',
	number: 12345678912
}

socket.connect()

socket.on('connected', message => console.log(message))

// configuração

// criação do template

// funcionalidadades

