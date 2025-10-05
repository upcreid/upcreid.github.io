# K9s - Kubernetes CLI Manager

K9s is a terminal-based UI to interact with Kubernetes clusters, making it easier to navigate, observe, and manage deployed applications. It continuously watches Kubernetes for changes and offers commands to interact with resources.

## CLI Arguments

### Basic Commands
```bash
# Launch K9s
k9s

# Show help and available options
k9s help

# Get info about K9s runtime (logs, configs, etc.)
k9s info

# Run K9s in a specific namespace
k9s -n my-namespace

# Launch K9s directly in pod view
k9s -c pod

# Start K9s in a different context
k9s --context my-context

# Start K9s in readonly mode (no modifications allowed)
k9s --readonly
```

## Essential Key Bindings

### Navigation & Help
| Key | Action | Description |
|-----|--------|-------------|
| `?` | Show help | Display active keyboard shortcuts and help |
| `Ctrl+a` | Show aliases | List all available resource aliases |
| `:q` or `Ctrl+c` | Exit | Quit K9s |
| `Esc` | Back/Cancel | Exit current view/command/filter mode |

### Resource Navigation
| Command | Action | Example |
|---------|--------|---------|
| `:pod⏎` | View pods | Shows all pods (accepts singular/plural/short names) |
| `:deploy⏎` | View deployments | Shows all deployments |
| `:svc⏎` | View services | Shows all services |
| `:ns⏎` | View namespaces | Shows and allows switching namespaces |
| `:ctx⏎` | View contexts | Shows and allows switching contexts |

### Namespace & Context Operations
```bash
# View pods in specific namespace
:pod my-namespace⏎

# View pods with specific context
:pod @my-context⏎

# Switch to namespace and keep current view
:ns my-namespace⏎

# Switch to context and keep current view  
:ctx my-context⏎
```

### Filtering & Search
| Command | Action | Example |
|---------|--------|---------|
| `/filter⏎` | Filter resources | `/nginx⏎` shows resources containing "nginx" |
| `/!filter⏎` | Inverse filter | `/!system⏎` excludes resources containing "system" |
| `/-l label⏎` | Filter by labels | `/-l app=nginx⏎` |
| `/-f filter⏎` | Fuzzy search | `/-f web⏎` fuzzy finds "web" |

### Label-based Filtering
```bash
# View pods with specific labels
:pod app=nginx,env=prod⏎

# View pods in namespace with labels
:pod my-namespace app=web⏎

# Filter current view by labels
/-l app=nginx,tier=frontend⏎
```

## Resource Management

### Common Resource Actions
| Key | Action | Description |
|-----|--------|-------------|
| `d` | Describe | Show detailed resource information |
| `v` | View YAML | Display resource YAML definition |
| `e` | Edit | Edit resource (opens in $KUBE_EDITOR) |
| `l` | Logs | View container logs |
| `s` | Shell | Shell into container |
| `f` | Port-forward | Forward local port to pod |

### Resource Lifecycle
| Key | Action | Description |
|-----|--------|-------------|
| `Ctrl+d` | Delete | Delete resource (with confirmation) |
| `Ctrl+k` | Kill | Force delete resource (no confirmation) |
| `r` | Restart | Restart resource (deployments, etc.) |

### Advanced Views
| Command | Action | Description |
|---------|--------|-------------|
| `:pulses⏎` or `:pu⏎` | Pulses view | Cluster dashboard overview |
| `:xray pod⏎` | XRay view | Resource dependency visualization |
| `:screendump⏎` or `:sd⏎` | Screen dump | View saved resources |

## Configuration

### Main Config File
Location: `$XDG_CONFIG_HOME/k9s/config.yaml` (usually `~/.config/k9s/config.yaml`)

```yaml
# ~/.config/k9s/config.yaml
k9s:
  # UI refresh rate in seconds
  refreshRate: 2
  
  # Enable auto-refresh of resource views
  liveViewAutoRefresh: false
  
  # API server timeout
  apiServerTimeout: 15s
  
  # Max connection retries
  maxConnRetry: 5
  
  # Disable modification commands
  readOnly: false
  
  # Default view on startup
  defaultView: "pods"
  
  # Exit on Ctrl+C (false means use :quit command)
  noExitOnCtrlC: false
  
  # Port forward default address
  portForwardAddress: localhost
  
  ui:
    # Enable mouse support
    enableMouse: false
    
    # Hide header/logo/crumbs
    headless: false
    logoless: false
    crumbsless: false
    
    # Live update UI on config changes
    reactive: false
    
    # Disable icons for unsupported terminals
    noIcons: false
  
  # Skip version check
  skipLatestRevCheck: false
  
  # Logs configuration
  logger:
    # Number of log lines to show
    tail: 100
    # Total log buffer size
    buffer: 5000
    # How far back to look in seconds (-1 for tail)
    sinceSeconds: 300
    # Full screen logs
    fullScreen: false
    # Wrap long lines
    textWrap: false
    # Show timestamps
    showTime: false
  
  # Resource thresholds for alerts
  thresholds:
    cpu:
      critical: 90
      warn: 70
    memory:
      critical: 90
      warn: 70
```

### Context-Specific Configuration
Location: `$XDG_DATA_HOME/k9s/clusters/{cluster}/{context}/config.yaml`

```yaml
# Context-specific config
k9s:
  cluster: my-cluster
  readOnly: false
  skin: my_custom_skin
  
  namespace:
    active: default
    lockFavorites: false
    favorites:
      - all
      - kube-system
      - default
      - my-app
  
  view:
    active: pods
  
  featureGates:
    nodeShell: true
```

## Aliases

### Creating Custom Aliases
File: `$XDG_CONFIG_HOME/k9s/aliases.yaml`

```yaml
# ~/.config/k9s/aliases.yaml
aliases:
  # Resource aliases
  pp: v1/pods                          # Use :pp instead of :pods
  dep: apps/v1/deployments            # Use :dep instead of :deployments
  svc: v1/services                    # Use :svc instead of :services
  ing: networking.k8s.io/v1/ingresses # Use :ing instead of :ingresses
  
  # Custom resource aliases
  fred: acme.io/v1alpha1/fredericks   # Custom CRD alias
  
  # Command aliases with filters
  web-pods: pod default app=web                    # Pods with app=web label
  sys-pods: pod kube-system                       # All kube-system pods
  nginx-ing: ingress default app=nginx            # Nginx ingresses
  critical-pods: pod -l priority=critical         # High priority pods
```

### Using Aliases
```bash
# Use aliases in command mode
:pp⏎              # List pods
:dep⏎             # List deployments  
:web-pods⏎        # List web application pods
:sys-pods⏎        # List system pods
```

## HotKeys

### Creating Custom HotKeys
File: `$XDG_DATA_HOME/k9s/hotkeys.yaml`

```yaml
# ~/.local/share/k9s/hotkeys.yaml
hotKeys:
  # Quick navigation shortcuts
  shift-1:
    shortCut: Shift-1
    description: View all pods
    command: pods
  
  shift-2:
    shortCut: Shift-2
    description: View deployments
    command: deployments
  
  shift-3:
    shortCut: Shift-3
    description: View services
    command: services
  
  # Filtered views
  shift-w:
    shortCut: Shift-w
    description: Web application pods
    command: pods app=web
  
  shift-s:
    shortCut: Shift-s
    description: System pods
    command: pods kube-system
  
  # XRay views
  shift-x:
    shortCut: Shift-x
    description: XRay deployments
    command: xray deploy
  
  # Custom namespace shortcuts
  shift-p:
    shortCut: Shift-p
    description: Production namespace
    command: pods production
```

## Advanced Features

### XRay Views
```bash
# Visualize resource dependencies
:xray pod my-namespace⏎       # Pod dependencies
:xray svc⏎                    # Service dependencies  
:xray deploy⏎                 # Deployment dependencies
:xray sts⏎                    # StatefulSet dependencies
```

### Pulses Dashboard
```bash
# Launch cluster overview dashboard
:pulses⏎
:pu⏎
```

### Log Management
```bash
# View logs with different options
l                             # View logs (from resource view)
Ctrl+t                        # Toggle timestamp in logs
Ctrl+w                        # Toggle line wrap in logs
```

### Port Forwarding
```bash
# Forward ports (from pod view)
f                             # Start port forward
# Then specify: local_port:remote_port
8080:80                       # Forward local 8080 to pod port 80
```

### Shell Access
```bash
# Shell into containers
s                             # Shell into container
# Select container if multiple containers in pod
```

## Environment Variables

### Global Overrides
```bash
# Override default port forward address
export K9S_DEFAULT_PF_ADDRESS=127.0.0.1

# Override node shell feature globally
export K9S_FEATURE_GATE_NODE_SHELL=true

# Set custom config directory
export K9S_CONFIG_DIR=/path/to/config

# Set XDG directories
export XDG_CONFIG_HOME=$HOME/.config
export XDG_DATA_HOME=$HOME/.local/share
```

## Practical Examples

### Daily Workflow Examples

#### 1. Quick Pod Debugging
```bash
# Launch K9s in pod view
k9s -c pod

# Filter to problematic pods
/error⏎

# Describe a pod
d

# View logs
l

# Shell into container
s
```

#### 2. Deployment Management
```bash
# View deployments
:deploy⏎

# Filter by namespace
:deploy my-app⏎

# Scale deployment (edit and change replicas)
e

# Restart deployment
r

# View deployment logs
l
```

#### 3. Resource Monitoring
```bash
# Launch pulses for cluster overview
:pulses⏎

# Check resource usage
:top node⏎
:top pod⏎

# Filter high CPU usage
/-l cpu>80⏎
```

#### 4. Multi-Context Management
```bash
# Switch contexts
:ctx⏎
# Select context from list

# View contexts with direct switch
:ctx production⏎

# Launch in specific context
k9s --context staging
```

### Troubleshooting Workflows

#### 1. Find Failing Pods
```bash
# Filter by status
/Error⏎
/CrashLoop⏎
/Pending⏎

# Or use labels to find specific app pods
/-l app=myapp⏎

# Describe to see events
d

# Check logs for errors
l
```

#### 2. Resource Dependencies
```bash
# Use XRay to see dependencies
:xray pod my-namespace⏎

# Navigate through related resources
# Follow ingress -> service -> deployment -> pod chain
```

#### 3. Network Debugging
```bash
# View services
:svc⏎

# Check endpoints
:ep⏎

# View ingresses
:ing⏎

# Port forward for testing
f
# Test: curl localhost:8080
```

## Tips & Best Practices

### Performance Tips
- Use `liveViewAutoRefresh: false` for large clusters
- Adjust `refreshRate` based on cluster size
- Use filters to reduce displayed resources
- Enable `disablePodCounting` for very large clusters

### Security Tips
- Use `readOnly: true` for production environments
- Set context-specific readonly configs
- Use RBAC to limit K9s permissions
- Regularly audit your cluster access

### Customization Tips
- Create aliases for frequently used commands
- Set up hotkeys for common workflows
- Use custom skins for different environments
- Configure context-specific settings

### Efficiency Tips
- Learn regex patterns for complex filtering
- Use label selectors for precise filtering
- Master XRay views for dependency tracking
- Customize column views for important metrics

## Common Issues & Solutions

### Terminal Issues
```bash
# Fix color issues
export TERM=xterm-256color

# Fix editor issues
export KUBE_EDITOR=vim
```

### Permission Issues
```bash
# Check K9s permissions
k9s info

# Verify kubectl access
kubectl auth can-i --list
```

### Configuration Issues
```bash
# Check config location
k9s info

# Reset configuration
rm -rf ~/.config/k9s
rm -rf ~/.local/share/k9s
```

## Resources

- **Official Website**: https://k9scli.io/
- **GitHub Repository**: https://github.com/derailed/k9s
- **Community Slack**: [K9ers Slack](https://k9sers.slack.com/)
- **Documentation**: https://k9scli.io/topics/
- **Video Tutorials**: https://k9scli.io/topics/video/

---

*K9s makes Kubernetes cluster management intuitive and efficient through its terminal-based interface. Master these commands and configurations to significantly improve your Kubernetes workflow.*