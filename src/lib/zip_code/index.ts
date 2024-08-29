import hokkaido from './data/hokkaido.json';
import aomori from './data/aomori.json';
import iwate from './data/iwate.json';
import miyagi from './data/miyagi.json';
import akita from './data/akita.json';
import yamagata from './data/yamagata.json';
import fukushima from './data/fukushima.json';
import ibaraki from './data/ibaraki.json';
import tochigi from './data/tochigi.json';
import gunma from './data/gunma.json';
import saitama from './data/saitama.json';
import chiba from './data/chiba.json';
import tokyo from './data/tokyo.json';
import kanagawa from './data/kanagawa.json';
import niigata from './data/niigata.json';
import toyama from './data/toyama.json';
import ishikawa from './data/ishikawa.json';
import fukui from './data/fukui.json';
import yamanashi from './data/yamanashi.json';
import nagano from './data/nagano.json';
import gifu from './data/gifu.json';
import shizuoka from './data/shizuoka.json';
import aichi from './data/aichi.json';
import mie from './data/mie.json';
import shiga from './data/shiga.json';
import kyoto from './data/kyoto.json';
import osaka from './data/osaka.json';
import hyogo from './data/hyogo.json';
import nara from './data/nara.json';
import wakayama from './data/wakayama.json';
import tottori from './data/tottori.json';
import shimane from './data/shimane.json';
import okayama from './data/okayama.json';
import hiroshima from './data/hiroshima.json';
import yamaguchi from './data/yamaguchi.json';
import tokushima from './data/tokushima.json';
import kagawa from './data/kagawa.json';
import ehime from './data/ehime.json';
import kouchi from './data/kouchi.json';
import fukuoka from './data/fukuoka.json';
import saga from './data/saga.json';
import nagasaki from './data/nagasaki.json';
import kumamoto from './data/kumamoto.json';
import oita from './data/oita.json';
import miyazaki from './data/miyazaki.json';
import kagoshima from './data/kagoshima.json';
import okinawa from './data/okinawa.json';
import all from './data/all.json';

const zip_code_data: { [key: string]: ZipCodeData[] } = {
	hokkaido,
	aomori,
	iwate,
	miyagi,
	akita,
	yamagata,
	fukushima,
	ibaraki,
	tochigi,
	gunma,
	saitama,
	chiba,
	tokyo,
	kanagawa,
	niigata,
	toyama,
	ishikawa,
	fukui,
	yamanashi,
	nagano,
	gifu,
	shizuoka,
	aichi,
	mie,
	shiga,
	kyoto,
	osaka,
	hyogo,
	nara,
	wakayama,
	tottori,
	shimane,
	okayama,
	hiroshima,
	yamaguchi,
	tokushima,
	kagawa,
	ehime,
	kouchi,
	fukuoka,
	saga,
	nagasaki,
	kumamoto,
	oita,
	miyazaki,
	kagoshima,
	okinawa,
	all
} as const;

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

export const get_zip_code = async (key: string) => {
	return zip_code_data[key];
};
