<template>
	<div class="grid grid-cols-[auto,1fr,auto] gap-4 hover:bg-white hover:shadow-2xl p-4 pb-6 rounded-2xl transition-all">
		<div class="min-w-[56px] max-h-[56px] block relative w-[56px]">
			<img :src="chat.picture" class="rounded-full overflow-hidden w-[56px] h-[56px] object-cover" alt="Dummy">
			<div class="w-2 h-2 rounded-full bg-green-500 ring-2 ring-white absolute bottom-0 right-1 "></div>
		</div>
		<div class="grid">
			<h5 class="font-bold" v-text="chat.name"></h5>
			<span class="text-gray-400 text-sm line-clamp-2" v-text="chat.isLastMessageMy() ? `eu: ${chat.getLastMessage()}` : chat.getLastMessage()"></span>
		</div>
		<div class="grid justify-between">
			<small class="font-bold" v-text="chat.getHumanDate()"></small>
			<span v-if="chat.getUnreadMessaegsCount()" class="bg-black text-white grid place-content-center w-5 h-5 text-sm rounded-full ml-auto" v-text="chat.getUnreadMessaegsCount()"></span>
		</div>
	</div>
</template>
<script>
export default {
	name: 'ChatItem',
	props: {
		chat: {
			type: Object,
			required: true
		}
	},
}
</script>