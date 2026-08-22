import PagedView from './PagedView.jsx';

export default function MoviesView() {
  return <PagedView title="Popular Movies" endpoint="/movie/popular" type="movie" />;
}
