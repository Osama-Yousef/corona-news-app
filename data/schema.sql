DROP TABLE IF EXISTS newsTable ;
CREATE TABLE newsTable (

id SERIAL PRIMARY KEY ,
title  VARCHAR(255),
author VARCHAR(255),
image VARCHAR(255),
description TEXT 

);