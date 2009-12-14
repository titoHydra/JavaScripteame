		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.createTables = function()
		{
			/*STRINGS*/
				this.db.create(
							<sql>
								CREATE TABLE IF NOT EXISTS
									`strings`
								(
									`strings_id` INTEGER PRIMARY KEY ASC NOT NULL , 
									`strings_string` VARCHAR UNIQUE NOT NULL DEFAULT '', 
									`strings_status` INTEGER NOT NULL  DEFAULT 1, 
									`strings_logs_count` INTEGER  NOT NULL  DEFAULT 0, 
									`strings_date` DATETIME NOT NULL DEFAULT CURRENT_DATE
								)
							</sql>
						);
				/*
					strings_status = 0 = no display
					strings_status = 1 = normal (display)
				*/
				this.db.create(
							<sql>
								CREATE INDEX IF NOT EXISTS `strings_status` ON `strings` (`strings_status` ASC)
							</sql>
						);
			/*MESSAGES*/
				this.db.create(
							<sql>
								CREATE TABLE IF NOT EXISTS
									`messages`
								(
									`messages_id` INTEGER PRIMARY KEY ASC NOT NULL , 
									`messages_message` VARCHAR UNIQUE NOT NULL DEFAULT ''
								)
							</sql>
						);
			/*blocked MESSAGES*/
				this.db.create(
							<sql>
								CREATE TABLE IF NOT EXISTS
									`blocked_messages`
								(
									`blocked_messages_id_message` INTEGER NOT NULL, 
									`blocked_messages_id_string` INTEGER NOT NULL
								)
							</sql>
						);
				this.db.create(<sql>CREATE UNIQUE INDEX IF NOT EXISTS `blocked_messages_UNIQUE` ON `blocked_messages` (`blocked_messages_id_message` ASC,`blocked_messages_id_string` ASC)</sql>);

			/*blocked URLS*/
				this.db.create(
							<sql>
								CREATE TABLE IF NOT EXISTS
									`blocked_urls`
								(
									`blocked_urls_id_url` INTEGER NOT NULL, 
									`blocked_urls_id_string` INTEGER NOT NULL,
									`blocked_urls_line` INTEGER NOT NULL
								)
							</sql>
						);
				this.db.create(<sql>CREATE UNIQUE INDEX IF NOT EXISTS `blocked_urls_UNIQUE` ON `blocked_urls` (`blocked_urls_id_url` ASC,`blocked_urls_id_string` ASC,`blocked_urls_line` ASC)</sql>);

			/*SOURCE_NAMES*/
				this.db.create(
							<sql>
								CREATE TABLE IF NOT EXISTS
									`source_names`
								(
									`source_names_id` INTEGER PRIMARY KEY ASC NOT NULL , 
									`source_names_name` VARCHAR UNIQUE NOT NULL DEFAULT ''
								)
							</sql>
						);
			/*SOURCE_LINES*/
				this.db.create(
							<sql>
								CREATE TABLE IF NOT EXISTS
									`source_lines`
								(
									`source_lines_id` INTEGER PRIMARY KEY ASC NOT NULL , 
									`source_lines_line` VARCHAR UNIQUE NOT NULL DEFAULT ''
								)
							</sql>
						);
			/*CATEGORIES*/
				this.db.create(
							<sql>
								CREATE TABLE IF NOT EXISTS
									`categories`
								(
									`categories_id` INTEGER PRIMARY KEY ASC NOT NULL , 
									`categories_category` VARCHAR UNIQUE NOT NULL DEFAULT ''
								)
							</sql>
						);
			/*LOGS*/
				this.db.create(
							<sql>
								 CREATE TABLE IF NOT EXISTS
									`logs`
								(
									`logs_id` INTEGER PRIMARY KEY ASC NOT NULL,
									`logs_id_string` INTEGER NOT NULL, 
									`logs_status` INTEGER NOT NULL DEFAULT 1, 
									`logs_id_message` INTEGER NOT NULL, 
									`logs_id_source_name` INTEGER NOT NULL, 
									`logs_id_source_line` INTEGER NOT NULL, 
									`logs_line_number` INTEGER NOT NULL DEFAULT 0, 
									`logs_column_number` INTEGER NOT NULL DEFAULT 0, 
									`logs_flags`  VARCHAR NOT NULL DEFAULT '', 
									`logs_id_category`  INTEGER NOT NULL, 
									`logs_error_flag`  VARCHAR NOT NULL DEFAULT '', 
									`logs_warning_flag`  VARCHAR NOT NULL DEFAULT '', 
									`logs_exception_flag`  VARCHAR NOT NULL DEFAULT '', 
									`logs_strict_flag`  VARCHAR NOT NULL DEFAULT '', 
									`logs_date` DATETIME NOT NULL DEFAULT CURRENT_DATE,
									`logs_time` DATETIME NOT NULL DEFAULT CURRENT_TIME
								)
							</sql>
						);

				this.db.create(<sql>CREATE INDEX IF NOT EXISTS `logs_id_string` ON `logs` (`logs_id_string` ASC)</sql>);
				this.db.create(<sql>CREATE INDEX IF NOT EXISTS `logs_id_message` ON `logs` (`logs_id_message` ASC)</sql>);
				this.db.create(<sql>CREATE INDEX IF NOT EXISTS `logs_id_source_name` ON `logs` (`logs_id_source_name` ASC)</sql>);
				this.db.create(<sql>CREATE INDEX IF NOT EXISTS `logs_id_source_line` ON `logs` (`logs_id_source_line` ASC)</sql>);
				this.db.create(<sql>CREATE INDEX IF NOT EXISTS `logs_id_category` ON `logs` (`logs_id_category` ASC)</sql>);
		}