# https://askubuntu.com/questions/8252/how-to-launch-default-web-browser-from-the-terminal
function openUrl() {
  local URL="$1";
  xdg-open $URL || sensible-browser $URL || x-www-browser $URL || gnome-open $URL;
}

openUrl ./docs/index.html
