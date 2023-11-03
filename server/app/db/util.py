def get_items_to_update(obj: dict):
    statements = []
    for key, value in obj:
        if not value:
            continue
        statements.append(f"{key} = '{value}'")
    return ", ".join(statements)
