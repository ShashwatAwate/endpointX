from .problemBlueprint import createProblemBlueprint
from .problemDecriptionGenerator import createProblemDescription
from .contractGenerator import createContract
from .testGenerator import createUnitTestCode,createUnitTestPlan

if __name__=="__main__":
    try:
        print("INFO: Generating blueprint")
        blueprint = createProblemBlueprint()
        print("INFO: Generating problem description")
        description = createProblemDescription(blueprint=blueprint)
        print("INFO: Generating contract")
        contract = createContract(description)
        print("INFO: Generating Test Plan")
        testPlan = createUnitTestPlan(contract)
        print("INFO: Generating Unit Tests")
        unitTests = createUnitTestCode(testPlan,contract)
        print(unitTests)

    except Exception as e:
        print(f"ERROR: in main {str(e)}")