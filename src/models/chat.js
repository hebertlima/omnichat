export default class Chat {
	constructor(options) {
		this.picture = options.picture || 'http://via.placeholder.com/56'
		this.name = options.name
		this.text = options.text
		this.fromMe = options.fromMe
		this.messages = []

		this.addMessage(options)
	}

	addMessage = function( options ) {
		const picture = options.picture || 'http://via.placeholder.com/56'
		this.messages.push({
			picture: options.fromMe ? picture : this.picture,
			name: options.fromMe ? options.name : this.name,
			text: options.text,
			time: Math.floor(new Date().getTime() / 1000),
			fromMe: options.fromMe,
			read: options.read,
			getHumanTime: this.getHumanTime.bind(this),
			isLastMessageMy: this.isLastMessageMy.bind(this)
		})
	}

	getHumanTime = function() {
		let time = new Date(this.getLastMessageTime() * 1000)
		let hour = time.getHours()
		let minutes = time.getMinutes()
		let ampm = hour >= 12 ? 'pm' : 'am'
		hour = hour % 12
		hour = hour ? hour : 12
		minutes = minutes < 10 ? '0' + minutes : minutes
		let startTime = hour + ':' + minutes + ' ' + ampm
		return startTime
	}

	getHumanDate = function() {
		let monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		]

		let time = new Date(this.getLastMessageTime() * 1000)
		let month = time.getMonth()
		let day = time.getDate()
		let startTime = monthNames[month] + ' ' + day
		return startTime
	}

	getLastMessageTime = function () {
		if( !this.messages.length ) return ''
		return this.messages[this.messages.length - 1].time
	}

	getUnreadMessaegsCount = function() {
		if(!this.messages.length) return 0
		return this.messages.reduce((acc, message) => !message.fromMe && !message.read ? acc +=1 : acc, 0)
	}

	getLastMessage = function() {
		if( !this.messages.length ) return ''
		return this.messages[this.messages.length - 1].text
	}

	readAllMessages = function() { 
		if( !this.messages.length ) return ''
		this.messages.forEach(message => message.read = true)
	}

	isLastMessageMy = function() {
		if( !this.messages.length ) return ''
		return this.messages[this.messages.length - 1].fromMe
	}
}