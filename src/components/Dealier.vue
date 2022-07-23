<template>
	<div ref="draggable" v-if="isOpen" class="fixed grid shadow-2xl rounded-3xl border-none bg-black w-[324px] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-hidden">
		<button @click="close()" class="grid place-content-center w-10 h-10 rounded-full cursor-pointer text-white text-2xl bg-red-900 absolute top-0 right-0 m-2">
			<XIcon class="w-4" />
		</button>
		<div class="p-6 border-b-[1px] border-b-slate-800">
			<span ref="handler" class="text-sm flex text-slate-200">
				Recente
			</span>
		</div>
		<ul class="divide-y divide-slate-800 max-h-[85px] overflow-y-auto block">
			<li v-for="(item, index) in history" :key="index" class="flex items-center gap-4 cursor-pointer px-6 py-4" @click="recall(item)">
				<img src="http://via.placeholder.com/46" alt="Dummy" class="flex items-center rounded-full w-[46px] h-[46px] overflow-hidden">
				<div class="flex flex-col justify-center">
					<h5 class="font-bold text-sm mb-1 text-white" v-text="item.name"></h5>
					<span class="text-gray-400 text-sm" v-text="item.number"></span>
				</div>
			</li>
		</ul>
		<div class="container grid border-t-[1px] border-t-slate-800 pb-4">
			<div class="relative">
				<small v-if="dealierStatus.isOutgoing" class="text-white absolute top-0 left-0" v-text="dealierStatus.statusText"></small>
				<input v-model="toCall" type="text" readonly class="w-full text-center leading-5 text-slate-200 h-24 grid place-content-center bg-transparent outline-none"
					:class="[{'text-3xl': sanitizer(toCall).length <= 21, 'text-lg': sanitizer(toCall).length > 21 && sanitizer(toCall).length <= 32, 'text-sm': sanitizer(toCall).length > 33, 'text-white' : !dealierStatus.inCall, 'text-green-400' : dealierStatus.isOutgoing && dealierStatus.inCall}]">
			</div>
			<ul class="bg-gray-500/30 rounded-2xl p-8 grid-cols-3 gap-6 grid">
				<li v-for="(item, index) in numbers" :key="index" class="mx-auto">
					<span @click="digit(item.number)" :id="`digit-${item.name}`" v-text="item.number" class="grid place-content-center w-16 h-16 rounded-full cursor-pointer text-white text-2xl hover:bg-gray-500/20"></span>
				</li>
				<li></li>
				<li class="mx-auto" @click="call()">
					<span class="grid place-content-center w-16 h-16 rounded-full cursor-pointer text-white text-2xl relative" 
						:class="[{'bg-green-500' : !dealierStatus.isOutgoing && !dealierStatus.inCall, 
									'bg-green-800' : dealierStatus.isOutgoing && !dealierStatus.inCall,
									'bg-red-500': dealierStatus.isOutgoing && dealierStatus.inCall }]">
						<component :is="heroicons[dealierStatus.icon]" class="w-6 h-6" />

						<span ref="blink" class="scale-0 absolute w-16 h-16 mx-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 rounded-full"></span>
					</span>
				</li>
				<li class="mx-auto">
					<span @click="erase()" class="grid place-content-center w-16 h-16 rounded-full cursor-pointer text-white text-2xl hover:bg-gray-500/20">
						<BackspaceIcon class="w-5 h-5" />
					</span>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import { PhoneIcon, BackspaceIcon, XIcon } from '@heroicons/vue/solid'
import * as heroicons from '@heroicons/vue/solid'

import { gsap } from 'gsap'

export default {
	name: 'DealierComponent',
	components: {
		PhoneIcon,
		BackspaceIcon,
		XIcon
	},
	props: {
		isOpen: {
			type: Boolean,
			required: true,
			del: false,
		}
	},
	data() {
		return {
			toCall: '',
			numbers: [{
					number: '1',
					name: 'one'
				},{
					number: '2',
					name: 'two'
				},{
					number: '3',
					name: 'three'
				},{
					number: '4',
					name: 'four'
				}, {
					number: '5',
					name: 'five'
				},{
					number: '6',
					name: 'six'
				},{
					number: '7',
					name: 'seven'
				},{
					number: '8',
					name: 'eight'
				}, {
					number: '9',
					name: 'nine'
				},{
					number: '*',
					name: 'asterisc'
				},{
					number: '0',
					name: 'zero'
				},{
					number: '#',
					name: 'hash'
			}],
			dealierStatus: {
				statusText: '',
				isOutgoing: false,
				inCall: false,
				calling: false,
				dialing: false,
				closing: false,
				icon: 'PhoneIcon'
			},
			heroicons: heroicons,
			anim: null,
			history: [],
		}
	},
	methods: {
		close() {
			this.$emit('close', true)
		},
		digit(n) {
			if( !this.dealierStatus.dialing && !this.dealierStatus.closing && !this.dealierStatus.calling ) {
				this.del = false
				this.toCall += n
			}
		},
		erase() {
			this.del = true
			let onlyNumers = this.toCall.replace(/[^0-9*#]/g, '')
			let lastCharacterRemoved = onlyNumers.slice(0,-1)
			this.toCall = this.getMaskedValue(lastCharacterRemoved)
		},
		mask(value, mask) {
			if( !value || !mask ) return value

			const valueToString = value.toString().trim()

			let masked = ''
			let index = 0

			for( let i = 0; i <= mask.length - 1; i++ ) {
				if( mask.charAt(i) === '#') {
					if( valueToString.charAt( index ) )
						masked += valueToString.charAt( index++ )
				} else {
					if( mask.charAt(i) )
						masked += mask.charAt(i)
				}
			}

			return masked
		},
		getMaskedValue(value) {
			let rawValue = value.replace(/[^0-9*#]/g, '')
			let masked = ''

			if( rawValue.length <= 10 ) {
				masked = this.mask(rawValue, '(##) ####-####')
			} else if ( rawValue.length > 10 && rawValue.length < 12 ) {
				masked = this.mask(rawValue, '(##) # ####-####')
			} else masked =  rawValue

			return masked
		},
		setDrag() {
			// eslint-disable-next-line no-undef
			$(this.$refs.draggable).draggable({
				handle: this.$refs.handler,
				cursorAt: { 
					top: Math.min((Math.min(this.$refs.draggable.clientHeight) / 2) - Math.min(this.$refs.handler.clientHeight + 20 / 2 ))  *-1, 
					left: 0 
				},
				drag: (event, ui) => {
					const dealerH = (this.$refs.draggable.clientHeight / 2)
					const dealerW = (this.$refs.draggable.clientWidth / 2)

					if( ui.position.left <= dealerW) ui.position.left = dealerW
					else if ( ui.position.left >= (window.innerWidth - dealerW )) ui.position.left = window.innerWidth - dealerW

					if( ui.position.top <= dealerH) ui.position.top = dealerH
					else if ( ui.position.top >= (window.innerHeight - dealerH )) ui.position.top = window.innerHeight - dealerH
				}
			})
		},
		keyPress(e) {
			if( !this.isOpen ) return

			if( e.keyCode >= 48 && e.keyCode <= 57 ) {
				this.digit(e.key)
			} else if( e.keyCode === 8 ) {
				this.erase()
			} else if( e.keyCode === 13 ) {
				this.call()
			} else if( e.keyCode === 27 ) {
				this.close()
			}
		},
		createHistory(number) {
			let history = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : []

			console.log( history )

			if( !history.find(item => item.number == number.number) ) {
				console.log('notfind', number, history)
				history.push(number)
			}
			
			localStorage.setItem('history', JSON.stringify(history))
		},
		call() {
			if(!this.toCall.trim()) return

			this.createHistory({
				name: 'Desconhecido',
				number: this.toCall.trim(),
			})
			this.fakeCall()
		},
		fakeCall() {
			this.anim = gsap.fromTo(this.$refs.blink, {
				scale: 0,
				opacity: 0
			},{
				scale: 1,
				opacity: .75
			}).yoyo(1).repeat(-1).duration(2)

			const fake = new Promise(resolve => {
				this.sendEvent('onDialing', { number: this.toCall })
				setTimeout(resolve, 8000)
			}).then(() => new Promise(resolve => {
				this.sendEvent('onCalling')
				setTimeout(resolve, 8000)
			}).then(() => new Promise(resolve => {
				this.sendEvent('inCall')
				setTimeout(resolve, 8000)
			})).then(() => new Promise(resolve => {
				this.sendEvent('onClosing')
				setTimeout(resolve, 8000)
			})).then(() => new Promise(resolve => {
				this.sendEvent('closed')
				setTimeout(resolve, 8000)
			})))

			fake.then(() => {
				this.sendEvent('completed')
			})
		},
		sendEvent(eventName, data = null ) {
			const event = new CustomEvent(eventName, { detail: data })
			window.dispatchEvent(event)
		},
		onDialing() {
			this.dealierStatus = {
				statusText: 'Discando...',
				isOutgoing: true,
				inCall: false,
				calling: false,
				dialing: true,
				closing: false,
				icon: 'ViewGridIcon'
			}
			console.log('discando...')
		},
		onCalling() {
			this.dealierStatus = {
				statusText: 'Chamando...',
				isOutgoing: true,
				inCall: false,
				calling: true,
				dialing: false,
				closing: false,
				icon: 'PhoneOutgoingIcon'
			}
			console.log('chamando...')
		},
		inCall() {
			this.dealierStatus = {
				statusText: 'Em ligação...',
				isOutgoing: true,
				inCall: true,
				calling: false,
				dialing: false,
				closing: false,
				icon: 'XIcon'
			}
			console.log('em ligação...')
		},
		onClosing() {
			this.dealierStatus = {
				statusText: 'Encerrando ligação...',
				isOutgoing: true,
				inCall: false,
				calling: false,
				dialing: false,
				closing: true,
				icon: 'PhoneMissedCallIcon'
			}
			console.log('finalizando...')
		},
		closed() {
			this.dealierStatus = {
				statusText: 'Finalizado',
				isOutgoing: true,
				inCall: false,
				calling: false,
				dialing: false,
				closing: false,
				icon: 'PhoneIcon'
			}
			console.log('finalizado...')
		},
		completed() {
			this.dealierStatus = {
				statusText: '',
				isOutgoing: false,
				inCall: false,
				calling: false,
				dialing: false,
				closing: false,
				icon: 'PhoneIcon'
			}
			this.toCall = ''
			this.anim.pause(0)
			this.loadHistory()
			console.log('completo...')
		},
		sanitizer(text) {
			return text.replace(/[^0-9*#]/g, '')
		},
		loadHistory() {
			if( localStorage.getItem('history')) {
				this.history = JSON.parse(localStorage.getItem('history'))
			}
		},
		recall(number) {
			this.toCall = number.number
			this.animTyping()
			this.call()
		},
		animTyping() {
			const number = this.toCall.replace(/[^0-9*#]/g, '')
			const digits = number.split('')
			const tl = gsap.timeline()

			digits.forEach(n => {
				const digit = this.numbers.find(item => item.number == n.toString())
				tl.fromTo(document.querySelector(`#digit-${digit.name}`), {
					backgroundColor: 'rgba(107, 114, 128, 0)'
				}, {
					backgroundColor: 'rgba(107, 114, 128, 0.3)'	
				}).call(() =>  document.querySelector(`#digit-${digit.name}`).removeAttribute('style')).duration(3).delay(2)
			})
		}
	},
	watch: {
		toCall(value) {
			if(this.del) return
			this.toCall = this.getMaskedValue(value)
		},
		isOpen(value) {
			if( value ) {
				this.loadHistory()
				this.$nextTick(() => this.setDrag())
			}
		}
	},
	mounted() {
		window.addEventListener('keydown', this.keyPress)

		// events
		window.addEventListener('onDialing', this.onDialing)
		window.addEventListener('onCalling', this.onCalling)
		window.addEventListener('inCall', this.inCall)
		window.addEventListener('onClosing', this.onClosing)
		window.addEventListener('closed', this.closed)
		window.addEventListener('completed', this.completed)
	}
}
</script>