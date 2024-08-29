import type { PageServerLoad } from './$types';
import { get_zip_code } from '$lib/zip_code/index.js';
import { prefectures } from '$lib/zip_code/prefectures';
import { redirect } from '@sveltejs/kit';

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	if (!params.pref || prefectures.findIndex((pref) => pref.key === params.pref) < 0) {
		redirect(301, '/all');
	}

	return {
		zipCodeData: get_zip_code(params.pref)
	};
};

export const entries = async () => {
	return prefectures.map((pref) => ({
		pref: pref.key
	}));
};
