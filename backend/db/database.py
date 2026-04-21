import mysql.connector
from config import settings

def get_connection():
    return mysql.connector.connect(
        host=settings.DB_HOST,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        database=settings.DB_NAME,
        charset='utf8mb4',
        collation='utf8mb4_unicode_ci'
    )

def execute_query(sql: str, params: tuple = ()):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(sql, params)
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

def execute_paginated_query(sql: str, params: tuple = (), page: int = 1, size: int = 10):
    offset = (page - 1) * size
    
    # Get total count
    count_sql = f"SELECT COUNT(*) as total FROM ({sql}) as sub"
    total_res = execute_query(count_sql, params)
    total = total_res[0]['total'] if total_res else 0
    
    # Get data
    paginated_sql = f"{sql} LIMIT %s OFFSET %s"
    items = execute_query(paginated_sql, params + (size, offset))
    
    import math
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": math.ceil(total / size) if size > 0 else 0
    }

def execute_write(sql: str, params: tuple = ()):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(sql, params)
        conn.commit()
        return {"lastrowid": cursor.lastrowid, "rowcount": cursor.rowcount}
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()
