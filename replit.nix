{ pkgs }: {
  deps = [
    pkgs.postgresql
    pkgs.nodejs_18
    pkgs.python310Full

    #for node-gyp (build-essential)
    pkgs.stdenv.cc.cc
    pkgs.gcc
    pkgs.gnumake

    #for gl & canvas
    pkgs.pkg-config
    pkgs.xvfb-run
  
    #for gl
    pkgs.mesa
    pkgs.libGLU
    pkgs.glew
    pkgs.xorg.libXi
    pkgs.xorg.libX11
    pkgs.xorg.libXext

    #for canvas 
    pkgs.cairo
    pkgs.pango
    pkgs.libjpeg
    pkgs.giflib
    pkgs.librsvg
    pkgs.libuuid
    pkgs.binutils
    # Add other dependencies here
  ];

  #https://github.com/Automattic/node-canvas/issues/1893#issuecomment-1096988007
  env = { 
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
      pkgs.libuuid
    ];
    PYTHONHOME = "${pkgs.python310Full}";
    PYTHONBIN = "${pkgs.python310Full}/bin/python3.10";
    LANG = "en_US.UTF-8";
  }; 
}