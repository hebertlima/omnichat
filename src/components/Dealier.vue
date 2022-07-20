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
			<li v-for="(item, index) in 0" :key="index" class="flex items-center gap-4 cursor-pointer px-6 py-4">
				<img src="http://via.placeholder.com/46" alt="Dummy" class="flex items-center rounded-full w-[46px] h-[46px] overflow-hidden">
				<div class="flex flex-col justify-center">
					<h5 class="font-bold text-sm mb-1 text-white">John Doe</h5>
					<span class="text-gray-400 text-sm">11 1234-1234</span>
				</div>
			</li>
		</ul>
		<div class="container grid border-t-[1px] border-t-slate-800 pb-4">
			<div class="relative">
				<input v-model="toCall" type="text" readonly class="w-full text-center leading-5 text-slate-200 h-12 grid place-content-center bg-transparent outline-none text-2xl">
			</div>
			<ul class="bg-gray-500/30 rounded-2xl p-8 grid-cols-3 gap-6 grid">
				<li v-for="(n, index) in numbers" :key="index" class="mx-auto">
					<span @click="digit(n)" v-text="n" class="grid place-content-center w-16 h-16 rounded-full cursor-pointer text-white text-2xl hover:bg-gray-500/20"></span>
				</li>
				<li></li>
				<li class="mx-auto">
					<span class="grid place-content-center w-16 h-16 rounded-full cursor-pointer text-white text-2xl bg-green-500">
						<PhoneIcon class="w-8 h-8" />
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
			numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', '0', '#'],
		}
	},
	methods: {
		close() {
			this.$emit('close', true)
		},
		digit(n) {
			this.del = false
			this.toCall += n
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
			let recentes = localStorage.getItem('recentes') ? JSON.parse(localStorage.getItem('recentes')) : []
			if( !recentes.includes(number) )
				recentes.push(number)
			
			localStorage.setItem('recentes', JSON.stringify(recentes))
		},
		call() {
			if(!this.toCall.trim()) return

			this.createHistory(this.toCall)
			this.fakeCall()
		},
		fakeCall() {

		}
	},
	watch: {
		toCall(value) {
			if(this.del) return
			this.toCall = this.getMaskedValue(value)
		},
		isOpen(value) {
			if( value ) {
				this.$nextTick(() => this.setDrag())
			}
		}
	},
	mounted() {
		window.addEventListener('keydown', this.keyPress)
	}
}
</script>