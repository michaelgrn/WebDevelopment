FROM continuumio/anaconda3
MAINTAINER Michael Ekstrand <md@ekstrandom.net>

RUN conda install -y psycopg2

RUN useradd -d /work -m conda
VOLUME /work
WORKDIR /work
EXPOSE 8888
USER conda
CMD jupyter lab --ip=0.0.0.0
