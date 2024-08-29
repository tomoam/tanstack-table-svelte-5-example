import type { PageServerLoad } from './$types';
import { get_zip_code } from '$lib/zip_code/index.js';

export const load: PageServerLoad = async ({ url }) => {

	const key = url.searchParams.get('prefecture');	

	return {
		zipCodeData: get_zip_code(key)
	};
};
