def get_items_to_update(obj: dict):
    return ",".join([f"{key} = {value}" for key, value in obj.items()])
