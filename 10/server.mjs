import express from "express"
import * as mariadb from "mariadb";
import { endpointTodos } from "./static/api-todos.mjs";

const s_env = {

	DB_HOST: "",
	DB_PASS: "",
	DB_USER: "",

};

for (const p of Object.keys(s_env)) {

	const value = process.env[p];

	if (value) {

		s_env[p] = value;
		continue;

	}

	console.error(`Please specify a valid ${value} environment variable before running this app.\n`);

}
Object.freeze(s_env);

const s_port = 8080;
const s_app = express();
const s_pathFront = "./static";
const s_dbPool = mariadb.createPool({

	host: s_env.DB_HOST,
	user: s_env.DB_USER,
	database: "dbTodos",
	password: s_env.DB_PASS,
	multipleStatements: true,

});

/**
 * @param {(conn: mariadb.PoolConnection) => {}} p_task
 * @param {(err: Error) => {}} p_cbckErr
 */
const dbDo = async (p_task, p_cbckErr) => {
	/** @type {mariadb.PoolConnection} */
	let db;

	try {

		db = await s_dbPool.getConnection();

	} catch (e) {

		console.error("DB connection could not be formed!:");
		console.error(e);
		p_cbckErr(e);

	}

	p_task(db);

	db.release();
};

s_app.use(express.static(s_pathFront));

s_app.get("/todos", (p_request, p_response) => {
	// p_response.status(200).send([{ taskText: "a" }]); return;

	dbDo(
		(p_db) => {

			p_db.query(`SELECT * FROM dbTodos.tbTodos ORDER BY position ASC;`)
				.then(/** @param {Array<{position: number, taskText: string, updateTime: number}>} p_rows */(p_rows) => {

					p_response.send(p_rows);

				})
				.catch((p_error) => {

					console.error("Error trying to fetch from `dbTodo.tbTodos`.");
					console.error(p_error);

					p_response.status(500).send(endpointTodos[500].dbQuery);

				});

		},
		(p_err) => {

			p_response.status(500).send(endpointTodos[500].dbConnect);

		});

});

// New todo w/ data:
s_app.post("/todos", (p_request, p_response) => {

});

// New todo only / new data only:
// s_app.put("/todos", (p_request, p_response) => { });

s_app.delete("/todos", (p_request, p_response) => {

});

s_app.listen(s_port, () => {

	console.log(`App now live on [ http://localhost:${s_port}/ ]!`);

});
