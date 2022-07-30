<template>
	<div v-if="isAuthenticated" class="rounded-2xl my-4 px-4 bg-white grid grid-cols-[calc(auto,71px)]">
		<div class="">
			<ul ref="messagesContainer" class="p-6 flex flex-col overflow-y-auto h-[calc(100vh-75px)]">
				<Message v-for="(message, index) in []" :key="index" :message="message" />
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
				<button class="w-8 grid place-items-center my-3 min-w-fit" >
					<PaperAirplaneIcon class="w-4 mx-auto rotate-45 relative -top-[2px]" />
				</button>
			</div>
		</div>
	</div>
	<div v-else class="w-screen h-screen grid place-content-center bg-slate-500">
		<form class="grid w-[12.5rem] p-4 gap-4">
			<input type="text" class="p-2 w-full" placeholder="nome" v-model="form.name" />
			<input type="text" class="p-2 w-full" placeholder="numero" v-model="form.number" />
			<button @click="auth()" type="button" class="bg-black text-white p-2 rounded-lg w-full">Entrar</button>
		</form>
	</div>
</template>
<script>
import Message from '@/components/Message.vue'
import Chat from '@/models/chat.js'

import {
	PaperClipIcon,
	PhotographIcon,
	EmojiHappyIcon,
	PaperAirplaneIcon,
} from '@heroicons/vue/outline'

export default {
	name: 'ChatComponent',
	components: {
		Message,
		PaperClipIcon,
		PhotographIcon,
		EmojiHappyIcon,
		PaperAirplaneIcon
	},
	data() {
		return {
			isAuthenticated: false,
			form: {
				name: '',
				number: ''
			},
			chat: null,
		}
	},
	methods: {
		auth() {
			if( this.form.name && this.form.number ) {
				const {name, number} = this.form

				this.isAuthenticated = true

				this.chat = new Chat({
					name: name, 
					number: number,
					picture: require('@/assets/goku.jpeg'),
				})
			}
		}
	},
}
</script>