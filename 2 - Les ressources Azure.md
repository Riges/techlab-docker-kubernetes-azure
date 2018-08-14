# Etape 2 - Les ressources Azure

Maintenant que l'application est prête, il nous faut finir de deployer l'infrastructure

## Container Registry

### Création de la registry

Afin de permettre d'heberger vos images en dehors de votre ordinateur, sans pour autant les mettre sur le docker hub (registry public par defaut de docker), nous allons créer une registry. Nous utiliserons donc la commande **acr create**, la nommerons **soatTechlabRegistry** et nous choisirons le tarif **Basic**. Ce qui devrait donner `az acr create --resource-group soat-techlab --name soatTechlabRegistry --location westeurope --sku Basic` et un retour de succès comme :

```sh
> az acr create --resource-group soat-techlab --name soatTechlabRegistry --location westeurope --sku Basic
{
  "adminUserEnabled": false,
  "creationDate": "2018-07-03T12:25:07.846642+00:00",
  "id": "/subscriptions/1c732489-346b-4a9a-a417-4f09c23378a7/resourceGroups/soat-techlab/providers/Microsoft.ContainerRegistry/registries/soatTechlabRegistry",
  "location": "westeurope",
  "loginServer": "soattechlabregistry.azurecr.io",
  "name": "soatTechlabRegistry",
  "provisioningState": "Succeeded",
  "resourceGroup": "soat-techlab",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

### Identification

Avant de pouvoir envoyer des images dans la registry, il faut s'y connecter pour avoir les credentials. Pour cela, nous utiliserons la commande `az acr login --name soatTechlabRegistry`.

```sh
> az acr login --name soatTechlabRegistry
Login Succeeded
```

### Envoyer les images

Pour pouvoir envoyer les images sur le registry il nous faut l'url d'accès du répository, qui devrait normalement être pour cet exemple _**soattechlabregistry**.azurecr.io_. Mais afin d'en avoir la certitude vous pouvez faire :

`az acr list --resource-group soat-techlab --query "[].{acrLoginServer:loginServer}" --output table`

```sh
> az acr list --resource-group soat-techlab --query "[].{acrLoginServer:loginServer}" --output table
AcrLoginServer
------------------------------
soattechlabregistry.azurecr.io
```

Avec cet url, vous pourrez tagger et pousser sur vos images sur le repository en utilisant les commandes **tag** et **push** de docker. Pour les **tagger** il faut suivre la nomenclature **SERVEUR/NOM-DE-L-IMAGE:NUMEROS-DE-VERSION**, ce qui pour le cas de **lab-survey-front** et **lab-survey-api** donnerait _soattechlabregistry.azurecr.io/lab-survey-front:1.0_ et _soattechlabregistry.azurecr.io/lab-survey-api:1.0_. La commande donnerait donc `docker tag lab-survey-front soattechlabregistry.azurecr.io/lab-survey-front:1.0` et `docker tag lab-survey-api soattechlabregistry.azurecr.io/lab-survey-api:1.0`

```sh
> docker tag lab-survey-front soattechlabregistry.azurecr.io/lab-survey-front:1.0
  docker tag lab-survey-api soattechlabregistry.azurecr.io/lab-survey-api:1.0
```

Après, il vous suffit de **push** les images en se servant de leurs tags. Cela devrait être `docker push lab-survey-front soattechlabregistry.azurecr.io/lab-survey-front:1.0` et `docker push soattechlabregistry.azurecr.io/lab-survey-api:1.0`.

```sh
> docker push soattechlabregistry.azurecr.io/lab-survey-front:1.0
The push refers to repository [soattechlabregistry.azurecr.io/lab-survey-front]
c93118a949a1: Pushed
951c1d7bace7: Pushed
91295ee17337: Pushed
423678709065: Pushed
cd7100a72410: Pushed
1.0: digest: sha256:66409c7f857ced72396c856267ec46f411a948b8a831a83a6394c6c5c70fa506 size: 1364

> docker push soattechlabregistry.azurecr.io/lab-survey-api:1.0
The push refers to repository [soattechlabregistry.azurecr.io/lab-survey-api]
3df8aa90098e: Pushed
afb1a159c90a: Pushed
977b5e8acdb8: Pushed
84624cc68e71: Pushed
cd7100a72410: Mounted from lab-survey-front
1.0: digest: sha256:7c128219c574abc97f55edcd60a01208db2261f2172fd20e9e4b5a26f87fe7ab size: 1367
```

Si tout fonctionne bien, elles devraient être dans la registry, mais vérifions donc en utilisant la commande `az acr repository list --name soatTechlabRegistry --output table`.

```sh
> az acr repository list --name soatTechlabRegistry --output table
Result
----------------
lab-survey-api
lab-survey-front
```

## Préparation du cluster

Normalement vous aurez crée le cluster à l'étape 0, et il devrait etre fini d'être crée.

### Connecter Kubernetes à la regitry

Pour commencer, il faut pouvoir manager les accès au container registry, et pour cela, il faudra lancer une fonction **update** en précisant le nom de la registre, **soatTechlabRegistry**, avec le paramètre **--admin-enabled true**

`az acr update -n soatTechlabRegistry --admin-enabled true`

```sh
> az acr update -n soatTechlabRegistry --admin-enabled true
{
  "adminUserEnabled": true,
  "creationDate": "2018-07-03T12:25:07.846642+00:00",
  "id": "/subscriptions/1c732489-346b-4a9a-a417-4f09c23378a7/resourceGroups/soat-techlab/providers/Microsoft.ContainerRegistry/registries/soatTechlabRegistry",
  "location": "westeurope",
  "loginServer": "soattechlabregistry.azurecr.io",
  "name": "soatTechlabRegistry",
  "provisioningState": "Succeeded",
  "resourceGroup": "soat-techlab",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

Une fois cela fait, on va récupérer les informations grâce à la fonction **credential show** avec comme paramètre une **query** permettant de récupérer le mot de passe.

`az acr credential show --name soatTechlabRegistry --query "passwords[0].value"`

```sh
> az acr credential show --name soatTechlabRegistry --query "passwords[0].value"
"lEZoNEzmBPVo+gBV49KAdhL1J3GgXA3="
```

> #### Information
>
> Vous auriez aussi pu le faire depuis le [portail Azure](https://portal.azure.com) en vous rendant sur le container registry puis accès keys. Depuis cet écran, vous pouvez créer l'accès admin et récupérer le username et password.
> ![azure container registry access keys](assets/etape2-acr-credential.png)

Maintenant que nous avons récupéré cela, il faut créer un **secret** de type **docker-registry** sur kubernetes et pour se faire nous utiliserons la commande suivante `kubectl create secret docker-registry azureregistry --docker-server=soattechlabregistry.azurecr.io --docker-username=soatTechlabRegistry --docker-password=7SxBNJzDADv5GwT4suPZQBH1l/v0gHTy --docker-email=techlabsoat@yopmail.com`

```sh
$ kubectl create secret docker-registry azureregistry --docker-server=soattechlabregistry.azurecr.io --docker-username=soatTechlabRegistry --docker-password=7SxBNJzDADv5GwT4suPZQBH1l/v0gHTy --docker-email=techlabsoat@yopmail.com
secret "azureregistry" created
```

### HELM

Helm est un outil qui va vous aider à gérer vos applications Kubernetes, voyer cela comme un gestionnaire de paquet. Grâce à sa notion de _chart_, fonctionnant comme des packages pouvant être centralisé sur un repository afin d'être plus facilement partagé, vous pouvez définir votre application ainsi que l'installer et la mettre à jour plus facilement. A cette étape du techlab nous nous en servirons pour déployer des ressources que nous n'aurons pas développer, comme l'ingress nginx.

Avant de commencer, il faut s'assurer qu'Helm est bien initaliser pour notre cluster. Pour ce faire, nous utiliserons la commade `helm init`.

```sh
> helm init
$HELM_HOME has been configured at C:\Users\Riges\.helm.

Tiller (the Helm server-side component) has been installed into your Kubernetes Cluster.

Please note: by default, Tiller is deployed with an insecure 'allow unauthenticated users' policy.
For more information on securing your installation see: https://docs.helm.sh/using_helm/#securing-your-helm-installation
Happy Helming!
```

Après on vérifie que la version que nous avons est la même que celle du serveur grâce à la commande `helm version`. En cas de versions différentes, vous pouvez faire `helm init --upgrade` afin d'y remédier.

```sh
> helm init --upgrade
$HELM_HOME has been configured at C:\Users\Riges\.helm.

Tiller (the Helm server-side component) has been upgraded to the current version.
Happy Helming!
```

## La suite

Pour continuer, je vous invite à rejoindre l'étape 2 <a href="./3 - Deployer l'application sur le Cluster.md">Deployer l'application sur le Cluster</a>
