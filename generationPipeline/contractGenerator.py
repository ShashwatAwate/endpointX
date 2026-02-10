import json
from .utils import dict_to_json

def createContract(problem_description: json):
    """Create problem description from the generated response"""
    try:
        title = problem_description.get('title')
        id = problem_description.get('id')
        problem_contract = {}
        problem_contract['title'] = title
        problem_contract['endpoints'] = []
        problem_contract['question_id'] = id
        for endpoint in list(problem_description.get('endpoints')):
            method = endpoint.get('method')
            path = endpoint.get('path')
            request = endpoint.get('request')
            responses = endpoint.get('responses')
            invariants = endpoint.get('invariants')
            contract = {
                'method':method,
                'path':path,
                'request':request,
                'responses':responses,
                'invaraints':invariants
            }
            problem_contract['endpoints'].append(contract)
        return problem_contract
    except Exception as e:
        print(f"ERROR: in contract generation: {str(e)}")
        raise