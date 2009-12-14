		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.initStatements = function()
		{
			//inserts
				this.insertDomain = this.db.query(<sql>INSERT INTO `domains` ( `domains_domain` ) VALUES (:domains_domain) </sql>);
				this.insertURL = this.db.query(<sql>INSERT INTO `urls` ( `urls_url` ) VALUES (:urls_url)  </sql>);
				this.insertEmail = this.db.query(<sql>INSERT INTO `emails` ( `emails_id_domain`, `emails_id_url`,`emails_email` ) VALUES (:emails_id_domain, :emails_id_url, :emails_email) </sql>);
			//selects
				this.selectDomain = this.db.query(<sql>SELECT * FROM `domains` WHERE domains_domain = :domains_domain LIMIT 1  </sql>);
				this.selectURL = this.db.query(<sql>SELECT * FROM `urls` WHERE urls_url = :urls_url LIMIT 1  </sql>);
				this.selectEmails = this.db.query(<sql>SELECT `emails_email`,`urls_url`,`emails_id` FROM `domains`,`emails`,`urls`   WHERE domains_id = :domains_id and domains_id = emails_id_domain and emails_status = 1  and emails_id_url = urls_id ORDER BY emails_email ASC  LIMIT 35</sql>);
			//truncate
				this.deleteEmails = this.db.query(<sql>DELETE FROM `emails` </sql>);
				this.deleteURLs = this.db.query(<sql>DELETE FROM `urls` </sql>);
				this.deleteDomains = this.db.query(<sql>DELETE FROM `domains` </sql>);
			//udpates
				this.updateEmailCount = this.db.query(<sql>UPDATE `domains` SET domains_email_count = (select count(*) from emails where emails_id_domain = :domains_id and emails_status = 1) where domains_id = :domains_id </sql>);
				this.updateDomainStatus = this.db.query(<sql>UPDATE `domains` SET domains_status = :domains_status where domains_id = :domains_id</sql>);
				this.updateEmailsStatus= this.db.query(<sql>UPDATE `emails` SET emails_status = 0 where emails_id_domain = :emails_id_domain</sql>);
				this.updateEmailStatus= this.db.query(<sql>UPDATE `emails` SET emails_status = 0 where emails_id = :emails_id</sql>);
			//search
				this.searchEmails = this.db.query(<sql> SELECT * FROM  `domains`,`emails`,`urls` WHERE  emails_status = 1  and  domains_id = emails_id_domain and emails_id_url = urls_id ORDER BY domains_domain , emails_email ASC </sql>);
				this.searchDomains = this.db.query(<sql> SELECT * FROM  `domains`,`emails`,`urls` WHERE domains_id = :domains_id and emails_status = 1  and  domains_id = emails_id_domain and emails_id_url = urls_id ORDER BY domains_domain , emails_email ASC </sql>);
		}
