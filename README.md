# How to use this repo:
Clone the repo
```
git clone https://github.com/harshitptl21/VirtualClassroom.git
```
For Backend
```
cd VirtualClassroom
python -m venv venv 
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations virtualclass
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
For Frontend
```
cd virtual-classroom-frontend
npm install
npm start
```
