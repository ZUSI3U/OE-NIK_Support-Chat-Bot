FROM python:3.8-slim

RUN pip install -U pip
RUN pip install flask pillow 
RUN pip install flask-cors
RUN pip install protobuf
RUN pip install torch
RUN pip install transformers numpy
RUN pip install sentence-transformers

COPY . /app
EXPOSE 80
WORKDIR /app
CMD python -u qa.py




