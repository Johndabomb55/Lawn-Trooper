{pkgs}: {
  deps = [
    pkgs.at-spi2-core
    pkgs.gtk3
    pkgs.cairo
    pkgs.pango
    pkgs.xorg.libXrandr
    pkgs.xorg.libXfixes
    pkgs.xorg.libXext
    pkgs.xorg.libXdamage
    pkgs.xorg.libXcomposite
    pkgs.xorg.libxcb
    pkgs.xorg.libX11
    pkgs.expat
    pkgs.dbus
    pkgs.libdrm
    pkgs.mesa
    pkgs.alsa-lib
    pkgs.libxkbcommon
    pkgs.cups
    pkgs.at-spi2-atk
    pkgs.atk
    pkgs.nspr
    pkgs.nss
    pkgs.glib
  ];
}
