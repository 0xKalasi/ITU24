<script setup>
import { ref, onMounted } from 'vue'

const model = defineModel();

let digits = [
	ref( 0 ),
	ref( 0 ),
	ref( 0 ),
	ref( 0 ),
	ref( 0 ),
	ref( 0 ),
];

function get_time() {

	let out = 0;
	let k = 1;
	let b = true;

	for ( let i in digits ) {
		out += digits[ i ].value * k;

		if ( b ) {
			b = false;
			k *= 10;
		} else {
			b = true;
			k *= 6;
		}
	}

	return out;
}

function set_time( time ) {
	if ( time < 0 ) {
		set_time( 0 )
		return
	}

	if ( time >= 24 * 60 * 60 ) {
		set_time( 24 * 60 * 60 - 1 )
		return
	}

	model.value = time;

	digits[ 0 ].value = Math.floor( time / 1 % 10 );
	digits[ 1 ].value = Math.floor( time / 1 % 60 / 10 );

	digits[ 2 ].value = Math.floor( time / 60 % 10 );
	digits[ 3 ].value = Math.floor( time / 60 % 60 / 10 );

	digits[ 4 ].value = Math.floor( time / 3600 % 10 );
	digits[ 5 ].value = Math.floor( time / 3600 / 10 );
}

const digit_weight = [
	10 * 60 * 60, 60 * 60,
	60 * 10, 60,
	10, 1
];

function increment( i ) {
	set_time( get_time() + digit_weight[ 5 - i ] )
}

function decrement( i ) {
	set_time( get_time() - digit_weight[ 5 - i ] )
}

onMounted( () => {
	if ( typeof model.value != "number" )
		model.value = 0;
	set_time( model.value )

	setInterval( () => set_time( model.value ), 500 );
} );

</script>

<template>
	<div style="display: flex">
		<template v-for="i in [ 5, 4, -1, 3, 2, -1, 1, 0 ]">
			<div
				v-if="i >= 0"
				class="digit"
			>
				<Button @click="increment( i )">▲</Button>
				<div>{{ digits[ i ].value }}</div>
				<Button @click="decrement( i )">▼</Button>
			</div>
			<div
				class="colon"
				v-else
			>
				<div>:</div>
			</div>
		</template>
	</div>
</template>

<style scoped>
.colon {
	position: relative;
	width: 1em;
}

.colon > div {
	margin: 0;
	position: absolute;
	top: 50%;
	-ms-transform: translateY(-50%);
	transform: translateY(-50%);
}

.digit {
	text-align: center;
}

</style>
