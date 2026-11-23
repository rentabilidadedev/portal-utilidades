export default {
  fetch(request, env) {
    const url = new URL(request.url);

    if (url.protocol === "http:") {
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.href, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
