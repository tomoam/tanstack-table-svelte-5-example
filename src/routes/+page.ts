import type { PageLoad } from './$types';

export type ZipCodeData = {
	/** 郵便番号 */
	zip_code: string;
	/** 都道府県名 全角カタカナ */
	prefecture_kana: string;
	/** 市区町村名 全角カタカナ */
	city_kana: string;
	/** 町域名 全角カタカナ */
	town_kana: string;
	/** 都道府県名 漢字 */
	prefecture: string;
	/** 市区町村名 漢字 */
	city: string;
	/** 町域名 漢字 */
	town: string;
};

export const load: PageLoad = () => {
	const zipCodeData = import('./zip_codes.json').then((module) => module.default);

	return {
		zipCodeData: zipCodeData as Promise<ZipCodeData[]>
	};
};
