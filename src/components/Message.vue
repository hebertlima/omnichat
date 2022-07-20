<template>
	<li class="flex items-start gap-4 mt-8 first:mt-0" :class="message.fromMe && 'flex-row-reverse'">
		<div>
			<img :src="message.picture"  alt="Dummy" class="w-[46px] h-[46px] rounded-full overflow-hidden object-cover block">
		</div>
		<div class="grid">
			<div class="flex items-center pt-2 pb-4 gap-4" :class="message.fromMe && 'flex-row-reverse'">
				<h5 class="font-bold" v-text="message.name"></h5>
				<span class="text-gray-400" v-text="message.getHumanTime()"></span>
			</div>
			<p class="p-3 rounded-b-2xl max-w-1/2 w-fit relative" :class="message.fromMe ? 'text-white bg-black ml-auto' : 'bg-slate-100 text-slate-800'" v-text="message.text"></p>
		</div>
	</li>
</template>
<script>
export default {
	name: 'MessageItem',
	props: {
		message: {
			type: Object,
			required: true
		}
	}
}
</script>