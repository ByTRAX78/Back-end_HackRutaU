build-package:
	@echo "Building package";
	@npm install
	@mkdir temporary_directory
	@cp -r ./node_modules ./temporary_directory/;
	@cp -r  ./src ./temporary_directory/;
	@cp ./index.js ./package.json ./package-lock.json ./temporary_directory/;
	@(cd ./temporary_directory && zip -r hack_aty.zip ./*);
	@mv hack_aty.zip ../
	@cd ..
	@rm -r ./temporary_directory;