Calendar

About: The calendar contains 3 views (month, week, day), a calendar and schedule components. 
To add and edit use modal windows that appear by clicking on an event or an empty space.

To install:

```
git clone https://github.com/NikaKovalchuk/Calendar

python3 -m venv myvenv
source myvenv/bin/activate

pip install -r requerements.txt
python manage.py migrate

cd frontend
npm install
```

To run backend
```
python manage.py runserver
```

To run frontend
```  
cd frontend
npm start run
```


Stack: Django, Django REST, React, Redux, Webpack
