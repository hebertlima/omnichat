<template>
	<div class="container bg-[#F6F7FA]">
		<div class="flex items-center justify-between my-7">
			<h5 class="text-lg font-bold">
				Widget ( 0 )
			</h5>
			<button class="rounded-lg grid place-content-center w-fit p-2 bg-[#35495e] text-white">
				Novo 
			</button>
		</div>
		<ul class="border rounded-lg grid">
			<li class="flex justify-between items-center p-4">
				<span class="cursor-pointer" @click="copy('http://localhost:3333/omnichat.js?token=d6f11c19-a513-56cb-8f35-669e8b7944b1')">http://localhost:3333/omnichat.js?token=d6f11c19-a513-56cb-8f35-669e8b7944b1</span>
				<button class="text-red-600">
					<TrashIcon class="w-4 h-4" />
				</button>
			</li>
		</ul>
	</div>
</template>
<script>
import { TrashIcon } from '@heroicons/vue/outline'
export default {
	name: 'WidgetPage',
	components: {
		TrashIcon
	},
	methods: {
		copy(value) {
			navigator.clipboard.writeText(value)
			alert('Copiado para a área de transferência')
		}
	}
}
</script>