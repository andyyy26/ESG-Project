CREATE SCHEMA IF NOT EXISTS esg;

CREATE TABLE IF NOT EXISTS esg.pages(
    id VARCHAR(10) NOT NULL PRIMARY KEY,
    title VARCHAR(250) NULL,
    description VARCHAR(250) NULL,
    image VARCHAR(250) NULL,
    status VARCHAR(16) NULL
);

CREATE TABLE IF NOT EXISTS esg.page_info(
    id int NOT NULL AUTO_INCREMENT,
    title VARCHAR(250) NULL,
    description VARCHAR(250) NULL,
    image VARCHAR(250) NULL,
    type VARCHAR(250) NULL,
    action VARCHAR(16) NULL,
    FK_pages VARCHAR(10) NOT NULL,  
    INDEX (FK_pages),  
    FOREIGN KEY (FK_pages) REFERENCES pages (id),  
    PRIMARY KEY(id)  
);

CREATE TABLE IF NOT EXISTS esg.users(
    id VARCHAR(250) NOT NULL PRIMARY KEY,
    first_name VARCHAR(250) NULL,
    last_name VARCHAR(250) NULL,
    email VARCHAR(250) NULL,
    password VARCHAR(250) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS esg.user_info(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(250) NULL,
    code VARCHAR(250) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS esg.forms(
    id int NOT NULL AUTO_INCREMENT,
    form_id VARCHAR(250) NULL,
    organization LONGTEXT NULL,
    data LONGTEXT NULL,
    user_id VARCHAR(250) NOT NULL,
    INDEX (user_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    PRIMARY KEY(id)  
);

CREATE TABLE IF NOT EXISTS esg.posts(
    id int NOT NULL AUTO_INCREMENT,
    title VARCHAR(250) NULL,
    source VARCHAR(64) NULL,
    release_date VARCHAR(32) NULL,
    image VARCHAR(250) NULL,
    type VARCHAR(16) NULL,
    page_id char(10) NOT NULL,
    -- INDEX (page_id),
    -- FOREIGN KEY (page_id) REFERENCES pages (id),
    PRIMARY KEY(id)  
);