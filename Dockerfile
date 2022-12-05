FROM python:3.8-slim
CMD ["BASH"]
RUN  apt-get update -y && \
     apt-get upgrade -y && \
     apt-get dist-upgrade -y && \
     apt-get -y autoremove && \
     apt-get clean
RUN apt-get install -y p7zip \
    p7zip-full \
    unace \
    zip \
    unzip \
    xz-utils \
    sharutils \
    uudeview \
    mpack \
    arj \
    cabextract \
    file-roller \
    && rm -rf /var/lib/apt/lists/*

CMD ["bash"]
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

ADD https://public.ukp.informatik.tu-darmstadt.de/reimers/sentence-transformers/v0.2/paraphrase-multilingual-mpnet-base-v2.zip .
RUN unzip ./paraphrase-multilingual-mpnet-base-v2.zip -d /app/paraphrase-multilingual-mpnet-base-v2

CMD python -u qa.py




