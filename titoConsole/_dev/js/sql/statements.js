		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.initStatements = function()
		{
			//inserts
				this.insertStringSQL = this.db.query(<sql>INSERT INTO `strings` ( `strings_string` ) VALUES (:strings_string) </sql>);
				this.insertMessageSQL = this.db.query(<sql>INSERT INTO `messages` ( `messages_message` ) VALUES (:messages_message) </sql>);
				this.insertSourceNameSQL = this.db.query(<sql>INSERT INTO `source_names` ( `source_names_name` ) VALUES (:source_names_name) </sql>);
				this.insertSourceLineSQL = this.db.query(<sql>INSERT INTO `source_lines` ( `source_lines_line` ) VALUES (:source_lines_line) </sql>);
				this.insertCategorySQL = this.db.query(<sql>INSERT INTO `categories` ( `categories_category` ) VALUES (:categories_category) </sql>);
				
				this.insertBlockedMessageSQL = this.db.query(<sql>INSERT INTO `blocked_messages` ( `blocked_messages_id_message` ,`blocked_messages_id_string` ) VALUES (:blocked_messages_id_message,:blocked_messages_id_string) </sql>);
				
				this.insertBlockedURLSQL = this.db.query(<sql>INSERT INTO `blocked_urls` ( `blocked_urls_id_url` ,`blocked_urls_id_string`,`blocked_urls_line` ) VALUES (:blocked_urls_id_url,:blocked_urls_id_string,:blocked_urls_line) </sql>);
				
				this.insertLogSQL = this.db.query(
													<sql>
														INSERT INTO
															`logs` 
														(
															`logs_id_string`,
															`logs_id_message`,
															`logs_id_source_name`, 
															`logs_id_source_line`, 
															`logs_line_number`,
															`logs_column_number`, 
															`logs_flags`, 
															`logs_id_category`,
															`logs_error_flag`,
															`logs_warning_flag`, 
															`logs_exception_flag`, 
															`logs_strict_flag` 
														)
														VALUES
															(
															:logs_id_string,
															:logs_id_message,
															:logs_id_source_name,
															:logs_id_source_line,
															:logs_line_number,
															:logs_column_number,
															:logs_flags,
															:logs_id_category,
															:logs_error_flag,
															:logs_warning_flag,
															:logs_exception_flag,
															:logs_strict_flag
															)
													</sql>
												);
			//selects
				this.selectStringSQL = this.db.query(<sql>SELECT * FROM `strings` WHERE strings_string = :strings_string LIMIT 1</sql>);
				
				this.selectMessageSQL = this.db.query(<sql>SELECT * FROM `messages` WHERE messages_message = :messages_message LIMIT 1</sql>);
				this.selectSourceNameSQL = this.db.query(<sql>SELECT * FROM `source_names` WHERE source_names_name = :source_names_name LIMIT 1</sql>);
				this.selectSourceLineSQL = this.db.query(<sql>SELECT * FROM `source_lines` WHERE source_lines_line = :source_lines_line LIMIT 1</sql>);
				this.selectCategorySQL = this.db.query(<sql>SELECT * FROM `categories` WHERE categories_category = :categories_category LIMIT 1</sql>);
				//---
				this.selectStringIDSQL = this.db.query(<sql>SELECT * FROM `strings` WHERE strings_id = :strings_id LIMIT 1</sql>);
				this.selectStringsSQL = this.db.query(<sql>SELECT * FROM `strings` ORDER BY strings_string ASC</sql>);
				
				this.selectBlockedMessageSQL = this.db.query(<sql>SELECT * FROM `blocked_messages` WHERE blocked_messages_id_message = :blocked_messages_id_message AND blocked_messages_id_string = :blocked_messages_id_string LIMIT 1</sql>);
				this.selectBlockedURLSQL = this.db.query(<sql>SELECT * FROM `blocked_urls` WHERE blocked_urls_id_url = :blocked_urls_id_url AND blocked_urls_id_string = :blocked_urls_id_string  AND blocked_urls_line = :blocked_urls_line LIMIT 1</sql>);

			//delete
				this.deleteStringsSQL = this.db.query(<sql>DELETE FROM `strings` WHERE strings_id = :strings_id </sql>);
				this.deleteLogsSQL = this.db.query(<sql>DELETE FROM `logs` WHERE logs_id_string = :logs_id_string</sql>);
				this.deleteBlockedMessageSQL = this.db.query(<sql>DELETE FROM `blocked_messages` WHERE blocked_messages_id_string = :blocked_messages_id_string</sql>);
				this.deleteBlockedURLSQL = this.db.query(<sql>DELETE FROM `blocked_urls` WHERE blocked_urls_id_string = :blocked_urls_id_string</sql>);
			//udpates
				this.updateStringSQL = this.db.query(<sql>UPDATE `strings` SET strings_string = :strings_string where strings_id = :strings_id </sql>);
				this.updateStringStatusSQL = this.db.query(<sql>UPDATE `strings` SET strings_status = :strings_status where strings_id = :strings_id </sql>);

				this.updateStringsStatusSQL = this.db.query(<sql>UPDATE `strings` SET strings_status = :strings_status</sql>);

			//search
				this.searchEmails = this.db.query(<sql> SELECT * FROM  `domains`,`emails`,`urls` WHERE  emails_status = 1  and  domains_id = emails_id_domain and emails_id_url = urls_id ORDER BY domains_domain , emails_email ASC </sql>);
				this.searchDomains = this.db.query(<sql> SELECT * FROM  `domains`,`emails`,`urls` WHERE domains_id = :domains_id and emails_status = 1  and  domains_id = emails_id_domain and emails_id_url = urls_id ORDER BY domains_domain , emails_email ASC </sql>);
		}
