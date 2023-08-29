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
    priority int NULL,
    title VARCHAR(250) NULL,
    description VARCHAR(250) NULL,
    image VARCHAR(250) NULL,
    action VARCHAR(16) NULL,
    FK_pages VARCHAR(10) NOT NULL,  
    INDEX (FK_pages),  
    FOREIGN KEY (FK_pages) REFERENCES pages (id),  
    PRIMARY KEY(id)  
);