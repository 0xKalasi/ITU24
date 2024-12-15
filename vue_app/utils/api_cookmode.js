/* Ondřej Šatinský, xsatin03 */

import { supabase } from "./supabase";

export const getCookTimers = async ( cook_state_id ) => {
	const { data: timers, error } = await supabase
	.from( 'CookState' )
	.select(`
		*,
		CookTimer(*)
	`)
	.eq( 'id', cook_state_id )

	if ( error ) {
		console.log( error );
		return null;
	}

	if ( timers.length == 0 )
		return null;

	const cookTimers = timers[ 0 ].CookTimer;

	console.log( cookTimers );

	return cookTimers;
}

export const updateCookTimer = async ( timer_id, timer ) => {
	let { data: res, error } = await supabase
		.from( 'CookTimer' )
		.update( timer )
		.eq( 'id', timer_id );

	if ( error )
		console.log( error );
}

export const createCookState = async ( user_id, recipe_id ) => {
	/* create new cook state */
	let { data: res, error } = await supabase
		.from( 'CookState' )
		.insert(
			{
				user: user_id,
				recipe: recipe_id,
			}
		)
		.select();

	if ( error ) {
		console.log( error );
		return false;
	}

	if ( res == 0 ) {
		console.log( "fail" );
		return false;
	}

	const cook_state = res[ 0 ];

	console.log( 'new cook state', cook_state );

	console.log( 'adding step 1' );

	let { data: res2, error2 } = await supabase
		.from( 'CookStateStep' )
		.insert(
			{
				cookstate: cook_state.id,
				step_number: 1,
				step_recipe: recipe_id,
				state: 0
			}
		)
		.select();
	if ( error2 ) {
		console.log( 'error', error2 );
		return false;
	}
	console.log( "step 1 added" );

	return true;
}

export const getCookState = async ( user_id, recipe_id ) => {
	/* get existing cook state */
	let { data: res, error } = await supabase
		.from( 'CookState' )
		.select( `
			*,
			CookStateStep(*)
		` )
		.eq( 'user', user_id )
		.eq( 'recipe', recipe_id );

	console.log( res, error );

	if ( error ) {
		console.log( error );
		return null;
	}

	if ( res.length == 0 )
		return null;

	res = res[ 0 ];

	console.log( 'res', res );
	res.CookStateStep.sort( ( a, b ) => a.id - b.id );

	return res;
}

export const cookStateAddStep = async ( cook_state_id, step_number ) => {
	let { data: res, error } = await supabase
		.from( 'CookState' )
		.select( `
			*,
			CookStateStep(*)
		` )
		.eq( 'id', cook_state_id );
	res = res[ 0 ];

	console.log( 'res', res );

	await supabase
		.from( "CookStateStep" )
		.insert(
			{
				cookstate: cook_state_id,
				step_number,
				step_recipe: res.recipe,
				state: 0,
			}
		)
}

export const cookStateChangeStep = async ( cook_state_id, step_number, state ) => {
	let { data: res, error } = await supabase
		.from( "CookStateStep" )
		.update( { state } )
		.eq( 'cookstate', cook_state_id )
		.eq( 'step_number', step_number )
		.select()

	console.log( 'cook state change step', res, error )
}

export const deleteCookState = async ( cook_state_id ) => {
	await supabase
		.from( "CookState" )
		.delete()
		.eq( 'id', cook_state_id );
}

export const createCookTimer = async ( cook_state_id, timer ) => {
	const { data: res, error } = await supabase
		.from( 'CookTimer' )
		.insert([
		{
			cook_state_id: cook_state_id,
			timer_id: timer.timer_id,
			state: 1,
			start: ((new Date()).toISOString()).toLocaleString('zh-TW'),
			total_length: timer.length,
			rem_length: timer.length,
			name: timer.name,
		}
		])
		.select()

	console.log( res, error );

	if ( error ) {
		console.log( error );
		return 0;
	}

	console.log( res );

	return res[ 0 ].id;
}

export const deleteCookTimer = async ( timer_id ) => {
	await supabase.from('CookTimer').delete().eq( 'id', timer_id )
}
