# Techlab docker et kubernetes sur Azure : Déployé vos premiers pods sur Azure

Dans la lignée du précédent Techlab, nous allons voir comment déployer l'application dans Azure. Lors de ce Techlab nous reverrons la création des conteneurs **docker**, la création de l'infrastructure sur **Azure** (_Azure Registrey_ + _Azure Containeur Service_ avec l'orchestrateur **Kubernetes**), le déploiement des conteneurs avec la mise en place d'_ingress_, ainsi qu'un aperçu d'**Helm**.

## Prérequis 🏗️

- Un compte Azure avec une souscription active. Si vous n'en avez pas vous pouvez créer un compte gratuit à cette adresse [https://azure.microsoft.com/fr-fr/free](https://azure.microsoft.com/fr-fr/free/)
- Docker sur Linux directement ou Docker for windows/mac (version 18.03.1-ce-win65, build 17513) disponible sur le channel stable.
- [Azure Cli](https://docs.microsoft.com/fr-fr/cli/azure/install-azure-cli?view=azure-cli-latest) (version 2.0.45)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl) (version >= 1.9.6)
- [helm](https://helm.sh/) (version 2.9.1) [lien pour le téléchargement](https://github.com/kubernetes/helm/releases/tag/v2.9.1)

## Étapes 🏭

<ul>
  <li><a href="./0 - Initialisons Azure.md">Initialisons Azure ... car cela prend du temps 💤</a></li>
  <li><a href="./1 - Build de l'image et test local sur docker.md">Build de l'image et test local sur docker</a></li>
  <li><a href="./2 - Les ressources Azure.md">Les ressources Azure</a></li>
  <li><a href="./3 - Deployer l'application sur le Cluster.md">Deployer l'application sur le Cluster</a></li>
</ul>
