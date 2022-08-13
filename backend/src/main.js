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

const omnichat = async (source, token, config) => {
	const addStyle = async () => {
		var css = document.getElementsByName('link')[0];
		if( document.getElementById('omnichat-css') ) { return; }
		css = document.createElement('link')
		css.id = 'omnichat-css';
		css.href = '//localhost:3333/omnichat.css'
		css.rel = 'stylesheet';
		css.type = 'text/css';
		document.head.appendChild(css);
	}

	const createContainer = async () => {
		const container = document.createElement('div')
		container.id = 'omnichat-container'
		document.body.appendChild(container)
		console.log('createContainer')
	}

	const createChatHeader = async (picture = '#') => {
		const header = document.createElement('div')
		header.id = 'omnichat-header'

		const div = document.createElement('div')
		div.id = 'omnichat-header-group'

		const img = document.createElement('img')
		img.src = picture
		img.alt = 'omnichat'

		const status = document.createElement('div')
		div.appendChild(img)
		div.appendChild(status)

		header.appendChild(div)

		const title = document.createElement('div')
		title.id = 'omnichat-header-title'
		title.innerText = 'OmniChat'

		header.appendChild(title)
		document.getElementById('omnichat-container').appendChild(header)
		console.log('createChatHeader')
	}

	const creatChatForm = async () => {
		const form = document.createElement('form')
		form.id = 'omnichat-form'

		const group = document.createElement('div')
		group.id = 'omnichat-form-group'

		const inputName = document.createElement('input')
		inputName.type = 'text'
		inputName.placeholder = 'Name'

		const inputNumber = document.createElement('input')
		inputNumber.type = 'text'
		inputNumber.placeholder = 'Name'

		const button = document.createElement('button')
		button.type = 'submit'
		button.innerText = 'Enviar'

		group.appendChild(inputName)
		group.appendChild(inputNumber)
		group.appendChild(button)

		form.appendChild(group)

		document.getElementById('omnichat-container').appendChild(form)
	}

	const createChat = async () => {
		const chatContainerMessages = document.createElement('div')
		chatContainerMessages.id = 'omnichat-container-messages'

		const chatMessages = document.createElement('div')
		chatMessages.id = 'omnichat-messages'

		const chatControls = document.createElement('div')
		chatControls.id = 'omnichat-controls'

		const input = document.createElement('input')
		input.type = 'text'
		input.placeholder = 'Type your message'

		const button = document.createElement('button')
		button.type = 'submit'
		button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">	<path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>'
		button.addEventListener('click', (e) => {
			e.preventDefault()
			console.log('Message sended!')
		})

		chatControls.appendChild(input)
		chatControls.appendChild(button)

		chatContainerMessages.appendChild(chatMessages)
		chatContainerMessages.appendChild(chatControls)

		document.getElementById('omnichat-container').appendChild(chatContainerMessages)
		console.log('createChat')
	}

	const createChatMessage = async (message = {}) => {
		const messageContainer = document.createElement('div')
		messageContainer.id = 'omnichat-chat-message'

		const img = document.createElement('img')
		img.src = '#' // message.picture
		img.alt = 'Dummy' // message.name
		img.id = 'omnichat-chat-message-img'

		const chatGorup = document.createElement('div')
		chatGorup.id = 'omnichat-chat-message-group'

		const userGroup = document.createElement('div')
		userGroup.id = 'omnichat-user-group'
		
		const displayName = document.createElement('div')
		displayName.id = 'omnichat-display-name'
		displayName.innerText = 'Atendente' // message.name

		const displayTime = document.createElement('div')
		displayTime.id = 'omnichat-display-time'
		displayTime.innerText = '10:20' // message.time

		userGroup.appendChild(displayName)
		userGroup.appendChild(displayTime)

		const text = document.createElement('div')
		text.id = 'omnichat-message-text'
		text.innerText = 'Olá, tudo bem?' // message.text

		chatGorup.appendChild(userGroup)
		chatGorup.appendChild(text)

		messageContainer.appendChild(img)
		messageContainer.appendChild(chatGorup)

		document.getElementById('omnichat-messages').appendChild(messageContainer)
		
		console.log('createChatMessage', message)
	}

	await addStyle()
	await createContainer()
	await createChatHeader()
	await creatChatForm()
	await createChat()
	await createChatMessage()
	await createChatMessage()

	console.log(source, token, config)
}

window.omnichat = omnichat