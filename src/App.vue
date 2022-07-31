<template>
	<router-view />
</template>
<script>
import socket from '@/services/socket.js'
export default {
	name: "App",
	mounted() {
		socket.connect()

		socket.onAny((event, ...args) => {
			console.log('[DEBUG]', event, args)
		})
	},
}
</script>
