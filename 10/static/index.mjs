import { endpointTodos } from "./api-todos.mjs";

document.body.style.display = "none";

//#region Statics.

	/** @type {string[]} */ let s_tasks = [];
	/** @type {boolean} */ let s_refreshing = false;
	/** @type {number} */ let s_btnDeleteAllPresses = 0;
	/** @type {number} */ let s_btnAddNewTaskTimerId = 0;

	/** @type {HTMLElement} */ const s_tltTask = document.querySelector("template.task");
	/** @type {HTMLElement} */ const s_divTasklist = document.querySelector(".tasklist");

	/** @type {HTMLElement} */ const s_btnAdd = document.querySelector(".controls .cbutton.add");
	/** @type {HTMLElement} */ const s_btnSync = document.querySelector(".controls .cbutton.refresh");

	/** @type {HTMLElement} */ const s_btnDeleteAll1 = document.querySelector(".cbutton.delall1");
	/** @type {HTMLElement} */ const s_btnDeleteAll2 = document.querySelector(".cbutton.delall2");
	/** @type {HTMLElement} */ const s_btnDeleteAll = document.querySelector(".controls .cbutton.delall");

//#endregion

//#region Shortcuts
document.body.addEventListener("keydown", (p_event) => {

	// if (!p_event.target instanceof HTMLTextAreaElement) {
	//
	// 	return;
	//
	// }

	if (p_event.key == "Escape") {

		document.activeElement.blur();

	}

});

document.body.addEventListener("keypress", (p_event) => {

	if (p_event.target instanceof HTMLTextAreaElement) {

		return;

	}

	switch (p_event.key) {

		case "+":
		case "=": {

			// s_btnAdd.focus({ preventScroll: true });
			s_btnAdd.click();


		} break;

		case "8":
		case "*": {

			s_btnSync.click();

		} break;

	}


	// if (p_event.altKey && p_event.shiftKey) {
	// }

	switch (p_event.key) {

		case "a": {

			// s_btnAdd.focus({ preventScroll: true });
			s_btnAdd.click();

		} break;

		case "r":
		case "s": {

			s_btnSync.click();

		} break;

	}


});
//#endregion

s_btnSync.addEventListener("click", async (p_event) => {

	// s_btnRefresh.removeEventListener("click", this); // `HTMLElement::disable` *can* be better.
	// Plus, we can't do this because `function () {}`-style anonymous functions REALLY ARE "anonymous"
	// and MUST be given a name or stored in a [named] variable. Even `this` doesn't refer to them correctly!

	s_refreshing = s_btnSync.disabled = true;

	try {

		await fetch(`/todos`, { method: "GET" })
			.then((p_response) => {

				p_response.json().then((p_json) => {

					switch (p_response.status) {

						case 500: switch (JSON.parse(p_json)["msg"]) {

							case endpointTodos[500].dbConnect: {



							} break;

							case endpointTodos[500].dbQuery: {



							} break;

							default: {



							} break;

						} break;

						case 400: switch (JSON.parse(p_json)["msg"]) {



						} break;

						case 200: {

							/** @type {Array<{position: number, taskText: string, updateTime: number}>} */ const rows = p_json;

							s_divTasklist.replaceChildren();

							for (let i = 0; i < rows.length; ++i) {

								s_btnAdd.click();

							}

							s_divTasklist.querySelectorAll("textarea.task-text").forEach(/** @param {HTMLElement} p_task */(p_task, p_id) => {

								p_task.innerText = rows[p_id].taskText;

							});

						} break;

					}

					s_refreshing = s_btnSync.disabled = false;

				});

			});

	} catch (e) {

	}

});

s_btnAdd.addEventListener("click", (p_event) => {

	const elt = document.createElement("div");
	elt.classList.add("task");
	elt.innerHTML = s_tltTask.innerHTML;
	s_divTasklist.insertAdjacentElement("afterbegin", elt);

	const all = document.querySelectorAll(".task");
	const task = all[all.length - 1];
	const tareaTask = task.querySelector("textarea");

	tareaTask.scrollIntoView();
	tareaTask.focus();
	tareaTask.click();

});

s_btnAdd.addEventListener("mouseleave", (p_event) => {

	s_btnAdd.blur();

});

//#region `s_btnDeleteAll*`.
s_btnDeleteAll.innerHTML = s_btnDeleteAll1.innerHTML;

s_btnDeleteAll.addEventListener("click", (p_event) => {

	++s_btnDeleteAllPresses;

	switch (s_btnDeleteAllPresses) {

		case 1: {

			s_btnDeleteAll.innerHTML = s_btnDeleteAll2.innerHTML;

		} break;

		case 2: { // LOL:

			s_btnDeleteAllPresses = 0;
			document.querySelectorAll(".task").forEach((p_element) => {

				p_element.remove();

			});

		} break;

	}

});

s_btnDeleteAll.addEventListener("mouseleave", (p_event) => {

	s_btnDeleteAll.blur();
	s_btnDeleteAllPresses = 0;
	s_btnDeleteAll.innerHTML = s_btnDeleteAll1.innerHTML;

});
//#endregion

// for (let i = 0; i < 3; ++i) {
//
s_btnAdd.click();
//
// }

document.body.style.display = "flex";
