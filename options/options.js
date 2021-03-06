var colorList = {
	ct_bg_color: "",
	bm_bg_color: "",
	mm_bg_color: "",
};
var contentBgColor = document.getElementById("ct_bg_color");
var bookmarkBgColor = document.getElementById("bm_bg_color");
var memoBgColor = document.getElementById("mm_bg_color");
var inputList = [contentBgColor, bookmarkBgColor, memoBgColor];

var reloadType = document.getElementById("reload_type");
var confirmMessage = document.getElementById("confirm_message");
var confirmPageMask = document.getElementById("confirm_page_mask");
var confirmBtn = document.getElementById("confirm_btn");
var cancelBtn = document.getElementById("cancel_btn");
var resetBtn = document.getElementById("reset_btn");

inputList.forEach((el) => {
	el.addEventListener("change", function (e) {
		// console.log(colorList);
		colorList[e.target.id] = e.target.value;
	});
});

resetBtn.addEventListener("click", function (e) {
	contentBgColor.value = "#e5fffb";
	bookmarkBgColor.value = "#808eff";
	memoBgColor.value = "#ffff8a";
	colorList = {
		ct_bg_color: "#e5fffb",
		bm_bg_color: "#808eff",
		mm_bg_color: "#ffff8a",
	};
	// console.log("clicked");
});

function content_bookmark_init() {
	chrome.storage.local.get(
		{ colorList: { ct_bg_color: "#e5fffb", bm_bg_color: "#808eff", mm_bg_color: "#ffff8a" } },
		function (items) {
			// console.log(items);
			inputList.forEach((el) => {
				el.value = items.colorList[el.id];
			});
			colorList = items.colorList;
		}
	);
}
function save_options() {
	chrome.storage.local.set(
		{
			colorList,
		},
		function () {
			var status = document.getElementById("status");
			status.textContent = "Options saved.";
			setTimeout(function () {
				status.textContent = "";
			}, 750);
		}
	);
}

function reload_tabs() {
	if (reloadType.value == "current") {
		confirmMessage.textContent = "Are you sure you want to reload all pages of current window?";
	} else {
		confirmMessage.textContent = "Are you sure you want to reload all pages of all windows?";
	}
	confirmPageMask.style.display = "block";

	confirmBtn.addEventListener("click", function () {
		let query = reloadType.value == "current" ? { currentWindow: true } : {};
		chrome.tabs.query(query, function (tabs) {
			// console.log(tabs);
			tabs.forEach((tab) => {
				chrome.tabs.reload(tab.id);
			});
		});
	});
	cancelBtn.addEventListener("click", function () {
		confirmPageMask.style.display = "none";
	});
}

document.addEventListener("DOMContentLoaded", content_bookmark_init);
document.getElementById("save").addEventListener("click", save_options);
document.getElementById("reload_all").addEventListener("click", reload_tabs);
