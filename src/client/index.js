import { executeTask } from "./js/app";
import "./styles/style.scss";
import pic from "./media/icons/a01d.png";
//document.getElementById("generate").addEventListener("click", executeTask);

// var context = require.context("./media/icons", true, /\.(png)$/);
// var files = {};

// context.keys().forEach((filename) => {
// 	files[filename] = context(filename);
// });
// console.log(files);
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
