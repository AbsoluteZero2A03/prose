CREATE TABLE stories (
	id SERIAL,
	title VARCHAR,
	content VARCHAR,
	write_date date,
	post_contnet VARCHAR
);

ALTER TABLE stories ADD PRIMARY KEY (id);
