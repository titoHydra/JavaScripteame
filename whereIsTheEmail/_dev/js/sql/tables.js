		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.createTables = function()
		{
			//create tables
				this.db.create(
							<sql>
								CREATE TABLE IF NOT EXISTS
									`domains`
								(
									`domains_id` INTEGER PRIMARY KEY ASC NOT NULL , 
									`domains_domain` VARCHAR UNIQUE  NOT NULL , 
									`domains_status` INTEGER  NOT NULL  DEFAULT 1, 
									`domains_email_count` INTEGER  NOT NULL  DEFAULT 0, 
									`domains_date` DATETIME NOT NULL DEFAULT CURRENT_DATE
								)
							</sql>
						);
				/*
					domains_status = 0 = blocked (no emails will be collected)
					domains_status = 1 = normal (mails will be collected)
				*/
				
				this.db.create(
							<sql>
								CREATE INDEX IF NOT EXISTS `domains_status` ON `domains` (`domains_status` ASC)
							</sql>
						);
				
				this.db.create(
							<sql>
								 CREATE TABLE IF NOT EXISTS
									`emails`
								(
									`emails_id` INTEGER PRIMARY KEY ASC NOT NULL ,
									`emails_id_domain` INTEGER NOT NULL , 
									`emails_id_url` INTEGER NOT NULL , 
									`emails_status` INTEGER NOT NULL DEFAULT 1, 
									`emails_email` VARCHAR UNIQUE NOT NULL , 
									`emails_date` DATETIME NOT NULL  DEFAULT CURRENT_DATE
								)
							</sql>
						);
				/*
					emails_status = 0 = deleted ( emails will not be showed or selected)
					emails_status = 1 = normal ( emails will be showed or selected)
				*/

				this.db.create(
							<sql>
								CREATE INDEX IF NOT EXISTS `emails_status` ON `emails` (`emails_status` ASC)
							</sql>
						);
				
				this.db.create(
							<sql>
								CREATE INDEX IF NOT EXISTS `emails_id_domain` ON `emails` (`emails_id_domain` ASC)
							</sql>
						);
				
				this.db.create(
							<sql>
								CREATE INDEX IF NOT EXISTS `emails_id_url` ON `emails` (`emails_id_url` ASC)
							</sql>
						);
				
				this.db.create(
							<sql>
								 CREATE TABLE IF NOT EXISTS
									`urls`
								(
									`urls_id` INTEGER PRIMARY KEY ASC NOT NULL ,
									`urls_url` VARCHAR UNIQUE  NOT NULL
								)
							</sql>
						);
		}