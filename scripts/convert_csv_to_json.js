import fs from 'fs';
import path from 'path';
import { prefectures } from '../src/routes/prefectures.js';

const csv_file_path = 'resources/utf_ken_all.csv';
const json_file_path = 'src/lib/zip_code/data/';

const convert_csv_to_json = (csv_file_path, json_file_path) => {
	fs.readFile(csv_file_path, 'utf8', (err, data) => {
		if (err) {
			console.error('an error occurred while reading the file:', err);
			return;
		}

		const lines = data.split('\n').filter((line) => line);

		// [郵便番号データ（1レコード1行、UTF-8形式）の説明](https://www.post.japanpost.jp/zipcode/dl/utf-readme.html) を参照
		const headers = [
			'local_gov_code', // 全国地方公共団体コード（JIS X0401、X0402）
			'old_zip_code', // （旧）郵便番号（5桁）
			'zip_code', // 郵便番号（7桁）
			'prefecture_kana', // 都道府県名 全角カタカナ
			'city_kana', // 市区町村名 全角カタカナ
			'town_kana', // 町域名 全角カタカナ
			'prefecture', // 都道府県名 漢字
			'city', // 市区町村名 漢字
			'town', // 町域名 漢字
			'multiple_zip_codes_for_single_town', // 一町域が二以上の郵便番号で表される場合の表示（「1」は該当、「0」は該当せず）
			'numbered_for_each_subsection', // 小字毎に番地が起番されている町域の表示（「1」は該当、「0」は該当せず）
			'with_chome', // 丁目を有する町域の場合の表示（「1」は該当、「0」は該当せず）
			'single_zip_code_for_multiple_towns', // 一つの郵便番号で二以上の町域を表す場合の表示（「1」は該当、「0」は該当せず）
			'updated', // 更新の表示（「0」は変更なし、「1」は変更あり、「2」廃止（廃止データのみ使用））
			'reason_for_change' // 変更理由（「0」は変更なし、「1」市政・区政・町政・分区・政令指定都市施行、「2」住居表示の実施、「3」区画整理、「4」郵便区調整等、「5」訂正、「6」廃止（廃止データのみ使用））
		];

		const result = {};

		prefectures.forEach((pref) => {
			result[pref.kanji || 'all'] = [];
		});

		lines.forEach((line) => {
			const values = line.split(',');
			const row = {};
			headers.forEach((header, index) => {
				// 地方公共団体コードと旧郵便番号は不要なので除外
				if (index > 1 && index < 9) {
					row[header] = values[index].replace(/^"|"$/g, '').trim();
				} else {
					// 「一町域が二以上の郵便番号で表される場合の表示」以降はいらないかも。一旦コメントアウト。
					// result[header] = parseInt(values[index]);
				}
			});

			result['all'].push(row);
			result[row.prefecture].push(row);
		});

		Object.keys(result).forEach((pref) => {
			const file_name = `${pref === 'all' ? 'all' : prefectures.find((p) => p.kanji === pref).key}.json`;
			const file_path = path.join(json_file_path, file_name);

			fs.writeFile(file_path, JSON.stringify(result[pref]), 'utf8', (err) => {
				if (err) {
					console.error(`an error occurred while writing the file for ${pref}:`, err);
					return;
				}
			});
		});

		console.log('the JSON files were created successfully');
	});
};

convert_csv_to_json(csv_file_path, json_file_path);
