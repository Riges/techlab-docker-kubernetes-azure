## Error saving credentials: error storing credentials - err: exit status 1, out: `The stub received bad data.`

Dans le dossier %USERPROFILE%\\.docker\

Créer un fichier `config.json` si il existe pas, et ajouter cette section :

```json
{
  "auths": {
    "azurecr.io": {}
  }
}
```
