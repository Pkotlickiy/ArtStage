import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}

ALLOWED_KEYS = {"phone", "email", "address", "instagram", "telegram", "youtube", "vk", "whatsapp"}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """Управление контактами и соцсетями сайта ARTSTAGE.PRO"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # GET — все настройки в формате {key: value}
        if method == "GET":
            cur.execute("SELECT key, value FROM site_settings")
            rows = cur.fetchall()
            settings = {r["key"]: r["value"] for r in rows}
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"settings": settings})}

        # PUT — обновить настройки (body: { settings: { key: value, ... } })
        if method == "PUT":
            body = json.loads(event.get("body") or "{}")
            new_settings = body.get("settings") or {}
            if not isinstance(new_settings, dict):
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "settings должен быть объектом"})}

            updated = {}
            for k, v in new_settings.items():
                if k not in ALLOWED_KEYS:
                    continue
                val = str(v) if v is not None else ""
                cur.execute(
                    """INSERT INTO site_settings (key, value, updated_at)
                       VALUES (%s, %s, NOW())
                       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()""",
                    (k, val),
                )
                updated[k] = val
            conn.commit()
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"settings": updated})}

        return {"statusCode": 405, "headers": CORS_HEADERS, "body": json.dumps({"error": "Метод не поддерживается"})}

    finally:
        cur.close()
        conn.close()
