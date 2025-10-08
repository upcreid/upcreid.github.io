# Prometheus Cheat Sheet

## Overview

Prometheus is an open-source monitoring and alerting toolkit designed for reliability and quick problem diagnosis.

**Key Features:**
- Multi-dimensional data model with time series
- Flexible PromQL query language
- Pull-based metrics collection
- Service discovery support
- No dependency on distributed storage
- Multiple modes of graphing and dashboarding

## Installation

### Docker
```bash
docker run -p 9090:9090 prom/prometheus
```

### Docker with custom config
```bash
docker run -p 9090:9090 \
  -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

### Binary
```bash
# Download from https://prometheus.io/download/
tar xvfz prometheus-*.tar.gz
cd prometheus-*
./prometheus --config.file=prometheus.yml
```

### Kubernetes (with Helm)
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/prometheus
```

## Configuration

### Basic prometheus.yml
```yaml
global:
  scrape_interval: 15s           # How often to scrape targets
  evaluation_interval: 15s       # How often to evaluate rules
  external_labels:
    cluster: 'production'        # Labels to attach to any time series

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']

# Rule files
rule_files:
  - "alert_rules.yml"
  - "recording_rules.yml"

# Scrape configurations
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

### Scrape Configuration Examples

#### Static targets
```yaml
scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets:
          - 'localhost:9100'
          - 'server1:9100'
          - 'server2:9100'
        labels:
          environment: 'production'
```

#### Custom metrics path
```yaml
scrape_configs:
  - job_name: 'app'
    metrics_path: '/custom/metrics'
    static_configs:
      - targets: ['app-server:8080']
```

#### With authentication
```yaml
scrape_configs:
  - job_name: 'secure-app'
    basic_auth:
      username: 'admin'
      password: 'secret'
    static_configs:
      - targets: ['secure-app:8080']
```

#### Kubernetes service discovery
```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: myapp
```

#### File-based service discovery
```yaml
scrape_configs:
  - job_name: 'dynamic-services'
    file_sd_configs:
      - files:
          - '/etc/prometheus/targets/*.json'
        refresh_interval: 30s
```

## Metric Types

### Counter
A cumulative metric that only increases.

```python
# Example: Total HTTP requests
http_requests_total{method="GET", endpoint="/api/users"} 1234
```

### Gauge
A metric that can go up and down.

```python
# Example: Current memory usage
memory_usage_bytes{instance="server1"} 524288000
```

### Histogram
Samples observations and counts them in configurable buckets.

```python
# Example: Request duration
http_request_duration_seconds_bucket{le="0.1"} 100
http_request_duration_seconds_bucket{le="0.5"} 250
http_request_duration_seconds_bucket{le="1.0"} 300
http_request_duration_seconds_sum 280.5
http_request_duration_seconds_count 300
```

### Summary
Similar to histogram but calculates quantiles on the client side.

```python
# Example: Request duration summary
http_request_duration_seconds{quantile="0.5"} 0.23
http_request_duration_seconds{quantile="0.9"} 0.87
http_request_duration_seconds{quantile="0.99"} 1.2
http_request_duration_seconds_sum 280.5
http_request_duration_seconds_count 300
```

## PromQL - Query Language

### Basic Selectors

#### Select all time series for a metric
```promql
http_requests_total
```

#### Filter by label
```promql
http_requests_total{job="prometheus"}
```

#### Multiple label filters
```promql
http_requests_total{job="api", method="GET", status="200"}
```

#### Label matching operators
```promql
# Equality
http_requests_total{job="api"}

# Inequality
http_requests_total{job!="api"}

# Regex match
http_requests_total{job=~"api.*"}

# Regex non-match
http_requests_total{job!~"test.*"}
```

### Range Vectors

```promql
# Last 5 minutes
http_requests_total[5m]

# Last 1 hour
http_requests_total[1h]

# Time units: s (seconds), m (minutes), h (hours), d (days), w (weeks), y (years)
```

### Offset Modifier

```promql
# Current value
http_requests_total

# Value from 5 minutes ago
http_requests_total offset 5m

# Range from 1 hour ago
http_requests_total[5m] offset 1h
```

### Operators

#### Arithmetic operators
```promql
# Addition
node_memory_total_bytes + node_memory_cached_bytes

# Subtraction
node_memory_total_bytes - node_memory_used_bytes

# Multiplication
rate(http_requests_total[5m]) * 60

# Division
node_memory_used_bytes / node_memory_total_bytes * 100

# Modulo
node_cpu_seconds_total % 100

# Power
node_memory_bytes ^ 2
```

#### Comparison operators
```promql
# Equal
http_requests_total == 100

# Not equal
http_requests_total != 100

# Greater than
http_requests_total > 100

# Less than
http_requests_total < 100

# Greater or equal
http_requests_total >= 100

# Less or equal
http_requests_total <= 100
```

#### Logical operators
```promql
# AND
(http_requests_total > 100) and (http_errors_total > 10)

# OR
(http_requests_total > 100) or (http_errors_total > 10)

# UNLESS (exclude)
http_requests_total unless http_errors_total
```

### Aggregation Operators

#### sum
```promql
# Total requests across all instances
sum(http_requests_total)

# Sum by job
sum(http_requests_total) by (job)

# Sum without specific labels
sum(http_requests_total) without (instance)
```

#### avg
```promql
# Average CPU usage
avg(cpu_usage_percent)

# Average by environment
avg(cpu_usage_percent) by (environment)
```

#### min / max
```promql
# Minimum memory across instances
min(node_memory_available_bytes)

# Maximum response time
max(http_request_duration_seconds)
```

#### count
```promql
# Number of instances
count(up)

# Number of instances by job
count(up) by (job)
```

#### stddev / stdvar
```promql
# Standard deviation of response time
stddev(http_request_duration_seconds)

# Standard variance
stdvar(http_request_duration_seconds)
```

#### topk / bottomk
```promql
# Top 5 instances by CPU usage
topk(5, cpu_usage_percent)

# Bottom 3 instances by memory
bottomk(3, node_memory_available_bytes)
```

#### quantile
```promql
# 95th percentile response time
quantile(0.95, http_request_duration_seconds)

# 50th percentile (median) by service
quantile(0.5, http_request_duration_seconds) by (service)
```

### Functions

#### rate()
Calculate per-second rate (for counters).

```promql
# Requests per second over last 5 minutes
rate(http_requests_total[5m])

# Network bytes received per second
rate(node_network_receive_bytes_total[1m])
```

#### irate()
Calculate instant rate (using last two points).

```promql
# Instant requests per second
irate(http_requests_total[5m])
```

#### increase()
Calculate increase over time range.

```promql
# Total increase in requests over 1 hour
increase(http_requests_total[1h])
```

#### delta()
Calculate difference between first and last value.

```promql
# Change in CPU temperature
delta(cpu_temperature_celsius[10m])
```

#### deriv()
Calculate per-second derivative.

```promql
# Rate of change in memory usage
deriv(node_memory_used_bytes[5m])
```

#### predict_linear()
Predict future value using linear regression.

```promql
# Predict disk usage in 4 hours
predict_linear(node_filesystem_free_bytes[1h], 4*3600)
```

#### histogram_quantile()
Calculate quantile from histogram.

```promql
# 95th percentile request duration
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# 50th percentile by service
histogram_quantile(0.5, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))
```

#### abs()
Absolute value.

```promql
abs(delta(metric[5m]))
```

#### ceil() / floor() / round()
Rounding functions.

```promql
# Round up
ceil(node_memory_used_bytes / 1024 / 1024)

# Round down
floor(cpu_usage_percent)

# Round to nearest
round(response_time_seconds, 0.1)
```

#### clamp_max() / clamp_min()
Limit values to a range.

```promql
# Cap at maximum of 100
clamp_max(cpu_usage_percent, 100)

# Ensure minimum of 0
clamp_min(available_connections, 0)
```

#### sort() / sort_desc()
Sort results.

```promql
# Sort ascending
sort(http_requests_total)

# Sort descending
sort_desc(http_requests_total)
```

#### time()
Current Unix timestamp.

```promql
# Seconds since metric was last updated
time() - timestamp(metric)
```

#### label_replace()
Add or modify labels.

```promql
# Add new label based on existing label
label_replace(up, "env", "$1", "instance", "(.*):(.*)")
```

#### label_join()
Join multiple labels into one.

```promql
# Combine labels
label_join(up, "full_instance", "-", "instance", "job")
```

## Common Query Examples

### HTTP/API Metrics

```promql
# Request rate by status code
sum(rate(http_requests_total[5m])) by (status_code)

# Error rate (4xx and 5xx)
sum(rate(http_requests_total{status_code=~"4..|5.."}[5m]))

# Error percentage
sum(rate(http_requests_total{status_code=~"4..|5.."}[5m]))
/
sum(rate(http_requests_total[5m])) * 100

# 95th percentile latency
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# Requests per minute
sum(rate(http_requests_total[1m])) * 60
```

### System Metrics

```promql
# CPU usage percentage
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage percentage
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disk usage percentage
(1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100

# Network traffic (bytes/sec)
rate(node_network_receive_bytes_total[5m])
rate(node_network_transmit_bytes_total[5m])

# Load average
node_load1
node_load5
node_load15
```

### Database Metrics

```promql
# MySQL queries per second
rate(mysql_global_status_queries[5m])

# PostgreSQL active connections
pg_stat_activity_count

# Redis memory usage
redis_memory_used_bytes / redis_memory_max_bytes * 100

# Slow queries
rate(mysql_global_status_slow_queries[5m])
```

### Container Metrics

```promql
# Container CPU usage
rate(container_cpu_usage_seconds_total[5m])

# Container memory usage
container_memory_usage_bytes

# Container network traffic
rate(container_network_receive_bytes_total[5m])
rate(container_network_transmit_bytes_total[5m])
```

### Availability & Uptime

```promql
# Instance up/down
up

# Instances down
count(up == 0)

# Uptime percentage (last 24h)
avg_over_time(up[24h]) * 100
```

## Alerting Rules

### Alert Rule File (alert_rules.yml)

```yaml
groups:
  - name: example
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status_code=~"5.."}[5m]))
          /
          sum(rate(http_requests_total[5m])) > 0.05
        for: 10m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} on {{ $labels.instance }}"

      - alert: InstanceDown
        expr: up == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Instance {{ $labels.instance }} down"
          description: "{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 5 minutes."

      - alert: HighMemoryUsage
        expr: |
          (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 90
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage is {{ $value | humanize }}% on {{ $labels.instance }}"

      - alert: DiskSpaceLow
        expr: |
          (1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100 > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Disk space low on {{ $labels.instance }}"
          description: "Disk {{ $labels.mountpoint }} is {{ $value | humanize }}% full"

      - alert: HighCPUUsage
        expr: |
          100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU usage is {{ $value | humanize }}%"
```

## Recording Rules

### Recording Rule File (recording_rules.yml)

```yaml
groups:
  - name: performance
    interval: 30s
    rules:
      # Pre-calculate request rate
      - record: job:http_requests:rate5m
        expr: sum(rate(http_requests_total[5m])) by (job)

      # Pre-calculate error rate
      - record: job:http_errors:rate5m
        expr: sum(rate(http_requests_total{status_code=~"5.."}[5m])) by (job)

      # Pre-calculate error percentage
      - record: job:http_error_percentage:rate5m
        expr: |
          job:http_errors:rate5m
          /
          job:http_requests:rate5m * 100

      # Pre-calculate CPU usage
      - record: instance:node_cpu:usage
        expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance) * 100)

      # Pre-calculate memory usage percentage
      - record: instance:node_memory:usage_percent
        expr: |
          (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

## Common Exporters

### Node Exporter
Exports hardware and OS metrics.

```bash
# Docker
docker run -d -p 9100:9100 \
  --name node-exporter \
  -v "/proc:/host/proc:ro" \
  -v "/sys:/host/sys:ro" \
  -v "/:/rootfs:ro" \
  prom/node-exporter \
  --path.procfs=/host/proc \
  --path.sysfs=/host/sys
```

**Common metrics:**
- `node_cpu_seconds_total`
- `node_memory_MemTotal_bytes`
- `node_memory_MemAvailable_bytes`
- `node_filesystem_size_bytes`
- `node_network_receive_bytes_total`

### Blackbox Exporter
Probes endpoints (HTTP, TCP, DNS, ICMP).

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'blackbox'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
          - https://example.com
          - https://api.example.com
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter:9115
```

### MySQL Exporter
```bash
docker run -d -p 9104:9104 \
  -e DATA_SOURCE_NAME="user:password@(mysql:3306)/" \
  prom/mysqld-exporter
```

### PostgreSQL Exporter
```bash
docker run -d -p 9187:9187 \
  -e DATA_SOURCE_NAME="postgresql://user:password@postgres:5432/database?sslmode=disable" \
  prometheuscommunity/postgres-exporter
```

### Redis Exporter
```bash
docker run -d -p 9121:9121 \
  oliver006/redis_exporter \
  --redis.addr=redis://redis:6379
```

## HTTP API

### Query API

```bash
# Instant query
curl 'http://localhost:9090/api/v1/query?query=up'

# Range query
curl 'http://localhost:9090/api/v1/query_range?query=up&start=2024-01-01T00:00:00Z&end=2024-01-01T01:00:00Z&step=15s'

# Query with time parameter
curl 'http://localhost:9090/api/v1/query?query=up&time=2024-01-01T12:00:00Z'
```

### Metadata API

```bash
# List all metric names
curl 'http://localhost:9090/api/v1/label/__name__/values'

# Get label values
curl 'http://localhost:9090/api/v1/label/job/values'

# Get series
curl 'http://localhost:9090/api/v1/series?match[]=up'

# Get targets
curl 'http://localhost:9090/api/v1/targets'

# Get alertmanagers
curl 'http://localhost:9090/api/v1/alertmanagers'

# Get rules
curl 'http://localhost:9090/api/v1/rules'
```

### Admin API

```bash
# Reload configuration
curl -X POST http://localhost:9090/-/reload

# Quit Prometheus
curl -X POST http://localhost:9090/-/quit

# Health check
curl http://localhost:9090/-/healthy

# Ready check
curl http://localhost:9090/-/ready
```

## Command Line Flags

```bash
# Custom config file
prometheus --config.file=/path/to/prometheus.yml

# Custom storage path
prometheus --storage.tsdb.path=/data

# Custom port
prometheus --web.listen-address=:9091

# Enable admin API
prometheus --web.enable-admin-api

# Enable lifecycle API (reload)
prometheus --web.enable-lifecycle

# Log level
prometheus --log.level=debug

# Retention time
prometheus --storage.tsdb.retention.time=30d

# Retention size
prometheus --storage.tsdb.retention.size=50GB
```

## Best Practices

### Naming Conventions

```promql
# Counter: Use _total suffix
http_requests_total
errors_total

# Gauge: Use descriptive name
current_connections
memory_usage_bytes

# Histogram: Use _bucket, _sum, _count
http_request_duration_seconds_bucket
http_request_duration_seconds_sum
http_request_duration_seconds_count

# Use base units
- seconds (not milliseconds)
- bytes (not kilobytes)
- ratio 0-1 (not percentage)
```

### Label Best Practices

```yaml
# Good labels
http_requests_total{method="GET", status="200", endpoint="/api/users"}

# Avoid high cardinality labels
# Bad: user_id, request_id, timestamp
# Good: method, status, endpoint, service

# Use consistent label names
instance, job, environment, region
```

### Query Optimization

```promql
# Use recording rules for expensive queries
# Pre-calculate aggregations
# Avoid regex when possible

# Good
http_requests_total{job="api"}

# Less efficient
http_requests_total{job=~"api"}

# Use appropriate time ranges
rate(metric[5m])  # Good for most cases
rate(metric[1h])  # For long-term trends
```

## Resources

- Official documentation: https://prometheus.io/docs/
- PromQL guide: https://prometheus.io/docs/prometheus/latest/querying/basics/
- Exporters list: https://prometheus.io/docs/instrumenting/exporters/
- Best practices: https://prometheus.io/docs/practices/naming/
- Community: https://prometheus.io/community/
