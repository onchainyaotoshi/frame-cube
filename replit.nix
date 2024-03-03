{ pkgs }: {
  
  deps = [
      pkgs.vim-full
      pkgs.pciutils
    pkgs.postgresql
    pkgs.nodejs_20
    pkgs.python310Full

    #for node-gyp (build-essential)
    pkgs.gcc
    pkgs.gnumake

    #for gl & canvas
    pkgs.pkg-config
    pkgs.xvfb-run
  
    #for gl node-gyp build
    pkgs.mesa
    pkgs.mesa-demos

    #for fix couldn't find RGB GLX visual or fbconfig when run this shell command: xvfb-run --auto-servernum -s "-ac -screen 0 1024x768x24" glxinfo

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