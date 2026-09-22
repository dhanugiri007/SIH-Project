from flask import Flask, request, jsonify
from solver import solve_assignment

app = Flask(__name__)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/solve", methods=["POST"])
def solve():
    payload = request.get_json(force=True)
    tasks = payload.get("tasks", [])
    workers = payload.get("workers", [])

    if not tasks:
        return jsonify({"assignments": {}})

    assignments = solve_assignment(tasks, workers)
    return jsonify({"assignments": assignments})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)