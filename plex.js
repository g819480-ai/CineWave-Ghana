const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers }
  });

function getConfig(env) {
  const base = String(env.PLEX_URL || "").trim().replace(/\/+$/, "");
  const token = String(env.PLEX_TOKEN || "").trim();

  if (!base || !token) {
    return {
      error: json({
        error: "Plex is not connected. Set PLEX_URL and PLEX_TOKEN as Cloudflare Worker secrets."
      }, 503)
    };
  }

  let parsed;
  try {
    parsed = new URL(base);
  } catch {
    return { error: json({ error: "PLEX_URL must be a valid HTTPS URL." }, 503) };
  }

  if (parsed.protocol !== "https:") {
    return {
      error: json({
        error: "PLEX_URL must use HTTPS to protect your Plex token."
      }, 503)
    };
  }

  return {
    base,
    token,
    clientId: String(env.PLEX_CLIENT_ID || "noctura-cloudflare-client")
  };
}

async function plexFetch(cfg, path, requestHeaders = {}, method = "GET") {
  const target = new URL(path, cfg.base);
  const headers = new Headers(requestHeaders);

  headers.set("Accept", "application/json");
  headers.set("X-Plex-Token", cfg.token);
  headers.set("X-Plex-Client-Identifier", cfg.clientId);
  headers.set("X-Plex-Product", "NOCTURA");
  headers.set("X-Plex-Version", "1.0.0");

  return fetch(target.toString(), {
    method,
    headers,
    redirect: "follow"
  });
}

async function plexJson(cfg, path) {
  const response = await plexFetch(cfg, path);
  if (!response.ok) throw new Error(`Plex returned HTTP ${response.status}.`);
  return response.json();
}

function mediaContainer(data) {
  return data?.MediaContainer || data?.mediaContainer || {};
}

function listEntries(data) {
  const c = mediaContainer(data);
  return [...(c.Metadata || []), ...(c.Directory || [])];
}

function toMovie(item) {
  const id = String(item.ratingKey || item.key || "");
  return {
    id,
    title: item.title || "Untitled",
    year: item.year || null,
    summary: item.summary || "",
    rating: item.contentRating || "",
    duration_ms: item.duration || null,
    type: item.type || "movie",
    genres: (item.Genre || []).map(g => g.tag).filter(Boolean),
    poster_url: item.thumb
      ? `/api/plex/movies/${encodeURIComponent(id)}/poster`
      : "",
    stream_url: `/api/plex/movies/${encodeURIComponent(id)}/play`,
    source: "Plex library"
  };
}

export async function handlePlexRequest(req, env) {
  const url = new URL(req.url);
  const path = url.pathname;

  if (!path.startsWith("/api/plex/")) return null;

  if (req.method !== "GET" && req.method !== "HEAD") {
    return json({ error: "Method not allowed." }, 405, { allow: "GET, HEAD" });
  }

  const cfg = getConfig(env);
  if (cfg.error) return cfg.error;

  try {
    if (path === "/api/plex/health") {
      const data = await plexJson(cfg, "/identity");
      const c = mediaContainer(data);
      return json({
        connected: true,
        server_name: c.friendlyName || c.machineIdentifier || "Plex Media Server",
        version: c.version || ""
      });
    }

    if (path === "/api/plex/sections") {
      const data = await plexJson(cfg, "/library/sections");
      return json({
        sections: listEntries(data).map(s => ({
          id: String(s.key || ""),
          title: s.title || "",
          type: s.type || ""
        }))
      });
    }

    if (path === "/api/plex/movies") {
      const sectionId = String(
        url.searchParams.get("section") || env.PLEX_MOVIE_SECTION_ID || ""
      );

      let items = [];

      if (sectionId) {
        if (!/^\d{1,8}$/.test(sectionId)) {
          return json({ error: "Invalid Plex section ID." }, 400);
        }

        const data = await plexJson(
          cfg,
          `/library/sections/${sectionId}/all?type=1`
        );
        items = listEntries(data);
      } else {
        const sections = listEntries(
          await plexJson(cfg, "/library/sections")
        ).filter(s => s.type === "movie");

        for (const section of sections) {
          const data = await plexJson(
            cfg,
            `/library/sections/${encodeURIComponent(section.key)}/all?type=1`
          );
          items.push(...listEntries(data));
        }
      }

      return json({
        movies: items
          .filter(item => item.type === "movie" || !item.type)
          .map(toMovie)
      });
    }

    if (path === "/api/plex/search") {
      const query = (url.searchParams.get("q") || "").trim();
      if (query.length < 2) return json({ movies: [] });

      const data = await plexJson(
        cfg,
        `/hubs/search?query=${encodeURIComponent(query)}&type=1`
      );
      const hubs = mediaContainer(data).Hub || [];
      const items = hubs.flatMap(hub => hub.Metadata || []);

      return json({ movies: items.map(toMovie) });
    }

    const posterMatch = path.match(
      /^\/api\/plex\/movies\/([A-Za-z0-9_-]{1,40})\/poster$/
    );

    if (posterMatch) {
      const data = await plexJson(
        cfg,
        `/library/metadata/${posterMatch[1]}`
      );
      const item = listEntries(data)[0];

      if (!item?.thumb) return json({ error: "Poster not found." }, 404);

      const response = await plexFetch(
        cfg,
        item.thumb,
        {},
        req.method
      );

      if (!response.ok) {
        return json({ error: "Plex could not return this poster." }, response.status);
      }

      const headers = new Headers();
      headers.set("content-type", response.headers.get("content-type") || "image/jpeg");
      headers.set("cache-control", "public, max-age=3600");

      return new Response(req.method === "HEAD" ? null : response.body, {
        status: response.status,
        headers
      });
    }

    const playMatch = path.match(
      /^\/api\/plex\/movies\/([A-Za-z0-9_-]{1,40})\/play$/
    );

    if (playMatch) {
      const data = await plexJson(
        cfg,
        `/library/metadata/${playMatch[1]}`
      );
      const item = listEntries(data)[0];
      const part = item?.Media?.flatMap(media => media.Part || [])[0];

      if (!part?.key) {
        return json({
          error: "No playable media file was found for this Plex title."
        }, 404);
      }

      const forwardedHeaders = {};
      const range = req.headers.get("range");
      if (range) forwardedHeaders.Range = range;

      const response = await plexFetch(
        cfg,
        part.key,
        forwardedHeaders,
        req.method
      );

      if (!response.ok && response.status !== 206) {
        return json({
          error: `Plex playback failed with HTTP ${response.status}.`
        }, response.status);
      }

      const headers = new Headers();
      for (const name of [
        "content-type",
        "content-length",
        "content-range",
        "accept-ranges",
        "etag",
        "last-modified"
      ]) {
        const value = response.headers.get(name);
        if (value) headers.set(name, value);
      }

      headers.set("cache-control", "private, no-store");
      headers.set("x-content-type-options", "nosniff");

      return new Response(req.method === "HEAD" ? null : response.body, {
        status: response.status,
        headers
      });
    }

    const detailMatch = path.match(
      /^\/api\/plex\/movies\/([A-Za-z0-9_-]{1,40})$/
    );

    if (detailMatch) {
      const data = await plexJson(
        cfg,
        `/library/metadata/${detailMatch[1]}`
      );
      const item = listEntries(data)[0];

      return item
        ? json({ movie: toMovie(item) })
        : json({ error: "Movie not found in Plex." }, 404);
    }

    return json({ error: "Plex API route not found." }, 404);
  } catch (error) {
    return json({
      error: error?.message || "Plex request failed."
    }, 502);
  }
}
