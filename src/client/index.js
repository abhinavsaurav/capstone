import { executeTask, eventListener1 } from "./js/app";
import "./styles/style.scss";

//For importing the icons folder in media
function importAll(r) {
	let images = {};
	r.keys().map((item, index) => {
		images[item.replace("./", "")] = r(item);
	});
	return images;
}

const images = importAll(
	require.context("./media/icons", false, /\.(png|jpe?g|svg)$/)
);

eventListener1();
