FROM python:3.8

ENV PYTHONUNBUFFERED=1
ENV DB_NAME=sql-db
ENV DB_USER=root
ENV DB_PASSWORD=
ENV DB_HOST=db
ENV DB_URL=

WORKDIR /django

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

# Update the settings.py file to use the environment variables for the database connection details
RUN sed -i 's/localhost/$DB_HOST/g' /django/mysite/settings.py
RUN sed -i 's/dbname/$DB_NAME/g' /django/mysite/settings.py
RUN sed -i 's/dbuser/$DB_USER/g' /django/mysite/settings.py
RUN sed -i 's/dbpassword/$DB_PASSWORD/g' /django/mysite/settings.py