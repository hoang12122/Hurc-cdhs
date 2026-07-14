import hashlib
import json
from urllib import error, request


def contract_checksum(contract_path):
    return hashlib.sha256(contract_path.read_bytes()).hexdigest()


def register_schema_contract(contract_path, registry_url, subject, required=False, timeout=5):
    if not contract_path.exists():
        if required:
            raise RuntimeError(f"ETL contract does not exist: {contract_path}")
        return {"registered": False, "reason": "contract-missing", "checksum": None}

    schema_text = contract_path.read_text(encoding="utf-8")
    checksum = hashlib.sha256(schema_text.encode("utf-8")).hexdigest()
    if not registry_url:
        if required:
            raise RuntimeError("SCHEMA_REGISTRY_URL is required")
        return {"registered": False, "reason": "registry-disabled", "checksum": checksum}

    base = registry_url.rstrip("/")
    compatibility_body = json.dumps({"compatibility": "BACKWARD_TRANSITIVE"}).encode("utf-8")
    schema_body = json.dumps({
        "schemaType": "JSON",
        "schema": schema_text,
        "references": [],
    }).encode("utf-8")

    try:
        compatibility_request = request.Request(
            f"{base}/config/{subject}",
            data=compatibility_body,
            headers={"content-type": "application/vnd.schemaregistry.v1+json"},
            method="PUT",
        )
        with request.urlopen(compatibility_request, timeout=timeout) as response:
            if response.status not in (200, 201):
                raise RuntimeError(f"compatibility update returned HTTP {response.status}")

        schema_request = request.Request(
            f"{base}/subjects/{subject}/versions",
            data=schema_body,
            headers={"content-type": "application/vnd.schemaregistry.v1+json"},
            method="POST",
        )
        with request.urlopen(schema_request, timeout=timeout) as response:
            payload = json.loads(response.read().decode("utf-8") or "{}")
        return {
            "registered": True,
            "reason": None,
            "checksum": checksum,
            "schemaId": payload.get("id"),
        }
    except (error.URLError, TimeoutError, ValueError, RuntimeError) as exc:
        if required:
            raise RuntimeError(f"schema registry registration failed: {exc}") from exc
        return {"registered": False, "reason": str(exc), "checksum": checksum}
