create table alphatwo(
    sessionID VARCHAR(100),
    queryID VARCHAR(100),
    timeStamp VARCHAR(100),
    eventType VARCHAR(100),
    eventData json
);

CREATE TABLE alphaRead(
    pKey serial not null
    constraint alphaRead_pkey
    primary key,
    utcDate TIMESTAMP WITH TIME ZONE,
    url VARCHAR,
    source JSON,
    title VARCHAR,
    description VARCHAR,
    author VARCHAR,
    content TEXT,
    flesch JSON,
    urlToImages VARCHAR,
    publishedAt DATE,
    imageCount INTEGER,
    subscription BOOLEAN,
    video BOOLEAN,
    wordCount INTEGER,
    keywords VARCHAR,
    hasTags BOOLEAN
);

CREATE VIEW session_name AS
SELECT sessionid, eventdata->>'Set Name/New Session' AS session_name
  FROM alphatwo
  WHERE eventtype = 'Set Name/New Session';
CREATE VIEW session_summary AS
  SELECT sessionid, session_name,
         MIN(timestamp) AS start_time, MAX(timestamp) AS end_time,
         EXTRACT(minutes FROM MAX(timestamp) - MIN(timestamp)) AS duration,
         COUNT(timestamp) AS events
  FROM alphatwo LEFT JOIN session_name USING (sessionid)
  GROUP BY sessionid, session_name;