export default {
  parameter(name) {
    var params = {};

    // setInterval(() => {
      // console.log('Location', window.location, location.href);
    // }, 2000);

    if (location.search) {
      var parts = location.search.substring(1).split('&');

      for (var i = 0; i < parts.length; i++) {
        var nv = parts[i].split('=');
        if (!nv[0]) continue;
        params[nv[0]] = nv[1] || true;
      }
    }

    // console.log(params);
    return params[name];

    // const url = location.pathName;
    //
    // if (!url) {
    //   return '';
    // }
    // console.log(url);
    //
    // return /$name=([^&]+)/.exec(url)[1];
  }

}
