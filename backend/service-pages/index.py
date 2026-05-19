import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """CRUD для страниц услуг ARTSTAGE.PRO"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    slug = params.get("slug")
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # GET /service-pages?slug=xxx — одна страница
        if method == "GET" and slug:
            cur.execute("SELECT * FROM service_pages WHERE slug = %s", (slug,))
            row = cur.fetchone()
            if not row:
                return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Не найдено"})}
            data = dict(row)
            if isinstance(data.get("features"), str):
                data["features"] = json.loads(data["features"])
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"page": data}, default=str)}

        # GET /service-pages — все страницы
        if method == "GET":
            cur.execute("SELECT * FROM service_pages ORDER BY id")
            rows = cur.fetchall()
            result = []
            for r in rows:
                d = dict(r)
                if isinstance(d.get("features"), str):
                    d["features"] = json.loads(d["features"])
                result.append(d)
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"pages": result}, default=str)}

        # PUT /service-pages?slug=xxx — обновить страницу
        if method == "PUT" and slug:
            fields = []
            values = []
            allowed = ["title", "subtitle", "description", "features", "icon", "color", "is_active"]
            for field in allowed:
                if field in body:
                    val = body[field]
                    if field == "features" and isinstance(val, list):
                        val = json.dumps(val, ensure_ascii=False)
                    fields.append(f"{field} = %s")
                    values.append(val)
            if not fields:
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Нет полей для обновления"})}
            fields.append("updated_at = NOW()")
            values.append(slug)
            cur.execute(
                f"UPDATE service_pages SET {', '.join(fields)} WHERE slug = %s RETURNING *",
                values,
            )
            conn.commit()
            row = cur.fetchone()
            if not row:
                return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Не найдено"})}
            data = dict(row)
            if isinstance(data.get("features"), str):
                data["features"] = json.loads(data["features"])
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"page": data}, default=str)}

        return {"statusCode": 405, "headers": CORS_HEADERS, "body": json.dumps({"error": "Метод не поддерживается"})}

    finally:
        cur.close()
        conn.close()
