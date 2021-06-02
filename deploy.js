const fsextra = require("fs-extra");

function delFoldersSync() {
	//Удаляем папки созданные командой dev или serve.
	fsextra.removeSync('./.cache');
	fsextra.removeSync('./dist');
}
  
delFoldersSync();

