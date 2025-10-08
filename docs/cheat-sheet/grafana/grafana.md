# Grafana Cheat Sheet

## Overview

Grafana is an open-source observability platform for visualizing metrics, logs, and traces from multiple data sources.

**Key Features:**
- Multi-source data visualization
- Interactive dashboards
- Alerting and notifications
- Support for 150+ data sources
- Template variables for dynamic dashboards
- Panel library and sharing

## Installation

### Docker
```bash
docker run -d -p 3000:3000 --name=grafana grafana/grafana
```

### Docker with persistent storage
```bash
docker run -d -p 3000:3000 \
  --name=grafana \
  -v grafana-storage:/var/lib/grafana \
  grafana/grafana
```

### Docker Compose
```yaml
version: '3'
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false

volumes:
  grafana-data:
```

### Kubernetes (with Helm)
```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm install grafana grafana/grafana
```

### Linux (Debian/Ubuntu)
```bash
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install grafana
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
```

### Default Credentials
- URL: http://localhost:3000
- Username: `admin`
- Password: `admin` (change on first login)

## Configuration

### Main Configuration File
Location: `/etc/grafana/grafana.ini` (Linux) or `conf/defaults.ini`

```ini
[server]
http_port = 3000
domain = localhost
root_url = %(protocol)s://%(domain)s:%(http_port)s/

[database]
type = sqlite3
path = grafana.db

[security]
admin_user = admin
admin_password = admin

[users]
allow_sign_up = false
allow_org_create = false

[auth.anonymous]
enabled = false

[smtp]
enabled = true
host = smtp.gmail.com:587
user = your-email@gmail.com
password = your-password
from_address = grafana@yourdomain.com
```

### Environment Variables
```bash
# Set admin password
GF_SECURITY_ADMIN_PASSWORD=mypassword

# Disable anonymous access
GF_AUTH_ANONYMOUS_ENABLED=false

# Set SMTP
GF_SMTP_ENABLED=true
GF_SMTP_HOST=smtp.gmail.com:587
GF_SMTP_USER=email@example.com
GF_SMTP_PASSWORD=password
```

## Data Sources

### Add Prometheus Data Source

**Via UI:**
1. Configuration → Data Sources → Add data source
2. Select Prometheus
3. URL: `http://prometheus:9090`
4. Click "Save & Test"

**Via provisioning** (`/etc/grafana/provisioning/datasources/prometheus.yml`):
```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
```

### Add MySQL Data Source
```yaml
apiVersion: 1

datasources:
  - name: MySQL
    type: mysql
    url: mysql-host:3306
    database: mydb
    user: grafana
    secureJsonData:
      password: 'password'
```

### Add PostgreSQL Data Source
```yaml
apiVersion: 1

datasources:
  - name: PostgreSQL
    type: postgres
    url: postgres-host:5432
    database: mydb
    user: grafana
    secureJsonData:
      password: 'password'
    jsonData:
      sslmode: disable
```

### Add Loki Data Source
```yaml
apiVersion: 1

datasources:
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    jsonData:
      maxLines: 1000
```

### Add Elasticsearch Data Source
```yaml
apiVersion: 1

datasources:
  - name: Elasticsearch
    type: elasticsearch
    access: proxy
    url: http://elasticsearch:9200
    database: "[logs-]YYYY.MM.DD"
    jsonData:
      esVersion: "7.10.0"
      timeField: "@timestamp"
```

## Dashboards

### Create Dashboard via UI
1. Click "+" → Dashboard
2. Click "Add new panel"
3. Configure query and visualization
4. Click "Apply"
5. Click "Save dashboard"

### Import Dashboard
1. Click "+" → Import
2. Enter dashboard ID or JSON
3. Select data source
4. Click "Import"

**Popular Dashboard IDs:**
- Node Exporter Full: `1860`
- Kubernetes Cluster Monitoring: `7249`
- Docker Dashboard: `893`
- MySQL Overview: `7362`
- NGINX: `12708`

### Export Dashboard
1. Dashboard Settings (gear icon) → JSON Model
2. Copy JSON or click "Save to file"

### Dashboard Provisioning
Create `/etc/grafana/provisioning/dashboards/dashboard.yml`:

```yaml
apiVersion: 1

providers:
  - name: 'Default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    options:
      path: /var/lib/grafana/dashboards
```

Place dashboard JSON files in `/var/lib/grafana/dashboards/`

### Dashboard JSON Example
```json
{
  "dashboard": {
    "title": "My Dashboard",
    "panels": [
      {
        "id": 1,
        "type": "graph",
        "title": "CPU Usage",
        "targets": [
          {
            "expr": "100 - (avg(rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
            "refId": "A"
          }
        ]
      }
    ],
    "time": {
      "from": "now-6h",
      "to": "now"
    },
    "refresh": "5s"
  }
}
```

## Panels & Visualizations

### Panel Types

#### Time Series (Graph)
Best for: Metrics over time

```json
{
  "type": "timeseries",
  "targets": [
    {
      "expr": "rate(http_requests_total[5m])"
    }
  ]
}
```

#### Stat
Best for: Single numeric value

```json
{
  "type": "stat",
  "targets": [
    {
      "expr": "sum(up)"
    }
  ],
  "options": {
    "graphMode": "area",
    "colorMode": "value"
  }
}
```

#### Gauge
Best for: Percentage or threshold visualization

```json
{
  "type": "gauge",
  "targets": [
    {
      "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100"
    }
  ],
  "fieldConfig": {
    "defaults": {
      "max": 100,
      "min": 0,
      "thresholds": {
        "steps": [
          {"color": "green", "value": 0},
          {"color": "yellow", "value": 70},
          {"color": "red", "value": 90}
        ]
      }
    }
  }
}
```

#### Bar Chart
Best for: Comparing values across categories

```json
{
  "type": "barchart",
  "targets": [
    {
      "expr": "sum(http_requests_total) by (method)"
    }
  ]
}
```

#### Table
Best for: Tabular data display

```json
{
  "type": "table",
  "targets": [
    {
      "expr": "up",
      "format": "table"
    }
  ]
}
```

#### Heatmap
Best for: Distribution over time

```json
{
  "type": "heatmap",
  "targets": [
    {
      "expr": "rate(http_request_duration_seconds_bucket[5m])"
    }
  ]
}
```

#### Pie Chart
Best for: Part-to-whole relationships

```json
{
  "type": "piechart",
  "targets": [
    {
      "expr": "sum(http_requests_total) by (status_code)"
    }
  ]
}
```

#### Logs Panel
Best for: Log entries from Loki

```json
{
  "type": "logs",
  "datasource": "Loki",
  "targets": [
    {
      "expr": "{job=\"varlogs\"}"
    }
  ]
}
```

### Panel Options

#### Thresholds
```json
{
  "thresholds": {
    "mode": "absolute",
    "steps": [
      {"value": 0, "color": "green"},
      {"value": 80, "color": "yellow"},
      {"value": 100, "color": "red"}
    ]
  }
}
```

#### Value Mappings
```json
{
  "mappings": [
    {
      "type": "value",
      "options": {
        "0": {"text": "Down", "color": "red"},
        "1": {"text": "Up", "color": "green"}
      }
    }
  ]
}
```

#### Overrides
```json
{
  "overrides": [
    {
      "matcher": {"id": "byName", "options": "Series 1"},
      "properties": [
        {"id": "color", "value": {"mode": "fixed", "fixedColor": "blue"}}
      ]
    }
  ]
}
```

## Variables

### Query Variable
```
Name: instance
Type: Query
Data source: Prometheus
Query: label_values(up, instance)
Refresh: On Dashboard Load
```

**Usage in query:**
```promql
up{instance="$instance"}
```

### Custom Variable
```
Name: environment
Type: Custom
Values: production,staging,development
```

### Interval Variable
```
Name: interval
Type: Interval
Values: 1m,5m,10m,30m,1h
Auto: enabled
```

**Usage in query:**
```promql
rate(http_requests_total[$interval])
```

### Constant Variable
```
Name: threshold
Type: Constant
Value: 80
```

### Data Source Variable
```
Name: datasource
Type: Data source
Type: Prometheus
```

**Usage:**
Select data source: `${datasource}`

### Chained Variables
```
Variable 1:
Name: region
Query: label_values(up, region)

Variable 2:
Name: instance
Query: label_values(up{region="$region"}, instance)
```

### Multi-value Variables
Enable "Multi-value" option to select multiple values.

**Usage in query:**
```promql
up{instance=~"$instance"}
```

## Transformations

### Common Transformations

#### Filter by name
Filter series by name pattern.

#### Rename by regex
```
Regex: (.*)_total
Replace: $1
```

#### Organize fields
Reorder, hide, or rename fields.

#### Join by field
Combine data from multiple queries.

#### Add field from calculation
```
Mode: Reduce row
Calculation: Mean
Alias: average
```

#### Filter data by value
```
Match: All conditions
Condition: temperature > 30
```

#### Group by
```
Group by: hostname
Aggregation: Mean
```

### Transformation Example
```json
{
  "transformations": [
    {
      "id": "filterByName",
      "options": {
        "include": {
          "pattern": "^temp.*"
        }
      }
    },
    {
      "id": "organize",
      "options": {
        "excludeByName": {},
        "indexByName": {},
        "renameByName": {
          "temp_celsius": "Temperature (°C)"
        }
      }
    }
  ]
}
```

## Alerting

### Create Alert Rule

**Via UI:**
1. Panel → Alert tab
2. Create alert rule
3. Define query and conditions
4. Set evaluation interval
5. Configure notifications

**Alert Rule Example:**
```yaml
apiVersion: 1

groups:
  - orgId: 1
    name: my-alerts
    folder: alerts
    interval: 1m
    rules:
      - uid: alert1
        title: High CPU Usage
        condition: A
        data:
          - refId: A
            datasourceUid: prometheus-uid
            model:
              expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
              refId: A
        noDataState: NoData
        execErrState: Alerting
        for: 5m
        annotations:
          description: CPU usage is above 80%
        labels:
          severity: warning
```

### Notification Channels

#### Email
```yaml
apiVersion: 1

notifiers:
  - name: Email
    type: email
    uid: email1
    settings:
      addresses: admin@example.com;ops@example.com
```

#### Slack
```yaml
apiVersion: 1

contactPoints:
  - orgId: 1
    name: Slack
    receivers:
      - uid: slack1
        type: slack
        settings:
          url: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
          text: |
            {{ range .Alerts }}
            Alert: {{ .Labels.alertname }}
            Status: {{ .Status }}
            {{ end }}
```

#### PagerDuty
```yaml
apiVersion: 1

contactPoints:
  - orgId: 1
    name: PagerDuty
    receivers:
      - uid: pd1
        type: pagerduty
        settings:
          integrationKey: YOUR_INTEGRATION_KEY
```

#### Webhook
```yaml
apiVersion: 1

contactPoints:
  - orgId: 1
    name: Webhook
    receivers:
      - uid: webhook1
        type: webhook
        settings:
          url: https://api.example.com/alerts
          httpMethod: POST
```

### Notification Policy
```yaml
apiVersion: 1

policies:
  - orgId: 1
    receiver: default-email
    group_by: ['alertname', 'cluster']
    group_wait: 30s
    group_interval: 5m
    repeat_interval: 4h
    routes:
      - receiver: slack
        matchers:
          - severity = critical
      - receiver: pagerduty
        matchers:
          - severity = critical
          - team = ops
```

## Annotations

### Create Annotation
```json
{
  "dashboardId": 1,
  "panelId": 1,
  "time": 1609459200000,
  "text": "Deployment v2.0",
  "tags": ["deployment", "release"]
}
```

### Query Annotations from Prometheus
```
Data source: Prometheus
Query: ALERTS{alertname="InstanceDown"}
Title field: alertname
Text field: summary
Tags field: severity
```

## API Examples

### Authentication
```bash
# API key (recommended)
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:3000/api/...

# Basic auth
curl -u admin:password http://localhost:3000/api/...
```

### Create API Key
```bash
curl -X POST http://admin:admin@localhost:3000/api/auth/keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mykey",
    "role": "Admin"
  }'
```

### Get All Dashboards
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3000/api/search?type=dash-db
```

### Get Dashboard by UID
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3000/api/dashboards/uid/DASHBOARD_UID
```

### Create/Update Dashboard
```bash
curl -X POST http://localhost:3000/api/dashboards/db \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "dashboard": {
      "title": "My Dashboard",
      "panels": []
    },
    "overwrite": true
  }'
```

### Delete Dashboard
```bash
curl -X DELETE http://localhost:3000/api/dashboards/uid/DASHBOARD_UID \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Get Data Sources
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3000/api/datasources
```

### Create Data Source
```bash
curl -X POST http://localhost:3000/api/datasources \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prometheus",
    "type": "prometheus",
    "url": "http://prometheus:9090",
    "access": "proxy",
    "isDefault": true
  }'
```

### Query Data Source
```bash
curl -X POST http://localhost:3000/api/ds/query \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {
        "datasource": {"type": "prometheus"},
        "expr": "up",
        "refId": "A"
      }
    ],
    "from": "now-1h",
    "to": "now"
  }'
```

### Create Organization
```bash
curl -X POST http://localhost:3000/api/orgs \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Org"}'
```

### Create User
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "login": "john",
    "password": "password"
  }'
```

### Get Current User
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3000/api/user
```

### Create Snapshot
```bash
curl -X POST http://localhost:3000/api/snapshots \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "dashboard": {...},
    "name": "My Snapshot",
    "expires": 3600
  }'
```

## Provisioning

### Directory Structure
```
/etc/grafana/provisioning/
├── dashboards/
│   ├── dashboard.yml
│   └── my-dashboard.json
├── datasources/
│   └── datasource.yml
├── notifiers/
│   └── notifier.yml
└── alerting/
    ├── alert-rules.yml
    └── notification-policies.yml
```

### Complete Example

**datasources/prometheus.yml:**
```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

**dashboards/default.yml:**
```yaml
apiVersion: 1

providers:
  - name: 'Default'
    orgId: 1
    folder: ''
    type: file
    options:
      path: /var/lib/grafana/dashboards
```

## Best Practices

### Dashboard Design
- Use consistent time ranges
- Group related panels
- Use appropriate visualizations
- Add descriptions to panels
- Use template variables for flexibility
- Keep dashboards focused (single purpose)

### Performance
- Limit time ranges for heavy queries
- Use recording rules in Prometheus
- Avoid too many panels per dashboard (< 20)
- Use appropriate refresh intervals
- Cache query results when possible

### Organization
- Use folders to organize dashboards
- Tag dashboards appropriately
- Use naming conventions
- Document complex queries
- Version control dashboard JSON

### Security
- Use API keys instead of passwords
- Implement role-based access control
- Enable HTTPS
- Regular backups
- Update Grafana regularly

### Alerting
- Set appropriate thresholds
- Avoid alert fatigue (don't over-alert)
- Group related alerts
- Use meaningful alert names
- Include context in notifications
- Test alerts before production

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `g + h` | Go to home dashboard |
| `g + p` | Go to profile |
| `g + e` | Open explore |
| `s` | Open search |
| `f` | Open dashboard finder |
| `d + k` | Toggle kiosk mode |
| `d + e` | Expand all rows |
| `d + s` | Dashboard settings |
| `d + v` | Toggle in-active/active panel |
| `Ctrl + S` | Save dashboard |
| `Esc` | Exit panel edit/settings |
| `?` | Show keyboard shortcuts |

## Resources

- Official documentation: https://grafana.com/docs/
- Community dashboards: https://grafana.com/grafana/dashboards/
- Plugins: https://grafana.com/grafana/plugins/
- Tutorials: https://grafana.com/tutorials/
- Community forum: https://community.grafana.com/
- GitHub: https://github.com/grafana/grafana
