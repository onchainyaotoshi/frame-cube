{ pkgs }: {
  deps = [
    pkgs.postgresql
    pkgs.vim
    pkgs.openssh
    pkgs.nodejs_18
    pkgs.python310Full

    #for node-gyp (build-essential)
    pkgs.stdenv.cc.cc
    pkgs.gcc
    pkgs.gnumake

    #for gl & canvas
    pkgs.pkgconfig

    #for gl
    pkgs.mesa
    pkgs.mesa_glu
    pkgs.glew
    pkgs.xorg.libXi
    pkgs.xorg.libX11

    #for canvas 
    pkgs.cairo
    pkgs.pango
    pkgs.libjpeg
    pkgs.giflib
    pkgs.librsvg
    pkgs.libuuid
    # Add other dependencies here
  ];

  #https://github.com/Automattic/node-canvas/issues/1893#issuecomment-1096988007
  env = { 
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid];    
  }; 
}