#!/bin/bash

#IMPORTANT!!!!
#Be sure to set line endings as LF and not CRLF


# Exits immediately if any errors occur
set -o errexit

#Array containing enviornment variables
# variable expansion ${REQUIRED_ENV_VARS[@]}
readonly REQUIRED_ENV_VARS=(
    "FILLA_DB_USER"
    "FILLA_DB_PASSWORD"
    "FILLA_DB_DATABASE"
    "POSTGRES_USER"
)

#MAIN
# - verifies all env vars set
# - rusn SQL code to create user and DB
main() {
    check_env_vars_set
    init_user_and_db
    sleep 5
}

#check all required env vars set
#echos texting explaining which arent set
#and the name of the ones that need to be
check_env_vars_set() {
    for required_env_var in ${REQUIRED_ENV_VARS[@]}; do 
        if [[ -z "${!required_env_var}" ]]; then
            echo "ERROR: 
            Enviornment variable '$required_env_var' not set. 
            Make sure you have the following enviornment varaibles set:
            
            ${REQUIRED_ENV_VARS[@]}

            Aborting."

            exit 1
        fi 
    done
}

# Initializes already started PostgreSQL
# uses preconfigured POSTGRES_USER user
init_user_and_db() {
    echo "user = $FILLA_DB_USER"
    echo "password = $FILLA_DB_PASSWORD"
    psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL


        CREATE USER test_user WITH PASSWORD 'FILLA_DB_PASSWORD';
        ALTER USER test_user WITH SUPERUSER;
        CREATE USER $FILLA_DB_USER WITH PASSWORD '$FILLA_DB_PASSWORD';
        CREATE DATABASE $FILLA_DB_DATABASE WITH OWNER $FILLA_DB_USER;
        ALTER USER $FILLA_DB_USER WITH SUPERUSER;
        GRANT ALL PRIVILEGES ON DATABASE $FILLA_DB_DATABASE TO $FILLA_DB_USER;
        
        \c $FILLA_DB_DATABASE

        CREATE TABLE alphatwo(
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
            COUNT(timestamp) AS events
        FROM alphatwo LEFT JOIN session_name USING (sessionid)
        GROUP BY sessionid, session_name;
EOSQL
}
#This line goes between Min and count
# EXTRACT(minutes FROM MAX(timestamp) - MIN(timestamp)) AS duration,
# however its causing an issue so its temp removed


# Runs main routing with env vars passed through command line
main "$@"
