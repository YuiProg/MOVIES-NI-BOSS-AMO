export const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="100%" height="100%" fill="#1d232c"/></svg>`
  );

export const PLACEHOLDER_PROFILE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="#1d232c"/></svg>`
  );

export const posterUrl = (p) => (p ? `https://image.tmdb.org/t/p/w342${p}` : PLACEHOLDER);
export const backdropUrl = (p) => (p ? `https://image.tmdb.org/t/p/w1280${p}` : '');
export const profileUrl = (p) => (p ? `https://image.tmdb.org/t/p/w185${p}` : PLACEHOLDER_PROFILE);
