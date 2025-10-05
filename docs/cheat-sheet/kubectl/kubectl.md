# kubectl - Kubernetes Command Line Tool

kubectl est l'outil en ligne de commande pour communiquer avec le plan de contrôle d'un cluster Kubernetes via l'API Kubernetes. C'est l'interface principale pour déployer des applications, inspecter et gérer les ressources de cluster, et consulter les logs.

## Installation

### macOS
```bash
# Via Homebrew
brew install kubectl

# Via MacPorts
sudo port install kubectl

# Téléchargement direct
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y kubectl

# CentOS/RHEL/Fedora
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.31/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.31/rpm/repodata/repomd.xml.key
EOF
sudo yum install -y kubectl

# Téléchargement direct
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

### Windows
```powershell
# Via Chocolatey
choco install kubernetes-cli

# Via Scoop
scoop install kubectl

# Téléchargement direct
curl.exe -LO "https://dl.k8s.io/release/v1.31.0/bin/windows/amd64/kubectl.exe"
```

## Configuration Initiale

### Configuration de Base
```bash
# Vérifier l'installation
kubectl version --client

# Obtenir des informations sur le cluster
kubectl cluster-info

# Configurer l'autocomplétion Bash
source <(kubectl completion bash)
echo "source <(kubectl completion bash)" >> ~/.bashrc

# Configurer l'autocomplétion Zsh
source <(kubectl completion zsh)
echo '[[ $commands[kubectl] ]] && source <(kubectl completion zsh)' >> ~/.zshrc

# Alias utile
alias k=kubectl
complete -o default -F __start_kubectl k
```

### Configuration kubeconfig
```bash
# Voir la configuration actuelle
kubectl config view

# Voir la configuration avec les secrets
kubectl config view --raw

# Lister les contextes disponibles
kubectl config get-contexts

# Voir le contexte actuel
kubectl config current-context

# Changer de contexte
kubectl config use-context my-cluster

# Définir le namespace par défaut pour le contexte actuel
kubectl config set-context --current --namespace=my-namespace

# Créer un nouveau contexte
kubectl config set-context dev --user=developer --cluster=dev-cluster --namespace=development
```

## Syntaxe de Base

### Structure des Commandes
```bash
kubectl [command] [TYPE] [NAME] [flags]

# Exemples
kubectl get pods                    # Lister tous les pods
kubectl get pod my-pod             # Obtenir un pod spécifique
kubectl get pods,services          # Lister plusieurs types de ressources
kubectl get pods -o wide           # Sortie détaillée
```

### Raccourcis Importants
```bash
# --all-namespaces peut être abrégé
kubectl get pods -A                # Équivalent à --all-namespaces

# Types de ressources avec raccourcis
kubectl get po                     # pods
kubectl get svc                    # services
kubectl get deploy                 # deployments
kubectl get rs                     # replicasets
kubectl get ds                     # daemonsets
kubectl get sts                    # statefulsets
kubectl get ing                    # ingresses
kubectl get cm                     # configmaps
kubectl get ns                     # namespaces
kubectl get no                     # nodes
```

## Gestion des Ressources

### Création de Ressources
```bash
# Créer depuis un fichier
kubectl apply -f deployment.yaml
kubectl apply -f ./manifests/
kubectl apply -f https://example.com/manifest.yaml

# Créer depuis plusieurs fichiers
kubectl apply -f app.yaml -f service.yaml

# Créer impérativement
kubectl create deployment nginx --image=nginx:1.21
kubectl create service clusterip my-service --tcp=80:8080
kubectl create configmap my-config --from-literal=key1=value1
kubectl create secret generic my-secret --from-literal=password=secret123

# Créer un Job
kubectl create job hello --image=busybox:1.28 -- echo "Hello World"

# Créer un CronJob
kubectl create cronjob hello --image=busybox:1.28 --schedule="*/1 * * * *" -- echo "Hello World"

# Génération de YAML sans créer
kubectl create deployment nginx --image=nginx --dry-run=client -o yaml > deployment.yaml
kubectl run test-pod --image=busybox --dry-run=client -o yaml > pod.yaml
```

### Consultation de Ressources
```bash
# Lister les ressources
kubectl get pods
kubectl get pods -o wide
kubectl get pods --show-labels
kubectl get pods -l app=nginx
kubectl get pods --field-selector=status.phase=Running

# Trier les résultats
kubectl get pods --sort-by=.metadata.name
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'
kubectl get pv --sort-by=.spec.capacity.storage

# Affichage personnalisé
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase
kubectl get nodes -o custom-columns='NODE:.metadata.name,CPU:.status.capacity.cpu,MEMORY:.status.capacity.memory'

# Formats de sortie
kubectl get pod my-pod -o yaml
kubectl get pod my-pod -o json
kubectl get pods -o name
kubectl get pods -o wide

# Surveillance en temps réel
kubectl get pods -w
kubectl get events -w
```

### Description Détaillée
```bash
# Décrire des ressources
kubectl describe node my-node
kubectl describe pod my-pod
kubectl describe deployment my-deployment
kubectl describe service my-service

# Obtenir des logs
kubectl logs my-pod
kubectl logs my-pod -c my-container          # Multi-conteneur
kubectl logs -f my-pod                       # Suivi en temps réel
kubectl logs --previous my-pod               # Logs de l'instance précédente
kubectl logs -l app=nginx                    # Logs par label
kubectl logs deploy/my-deployment            # Logs d'un déploiement
```

## Interaction avec les Pods

### Exécution de Commandes
```bash
# Exécuter une commande dans un pod
kubectl exec my-pod -- date
kubectl exec my-pod -c my-container -- ls /app

# Shell interactif
kubectl exec -it my-pod -- /bin/bash
kubectl exec -it my-pod -c my-container -- /bin/sh

# Créer un pod temporaire pour debug
kubectl run debug --image=busybox:1.28 -it --rm -- sh
kubectl run test --image=curlimages/curl -it --rm -- sh

# Debug d'un pod existant
kubectl debug my-pod -it --image=busybox:1.28
kubectl debug node/my-node -it --image=busybox:1.28
```

### Transfert de Fichiers
```bash
# Copier des fichiers vers/depuis un pod
kubectl cp /local/file my-pod:/remote/file
kubectl cp my-pod:/remote/file /local/file
kubectl cp /local/dir my-pod:/remote/dir
kubectl cp my-namespace/my-pod:/remote/file /local/file

# Avec conteneur spécifique
kubectl cp /local/file my-pod:/remote/file -c my-container

# Méthode alternative avec tar
tar cf - /local/dir | kubectl exec -i my-pod -- tar xf - -C /remote/
kubectl exec my-pod -- tar cf - /remote/dir | tar xf - -C /local/
```

### Port Forwarding
```bash
# Redirection de port simple
kubectl port-forward pod/my-pod 8080:80

# Redirection depuis un service
kubectl port-forward service/my-service 8080:80
kubectl port-forward svc/my-service 8080:my-service-port

# Redirection depuis un déploiement
kubectl port-forward deployment/my-deployment 8080:80

# Écouter sur toutes les interfaces
kubectl port-forward --address 0.0.0.0 pod/my-pod 8080:80

# Multiple ports
kubectl port-forward pod/my-pod 8080:80 9090:90
```

## Mise à Jour de Ressources

### Mise à Jour Déclarative
```bash
# Appliquer des changements
kubectl apply -f updated-deployment.yaml

# Édition directe
kubectl edit deployment my-deployment
kubectl edit pod my-pod
KUBE_EDITOR="nano" kubectl edit svc/my-service

# Mise à jour d'image
kubectl set image deployment/my-deployment container=nginx:1.22
kubectl set image pod/my-pod container=nginx:1.22

# Gestion des rollouts
kubectl rollout status deployment/my-deployment
kubectl rollout history deployment/my-deployment
kubectl rollout undo deployment/my-deployment
kubectl rollout undo deployment/my-deployment --to-revision=2
kubectl rollout restart deployment/my-deployment
```

### Mise à Jour Impérative avec Patch
```bash
# Patch JSON
kubectl patch pod my-pod -p '{"spec":{"containers":[{"name":"app","image":"nginx:1.22"}]}}'

# Patch JSON avec positional arrays
kubectl patch pod my-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"nginx:1.22"}]'

# Patch de noeud
kubectl patch node my-node -p '{"spec":{"unschedulable":true}}'

# Patch de scaling
kubectl patch deployment my-deployment -p '{"spec":{"replicas":5}}'
kubectl patch deployment my-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":3}}'
```

### Labels et Annotations
```bash
# Ajouter des labels
kubectl label pods my-pod environment=production
kubectl label pods my-pod tier=frontend
kubectl label nodes my-node disk=ssd

# Supprimer des labels
kubectl label pods my-pod environment-
kubectl label nodes my-node disk-

# Modifier des labels existants
kubectl label pods my-pod environment=staging --overwrite

# Ajouter des annotations
kubectl annotate pods my-pod description="My important pod"
kubectl annotate pods my-pod contact="admin@example.com"

# Supprimer des annotations
kubectl annotate pods my-pod description-
```

## Scaling et Autoscaling

### Scaling Manuel
```bash
# Scaler un déploiement
kubectl scale deployment my-deployment --replicas=5
kubectl scale --replicas=3 deployment/my-deployment

# Scaler depuis un fichier
kubectl scale --replicas=3 -f deployment.yaml

# Scaling conditionnel
kubectl scale --current-replicas=2 --replicas=3 deployment/my-deployment

# Scaler plusieurs ressources
kubectl scale --replicas=5 rc/foo rc/bar rc/baz
```

### Autoscaling
```bash
# Créer un HPA
kubectl autoscale deployment my-deployment --min=2 --max=10 --cpu-percent=80

# HPA avec métriques personnalisées
kubectl apply -f - <<EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 70
EOF

# Voir le statut HPA
kubectl get hpa
kubectl describe hpa my-hpa
```

## Suppression de Ressources

### Suppression Basique
```bash
# Supprimer depuis un fichier
kubectl delete -f deployment.yaml
kubectl delete -f ./manifests/

# Supprimer par nom
kubectl delete pod my-pod
kubectl delete deployment my-deployment
kubectl delete service my-service

# Supprimer plusieurs ressources
kubectl delete pod,service my-app
kubectl delete pods pod1 pod2 pod3

# Suppression immédiate
kubectl delete pod my-pod --now
kubectl delete pod my-pod --grace-period=0 --force
```

### Suppression par Sélecteurs
```bash
# Supprimer par labels
kubectl delete pods -l app=nginx
kubectl delete all -l app=my-app
kubectl delete pods,services -l environment=test

# Supprimer tous les pods dans un namespace
kubectl delete pods --all -n my-namespace
kubectl delete all --all -n my-namespace

# Supprimer avec pattern
kubectl get pods --no-headers=true | awk '/error|failed/{print $1}' | xargs kubectl delete pod
```

## Gestion des Namespaces

### Opérations sur les Namespaces
```bash
# Lister les namespaces
kubectl get namespaces
kubectl get ns

# Créer un namespace
kubectl create namespace development
kubectl create ns production

# Supprimer un namespace
kubectl delete namespace development

# Travailler dans un namespace spécifique
kubectl get pods -n kube-system
kubectl get all -n my-namespace

# Voir les ressources dans tous les namespaces
kubectl get pods -A
kubectl get events -A --sort-by=.metadata.creationTimestamp
```

### Configuration de Namespace par Défaut
```bash
# Changer le namespace par défaut
kubectl config set-context --current --namespace=my-namespace

# Alias pour changer rapidement de namespace
alias kn='f() { [ "$1" ] && kubectl config set-context --current --namespace $1 || kubectl config view --minify | grep namespace | cut -d" " -f6 ; } ; f'

# Utiliser kn
kn development      # Changer vers development
kn                  # Voir le namespace actuel
```

## Gestion des Noeuds et du Cluster

### Informations sur le Cluster
```bash
# Informations générales
kubectl cluster-info
kubectl cluster-info dump
kubectl version

# Informations sur les noeuds
kubectl get nodes
kubectl get nodes -o wide
kubectl describe node my-node
kubectl top node
kubectl top node my-node
```

### Maintenance des Noeuds
```bash
# Marquer un noeud comme non-planifiable
kubectl cordon my-node

# Drainer un noeud (évacuer les pods)
kubectl drain my-node
kubectl drain my-node --ignore-daemonsets
kubectl drain my-node --force --delete-emptydir-data

# Remarquer un noeud comme planifiable
kubectl uncordon my-node

# Ajouter des taints
kubectl taint nodes my-node key=value:NoSchedule
kubectl taint nodes my-node key=value:NoExecute
kubectl taint nodes my-node dedicated=special-user:NoSchedule

# Supprimer des taints
kubectl taint nodes my-node key:NoSchedule-
kubectl taint nodes my-node dedicated-

# Voir les taints
kubectl get nodes -o custom-columns='NODE:.metadata.name,TAINTS:.spec.taints[*].key'
```

## Débogage et Monitoring

### Débogage de Pods
```bash
# Vérifier l'état des pods
kubectl get pods
kubectl get pods --field-selector=status.phase=Failed
kubectl get pods --field-selector=status.phase=Pending

# Diagnostiquer les problèmes
kubectl describe pod my-pod
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl get events --field-selector involvedObject.name=my-pod

# Logs de débogage
kubectl logs my-pod --previous
kubectl logs my-pod -c init-container
kubectl logs -f deployment/my-deployment
kubectl logs -l app=nginx --tail=100
```

### Surveillance des Ressources
```bash
# Métriques de ressources
kubectl top pods
kubectl top pods --sort-by=cpu
kubectl top pods --sort-by=memory
kubectl top pods -l app=nginx

# Métriques par namespace
kubectl top pods -n kube-system
kubectl top nodes

# Événements
kubectl get events
kubectl get events -w
kubectl get events --types=Warning
```

### Debug de Réseau
```bash
# Vérifier les services
kubectl get svc
kubectl get endpoints
kubectl describe service my-service

# Tester la connectivité
kubectl run test-pod --image=busybox -it --rm -- nslookup my-service
kubectl run test-pod --image=curlimages/curl -it --rm -- curl http://my-service

# Vérifier les ingresses
kubectl get ingress
kubectl describe ingress my-ingress

# Vérifier les NetworkPolicies
kubectl get networkpolicy
kubectl describe networkpolicy my-policy
```

## Sécurité et RBAC

### Vérification des Permissions
```bash
# Vérifier ses propres permissions
kubectl auth can-i create pods
kubectl auth can-i delete pods --namespace=production
kubectl auth can-i "*" "*"
kubectl auth can-i list secrets --as=system:serviceaccount:default:my-sa

# Lister toutes les permissions
kubectl auth can-i --list
kubectl auth can-i --list --as=system:serviceaccount:default:my-sa

# Vérifier les permissions d'un utilisateur
kubectl auth can-i create pods --as=john@example.com
```

### Gestion RBAC
```bash
# Voir les rôles et bindings
kubectl get roles
kubectl get rolebindings
kubectl get clusterroles
kubectl get clusterrolebindings

# Décrire un rôle
kubectl describe clusterrole cluster-admin
kubectl describe role my-role -n my-namespace

# Créer un rôle
kubectl create role pod-reader --verb=get,list,watch --resource=pods
kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods

# Créer un rolebinding
kubectl create rolebinding my-binding --role=pod-reader --user=john@example.com
kubectl create clusterrolebinding my-cluster-binding --clusterrole=cluster-admin --user=admin@example.com
```

### Gestion des Secrets et ConfigMaps
```bash
# Créer des secrets
kubectl create secret generic my-secret --from-literal=username=admin --from-literal=password=secret123
kubectl create secret generic my-secret --from-file=ssh-privatekey=~/.ssh/id_rsa
kubectl create secret tls my-tls-secret --cert=tls.crt --key=tls.key

# Voir les secrets (décodés)
kubectl get secret my-secret -o go-template='{{range $k,$v := .data}}{{printf "%s: " $k}}{{$v|base64decode}}{{"\n"}}{{end}}'

# Créer des ConfigMaps
kubectl create configmap my-config --from-literal=key1=value1 --from-literal=key2=value2
kubectl create configmap my-config --from-file=config.properties
kubectl create configmap my-config --from-file=configs/

# Voir les ConfigMaps
kubectl get configmap my-config -o yaml
```

## Filtrage et Recherche Avancée

### Sélecteurs de Labels
```bash
# Sélection basique
kubectl get pods -l app=nginx
kubectl get pods -l app=nginx,version=v1
kubectl get pods -l 'app in (nginx,apache)'
kubectl get pods -l 'environment notin (production)'

# Opérateurs
kubectl get pods -l app!=nginx
kubectl get pods -l version
kubectl get pods -l '!version'

# Sélecteurs complexes
kubectl get pods -l 'app=nginx,environment in (dev,test),version!=v1'
```

### Field Selectors
```bash
# Sélection par champs
kubectl get pods --field-selector=status.phase=Running
kubectl get pods --field-selector=spec.nodeName=my-node
kubectl get services --field-selector=metadata.namespace=default
kubectl get events --field-selector=involvedObject.kind=Pod

# Combinaisons
kubectl get pods --field-selector=status.phase=Running,spec.nodeName=my-node
```

### JSONPath et Expressions
```bash
# Extraire des valeurs spécifiques
kubectl get pods -o jsonpath='{.items[*].metadata.name}'
kubectl get pods -o jsonpath='{.items[*].status.podIP}'
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# Templates complexes
kubectl get pods -o custom-columns='NAME:.metadata.name,IMAGE:.spec.containers[*].image,NODE:.spec.nodeName'

# Conditions
kubectl get pods -o jsonpath='{.items[?(@.status.phase=="Running")].metadata.name}'
```

## Exemples Pratiques Complets

### Déploiement d'une Application Complète
```bash
# 1. Créer un namespace
kubectl create namespace my-app

# 2. Créer un secret pour la base de données
kubectl create secret generic db-secret \
  --from-literal=username=dbuser \
  --from-literal=password=dbpass123 \
  -n my-app

# 3. Créer une ConfigMap
kubectl create configmap app-config \
  --from-literal=database_url=postgresql://db:5432/myapp \
  --from-literal=debug=true \
  -n my-app

# 4. Déployer l'application
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web
        image: nginx:1.21
        ports:
        - containerPort: 80
        env:
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: username
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: database_url
EOF

# 5. Créer un service
kubectl expose deployment web-app --port=80 --target-port=80 -n my-app

# 6. Vérifier le déploiement
kubectl get all -n my-app
kubectl rollout status deployment/web-app -n my-app
```

### Débogage d'une Application qui Ne Fonctionne Pas
```bash
# 1. Vérifier l'état général
kubectl get pods -n my-app
kubectl get events -n my-app --sort-by=.metadata.creationTimestamp

# 2. Inspecter le pod problématique
POD_NAME=$(kubectl get pods -n my-app -l app=web-app -o jsonpath='{.items[0].metadata.name}')
kubectl describe pod $POD_NAME -n my-app

# 3. Vérifier les logs
kubectl logs $POD_NAME -n my-app
kubectl logs $POD_NAME -n my-app --previous

# 4. Tester la connectivité
kubectl run debug --image=busybox -it --rm -n my-app -- nslookup web-app
kubectl run debug --image=curlimages/curl -it --rm -n my-app -- curl http://web-app

# 5. Vérifier les ressources
kubectl top pods -n my-app
kubectl describe node $(kubectl get pod $POD_NAME -n my-app -o jsonpath='{.spec.nodeName}')
```

### Migration et Sauvegarde
```bash
# Sauvegarder toutes les ressources d'un namespace
kubectl get all -o yaml -n my-app > backup-my-app.yaml

# Sauvegarder des ressources spécifiques
kubectl get configmaps,secrets -o yaml -n my-app > config-backup.yaml

# Exporter pour migration (sans statut)
kubectl get deployment web-app -n my-app -o yaml --export > web-app-deployment.yaml

# Restaurer depuis la sauvegarde
kubectl apply -f backup-my-app.yaml
```

## Options de Sortie et Formatage

### Formats de Sortie
```bash
# YAML
kubectl get pod my-pod -o yaml

# JSON
kubectl get pod my-pod -o json

# Large (avec plus d'informations)
kubectl get pods -o wide

# Noms seulement
kubectl get pods -o name

# Templates personnalisés
kubectl get pods -o custom-columns='NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName'

# Go templates
kubectl get pods -o go-template='{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}'
```

### Verbosité et Debug
```bash
# Niveaux de verbosité
kubectl get pods -v=0    # Sortie normale
kubectl get pods -v=1    # Informations de base
kubectl get pods -v=2    # Informations détaillées
kubectl get pods -v=6    # Affiche les requêtes HTTP
kubectl get pods -v=7    # Affiche les headers HTTP
kubectl get pods -v=8    # Affiche le contenu des requêtes
kubectl get pods -v=9    # Affiche le contenu complet
```

## Plugins et Extensions

### Installation de Plugins
```bash
# Installer krew (gestionnaire de plugins)
(
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew
)

# Ajouter krew au PATH
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"

# Installer des plugins utiles
kubectl krew install ctx        # Changer de contexte rapidement
kubectl krew install ns         # Changer de namespace rapidement
kubectl krew install tree       # Voir l'arborescence des ressources
kubectl krew install top        # Métriques avancées
```

### Plugins Utiles
```bash
# kubectx et kubens (si installés)
kubectx                     # Lister les contextes
kubectx my-context          # Changer de contexte
kubens                      # Lister les namespaces
kubens my-namespace         # Changer de namespace

# Avec les plugins krew
kubectl ctx                 # Équivalent à kubectx
kubectl ns                  # Équivalent à kubens
kubectl tree deployment my-deployment  # Voir l'arborescence
```

## Automatisation et Scripts

### Scripts Utiles
```bash
#!/bin/bash
# Script pour surveiller les pods en erreur
watch_failed_pods() {
    while true; do
        echo "=== Failed Pods - $(date) ==="
        kubectl get pods --all-namespaces --field-selector=status.phase=Failed
        echo
        sleep 30
    done
}

# Fonction pour nettoyer les pods terminés
cleanup_completed_pods() {
    kubectl get pods --all-namespaces --field-selector=status.phase=Succeeded -o name | xargs -r kubectl delete
}

# Obtenir les pods consommant le plus de CPU
top_cpu_pods() {
    kubectl top pods --all-namespaces --sort-by=cpu | head -20
}

# Obtenir les images utilisées dans le cluster
get_all_images() {
    kubectl get pods --all-namespaces -o jsonpath='{.items[*].spec.containers[*].image}' | tr ' ' '\n' | sort -u
}
```

### Alias Pratiques
```bash
# Alias de base
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kdp='kubectl describe pod'
alias kds='kubectl describe service'
alias kdd='kubectl describe deployment'
alias kaf='kubectl apply -f'
alias kdel='kubectl delete'
alias kex='kubectl exec -it'
alias klog='kubectl logs -f'

# Alias avancés
alias kgpall='kubectl get pods --all-namespaces'
alias kgpw='kubectl get pods -w'
alias kgsw='kubectl get services -w'
alias ktop='kubectl top'
alias kctx='kubectl config current-context'
alias kns='kubectl config view --minify --output "jsonpath={..namespace}"'

# Fonction pour pods par node
pods_by_node() {
    kubectl get pods --all-namespaces -o wide --field-selector spec.nodeName=$1
}
```

## Troubleshooting Courant

### Problèmes Fréquents et Solutions
```bash
# 1. Pod en état Pending
kubectl describe pod <pod-name>
# Chercher : Insufficient resources, taints, node selectors

# 2. Pod en CrashLoopBackOff
kubectl logs <pod-name> --previous
kubectl describe pod <pod-name>
# Vérifier : liveness probe, resources, permissions

# 3. Service inaccessible
kubectl get endpoints <service-name>
kubectl describe service <service-name>
# Vérifier : selector labels, target port

# 4. Problèmes de réseau
kubectl run test-pod --image=busybox -it --rm -- nslookup kubernetes.default
kubectl run test-pod --image=busybox -it --rm -- ping <pod-ip>

# 5. Permissions RBAC
kubectl auth can-i <verb> <resource> --as=<user>
kubectl get rolebindings,clusterrolebindings --all-namespaces | grep <user>

# 6. Ressources insuffisantes
kubectl top nodes
kubectl describe node <node-name>
kubectl get events --sort-by=.metadata.creationTimestamp
```

### Commandes de Debug d'Urgence
```bash
# Pods en erreur
kubectl get pods --all-namespaces --field-selector=status.phase!=Running,status.phase!=Succeeded

# Événements récents
kubectl get events --sort-by=.metadata.creationTimestamp --all-namespaces | tail -20

# Noeuds en problème
kubectl get nodes --no-headers | awk '$2 != "Ready" { print $1 }'

# Ressources consommant le plus
kubectl top pods --all-namespaces --sort-by=cpu | head -10
kubectl top pods --all-namespaces --sort-by=memory | head -10

# Services sans endpoints
kubectl get endpoints --all-namespaces | awk 'NF==2 && $2=="" { print $1 }'
```

## Ressources et Documentation

### Liens Utiles
- **Documentation officielle** : https://kubernetes.io/docs/reference/kubectl/
- **Cheat Sheet officiel** : https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- **Reference API** : https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands
- **JSONPath Guide** : https://kubernetes.io/docs/reference/kubectl/jsonpath/
- **Krew Plugin Manager** : https://krew.sigs.k8s.io/

### Types de Ressources Kubernetes
```bash
# Voir tous les types de ressources disponibles
kubectl api-resources

# Ressources par groupe d'API
kubectl api-resources --api-group=apps
kubectl api-resources --namespaced=true
kubectl api-resources --namespaced=false

# Versions d'API
kubectl api-versions
```

---

*Cette documentation kubectl couvre les commandes essentielles et avancées pour gérer efficacement vos clusters Kubernetes. Maîtriser ces commandes vous permettra d'être plus productif dans vos tâches quotidiennes d'administration Kubernetes.*