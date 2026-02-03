import random
import pprint


topics = ["CRUD", "validation", "uniqueness", "pagination"]
problem_difficulties = ['easy','medium']
endpoint_count = {
    'easy':[1,2],
    'medium':[2,3,4]
}
resource_count = {
    'easy':[1],
    'medium':[1]
}

topic_to_operations = {
    "CRUD": [
        ["create", "read"],
        ["create", "list"],
        ["read", "update"],
        ["create", "read", "update"]  # medium
    ],

    "validation": [
        ["create"],
        ["update"]
    ],

    "uniqueness": [
        ["create"],
        ["create", "update"]
    ],

    "fetch_by_id": [
        ["read"]
    ],

    "list_resources": [
        ["list"]
    ],

    "pagination": [
        ["list"]
    ]
}

constraints = [
    "required_field",
    "uniqueness",
    "max_length",
    "min_length"
]


def createProblemBlueprint():
    """Creates a blueprint that will be used in problem generation"""
    topic = random.choice(topics)
    difficulty = random.choice(problem_difficulties)
    num_endpoints = random.choice(endpoint_count[difficulty])
    num_resource = random.choice(resource_count[difficulty])
    operations = random.choice(topic_to_operations[topic])
    constraint = random.choice(constraints)

    blueprint = {
        "topic":topic,
        "difficulty":difficulty,
        "endpoint_count":num_endpoints,
        "resource_count":num_resource,
        "operations":operations,
        "constraint":constraint
    }
    return blueprint

if __name__ == "__main__":
    bp = createProblemBlueprint()
    pprint.pprint(bp,indent=4)