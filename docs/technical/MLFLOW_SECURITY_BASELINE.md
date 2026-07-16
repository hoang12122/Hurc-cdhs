# MLflow Security Baseline

## 1. Scope

This baseline applies to the MLflow tracking server in `docker-compose.platform.yml` and the Python client used by `infra/vision-trainer`.

The current HURC integration uses MLflow for experiment tracking, parameters, metrics and model artifact logging. It does not use MLflow model serving, MLServer, local environment model deployment or MLflow Job Execution.

## 2. Mandatory version baseline

The Python client and server image must use the same MLflow version and must not be lower than `3.10.0`.

The reviewed baseline in this repository is:

- Python client: `mlflow==3.14.0`;
- Server image: `ghcr.io/mlflow/mlflow:v3.14.0`.

This version is newer than the fixes referenced for archive path traversal, model-serving command injection and FastAPI authentication bypass issues.

## 3. Network boundary

The MLflow host port must remain bound to loopback:

```yaml
127.0.0.1:${MLFLOW_HOST_PORT:-5000}:5000
```

MLflow must not be published on `0.0.0.0` at the host boundary. Containers that require tracking access communicate through the private `backend-net` network.

For remote access, place MLflow behind an approved reverse proxy or identity-aware gateway. Do not expose the container port directly to an external network.

## 4. Job execution policy

MLflow Job Execution is prohibited for this deployment and is explicitly disabled:

```yaml
MLFLOW_SERVER_ENABLE_JOB_EXECUTION: "false"
```

Do not enable job execution without a separate threat model, authenticated gateway, per-job authorization, command allowlist, resource quotas and isolated execution workers.

## 5. Model serving policy

The following options are prohibited in repository runtime configuration:

- `enable_mlserver=True`;
- `env_manager=LOCAL`;
- shell construction from a user-controlled `model_uri`;
- automatic deployment of model artifacts from untrusted or user-writable directories.

Model artifacts must be treated as untrusted input. Their source, checksum and approval status must be verified before loading or deployment.

## 6. Upload and archive policy

The following configuration is prohibited:

```text
UPLOAD_KEEP_FILENAME=True
```

Uploaded files must be renamed to server-generated identifiers. Archive extraction must reject absolute paths, `..` path segments, links escaping the extraction root and duplicate target paths.

## 7. Authentication policy

The repository does not enable MLflow built-in `basic-auth` mode. If authentication is required, use an approved gateway and centrally managed identity provider.

Do not deploy default credentials, hard-coded passwords or an unreviewed `basic_auth.ini` file.

## 8. Container hardening

The MLflow security override enforces:

- read-only container root filesystem;
- writable temporary storage only under `/tmp`;
- all Linux capabilities dropped;
- `no-new-privileges` enabled;
- bounded process count;
- persistent writes restricted to the `/mlflow` volume.

## 9. CI enforcement

`scripts/check-mlflow-security.mjs` is executed by the Security and Acceptance Gate. It verifies:

- minimum and matching client/server versions;
- explicit job-execution disablement;
- loopback-only host binding;
- container hardening controls;
- absence of prohibited serving and upload options.

A change that weakens this baseline must fail CI and undergo a separate security review.
