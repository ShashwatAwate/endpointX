import pika
from ..db import engine

def create_question(payload):
    """Creates a row in Questions
{{
"title": "",
"overview": "",
"endpoints":[
{{
"title":"",
"overview":"",
"method":"",
"path": ""
"behaviour": "",
"responses":{{
}},
"invariants":[]
}},
],
"notes":[]
}}
    """
    
