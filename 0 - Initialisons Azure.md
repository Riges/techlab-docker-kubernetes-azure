# Etape 0 - Initialisons Azure ... car cela prend du temps 💤

La création de cluster AKS pouvant mettre entre 10 et 20 minutes, nous allons créer le cluster en avance de phase en utilisant Azure Cli.

## Login

Pour interargir avec votre souscription Azure, il faut vous identifier dans azure cli. Pour cela, nous tapperons la commande `az login`

```sh
> az login
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code CW36ZK6Q3 to authenticate.
[
  {
    "cloudName": "AzureCloud",
    "id": "8f4fa8e1-bce7-418f-832b-1da3d150acaf",
    "isDefault": true,
    "name": "SoCloudSandbox",
    "state": "Enabled",
    "tenantId": "1c732489-346b-4a9a-a417-4f09c23378a7",
    "user": {
      "name": "luc.fasquelle@soat.fr",
      "type": "user"
    }
  }
]
```

## Resource groupe

Afin de centraliser les ressources crées lors de ce Techlabs, nous créerons une ressource groupe nommée, par exemple, **soat-techlab** dans la region **west europe** (comme tout le reste de nos ressources). On obtient alors la ressource suivante `az group create --name soat-techlab --location westeurope`. Ce qui nous donne :

```sh
> az group create --name soat-techlab --location westeurope
{
  "id": "/subscriptions/1c732489-346b-4a9a-a417-4f09c23378a7/resourceGroups/soat-techlab",
  "location": "westeurope",
  "managedBy": null,
  "name": "soat-techlab",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Cluster Kubernetes

### Création du cluster

La commande sur Azure Cli permettant d'intéragir avec des cluster Kubernetes est **aks** et plus précisément **aks create**, si on veut créer un cluster. On le nommera, par exemple, **soatTechlabCluster**. On voudra **un** node **Standard A1 v2** car il s'agit d'un cluster de test donc pas besoin de voir trop grand. Pour notre soirée, nous éviterons de complexifier avec la création d'RBAC en lien avec Azure, donc nous ajouterons le paramètre **--disable-rbac** et nous utiliserons une clef ssh générée avec le paramètre **--generate-ssh-keys**.

`az aks create --resource-group soat-techlab --name soatTechlabCluster --node-count 1 --node-vm-size Standard_A1_v2 --disable-rbac --generate-ssh-keys`

La commande suivante est celle prenant du temps, donc je vous invite à la lancer et de passer à la suite tout en surveillant son avancée.

```sh
> az aks create --resource-group soat-techlab --name soatTechlabCluster --node-count 1 --node-vm-size Standard_A1_v2 --disable-rbac --generate-ssh-keys
{
  "aadProfile": null,
  "addonProfiles": null,
  "agentPoolProfiles": [
    {
      "count": 1,
      "dnsPrefix": null,
      "fqdn": null,
      "maxPods": 110,
      "name": "nodepool1",
      "osDiskSizeGb": null,
      "osType": "Linux",
      "ports": null,
      "storageProfile": "ManagedDisks",
      "vmSize": "Standard_A1_v2",
      "vnetSubnetId": null
    }
  ],
  "dnsPrefix": "soatTechla-soat-techlab-8f4fa8",
  "enableRbac": false,
  "fqdn": "soattechla-soat-techlab-8f4fa8-224644c9.hcp.westeurope.azmk8s.io",
  "id": "/subscriptions/1c732489-346b-4a9a-a417-4f09c23378a7/resourceGroups/soat-techlab/providers/Microsoft.ContainerService/managedClusters/soatTechlabCluster",
  "kubernetesVersion": "1.9.9",
  "linuxProfile": {
    "adminUsername": "azureuser",
    "ssh": {
      "publicKeys": [
        {
          "keyData": "..."
        }
      ]
    }
  },
  "location": "westeurope",
  "name": "soatTechlabCluster",
  "networkProfile": {
    "dnsServiceIp": "10.0.0.10",
    "dockerBridgeCidr": "172.17.0.1/16",
    "networkPlugin": "kubenet",
    "networkPolicy": null,
    "podCidr": "10.244.0.0/16",
    "serviceCidr": "10.0.0.0/16"
  },
  "nodeResourceGroup": "MC_soat-techlab_soatTechlabCluster_westeurope",
  "provisioningState": "Succeeded",
  "resourceGroup": "soat-techlab",
  "servicePrincipalProfile": {
    "clientId": "54e7ec3f-e4bc-4249-895c-9eed12de6907",
    "keyVaultSecretRef": null,
    "secret": null
  },
  "tags": null,
  "type": "Microsoft.ContainerService/ManagedClusters"
}
```

Maintenant, nous allons récupérer les credentials pour réaliser la suite. Pour ce faire, nous utiliserons la commande **aks get-credentials** en précisant la ressource groupe et le nom du cluster.

`az aks get-credentials --resource-group soat-techlab --name soatTechlabCluster`

```sh
> az aks get-credentials --resource-group soat-techlab --name soatTechlabCluster
Merged "soatTechlabCluster" as current context in C:\Users\Riges\.kube\config
```

Une fois l'opération réalisée, nous pourrons donc maintenant utiliser **kubetctl** qui est l'outil permettant de gérer son cluster kubernetes en ligne de commande. Pour connaitre l'information sur les noeuds, ce sont les vm dans le cluster, il faut utiliser la commande `kubectl get nodes`.

```sh
> kubectl get nodes
NAME                       STATUS    ROLES     AGE       VERSION
aks-nodepool1-49289993-0   Ready     agent     11m       v1.9.9
```

> #### Information
>
> Si vous voulez visualiser et manager les pods , les nodes du cluster, ainsi que les ressources en cours d'utilisation vous pouvez lancer l'application Kubernetes Dashbord qui est un exemple d'interface web fournis par l'équipe du projet. Pour Azure, vous avez la possibilité d'utiliser celle fournie grâce aux commandes d'Azure cli : `az aks browse --resource-group soat-techlab --name soatTechlabCluster`

### Bonus Mise à jour du cluster

Cette étape n'est normalement pas nécessaire, mais si vous souhaitez mettre à jour votre cluster sans provoquer un arrêt total de celui-ci il y a une procédure de rolling-update sur Azure. Il faut commencer par connaitre les migrations possible sur votre cluster en lançant la commande **get-versions**.

`az aks get-versions --location westeurope --output table`

```sh
> az aks get-versions --location westeurope --output table
KubernetesVersion    Upgrades
-------------------  ---------------------------------------------------------------------------------
1.10.5               None available
1.10.3               1.10.5
1.9.9                1.10.3, 1.10.5
1.9.6                1.9.9, 1.10.3, 1.10.5
1.9.2                1.9.6, 1.9.9, 1.10.3, 1.10.5
1.9.1                1.9.2, 1.9.6, 1.9.9, 1.10.3, 1.10.5
1.8.14               1.9.1, 1.9.2, 1.9.6, 1.9.9
1.8.11               1.8.14, 1.9.1, 1.9.2, 1.9.6, 1.9.9
1.8.10               1.8.11, 1.8.14, 1.9.1, 1.9.2, 1.9.6, 1.9.9
1.8.7                1.8.10, 1.8.11, 1.8.14, 1.9.1, 1.9.2, 1.9.6, 1.9.9
1.8.6                1.8.7, 1.8.10, 1.8.11, 1.8.14, 1.9.1, 1.9.2, 1.9.6, 1.9.9
1.8.2                1.8.6, 1.8.7, 1.8.10, 1.8.11, 1.8.14, 1.9.1, 1.9.2, 1.9.6, 1.9.9
1.8.1                1.8.2, 1.8.6, 1.8.7, 1.8.10, 1.8.11, 1.8.14, 1.9.1, 1.9.2, 1.9.6, 1.9.9
1.7.16               1.8.1, 1.8.2, 1.8.6, 1.8.7, 1.8.10, 1.8.11, 1.8.14
1.7.15               1.7.16, 1.8.1, 1.8.2, 1.8.6, 1.8.7, 1.8.10, 1.8.11, 1.8.14
1.7.12               1.7.15, 1.7.16, 1.8.1, 1.8.2, 1.8.6, 1.8.7, 1.8.10, 1.8.11, 1.8.14
1.7.9                1.7.12, 1.7.15, 1.7.16, 1.8.1, 1.8.2, 1.8.6, 1.8.7, 1.8.10, 1.8.11, 1.8.14
1.7.7                1.7.9, 1.7.12, 1.7.15, 1.7.16, 1.8.1, 1.8.2, 1.8.6, 1.8.7, 1.8.10, 1.8.11, 1.8.14
```

Au vu de retour de notre commande `kubectl get nodes` nous somment en **1.9.9** donc nous pouvons migré sur la 1.10.5. Pour cela nous utiliserons la function **upgrade** et son paramètre **--kubernetes-version** : `az aks upgrade --resource-group soat-techlab --name soatTechlabCluster --kubernetes-version 1.10.5`

```sh
> az aks upgrade --resource-group soat-techlab --name soatTechlabCluster --kubernetes-version 1.10.5
Kubernetes may be unavailable during cluster upgrades.
Are you sure you want to perform this operation? (y/n): Y
{
  "aadProfile": null,
  "addonProfiles": null,
  "agentPoolProfiles": [
    {
      "count": 1,
      "dnsPrefix": null,
      "fqdn": null,
      "maxPods": 110,
      "name": "nodepool1",
      "osDiskSizeGb": null,
      "osType": "Linux",
      "ports": null,
      "storageProfile": "ManagedDisks",
      "vmSize": "Standard_A1_v2",
      "vnetSubnetId": null
    }
  ],
  "dnsPrefix": "soatTechla-soat-techlab-8f4fa8",
  "enableRbac": false,
  "fqdn": "soattechla-soat-techlab-8f4fa8-224644c9.hcp.westeurope.azmk8s.io",
  "id": "/subscriptions/1c732489-346b-4a9a-a417-4f09c23378a7/resourceGroups/soat-techlab/providers/Microsoft.ContainerService/managedClusters/soatTechlabCluster",
  "kubernetesVersion": "1.10.5",
  "linuxProfile": {
    "adminUsername": "azureuser",
    "ssh": {
      "publicKeys": [
        {
          "keyData": "..."
        }
      ]
    }
  },
  "location": "westeurope",
  "name": "soatTechlabCluster",
  "networkProfile": {
    "dnsServiceIp": "10.0.0.10",
    "dockerBridgeCidr": "172.17.0.1/16",
    "networkPlugin": "kubenet",
    "networkPolicy": null,
    "podCidr": "10.244.0.0/16",
    "serviceCidr": "10.0.0.0/16"
  },
  "nodeResourceGroup": "MC_soat-techlab_soatTechlabCluster_westeurope",
  "provisioningState": "Succeeded",
  "resourceGroup": "soat-techlab",
  "servicePrincipalProfile": {
    "clientId": "54e7ec3f-e4bc-4249-895c-9eed12de6907",
    "keyVaultSecretRef": null,
    "secret": null
  },
  "tags": null,
  "type": "Microsoft.ContainerService/ManagedClusters"
}
```

Pour vérifier que tout fonctionne, vous pouvez utiliser la function **show**.

`az aks show --resource-group soat-techlab --name soatTechlabCluster --output table`

```sh
> az aks show --resource-group soat-techlab --name soatTechlabCluster --output table
Name                Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
------------------  ----------  ---------------  -------------------  -------------------  ----------------------------------------------------------------
soatTechlabCluster  westeurope  soat-techlab     1.10.5               Succeeded            soattechla-soat-techlab-8f4fa8-224644c9.hcp.westeurope.azmk8s.io
```

Vous pourriez aussi tout aussi bien vérifier par la commande `kubectl get nodes`

```sh
> kubectl get nodes
NAME                       STATUS    ROLES     AGE       VERSION
aks-nodepool1-49289993-1   Ready     agent     9m        v1.10.5
```

## La suite

Pour continuer je vous invite à rejoindre l'étape 1 <a href="./1 - Build de l'image et test local sur docker.md">Build de l'image et test local sur docker</a>
