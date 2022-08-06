<template>
	<aside class="container bg-[#F6F7FA]">
		<div class="flex items-center justify-between my-7">
			<h5 class="text-lg font-bold">
				Messages ({{ chats.length }})
			</h5>
			<button class="bg-white rounded-lg shadow-md grid place-content-center w-8 h-8">
				<PencilAltIcon class="w-4" />
			</button>
		</div>
		<div class="flex items-center border rounded-l-full rounded-r-full bg-transparent px-3">
			<input v-model="filter_text" type="text" class="border-0 bg-transparent placeholder:text-slate-400 text-slate-800 flex-1 outline-none" placeholder="Search">
			<button class="w-8 grid place-content-center my-3 min-w-fit">
				<SearchIcon class="w-4 mx-auto fill-slate-400" />
			</button>
		</div>
		<ul class="py-5 divide-y">
			<li v-for="(chat, index) in filterChats" :key="index" class="cursor-pointer" @click="setChat(chat)"><ChatItem :chat="chat" /></li>
		</ul>
	</aside>
	<main class="grid grid-rows-[56px,auto] container bg-[#F6F7FA]">
		<ul class="flex gap-6 px-8 items-center justify-end">
			<li class="relative curso-pointer">
				<PhoneIcon class="w-5" />
			</li>
			<li class="relative curso-pointer">
				<CalendarIcon class="w-5" />
			</li>
			<li class="relative curso-pointer">
				<div class="w-[6px] h-[6px] rounded-full bg-red-500 ring-white absolute top-0 right-0 ring-2"></div>
				<BellIcon class="w-5" />
			</li>
			<li class="relative curso-pointer">
				<div class="w-[6px] h-[6px] rounded-full bg-red-500 ring-white absolute top-0 right-0 ring-2"></div>
				<ChatAltIcon class="w-5" />
			</li>
			<li class="relative curso-pointer flex items-center">
				<div class="relative">
					<img src="@/assets/user.png" alt="User" class="rounded-full max-w-[56px] max-h-[56px] overflow-hidden">
					<div class="w-2 h-2 rounded-full ring-2 ring-white absolute bottom-0 right-1" :class="connected ? 'bg-green-500' : 'bg-red-600' "></div>
				</div>
				<ChevronDownIcon class="w-5 ml-3" />
			</li>
		</ul>
		<div  v-if="currentChat" class="grid grid-rows-[86px,auto,auto] rounded-2xl my-4 px-4" :class="currentChat && 'bg-white'">
			<div class="">
				<div class="grid items-center grid-cols-[56px,1fr,auto] gap-4 py-4 border-b border-b-slate-200">
					<div class="relative block">
						<img :src="currentChat.picture" class="rounded-full overflow-hidden w-[56px] h-[56px] object-cover" alt="Dummy">
						<div class="w-2 h-2 rounded-full bg-green-500 ring-2 ring-white absolute bottom-0 right-1 "></div>
					</div>
					<div class="flex flex-col justify-center">
						<h5 class="font-bold" v-text="currentChat.name"></h5>
						<span class="text-gray-400 text-sm">Active</span>
					</div>
					<div class="flex items-center">
						<button class="grid place-items-center w-11 h-11 bg-white text-black rounded-l-lg hover:text-white hover:bg-black transition-all">
							<SwitchHorizontalIcon class="w-5" />
						</button>
						<button @click="isOpen = !isOpen" class="grid place-items-center w-11 h-11 bg-white text-black hover:text-white hover:bg-black transition-all">
							<PhoneOutgoingIcon class="w-5" />
						</button>
						<button class="grid place-items-center w-11 h-11 bg-white text-black rounded-r-lg hover:text-white hover:bg-black transition-all">
							<HeartIcon class="w-5" />
						</button>
					</div>
				</div>
			</div>
			<div class="">
				<ul ref="messagesContainer" class="p-6 flex flex-col overflow-y-auto h-[calc(100vh-250px)]">
					<Message v-for="(message, index) in currentChat?.messages" :key="index" :message="message" />
				</ul>
			</div>
			<div class="py-4 grid items-center">
				<div class="flex items-center rounded-l-lg rounded-r-lg bg-slate-100 px-3">
					<button class="w-8 grid place-items-center my-3 min-w-fit">
						<PaperClipIcon class="w-4 mx-auto" />
					</button>
					<input v-model="text" type="text" class="bg-transparent border-0 placeholder:text-slate-400 text-slate-800 flex-1 outline-none" placeholder="Yout message">
					<button class="w-8 grid place-items-center my-3 min-w-fit">
						<PhotographIcon class="w-4 mx-auto" />
					</button>
					<button class="w-8 grid place-items-center my-3 min-w-fit">
						<EmojiHappyIcon class="w-4 mx-auto" />
					</button>
					<button class="w-8 grid place-items-center my-3 min-w-fit" @click="pushMessage()">
						<PaperAirplaneIcon class="w-4 mx-auto rotate-45 relative -top-[2px]" />
					</button>
				</div>
			</div>
		</div>
	</main>
	<Dealier :isOpen="isOpen" @close="() => isOpen = false" />
</template>
<script>
import ChatItem from '@/components/ChatItem.vue'
import Message from '@/components/Message.vue'
import Dealier from '@/components/Dealier.vue'

import Chat from '@/models/chat.js'
import socket from '@/services/socket.js'

import { PencilAltIcon, SearchIcon } from '@heroicons/vue/solid'

import {
	PhoneIcon,
	CalendarIcon,
	BellIcon,
	ChatAltIcon,
	ChevronDownIcon,
	SwitchHorizontalIcon,
	PhoneOutgoingIcon,
	HeartIcon,
	PaperClipIcon,
	PhotographIcon,
	EmojiHappyIcon,
	PaperAirplaneIcon,
 } from '@heroicons/vue/outline'
 
export default {
	name: 'AttendancePage',
	components: {
		PencilAltIcon,
		SearchIcon,
		PhoneIcon,
		CalendarIcon,
		BellIcon,
		ChatAltIcon,
		ChevronDownIcon,
		SwitchHorizontalIcon,
		PhoneOutgoingIcon,
		HeartIcon,
		PaperClipIcon,
		PhotographIcon,
		EmojiHappyIcon,
		PaperAirplaneIcon,
		ChatItem,
		Message,
		Dealier
	},
	data() {
		return {
			isOpen: false,
			colapsed: false,
			currentChat: null,
			chats: [],
			text: '',
			connected: false,
			filter_text: '',
		}
	},
	methods: {
		setChat(chat) {
			this.currentChat = chat
			this.currentChat.readAllMessages()
			this.scrollChat()
		},
		pushMessage() {
			if( !this.text.trim() ) return

			socket.emit('PRIVATE_MESSAGE', {
				content: {
					number: 11111111111,
					name: 'Hebert Lima',
					text: this.text,
					picture: require('@/assets/user.png'),
				},
				to: this.currentChat.number
			})

			this.currentChat.addMessage({
				fromMe: true,
				name: 'Hebert Lima',
				text: this.text,
				picture: require('@/assets/user.png'),
				time: Math.floor(new Date().getTime() / 1000)
			})

			this.scrollChat()

			this.currentChat.readAllMessages()

			this.text = ''
		},
		scrollChat() {
			this.$nextTick(() => {
				this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight
			})
		},
		toggle() {
			this.colapsed = !this.colapsed
		},
		createFakeChats() {
			const goku = new Chat({
				name: 'Son Goku', 
				text: 'Trabalhe arduamente e nunca deixe de sonhar. 🏃‍♂️',
				picture: require('@/assets/goku.jpeg'),
			})

			const sinon = new Chat({
				name: 'Sinon', 
				text: 'One shot, one kill!!',
				picture: require('@/assets/sinon.jpeg'),
			})

			sinon.addMessage({text: '🔫'})

			const kira = new Chat({
				name: 'K.', 
				text: 'Sou o homem que salvará os oprimidos e serei o Deus de um novo mundo',
				picture: require('@/assets/kira.jpeg'),
			})

			this.chats.push(goku,sinon, kira)		
		},
		findChatByNumber(number) {
			return this.chats.indexOf(this.chats.find(chat => chat.number === number))
		},
		sanitizer(number) {
			return number.replace(/[^0-9*#]/g, '')
		},
	},
	created() {
		socket.auth = {
			name: 'Hebert Lima',
			number: 11111111111
		}

		socket.connect()
	},
	beforeUnmount() {
		socket.disconnect()
	},
	mounted() {
		this.createFakeChats()

		window.addEventListener('keydown', (e) => {
			if( e.keyCode === 13 ) this.pushMessage()
		})

		socket.on('disconnect', () => this.connected = false)
		socket.on('connect', () => this.connected = true)

		socket.on('WELCOME', message => console.log(message))

		socket.on('PRIVATE_MESSAGE', (data) => {
			const indexChat = this.findChatByNumber(this.sanitizer(data.number))
			if( indexChat >= 0 && this.chats.length > 0 ) {
				this.chats[indexChat].addMessage({
					text: data.text,
					time: Math.floor(new Date().getTime() / 1000)
				})
			} else {
				const chat = new Chat({
					number: this.sanitizer(data.number),
					name: data.name,
					text: data.text,
					picture: data.picture,
					fromMe: false,
				})

				this.chats.push(chat)
			}

			this.scrollChat()
		})
	},
	computed: {
		filterChats() {
			return this.filter_text.length
				? this.chats.filter(chat => chat.name.includes(this.filter_text) || chat.getLastMessage().includes(this.filter_text))
				: this.chats
		}
	}
}
</script>