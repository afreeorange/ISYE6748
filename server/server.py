from constants import API_PREFIX, GIANT_LIST_OF_ALL_CLASS_NAMES
from exceptions import MemberNotFoundException, ClassNotFoundException
from flask import Flask, abort, jsonify, request
from item_item import recommend_similar_classes
from user_user import recommend_similar_patients
from user_item import recommend_patient_conditions, pick_a_random_member

app = Flask(__name__)


@app.route(f"/{API_PREFIX}/similar_conditions/<string:icd10_code>")
def similar_conditions(icd10_code):
    limit = None
    if request.args.get("limit"):
        try:
            limit = int(request.args.get("limit"))
        except ValueError:
            abort(400, "Limit parameter must be an integer.")

    if icd10_code not in GIANT_LIST_OF_ALL_CLASS_NAMES:
        abort(404, "Could not find that ICD10 Code.")

    ret = None

    try:
        ret = recommend_similar_classes(icd10_code, limit)
    except ClassNotFoundException as e:
        abort(404, str(e))
    except ValueError as e:
        abort(404, str(e))
    except Exception as e:
        print("ERROR:", e)
        abort(500, "Something bad happened on the server. Sorry.")

    return jsonify(ret)


@app.route(f"/{API_PREFIX}/similar_patients/<int:member_life_id>")
def similar_patients(member_life_id):
    limit = None
    if request.args.get("limit"):
        try:
            limit = int(request.args.get("limit"))
        except ValueError:
            abort(400, "Limit parameter must be an integer.")

    ret = None

    try:
        ret = recommend_similar_patients(member_life_id, limit)
    except MemberNotFoundException as e:
        abort(404, str(e))
    except ValueError as e:
        abort(404, str(e))
    except Exception as e:
        print("ERROR:", e)
        abort(500, "Something bad happened on the server. Sorry.")

    return jsonify(ret)


@app.route(f"/{API_PREFIX}/random_member_id")
def patient_conditions_random():
    """
    This is to simulate the creation of a new/synthetic patient on the website.
    """

    return jsonify(
        {
            "memberLifeId": str(pick_a_random_member()),
        }
    )


@app.route(f"/{API_PREFIX}/patient_conditions/<int:member_life_id>")
def patient_conditions(member_life_id):
    limit = None
    if request.args.get("limit"):
        try:
            limit = int(request.args.get("limit"))
        except ValueError:
            abort(400, "Limit parameter must be an integer.")

    ret = None

    try:
        ret = recommend_patient_conditions(member_life_id, limit)
    except MemberNotFoundException:
        abort(404, "Could not find a patient with that Member Life ID")
    except Exception as e:
        print("ERROR:", e)
        abort(500, "Something bad happened on the server. Sorry.")

    return jsonify(ret)


@app.route(f"/{API_PREFIX}")
@app.route(f"/")
def hi_there():
    return "I am the ICD10 API."
