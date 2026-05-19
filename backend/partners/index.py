import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """CRUD для партнёров event-агентства ARTSTAGE.PRO"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    path_params = event.get("pathParameters") or {}
    partner_id = path_params.get("id")
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # GET /partners — список всех активных партнёров
        if method == "GET" and not partner_id:
            cur.execute(
                "SELECT * FROM partners ORDER BY sort_order, id"
            )
            rows = cur.fetchall()
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({"partners": [dict(r) for r in rows]}, default=str),
            }

        # POST /partners — создать партнёра
        if method == "POST":
            name = body.get("name", "").strip()
            description = body.get("description", "").strip()
            logo = body.get("logo", "🏢").strip()
            logo_url = body.get("logo_url", "")
            sort_order = int(body.get("sort_order", 0))
            is_active = bool(body.get("is_active", True))

            if not name or not description:
                return {
                    "statusCode": 400,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({"error": "name и description обязательны"}),
                }

            cur.execute(
                """INSERT INTO partners (name, description, logo, logo_url, sort_order, is_active)
                   VALUES (%s, %s, %s, %s, %s, %s)
                   RETURNING *""",
                (name, description, logo, logo_url, sort_order, is_active),
            )
            conn.commit()
            row = dict(cur.fetchone())
            return {
                "statusCode": 201,
                "headers": CORS_HEADERS,
                "body": json.dumps({"partner": row}, default=str),
            }

        # PUT /partners/{id} — обновить партнёра
        if method == "PUT" and partner_id:
            fields = []
            values = []
            for field in ["name", "description", "logo", "logo_url", "sort_order", "is_active"]:
                if field in body:
                    fields.append(f"{field} = %s")
                    values.append(body[field])
            if not fields:
                return {
                    "statusCode": 400,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({"error": "Нет полей для обновления"}),
                }
            fields.append("updated_at = NOW()")
            values.append(int(partner_id))
            cur.execute(
                f"UPDATE partners SET {', '.join(fields)} WHERE id = %s RETURNING *",
                values,
            )
            conn.commit()
            row = cur.fetchone()
            if not row:
                return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Не найден"})}
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({"partner": dict(row)}, default=str),
            }

        # DELETE /partners/{id} — удалить партнёра
        if method == "DELETE" and partner_id:
            cur.execute("DELETE FROM partners WHERE id = %s RETURNING id", (int(partner_id),))
            conn.commit()
            row = cur.fetchone()
            if not row:
                return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Не найден"})}
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({"deleted": int(partner_id)}),
            }

        return {"statusCode": 405, "headers": CORS_HEADERS, "body": json.dumps({"error": "Метод не поддерживается"})}

    finally:
        cur.close()
        conn.close()
