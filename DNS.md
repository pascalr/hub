Ne fonctionnais pas tant bien, je n'ai pas voulu passer plus de temps, j'ai arrêter ça.

Instructions pour configurer un DNS local pour accéder facilement au hub. Pouvoir donner un surnom qu'on met dans le navigateur accessible à partir du réseau local.

Ubuntu utilise systemd-resolved par défaut pour le DNS. Il faut l'enlever en premier pour éviter des conflits.

```
sudo systemctl stop systemd-resolved
sudo systemctl disable systemd-resolved
sudo systemctl mask systemd-resolved
```

Pour revenir en arrière au besoin, il faut faire l'inverse.


```
sudo systemctl unmask systemd-resolved
sudo systemctl enable systemd-resolved
sudo systemctl start systemd-resolved
```

On peut maintenant installer dnsmasq qui va résoudre les requetes DNS et nous permet de rajouter des addresses locales.

`sudo apt install dnsmasq`

Ne fonctionne pas parce que systemd-resolved utilise déjà le port 53. Pour désactiver faire:

Il faut rajouter le lien en modifiant /etc/dnsmasq.conf pour pointer vers la bonne addresse:

`address=/hub/192.168.0.XXX`

Il faut ensuite redémarrer le serveur dnsmasq.

sudo systemctl restart dnsmasq

Il faut ensuite configurer le router.

Il faut réserver l'adresse IP du serveur pour ne plus qu'elle change.

Il faut ajouter l'addresse IP du serveur qui a le nouveau serveur DNS comme DNS 2.

J'ai rajouté aussi un port forwarding de 80 vers 8000. On dirait qu'il faut être root pour 80.
