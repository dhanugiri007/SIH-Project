from ortools.sat.python import cp_model


def solve_assignment(tasks, workers):
    """
    tasks: [{ "taskId": str, "eligibleWorkers": [{ "workerId": str, "score": int }] }]
    workers: [{ "workerId": str, "capacity": int }]

    Maximizes total assignment score subject to:
      - each task assigned to at most 1 worker
      - each worker assigned to at most `capacity` tasks
    Returns: { taskId: workerId | None }
    """
    model = cp_model.CpModel()

    capacity_by_worker = {w["workerId"]: w["capacity"] for w in workers}

    x = {}  # x[(taskId, workerId)] = BoolVar
    for task in tasks:
        for ew in task["eligibleWorkers"]:
            x[(task["taskId"], ew["workerId"])] = model.NewBoolVar(
                f'x_{task["taskId"]}_{ew["workerId"]}'
            )

    # Each task assigned to at most one worker
    for task in tasks:
        vars_for_task = [x[(task["taskId"], ew["workerId"])] for ew in task["eligibleWorkers"]]
        if vars_for_task:
            model.Add(sum(vars_for_task) <= 1)

    # Each worker assigned to at most their remaining capacity
    for worker_id, cap in capacity_by_worker.items():
        vars_for_worker = [
            x[(task["taskId"], worker_id)]
            for task in tasks
            for ew in task["eligibleWorkers"]
            if ew["workerId"] == worker_id
        ]
        if vars_for_worker:
            model.Add(sum(vars_for_worker) <= cap)

    # Maximize total score
    objective_terms = []
    for task in tasks:
        for ew in task["eligibleWorkers"]:
            objective_terms.append(ew["score"] * x[(task["taskId"], ew["workerId"])])
    model.Maximize(sum(objective_terms))

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 5.0
    status = solver.Solve(model)

    result = {task["taskId"]: None for task in tasks}

    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        for task in tasks:
            for ew in task["eligibleWorkers"]:
                if solver.Value(x[(task["taskId"], ew["workerId"])]) == 1:
                    result[task["taskId"]] = ew["workerId"]

    return result